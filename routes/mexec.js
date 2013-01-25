var users = require('../lib/users');
var mexec = require('../lib/mexec');
var fs = require('fs');

// Routes for the mexec library.
exports.exec = function(req, res) {
	var settings = req.query;
	var user = req.session.user;
	if(!settings || ! user){
		res.json("get request info not exists or user is not valid");
	}else{
		var files = fs.readdirSync("../../users/testuser1/weather_generator");
		res.json(files);
	}
	//build up an array of runs from the setting
	var runs = mexec.buildRuns(settings,user);
	
	if(runs.length>0) {//TODO: set the directory for the r scripts
		mexec.runModels(runs,0,"../lib/users");
	}
};