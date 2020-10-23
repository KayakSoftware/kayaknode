var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TripSchema = new Schema({
  user: {type:String, required:true},
  id: {type: Number, required:true},

});

module.exports = mongoose.model('trips', TripSchema);