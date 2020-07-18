<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="$route.path"
      background-color="rgb(40,52,70)"
      text-color="#F8F8FF"
      active-text-color="#20a0ff"
      unique-opened
      :collapse="getCollpase"
      router
    >
      <div class="logoTitle" >
        <img src="../../assets/img/iconLog1.png" alt class="iconLog" /><span :class="getCollpase?'disactive':''"> 洁佳居家运营平台</span>
      </div>
      <template v-for="item in menuItem">
        <template>
          <el-submenu :index="item.id+''" :key="item.id">
            <template slot="title">
              <img :src="item.icon" alt class="sideImg" />
              <span slot="name">{{ item.name }}</span>
            </template>
            <template v-for="subItem in item.submenu">
              <el-submenu v-if="subItem.submenu" :index="subItem.id+''" :key="subItem.id">
                <template slot="title">
                  <img :src="subItem.icon" alt class="sideImg" />
                  {{ subItem.name }}
                </template>
                <template v-for="threeItem in subItem.submenu">
                  <el-submenu v-if="threeItem.submenu" :index="threeItem.id+''" :key="threeItem.id">
                    <template slot="title">
                      <img v-if="threeItem.icon" :src="threeItem.icon" alt class="sideImg" />
                      {{ threeItem.name }}
                    </template>
                    <el-menu-item
                      v-for="(fourItem,i) in threeItem.submenu"
                      :key="i"
                      :index="fourItem.url+''"
                      @click="toRouter(fourItem.url)"
                    >{{ fourItem.name }}</el-menu-item>
                  </el-submenu>
                  <el-menu-item
                    v-else
                    :key="threeItem.url+''"
                    :index="threeItem.url+''"
                    @click="toRouter(threeItem.url)"
                  >{{ threeItem.name }}</el-menu-item>
                </template>
              </el-submenu>
              <el-menu-item
                v-else
                :index="subItem.url+''"
                :key="subItem.url+''"
                @click="toRouter(subItem.url)"
              >
                <img :src="subItem.icon" alt class="sideImg" />
                {{ subItem.name }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import Bus from '../../utils/bus';
import Cookies from 'js-cookie';
export default {
  data() {
    return {
      isCollapse: false,
      menuItem: []
    };
  },
  computed: {
    getCollpase() {
      return this.$store.state.collapse;
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    const that = this;
    if (this.$store.state.meuns) {
      this.menuItem = JSON.parse(this.$store.state.meuns);
      // this.menuItem.forEach()
    } else {
      this.menuItem = JSON.parse(localStorage.getItem('setMenus'));
    }
    Bus.$on('listenMenu', (e) => {
      if (e) {
        console.log(e, '9999999999');
        that.menuItem = e;
      }
    });
    console.log(this.$router.option);
    // console.log('iscoll', this.menuItem);
    // bus.$on('collapse', msg => {
    //   this.collapse = msg;
    //   bus.$emit('collapse-content', msg);
    // });
  },
  methods: {
    toRouter(url) {
      // console.log(url, '-=----=');
      // this.$router.push({ path: url });
    }
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  /* position: absolute;
  left: 0;
  top: 70px;
  bottom: 0; */
  /* overflow-y: scroll; */
  /* width: 250px; */
  z-index: 9999;
}
.el-submenu {
  text-align: left;
}
.el-submenu img {
  width: 20px;
}
.sidebar::-webkit-scrollbar {
  /* width: 0; */
}
.sidebar-el-menu {
  /* width: 250px; */
  height: calc(100vh);
}
.el-menu {
  border-right: 0;
}
.logoTitle {
  font-size: 16px;
  background-color: rgb(40, 52, 70);
  color: #fff;
  line-height: 60px;
  text-align: left;
  padding-left: 15px;
  /* border-bottom: 1px solid #fff; */
}
.disactive {
  display: none;
}
.el-menu--collapse {
  width: auto;
}
.iconLog {
  width: 30px;
  vertical-align: middle;
  text-align: left;
}
.sideImg{
  display: inline-block;
  width: 20px;
}
</style>
