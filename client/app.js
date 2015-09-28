"use strict";

require('./shim');
var angular = require('angular');
var FuelFinderWebService = require('./fuel_finder/fuel_finder_web_service');
var MapFactory = require('./map/map_factory');
var $ = require('jquery');

var fuelMeApp = angular.module('fuelMeApp', []);

// fuelMeApp.directive('helloWorld', require('./directive/hello_world'));
fuelMeApp.service('fuelMeModel', require('./fuel_price/fuel_me_model'));

fuelMeApp.factory('fuelFinderWebService', ['$http', function ($http) {
    return new FuelFinderWebService($http);
}]);

fuelMeApp.factory('fuelMeMap', function() {
    var mapDom = $('#appMap');
    return new MapFactory().createMap(mapDom[0]);
});

fuelMeApp.service('mapView', require('./map/map_view'));
fuelMeApp.service('journeyBroker', require('./fuel_price/journey_broker'));
fuelMeApp.service('fuelMeController', require('./fuel_price/fuel_me_controller'));
fuelMeApp.controller('findFuelController', require('./fuel_finder/find_fuel_controller'));
fuelMeApp.controller('fuelListController', require('./fuel_price/fuel_list_controller'));
fuelMeApp.controller('mapController', require('./map/map_controller'));

module.exports = fuelMeApp;
