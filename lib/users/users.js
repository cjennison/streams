// A library for representing users.
var fs   = require('fs');
var uuid = require('node-uuid');

// The default user directory containing all the user directories:
var USER_DIR = 'users';

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

function mkdir_p(path, callback, mode, position) {
    mode = mode || 0777;
    position = position || 0;
    parts = require('path').normalize(path).split('/');
 
    if (position >= parts.length) {
        if (callback) {
            return callback();
        } else {
            return true;
        }
    }
 
    var directory = parts.slice(0, position + 1).join('/');
    fs.stat(directory, function(err) {
        if (err === null) {
            mkdir_p(path, mode, callback, position + 1);
        } else {
            fs.mkdir(directory, mode, function (err) {
                if (err) {
                    if (callback) {
                        return callback(err);
                    } else {
                        throw err;
                    }
                } else {
                    mkdir_p(path, mode, callback, position + 1);
                }
            });
        }
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
  fs.writeFile(file, JSON.stringify(settings), function (err) {
    if (err) {
      cb(ERRORS.SETTINGS_ERROR);
    }
    else {
      cb(undefined, this.path + '/settings.json');
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

// Determines if the user has a directory yet:
User.prototype.getRuns = function (scriptname, cb) {
  fs.readdir(this.dir + '/' + scriptname, cb);
};

// Creates a new run directory for the user:
User.prototype.newRunDirectory = function (scriptname, cb) {
  var rundir = new RunDirectory(this, scriptname, uuid.v4());
  mkdir_p(rundir.path, function (err) {
    cb(rundir);
  });
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

