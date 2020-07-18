import request from '../../axios/http';

export function getClassifyTree(query) {
  return request({
    url: '/classify/findClassifyList',
    method: 'get',
    params: query

  });
}

// 获取规格列表
export function getGoodsSpec(query) {
  return request({
    url: '/marketSpec/findMarketSpecList',
    method: 'get',
    params: query

  });
}
// 获取基础商品列表
export function getGoodsInfoList(query) {
  return request({
    url: '/marketGoods/findMarketGoodsInfoList',
    method: 'get',
    params: query

  });
}

export function addClassify(name, parentId, status, level, form) {
  return request({
    url: '/classify/addClassify?name=' + name + '&parentId=' + parentId + '&status=' + status + '&level=' + level,
    method: 'post',
    data: form

  });
}
export function getClassifyDetail(query) {
  return request({
    url: '/classify/findClassifyDetail',
    method: 'get',
    params: query

  });
}
export function delClassify(query) {
  return request({
    url: '/classify/delClassify',
    method: 'post',
    params: query

  });
}
export function updClassifyStatus(query) {
  return request({
    url: '/classify/updClassifyStatus',
    method: 'post',
    params: query

  });
}
export function updClassify(id, name, parentId, status, level, form) {
  return request({
    url: '/classify/updClassify?id=' + id + '&name=' + name + '&parentId=' + parentId + '&status=' + status + '&level=' + level,
    method: 'post',
    data: form

  });
}

export function saveGoodsInfo(data) {
  return request({
    url: '/marketGoods/saveMarketGoodsInfo',
    method: 'post',
    data

  });
}

// 查询商品详情
export function findInfoDetails(id) {
  return request({
    url: '/marketGoods/findMarketGoodsInfo?id=' + id,
    method: 'get'

  });
}

// 修改基础商品详情
export function updateInfoDetails(data) {
  return request({
    url: '/marketGoods/updateMarketGoodsInfo',
    method: 'post',
    data

  });
}
// 查询规格商品详情
export function findGoodsInfoDetails(query) {
  return request({
    url: '/marketGoods/findMarketGoodsInfoDetails',
    method: 'get',
    params: query
  });
}

// 删除商品
export function deleteGoodsInfo(query) {
  return request({
    url: '/marketGoods/deleteMarketGoods',
    method: 'post',
    params: query
  });
}

// 上下架商品
export function updateGoodsStatus(query) {
  return request({
    url: '/marketGoods/updateMarketGoodsStatus',
    method: 'post',
    params: query
  });
}

// 编辑商品规格详情
export function updateGoodsDetail(data) {
  return request({
    url: '/marketGoods/updateMarketGoodsDetail',
    method: 'post',
    data
  });
}
