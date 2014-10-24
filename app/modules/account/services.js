accountModule.factory('accountService', function (serviceGenerator) {
  return serviceGenerator().$actions({
    query: '/account/member/list',
    remove: '/account/member/remove',
    logout: {
      url: '/logout',
      medhot: 'post'
    }
  }).$methods(['$q', '$http',
    function ($q, $http) {
      return {
        login: function (username, password, remember) {
          return $q.when({
            code: 200
          });
        }
      };
    }
  ]);
});

accountModule.factory('roleService', function (serviceGenerator) {
  return serviceGenerator().$actions({
    query: '/account/role/list',
    create: '/account/role/create',
    update: '/account/role/update',
    remove: '/account/role/delete'
  });
});