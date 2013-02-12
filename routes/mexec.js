var users = require('../lib/users');
var mexec = require('../lib/mexec');
var fs = require('fs');
var RScriptDir = require('../config/streams.json').ModelsDir +'/r';

var runs = require('../lib/models');
exports.exec = function (req, res) {
	var user  = req.session.user;
  var spec  = req.body.webInfo;
  var runID = runs.executeRun(user, spec);
  res.json({ 'runID' : runID });
};

// Routes for the mexec library.
exports.exec2 = function(req, res) {
	var user = new users.User(req.session.user.name);
	var settings = req.body.webInfo;
	console.log(settings.climate.n_years)
	var user = req.session.user;  	
	if(!settings || ! user.name){
		res.json("get request info not exists or user is not valid");
	}else{
		user = new users.User(user.name);
		//build up an array of runs from the setting
		var runs = mexec.buildRuns(settings,user);		
		//console.log(runs);
		res.json(runs);
		if(runs.length>0) {
			mexec.saveModelTree(runs,user);
			mexec.runModels(runs,0,RScriptDir);
		}
		
	}
	
};

// 
exports.checkARun = function(req,res){
	var scriptname = req.body;
	if(scriptname){
		var stat = mexec.checkARun(scriptname);
		if(stat){
			res.json(true);
		}else if(stat === false){
			res.json(false);
		}else{
			res.json("the run of the model does not exists");
		}
	}else{
		res.json("format incorrect");
	}
};