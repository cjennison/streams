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
    child.stdout.on('data',
                    function (data) {
                      var str = data.toString();
                      var re  = /\[(\d)\] \"(.*)\"/;
                      var res = re.exec(str);
                      if (res !== null) {
                        log.push(res[1] + ': ' + res[2]);
                      }
                    });

    child.stdout.on('end',
                    function (data) {
                      // Move files
                      function mvError (err) {
                        if (err) throw err;
                      }
                      var base = '/home/austin/WebStuff';
                      fs.rename(base + '/StocStrFlow.png', './public/images/StocStrFlow.png', mvError);
                      fs.rename(base + '/StocStrTemp.png', './public/images/StocStrTemp.png', mvError);
                      fs.rename(base + '/StocWeather.png', './public/images/StocWeather.png', mvError);
                      log.push('images/StocStrFlow.png');
                      log.push('images/StocStrTemp.png');
                      log.push('images/StocWeather.png');
                    });
    res.send({
      status  : 0,
      message : 'Weather Model Running'
    });
  }
};