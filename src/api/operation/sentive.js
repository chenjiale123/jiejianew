import request from '../../axios/http';


export function getSentive(query) {
  return request({
    url: '/sensitive/findSensitiveVocabularyList',
    method: 'get',
    params: query

  });
}




export function sentiveDetail(query) {
    return request({
      url: '/sensitive/findSensitiveVocabularyDetail',
      method: 'get',
      params: query
  
    });
  }

  


export function sentiveDel(query) {
    return request({
      url: '/sensitive/delSensitiveVocabulary',
      method: 'post',
      params: query
  
    });
  }
export function addSentive(sensitiveVocabulary,sensitiveVocabularyName) {
  return request({
    url: '/sensitive/addSensitiveVocabulary?sensitiveVocabulary='+sensitiveVocabulary+'&sensitiveVocabularyName='+sensitiveVocabularyName,
    method: 'post',
 

  });
}

export function updSentive(id,sensitiveVocabulary,sensitiveVocabularyName) {
    return request({
      url: '/sensitive/updSensitiveVocabulary?id='+id+'&sensitiveVocabulary='+sensitiveVocabulary+'&sensitiveVocabularyName='+sensitiveVocabularyName,
      method: 'post',
   
  
    });
  }