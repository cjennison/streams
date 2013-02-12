var http         = require('http'),
    express      = require('express'),
    routes       = require('./routes'),
    user_routes  = require('./routes/users'),
    mexec_routes = require('./routes/mexec'),
    basin_routes = require('./routes/basin_routes'),
    notify       = require('./lib/notify'),
    reach        = require('./lib/reach'),
    models       = require('./lib/models'),
    config       = require('./lib/config');

// Load the application configuration file:
//var streamsConfig = require('./streams.json');

// Display config file for debugging purposes:
console.log('Streams Configuration:');
console.log(config.server);

var app = module.exports = express();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  // app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session({ secret : 'streams' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.static(config.server.BasinsDir));
  app.use(express.static(config.server.UsersDir));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get ('/'          , routes.front);
app.get ('/login'     , routes.login);
app.post('/login-user', routes.login_user);
app.get ('/streams'   , routes.main);

// Routes for users:
app.get('/users/:username/runs', user_routes.getRuns);
//app.post('/user/getreefrompre',user_routes.getRunTree);
app.post('/users/script/runs',user_routes.getRunsOfAScript);
app.post('/users/script/run/result',user_routes.getRunResult);
//Routes for run Tree
app.post('/basin/user/gettreefrombasin',user_routes.getTreeFromBasin);


// Routes for mexec:
app.post('/mexec', mexec_routes.exec);

// Routes for basin:
app.get('/basin/predef'   , basin_routes.preDefinedBasins);
app.get('/basin/info/:id' , basin_routes.basinInfo);
app.get('/basin/user/list', basin_routes.userBasinList);
app.post('/basin/user/delineate', basin_routes.delineateBasin);
app.post('/basin/user/set-alias', basin_routes.addBasin_IDAlias);

//Routes for run Tree
app.post('/basin/user/gettreefrombasin',user_routes.getTreeFromBasin);

// Create the HTTP server:
var server = http.createServer(app);

server.listen(config.server.port);
console.log("Express server listening on port %d in %s mode",
            config.server.port, app.settings.env);

notify.listen(server);
