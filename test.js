var http = require('http');
var step = require('step');

var options = {
	host: 'streamstatsags.cr.usgs.gov',
	path: '/ss_ws_92/Service.asmx/getStreamstats?x=-111.1563&y=39.4725&inCRS=EPSG:6.6:4326&StateNameAbbr=UT&getBasinChars=C&getFlowStats=C&getGeometry=KML&downloadFeature=False&clientID=UT%20Demo'
	//    path: '/'
};

console.log('Making HTTP request...');

var req_stream = http.get(options, function(res_stream) {
	console.log('Got response: ' + res_stream.statusCode);
	res_stream.on('data', function(chunk) {
		console.log(chunk.toString());
	});
}).on('error', function(e) {
	console.log('Got error: ' + e.message);
});

console.log('Returning result...');
req_stream.end();

