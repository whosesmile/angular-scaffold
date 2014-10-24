// 定义Module需使用此方法 因为一个应用可能会打包多个模块
// 譬如将accountModule作为登录登出模块放置到其他模块中
// 注意：如果多模块整合可能会出现重名问题，后定义的服务会覆盖前面的
var Modules = {
  modules: [],

  register: function (name, requires, configFn) {
    this.modules.push(name);
    return angular.module(name, requires, configFn);
  },

  generator: function (name) {
    var module = angular.module(name);
    var service = name.replace(/Module$/, '') + 'Service';

    module.factory(service, function (serviceGenerator) {
      return serviceGenerator();
    });
  }
};

var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'angular-growl', 'templates']);

// bootstrap
angular.element(document).ready(function () {
  angular.bootstrap(document, Modules.modules);
});

String(this).replace(/[A-Z]/g, function (match) {
  return ('-' + match.charAt(0));
});