"use strict";

var L = require('leaflet');
require('leaflet_google');

function MapFactory() {
    this.createMap = function (mapElementId) {
        var map = L.map(mapElementId).setView([-31.9522, 115.8589], 13);
        var googleLayer = new L.Google('ROADMAP');
        map.addLayer(googleLayer);
        return map;
    };
}


module.exports = MapFactory;