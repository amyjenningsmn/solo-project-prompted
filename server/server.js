var express = require('express');
var session = require('express-session');
// var flash = require('connect-flash');
// ^^^ stretch goal would be getting alerts working
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
// Req Routes
var login = require('./routes/login');
var register = require('./routes/register');
var home = require('./routes/home');
var store = require('./routes/store');
var library = require('./routes/library');
var logout = require('./routes/logout');
// Req Models
var User = require('../models/user');
var Writing =require('../models/writing');

var app = express();

//Mongo setup
// var mongoURI = "mongodb://localhost:27017/prompted";
var mongoURI = process.env.MONGODB_URI;
var MongoDB = mongoose.connect(mongoURI).connection;

MongoDB.on('error', function(err){
  console.log('mongodb connection error', err);
});

MongoDB.once('open', function(){
  console.log('mongodb connection open');
});

// *** Lots of comments to understand functionality, need to remove before deployment ***

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// Config our session
app.use(session({
  secret: 'secret',
  // ^^ change this before deployment, ask for more info from instructor
  resave: true,
  saveUninitialized: false,
  cookie: {maxage: 600000, secure: false}
}))
// *** stretch goal to add flash messages, need to come back to this to make it work, read docs ***
// app.use(flash());

// This needs to happen after config
app.use(passport.initialize());
app.use(passport.session());

// I have a note in my previous passport lecture:
// 'We should always use local in development' - what do we do in production?

passport.use('local', new localStrategy({
  passReqToCallback: true,
  usernameField: 'username'
  },
  function(request, username, password, done){
    console.log('CHECKING PASSWORD');
    User.findOne({ username: username }, function(err, user){
      if (err) {
        console.log(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username or password.'});
        // flash message dealing with authentication
        // I can read docs to find out.
      }

      user.comparePassword(password, function(err, isMatch){
        if (err) {
          console.log(err);
        }
        if (isMatch){
          console.log('user:', user.username, 'user _id:', user._id);
          return done(null, user);
        } else {
          done(null, false, { message: 'Incorrect username or password.' });
        }
      });
    });
  }));


    // Then create the rest of the function for authenticating users. Serialize and deserialize allow user information to be stored and retrieved from session. Dehydrate/hydrate.

    passport.serializeUser(function(user, done) {
      console.log('Hit serializeUser');
       done(null, user.id); // just sends back the user.id (dehydrates it)
    });

    passport.deserializeUser(function(id, done) {
      console.log('Hit deserializeUser');
       User.findById(id, function(err, user){
           if(err){
            done(err);
          } else {
            var userWithoutPassword= {
              username: user.username,
              id: user._id
              }
            done(null, userWithoutPassword);
          }
        });  // now has access to everything, rehydrates it for access to db
    });


// Routes
app.use(express.static('server/public'));
app.use('/', login);
app.use('/auth', login);
app.use('/register', register);
app.use('/home', home);
// ^^ this is the 'port' for all the ng-views coming in and out.
app.use('/store', store);
app.use('/library', library);
app.use('/logout', logout);

// Heroku ready
var portDecision = process.env.PORT || 3000;
var server = app.listen(portDecision, function(){
  var port = server.address().port;
  console.log('Listening on port', port);
});
