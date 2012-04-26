var sio = require('socket.io');
var fs  = require('fs');
var streamstat = require('../streamstat');

function getDrainId (kmldata) {
  var re    = /DrainID = (\d+)/g;
  var match = re.exec(kmldata);
  return match[0];
}

// A library for streams communication.
exports.listen = function (app) {
  var io = sio.listen(app);

  // Reduce logging information.
  io.set('log level', 1);

  io.sockets.on('connection', function (socket) {

    socket.on('marker', function (data) {
      console.log('received marker message: ' + data);
      var url = streamstat.make(data);
      url.fetch(function (kmlpath, props) {          
        console.log('kml file downloaded. notifying client.');
        socket.emit('kmldone', { kmlpath : kmlpath,
                                 props   : props,
                                 lat     : data.lat,
                                 lng     : data.lng });
      });
    });

  });
};