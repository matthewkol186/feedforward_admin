'use strict';

app.factory('Auth', function ($firebaseAuth) {
  var auth = $firebaseAuth();

  return auth;
});
