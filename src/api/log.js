import request from '../axios/http';

export function getLog(userId) {
  return request({
    url: 'sysLog/findSysLoginLogList',
    method: 'get',
    params: userId
  });
}
// 操作日志
export function getCLog(params) {
  return request({
    url: 'sysLog/findSysOperationLogList',
    method: 'get',
    params: params
  });
}

export function getULog(userId) {
  return request({
    url: 'sysLog/findSysExceptionLogList',
    method: 'get',
    params: userId
  });
}

export function getClienLog(userId) {
  return request({
    url: 'sysLog/findClientExceptionLogList',
    method: 'get',
    params: userId
  });
}

export function getClienResponse(userId) {
  return request({
    url: 'sysLog/findClientExceptionLogResponse',
    method: 'get',
    params: userId
  });
}

export function getUResponse(userId) {
  return request({
    url: 'sysLog/findSysExceptionLogResponse',
    method: 'get',
    params: userId
  });
}

export function getResponse(userId) {
  return request({
    url: 'sysLog/findSysLoginLogResponse',
    method: 'get',
    params: userId
  });
}
export function getCResponse(userId) {
  return request({
    url: 'sysLog/findSysOperationLogResponse',
    method: 'get',
    params: userId
  });
}

export function getStoreLog(userId) {
  return request({
    url: 'sysLog/findStoreLoginLogList',
    method: 'get',
    params: userId
  });
}

export function getLogRespons(userId) {
  return request({
    url: 'sysLog/findStoreLoginLogResponse',
    method: 'get',
    params: userId
  });
}

export function getOLogRespons(userId) {
  return request({
    url: 'sysLog/findStoreOperationLogResponse',
    method: 'get',
    params: userId
  });
}
export function getELogRespons(userId) {
  return request({
    url: 'sysLog/findSysExceptionLogResponse',
    method: 'get',
    params: userId
  });
}
export function getStoreOpera(userId) {
  return request({
    url: 'sysLog/findStoreOperationLogList',
    method: 'get',
    params: userId
  });
}
export function getStoreExcep(userId) {
  return request({
    url: 'sysLog/findStoreExceptionLogList',
    method: 'get',
    params: userId
  });
}
