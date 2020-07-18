<template>
  <div class="login">
    <div class="contain">
      <div class="title">
        <img src="../../assets/logo@2x.png" alt />
        <span>洁佳管理平台</span>
      </div>
      <img class="logo" src="../../assets/xcyu@2x.png" alt />
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
            <!-- <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" /> -->
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            auto-complete="off"
            placeholder="密码"
            @keyup.enter.native="handleLogin"
          >
            <!-- <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" /> -->
          </el-input>
        </el-form-item>
        <el-form-item prop="code" class="code">
          <el-input
            v-model="loginForm.code"
            auto-complete="off"
            placeholder="验证码"
            @keyup.enter.native="handleLogin"
            maxlength="4"
          >
            <!-- <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" /> -->
          </el-input>
          <span class="login-code" @click="getCode1">
            <img :src="codeUrl" />
          </span>
        </el-form-item>
        <!-- <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox> -->
        <el-form-item style="width:100%;">
          <el-button
            :loading="loading"
            size="medium"
            type="primary"
            style="width:400px;"
            @click.native.prevent="handleLogin"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2020 江西洁佳城市生活家居服务有限公司</span>
    </div>
  </div>
</template>

<script>
import { login, getCode } from '../../api/user';
import Cookies from 'js-cookie';

export default {
  name: 'Login',
  data() {
    return {
      codeUrl: '',
      cookiePassword: '',
      loginForm: {
        username: '',
        password: '',
        code: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }],
        code: [{ required: true, trigger: 'change', message: '验证码不能为空' }]
      },
      loading: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCode1();
    // this.getCookie();
  },
  methods: {
    getCode1() {
      getCode().then(res => {
        console.log(res);
        this.codeUrl =
          'data:image/png;base64,' + btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      });
    },

    handleLogin() {
      let that = this;
      const expiresTime = new Date(new Date().getTime() + 3 * 60 * 60 * 1000);
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          that.$store.commit('setStatus', '');
          that.$store.commit('getMenus', '');
          that.$store.commit('getInitPwd', '');
          login({ loginid: this.loginForm.username, password: this.loginForm.password, randCode: this.loginForm.code })
            .then(res => {
              if (res.code === 200) {
                Cookies.set('token', res.data.Authentication, { expires: expiresTime });
                that.$store.commit('setStatus', JSON.stringify(res.data.user));
                that.$store.commit('getMenus', JSON.stringify(res.data.menus));
                that.$store.commit('getInitPwd', res.data.initPwd);
                this.loading = false;
                if (JSON.parse(res.data.menus.length) > 0) {
                  this.$router.replace('/');
                } else {
                  this.msgError('没有菜单权限');
                }
              } else {
                this.msgError(res.message);
                this.loading = false;
              }
            })
            .catch(err => {
              this.loading = false;
              console.log(err);
              this.getCode1();
            });
        }
      });
    }
  }
};
</script>

<style  lang="scss">
body,
html {
  overflow: auto;
}
.login {
  // display: flex;
  // justify-content: center;
  // align-items: center;
  height: 100%;
  background-image: url("../../assets/bjImage.jpg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding-top: 6%;
  box-sizing: border-box;
  width: 100%;
  min-width: 1200px;
  min-height: 100vh;
  .logo {
    display: block;
    width: 372px;
    height: 54px;
    margin: 10px auto;
  }
  .contain {
    margin-bottom: 30px;
  }
}
.title {
  margin: 0px auto 10px auto;
  text-align: center;
  vertical-align: middle;
  img {
    width: 180px;
    height: 60px;
    vertical-align: middle;
  }
  span {
    vertical-align: middle;
    font-size: 36px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
  }
}

.login-form {
  margin: 30px auto;
  border-radius: 6px;
  width: 510px;
  background-color: #fff;
  background-color: rgba(255, 255, 255, 0.4);
  // padding: 47px 55px 30px 55px;
  padding: 47px 0 30px 0;
  text-align: center;
  .el-input {
    height: 38px;
    input {
      height: 38px;
      width: 400px;
    }
  }
  .el-input {
    width: auto;
  }
  .code input {
    width: 243px;
    margin-right: 23px;
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
  .el-checkbox {
    // width: 100%;
    text-align: left;
    padding-left: 55px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 130px;
  height: 38px;
  text-align: right;
  display: inline-block;
  img {
    cursor: pointer;
    vertical-align: middle;
    height: 38px;
  }
}
.el-form-item__error {
  left: 55px;
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #333;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
</style>
