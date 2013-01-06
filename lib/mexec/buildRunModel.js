var userConfig = require(__dirname+"/../users/users.js");
var models = {
	weather_generator: {
		idx: 0,
		dependency: ["basin"],
		param: ["change_precip_mean","change_precip_var","change_airtemp_mean"]
	},
	streamFlowModel: {
		idx: 1,
		dependency: ["weather_generator"],
		param: []
	},
	streamTempertuareModel: {
		idx:2,
		denpendency:["weather_generator","streamFlowModel"],
		param: []
	}
};

var modelArray = ["weather_generator","streamFlowModel","streamTempertuareModel"];

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

var buildARun = function(reqInfo,modelName){
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
		for(var i=0;i<dependency.length;i++){
			run.depend.push(xxx[i]);	// get dependency directory.
		}
	}
	return run;
};



var buildRuns = function(reqInfo){
	var runs = [];

};