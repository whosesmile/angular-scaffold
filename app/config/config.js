/* global serialize:true */

// 关闭HTML安全验证
app.config(['$sceProvider',
  function ($sceProvider) {
    $sceProvider.enabled(false);
  }
]);

// 配置ui-datepicker
app.config(function (datepickerConfig, datepickerPopupConfig) {
  datepickerConfig.showWeeks = false;
  datepickerPopupConfig.showButtonBar = false;
});

// 配置angular-growl
app.config(function (growlProvider) {
  growlProvider.onlyUniqueMessages(true);
  growlProvider.globalTimeToLive(4000);
  growlProvider.globalEnableHtml(false); // ngSanitize
});

// 配置ui-bootstrap
app.config(function (paginationConfig) {
  paginationConfig.directionLinks = true;
  paginationConfig.boundaryLinks = true;
  paginationConfig.maxSize = 10;
  paginationConfig.firstText = '首页';
  paginationConfig.lastText = '尾页';
  paginationConfig.previousText = '上一页';
  paginationConfig.nextText = '下一页';
});

// HTTP拦截器
app.config(function ($httpProvider) {
  // POST method use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

  // Override transformRequest to serialize form data like jquery
  $httpProvider.defaults.transformRequest = [

    function (data) {
      return angular.isObject(data) && String(data) !== '[object File]' ? serialize(data) : data;
    }
  ];

  // Add interceptor
  $httpProvider.interceptors.push(function ($q, growl, $rootScope) {
    return {
      request: function (config) {
        // REST 风格路由重写
        var rules = config.url.match(/:(\w+)/g);
        if (rules !== null) {
          angular.forEach(rules, function (rule) {
            var name = rule.substring(1);
            if (config.params && config.params.hasOwnProperty(name)) {
              config.url = config.url.replace(rule, config.params[name]);
              delete config.params[name];
            }
            else if (config.data && config.data.hasOwnProperty(name)) {
              config.url = config.url.replace(rule, config.data[name]);
              delete config.data[name];
            }
          });
        }
        return $q.when(config);
      },
      response: function (response) {
        if (angular.isObject(response.data)) {
          var res = response.data;
          // 兼容旧数据格式 {code:0, message: '', data: {...}} --> {code:200, data: {message: '', ...}}
          res.data = res.data || {};
          if (res.data.message || res.message) {
            res.data.message = res.data.message || res.message;
          }
          // 401是约定的未登录状态码 后面的条件是兼容老版本
          if (res.code === 401 || response.data.__ajax__error__back === 'login') {
            $rootScope.USER = null;
            $rootScope.$emit('loginRequired');
          }

          // 默认自动拆包
          if (response.config.$parsing !== false) {
            if ([0, 200].indexOf(res.code) !== -1) {
              return res.data;
            }
            else {
              return $q.reject(res.data);
            }
          }
          // 不拆包则返回服务器响应
          else {
            return $q.when(response.data);
          }
        }
        return $q.when(response);
      },
      requestError: function (rejection) {
        growl.addErrorMessage('请求异常，请刷新重试！', {
          ttl: -1
        });
        return $q.reject(rejection);
      },
      responseError: function (rejection) {
        growl.addErrorMessage('服务器异常，请刷新重试！', {
          ttl: -1
        });
        return $q.reject(rejection);
      }
    };
  });
});

// 获取静态域名
app.run(function ($rootScope) {
  var temp = document.createElement('a');
  temp.setAttribute('href', document.querySelector('link[rel="stylesheet"]').getAttribute('href'));
  $rootScope.$host = temp.protocol + '//' + temp.host;
});

// 注册事件
app.run(function ($rootScope) {

 
});

// 配置菜单
app.value('menubar', [{
  "menus": [{
    "href": "#account/member",
    "name": "用户管理",
    "id": 8000201000
  }, {
    "href": "#account/role",
    "name": "角色管理",
    "id": 8000202000
  }, {
    "href": "",
    "name": "菜单配置",
    "id": 8000203000
  }],
  "id": 8000000200,
  "name": "账户管理"
}, {
  "id": 8000000600,
  "name": "团购管理",
  "menus": [{
    "href": "/market/#/market/providerType",
    "name": "供方类型",
    "id": 8000709001
  }, {
    "href": "/market/#/market/provider",
    "name": "供应商",
    "id": 8000709002
  }, {
    "href": "/market/#/market/appChannel",
    "name": "APP频道",
    "id": 8000709003
  }, {
    "href": "/market/#/market/goodsCategory",
    "name": "商品品类",
    "id": 8000709004
  }, {    "href": "/market/#/market/goods",
    "name": "商品管理",
    "id": 8000709005
  }, {    "href": "/market/#/market/goodsSpecification",
    "name": "规格管理",
    "id": 8000709006
  }, {
    "href": "/market/#/market/recommend",
    "name": "推荐管理",
    "id": 8000709016
  }]
}]);