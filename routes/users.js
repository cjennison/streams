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