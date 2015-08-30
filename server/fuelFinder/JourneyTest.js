var JourneyFactory = require('./JourneyFactory');
var _ = require('lodash');
var fs = require('fs');
var FuelWatcher = require('../fuelwatch/FuelWatcher');
var FuelStationFinder = require('./FuelFinder');
var factory = new JourneyFactory();

// A minute (1/60th of a degree) equals 1.852 km

// 427 Charles St, NORTH PERTH
// -31.922312,115.850264

// Cnr Walcott St &amp; Fitzgerald St, NORTH PERTH
// -31.923821, 115.859281

var fileReadStream = fs.createReadStream('data/ULP_2015_08_26_fuelWatchRSS.xml');
var fuelWatcher = new FuelWatcher(fileReadStream);
fuelWatcher.getPrices().then(function(prices) {
    search(prices);
});

var BUFFER = 1.0/60.0; // 1 degree-minute buffer

function search(prices) {
    factory.createDirections('9 Carmody Court, Bull Creek', '167 Loftus Street, Leederville')
        .then(function(lines) {
            if (!_.isEmpty(lines)) {
                _(lines).forEach(function(lineString) {
                    var buffer = lineString.buffer(BUFFER);
                    var matchedPrices = new FuelStationFinder(buffer, prices).getPrices();
                    console.log(matchedPrices);
                }).value();
            } else {
                console.log('no lines returned');
            }
        }).catch(function(error) {
            console.log(error);
        });
}
