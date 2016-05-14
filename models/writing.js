var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var writingEntry = new Schema({
  userId: {type: Schema.ObjectId, ref: 'UserSchema'},
  title: String,
  entryContent: String
});

var Writing = mongoose.model('writings', writingEntry);

// Ok, so writingEntry links them together??

// Writing makes a new collection.

module.exports = Writing;
