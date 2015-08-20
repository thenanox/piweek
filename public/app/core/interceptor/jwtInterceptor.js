(function(){
   'use strict';
    angular.module('core').factory('jwtInterceptor', function() {
      var jwtToken = "";
      return {
        'request': function(config) {
          if(jwtToken) {
            config.headers['Authorization'] = "Bearer " + jwtToken;
          }
          return config;
        },
        'response': function(response) {
          var url = response.config.url;
          if(url && url.indexOf('/auth/sign') !== -1){
            jwtToken = response.data.token;
          }
          return response;
        }
      };
    });
})();