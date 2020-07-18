import request from '../../axios/http';

export function getStoreList(query) {
  return request({
    url: '/store/findStoreList',
    method: 'get',
    params: query

  });
}
export function addStore(data) {
  return request({
    url: '/store/addStoreBaseInfo',
    method: 'post',
    data

  });
}
export function updataStore(data) {
  return request({
    url: '/store/updateStoreBaseInfo',
    method: 'post',
    data

  });
}
export function delStore(query) {
  return request({
    url: '/store/delStore',
    method: 'post',
    params: query

  });
}

export function updateStatus(query) {
  return request({
    url: '/store/updateStoreStatus',
    method: 'post',
    params: query

  });
}

export function findDetail(query) {
  return request({
    url: '/store/findStoreDetail',
    method: 'get',
    params: query

  });
}

export function uploadFile(formData) {
  return request({
    url: '/common/uploadOfRichText?fileType=' + 2 + '&moduleType=' + 1,
    method: 'post',
    data: formData

  });
}
