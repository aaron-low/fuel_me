"use strict";

var chai = require('chai');
chai.config.includeStack = true;
var expect = chai.expect;
var sinon = require('sinon');
var Q = require('q');

var JourneyBroker = require('./journey_broker');

describe('JourneyBroker', function () {

    var fuelFinderWebService, fuelFinderWebServiceMock;

    beforeEach(function() {
        fuelFinderWebService = {
            findCheapFuel: function() {}
        };
        fuelFinderWebServiceMock = sinon.mock(fuelFinderWebService);
    });

    it('should get journey', function() {

        var deferred = Q.defer();
        deferred.resolve([{
            line: 'line',
            prices: [{ price: 123 }]
        }]);

        fuelFinderWebServiceMock.expects('findCheapFuel')
            .withArgs('origin','destination', 12).returns(deferred.promise);

        var subject = new JourneyBroker(fuelFinderWebService);

        return subject.findCheapFuel('origin', 'destination', 12).then(function(journeys) {
            expect(journeys[0].line).to.equal('line');
            expect(journeys[0].prices[0].price).to.equal(123);
            expect(journeys[0].prices[0].isLowest).to.equal(true);
            fuelFinderWebServiceMock.verify();
        });
    });

    it('should bubble up error', function() {

        var deferred = Q.defer();
        deferred.reject(
            'error occured'
        );

        fuelFinderWebServiceMock.expects('findCheapFuel')
            .withArgs('origin','destination', 12).returns(deferred.promise);

        var subject = new JourneyBroker(fuelFinderWebService);

        return subject.findCheapFuel('origin', 'destination', 12).then(function(data) {
            expect(data.length).to.equal(0);
        });
    });
});