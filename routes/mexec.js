var users = require('lib/users');
var mexec = require('lib/mexec');

// Routes for the mexec library.
exports.exec = function (req, res) {
  var settings = req.body;
  var user     = req.session.user;  // TODO: assign user (login?)
  // TODO:
  // - get the user
  // - get a new run directory
  // - create settings file
  // - call mexec.runModels
};