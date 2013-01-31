var runs = require('./buildRunModel.js');
var mexec = require('./batchrun.js');
var reqInfo = require('./b.json');
var users = require('../users');
var config = require('../config');

var ModelDir = config.server.ModelsDir+'/r';

var user = new users.User("testuser1");
user.dir = './test/testuser';
var settings = reqInfo.webInfo;
console.log(settings);
var runs = mexec.buildRuns(settings,user);
	console.log(runs);
	if(runs.length>0) {//TODO: set the directory for the r scripts
		//mexec.runModels(runs,0,ModelDir);
		mexec.saveModelTree(runs,user);
	}

