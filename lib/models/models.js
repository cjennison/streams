var fs    = require('fs');
var spawn = require('child_process').spawn;

var log = [];

exports.weather_model_exec = function (req, res) {
  var prec1 = req.query.prec1;
  var prec2 = req.query.prec2;
  var tempc = req.query.tempc;

  // Set response mime type:
  res.contentType('application/json');
  
  if (!prec1 || !prec2 || !tempc) {
    res.send({
      status  : 1,
      message : 'Missing query parameters'
    });
  }
  else {
    var child = spawn('Rscript', ['Main.R', prec1, prec2, tempc],
                      { cwd : '/home/austin/WebStuff' });

    child.stderr.on('data', function (data) {
      console.log('stderr: ' + data.toString());
    });
    
    child.stdout.on('data',
                    function (data) {
                      var str = data.toString();
                      console.log(str);
                      var re  = /\[(\d)\] \"(.*)\"/;
                      var res = re.exec(str);
                      if (res !== null) {
                        log.push({ type : 'info', message : res[2] });
                      }
                    });

    child.stdout.on('end',
                    function (data) {
                      console.log('end: ' + data);
                    });

    child.on('exit', function (code, signal) {
      // Move files
      function mvError (err) {
        if (err) {
          console.log(err);
        }
      }
            
      var frombase = '/home/austin/WebStuff';
      var tobase   = '/home/node.js/streams/public/images'
      fs.rename(frombase + '/StocStrFlow.png', tobase + '/StocStrFlow.png', mvError);
      fs.rename(frombase + '/StocStrTemp.png', tobase + '/StocStrTemp.png', mvError);
      fs.rename(frombase + '/StocWeather.png', tobase + '/StocWeather.png', mvError);
      log.push({ type : 'image', url : 'images/StocStrFlow.png' });
      log.push({ type : 'image', url : 'images/StocStrTemp.png' });
      log.push({ type : 'image', url : 'images/StocWeather.png' });

      for (var i = 0; i < log.length; i++) {
        console.log('weather log: ' + log[i]);
      }

      log.push({ type : 'complete' });
    });
    
    res.send({
      status  : 0,
      message : 'Weather Model Running'
    });
  }
};

exports.weather_model_status = function (req, res) {
  // Set response mime type:
  res.contentType('application/json');

  if (log.length > 1) {
    res.send(log.shift());
  }
  else {
    res.send({ type : 'empty' });
  }
}