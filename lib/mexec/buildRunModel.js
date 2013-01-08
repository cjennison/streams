var userConfig = require(__dirname+"/../users/users.js");
var models = {
	weather_generator: {
		idx: 0,
		dependency: ["basin"],
		param: ["change_precip_mean","change_precip_var","change_airtemp_mean"],
		output: []
	},
	streamFlowModel: {
		idx: 1,
		dependency: ["weather_generator"],
		param: [],
		output: []
	},
	streamTempertuareModel: {
		idx:2,
		denpendency:["weather_generator","streamFlowModel"],
		param: [],
		output: []
	},
	IPM_Model:{
		idx: 3,
		dependency: ["streamFlowModel"],
		param: ["spring_growth","spring_survival","spring_growth","spring_survival"],
		output: []
	}
};

var modelArray = ["weather_generator","streamFlowModel","streamTempertuareModel","IPM_Model"];

var buildWeather = function(reqInfo){
	
	if(weatherFlag){
		var run = {
			scriptName: weather_generator
		};
		run["change_precip_mean"] = reqInfo.change_precip_mean;
		run["change_precip_var"] = reqInfo.change_precip_var;
		run["change_airtemp_mean"] = reqInfo.change_airtemp_mean;
		return run;
	}else{
		return;
	}
};


/*
	info of a model in the reqInfo is supposed as follow:
	modelName1_para1: xxxx,
	modelName1_para2: xxxx,
	.....
	modelName1_para?: xxxx,

	modelName-dependedModel1: path1,
	modelName-dependedModel2: path2,
	......
*/
var buildARun = function(reqInfo,modelName,user){
	var run = {
			scriptName: modelName
	};
	var params = models[modelName].param;
	for(var i=0;i<params.length;i++){
		run[params[i]] = reqInfo[param[i]];
	}
	var depend = models[modeName].dependency;
	if(depend.length>0){
		run.depend=[];
		for(i=0;i<depend.length;i++){
			run.depend.push(user.getARun(depend[i],reqInfo[modelName+'-'+depend[i]]));	// get dependency directory.
		}
	}
	return run;
};



var buildRuns = function(reqInfo, user){
	var runs = [];
	for(var i = 0; i<modelArray.length; i++){
		if(reqInfo[modelArray[i]+"-flag"]){
			runs.push(buildARun(reqInfo, modelArray[i],user));
		}
	}
	return runs;
};