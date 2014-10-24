/*global Modules:true*/

// define module
var marketModule = Modules.register('marketModule', ['app']);

// config routes
marketModule.config(function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/market/home');

  $stateProvider
    .state('market', {
      url: '/market',
      "abstract": true,
      template: "<div ui-view></div>"
    })
    .state('market.home', {
      url: '/home',
      templateUrl: "modules/market/templates/home.html",
      controller: 'homeController'
    }).state('market.providerType', {
      url: '/providerType',
      templateUrl: "modules/market/templates/providertype/providertype.html",
      controller: 'providerTypeController'
    }).state('market.provider', {
      url: '/provider',
      templateUrl: "modules/market/templates/provider/provider.html",
      controller: 'providerController'
    }).state('market.appChannel', {
      url: '/appChannel',
      templateUrl: "modules/market/templates/appchannel/appchannel.html",
      controller: 'appChannelController'
    }).state('market.goodsCategory', {
      url: '/goodsCategory',
      templateUrl: "modules/market/templates/goodscategory/goodscategory.html",
      controller: 'goodsCategoryController'
    }).state('market.goods', {
      url: '/goods',
      templateUrl: "modules/market/templates/goods/goods.html",
      controller: 'goodsController'
    }).state('market.goodsSpecification', {
      url: '/goodsSpecification',
      templateUrl: "modules/market/templates/goodsspecification/goodsspecification.html",
      controller: 'goodsSpecificationController'
    }).state('market.goodsSpecificationInfo', {
      url: '/goodsSpecificationInfo',
      templateUrl: "modules/market/templates/goodsspecificationinfo/goodsspecificationinfo.html",
      controller: 'goodsSpecificationInfoController'
    }).state('market.recommend', {
      url: '/recommend',
      templateUrl: "modules/market/templates/recommend/recommend_column.html",
      controller: 'recommendColumnController'
    });

});