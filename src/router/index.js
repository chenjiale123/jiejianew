import Vue from 'vue';
import Router from 'vue-router';
import Cookies from 'js-cookie';

// const Login = () => import('@/components/Login.vue');
// const home = () => import('@/components/Home.vue');

Vue.use(Router);
// var getRoute;
// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//   return Router.prototype.push.call(this, location).catch(err => err)
// }

const routes = new Router({
  base: '/system/',
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },

    {
      path: '/',
      component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
      meta: { title: '自述文件' },
      children: [
        {
          path: '/dashboard',
          meta: { title: '首页' },
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue')
        },
        {
          path: '/userCenter',
          component: () => import(/* webpackChunkName: "userCenter" */ '../components/page/userCenter.vue'),
          meta: { title: '个人中心' }
        },
        {
          path: '/store/addStoreStaff',
          name: '添加员工',
          component: () => import(/* webpackChunkName: "addStoreStaff" */ '../components/page/store/addStoreStaff.vue'),
          meta: { title: '添加员工' }
        },
        {
          path: '/store/addStore',
          name: '添加门店',
          component: () => import(/* webpackChunkName: "addStore" */ '../components/page/store/addStore.vue'),
          meta: { title: '添加门店' }
        },
        {
          path: '/business/addShop',
          name: '添加商品',
          component: () => import(/* webpackChunkName: "addShop" */ '../components/page/business/addShop.vue'),
          meta: { title: '添加商品' }
        },
        {
          path: '/homeMarket/addHomeShop',
          name: '家政添加商品',
          component: () => import(/* webpackChunkName: "addHomeShop" */ '../components/page/homeMarket/addHomeShop.vue'),
          meta: { title: '添加商品' }
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
      meta: { title: '登录' }
    }

  ]
});

const childrens = [];
let menuItem = [];
// 获取动态路由
function filterAsyncRouter(menuItems) { // 遍历后台传来的路由字符串，转换为组件对象
  const filterRouter = menuItems.forEach((route, index) => {
    if (route.submenu) {
      route.submenu.filter(item => {
        if (item.url) {
          childrens.push({ name: item.name, path: item.url, component: loadView(item.url) });
          // routes.options.routes[1].children.push({ name: item.name, path: item.url, component: loadView(item.url) });
        }
        if (item.submenu) {
          filterAsyncRouter(item.submenu);
        }
      });
    } else {
      if (route.url) {
        childrens.push({ name: route.name, path: route.url, component: loadView(route.url) });
        // routes.options.routes[1].children.push({ name: route.name, path: route.url, component: loadView(route.url) });
      }
    }
  });
  console.log(childrens);
  return filterRouter;
}
function loadView(view) {
  // 路由懒加载
  return () => import(`@/components/page${view}.vue`);
}
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

routes.beforeEach(function (to, from, next) {
  if (!Cookies.get('token')) {
    if (to.path !== '/login') {
      return next('/login');
    }
  }
  if (to.name === 'login' && !Cookies.get('token')) {
    next();
    return;
  }
  if (!localStorage.getItem('setMenus')) {
    return next({ name: 'login' });
  }
  if (!childrens.length && JSON.parse(localStorage.getItem('setMenus')).length > 0) {
    menuItem = JSON.parse(localStorage.getItem('setMenus'));

    if (menuItem) {
      filterAsyncRouter(menuItem);
    }
    childrens.map((item) => {
      routes.options.routes[1].children.push(item);
    });
    routes.addRoutes(routes.options.routes);
    // this.$router.push({path:'/secondRouter'})
    // next();
    next({ ...to, replace: true });
  }
  next();
});

export default routes;
