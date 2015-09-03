"use strict";

require('./shim');
var _ = require('lodash');
var angular = require('angular');
var FuelFinderWebService = require('./FuelFinder/FuelFinderWebService');
var MapFactory = require('./map/MapFactory');
var MapView = require('./map/MapView');
var $ = require('jquery');
var FuelMeModel = require('./fuelPrice/FuelMeModel');
var FuelMeController = require('./fuelPrice/FuelMeController');
var JourneyBroker = require('./fuelPrice/JourneyBroker');

var fuelMeApp = angular.module('deviceApp', []);

var fuelMeModel = new FuelMeModel();

fuelMeApp.factory('fuelFinderWebService', ['$http', function ($http) {
    return new FuelFinderWebService($http);
}]);

fuelMeApp.controller('JourneyController', ['$scope', 'fuelFinderWebService', function ($scope, fuelFinderWebService) {

    $scope.origin = '';
    $scope.destination = '';
    $scope.buffer = 0;

    var mapDom = $('#appMap');
    var map = new MapFactory().createMap(mapDom[0]);

    var journeyBroker = new JourneyBroker(fuelFinderWebService);

    function FuelListView() {
        this.pricesUpdated = function(fuelMeModel) {
            var journeys = fuelMeModel.getJourneys();
            if (_.isEmpty(journeys)) {
                $.notify("That was not a valid journey", "error");
            } else {
                $.notify("Fuel locations updated", "success");
            }
        };

        this.journeyUpdated = function(fuelMeModel) {
            $scope.journey = fuelMeModel.getSelectedJourney();
            _.defer(function(){$scope.$apply();});
        };
    }

    fuelMeModel.registerListener(new FuelListView());

    var fuelMeController = new FuelMeController(fuelMeModel, journeyBroker);
    var mapView = new MapView(map, fuelMeController);
    fuelMeModel.registerListener(mapView);

    $scope.goClicked = function () {
        fuelMeController.findCheapFuel($scope.origin, $scope.destination, $scope.buffer);
    };
}]);

module.exports = fuelMeApp;
