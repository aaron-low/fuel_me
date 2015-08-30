/**
 * Created by aaron on 27/08/15.
 */

function FuelFinderWebService($http) {

    this.findCheapFuel = function (origin, destination, buffer) {
        return $http.put('findCheapFuel', {origin: origin, destination: destination, buffer: buffer})
            .then(function (response) {
                return response.data;
            });
    };
}

module.exports = FuelFinderWebService;