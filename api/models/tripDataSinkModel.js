var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TripDataSinkSchema = new Schema({
    tripId: {type: String, required: true},
    createdAt: {type: Number, required: true},
    data: {type: [new mongoose.Schema({
        activity: {type: String, required: true},
        coordinates: {type: [[Number, Number]], required: true} 
    })], required: true}
});

module.exports = mongoose.model('TripDataSink', TripDataSinkSchema);