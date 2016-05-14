var router = require('express').Router();
var Writing = require('../../models/writing');

router.get('/allFromUser', function(request, response, next){
    Writing.find({ 'userId': request.user.id }, function(err, entries){
      if (err) {
        console.log(err);
        response.sendStatus(500);
      } else {
        response.send(entries);
      }
    })
})

router.get('/singleView/:id', function(request, response, next){
  console.log('This is the request.user sent to /singleView:', request.user);
  console.log('This is the request.url:', request.url);
  console.log('This is the request.params:', request.params);
  Writing.find({ '_id': request.params.id }, function(err, entry){
    console.log('This is the entry found:', entry);
    if (err) {
      console.log(err);
      response.sendStatus(500);
    } else {
      response.send(entry);
    }
  })
})

router.delete('/deleteOne/:id', function(request, response, next){
  console.log('Delete request received');
  Writing.findOneAndRemove({ '_id': request.params.id}, function(err, writing){
    if (err){
      console.log(err);
    } else {
      console.log('Writing selection deleted:', writing);
      response.sendStatus(200);
    }
  });
});


module.exports = router;
