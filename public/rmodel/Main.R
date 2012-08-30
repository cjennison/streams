#!/usr/bin/env Rscript
setwd("whatever/")
library(MASS)
library(zoo)

#1) Receive input from user
#cat test_args.R | R --slave --args all your base
args <- commandArgs(TRUE)

mean_prcp_change_percent <- as.numeric(args[1])
var_prcp_change_percent <- as.numeric(args[2])
mean_temp_change_celsius <- as.numeric(args[3])

# mean_prcp_change_percent <- 1
# var_prcp_change_percent <- 1
# mean_temp_change_celsius <- 0

source("WEATHER_GENERATOR_WEB.r")
Stoc.Weather(mean_prcp_change_percent,var_prcp_change_percent,mean_temp_change_celsius)

coef_str <- matrix(c(17.9591113,18.8820565,19.0037266,18.9207433,
 8.5984435, 9.9418541, 8.9901715, 9.7464999, 
 0.7068154,  0.6790824,  0.7429935,  0.6796490,
 -0.1901492, -0.5812414, -0.4318731, -0.5826941),ncol=4,byrow=TRUE)

source("StreamTemperatureModel.r")
Stream.Temperature(coef_str)


parameters <- c(0.934, 350.2514, 0.0000014, 0.62498, 0.4623, -0.7021, 9.9952) #SCE

source("StreamFlowModel.R")
Stream.Flow(parameters)