var app = angular.module('app.controllers', []);

const API_URL = "http://localhost:3000";

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

  $scope.toggleStatus = function() {
    if ($scope.status == 'available') {
      $scope.setStatus('busy');
    } else if ($scope.status == 'busy') {
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

      $scope.statusChangeText = 'Set status to "' + ($scope.status == 'busy'?'available':'busy') + '"';
    });
  };

  $scope.setStatus('available');
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
