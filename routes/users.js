// Routes for the users library.
var users = require('../lib/users');

exports.getRuns = function (req, res) {
  var username = req.params.username;

 if (!username) {
    res.json({ message : 'require a username' });
  }
  else if (!users.exists(username)) {
    res.json({ message : 'user does not exist' });
  }
  else {
    var u = users.lookup(username);
    var r = u.getRuns(function (err, list) {
      res.json({ message : 'ok',
                 runs    : list });
    });
  }
};

exports.getRunResult = function(req,res){
  var user = req.session.user;
  //TODO: may be need to verify a user, but not right now.
  var result = user.getRunResult(req.param.scriptname, req.param.runID);
  if(result){
    res.json(result);
  }else{
    res.json({msg:"cannot obtain the run result"});
  }
};
/*
exports.getRunTree = function(req,res){
  var user = new users.User(req.session.user.name);
  var tree;
  if(req.body.preRunIDs){
    tree = user.getRunTree(prerunIDs);
    res.json(tree);
  }
  /*tree = {
    "34343-434":{
      model: "climate",
      scriptname: "weather_generator",
      runid: "34343-434",
      basinid:"west-brook",
      child:{
        "1234":"1234",
        "2345":"2345"
      }
    },
    "1234":{
      model: "flow",
      scriptname: "streamFlowModel",
      runid: "1234",
      basinid:"west-brook",
      child:{
      }
    }
  };
};
*/

//get basinid from request
//return a run tree with basin as root 
exports.getTreeFromBasin = function(req,res){
  var user = new users.User(req.session.user.name);
  if(!user){
    res.json('user invalid,please login');
    return;
  }
  var basinid = req.body.basinid;
  user.getRunTreeFromBasin(basinid,function(err,tree){
    if(err){
      res.json(err);
    }else{
      res.json(tree);
    }
  });
}