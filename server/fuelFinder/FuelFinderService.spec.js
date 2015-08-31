"use strict";

var Q = require('q');
var chai = require('chai');
chai.config.includeStack = true;
var expect = chai.expect;
var sinon = require('sinon');
var jsts = require('jsts');

var FuelFinderService = require('./FuelFinderService');

describe('FuelFinderService', function () {

    describe('fuel price search', function () {

        var fuelFinder = {
            getPrices: function () {
            }
        };
        var journeyFactory = {
            // returns a promise
            createDirections: function () {
            }
        };


        beforeEach(function () {

        });

        it('should get me some prices', function () {

            var coords = [ new jsts.geom.Coordinate(1,2), new jsts.geom.Coordinate(3,4)];
            var lineString = new jsts.geom.GeometryFactory().createLineString(coords);

            var defer = Q.defer();

            var journeyFactoryStub = sinon.stub(journeyFactory, 'createDirections', function () {
                defer.resolve([lineString]);
                return defer.promise;
            }).withArgs('origin', 'destination');

            var fuelFinderStub = sinon.stub(fuelFinder, 'getPrices', function () {
                return ['price1'];
            }).withArgs(lineString, 0.008983176307411479);

            var subject = new FuelFinderService(fuelFinder, journeyFactory);

            var req = {
                body: {
                    origin: 'origin',
                    destination: 'destination',
                    buffer: 1.0
                }
            };
            var res = {
                contentType: function () {
                },
                send: function () {
                },
                status: function () {
                }
            };

            var resMock = sinon.mock(res);
            resMock.expects('contentType').withArgs('json');

            var expectedJson = JSON.stringify([{
                line: { type: 'LineString', coordinates: [ [ 1, 2 ], [ 3, 4 ] ] },
                prices: ['price1']
            }]);

            resMock.expects('send').withArgs(expectedJson);

            subject.findCheapFuel(req, res);

            expect(journeyFactoryStub.called).to.be.true;

            return defer.promise.then(function () {
                expect(fuelFinderStub.called).to.be.true;
                resMock.verify();
            });
        });

    });
});