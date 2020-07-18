import request from '../../axios/http';


export function getKeyList(query) {
  return request({
    url: '/keyword/findHotKeywordList',
    method: 'get',
    params: query

  });
}



export function addKeyList(hotKeywordName,sort) {
  return request({
    url: '/keyword/addHotKeyword?hotKeywordName='+hotKeywordName+'&sort='+sort,
    method: 'post',


  });
}

export function keyListDel(query) {
  return request({
    url: '/keyword/delHotKeyword',
    method: 'post',
    params: query

  });
}


export function keyListSort(query) {
  return request({
    url: '/keyword/updSort',
    method: 'post',
    params: query

  });
}
export function updKeyList(id,hotKeywordName,sort) {
  return request({
    url: '/keyword/addHotKeyword?id='+id+'&hotKeywordName='+hotKeywordName+'&sort='+sort,
    method: 'post',


  });
}