import request from '../../axios/http';

export function getMarket(query) {
  return request({
    url: '/marketSpec/findMarketSpecList',
    method: 'get',
    params: query

  });
};
export function addMarket(query) {
  return request({
    url: '/marketSpec/addMarketSpec',
    method: 'post',
    data: query

  });
}

export function updMarket(query) {
  return request({
    url: '/marketSpec/updateMarketSpec',
    method: 'post',
    data: query

  });
}
export function updSort(id, sort) {
  return request({
    url: '/marketSpec/updSort?id=' + id + '&sort=' + sort,
    method: 'post'

  });
}

export function delMarket(query) {
  return request({
    url: '/marketSpec/delMarketSpec',
    method: 'post',
    params: query

  });
}

export function getMarketDetail(query) {
  return request({
    url: '/marketSpec/findMarketSpecDetail',
    method: 'get',
    params: query

  });
}
