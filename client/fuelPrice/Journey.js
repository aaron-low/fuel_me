"use strict";

function Journey(line, prices) {
    // geo json line for journey
    this.line = line;
    // array of prices
    this.prices = prices;
}

module.exports = Journey;