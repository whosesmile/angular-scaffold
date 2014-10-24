// 为了分割数组以便二次使用ng-repeat
// 通常需要的场景是你需要每隔N个元素插入分组节点
// 如果你修改items内部元素的属性 angular会自动watch更新
// 如果动态增删items的元素，要删除items.$rows，以便重新计算

app.filter('group', function () {
  return function (items, cols) {
    if (!items) {
      return items;
    }
    // if items be modified, delete cache
    if (items.$rows) {
      var temp = [];
      for (var i = 0; i < items.$rows.length; i++) {
        temp = temp.concat(items.$rows[i]);
      }

      if (temp.length !== items.length) {
        delete items.$rows;
      }
      else {
        for (var j = 0; j < items.length; j++) {
          if (items[j] !== temp[j]) {
            delete items.$rows;
            break;
          }
        }
      }
    }

    // cache rows for angular dirty check
    if (!items.$rows) {
      var rows = [];
      for (var k = 0; k < items.length; k++) {
        if (k % cols === 0) {
          rows.push([]);
        }
        rows[rows.length - 1].push(items[k]);
      }
      items.$rows = rows;
    }

    return items.$rows;
  };
});

// 判断是否是空白对象
app.filter('empty', function () {
  return function (obj) {
    return !obj || angular.equals({}, obj) || angular.equals([], obj);
  };
});

// 取两个数最小的
app.filter('min', function () {
  return function (num, limit) {
    return Math.min(num, limit);
  };
});

// 取两个数最大的
app.filter('max', function () {
  return function (num, limit) {
    return Math.max(num, limit);
  };
});

// 安全过滤 配合 ng-bind-html 使用
app.filter('safe', ['$sce',
  function ($sce) {
    return function (text) {
      return $sce.trustAsHtml(text);
    };
  }
]);

// 对象状态
app.filter('status', function () {
  return function (status, reversed) {
    if (/^\d$/.test(status)) {
      status = reversed ? (~status + 2) : status;
      return status === 0 ? '停用' : '启用';
    }
    else {
      status = reversed ? (status === 'stopped' ? 'using' : 'stopped') : status;
      return status === 'stopped' ? '停用' : '启用';
    }
  };
});

// 是否判断
app.filter('is', function () {
  return function (status, bool) {
    bool = angular.isUndefined(bool) ? true : bool;
    status = bool ? status : !status;
    return status ? '是' : '否';
  };
});