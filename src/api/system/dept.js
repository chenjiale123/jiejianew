import request from '../../axios/http';

// 查询部门列表
export function listDept() {
  return request({
    url: 'dept/findDeptTree',
    method: 'get'

  });
}

// 查询部门列表（排除节点）
export function listDeptExcludeChild(deptId) {
  return request({
    url: '/system/dept/list/exclude/' + deptId,
    method: 'get'
  });
}

// 查询部门详细
export function getDept(deptId) {
  return request({
    url: '/system/dept/' + deptId,
    method: 'get'
  });
}

// 查询部门下拉树结构
export function treeselect() {
  return request({
    url: 'dept/findDeptTree',
    method: 'get'
  });
}

// 根据角色ID查询部门树结构
export function roleDeptTreeselect(roleId) {
  return request({
    url: '/system/dept/roleDeptTreeselect/' + roleId,
    method: 'get'
  });
}

// 新增部门
export function addDept(data) {
  return request({
    url: 'dept/addDept',
    method: 'post',
    data: data
  });
}

// 修改部门
export function updateDept(data) {
  return request({
    url: 'dept/updateDept',
    method: 'post',
    data: data
  });
}
// 禁用部门
export function openDept(data) {
  return request({
    url: 'dept/updateDeptStatus',
    method: 'post',
    data: data
  });
}

// 删除部门
export function delDept(deptId) {
  return request({
    url: 'dept/delDept',
    method: 'post',
    params: deptId
  });
}
