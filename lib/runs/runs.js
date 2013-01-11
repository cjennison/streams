var fs     = require('fs');
// This module represents runs performed by a user.

// A run directory:
function Run(user, scriptname, id) {
  this.user       = user;
  this.scriptname = scriptname;
  this.id         = id;
  this.path  = user.dir + '/' +
               scriptname + '/' +
               id;
}

Run.prototype.writeSettings = function(settings, cb) {
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

// The collection of user runs:
function Runs(user) {
  this.user = user;
  this.runs = [];
}

Runs.prototype.getRuns = function (cb) {
  var that = this;
  // Read the list of script directories in the user directory:
  fs.readdir(that.user.dir, function (err, script_list) {
    if (err) {
      cb(err);
    }
    else {
      for (var s = 0; s < script_list.length; s++) {
        var script = script_list[s];
        if (script !== 'config') {
          // Read the list of runs in the script directory:
          fs.readdir(that.user.dir + '/' + script, function (err, run_list) {
            if (err) {
              cb(err);
            }
            else {
              for (var r = 0; r < run_list.length; r++) {
                var run = new Run(that.user, script, run_list[r]);
                that.runs.push(run);
              }              
            }
          });
        }
      }
      cb(undefined, that.runs);
    }
  });
};

// Export Runs object:
exports.Runs = Runs;
