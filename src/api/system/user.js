import request from '../../axios/http';

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/user/findUserList',
    method: 'get',
    params: query
  });
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/user/findUserDetail',
    method: 'get',
    params: userId
  });
}

// 新增用户
export function addUser(loginid, username, phone, deptid, sex, education, provinceId, cityId, areaId, address, roles, form) {
  return request({
    url: 'user/addUser?loginid=' + loginid + '&username=' + username + '&phone=' + phone + '&deptid=' + deptid + '&sex=' + sex + '&education=' + education + '&provinceId=' + provinceId + '&cityId=' + cityId +
      '&areaId=' + areaId + '&address=' + address + '&password=' + '&roles=' + roles,
    method: 'post',
    data: form
  });
}

// 修改用户
export function updateUser(id, loginid, username, phone, deptid, sex, education, provinceId, cityId, areaId, address, roles, form) {
  return request({
    url: 'user/updUser?id=' + id + '&loginid=' + loginid + '&username=' + username + '&phone=' + phone + '&deptid=' + deptid + '&sex=' + sex + '&education=' + education + '&provinceId=' + provinceId + '&cityId=' + cityId +
      '&areaId=' + areaId + '&address=' + address + '&roles=' + roles,
    method: 'post',
    data: form
  });
}

// 删除用户
export function delUser(userId) {
  return request({
    url: 'user/delUser',
    method: 'post',
    params: userId
  });
}

// 导出用户
export function exportUser(query) {
  return request({
    url: '/system/user/export',
    method: 'get',
    params: query
  });
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  const data = {
    userId,
    password
  };
  return request({
    url: '/system/user/resetPwd',
    method: 'put',
    data: data
  });
}

// 用户状态修改
export function changeUserStatus(data) {
  return request({
    url: 'user/updUserStatus',
    method: 'post',
    params: data
  });
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/system/user/profile',
    method: 'get'
  });
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/system/user/profile',
    method: 'put',
    data: data
  });
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  };
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    params: data
  });
}

// 用户头像上传
export function uploadAvatar(id, isFont, data) {
  return request({
    url: 'user/uploadCardImage?id=' + id + '&isFont=' + isFont,
    method: 'post',
    data: data
  });
}

// 用户字典值
export function findSelect(data) {
  return request({
    url: 'common/findDictionaryValueSelect',
    method: 'get',
    params: data
  });
}
// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/system/user/importTemplate',
    method: 'get'
  });
}
