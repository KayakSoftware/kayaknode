var express = require('express'),
  app = express(),
  port = 5555,
  mongoose = require('mongoose'),
  Trip = require('./api/models/tripModel'), //created model loading here
  bodyParser = require('body-parser');
  

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose
    .connect(`mongodb://${process.env.DB_HOST || 'localhost'}:9999/tripdatabase`, { useUnifiedTopology: true, useNewUrlParser: true  })
    .catch(e => {
        console.error('Connection error', e.message)
    })

// assign db connection to variable so we can check once open or error
let db = mongoose.connection;

// once connection is open you'll get success messsage
db.once('open', () => console.log('connected to the database'));


var routes = require('./api/routes/tripRoutes'); //importing route
routes(app); //register the route


app.listen(port);


console.log('Trip RESTful API server started on: ' + port);