import axios from 'axios';
import store from '../store/index';
import router from '../router/index';
import Cookies from 'js-cookie';

const hostApi = process.env.NODE_ENV === 'production' ? '/api/' : '/api/';
axios.defaults.baseURL = hostApi;
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';

const toLogin = () => {
  router.push({ path: '/login' });
};

// 请求失败后的错误统一处理
const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    // 401: 未登录状态，跳转登录页
    case 401:
      toLogin();
      break;

    case 404:
      // tip('请求的资源不存在');
      break;
    default:
      // eslint-disable-next-line no-console
      console.log(`接口报错${other}`);
  }
};

const errorCode = (code) => {
  switch (code) {
    case 500:
      this.$message.erroe('服务未启动');
      break;

    default:
      break;
  }
};

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    // if ((config.url).indexOf('login') > -1) {
    //   Cookies.remove('token');
    // }
    if (Cookies.get('token')) {
      config.headers['Authentication'] = Cookies.get('token'); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config;
  },
  error => Promise.error(error)
);

//   响应拦截器
axios.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      switch (response.data.code) {
        case '401':
          router.replace({ path: '/login' });
      }
      return response.data;
    }

    return '';
    // eslint-disable-next-line radix
    // Promise.reject();
  },
  // 请求失败
  error => {
    const { response } = error;

    if (response) {

      // return Promise.reject(response);
    }
    return Promise.reject(response);
  }
);
export default axios;
