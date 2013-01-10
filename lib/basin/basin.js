var config = require('./config');
var fs = require('fs');
var spawn = require('child_process').spawn;

// The basin directory:
var BASIN_DIR = config.server.BasinDir;

// A Basin object representing a basin.
function Basin(id) {
  this.id = id;
}

// Writes configuration parameters from parameter `config`
// which is a JS object.
Basin.prototype.writeConfig = function (config) {
  // Method for writing an alias to a basin's param.json file.

};
//input the lat and long, 
//call back function accepts the basinID as a parameter do something with it.

function getBasin(lat, lng,cb) {
  // Function to create/retrieve basin using basin deliniation;
  var spawnOpt = {
	cwd:  '../../models/r',	//TODO: where is the R script ?
	env: process.env
  };
  var RArg = ['delineate_basin.R ', '{ lat :'+ lat+', long:'+ lng+', basin_dir:'+BASIN_DIR+'}'];
  var rs = spawn('Rscript', RArg,spawnOpt);
	// gives BASIN_DIR to R script, returns basin id.
  rs.stdout.on('data',function(data){
	var str = data.toString().split();
	if(str[0] === 'basin') {
		//TODO: return the basin id
		cb(str[1]);	// use the call back function to return the response.
		rs["basinID"] = str[1];
	}
  });
  rs.stderr.on('data',function(data){});
  rs.stdout.on('end',function(data){console.log('return the basid in ls["basinID"]-- OK');});
}


//assume the basinID-alias pair are in basin/aliaslist.json in the user directory.
function basinList(user) {
  // Function to return list of basin aliases/basin ids:
  //  1. the user basin list stored in user directory.
  fs.readFile(user.dir+'/basin/aliaslist.json',function(err,data){
	if(err) throw err;
	return JSON.parse(data);
  });
  //  2. the global alias list stored in data/basins.
}

