/// <reference path="../lib/everlive.all.min.js" />
/// <reference path="../lib/angular.js" />
function PostsController ($scope) {
    var context = new Everlive({
        apiKey: "oJBOmifHcu3At1cv",
        masterKey: "rFpsWqEJwZyjhOz3EgRPDo5QIB9pespl"
    });
    $scope.query = "";
    $scope.order = [];
    $scope.orderProp = "CreatedOn";

    $scope.posts = [];
    //$scope.$watch('posts', function (oldValue, newValue) {
    //    return true;
    //});
    context.data("Posts").get()
    .then(function (response) {
        $scope.posts = response.result;
        for (var i in response.result[0]) {
            if (!hasAny($scope.order, i)) {
                $scope.order.push(i);
            }
        }
        $scope.$digest();
    });

    function hasAny(collection, element) {
        var res = _.any(collection, function(item) {
            return item == element;
        });
    }
    //setTimeout(function () {
    //    $scope.posts.push({});
    //}, 10000);
}

function LeavePostController($scope) {

}