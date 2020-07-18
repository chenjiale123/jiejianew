import request from '../axios/http';

export const addVersion = (verName, verCode, force, info, type, formData) => {
  return request({
    url: 'versionControl/addVersion?verName=' + verName + '&verCode=' + verCode + '&force=' + force + '&info=' + info + '&type=' + type,
    method: 'post',
    data: formData
  });
};

export const delVersion = (data) => {
  return request({
    url: 'versionControl/delVersion',
    method: 'post',
    params: data
  });
};

export const getVersionList = (params) => {
  return request({
    url: 'versionControl/findVersionList',
    method: 'get',
    params: params
  });
};

export const updateVersion = (id, verName, verCode, force, info, type, formData) => {
  return request({
    url: 'versionControl/updateVersion?id=' + id + '&verName=' + verName + '&verCode=' + verCode + '&force=' + force + '&info=' + info + '&type=' + type,
    method: 'post',
    data: formData
  });
};

// 轮播图列表
export const findBannerList = (params) => {
  return request({
    url: 'banner/findBannerList',
    method: 'get',
    params: params
  });
};

// 添加轮播图

export const addBanner = (datas) => {
  return request({
    url: 'banner/addBanner?title=' + datas.title + '&status=' + datas.status + '&type=' + datas.type + '&remarks=' + datas.remarks + '&sort=' + datas.sort + '&location=' + datas.location,
    method: 'post',
    data: datas.formData
  });
};

// 修改轮播图

export const updBanner = (datas) => {
  return request({
    url: 'banner/updBanner?id=' + datas.id + '&title=' + datas.title + '&status=' + datas.status + '&type=' + datas.type + '&remarks=' + datas.remarks + '&sort=' + datas.sort + '&location=' + datas.location + '&url=' + datas.url,
    method: 'post',
    data: datas.formData
  });
};

// 删除轮播图
export const delBanner = (param) => {
  return request({
    url: 'banner/delBanner',
    method: 'post',
    params: param
  });
};

// 修改商品状态
export const updBannerStatus = (param) => {
  return request({
    url: 'banner/updBannerStatus',
    method: 'post',
    params: param
  });
};
