// 通用服务生成器 默认包含5种操作：CREATE UPDATE REMOVE TOGGLE QUERY
app.factory('serviceGenerator', function ($http, $injector) {

  return function () {

    var actions = {};

    // 代理CRUDT操作
    var proxy = function (name, params, data, method) {
      // var name = proxy.caller.toString().match(/^function\s*([^\s(]+)/)[1];
      var url = actions[name];
      if (!url) {
        throw new Error('<< ' + name + ' method action not config >>');
      }
      return $http({
        url: url,
        params: params || null,
        data: data || null,
        method: method ? method : (name === 'query' ? 'get' : 'post')
      });
    };

    var identity = function (data) {
      return angular.isObject(data) ? data.id : data;
    };

    // 封装好增删改查
    var service = {

      query: function (params) {
        return proxy('query', params, null);
      },

      create: function (data) {
        return proxy('create', null, data);
      },

      update: function (data) {
        return proxy('update', null, data);
      },

      remove: function (data) {
        return proxy('remove', null, identity(data));
      },

      toggle: function (data) {
        return proxy('toggle', null, {
          id: identity(data),
          status: data.status === 0 ? 1 : 0
        });
      },

      get: function (url, params) {
        return $http({
          url: url,
          params: params
        });
      },

      post: function (url, data) {
        return $http({
          url: url,
          data: data
        });
      },

      // 配置增删改查的地址
      $actions: function $actions() {
        angular.extend(actions, arguments[0]);

        angular.forEach(arguments[0], function (config, name) {
          if (typeof config !== 'string') {
            service[name] = function () {
              if (config.method && config.method.toLowerCase() === 'get') {
                return $http({
                  url: config.url,
                  params: arguments[0]
                });
              }
              return $http({
                url: config.url,
                data: arguments[0],
                method: 'post'
              });
            };
          }
        });
        return this;
      },

      // 配置其他方法
      $methods: function $methods() {
        angular.forEach($injector.invoke(arguments[0]), function (fn, name) {
          service[name] = fn.bind(service);
        });
        return this;
      }

    };

    return service;
  };

});

// 通用处理生成器 默认包含5种操作：CREATE UPDATE REMOVE TOGGLE QUERY
app.factory('controllerGenerator', function ($q, $injector, $modal, growl) {

  return function ($scope, service, config) {

    /** 
     * onfig should have:
     * title: '某某操作'
     * property: 用于提示文案的实体的主键名称，默认为 name
     * createTemplate: '创建实体的模板地址'
     * updateTemplate: '编辑实体的模板地址'
     */

    $scope.page = 1;
    $scope.size = 20;

    $scope.query = function query(arg) {

      // 删除之后到达阈值后会做静默翻页 防止页面出现空页面
      if (arg !== true) {
        $scope.list = [];
        $scope.loading = true;
      }

      // 添加额外参数 注：如果arg是boolean 此处不会影响
      var params = angular.extend({
        page: $scope.page,
        size: $scope.size
      }, arg);

      return service.query(params).then(function (res) {
        $scope.list = res.list;
        $scope.page = res.page;
        $scope.size = res.size;
        $scope.total = res.total;
        return $q.when(res);
      }, function (rej) {
        growl.addErrorMessage(rej.message || '服务器异常，请稍后再试！');
        return $q.reject(rej);
      })['finally'](function () {
        $scope.loading = false;
      });
    };

    $scope.create = function create() {
      $modal.open({
        templateUrl: config.createTemplate,
        controller: ['$scope',
          function (scope) {
            scope.title = '添加' + config.title;
            scope.entity = {};

            scope.confirm = function () {
              scope.creating = true;

              service.create(scope.entity).then(function (res) {
                $scope.query();
                growl.addSuccessMessage(scope.title + '成功！');
                return $q.when(res);
              }, function (rej) {
                growl.addErrorMessage(rej.message || scope.title + '失败！');
                return $q.reject(rej);
              })['finally'](function () {
                scope.creating = false;
                scope.$close();
              });

            };
          }
        ]
      });
    };

    $scope.update = function update(entity) {
      $modal.open({
        templateUrl: config.updateTemplate || config.modifyTemplate,
        controller: ['$scope',
          function (scope) {
            scope.title = '编辑' + config.title;
            scope.entity = angular.copy(entity);
            scope.confirm = function () {
              scope.updating = true;

              service.update(scope.entity).then(function (res) {
                angular.extend(entity, res.entity || scope.entity);
                growl.addSuccessMessage(scope.title + '成功!');
                return $q.when(res);
              }, function (rej) {
                growl.addErrorMessage(rej.message || scope.title + '失败！');
                return $q.reject(rej);
              })['finally'](function () {
                scope.updating = false;
                scope.$close();
              });
            };
          }
        ]
      });
    };

    $scope.remove = function remove(entity) {
      $modal.open({
        templateUrl: 'config/templates/delete.partial.html',
        controller: ['$scope',
          function (scope) {
            scope.title = '删除' + config.title;
            scope.entity = entity;
            scope.message = '<h4>您确定要删除' + config.title + ' ( <span class="text-warning">' + entity[config.property || 'name'] + '</span> ) 吗？</h4>';
            scope.confirm = function () {
              entity.deleting = true;

              service.remove(entity).then(function (res) {
                $scope.total -= 1;
                $scope.list.splice($scope.list.indexOf(entity), 1);

                // 阈值为 2/3，小于会自动reload当前页
                if ($scope.list.length < ($scope.size || 20) * 2 / 3) {
                  $scope.query(true);
                }
                growl.addSuccessMessage(scope.title + '成功!');
                return $q.when(res);
              }, function (rej) {
                growl.addErrorMessage(rej.message || scope.title + '失败！');
              })['finally'](function () {
                entity.deleting = false;
              });
              scope.$close();
            };
          }
        ]
      });
    };

    $scope.toggle = function toggle(entity) {
      entity.toggling = true;
      service.toggle(entity).then(function (res) {
        entity.status = entity.status === 0 ? 1 : 0;
        growl.addSuccessMessage('操作成功!');
        return $q.when(res);
      }, function (rej) {
        growl.addErrorMessage(rej.message || '操作失败！');
        return $q.reject(rej);
      })['finally'](function () {
        entity.toggling = false;
      });
    };

    $scope['delete'] = function (entity) {
      return $scope.remove(entity);
    };

    $scope.modify = function (entity) {
      return $scope.update(entity);
    };

    if (config.autoload) {
      $scope.query();
    }

    return $scope;

  };

});

app.factory('bootbox', function ($modal) {

  return {

    alert: function (message, fn) {
      $modal.open({
        templateUrl: 'common/templates/bootbox.partial.html',
        controller: function ($scope) {
          $scope.type = 'alert';
          $scope.message = message;

          $scope.confirm = function () {
            $scope.$close();
            return fn && fn();
          };
        }
      });
    },

    confirm: function (message, fn) {
      $modal.open({
        templateUrl: 'common/templates/bootbox.partial.html',
        controller: function ($scope) {
          $scope.type = 'confirm';
          $scope.message = message;

          $scope.confirm = function () {
            $scope.$close();
            return fn && fn();
          };
        }
      });
    }

  };
});