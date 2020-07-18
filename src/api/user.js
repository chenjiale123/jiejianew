import request from '../axios/http';

export const login = (data) => {
  return request({
    url: 'login/login',
    method: 'post',
    data
  });
};

export const getCode = () => {
  return request({
    url: 'login/getRandcode',
    method: 'get',
    responseType: 'arraybuffer'
  });
};

export const updPassword = (oldPwd, newPwd) => {
  return request({
    url: 'login/updPassword?oldPwd=' + oldPwd + '&newPwd=' + newPwd,
    method: 'post'
  });
};
export const restPwd = () => {
  return request({
    url: 'login/forgotPassword',
    method: 'post'
  });
};
