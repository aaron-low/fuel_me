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
    // $scope.buffer = 0.5;

    var mapDom = $('#appMap');
    var map = new MapFactory().createMap(mapDom[0]);

    var journeyBroker = new JourneyBroker(fuelFinderWebService);

    var fuelMeView = {
        errorMsg: function(error) {
            console.log(error);
        }
    };

    function FuelListView() {
        this.refresh = function(fuelMeModel) {
            $scope.journey = fuelMeModel.getSelectedJourney();
            _.defer(function(){$scope.$apply();});
        };
    }

    fuelMeModel.registerListener(new FuelListView());

    var fuelMeController = new FuelMeController(fuelMeView, fuelMeModel, journeyBroker);
    var mapView = new MapView(map, fuelMeController);
    fuelMeModel.registerListener(mapView);

    $scope.goClicked = function () {
        fuelMeController.findCheapFuel($scope.origin, $scope.destination, $scope.buffer);
    };
}]);

module.exports = fuelMeApp;
