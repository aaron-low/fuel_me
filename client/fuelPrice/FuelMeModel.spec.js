"use strict";

var chai = require('chai');
chai.config.includeStack = true;
var expect = chai.expect;
var sinon = require('sinon');

var FuelMeModel = require('./FuelMeModel');

describe('FuelMeModel', function () {

    it('should notify listeners', function() {
        var listener = {
            pricesUpdated: function() {}
        };

        var fuelMeModel = new FuelMeModel();

        var listenerMock = sinon.mock(listener);
        listenerMock.expects('pricesUpdated').withArgs(fuelMeModel);


        fuelMeModel.registerListener(listener);

        var journey = {
            line: 'line',
            prices: []
        };

        fuelMeModel.setJourneys([journey]);

        listenerMock.verify();
    });

});