// account.login
accountModule.controller('loginController', function ($scope, $state, accountService) {

  $scope.remember = true;

  $scope.login = function () {
    $scope.processing = true;
    accountService.login({
      username: $scope.username,
      password: $scope.password,
      remember: $scope.remember
    }).then(function (res) {
      $scope.$emit('$initialize');
      $state.go('account.member');
    }, function (rej) {
      $scope.error = true;
    })['finally'](function () {
      $scope.processing = false;
    });
  };

});

// account.logout
accountModule.controller('logoutController', function ($scope, $state, growl, accountService) {
  accountService.logout().then(function (res) {
    $state.go('account.login');
  }, function (rej) {
    growl.addErrorMessage(rej.message || '服务器异常，请刷新当前页');
  });
});

// account.settings
accountModule.controller('settingsController', function ($scope, $state, growl, accountService) {
  $scope.changePwd = function () {
    $scope.processing = true;
    accountService.changePwd($scope.password, $scope.newpassword).then(function (res) {
      growl.addSuccessMessage('修改密码成功，请重新登录');
      $state.go('account.logout');
    }, function (rej) {
      growl.addErrorMessage(rej.message || '修改密码失败');
    })['finally'](function () {
      $scope.processing = false;
    });
  };
});

// account.member
accountModule.controller('memberController', function ($scope, $state, $modal, growl, accountService) {
  $scope.page = 1;
  $scope.name = null;
  $scope.nick = null;
  $scope.status = '';

  $scope.query = function (keep) {
    if (!keep) {
      $scope.list = [];
      $scope.loading = true;
    }

    accountService.query({
      page: $scope.page,
      name: $scope.name,
      nick: $scope.nick,
      status: $scope.status
    }).then(function (res) {
      $scope.list = res.list;
      $scope.page = res.page;
      $scope.total = res.total;
      $scope.size = res.size;
    }, function (rej) {
      growl.addErrorMessage(rej.message || '服务器异常');
    })['finally'](function () {
      $scope.loading = false;
    });

  };

  $scope.remove = function (item) {
    item.deleting = true;
    accountService.remove(item).then(function (res) {
      $scope.list.splice($scope.list.indexOf(item), 1);

      if ($scope.list.length < 5) {
        $scope.query(true);
      }
    }, function (rej) {})['finally'](function () {
      item.deleting = false;
    });

  };

  $scope.update = function (item) {
    $modal.open({
      templateUrl: 'modules/account/templates/partial/user-form.html',
      controller: ['$scope',
        function (scope) {
          scope.title = 'Hello';
          scope.count = $scope.list.length;

          scope.confirm = function () {
            growl.addSuccessMessage('ok');
            scope.$close();
          };
        }
      ]
    });
  };

  $scope.query(true);

});

// account.role
accountModule.controller('roleController', function ($scope, $state, $modal, growl, roleService, controllerGenerator) {
  // 给$scope添加标准化CRUD操作
  controllerGenerator($scope, roleService, {
    title: '角色',
    property: 'name',
    createTemplate: 'modules/account/templates/partial/role-form.html',
    updateTemplate: 'modules/account/templates/partial/role-form.html',
    autoload: true
  });

  // 搜索
  $scope.search = function () {
    return $scope.query({
      name: $scope.name
    });
  };
});