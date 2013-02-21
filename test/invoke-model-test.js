var http   = require('http');
var config = require('../lib/config');

var options = {
  hostname: 'localhost',
  port    : config.server.port,
  path    : '/mexec',
  method  : 'POST',
  headers : {
    'Content-Type' : 'application/json'
  }
};

var req = http.request(options, function (res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS:' + JSON.stringify(res.headers));
  res.on('data', function (chunk) {
    console.log(chunk);
  });
});

req.on('error', function (e) {
  console.log('problem with request: ' + e.message);
});

var data = 
  { "webInfo" : 
    { "climate": 
      { "flag": "true", 
	"alias": "29713", 
	"scriptName": "weather_generator", 
	"basin_id": "west_brook", 
	"precip_mean_y1": "1", 
	"precip_mean_yn": "1", 
	"precip_var_y1": "1", 
	"precip_var_yn": "1", 
	"temp_mean_y1": "1", 
	"temp_mean_yn": "1", 
	"n_years": "30", 
	"wet_threshold": "0" }, 
      "flow": { "flag": "true", 
		"basin_id": "west_brook", 
		"scriptName": "StreamFlowModel", 
		"preceding": { "climate": "weather_generator" } 
	      } 
    } 
  };

req.write(data);