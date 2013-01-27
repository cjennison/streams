// A library for representing users.
var fs     = require('fs');
var mkdirp = require('mkdirp');
var uuid   = require('node-uuid');
var config = require('../config');
var runs   = require('../runs');


// The default user directory containing all the user directories:
var USER_DIR = config.server.UsersDir;

// Errors returned to clients of this library:
var ERRORS = {
  USER_EXISTS : {
    code : 'USER_EXISTS',
    msg  : 'User Exists'
  },
  SETTINGS_ERROR : {
    code : 'SETTINGS_ERROR',
    msg  : 'Error writing settings file.'
  }
};

// Recursively constructs a directory.
function mkdir_p(dirPath, mode, callback) {
  //Call the standard fs.mkdir
  require('fs').mkdir(dirPath, mode, function(error) {
    //When it fail in this way, do the custom steps
    if (error && error.errno === 34) {
      //Create all the parents recursively
      mkdir_p(require('path').dirname(dirPath), mode, callback);
      //And then the directory
      mkdir_p(dirPath, mode, callback);
    }
    //Manually run the callback since we used our own callback to do all these
    callback && callback(error);
  });
}

// A run directory...
function RunDirectory(user, scriptname, id) {
  this.user       = user;
  this.scriptname = scriptname;
  this.id         = id;
  this.path  = user.dir + '/' +
               scriptname + '/' +
               id;
}

RunDirectory.prototype.writeSettings = function(settings, cb) {
  var file = this.path + '/settings.json';
  //console.log("writesettings from runDir.writeSettings(): "+file);
  fs.writeFile(file, JSON.stringify(settings)+'\n', function (err) {
	  if(cb){
    if (err) {
    	console.log(ERRORS.SETTINGS_ERROR);
    	cb(ERRORS.SETTINGS_ERROR);
    }
    else {
      //TODO: there is error about undefined is not a function when using cb(undefined, this.path+...);
      cb(undefined, this.path + '/settings.json');
    }
    }
  });
};

// A constructor function for users.  We may change this in the
// future to use Mongoose.js to represent users in a database or
// possibly connect it up to HubZero.
function User(name) {
  this.name = name;
  this.dir  = USER_DIR + '/' + name;
}

// get all the runs of a script
User.prototype.getRuns = function (scriptname, cb) {
  var runs =[];
  var idArray = fs.readdirSync(this.dir + '/' + scriptname);
  if(runObjs){
    for(var i=0; i<idArray.length; i++){
      var aRun = new runs.Run(this,scriptname,idArray[i]).getSetting();
      if(aRun){
        runs.push(aRun);
      }else{
        console.log(id+' has invalid setting');
      } 
    }
  }
  return runs;
};

//given previous runs, get the child runs
//constraints is an array, where each element is {modelname:"scriptname"}
User.prototype.getConstraintRuns = function(constraints,scriptname){
  runs = this.getRuns(scriptname);
  var constrRuns = [];
  for(var i=0; i<runs.length;i++){
    for(var model in constraints){
      if(runs.preceding[model] === constraints[model]){
        constrRuns.push(runs[i]);
      }
    }
  }
  return constrRuns; 
};

// Gets the setting of a particular run given the run id:
User.prototype.getARun = function(scriptname,runId){
  if(!scriptname||!runId){
    console.log("User.prototype.getARun: get invalid parameter!");
    return null;
  }
  fs.exists(this.dir+'/'+scriptname+'/'+runId, function(exists){
    if(exists) {
      //TODO:decide whic files to read.
      return new runs.Run(this,scriptname,runId);
    } else {
      console.log("Run does not exist: "+this.dir+'/'+scriptname+'/'+runId);
      return null;
    }
  });
};

User.prototype.getRunResult = function(scriptname,runId){
  var path = this.dir+'/'+scriptname+'/'+runId;
  var exists = fs.existsSycn(path);
  if(exists) {
    var fileArray = fs.readFileSync(path);
    return "finish reading a run result";
  } else {
    console.log("path does not exist: "+this.dir+'/'+scriptname+'/'+runId);
    return null;
  }
  
};

// Creates a new run directory for the user:
User.prototype.newRunDirectory = function (scriptname, cb) {
  var rundir = new RunDirectory(this, scriptname, uuid.v4());
  mkdirp(rundir.path, function (err) {
    cb(err, rundir);
  });

};

// create a new run ID for a run
User.prototype.newRunID = function(){
  return uuid.v4();
};

// create a new Run directory given the script name and a run ID.
User.prototype.createRunDir = function(scriptname,runid,cb){
  var rundir = new RunDirectory(this,scriptname,runid);
  mkdirp(rundir.path, function(err){
    if(cb){
      cb(err, rundir);
    }
  });
  return rundir;
};
exports.test = function (path, cb) {
  mkdirp(path, cb);
};

// For the moment we will provide only three hard-coded users. In
// the future we will support user creation when we understand how
// we will be doing this.
var users = { };

// Returns true if the user exists; false otherwise.
function exists(name) {
  return name in users;
}

function createUser(name, cb) {
  if (exists(name)) {
    cb(ERRORS.USER_EXISTS);
  }

  var user = new User(name);
  fs.stat(user.dir, function (err, stats) {
    if (err) {
      // This is good, if the user directory does
      // not exist then create it.
      if (err.code === 'ENOENT') {
        fs.mkdir(user.dir, function () {
          // If no exceptions, then we are good.
          // TODO: handle exceptional case...
          users[name] = user;
          cb(undefined, user);
          return;
        });
      }
    }
    // Should not reach this point.
    //throw err;
  });
}

// Returns the user if they exist; undefined otherwise.
function lookup(name) {
  if (name in users) {
    return users[name];
  }
  return undefined;
}

// Create user directory if it does not exist:
fs.stat(USER_DIR, function (err, stats) {
  if (err) {
    if (err.code === 'ENOENT') {
      fs.mkdir(USER_DIR, function () {
        createUser('testuser1', function (err, user) {
          users[user.name] = user;
        });
        createUser('testuser2', function (err, user) {
          users[user.name] = user;
        });
        createUser('testuser3', function (err, user) {
          users[user.name] = user;
        });
      });
    }
  }
  else {
    // user directory exists, so we have the test
    // user directories.
    users['testuser1'] = new User('testuser1');
    users['testuser2'] = new User('testuser2');
    users['testuser3'] = new User('testuser3');
  }
});

exports.createUser = createUser;
exports.exists = exists;
exports.lookup = lookup;
exports.User = User;
