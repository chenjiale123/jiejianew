import request from '../../axios/http';

// 查询规格列表
export function getMarket(query) {
  return request({
    url: '/homeMarketSpec/findMarketSpecList',
    method: 'get',
    params: query

  });
};

// 添加规格
export function addMarket(query) {
  return request({
    url: '/homeMarketSpec/addMarketSpec',
    method: 'post',
    data: query

  });
}
// 修改规格
export function updMarket(query) {
  return request({
    url: '/homeMarketSpec/updateMarketSpec',
    method: 'post',
    data: query

  });
}

// 修改规格排序
export function updSort(id, sort) {
  return request({
    url: '/homeMarketSpec/updSort?id=' + id + '&sort=' + sort,
    method: 'post'

  });
}

// 删除规格
export function delMarket(query) {
  return request({
    url: '/homeMarketSpec/delMarketSpec',
    method: 'post',
    params: query

  });
}

// 查询规格详情
export function getMarketDetail(query) {
  return request({
    url: '/homeMarketSpec/findMarketSpecDetail',
    method: 'get',
    params: query

  });
}
// 获取规格列表
export function getGoodsSpec(query) {
  return request({
    url: '/homeMarketSpec/findMarketSpecList',
    method: 'get',
    params: query

  });
}
