var mod  = require('../lib/models');
var user = require('../lib/users');

setTimeout(function () {
  var u = user.lookup('testuser1');
  mod.buildRunTree(u, 'west_brook');
}, 2000);
