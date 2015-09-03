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

    function FuelListView(angularScope) {

        var updateSidePanel = function(fuelMeModel) {
            angularScope.journey = fuelMeModel.getSelectedJourney();
            _.defer(function(){angularScope.$apply();});
        };

        this.pricesUpdated = function(fuelMeModel) {
            var journeys = fuelMeModel.getJourneys();
            if (_.isEmpty(journeys)) {
                $.notify("That was not a valid journey", "error");
            } else {
                $.notify("Fuel locations updated", "success");
            }
            updateSidePanel(fuelMeModel);
        };

        this.journeyUpdated = function(fuelMeModel) {
            updateSidePanel(fuelMeModel);
        };

        this.priceSelected = function(fuelMeModel) {

        };
    }

    fuelMeModel.registerListener(new FuelListView($scope));

    var fuelMeController = new FuelMeController(fuelMeModel, journeyBroker);
    var mapView = new MapView(map, fuelMeController);
    fuelMeModel.registerListener(mapView);

    $scope.goClicked = function () {
        fuelMeController.findCheapFuel($scope.origin, $scope.destination, $scope.buffer);
    };

    $scope.selectPrice = function(price) {
        fuelMeController.selectPrice(price);
    };
}]);

module.exports = fuelMeApp;
