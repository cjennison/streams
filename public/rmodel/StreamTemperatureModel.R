Stream.Temperature <- function(coef_str) {

coefs <- coef_str

## Extract simulated air temperature values for 2000-2080. 
### Projection of air temperature increase: DAILY
Stoc.Temp <- read.table("daily_stochastic_weather.txt", header=T)
Stoc.AveTemp <- (Stoc.Temp$TMIN+Stoc.Temp$TMAX)/2

## Use model to predict stream temperature values for 2000-2080
futureStrTemp <- as.data.frame(matrix(NA, nrow=length(Stoc.AveTemp), ncol=4))
names(futureStrTemp) <- c("WB","Jimmy","Mitchell","Obear")

for (i in 1:ncol(futureStrTemp)){
  futureStrTemp[,i] <- coefs[4,i]+(coefs[1,i]-coefs[4,i])/(1+exp((4*tan(coefs[3,i])/(coefs[1,i]-coefs[4,i]))*(coefs[2,i]-Stoc.AveTemp)))
}

futureStrTempFinal <- cbind(Stoc.Temp$YEAR, Stoc.Temp$MONTH, 
                            Stoc.Temp$DAY, futureStrTemp)
names(futureStrTempFinal) <- c("YEAR", "MONTH", "Day", "WB","Jimmy","Mitchell","Obear")

# save(futureStrTempFinal, file = "Future stream temp output.RData")
# write.table(futureStrTempFinal, file = "Future stream temp output.txt",
#             sep = ",", col.names = TRUE, qmethod = "double")
## "save" produces a smaller output file


########################################################################
## Calculating seasonal mean stream temperatures for population model ##
########################################################################
futureStrTempFinal$Season[futureStrTempFinal$MONTH == "1"] <- "4"  # winter
futureStrTempFinal$Season[futureStrTempFinal$MONTH == "2"] <- "4"
futureStrTempFinal$Season[futureStrTempFinal$MONTH == "3"] <- "4"
futureStrTempFinal$Season[futureStrTempFinal$MONTH == "4"] <- "1"  # spring
futureStrTempFinal$Season[futureStrTempFinal$MONTH == "5"] <- "1"
futureStrTempFinal$Season[futureStrTempFinal$MONTH == "6"] <- "2"  # summer
futureStrTempFinal$Season[futureStrTempFinal$MONTH == "7"] <- "2"
futureStrTempFinal$Season[futureStrTempFinal$MONTH == "8"] <- "2"
futureStrTempFinal$Season[futureStrTempFinal$MONTH == "9"] <- "3"  # fall
futureStrTempFinal$Season[futureStrTempFinal$MONTH == "10"] <- "3"
futureStrTempFinal$Season[futureStrTempFinal$MONTH == "11"] <- "3"
futureStrTempFinal$Season[futureStrTempFinal$MONTH == "12"] <- "4"

agg <- list(futureStrTempFinal[,1],futureStrTempFinal[,8])
tmp <- aggregate(futureStrTempFinal[,4],agg,mean)
mon.final <- array(NA,c(length(tmp[,1]),4))

for (i in 1:4) {
agg <- list(futureStrTempFinal[,1],futureStrTempFinal[,8])
tmp <- aggregate(futureStrTempFinal[,i+3],agg,mean)
mon.final[,i] <- tmp[order(tmp$Group.1,tmp$Group.2),3]
}

write.table(cbind(tmp[order(tmp$Group.1,tmp$Group.2),1],tmp[order(tmp$Group.1,tmp$Group.2),2],round(mon.final,2)),"seasonal_streamtemp.txt",row.names=FALSE,col.names=FALSE,quote=FALSE)
}