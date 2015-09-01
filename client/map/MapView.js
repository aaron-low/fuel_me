"use strict";

var L = require('leaflet');
var _ = require('lodash');

function MapView(map, fuelMeController) {

    var markerLayer = new L.FeatureGroup();

    function journeyFeatureClicked(e) {
        fuelMeController.selectJourney(e.target.feature.properties.journeyObject);
    }

    function onEachFeature(feature, layer) {
        //bind click
        layer.on({
            click: journeyFeatureClicked
        });
    }

    var geoJsonLayer = new L.geoJson([], {
        onEachFeature: onEachFeature,
        style: function (feature) {
            if (feature.properties.journeyObject.selected) {
                return {color: 'blue'};
            } else {
                return {color: 'grey'};
            }
        }
    });
    map.addLayer(markerLayer);
    map.addLayer(geoJsonLayer);

    this.refresh = function (fuelMeModel) {

        var journeys = fuelMeModel.getJourneys();

        // Draw the markers in the model.
        // Can add smarts in to do diffs etc
        markerLayer.clearLayers();
        geoJsonLayer.clearLayers();

        _(journeys).forEach(function (journey) {
            var feature = {
                "type": 'Feature',
                "properties": {
                    "name": "Your journey",
                    "popupContent": "There is your journey",
                    "journeyObject": journey
                },
                "geometry": journey.line
            };
            geoJsonLayer.addData(feature);

            _(journey.prices).forEach(function (price) {
                var s = price.fuelStation;
                var latLng = L.latLng(s.lat, s.lng);
                var m = new L.Marker.Text(latLng,
                    '' + price.price,
                    {
                        draggable: false
                    }
                );

                var compiled = _.template('<div><b>${ name } - ${ price } c/L</b></div>' +
                    '<div>${ address }</div><div>${ suburb }</div>');
                m.bindPopup(compiled({
                    name: price.fuelStation.name,
                    price: price.price,
                    address: price.fuelStation.address,
                    suburb: price.fuelStation.suburb
                }));
                markerLayer.addLayer(m);
            }).value();
        }).value();

        // no time out causes the map to freeze
        setTimeout(function () {
            map.fitBounds(geoJsonLayer.getBounds());
        }, 1000);
    };
}

module.exports = MapView;