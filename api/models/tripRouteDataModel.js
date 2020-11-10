var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TripRouteDataSchema = new Schema({
    tripId: {type: String, required: true},
    index: {type: Number, required: true},
    data: {type: [new mongoose.Schema({
        activity: {type: String, required: true},
        coordinates: { type: [[Number, Number]], required: true}
    })], required: true}
});

module.exports = mongoose.model('TripRouteData', TripRouteDataSchema);