// A library for representing users.
var fs = require('fs');

// The default user directory containing all the user directories:
var USER_DIR = 'users';

// A constructor function for users.  We may change this in the
// future to use Mongoose.js to represent users in a database or
// possibly connect it up to HubZero.
function User(name) {
  this.name = name;
  this.dir  = USER_DIR + '/' + name;
}

// Determines if the user has a directory yet:
User.prototype.getRuns = function (cb) {
  fs.stat(this.dir, function (err, stats) {
    if (err) {
      // Directory does not exist, they create:
      if (err.code === 'ENOENT') {
        
      }
      cb(false);
    }
    else {
      cb(stats.isDirectory());
    }
  });
};

// For the moment we will provide only three hard-coded users. In
// the future we will support user creation when we understand how
// we will be doing this.
var users = {
  'testuser1': new User('testuser1'),
  'testuser2': new User('testuser2'),
  'testuser3': new User('testuser3')
};

// Returns true if the user exists; false otherwise.
function exists(name) {
  return name in users;
}

// Returns the user if they exist; undefined otherwise.
function lookup(name) {
  if (name in users) {
    return users[name];
  }
  return undefined;
}

// Exported functions and data:
exports.exists = exists;
exports.lookup = lookup;