import request from '../../axios/http';

// 查询角色列表
export function listRole(query) {
  return request({
    url: '/system/role/list',
    method: 'get',
    params: query
  });
}

// 查询角色详细
export function getRole(query) {
  return request({
    url: 'role/findRoleList',
    method: 'get',
    params: query

  });
}

// 新增角色
export function addRole(data) {
  return request({
    url: 'role/addRole',
    method: 'post',
    params: data
  });
}

// 修改角色
export function updateRole(data) {
  return request({
    url: 'role/updateRole',
    method: 'post',
    params: data
  });
}

// 角色数据权限
export function dataScope(data) {
  return request({
    url: '/system/role/dataScope',
    method: 'put',
    data: data
  });
}

// 角色状态修改
export function changeRoleStatus(roleId, status) {
  const data = {
    roleId,
    status
  };
  return request({
    url: '/system/role/changeStatus',
    method: 'put',
    data: data
  });
}

// 删除角色
export function delRole(roleId) {
  return request({
    url: 'role/deleteRoles',
    method: 'post',
    params: roleId
  });
}

// 导出角色
export function exportRole(query) {
  return request({
    url: '/system/role/export',
    method: 'get',
    params: query
  });
}
