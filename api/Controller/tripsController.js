var mongoose = require('mongoose'),
  Trip = mongoose.model('Trips');

  exports.getAllTrips = (req, res) => {
      console.log('All trips')
      return res.send('All trips')
  }

  exports.getTrip = (req, res) => {
      console.log('One trip')
      let {id} = req.params;
      return res.send(id);
  }

  exports.createTrip = (req, res) => {
      console.log('Create Trip')
      
  }