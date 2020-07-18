


import request from '../../axios/http';

export function getCommentList(query) {
  return request({
    url: '/goodsComment/findGoodsCommentList',
    method: 'get',
    params: query

  });
}



export function getCommentDetail(query) {
    return request({
      url: '/goodsComment/findGoodsCommentDetail',
      method: 'get',
      params: query
  
    });
  }

  


export function updComment(id,status,remark) {
    return request({
      url: '/goodsComment/updateGoodsCommentStatus?id='+id+'&status='+status+'&remark='+remark,
      method: 'post',
     
  
    });
  }