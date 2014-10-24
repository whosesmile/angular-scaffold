/* 页面模板 */
app.directive('csLayout', function ($rootScope) {
  return {
    restrict: 'A',
    replace: false,
    transclude: true,
    templateUrl: 'config/templates/layout.partial.html',
    link: function (scope, element, attrs) {
      // 例外名单：不需要登陆 不适用默认布局
      var excludes = ['account.login', 'account.logout'];

      var hyphenate = function (name) {
        return name.replace(/[._]/g, '-').replace(/([A-Z])/g, '-$1').toLowerCase();
      };

      $rootScope.$on('$stateChangeStart', function (e, state, params, source, srouceParams) {
        $rootScope.$user = {};
        $rootScope.$layout = excludes.indexOf(state.name) === -1;
        element.attr('class', hyphenate(state.name)).toggleClass('layout', $rootScope.$layout);
      });
    }
  };
});

/* 左侧菜单 */
app.directive('csMenubar', function ($rootScope, $state, menubar) {
  return {
    restrict: 'A',
    replace: false,
    templateUrl: 'config/templates/menubar.partial.html',
    link: function (scope, element, attrs) {
      scope.menubar = menubar;
      scope.toggleMenu = function (menu) {
        angular.forEach(menubar, function (item) {
          if (item !== menu) {
            item.active = false;
          }
        });
        menu.active = !menu.active;
      };

      var activeMenubar = function (name) {
        angular.forEach(menubar, function (item) {
          for (var i = 0; i < item.menus.length; i++) {
            if (item.menus[i].sref === name) {
              item.active = true;
            }
          }
        });
      };

      // 激活菜单
      if ($state.current && $state.current.name) {
        activeMenubar($state.current.name);
      }
      else {
        var removeEventListener = $rootScope.$on('$stateChangeSuccess', function (e, state, params) {
          activeMenubar(state.name);
          removeEventListener();
        });
      }
    }
  };
});

/**
 * 自动聚焦...
 */
app.directive('csFocus', function ($timeout) {
  return {
    restrict: 'A',
    replace: false,
    link: function (scope, element) {
      var times = 0;
      (function focus() {
        if (element.is(':visible')) {
          element.focus();
        }
        else if (times++ < 1) {
          $timeout(focus, 200);
        }
      }());
    }
  };
});

/**
 * 防止自动完成不触发form验证
 */
app.directive("csAutofill", function ($timeout) {
  return {
    require: '^ngModel',
    link: function (scope, element, attrs, ngModel) {
      var times = 0;
      var timer = null;
      var origin = element.val();

      (function fill() {
        if (element.val() !== origin) {
          ngModel.$setViewValue(element.val());
          element.focus();
        }
        else if (times++ < 3) {
          $timeout.cancel(timer);
          timer = $timeout(fill, 200);
        }
      }());

      scope.$on('$destroy', function () {
        $timeout.cancel(timer);
      });
    }
  };
});

// 多选checkbox 填值进入Array
app.directive('csCheckbox', function () {
  return {
    restrict: 'A',
    replace: false,
    scope: {
      list: '=',
      fill: '=',
      label: '@',
      value: '@'
    },
    templateUrl: 'config/templates/checkbox.partial.html',
    link: function (scope, element, attrs) {
      scope.fill = scope.fill || [];
      scope.toggleValue = function (value) {
        var index = scope.fill.indexOf(value);
        if (index > -1) {
          scope.fill.splice(index, 1);
        }
        else {
          scope.fill.push(value);
        }
      };
    }
  };
});

// 通用选择
app.directive('csSelect', function ($timeout, $http) {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      associate: '=', // 关联到scope的哪个属性上
      url: '@', // 查询地址
      key: '@', // option的value 默认是id
      label: '@', // option中显示的文案 默认是name
      blank: '@', // 空白情况下显示的文案 默认是请选择
      type: '@', // 这个值和url互斥 既如果定义常量的话 不会发起ajax请求 可以问我
      params: '=', // 查询url额外的参数
      sname: '@', // select的name属性值
      required: '@', // 是否必选
      change: '&' // onchange
    },
    templateUrl: function (element, attrs) {
      return 'config/templates/select.partial.html';
    },
    link: function (scope, element, attrs) {
      scope.$key = scope.key || 'id';
      scope.$label = scope.label || 'name';
      scope.$blank = angular.isUndefined(scope.blank) ? '请选择' : scope.blank;

      if (scope.url) {
        $http({
          url: scope.url,
          params: scope.params
        }).then(function (res) {
          scope.list = res.list;

          // 如果默认没有提示 自动选择第一个
          if (scope.$blank === 'false' && res.list.length > 0) {
            if (scope.associate !== res.list[0][scope.key]) {
              // 触发change事件
              scope.associate = res.list[0][scope.key];
              $timeout(function () {
                scope.change();
              }, 50);
            }
          }
        });
      }
    }
  };
});