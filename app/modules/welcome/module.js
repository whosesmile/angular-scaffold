// define module
var welcomeModule = Modules.register('welcomeModule', ['app']);

// config router
welcomeModule.config(function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/welcome");

  $stateProvider
    .state('welcome', {
      url: "/welcome",
      templateUrl: "modules/welcome/templates/welcome.html",
      controller: 'welcomeController'
    });
});