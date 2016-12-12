var app = angular.module('app.controllers', []);

var API_URL = "http://taxi13.herokuapp.com";
// var API_URL = "http://localhost:3000";

var LOCATION_UPDATE_INTERVAL = 5 * 60 * 1000;

app.controller('homeCtrl', function($scope, $stateParams, $location, PusherService, AuthService, OrderService, $http) {
  AuthService.set({
    id: 1
  });

  var channel = PusherService.subscribe('orders');
  channel.bind('new_order', function(notification) {
    var id = AuthService.get().id;
    if (notification.id_list && notification.id_list.indexOf(id) >= 0) {
      console.log('order received', notification);
      OrderService.set(notification.order);
      $location.path('/new');
      $scope.$apply();
    }

  });

  $scope.toggleStatus = function() {
    if ($scope.status == 'available') {
      $scope.setStatus('off');
    } else if ($scope.status == 'off') {
      $scope.setStatus('available');
    }
  };

  $scope.setStatus = function(newStatus) {
    var driverData = {
      driver: {
        status: newStatus
      }
    };

    $http.put([API_URL, 'drivers', AuthService.get()['id']].join('/'), driverData)
      .then(function(response) {
        $scope.status = response.data.driver.status;

        $scope.statusChangeText = 'Set status to "' + ($scope.status == 'off' ? 'available' : 'off') + '"';

        $scope.statusButtonClass = $scope.status == 'available' ? 'button-assertive' : 'button-positive';
      });
  };

  $scope.setStatus('available');

  $scope.updateLocation = function() {
    navigator.geolocation.getCurrentPosition(function(response) {
      var driverData = {
        driver: {
          latitude: response.coords.latitude,
          longitude: response.coords.longitude
        }
      };

      $http.put([API_URL, 'drivers', AuthService.get()['id']].join('/'), driverData).then(function(response) {
        window.setTimeout($scope.updateLocation, LOCATION_UPDATE_INTERVAL);
      });
    });
  };

  $scope.updateLocation();


})

  .controller('newOrderCtrl', function($scope, $stateParams, $http, OrderService, AuthService) {
    $scope.$on('$ionicView.beforeEnter', function() {
      $scope.order = OrderService.get();
      console.log('in new order modal', $scope.order);
    });


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
      OrderService.set({});
    };
  })

  .controller('currentOrderCtrl', function($scope, $stateParams, $http, $location, OrderService) {
    $scope.$on('$ionicView.beforeEnter', function() {
      $scope.order = OrderService.get();
      console.log('in current order modal', $scope.order);
    });


    $scope.completeOrder = function() {
      $http.post([API_URL, 'orders', $scope.order.id, 'complete'].join('/')).then(function(res) {
        console.log('order completed', res);
        OrderService.set({});
        $location.path('/home');
      });
    };

  });
