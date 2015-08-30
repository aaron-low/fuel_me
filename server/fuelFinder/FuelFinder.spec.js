var chai = require('chai');
var expect = chai.expect;
var jsts = require('jsts');
var GeometryFactory = jsts.geom.GeometryFactory;
var Coordinate = jsts.geom.Coordinate;
var _ = require('lodash');

var FuelFinder = require('./FuelFinder');

describe('FuelFinder', function () {

    var BUFFER = 1.0/60.0;

    var prices = [];
    var geometryFactory = new GeometryFactory();

    var fakePrice = function (name, price, lat, lng) {
        return {
            price: 123.0,
            fuelStation: {
                name: name,
                lat: lat,
                lng: lng
            }
        };
    };

    var searchPoly = function(points) {
        var coords = [];
        _(points).forEach(function(p) {
            coords.push(new Coordinate(p[0], p[1]));
        }).value();
        var linearRing = geometryFactory.createLinearRing(coords);
        return geometryFactory.createPolygon(linearRing);
    };


    beforeEach(function () {
        prices.push(
            fakePrice('1', 123.0, -31.922312, 115.850264),
            fakePrice('2', 144.0, -32.922312, 116.850264)
        );
    });

    it('should match one', function () {
        var poly = searchPoly([[115, -31.0], [116.0, -31.0], [116.0, -32.0], [115.0, -32.0], [115, -31.0]]);
        var subject = new FuelFinder(prices);
        var matchingPrices = subject.getPrices(poly, BUFFER);
        expect(matchingPrices.length).to.equal(1);
        var price = matchingPrices[0];
        expect(price.price).to.equal(123.0);
        expect(price.fuelStation.name).to.equal('1');
    });

    it('should match zero', function () {
        // send the search poly to the northern hemisphere..
        var poly = searchPoly([[115, 31.0], [116.0, 31.0], [116.0, 32.0], [115.0, 32.0], [115, 31.0]]);
        var subject = new FuelFinder(prices);
        expect(subject.getPrices(poly, BUFFER).length).to.equal(0);
    });

    it('should fail to construct because of missing arg', function() {
        var ctor = function() {
            new FuelFinder();
        }
        expect(ctor).to.throw(Error);
    });

    it ('should fail to get prices because of missing arg', function() {
        var subject = new FuelFinder([1]);
        expect(subject.getPrices).to.throw(Error);
    })
});