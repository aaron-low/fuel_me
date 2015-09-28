

function MapController(mapView, fuelMeModel) {
    "use strict";
    fuelMeModel.registerListener(mapView);
}

MapController.$inject = ['mapView', 'fuelMeModel'];

module.exports = MapController;