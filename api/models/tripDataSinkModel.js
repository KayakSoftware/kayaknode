var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TripDataSinkSchema = new Schema({
    tripId: {type: String, required: true},
    createdAt: {type: Number, required: true},
    data: {type: [{
        activity: {type: String, required: true},
        coordinates: {type: [{
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
        }], required: true},
        accelerometerData: {type: [{
            timestamp: {type: Number, required: true},
            x: {type: Number, required: true},
            y: {type: Number, required: true},
            z: {type: Number, required: true}
        }], required: false}
    }], required: true}
});

{

}

module.exports = mongoose.model('TripDataSink', TripDataSinkSchema);