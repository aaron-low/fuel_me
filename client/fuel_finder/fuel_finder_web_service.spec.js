"use strict";

var chai = require('chai');
chai.config.includeStack = true;
var sinon = require('sinon');

var FuelFinderWebService = require('./fuel_finder_web_service');

describe('FuelFinderWebService', function () {
    it('should fill out params', function () {

        var http = {
            put: function () {
            }
        };
        var httpMock = sinon.mock(http);

        var promise = {
            then: function() {}
        };

        httpMock.expects('put').withArgs('findCheapFuel', {
            origin: 'origin',
            destination: 'destination',
            buffer: 123.0
        }).returns(promise);

        var subject = new FuelFinderWebService(http);

        subject.findCheapFuel('origin', 'destination', 123.0);

        httpMock.verify();
    });
});