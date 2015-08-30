var _ = require('lodash');
var jsts = require('jsts');

function FuelFinderService(fuelFinder, journeyFactory) {

    this.findCheapFuel = function (req, res) {

        var origin = req.body.origin;
        var destination = req.body.destination;
        var bufferKm = req.body.buffer;

        // should probably move this elsewhere...
        var bufferDegrees = bufferKm / (1.85532 * 60);

        journeyFactory.createDirections(origin, destination)
            .then(function (lines) {
                if (!_.isEmpty(lines)) {
                    _(lines).forEach(function (lineString) {
                        var matchedPrices = fuelFinder.getPrices(lineString, bufferDegrees);
                        res.contentType('json');
                        var result = {
                            line: new jsts.io.GeoJSONWriter().write(lineString),
                            prices: matchedPrices
                        };
                        res.send(JSON.stringify(result));
                    }).value();
                } else {
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
