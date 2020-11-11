var axios = require("axios")
var mongoose = require('mongoose')
  Trip = mongoose.model('Trip');
  Sink = mongoose.model('TripDataSink')
  TripRoute = mongoose.model('TripRouteData')

  exports.getAllTrips = async (req, res) => {
      console.log("getAllTrips")

      let trips = await Trip.find({});
      return res.send(trips);
  }

  exports.getTrip = async (req, res) => {
      console.log("getTrip")
      let {id} = req.params;

      let document = await Trip.findById(id);
      let routeData = await TripRoute.find({
        tripId: id
      })

      let coordinates = []

      for(let i = 0; i < routeData.length; i++) {
        for(let j = 0; j< routeData[i].data.length; j++) {
          coordinates.push(routeData[i].data[j])
        }
      }

      console.log(coordinates)

      return res.send({
        trip: document,
        coordinates: coordinates
      });
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
    document.tripStatus = "Analyzing";
    document.endTime = new Date().getTime();
    
    
    try {
      await document.save();
      res.send(true);
      processData(id);

    } catch(err) {
      console.log(err)
      return res.send(false);
    }
  }


  processData = async (tripId) => {

    // Find all routeData for current tripId.

    var sinkData = await Sink.find({
      tripId: tripId
    })

    if(sinkData.length === 0) {
      console.log("Empty trip")
      // Update with empty trip
    }

    // Sort the sinkData array according to createdAt timestamp
    let sortedSink = sinkData.sort((a,b) => a.createdAt - b.createdAt);

    let chronologicalCoordinates = [];

    for(let i = 0; i < sortedSink.length; i++) {
      let sink = sortedSink[i]
      for(let j = 0; j < sink.data.length; j++) {
        let data = sink.data[j];
        for(let h = 0; h < data.coordinates.length; h++) {
          chronologicalCoordinates.push({
            timestamp: data.coordinates[h].timestamp,
            activity: data.activity,
            coords: data.coordinates[h].coords
          })
        }
      }
    }

    /* Do calculations on total length, length in water, length on land etc.
     * All post proceesing and stuff should be done here and when completed store the final result in 
     * tripRouteDataModel. Also length and average speed calculations could be done here
     */

    // Store processed data in routeData
    var result = await TripRoute.create({
      tripId: tripId,
      index: 0,
      data: chronologicalCoordinates
    })

    // Remove all the tripData from the sink
    var deleteResult = await Sink.deleteMany({tripId: tripId});
    console.log(deleteResult);

    // Set trip to stopped
    let document = await Trip.findById(tripId);
    document.tripStatus = "Stopped"
    document.distanceTotal = 0;
    document.averageSpeed = 0;
    document.distanceWater = 0;
    document.averageSpeedWater = 0;
    document.distanceLand = 0;
    document.averageSpeedLand = 0;
    await document.save()
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

    let highestConfidence = null;

    for(let i = 0; i < predictionResults.length; i++) {
      if(!highestConfidence) {
        highestConfidence = predictionResults[i];
        continue;
      }

      if(highestConfidence.confidence > predictionResults[i].confidence) {
        highestConfidence = predictionResults[i];
      }
    }

    let o = {
      tripId: id,
      createdAt: new Date().getTime(),
      data: [{
          activity: highestConfidence.activity,
          coordinates: req.body.data.gpsData.map(gps => {
            return {
              timestamp: gps.location.timestamp,
              coords: {
                accuracy: gps.location.coords.accuracy,
                altitude: gps.location.coords.altitude,
                altitudeAccuracy: gps.location.coords.altitudeAccuracy,
                heading: gps.location.coords.heading,
                latitude: gps.location.coords.latitude,
                longitude: gps.location.coords.longitude,
                speed: gps.location.coords.speed
              }
            }
          }),
          accelerometerData: req.body.data.accelerometerData.map(data => {
            return {
              timestamp: data.timestamp,
              x: data.accelerations.x,
              y: data.accelerations.y,
              z: data.accelerations.z
            }
          })
        },
      ]
    }

    // Update sink
    try {
      var sinkResult = Sink.create(o)
    } catch (err) {
      console.err(err);
    }

    return res.send(predictionResults)
 }
