
library("rjson");
args <- commandArgs(trailingOnly = TRUE);


if(length(args)>0){
	para <-fromJSON(args)
	file_para<-0
	#--------------------
	#get data from save file	
	if(length(para$pre_runs)>0){
		runs<- para$pre_runs[[1]]

		path <- paste0("./",runs$user,"/",runs$scriptName,"/",runs$runId,".txt")
		
		file_para <- fromJSON(paste(readLines(path,warn=FALSE),collapse=""))#scan(path,txt), use warn=false, otherwise, there would be err because the file does not have an EOF mark.
		print(file_para)
	}
	#--------read a parameter "count" from input argument or from file---------------
	
	count<-0
	
	if(length(para$count)>0){
		count <-para$count
	}else {
		if(file_para$count)
			count <- file_para$count
	}
	count <-count+1
	#-------------------------------------------------------------------------------
	#output to file
	output_file <- paste0("./",para$user,"/",para$scriptName,"/",para$runId,".txt")
	#regex would be better
	jsonStr<-paste0('{\"user\":\"',para$user,'\",\"scriptName\":\"',para$scriptName,'\",\"runId\":',para$runId,",")
	#output data file path
	output_data <- ""
	jsonStr <-paste0(jsonStr,"\"count\":",count,"}")
	

	write(jsonStr,output_file)
#	sink(output_file)
#	cat(jsonStr)
#	sink()

	
}
