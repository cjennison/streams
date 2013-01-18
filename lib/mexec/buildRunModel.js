var userConfig = require(__dirname + "/../users/users.js");
var uuid = require('node-uuid');
var mkdirp = require('mkdirp');
var modelInfo = require('./modelInfo.json');
//var r_scripts = require(''); //get the rscript info from the json file in Ana's code
//does each script in climate require the same parameters? same for scripts in flow models?
var modeldepend = modelInfo.modelInfo;


var scriptInfo = modelInfo.scriptInfo;

var modelArray = modelInfo.modelArray;


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
							run.preceding[depend[i] + "_dir"] = reqInfo[depend[i]].run_dir;
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
			if(run.run_alias === ''|| !run.run_alias) {
				run["run_alias"] = run.runID;
			}
			var rundir = user.createRunDir(run.scriptName, run.runid, function(err, rundir) {
				if(err) throw err;
				
			});
			run["run_dir"] = rundir.path;
			run["n_year"] = reqInfo["n_year"];
			run["rscript"] = run.scriptName+'.R';
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