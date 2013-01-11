var config = require('../config');
var fs     = require('fs');
var spawn  = require('child_process').spawn;
var async  = require('async');

// The basin directory:
var BASIN_DIR  = config.server.BasinsDir;
var MODELS_DIR = config.server.ModelsDir;

// A Basin object representing a basin.
function Basin(config) {
  for (var prop in config) {
    this[prop] = config[prop];
  }
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
    cwd: MODELS_DIR + '/r',
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

// The preDefinedBasins function retrieves the list of pre-defined
// basins invoking the given callback `cb` with the following
// signature: 
//   cb(err, basin_list)
// where the basin_list is a list of the predefined basins if `err` is
// `undefined`; otherwise err will have a `msg` property indicating
// the error.
function preDefinedBasins(cb) {
  fs.readFile(BASIN_DIR + '/predef.json', function (err, data) {
    if (err) {
      cb({ msg : 'Error reading ' + BASIN_DIR + '/predef.json' });
    }
    else {
      var predef  = JSON.parse(data);
      var length  = predef.predef_basins.length;
      var pdpaths = [];
      for(var b = 0; b < length; b++) {
        pdpaths.push(BASIN_DIR + '/' + predef.predef_basins[b] + '/param.json');
      }
      console.log(JSON.stringify(pdpaths));
      async.map(pdpaths, fs.readFile, function (err, contents) {
        if (err) {
          cb({ msg : 'Error reading param files in predef basins: ' + err });
        }
        else {
          var length = contents.length;
          var basins = [];
          for (var b = 0; b < length; b++) {
            basins.push(new Basin(JSON.parse(contents[b])));
          }
          cb(undefined, basins);
        }
      });
    }
  });
}

// The basinInfo function retrieves information related to the given
// basin `id`. The callback `cb` will receive an object containing the
// properties that correspond to the param.json file for a particular
// basin.
function basinInfo(id, cb) {
  var path = BASIN_DIR + '/' + id + '/param.json';
  fs.readFile(path, function (err, data) {
    if (err) {
      cb({ msg : 'Error reading ' + path });
    }
    else {
      cb(undefined, new Basin(JSON.parse(data)));
    }
  });
}

//assume the basinID-alias pair are in basin/aliaslist.json in the user directory.
function userBasinList(user) {
  // Function to return list of basin aliases/basin ids:
  //  1. the user basin list stored in user directory.
  fs.readFile(user.dir+'/basin/aliaslist.json',function(err,data){
	if(err) throw err;
	return JSON.parse(data);
  });
  //  2. the global alias list stored in data/basins.
}


//pair = { "basin_id" : ID, "basin_alias" : ALIAS }
function addBasin_IDAlias(user,pair){
  var list = [];

  fs.readFile(user.dir+'/basin/aliaslist.json',function(err,data){
  if(err) throw err;
  list = JSON.parse(data);
  });

  for(idx in list){
    if(list[idx].basin_alias == pair.basin_alias){
      console.log("basin alias already exists for this user");
      return ;
    }    
  }
  list.push(pair);

  fs.writeFile(user.dir+'/basin/aliaslist.json', JSON.stringify(list), function(err){
    if(err){
      console.log("write alias-id file failed");
    }
  });
}

// Exported Values:
exports.preDefinedBasins = preDefinedBasins;
exports.basinInfo = basinInfo;
exports.userBasinList = userBasinList;
exports.