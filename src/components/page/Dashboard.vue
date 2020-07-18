<template>
  <div class="backColor">
    <div class="headTop">{{name}},你好欢迎访问洁佳居家运营平台</div>
    <div>
      <img src="../../assets/img/bangong.png" alt />
    </div>
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      width="30%"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <span class="pwdTitle">您登录的为初始密码，请修改密码</span>
      <el-form
        ref="passwordForm"
        :model="pswForm"
        :rules="pswRules"
        class="psw-form"
        label-width="80px"
      >
        <el-form-item prop="oldPwd" label="初始密码">
          <el-input
            v-model="pswForm.oldPwd"
            type="password"
            auto-complete="off"
            placeholder="请输入初始密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="newPwd" label="新密码">
          <el-input
            v-model="pswForm.newPwd"
            type="password"
            auto-complete="off"
            placeholder="请输入新密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="againPsw" label="确认密码">
          <el-input
            v-model="pswForm.againPsw"
            auto-complete="off"
            type="password"
            placeholder=" 请确认密码"
          ></el-input>
        </el-form-item>

        <el-button size="medium" type="primary" @click.native.prevent="handleUpdata">确定</el-button>
      </el-form>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sureSbmit">确 定</el-button>
      </span>-->
    </el-dialog>
  </div>
</template>

<script>
import Schart from 'vue-schart';
import bus from '../common/bus';
import { updPassword } from '@/api/user';
import Cookies from 'js-cookie';
export default {
  name: 'dashboard',
  data() {
    return {
      name: '',
      dialogVisible: false,
      pswForm: {
        oldPwd: undefined,
        newPwd: undefined,
        againPsw: undefined
      },
      pswRules: {
        oldPwd: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' }
        ],
        newPwd: [{ required: true, message: '新密码不能为空', trigger: 'blur' }],
        againPsw: [{ required: true, message: '确认密码不能为空', trigger: 'blur' }]
      },
      initPwd: null
    };
  },
  components: {
    Schart
  },
  computed: {
    // role() {
    //   return this.name === 'admin' ? '超级管理员' : '普通用户';
    // }
  },
  created() {
    console.log(this.$store.state.statusAudit, '999');
    this.name = JSON.parse(localStorage.getItem('user')).username;

    if (this.$store.state.initPwd) {
      this.initPwd = this.$store.state.initPwd;
    } else {
      this.initPwd = localStorage.getItem('initPwd');
    }
    if (Number(this.initPwd) === 0) { this.dialogVisible = true; }
  },

  methods: {
    changeDate() {
      const now = new Date().getTime();
      this.data.forEach((item, index) => {
        const date = new Date(now - (6 - index) * 86400000);
        item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
      });
    },
    handleUpdata() {
      const that = this;
      this.$refs['passwordForm'].validate(valid => {
        if (valid) {
          if (this.pswForm.newPwd !== this.pswForm.againPsw) {
            this.msgError('确认密码与新密码不一致');
            return;
          }
          updPassword(this.pswForm.oldPwd, this.pswForm.newPwd).then((res) => {
            if (res.code !== 200) {
              that.$message(res.message);
            } else {
              this.msgSuccess('修改成功,请重新登录');
              setTimeout(function () {
                // that.$router.replace({ path: '/login' });
                Cookies.remove('token');
                location.reload();
              }, 1000);
            }
          });
        }
      });
    }

  }
};
</script>

<style lang="scss" scoped>
.backColor {
  background-color: #fff;
  padding-top: 50px;
  /* height: calc(100vh - 190px); */
}
.useInfo {
  width: 450px;
  .item {
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    border-bottom: 1px solid #e5e5e5;
    padding: 10px;
  }
}
.psw-form {
  padding-bottom: 20px;
}
// .el-input {
//   width: auto;
// }
.pwdTitle {
  display: inline-block;
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 15px;
}
.headTop {
  color: #3a8ee6;
  font-size: 26px;
  margin-top: 20px;
}
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}
</style>
