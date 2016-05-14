var router = require('express').Router();
var path = require('path');
var passport = require('passport');

router.get('/', function(request, response, next){
  response.sendFile(path.join(__dirname, '../public/views/home.html'));
})

module.exports = router;
