var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TripSchema = new Schema({
  startTime: {type: Number, required:true}, 
  endTime: {type: Number, required:false},
  tripStatus: {type: String, required: true}, // Active, Stopped, Analyzing
  distanceTotal: {type: Number, required: false},
  averageSpeed: {type: Number, required: false},
  distanceWater: {type: Number, required: false},
  averageSpeedWater: {type: Number, required: false},
  distanceLand: {type: Number, required: false},
  averageSpeedLand: {type: Number, required: false}
});

module.exports = mongoose.model('Trip', TripSchema);