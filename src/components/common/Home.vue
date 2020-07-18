<template>
  <el-container class="ele-container">
    <el-aside :width="getCollpase?'80px':'235px'">
      <v-sidebar></v-sidebar>
    </el-aside>
    <el-container class="is-vertical">
      <v-head></v-head>
      <el-main>
        <div class="content-box">
          <v-tags></v-tags>
          <div class="content">
            <div style="margin-top:30px">
              <transition name="move" mode="out-in">
                <keep-alive :include="tagsList">
                  <router-view></router-view>
                </keep-alive>
              </transition>
            </div>
            <el-backtop target=".content"></el-backtop>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import vHead from './Header.vue';
import vSidebar from './Sidebar.vue';
import vTags from './Tags.vue';
import bus from './bus';

export default {
  data() {
    return {
      tagsList: [],
      collapse: true,
      clientHeight: ''
    };
  },
  components: {
    vHead,
    vSidebar,
    vTags
  },
  computed: {
    getCollpase() {
      return this.$store.state.collapse;
    }
  },
  created() {
    this.clientHeight = document.body.clientHeight;
    bus.$on('collapse-content', msg => {
      this.collapse = msg;
    });

    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
    bus.$on('tags', msg => {
      let arr = [];
      for (let i = 0, len = msg.length; i < len; i++) {
        msg[i].name && arr.push(msg[i].name);
      }
      this.tagsList = arr;
    });
  }
};
</script>
<style lang="scss" scoped>
.wrapper {
  // display: -webkit-flex;
  // display: flex;
  // justify-content: left;
  // overflow: auto;
}
.ele-container {
  display: -webkit-flex;
  display: flex;
  justify-content: left;
}
.is-vertical {
  flex: 1;
}
.el-aside,
.el-main {
  // float: left;
  padding: 0;
}
</style>
