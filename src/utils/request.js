import axios from 'axios';
import Cookies from 'js-cookie'
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
const service = axios.create({
  // process.env.NODE_ENV === 'development' 来判断是否开发环境
  // easy-mock服务挂了，暂时不使用了
  // baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
  timeout: 5000
});

service.interceptors.request.use(


  config => {
    console.log(Cookies.get('token'))
    if (Cookies.get('token')) {
      config.headers['Authentication'] = Cookies.get('token') // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },

  error => {
    // console.log(error);
    return Promise.reject();
  }
);

service.interceptors.response.use(
  response => {
    if (response.status === 200) {
      // console.log(response.data)

      return response.data;
    } else {
      Promise.reject();
    }
  },
  error => {
    console.log(error);
    return Promise.reject();
  }
);

export default service;
