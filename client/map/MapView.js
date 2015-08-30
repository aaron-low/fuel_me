"use strict";

var L = require('leaflet');
var _ = require('lodash');

function MapView(map) {

    var markerLayer = new L.FeatureGroup();
    var geoJsonLayer = new L.geoJson();
    map.addLayer(markerLayer);
    map.addLayer(geoJsonLayer);

    this.drawOverlay = function(prices, lineGeoJson) {
        // Draw the markers in the model.
        // Can add smarts in to do diffs etc
        markerLayer.clearLayers();
        geoJsonLayer.clearLayers();

        var feature = {
            "type": 'Feature',
            "properties": {
                "name": "Your journey",
                "popupContent": "There is your journey"
            },
            "geometry": lineGeoJson
        };
        geoJsonLayer.addData(feature);

        _(prices).forEach(function(price) {
            var s = price.fuelStation;
            var latLng = L.latLng(s.lat, s.lng);
            var m = new L.marker(latLng,
                {
                    draggable: false
                }
            );
            markerLayer.addLayer(m);
        }).value();

        // no time out causes the map to freeze
        setTimeout(function() {
            map.fitBounds(markerLayer.getBounds());
        }, 1000);
    };
}

module.exports = MapView;