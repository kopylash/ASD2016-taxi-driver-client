var app = angular.module('app.controllers', []);

const API_URL = "http://localhost:3000";

var LOCATION_UPDATE_INTERVAL = 5*60*1000;

app.controller('homeCtrl', function($scope, $stateParams, $location, PusherService, AuthService, OrderNotificationService, $http) {
  AuthService.set({
    id: 1
  });

  var channel = PusherService.subscribe('orders');
  channel.bind('new_order', function(notification) {
    var id = AuthService.get().id;
    if (notification.id_list && notification.id_list.indexOf(id) >= 0) {
      console.log(notification);
      OrderNotificationService.set(notification.order);
      $location.path('/new');
      $scope.$apply();
    }

  });

  $scope.updateLocation = function() {
    navigator.geolocation.getCurrentPosition(function(response) {
      var driverData = {
        driver: {
          latitude: response.coords.latitude,
          longitude: response.coords.longitude
        }
      };

      $http.put([API_URL, 'drivers', AuthService.get()['id']].join('/'), driverData)
      .then(function(response) {
        window.setTimeout($scope.updateLocation, LOCATION_UPDATE_INTERVAL);
      });
    });
  }

  $scope.updateLocation();

})

  .controller('newOrderCtrl', function($scope, $stateParams, $http, OrderNotificationService, AuthService) {
    $scope.order = OrderNotificationService.get();

    $scope.accept = function() {
      console.log('accept');
      $http.post([API_URL, "orders", "accept"].join("/"), {
        accept_details: {
          order_id: $scope.order.id,
          driver_id: AuthService.get().id
        }
      }).then(function(res) {

      });
    };

    $scope.decline = function() {
      OrderNotificationService.set({});
    }
  })

  .controller('currentOrderCtrl', function($scope, $stateParams) {


  })

  .controller('orderHistoryCtrl', function($scope, $stateParams) {


  });
