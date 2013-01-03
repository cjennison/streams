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