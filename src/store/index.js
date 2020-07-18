import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: {},
    statusAudit: {},
    sname: '',
    menus: [],
    collapse: false,
    baseInfo: null, // 商超商品基础信息
    goodsDetails: null, // 商超商品详情列表
    active: 0,
    initPwd: null,
    homeBaseInfo: null, // 家政商品基础信息
    homeGoodDetail: null, // 家政商品详情列表
    homeActive: 0
  },

  mutations: {
    getUserInfo(state, val) {
      state.userInfo = val;
    },
    setStatus(state, val) {
      state.statusAudit = val;
      console.log(val, '9090909');
      localStorage.setItem('user', val);
    },
    setSname(state, val) {
      state.sname = val;
    },
    getMenus(state, val) {
      state.menus = val;
      localStorage.setItem('setMenus', val);
    },
    getCollapse(state, val) {
      state.collapse = val;
    },
    getBaseInfo(state, val) {
      state.baseInfo = val;
      console.log(val);
    },
    changState(state, val) {
      state.active = val;
    },
    GoodsDetails(state, val) {
      state.goodsDetails = val;
    },
    getInitPwd(state, val) {
      state.initPwd = val;
      localStorage.setItem('initPwd', val);
    },
    getHomeBaseInfo(state, val) {
      state.homeBaseInfo = val;
    },
    getHomeGoodsDetail(state, val) {
      state.homeGoodDetail = val;
    },
    changActive(state, val) {
      state.homeActive = val;
    }
  },
  actions: {
    getUserInfo(context, v) {
      context.commit('getUserInfo', v);
    },
    setStatusAudit(context, v) {
      context.commit('setStatus', v);
    },
    setSname(context, v) {
      context.commit('setSname', v);
    },
    getMenus(context, v) {
      context.commit('getMenus', v);
    },
    getBaseInfo(context, v) {
      context.commit('getBaseInfo', v);
    },
    changState(context, v) {
      context.commit('changState', v);
    },
    GoodsDetails(context, v) {
      context.commit('GoodsDetails', v);
    },
    // 存储家政基础信息
    getHomeBaseInfo(context, v) {
      context.commit('getHomeBaseInfo', v);
    },
    // 存储家政商品详情列表
    getHomeGoodsDetail(context, v) {
      context.commit('getHomeGoodsDetail', v);
    }
  }
});
