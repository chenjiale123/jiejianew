import request from '../../axios/http';


export function getArgue(query) {
  return request({
    url: '/protocol/findProtocolList',
    method: 'get',
    params: query

  });
}

export function editArgue(id,title,content) {
  return request({
    url: '/protocol/updProtocol?id='+id+"&title="+title+'&content='+content,
    method: 'post',
 

  });
}




export function ArgueDetail(query) {
  return request({
    url: '/protocol/findProtocolDetail',
    method: 'get',
    params: query

  });
}