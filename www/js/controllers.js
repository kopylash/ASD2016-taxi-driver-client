var app = angular.module('app.controllers', []);

const API_URL = "http://localhost:3000";

app.controller('homeCtrl', function($scope, $stateParams, $location, PusherService, AuthService, OrderNotificationService) {
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

})

  .controller('newOrderCtrl', function($scope, $stateParams, OrderNotificationService) {
    $scope.order = OrderNotificationService.get();
  })

  .controller('currentOrderCtrl', function($scope, $stateParams) {


  })

  .controller('orderHistoryCtrl', function($scope, $stateParams) {


  });
