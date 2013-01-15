var users = require('../lib/users');
var mexec = require('../lib/mexec');
var fs = require('fs');

// Routes for the mexec library.
exports.exec = function(req, res) {
	var settings = req.body;
	var user = req.session.user; 
	//build up an array of runs from the setting
	var runs = mexec.buildRuns(settings,user);	
	
	if(runs.length>0) {
		mexec.runModels(runs,0,"../lib/users");
	}
};