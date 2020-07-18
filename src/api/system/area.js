import request from '../../axios/http';

export function prvo() {
  return request({
    url: 'common/findProvinceSelect',
    method: 'get'

  });
}

export function city(query) {
  return request({
    url: 'common/findCitySelect',
    method: 'get',
    params: query
  });
}

export function area(query) {
  return request({
    url: 'common/findAreaSelect',
    method: 'get',
    params: query
  });
}
