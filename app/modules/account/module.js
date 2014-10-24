/*global Modules:true*/

// define module
var accountModule = Modules.register('accountModule', ['app']);

// config routes
accountModule.config(function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/account/login");

  $stateProvider
    .state('account', {
      url: '/account',
      "abstract": true,
      template: "<div ui-view></div>"
    })
    .state('account.login', {
      url: '/login',
      templateUrl: "modules/account/templates/login.html",
      controller: 'loginController'
    })
    .state('account.logout', {
      url: '/logout',
      template: '<div class="jumbotron center-block" style="width:300px;"><div class="alert alert-info text-center">正在登出...</div></div>',
      controller: 'logoutController'
    })
    .state('account.settings', {
      url: '/settings',
      templateUrl: "modules/account/templates/settings.html",
      controller: 'settingsController'
    })
    .state('account.member', {
      url: '/member',
      templateUrl: "modules/account/templates/member.html",
      controller: 'memberController'
    })
    .state('account.role', {
      url: '/role',
      templateUrl: "modules/account/templates/role.html",
      controller: 'roleController'
    });
});