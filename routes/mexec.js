var users = require('../lib/users');
var mexec = require('../lib/mexec');
var fs = require('fs');

// Routes for the mexec library.
exports.exec = function(req, res) {
	var settings = req.body;
	var user = req.session.user; // TODO: assign user (login?)
	var runReady = true;
	// TODO:
	// - get the user
	user = req.body.user;
	//build up an array of runs from the setting
	var runs = mexec.buildRuns(setting);
	// - get a new run directory for each run
	
	for(var aRun in runs) {
		//generate a runId with uuid
		//aRun.runId = 
		var path = _dirname + '../lib/mexec' + user + '/' + aRun.scriptName + '/'+aRun.runId;
		mkdir_p(path);
		// - create settings file
		fs.writeFile(path+'/'+aRun.scriptName+'.setting', aRun, function(err) {
			if(err) {
				console.log("cannot save setting for the model: " + aRun.scriptName);
				//TODO: remove the path with nodejs-done
				mexec.rimraf(path,function(err){
					if(err){
						console.log("cannot remove path: "+path);
					}
				});
				runReady = false;
				//throw err;
				//break;
			}
			console.log("setting for " + aRun.scriptName + " is saved");
		});
	}
	// - call mexec.runModels
	if(runReady) {
		mexec.runModels(runs,0,"xxxpath of the modelsxxx");
	}
};