"use strict";

var chai = require('chai');
chai.config.includeStack = true;
var expect = chai.expect;
var sinon = require('sinon');

var FuelPrice = require('./FuelPrice');
var FuelStation = require('./FuelStation');

describe('FuelPrice', function () {

    describe('Serialization', function () {

        it('should serialize', function () {
            var station = new FuelStation('station name', 'address', 'suburb', 1.0, 2.0);
            var price = new FuelPrice(station, 123.1, new Date('2015-08-28'));

            var json = JSON.stringify(price);

            var obj = JSON.parse(json);

            // check price and station have serialized / deserialized properly...
            expect(obj.price).to.equal(123.1);
            expect(obj.fuelStation.name).to.equal('station name');
        });

    });
});