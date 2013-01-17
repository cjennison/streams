var userConfig = require(__dirname + "/../users/users.js");
var uuid = require('node-uuid');
var mkdirp = require('mkdirp');
//var r_scripts = require(''); //get the rscript info from the json file in Ana's code
//does each script in climate require the same parameters? same for scripts in flow models?
var modeldepend = {
	climate: {
		idx: 1,
		dependency: ["basin"],
		param: ["change_precip_mean", "change_precip_var", "change_airtemp_mean"],
		output: []
	},
	land: {
		idx: 2,
		dependency: ["basin"],
		param: [],
		output: []
	},
	barriers: {
		idx: 3,
		denpendency: ["basin"],
		param: [],
		output: []
	},
	flow: {
		idx: 4,
		dependency: ["climate", "land", "barriers"],
		param: [],
		output: []
	},
	streamtemp: {
		idx: 5,
		dependency: ["climate", "flow"],
		param: [],
		output: []
	},
	population: {
		idx: 6,
		dependency: ["streamtemp", "flow"],
		param: ["spring_growth", "spring_survival", "spring_growth", "spring_survival"],
		output: []
	}
};

var scriptInfo = {
	weather_generator: {
		name: "weather_generator",
		model: "climiate"
	}
}

var modelArray = ["climate", "flow", "land", "barriers", "streamtemp", "population"];

// var buildWeather = function(reqInfo){	
// 	if(weatherFlag){
// 		var run = {
// 			scriptName: weather_generator
// 		};
// 		run["change_precip_mean"] = reqInfo.change_precip_mean;
// 		run["change_precip_var"] = reqInfo.change_precip_var;
// 		run["change_airtemp_mean"] = reqInfo.change_airtemp_mean;
// 		return run;
// 	}else{
// 		return;
// 	}
// };
/*
	info of a model in the reqInfo is supposed as follow:
	modelName: {
		scriptName: xxx,
		flag: xxxx,

	}
	......
*/
var buildARun = function(reqInfo, modelname, user) {

		//get the modelname of the input script
		// var modelname = scriptInfo[script].model;
		var run = reqInfo[modelname];
		// var params = models[modelName].param;
		// run["preceding"] = {};
		// for(var i=0;i<params.length;i++){
		// run[params[i]] = reqInfo[param[i]];
		// }
		if(run.flag) {
			var depend = modeldepend[modelname].dependency;
			//dependency: 1. from new build run; 2. from pre-exist run
			if(depend.length > 0) {
				for(i = 0; i < depend.length; i++) {
					if(reqInfo[depend[i]]) {
						// run.preceding.push(user.getARun(depend[i],reqInfo[script]+'-'+depend[i]]));	// get dependency directory.
						//check in the req that if a preceding depended run is newly created,
						//if yes, then get its runID.
						//depend[i] is the name of the i-th model that current script depends on
						if(reqInfo[depend[i]].flag) {							
							run.preceding[depend[i] + "_dir"] = reqInfo[depend[i]].dir;
							//console.log(JSON.stringify(reqInfo[depend[i]])+'\n');
						} else {
							//get the existing depended run directory
							run.preceding[depend[i] + "_dir"] = user.getARun(reqInfo[depend[i]].scriptName, run.preceding[depend[i] + "ID"]);
							if(!run.preceding[depend[i] + "_dir"]) {
								// console.log(reqInfo[depend[i]].scriptName+" depending run does not exist ");
							}
						}
					}
				}
			}
			run["runid"] = user.newRunID();
			if(run.runName === ''|| !run.runName) {
				run["runName"] = run.runID;
			}
			var rundir = user.createRunDir(run.scriptName, run.runid, function(err, rundir) {
				if(err) throw err;
				
			});
			run["dir"] = rundir.path;
			run["year"] = reqInfo["year"];			
			rundir.writeSettings(run);

			console.log(run);
		}

		return run;
	};

var createRunID = function(user, scriptName) {
		var id = uuid.v4();
		var path = user.dir + "/" + scriptName + '/' + id;
		mkdirp(path);

		return id;
	};

var buildRuns = function(reqInfo, user) {
		var runs = [];
		var arun = undefined;
		for(var i = 0; i < modelArray.length; i++) {

			if(!reqInfo[modelArray[i]]) {				
				continue;
			}
			if(reqInfo[modelArray[i]].flag) {
				arun =buildARun(reqInfo, modelArray[i], user);
				console.log('\n--'+arun);
				runs.push(arun);
			}
		}

		return runs;
	};

exports.buildRuns = buildRuns;
exports.buildARun = buildARun;