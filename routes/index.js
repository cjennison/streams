var http = require('http');

exports.main = function (req, res) {
  res.render('main.ejs',
             { 'title' : 'Streams',
               'user'  : req.session.username });
};

exports.front = function (req, res) {
  res.render('front',
             { 'title' : 'Streams' });
};

exports.login = function (req, res) {
  res.render('login',
             { 'title' : 'Streams Login' });
};

exports.login_user = function (req, res) {
  // Check to see if the username was sent as part
  // of the request body:
  if (req.body.username) {
    // If yes, then save in the user's session:
    req.session.username = req.body.username;
    // Then we redirect to the stream app:
    res.redirect('/streams');
  }
  else {
    // Otherwise, we redirect back to login:
    res.redirect('/login');
  }
};

// A new interface to the streams application
exports.v2 = function (req, res) {
  res.render('version2.ejs',
             { 'title' : 'Streams',
               'layout': 'layout2.ejs' });
};

exports.stream = function (req, res) {
    var options = {
        host: 'streamstatsags.cr.usgs.gov',
        path: '/ss_ws_92/Service.asmx/getStreamstats?x=-111.1563&y=39.4725&inCRS=EPSG:6.6:4326&StateNameAbbr=UT&getBasinChars=C&getFlowStats=C&getGeometry=KML&downloadFeature=False&clientID=UT%20Demo'
    };

    console.log('Making HTTP request...');

    var req_stream = http.get(options, function (res_stream) {
        console.log('Got response: ' + res_stream.statusCode);
        res_stream.on('data', function (chunk) {
            console.log(chunk);
        });
    }).on('error', function (e) {
        console.log('Got error: ' + e.message);
    });
    
    console.log('Returning result...');
    req_stream.end();
    res.send('<p>Yippy</p>');
};