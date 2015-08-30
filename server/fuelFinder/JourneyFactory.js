var GoogleMapsAPI = require('googlemaps');
var Q = require('q');
var polyline = require('polyline');
var _ = require('lodash');
var jsts = require('jsts');
var GeometryFactory = jsts.geom.GeometryFactory;

function JourneyFactory() {

    var geometryFactory = new GeometryFactory();

    var CONFIG = {
        key: 'AIzaSyARvU0JvCiPsapm2yIvFec-lwh-J0go944',
        stagger_time: 1000,
        encode_polylines: false,
        secure: true,
        proxy: ''
    };

    var gmAPI = new GoogleMapsAPI(CONFIG);

    this.createDirections = function (origin, destination) {

        // accepted params for directions
        //    "origin":         "string",
        //        "destination":    "string",
        //        "mode":           "string",
        //        "waypoints":      "string",
        //        "alternatives":   "boolean",
        //        "avoid":          "string",
        //        "language":       "string",
        //        "region":         "string",
        //        "units":          "string",
        //        "departure_time": "date",
        //        "arrival_time":   "date"
        //

        var defer = Q.defer();

        gmAPI.directions({
            'origin': origin,
            'destination': destination,
            // travel mode defaults to driving
            'units': 'metric'
        }, function (error, result) {
            if (error) {
                defer.reject(JSON.parse(error.message));
            } else {
                // We'll just grab the first line for now...
                var lines = [];

                _(result.routes).forEach(function(route) {
                    var coords = [];
                    var line = polyline.decode(route.overview_polyline.points);
                    _(line).forEach(function(p) {
                        var c = new jsts.geom.Coordinate(p[1], p[0]);
                        coords.push(c);
                    }).value();

                    var lineString = geometryFactory.createLineString(coords);
                    lines.push(lineString);
                }).value();

                /**
                 * Returns an array of line string objects
                 */
                defer.resolve(lines);
            }
        });
        return defer.promise;
    };
};

// directions response
//{ geocoded_waypoints:
//    [ { geocoder_status: 'OK',
//        place_id: 'ChIJATLDEFOlMioR8lSHXu_tNL8',
//        types: [Object] },
//        { geocoder_status: 'OK',
//            place_id: 'ChIJT3kH4rG6MioRBUNNGLi0gC8',
//            types: [Object] } ],
//        routes:
//    [ { bounds: [Object],
//        copyrights: 'Map data ©2015 Google',
//        legs: [Object],
//        overview_polyline: [Object],
//        summary: 'Charles St/State Route 60 and Ruby St',
//        warnings: [],
//        waypoint_order: [] } ],
//        status: 'OK' }

//if (result.status === 'OK') {
//    defer.resolve(result);
//} else {
//    console.log(result.message);
//    console.log(result.code);
//    //console.log(result.'[error);
//    console.log(typeof(result));
//    defer.reject(result);
//}

//console.log(result);

module.exports = JourneyFactory;