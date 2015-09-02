var _ = require('lodash');
var jsts = require('jsts');

function FuelFinderService(fuelFinder, journeyFactory) {

    var MINIMUM_BUFFER = 0.05;

    this.findCheapFuel = function (req, res) {

        var origin = req.body.origin;
        var destination = req.body.destination;
        var bufferKm = req.body.buffer;

        // should probably move this elsewhere...
        var bufferDegrees = (bufferKm + MINIMUM_BUFFER) / (1.85532 * 60);

        journeyFactory.createDirections(origin, destination)
            .then(function (lines) {
                if (!_.isEmpty(lines)) {
                    var result = [];
                    _(lines).forEach(function (lineString) {
                        var matchedPrices = fuelFinder.getPrices(lineString, bufferDegrees);
                        res.contentType('json');
                        var journey = {
                            line: new jsts.io.GeoJSONWriter().write(lineString),
                            prices: matchedPrices
                        };
                        result.push(journey);
                    }).value();
                    res.send(JSON.stringify(result));
                } else {
                    res.status(400);
                    res.contentType('json');
                    res.send(JSON.stringify('Not a valid journey'));
                }
            }).catch(function (error) {
                res.status(500);
                res.contentType('json');
                res.send(JSON.stringify(error.message));
            });
    };
}

module.exports = FuelFinderService;
