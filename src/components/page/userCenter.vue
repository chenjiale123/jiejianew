<template>
  <div class="warp">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="修改密码" name="first">
        <div class="updatPwd">
          <el-form
            ref="passwordForm"
            :model="pswForm"
            :rules="pswRules"
            class="psw-form"
            label-width="80px"
          >
            <el-form-item prop="oldPwd" label="旧密码">
              <el-input
                v-model="pswForm.oldPwd"
                type="password"
                auto-complete="off"
                placeholder="请输入旧密码"
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
            <el-form-item>
              <el-button size="medium" type="primary" @click.native.prevent="handleUpdata">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="重置密码" name="second">
        <div class="titles">这里将把密码修改为默认登录密码</div>
        <div>
          <el-button size="medium" type="primary" @click.native.prevent="handleRest">重置密码</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { updPassword, restPwd } from '@/api/user';
export default {
  data() {
    return {
      activeName: 'first',
      pswForm: {
        oldPwd: '',
        newPwd: '',
        againPsw: ''
      },
      pswRules: {
        oldPwd: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' }
        ],
        newPwd: [{ required: true, message: '新密码不能为空', trigger: 'blur' }],
        againPsw: [{ required: true, message: '确认密码不能为空', trigger: 'blur' }]
      }

    };
  },
  created() {
    const useInfo = JSON.parse(localStorage.getItem('user')).username;
    console.log(useInfo);
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
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
            console.log(res);
            if (res.code !== 200) {
              that.$message(res.message);
            } else {
              this.msgSuccess('修改成功,请重新登录');
              setTimeout(function () {
                that.$router.replace({ path: '/login' });
              }, 1000);
            }
          });
        }
      });
    },
    handleRest() {
      const that = this;
      this.$confirm('确认重置？')
        .then(() => {
          restPwd().then((res) => {
            console.log(res);
            if (res.code === 200) {
              this.msgSuccess('重置成功,请重新登录');
              setTimeout(function () {
                that.$router.replace({ path: '/login' });
              }, 1000);
            }
          });
        })
        .catch(() => { });
    }

  }
};
</script>
<style lang="scss" scoped>
.warp {
  background-color: #fff;
  padding: 10px;
  text-align: left;
  height: calc(100%);
  padding-bottom: 30px;
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
  .el-input {
    width: auto;
  }
  .titles {
    margin-bottom: 15px;
    font-size: 14px;
  }
}
</style>
