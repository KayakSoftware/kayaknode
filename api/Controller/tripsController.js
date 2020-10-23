var mongoose = require('mongoose'),
  Trip = mongoose.model('trips');

  exports.getAllTrips = (req, res) => {
      console.log('All trips')
      let trips = Trip.find();
      return res.send(trips);
  }

  exports.getTrip = (req, res) => {
      console.log('One trip')
      let {id} = req.params;
      return res.send(id);
  }

  exports.createTrip = (req, res) => {
      console.log('Create Trip')

      
  }