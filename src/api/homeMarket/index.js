import request from '../../axios/http';

// 查询分类列表
export function getClassifyTree(query) {
  return request({
    url: '/homeClassify/findClassifyList',
    method: 'get',
    params: query

  });
}

// 添加分类
export function addClassify(name, parentId, status, level, form) {
  return request({
    url: '/homeClassify/addClassify?name=' + name + '&parentId=' + parentId + '&status=' + status + '&level=' + level,
    method: 'post',
    data: form

  });
}
// 查询分类详情
export function getClassifyDetail(query) {
  return request({
    url: '/homeClassify/findClassifyDetail',
    method: 'get',
    params: query

  });
}
// 删除分类
export function delClassify(query) {
  return request({
    url: '/homeClassify/delClassify',
    method: 'post',
    params: query

  });
}

// 修改分类状态
export function updClassifyStatus(query) {
  return request({
    url: '/homeClassify/updClassifyStatus',
    method: 'post',
    params: query

  });
}
// 修改分类
export function updClassify(id, name, parentId, status, level, form) {
  return request({
    url: '/homeClassify/updClassify?id=' + id + '&name=' + name + '&parentId=' + parentId + '&status=' + status + '&level=' + level,
    method: 'post',
    data: form

  });
}
