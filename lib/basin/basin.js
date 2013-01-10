var config = require('./config');

var BASIN_DIR = config.server.BasinDir;

// 1. function to create basin module to execute basin deliniation;
//    gives BASIN_DIR to R script, returns basin id.
// 2. function to return list of basin aliases/basin ids.
// 3. function for writing an alias to a basin's param.json file.