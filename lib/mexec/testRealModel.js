var runs = require('./buildRunModel.js');
var mexec = require('./batchrun.js');
var reqInfo = require('./b.json');
var users = require('../users');
var config = require('../config');

var ModelDir = config.server.ModelsDir;

var user = new users.User("testuser1");
var settings = reqInfo.webInfo;
//console.log(settings);
var runs = mexec.buildRuns(settings,user);
	
	if(runs.length>0) {//TODO: set the directory for the r scripts
		mexec.runModels(runs,0,ModelDir);
	}