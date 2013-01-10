var config = require('./config');

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

function getBasin(lat, lng) {
  // Function to create/retrieve basin using basin deliniation;
  // gives BASIN_DIR to R script, returns basin id.	
};

function basinList() {
  // Function to return list of basin aliases/basin ids:
  //  1. the user basin list stored in user directory.
  //  2. the global alias list stored in data/basins.
};

