"use strict";

var _ = require('lodash');

function Journey(line, prices) {
    // geo json line for journey
    this.line = line;
    // array of prices
    this.prices = prices;
    if (this.prices.length) {
        this.prices[0].isLowest = true;
    }
}

module.exports = Journey;