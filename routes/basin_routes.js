var basin = require('../lib/basin');

// preDefinedBasins returns to the client a list of JSON objects that
// represent the predefined basins.
exports.preDefinedBasins = function (req, res) {
  basin.preDefinedBasins(function (err, basins) {
    if (err) {
      console.log('Error retrieving predefined basins!');
      console.log(err.msg);
      res.json(err);
    }
    else {
      res.json(basins);
    }
  });
};

// basinInfo returns to the client information for a basin given its
// id.
exports.basinInfo = function (req, res) {
  var id = req.params.id;
  basin.basinInfo(id, function (err, basin) {
    if (err) {
      console.log('Error retrieving basin ' + id + '!');
      console.log(err.msg);
      res.json(err);
    }
    else {
      res.json(basin);
    }
  });
};

// userBasinList returns to the client the list of basins for a
// particular user and their aliases.
exports.userBasinList = function (req, res) {
  var user = req.session.user;
  basin.userBasinList(user, function (err, basins) {
    if (err) {
      console.log('Error retrieving all basins!');
      console.log(err.msg);
      res.json(err);
    }
    else {
      res.json(basins);
    }    
  });
};