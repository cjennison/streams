var users = require('../lib/users');
var mexec = require('../lib/mexec');
var fs = require('fs');
var RModelP = require('./config').ModelDir+'/r'



// Routes for the mexec library.
exports.exec = function(req, res) {
	var settings = req.body;
	var user = req.session.user;
	if(!settings || ! user){
		res.json("get request info not exists or user is not valid");
	}else{
		var files = fs.readdirSync("/home/node.js/users/testuser1/weather_generator");
		res.json(files);
	}
	//build up an array of runs from the setting
	var runs = mexec.buildRuns(settings,user);
	
	if(runs.length>0) {//TODO: set the directory for the r scripts
		mexec.runModels(runs,0,RModelP);
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