var FuelWatcher = require('./FuelWatcher');
var fs = require('fs');

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.use(require('chai-datetime'));

var expect = chai.expect;

describe('FuelWatcher', function() {

    it('should read leederville file', function() {
        var fileReadStream = fs.createReadStream('./server/fuelwatch/fuelwatch_leederville_ulp.xml');
        var fuelWatcher = new FuelWatcher(fileReadStream);

        return fuelWatcher.getPrices().then(function(prices){
            expect(prices.length).to.be.above(0);
            var firstPrice = prices[0];
            expect(firstPrice.price).to.be.equal(121.7);
            expect(firstPrice.date).to.be.equalDate(new Date('2015-08-25'));
            expect(firstPrice.fuelStation.name).to.be.equal('Vibe Charles St');
            expect(firstPrice.fuelStation.address).to.equal('427 Charles St');
            expect(firstPrice.fuelStation.suburb).to.equal('NORTH PERTH');
            expect(firstPrice.fuelStation.lat).to.equal(-31.922312);
            expect(firstPrice.fuelStation.lng).to.equal(115.850264);
        });
    });
});


