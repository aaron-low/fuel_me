
function helloWorld() {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl: './templates/hello_world.html'
    };
}

module.exports = helloWorld;