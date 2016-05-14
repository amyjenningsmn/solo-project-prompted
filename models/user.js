var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
  username: {type: String, required: true, index: { unique: true } },
  // joel lecture: username: {type: String, required: true, unique: true },
  password: {type: String, required: true }
});

// read up on rainbow table attacks and brute-force attacks - bcrypt and SALT_WORK_FACTOR

UserSchema.pre('save', function(next) {
  // runs prior to saving a value into db
  console.log('Running presave user function');

  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')){
    return next();
    // the next() is very important, or it won't move on to saving
  };

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if(err) {
      return next(err);
    };

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, function(err, hash){
      if (err) {
        return next(err);
      };

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

// Convenience method for comparing passwords
UserSchema.methods.comparePassword = function(candidatePassword, done) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    if(err){
      return done(err);
    } else {
    done(null, isMatch);
    }
  });
};



module.exports = mongoose.model('user', UserSchema);
