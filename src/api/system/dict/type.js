import request from '../../../axios/http';

// 查询字典类型列表
export function listType(query) {
  return request({
    url: 'dictionary/findDictionaryList',
    method: 'get',
    params: query
  });
}

// 查询字典类型详细
export function getType(dictId) {
  return request({
    url: '/system/dict/type/' + dictId,
    method: 'get'
  });
}

// 新增字典类型
export function addType(data) {
  return request({
    url: 'dictionary/addDictionary',
    method: 'post',
    data: data
  });
}

// 修改字典类型
export function updateType(data) {
  return request({
    url: 'dictionary/updateDictionary',
    method: 'post',
    data: data
  });
}

// 删除字典类型
export function delType(data) {
  return request({
    url: 'dictionary/delDictionary',
    method: 'post',
    params: data

  });
}

// 导出字典类型
export function exportType(query) {
  return request({
    url: '/system/dict/type/export',
    method: 'get',
    params: query
  });
}

// 获取字典选择框列表
export function optionselect() {
  return request({
    url: '/system/dict/type/optionselect',
    method: 'get'
  });
}
