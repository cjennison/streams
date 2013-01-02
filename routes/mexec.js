
var users = require('../lib/users');
var mexec = require('../lib/mexec');
var fs = require('fs');

// Routes for the mexec library.
exports.exec = function(req, res) {
	var settings = req.body;
	//var user = req.session.user; // TODO: assign user (login?)
	var user = req.body.user;
	var runReady = true;
	// TODO:
	// - get the user
	
	//build up an array of runs from the setting
	var runs = mexec.buildRuns(settings);
	
	// - get a new run directory for each run
	
	for( var idx =0; idx<runs.length;idx++ ) {
		var aRun = runs[idx];
		//generate a runId with uuid
		if(aRun.runId===''){
			aRun.runId = 1234;
		}
		var path = __dirname + '/../lib/mexec' + user + '/' + aRun.scriptName + '/'+aRun.runId;
		mexec.mkdir_p(path);
		// - create settings file
		fs.writeFile(path+'/'+aRun.scriptName+'.setting', aRun, function(err) {
			console.log(err);
			if(err) {
				console.log("cannot save setting for the model: " + aRun.scriptName);
				//TODO: remove the path with nodejs-done
				mexec.rimraf(path,function(err){
					if(err){
						console.log("cannot remove path: "+path);
					}
				});
				throw err;
				//return;
			}
			console.log("setting for " + aRun.scriptName + " is saved");
		});
	}
	// - call mexec.runModels
	if(runReady) {
		mexec.runModels(runs,0,"xxxpath of the modelsxxx");
	}
};