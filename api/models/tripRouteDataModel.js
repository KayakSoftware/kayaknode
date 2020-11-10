var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TripRouteDataSchema = new Schema({
    tripId: {type: String, required: true},
    index: {type: Number, required: true},
    data: {type: [{
        activity: {type: String, required: true},
        timestamp: {type: Number, required: true},
        coords: {type: {
            accuracy: {type: Number, required: true},
            altitude: {type: Number, required: true},
            altitudeAccuracy: {type: Number, required: true},
            heading: {type: Number, required: true},
            latitude: {type: Number, required: true},
            longitude: {type: Number, required: true},
            speed: {type: Number, required: true}
        }}
    }], required: true}
});

module.exports = mongoose.model('TripRouteData', TripRouteDataSchema);