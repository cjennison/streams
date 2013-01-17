var config = require('../config');
var fs     = require('fs');
var spawn  = require('child_process').spawn;
var async  = require('async');
var mkdirp = require('mkdirp');

// The basin directory:
var BASIN_DIR  = config.server.BasinsDir;
var MODELS_DIR = config.server.ModelsDir;

//TODO: add data directory.
var DATA_DIR = config.server.dataDir;

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

var delineateBasin = function (lat, lng, cb) {
  // Function to create/retrieve basin using basin deliniation;
  var spawnOpt = {
    cwd: MODELS_DIR + '/r',
    env: process.env
  };
  var RArg = ['delineate_basin1.R ', '{ lat :'+ lat+', long:'+ lng+', basindir:'+BASIN_DIR+', datadir:'+DATA_DIR+'}'];
  var rs = spawn('Rscript', RArg,spawnOpt);
	// gives BASIN_DIR to R script, returns basin id.
  rs.stdout.on('data',function(data){
	var str = data.toString().split(": ");
	if(str[0] === 'basinid'|| str[0]=== 'featureID') {		
			// use the call back function to return the response.
		rs["basinID"] = str[1];
    console.log("lib/basin/basin.js: basinID = " + rs["basinID"]);
    //cb(undefined, str[1]);
	}else{
    //cb({msg: "cannot get basin ID: "+data.toString()});
  }
  });
  rs.stderr.on('data',function(data){});
  rs.stdout.on('end',function(data){
    console.log('return the basid in ls["basinID"]-- OK');
    if(rs["basinID"]){
      cb(undefined,rs["basinID"]);
    }else{
      cb({msg:"no input from delineate_basin.R"});
    }
  });
};

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
      try {
        cb(undefined, new Basin(JSON.parse(data)));
      }
      catch(syntax_error) {
        cb({ msg : 'Bad formatting in ' + path});
      }
    }
  });
}

//assume the basinID-alias pair are in basin/aliaslist.json in the user directory.
function userBasinList(user,cb) {
  // Function to return list of basin aliases/basin ids:
  //  1. the user basin list stored in user directory.
  fs.readFile(user.dir+'/basin/aliaslist.json',function(err,data){
    if(err) {
      mkdirp(user.dir+'/basin');
      fs.writeFile(user.dir+'/basin/aliaslist.json', '[]', function(err){
        if(err) {
          console.log("alisa not exists. cannot create list");
        }
      });
    }
    var list = JSON.parse(data);
    if(cb){
      cb(undefined,list);
    }
    return list;
  });
  //  2. the global alias list stored in data/basins.
}



//param:
//  user: user object
//  pair: id-alias such as { "basin_id" : ID, "basin_alias" : ALIAS }
//  cb  : callback function(err, updated_array_list)
function addBasin_IDAlias(user,pair,cb){
  var list = [];

  fs.readFile(user.dir+'/basin/aliaslist.json',function(err,data){
    if(!err) {
      list = JSON.parse(data);
     }
  });

  for(idx in list){
    if(list[idx].basin_alias == pair.basin_alias){
      console.log("basin alias already exists for this user");
      if(cb){
        cb({msg:"basin alias already exists for this user"});
      }
    }    
  }
  list.push(pair);

  fs.writeFile(user.dir+'/basin/aliaslist.json', JSON.stringify(list), function(err){
    if(err){
      if(cb){
        cb({msg:"write alias-id file failed"});
      }
    }else{
      if(cb){
        cb(undefined, list);
      }
    }
  });
  
}

// Exported Values:
exports.preDefinedBasins = preDefinedBasins;
exports.basinInfo = basinInfo;
exports.userBasinList = userBasinList;
exports.addBasin_IDAlias = addBasin_IDAlias;
exports.delineateBasin = delineateBasin;



