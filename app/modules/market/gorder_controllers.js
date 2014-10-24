// 推荐栏目
marketModule.controller('recommendColumnController', ['$scope', '$state', '$modal', 'growl', 'recommendColumnService',
  function ($scope, $state, $modal, growl, service) {
    $scope.page = 1;
    $scope.size = 20;
    $scope.projects = [{
      id: 1,
      name: "长楹天街"
    }, {
      id: 2,
      name: "滟澜山"
    }];

    $scope.project_id = $scope.projects[0].id;
    $scope.query = function (keep) {
      $scope.list = keep ? $scope.list : null;
      service.query({
        projectId: $scope.project_id
      }).then(function (res) {
        $scope.list = res.list;
        $scope.total = res.total;
      }, function () {});
    };

    $scope.create = function (keep) {
      $modal.open({
        templateUrl: 'modules/market/templates/recommend/recommend_column.partial.html',
        controller: ['$scope',
          function (scope) {
            scope.title = '添加推荐栏目';
            scope.projects = $scope.projects;
            scope.entity = {
              projectId: $scope.project_id
            };

            scope.confirm = function () {
              scope.processing = true;

              service.create(scope.entity).then(function (res) {
                growl.addSuccessMessage(scope.title + "成功");
                $scope.page = 1;
                $scope.query();
              }, function (rej) {
                growl.addErrorMessage(rej.message || scope.title + "操作失败");
              })['finally'](function () {
                scope.processing = false;
                scope.$close();
              });

            };
          }
        ]
      });
    };

    $scope.update = function (entity) {
      $modal.open({
        templateUrl: 'modules/market/templates/recommend/recommend_column.partial.html',
        controller: ['$scope',
          function (scope) {
            scope.title = '编辑推荐栏目';
            scope.projects = $scope.projects;
            scope.entity = angular.copy(entity);

            scope.confirm = function () {
              scope.processing = true;

              service.update(scope.entity).then(function (res) {
                growl.addSuccessMessage(scope.title + "操作成功");
                // 更新数据
                $scope.query();
              }, function (rej) {
                growl.addErrorMessage(rej.message || scope.title + "操作失败");
              })['finally'](function () {
                scope.processing = false;
                scope.$close();
              });
            };
          }
        ]
      });
    };

    $scope.remove = function (entity) {
      $modal.open({
        templateUrl: 'config/templates/delete.partial.html',
        controller: ['$scope',
          function (scope) {
            scope.entity = entity;
            scope.title = '删除推荐栏目';
            scope.message = '<h4>您确定要删除推荐栏目 ( <span class="text-warning">' + entity.name + '</span> ) 吗？</h4>';
            scope.confirm = function () {
              entity.deleting = true;

              service.remove(entity).then(function (res) {
                $scope.list.splice($scope.list.indexOf(entity), 1);
                $scope.total -= 1;
                $scope.query(true);
                growl.addSuccessMessage(scope.title + "操作成功");
              }, function (rej) {
                growl.addErrorMessage(rej.message || scope.title + "操作失败");
              })['finally'](function () {
                entity.deleting = false;
              });
              scope.$close();
            };
          }
        ]
      });
    };

    $scope.query();

  }
]);