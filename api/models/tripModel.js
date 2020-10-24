var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TripSchema = new Schema({
  startTime: {type: Number, required:true},
  tripStatus: {type: String, required: true}, // Active, Ended,
  endTime: {type: Number, required:false}
});

module.exports = mongoose.model('trips', TripSchema);