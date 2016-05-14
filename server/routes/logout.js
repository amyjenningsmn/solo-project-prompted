var router = require('express').Router();
var path = require('path');


router.get('/', function(req, res){
  req.logout();
  res.sendFile(path.join(__dirname, '../public/views/logout.html'));
});

module.exports = router;
