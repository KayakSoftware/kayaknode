var axios = require("axios")
var mongoose = require('mongoose')
  Trip = mongoose.model('Trip');

  exports.getAllTrips = async (req, res) => {
      console.log("getAllTrips")

      let trips = await Trip.find({});
      return res.send(trips);
  }

  exports.getTrip = async (req, res) => {
      console.log("getTrip")
      let {id} = req.params;

      let document = await Trip.findById(id);

      return res.send(document);
  }

  exports.createTrip = async (req, res) => {
    console.log("createTrip")

    try {
      let result = await Trip.create({
        startTime: new Date().getTime(),
        tripStatus: "Active"
      })
      return res.send(result)
    } catch (err) {
      return res.err(err)
    }
  }

  exports.endTrip = async (req, res) => {
    console.log("endTrip")
    console.log("req:", req.params)
    // Find document
    let { id } = req.params;
    
    let document = await Trip.findById(id);

    // Set updates and save
    document.tripStatus = "Ended";
    document.endTime = new Date().getTime();
    console.log(document)
    try {
      await document.save();
      return res.send(true);
    } catch(err) {
      console.log(err)
      return res.send(false);
    }
  }

  exports.updateTripActivity = async (req, res) => {
    
    let { id } = req.params;
    console.log(req.body);

    let data = [];

    for(let i = 0; i < req.body.data.accelerometerData.length; i++) {
      data.push({
        xAxis: req.body.data.accelerometerData[i].accelerations.x,
        yAxis: req.body.data.accelerometerData[i].accelerations.y,
        zAxis: req.body.data.accelerometerData[i].accelerations.z
      })
    }

    var result = await axios.post("http://127.0.0.1:5000/predict", {
      data: data
    })

    let predictionResults = []

    for(let i = 0; i < result.data.predictions.length; i++) {
      let predictionResult = {
        activity: result.data.predictions[i][0],
        confidence: result.data.predictions[i][1]
      }
      predictionResults.push(predictionResult)
    }

    console.log(predictionResults)
    
    return res.send(predictionResults)
  }