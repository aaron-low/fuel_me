'use strict';
// This is the PROD server config file used to serve your AngularJS app on a service like Heroku

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var server = require('http').createServer(app);

app.set('port', (process.env.PORT || 3000));

app.use(express.static('dist'));

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

server.listen(app.get('port'), function () {
    console.log("Node app is running at localhost:" + app.get('port'));
});



// construct our service...

var FuelFinderService = require('./fuelFinder/FuelFinderService');
var JourneyFactory = require('./fuelFinder/JourneyFactory');
var FuelFinder = require('./fuelFinder/FuelFinder');

var FuelWatcher = require('./fuelwatch/FuelWatcher');
var fs = require('fs');

var fileReadStream = fs.createReadStream('./data/ULP_2015_08_26_fuelWatchRSS.xml');
var fuelWatcher = new FuelWatcher(fileReadStream);

fuelWatcher.getPrices().then(function(prices){
    var fuelFinder = new FuelFinder(prices, 1.0/60.0);
    var journeyFactory = new JourneyFactory();
    var fuelFinderService = new FuelFinderService(fuelFinder, journeyFactory);

    app.put('/findCheapFuel', fuelFinderService.findCheapFuel.bind(fuelFinderService));
}).catch(function(error) {
    throw new Error("Could not instantiate fuelwatch prices " + error.message);
});



