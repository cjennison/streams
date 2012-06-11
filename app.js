var express = require('express'),
    routes  = require('./routes'),
    notify  = require('./notify'),
    reach   = require('./lib/reach');

// Possibly add DB support in future?
/*
var db = require("mysql-native").createTCPClient('instance12373.db.xeround.com', 8392); // localhost:3306 by default
db.auto_prepare = true;
function dump_rows(cmd)
{
   cmd.addListener('row', function(r) { console.dir(r); } );
}

db.auth("test", "tdr", "YdojBird");
dump_rows(db.query("select 1+1,2,3,'4',length('hello')"));
dump_rows(db.execute("select 1+1,2,3,'4',length(?)", ["hello"]));
db.close();
*/

var app = module.exports = express.createServer();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.main);

app.listen(process.env.PORT || process.env.C9_PORT || 9999);
console.log("Express server listening on port %d in %s mode",
            app.address().port, app.settings.env);

notify.listen(app);
