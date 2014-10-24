/* global marketModule:true */
marketModule.factory('providerTypeService', function (serviceGenerator) {
  return serviceGenerator().$actions({

    query: '/market/admin/providerType/list',

    create: '/market/admin/providerType/save',

    update: '/market/admin/providerType/update',

    remove: '/market/admin/providerType/delete',

    toggle: '/market/admin/providerType/updateStatus'

  });
});

marketModule.factory('providerService', function (serviceGenerator) {
  return serviceGenerator().$actions({

    query: '/market/admin/provider/list',

    create: '/market/admin/provider/save',

    update: '/market/admin/provider/update',

    remove: '/market/admin/provider/delete',

    toggle: '/market/admin/provider/updateStatus'

  });
});

marketModule.factory('appChannelService', function (serviceGenerator) {
  return serviceGenerator().$actions({

    query: '/market/admin/appChannel/list',

    create: '/market/admin/appChannel/saveOrUpdate',

    update: '/market/admin/appChannel/saveOrUpdate',

    remove: '/market/admin/appChannel/delete',

    toggle: '/market/admin/appChannel/modifyStatus'

  });
});

marketModule.factory('goodsCategoryService', function (serviceGenerator) {
  return serviceGenerator().$actions({

    query: '/market/admin/goodsCategory/list',

    create: '/market/admin/goodsCategory/saveOrUpdate',

    update: '/market/admin/goodsCategory/saveOrUpdate',

    remove: '/market/admin/goodsCategory/delete',

    toggle: '/market/admin/goodsCategory/modifyStatus'

  });
});

marketModule.factory('goodsService', function (serviceGenerator) {
  return serviceGenerator().$actions({

    query: '/market/admin/goods/list',

    create: '/market/admin/goods/saveOrUpdate',

    update: '/market/admin/goods/saveOrUpdate',

    remove: '/market/admin/goods/delete',

    toggle: '/market/admin/goods/modifyStatus'

  });
});

marketModule.factory('goodsSpecificationService', function (serviceGenerator) {
  return serviceGenerator().$actions({

    query: '/market/admin/goodsSpecification/list',

    create: '/market/admin/goodsSpecification/saveOrUpdate',

    update: '/market/admin/goodsSpecification/saveOrUpdate',

    remove: '/market/admin/goodsSpecification/delete',

    toggle: '/market/admin/goodsSpecification/modifyStatus'

  });
});

marketModule.factory('goodsSpecificationInfoService', function (serviceGenerator) {

  return serviceGenerator().$actions({

    query: '/market/admin/goodsSpecificationInfo/list',

    create: '/market/admin/goodsSpecificationInfo/saveOrUpdate',

    update: '/market/admin/goodsSpecificationInfo/saveOrUpdate',

    remove: '/market/admin/goodsSpecificationInfo/delete',

    toggle: '/market/admin/goodsSpecification/modifyStatus'

  });
});

marketModule.factory('recommendColumnService', function (serviceGenerator) {
  return serviceGenerator().$actions({

    query: '/market/admin/recommendColumn/list',

    create: '/market/admin/recommendColumn/save',

    update: '/market/admin/recommendColumn/update',

    remove: '/market/admin/recommendColumn/delete'

  });
});