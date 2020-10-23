module.exports = function(app) {
    var trips = require('../Controller/tripsController');

    app.route('/trips')
    .get(trips.getAllTrips)
    .post(trips.createTrip);

    app.route('/trips/:id')
    .get(trips.getTrip);

};