var FeedParser = require('feedparser');
var Q = require('q');

var FuelStation = require('../domain/FuelStation');
var FuelPrice = require('../domain/FuelPrice');

function FuelWatcher(readable) {
    var feedparser = new FeedParser();
    readable.pipe(feedparser);

    var deferredPrices = Q.defer();

    feedparser.on('error', function(error) {
        deferredPrices.reject(error);
    });

    var prices = [];

    feedparser.on('readable', function() {
        // This is where the action is!
        var stream = this;
        // var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
        var item;

        while (item = stream.read()) {
            // do parsing n stuff in here
            // FuelStation(name, address, lat, lng)
            var station = new FuelStation(
                item['rss:trading-name']['#'],
                item['rss:address']['#'],
                item['rss:location']['#'],
                parseFloat(item['rss:latitude']['#']),
                parseFloat(item['rss:longitude']['#'])
            );
            // FuelPrice(fuelStation, price, date) {
            var price = new FuelPrice(
                station,
                parseFloat(item['rss:price']['#']),
                new Date(item['rss:date']['#'])
            );

            prices.push(price);
        }
    });


    feedparser.on('end', function() {
        deferredPrices.resolve(prices);
    });


    this.getPrices = function() {
        return deferredPrices.promise;
    };
};

module.exports = FuelWatcher;