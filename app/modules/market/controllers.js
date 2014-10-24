/* global marketModule:true */
// 首页
marketModule.controller('homeController', function ($scope, growl) {
  growl.addSuccessMessage('Hello World');
});

// 供方类型
marketModule.controller('providerTypeController', ['$scope', '$state', '$modal', 'growl', 'providerTypeService',
  function ($scope, $state, $modal, growl, service) {
    $scope.page = 1;
    $scope.size = 20;

    $scope.query = function (keep) {
      $scope.list = keep ? $scope.list : null;
      service.query({
        pageNo: $scope.page,
        pageSize: $scope.size,
        name: $scope.qname,
        status: $scope.status
      }).then(function (res) {
        $scope.list = res.list;
        $scope.total = res.total;
      }, function () {});
    };

    $scope.create = function (keep) {
      $modal.open({
        templateUrl: 'modules/market/templates/providertype/providertype.partial.html',
        controller: ['$scope',
          function (scope) {
            scope.title = '添加供方类型';
            scope.entity = {};

            scope.confirm = function () {
              scope.processing = true;

              service.create(scope.entity).then(function (res) {
                growl.addSuccessMessage(scope.title + "成功");
                $scope.page = 1;
                $scope.query();
              }, function (rej) {
                growl.addErrorMessage(rej.message);
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
        templateUrl: 'modules/market/templates/providertype/providertype.partial.html',
        controller: ['$scope',
          function (scope) {
            scope.title = '编辑供方类型';
            scope.entity = angular.copy(entity);

            scope.providerTypes = $scope.providerTypes;

            scope.confirm = function () {
              scope.processing = true;

              service.update(scope.entity).then(function (res) {
                growl.addSuccessMessage(scope.title + "操作成功");
                // 更新数据
                angular.extend(entity, scope.entity);
              }, function (rej) {
                growl.addErrorMessage(rej.message);
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
            scope.title = '删除供方类型';
            scope.message = '<h4>您确定要删除供方类型 ( <span class="text-warning">' + entity.name + '</span> ) 吗？</h4>';
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

    $scope.toggle = function (entity) {
      $modal.open({
        templateUrl: 'config/templates/confirm.partial.html',
        controller: ['$scope',
          function (scope) {
            scope.title = entity.status === 0 ? '启用供方' : '停用供方';
            scope.message = '<h4>您确定要' + scope.title + ' ( <span class="text-warning">' + entity.name + '</span> ) 吗？</h4>';

            scope.confirm = function () {
              entity.processing = true;

              service.toggle(entity).then(function (res) {
                entity.status = entity.status === 0 ? 1 : 0;
                growl.addSuccessMessage(scope.title + "操作成功");
              }, function (rej) {
                growl.addErrorMessage(rej.message || scope.title + "操作失败");
              })['finally'](function () {
                entity.processing = false;
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

// 供方
marketModule.controller('providerController', ['$scope', '$state', '$modal', 'growl', 'providerService',
  function ($scope, $state, $modal, growl, service) {
    $scope.page = 1;
    $scope.size = 20;

    $scope.query = function (keep) {
      $scope.list = keep ? $scope.list : null;
      service.query({
        pageNo: $scope.page,
        pageSize: $scope.size,
        id: $scope.provider_id,
        name: $scope.provider_name,
        status: $scope.status
      }).then(function (res) {
        $scope.list = res.list;
        $scope.total = res.total;
      }, function () {});
    };

    $scope.create = function (keep) {
      $modal.open({
        templateUrl: 'modules/market/templates/provider/provider.partial.html',
        controller: ['$scope',
          function (scope) {
            scope.title = '添加供应商';
            scope.entity = {};

            scope.confirm = function () {
              scope.processing = true;

              service.create(scope.entity).then(function (res) {
                growl.addSuccessMessage(scope.title + "成功");
                $scope.page = 1;
                $scope.query();
              }, function (rej) {
                growl.addErrorMessage(scope.title + "失败");
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
        templateUrl: 'modules/market/templates/provider/provider.partial.html',
        controller: ['$scope',
          function (scope) {
            scope.title = '编辑供应商';
            scope.entity = angular.copy(entity);

            scope.providerTypes = $scope.providerTypes;

            scope.confirm = function () {
              scope.processing = true;

              service.update(scope.entity).then(function (res) {
                growl.addSuccessMessage(scope.title + "操作成功");
                // 更新数据
                angular.extend(entity, scope.entity);
              }, function (rej) {
                growl.addErrorMessage(rej.message);
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
            scope.title = '删除供应商';
            scope.message = '<h4>您确定要删除供应商 ( <span class="text-warning">' + entity.name + '</span> ) 吗？</h4>';
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

    $scope.toggle = function (entity) {
      $modal.open({
        templateUrl: 'config/templates/confirm.partial.html',
        controller: ['$scope',
          function (scope) {
            scope.title = entity.status === 0 ? '启用供应商' : '停用供应商';
            scope.message = '<h4>您确定要' + scope.title + ' ( <span class="text-warning">' + entity.name + '</span> ) 吗？</h4>';

            scope.confirm = function () {
              entity.processing = true;

              service.toggle(entity).then(function (res) {
                entity.status = entity.status === 0 ? 1 : 0;
                growl.addSuccessMessage(scope.title + "操作成功");
              }, function (rej) {
                growl.addErrorMessage(rej.message || scope.title + "操作失败");
              })['finally'](function () {
                entity.processing = false;
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

/**
 *频道管理
 */
marketModule.controller('appChannelController', ['$scope', '$state', '$modal', 'growl', 'appChannelService',
  function ($scope, $state, $modal, growl, service) {
    $scope.page = 1;
    $scope.size = 20;

    /**
     *列表查询
     */
    $scope.query = function (keep) {

      $scope.list = keep ? $scope.list : null;
      service.query({
        pageNo: $scope.page,
        pageSize: $scope.size,
        name: $scope.name,
        status: $scope.status
      }).then(function (res) {
        $scope.list = res.list;
        $scope.total = res.total;
      }, function () {});
    };

    /**
     *新建
     */
    $scope.create = function (keep) {
      $modal.open({
        templateUrl: 'modules/market/templates/appchannel/appchannel.partial.html',
        controller: ['$scope',
          function (scope) {
            scope.title = '添加频道';
            scope.entity = {};

            scope.confirm = function () {
              scope.processing = true;

              service.create(scope.entity).then(function (res) {
                growl.addSuccessMessage(scope.title + "成功");
                $scope.page = 1;
                $scope.query();
              }, function (rej) {
                growl.addErrorMessage(scope.title + "失败");
              })['finally'](function () {
                scope.processing = false;
                scope.$close();
              });
            };
          }
        ]
      });
    };

    /**
     *修改
     */
    $scope.modify = function (item) {
      $modal.open({
        templateUrl: 'modules/market/templates/appchannel/appchannel.partial.html',
        controller: ['$scope',
          function (scope) {
            scope.title = '修改频道';
            scope.entity = angular.copy(item);
            scope.confirm = function () {
              scope.processing = true;
              service.create(scope.entity).then(function (res) {
                growl.addSuccessMessage(scope.title + "成功");
                $scope.page = 1;
                $scope.query();
              }, function (rej) {
                growl.addErrorMessage(scope.title + "失败,原因：" + rej.message);
              })['finally'](function () {
                scope.processing = false;
                scope.$close();
              });
            };
          }
        ]
      });
    };

    $scope.delete = function (entity) {
      $modal.open({
        templateUrl: 'config/templates/delete.partial.html',
        controller: ['$scope',
          function (scope) {
            scope.entity = entity;
            scope.title = '删除频道';
            scope.message = '<h4>您确定要删除频道 ( <span class="text-warning">' + entity.name + '</span> ) 吗？</h4>';
            scope.confirm = function () {
              entity.deleting = true;

              service.remove({
                id: entity.id
              }).then(function (res) {
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

    /**
     *切换状态
     */
    $scope.toggle = function (entity) {

      $modal.open({
        templateUrl: 'config/templates/confirm.partial.html',
        controller: ['$scope',
          function (scope) {
            scope.title = entity.status === 0 ? '启用频道' : '停用频道';
            scope.message = '<h4>您确定要' + scope.title + ' ( <span class="text-warning">' + entity.name + '</span> ) 吗？</h4>';

            scope.confirm = function () {
              entity.processing = true;

              service.toggle(entity).then(function (res) {
                entity.status = entity.status === 0 ? 1 : 0;
                growl.addSuccessMessage(scope.title + "操作成功");
              }, function (rej) {
                growl.addErrorMessage(rej.message || scope.title + "操作失败");
              })['finally'](function () {
                entity.processing = false;
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

/**
 *商品品类管理
 */
marketModule.controller('goodsCategoryController', ['$scope', '$state', '$modal', 'growl', 'goodsCategoryService',
  function ($scope, $state, $modal, growl, service) {
    $scope.page = 1;
    $scope.size = 20;

    /**
     *列表查询
     */
    $scope.query = function (keep) {

      $scope.list = keep ? $scope.list : null;
      service.query({
        pageNo: $scope.page,
        pageSize: $scope.size,
        name: $scope.name,
        status: $scope.status
      }).then(function (res) {
        $scope.list = res.list;
        $scope.total = res.total;
      }, function () {});
    };

    /**
     *新建
     */
    $scope.create = function (keep) {
      $modal.open({
        templateUrl: 'modules/market/templates/goodscategory/goodscategory.partial.html',
        controller: ['$scope',
          function (scope) {
            scope.title = '添加品类';
            scope.entity = {};

            scope.confirm = function () {
              scope.processing = true;
              service.create(scope.entity).then(function (res) {
                growl.addSuccessMessage(scope.title + "成功");
                $scope.page = 1;
                $scope.query();
              }, function (rej) {
                growl.addErrorMessage(scope.title + "失败");
              })['finally'](function () {
                scope.processing = false;
                scope.$close();
              });
            };
          }
        ]
      });
    };

    /**
     *修改
     */
    $scope.modify = function (item) {
      $modal.open({
        templateUrl: 'modules/market/templates/goodscategory/goodscategory.partial.html',
        controller: ['$scope',
          function (scope) {
            scope.title = '修改品类';
            scope.entity = angular.copy(item);
            scope.confirm = function () {
              scope.processing = true;
              service.update(scope.entity).then(function (res) {
                growl.addSuccessMessage(scope.title + "成功");
                $scope.page = 1;
                $scope.query();
              }, function (rej) {
                growl.addErrorMessage(scope.title + "失败,原因：" + rej.message);
              })['finally'](function () {
                scope.processing = false;
                scope.$close();
              });
            };
          }
        ]
      });
    };

    $scope.delete = function (entity) {
      $modal.open({
        templateUrl: 'config/templates/delete.partial.html',
        controller: ['$scope',
          function (scope) {
            scope.entity = entity;
            scope.title = '删除品类';
            scope.message = '<h4>您确定要删除品类 ( <span class="text-warning">' + entity.name + '</span> ) 吗？</h4>';
            scope.confirm = function () {
              entity.deleting = true;

              service.remove({
                id: entity.id
              }).then(function (res) {
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

    /**
     *切换状态
     */
    $scope.toggle = function (entity) {
      $modal.open({
        templateUrl: 'config/templates/confirm.partial.html',
        controller: ['$scope',
          function (scope) {
            scope.title = entity.status === 0 ? '启用品类' : '停用品类';
            scope.message = '<h4>您确定要' + scope.title + ' ( <span class="text-warning">' + entity.name + '</span> ) 吗？</h4>';

            scope.confirm = function () {
              entity.processing = true;

              service.toggle(entity).then(function (res) {
                entity.status = entity.status === 0 ? 1 : 0;
                growl.addSuccessMessage(scope.title + "操作成功");
              }, function (rej) {
                growl.addErrorMessage(rej.message || scope.title + "操作失败");
              })['finally'](function () {
                entity.processing = false;
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

/**
 *商品管理
 */
marketModule.controller('goodsController', ['$scope', '$state', '$modal', 'growl', 'goodsService',
  function ($scope, $state, $modal, growl, service) {
    $scope.page = 1;
    $scope.size = 20;

    /**
     *列表查询
     */
    $scope.query = function (keep) {

      $scope.list = keep ? $scope.list : null;
      service.query({
        pageNo: $scope.page,
        pageSize: $scope.size,
        name: $scope.name,
        status: $scope.status
      }).then(function (res) {
        $scope.list = res.list;
        $scope.total = res.total;
      }, function () {});
    };

    /**
     *新建
     */
    $scope.create = function (keep) {
      $modal.open({
        templateUrl: 'modules/market/templates/goods/goods.partial.html',
        controller: ['$scope',
          function (scope) {
            scope.title = '添加商品';
            scope.entity = {};

            scope.confirm = function () {
              scope.processing = true;

              service.create(scope.entity).then(function (res) {
                growl.addSuccessMessage(scope.title + "成功");
                $scope.page = 1;
                $scope.query();
              }, function (rej) {
                growl.addErrorMessage(scope.title + "失败,原因：" + rej.message);
              })['finally'](function () {
                scope.processing = false;
                scope.$close();
              });
            };
          }
        ]
      });
    };

    /**
     *修改
     */
    $scope.modify = function (item) {
      $modal.open({
        templateUrl: 'modules/market/templates/goods/goods.partial.html',
        controller: ['$scope',
          function (scope) {
            scope.title = '修改商品';
            scope.entity = angular.copy(item);
            scope.confirm = function () {
              scope.processing = true;
              service.update(scope.entity).then(function (res) {
                growl.addSuccessMessage(scope.title + "成功");
                $scope.page = 1;
                $scope.query();
              }, function (rej) {
                growl.addErrorMessage(scope.title + "失败,原因：" + rej.message);
              })['finally'](function () {
                scope.processing = false;
                scope.$close();
              });
            };
          }
        ]
      });
    };

    $scope.delete = function (entity) {
      $modal.open({
        templateUrl: 'config/templates/delete.partial.html',
        controller: ['$scope',
          function (scope) {
            scope.entity = entity;
            scope.title = '删除商品';
            scope.message = '<h4>您确定要删除商品 ( <span class="text-warning">' + entity.name + '</span> ) 吗？</h4>';
            scope.confirm = function () {
              entity.deleting = true;

              service.remove({
                id: entity.id
              }).then(function (res) {
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

    /**
     *切换状态
     */
    $scope.toggle = function (entity) {
      $modal.open({
        templateUrl: 'config/templates/confirm.partial.html',
        controller: ['$scope',
          function (scope) {
            scope.title = entity.status === 0 ? '启用商品' : '停用商品';
            scope.message = '<h4>您确定要' + scope.title + ' ( <span class="text-warning">' + entity.name + '</span> ) 吗？</h4>';

            scope.confirm = function () {
              entity.processing = true;

              service.toggle(entity).then(function (res) {
                entity.status = entity.status === 0 ? 1 : 0;
                growl.addSuccessMessage(scope.title + "操作成功");
              }, function (rej) {
                growl.addErrorMessage(rej.message || scope.title + "操作失败");
              })['finally'](function () {
                entity.processing = false;
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

/**
 *款色规管理
 */
marketModule.controller('goodsSpecificationController', ['$scope', '$state', '$modal', 'growl', 'goodsSpecificationService',
  function ($scope, $state, $modal, growl, service) {
    $scope.page = 1;
    $scope.size = 20;

    /**
     *列表查询
     */
    $scope.query = function (keep) {
      $scope.list = keep ? $scope.list : null;
      service.query({
        pageNo: $scope.page,
        pageSize: $scope.size,
        name: $scope.name,
        status: $scope.status
      }).then(function (res) {
        $scope.list = res.list;
        $scope.total = res.total;
      }, function () {});
    };

    /**
     *新建
     */
    $scope.create = function (keep) {
      $modal.open({
        templateUrl: 'modules/market/templates/goodsspecification/goodsspecification.partial.html',
        controller: ['$scope',
          function (scope) {
            scope.title = '添加规格类型';
            scope.entity = {};

            scope.confirm = function () {
              scope.processing = true;

              service.create(scope.entity).then(function (res) {
                growl.addSuccessMessage(scope.title + "成功");
                $scope.page = 1;
                $scope.query();
              }, function (rej) {
                growl.addErrorMessage(scope.title + "失败,原因：" + rej.message);
              })['finally'](function () {
                scope.processing = false;
                scope.$close();
              });
            };
          }
        ]
      });
    };

    /**
     *修改
     */
    $scope.modify = function (item) {
      $modal.open({
        templateUrl: 'modules/market/templates/goodsspecification/goodsspecification.partial.html',
        controller: ['$scope',
          function (scope) {
            scope.title = '修改规格类型';
            scope.entity = angular.copy(item);
            scope.confirm = function () {
              scope.processing = true;
              service.update(scope.entity).then(function (res) {
                growl.addSuccessMessage(scope.title + "成功");
                $scope.page = 1;
                $scope.query();
              }, function (rej) {
                growl.addErrorMessage(scope.title + "失败,原因：" + rej.message);
              })['finally'](function () {
                scope.processing = false;
                scope.$close();
              });
            };
          }
        ]
      });
    };

    $scope.delete = function (entity) {
      $modal.open({
        templateUrl: 'config/templates/delete.partial.html',
        controller: ['$scope',
          function (scope) {
            scope.entity = entity;
            scope.title = '删除规格类型';
            scope.message = '<h4>您确定要删除规格类型 ( <span class="text-warning">' + entity.name + '</span> ) 吗？</h4>';
            scope.confirm = function () {
              entity.deleting = true;

              service.remove({
                id: entity.id
              }).then(function (res) {
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

    /**
     *切换状态
     */
    $scope.toggle = function (entity) {
      $modal.open({
        templateUrl: 'config/templates/confirm.partial.html',
        controller: ['$scope',
          function (scope) {
            scope.title = entity.status === 0 ? '启用规格' : '停用规格';
            scope.message = '<h4>您确定要' + scope.title + ' ( <span class="text-warning">' + entity.name + '</span> ) 吗？</h4>';

            scope.confirm = function () {
              entity.processing = true;

              service.toggle(entity).then(function (res) {
                entity.status = entity.status === 0 ? 1 : 0;
                growl.addSuccessMessage(scope.title + "操作成功");
              }, function (rej) {
                growl.addErrorMessage(rej.message || scope.title + "操作失败");
              })['finally'](function () {
                entity.processing = false;
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

/**
 *款色规管理
 * @Deprecated
 */
marketModule.controller('goodsSpecificationInfoController', ['$scope', '$state', '$modal', 'growl', 'goodsSpecificationInfoService',
  function ($scope, $state, $modal, growl, service) {
    $scope.page = 1;
    $scope.size = 20;

    /**
     *列表查询
     */
    $scope.query = function (keep) {

      $scope.list = keep ? $scope.list : null;
      service.query({
        pageNo: $scope.page,
        pageSize: $scope.size,
        name: $scope.name,
        status: $scope.status
      }).then(function (res) {
        $scope.list = res.list;
        $scope.total = res.total;
      }, function () {});
    };

    /**
     *新建
     */
    $scope.create = function (keep) {
      $modal.open({
        templateUrl: 'modules/market/templates/goodsspecificationinfo/goodsspecificationinfo.partial.html',
        controller: ['$scope',
          function (scope) {
            scope.title = '添加规格';
            scope.entity = {};

            scope.confirm = function () {
              scope.processing = true;

              service.create(scope.entity).then(function (res) {
                growl.addSuccessMessage(scope.title + "成功");
                $scope.page = 1;
                $scope.query();
              }, function (rej) {
                growl.addErrorMessage(scope.title + "失败,原因：" + rej.message);
              })['finally'](function () {
                scope.processing = false;
                scope.$close();
              });
            };
          }
        ]
      });
    };

    /**
     *修改
     */
    $scope.modify = function (item) {
      $modal.open({
        templateUrl: 'modules/market/templates/goodsspecificationinfo/goodsspecificationinfo.partial.html',
        controller: ['$scope',
          function (scope) {
            scope.title = '修改规格';
            scope.entity = angular.copy(item);
            scope.confirm = function () {
              scope.processing = true;
              service.update(scope.entity).then(function (res) {
                growl.addSuccessMessage(scope.title + "成功");
                $scope.page = 1;
                $scope.query();
              }, function (rej) {
                growl.addErrorMessage(scope.title + "失败,原因：" + rej.message);
              })['finally'](function () {
                scope.processing = false;
                scope.$close();
              });
            };
          }
        ]
      });
    };

    $scope.delete = function (entity) {
      $modal.open({
        templateUrl: 'config/templates/delete.partial.html',
        controller: ['$scope',
          function (scope) {
            scope.entity = entity;
            scope.title = '删除规格类型';
            scope.message = '<h4>您确定要删除规格 ( <span class="text-warning">' + entity.name + '</span> ) 吗？</h4>';
            scope.confirm = function () {
              entity.deleting = true;

              service.remove({
                id: entity.id
              }).then(function (res) {
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

    /**
     *切换状态
     */
    $scope.toggle = function (entity) {
      service.toggle(entity).then(function (res) {
        $scope.query();
      }, function () {});
    };

    $scope.query();

  }
]);