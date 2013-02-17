var user = require('../lib/users');
var runs = require('../lib/runs');

// We need to delay the test to give the user library
// time to load up the user database:
setTimeout(function () {
  // (1) get a user:
  var u = user.lookup('testuser1');
  console.log('user : ' + u);

  // (3) get the climate runs:
  u.getRuns('climate', function (err, list) {
    if (err) {
      console.log(err);
    }
    else {
      for(var i = 0; i < list.length; i++) {
	console.log(list[i]);
      }
    }
  });
}, 2000);


