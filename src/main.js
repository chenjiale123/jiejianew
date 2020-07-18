// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import Vuex from 'vuex';
import router from './router';
import Axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import mainCss from './assets/css/main.css';
import store from './store/index';
import VueI18n from 'vue-i18n';
import Cookies from 'js-cookie';
import api from './api';
import { messages } from './components/common/i18n';
import { parseTime, resetForm, addDateRange, selectDictLabel, download, handleTree, dateForm } from '@/utils/ruoyi';

import Pagination from '@/components/common/Pagination';
Vue.prototype.dateForm = dateForm;
Vue.prototype.resetForm = resetForm;
Vue.prototype.addDateRange = addDateRange;
Vue.prototype.selectDictLabel = selectDictLabel;
Vue.prototype.download = download;
Vue.prototype.handleTree = handleTree;
Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: 'success' });
};

Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: 'error' });
};

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg);
};
const digitalUrl =
  process.env.NODE_ENV === 'production'
    ? '/api/marketGoods/uploadImage'
    : '/api/marketGoods/uploadImage';
Vue.prototype.digitalUploadUrl = digitalUrl;
Vue.component('Pagination', Pagination);

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(Vuex);
Vue.use(VueI18n);
Vue.prototype.$http = Axios;
// Vue.prototype.$api = api;

const i18n = new VueI18n({
  locale: 'zh', // 指定默认语言
  messages
});

// let token;
// token = localStorage.getItem('token');
// let isLogin = false;
// if (token && token.length > 0) {
//   isLogin = true;
// }
// const setStatusAudit = localStorage.getItem('setStatusAudit');
// if (isLogin) {
//   if (!setStatusAudit) {
//     getStatusAudit().then((result) => {
//       if (result.data) {
//         store.commit('setStatus', result.data.data);
//       }
//     });
//   }
// }
// Vue.prototype.$getAudit = getStatusAudit;

// router.beforeEach((to, from, next) => {
//   // if (to.matched.length === 0) {
//   //   next('/');
//   // }
//   if (!Cookies.get('token')) {
//     if (to.path !== '/login') {
//       return next('/login');
//     }
//   }
//   if (!childrens.length) {
//     if (store.state.meuns) {
//       menuItem = JSON.parse(store.state.meuns);
//     } else {
//       menuItem = JSON.parse(localStorage.getItem('setMenus'));
//     }
//     if (menuItem) {
//       filterAsyncRouter(menuItem);
//     }

//     // const rout = router.options.routes[1].children.concat(childrens);
//     console.log(router, '-------------');
//     router.addRoutes(router);
//   }
//   next();
// });

// const userInfo = localStorage.getItem('getUserInfo');

// store.commit('getUserInfo', userInfo);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  mainCss,
  components: { App },
  template: '<App/>'
});
