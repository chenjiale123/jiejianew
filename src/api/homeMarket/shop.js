import request from '../../axios/http';

// 获取基础商品列表
export function getGoodsInfoList(query) {
  return request({
    url: '/homeMarketGoods/findMarketGoodsInfoList',
    method: 'get',
    params: query

  });
}

// 添加商品
export function saveGoodsInfo(data) {
  return request({
    url: '/homeMarketGoods/saveMarketGoodsInfo',
    method: 'post',
    data

  });
}

// 查询商品详情
export function findInfoDetails(id) {
  return request({
    url: '/homeMarketGoods/findMarketGoodsInfo?id=' + id,
    method: 'get'

  });
}

// 修改基础商品详情
export function updateInfoDetails(data) {
  return request({
    url: '/homeMarketGoods/updateMarketGoodsInfo',
    method: 'post',
    data

  });
}
// 查询规格商品详情
export function findGoodsInfoDetails(query) {
  return request({
    url: '/homeMarketGoods/findMarketGoodsInfoDetails',
    method: 'get',
    params: query
  });
}

// 删除商品
export function deleteGoodsInfo(query) {
  return request({
    url: '/homeMarketGoods/deleteMarketGoods',
    method: 'post',
    params: query
  });
}

// 上下架商品
export function updateGoodsStatus(query) {
  return request({
    url: '/homeMarketGoods/updateMarketGoodsStatus',
    method: 'post',
    params: query
  });
}

// 编辑商品规格详情
export function updateGoodsDetail(data) {
  return request({
    url: '/homeMarketGoods/updateMarketGoodsDetail',
    method: 'post',
    data
  });
}
