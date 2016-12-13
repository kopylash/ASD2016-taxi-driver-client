angular.module('app.services', [])

  .factory('BlankFactory', [function() {

  }])

  .service('BlankService', [function() {

  }])

  .service('PusherService', function() {
    var pusher = new Pusher('49d687ce69d0caf32b29', {
      encrypted: true
    });
    return pusher;
  })

  .service('AuthService', function() {
    var authData = {
      id: null
    };

    return {
      get: function() {
        return authData;
      },
      set: function(data) {
        authData = data;
      }
    };
  })

  .service('OrderService', function() {
    var order = {};

    return {
      get: function() {
        return order;
      },
      set: function(data) {
        console.log("set", data);
        order = data;
      }
    };
  });
