"use strict";

require('./shim');
var angular = require('angular');
var FuelFinderWebService = require('./FuelFinder/FuelFinderWebService');
var MapFactory = require('./map/MapFactory');
var MapView = require('./map/MapView');
var $ = require('jquery');

var fuelMeApp = angular.module('deviceApp', []);


fuelMeApp.factory('fuelFinderWebService', ['$http', function ($http) {
    return new FuelFinderWebService($http);
}]);

fuelMeApp.controller('JourneyController', ['$scope', 'fuelFinderWebService', function ($scope, fuelFinderWebService) {

    $scope.origin = '11 poso place, atwell';
    $scope.destination = '167 loftus street, leederville';
    $scope.buffer = 0.5;

    var mapDom = $('#appMap');
    console.log(mapDom);
    var map = new MapFactory().createMap(mapDom[0]);
    var mapView = new MapView(map);

    $scope.goClicked = function () {
        fuelFinderWebService.findCheapFuel($scope.origin, $scope.destination, $scope.buffer)
            .then(function (data) {
                var prices = data.prices;
                mapView.drawOverlay(prices, data.line);
                $scope.prices = prices;
            }).catch(function (error) {
                $scope.result = error;
            });
    };
}]);

module.exports = fuelMeApp;
