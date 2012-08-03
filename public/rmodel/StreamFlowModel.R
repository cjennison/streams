Stream.Flow <- function(parms) {
################################################################################################################################
#library(zoo)
#source("MetsABCDE.R") Not needed yet
source("Hargreaves.R")
GCMDays <- read.table("Days_For_ABCDE_GCM.txt",header=TRUE)
stoc.weather <- read.table("monthly_stochastic_weather.txt",header=TRUE)
calib_num <- length(stoc.weather$MONTH)
basin_coords <- c(-72.733087,42.394229)
basin_area <- 52

###Run just the ABCDE model with set parameters
parameters <- parms
#parameters <- c(0.934, 350.2514, 0.0000014, 0.62498, 0.4623, -0.7021, 9.9952) #SCE
#parameters <- c(0.965,300,0.15,0.8,0.4,-0.5,15) #Bayes eyeball
Sint <- 202.6 
Gint <- 73.4
Aint <- 28.3

ABCDE <- function(parameters,T,P,ET,Sint,Gint,Aint,calib_num) {
A <- array(0,calib_num)
S <- array(0,calib_num)
G <- array(0,calib_num)
y.hat <- array(0,calib_num)
Y <- array(0,calib_num)
W <- array(0,calib_num)
E <- array(0,calib_num)
mt <- array(0,calib_num)
Peff <- array(0,calib_num)
ETeff <- array(0,calib_num)
SNOW_FRAC <- array(0,calib_num)

a <- parameters[1]
b <- parameters[2]
c1 <- parameters[3]
d <- parameters[4]
e <- parameters[5]
f <- parameters[6]
dif <- parameters[7]

A[1] <- Aint
S[1] <- Sint
G[1] <- Gint
y.hat[1] <- 0
Y[1] <- 0
W[1] <- 0
E[1] <- 0
mt[1] <- 0
Peff[1] <- P[1]
ETeff[1] <- ET[1]

for (i in 2:calib_num){
#Snow Model
SNOW_FRAC[i] <- (f - T[i])/(dif)
if(T[i] >= (f-dif) && T[i] <= f){
mt[i] <- (A[i-1] + P[i]*SNOW_FRAC[i])*e*(1-SNOW_FRAC[i])
Peff[i] <- (P[i]*(1 - SNOW_FRAC[i]) + mt[i])
ETeff[i] <- 0
A[i] <- (A[i-1] + P[i]*SNOW_FRAC[i]) - mt[i]
} else if(T[i] > f) {
mt[i] <- A[i-1]
Peff[i] <- P[i]+mt[i]
ETeff[i] <- ET[i]
A[i] <- A[i-1] - mt[i]
} else {  #T[i] < (f-dif)
mt[i] <- 0
Peff[i] <- 0
ETeff[i] <- 0
A[i] <- A[i-1]+P[i]
}
#Begin ABCD Model
W[i] <- Peff[i] + S[i-1]
Y[i] <- (W[i]+b)/(2*a) - sqrt(((W[i]+b)/(2*a))^2-W[i]*b/a)
S[i] <- Y[i]*exp(-1*ETeff[i]/b)
E[i] <- Y[i]*(1-exp(-1*(ETeff[i]/b)))
G[i] <- (G[i-1] + c1*(W[i]-Y[i]))/(1+d)
y.hat[i] <- ((1-c1)*(W[i]-Y[i])+d*G[i])
}
return(y.hat)
}

###Generate Stochastic Flow
# stoc.doy <- seq(ISOdate(2000,1,1), by="day",length.out=length(stoc.weather$PRCP))
# MET <- array(0,c(972,4))
# MET[,1] <- aggregate(zoo(stoc.weather$TMAX,stoc.doy), as.yearmon, mean)-aggregate(zoo(stoc.weather$TMIN,stoc.doy), as.yearmon, mean)
# MET[,2] <- aggregate(zoo(stoc.weather$PRCP,stoc.doy), as.yearmon, sum)
# MET[,3] <- aggregate(zoo(stoc.weather$TAVG,stoc.doy), as.yearmon, mean)
# MET[,4] <- Hargreaves(MET[,3],MET[,1],basin_coords[2],GCMDays$Jday[601:1572],GCMDays$Days[601:1572])

MET <- array(0,c(calib_num,4))
MET[,1] <- stoc.weather$TMAX-stoc.weather$TMIN
MET[,2] <- stoc.weather$PRCP
MET[,3] <- stoc.weather$TAVG
MET[,4] <- Hargreaves(MET[,3],MET[,1],basin_coords[2],GCMDays$Jday[601:1572],GCMDays$Days[601:1572])

stoc.n <- 972
days <- GCMDays$Days[601:1572]

#we convert streamflow to mm
#this converts cubic feet per second to cubic millimeters per second
cfs_to_cmms <- 28316846.6
#this converts square miles to square millimeters
squaremi_to_sqmm <-  2589988110336
#this converts seconds to months
sec_to_month <- 86400*days


modflow <- ABCDE(parameters,MET[,3],MET[,2],MET[,4],Sint,Gint,Aint,stoc.n)
modflow.cfs <- modflow*1/cfs_to_cmms*(squaremi_to_sqmm)*1/sec_to_month*(basin_area)
modflow.westbrook <- 10.81/52*modflow.cfs
write.table(modflow.westbrook,"Monthly_Streamflow_Westbrook.txt",row.names=FALSE,quote=FALSE)

season.flow <- array(NA,c(972,4))
season.flow[,1] <- stoc.weather$MONTH
season.flow[,2] <- stoc.weather$YEAR
season.flow[,3] <- modflow.westbrook
season.flow[,4] <- seq(from=0,to=0,length=972)

loop.array <- array(0,c(12,2))
loop.array[,1] <- c(1,2,3,4,5,6,7,8,9,10,11,12)
loop.array[,2] <- c(4,4,4,1,1,2,2,2,3,3,3,4)

for (i in 1:12) {
season.flow[season.flow[,1] == loop.array[i,1],4] <- loop.array[i,2]  # winter
}

agg <-list(season.flow[,2],season.flow[,4])
tmp <- aggregate(season.flow,agg,mean)
seas.final <- cbind(tmp[order(tmp$Group.1,tmp$Group.2),1],tmp[order(tmp$Group.1,tmp$Group.2),2],tmp[order(tmp$Group.1,tmp$Group.2),5])
write.table(seas.final,"Seasonal_Streamflow_Westbrook.txt",row.names=FALSE,quote=FALSE)
}