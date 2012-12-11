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
  }
};

// A constructor function for users.  We may change this in the
// future to use Mongoose.js to represent users in a database or
// possibly connect it up to HubZero.
function User(name) {
  this.name = name;
  this.dir  = USER_DIR + '/' + name;
}

// Determines if the user has a directory yet:
User.prototype.getRuns = function (cb) {
  fs.readdir(this.dir, cb);
};

// Creates a new run directory for the user:
User.prototype.newRunDirectory = function (cb) {
  var rundir = this.dir + '/' + uuid.v4();
  fs.mkdir(rundir, function () {
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

