<template>
  <div class="staff">
    <el-form ref="form" :model="form" :rules="rules" label-width="110px" class="ele-form">
      <div class>
        <el-row>
          <el-col :span="18">
            <el-form-item label="登录账号:" prop="loginid">
              <el-input v-model="form.loginid" placeholder="请输入登录账号" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="!id">
          <el-col :span="18">
            <el-form-item label="登录密码:" prop="password">
              <el-input v-model="form.password" placeholder="请输入登录密码" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="18">
            <el-form-item label="手机号码:" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="18">
            <el-form-item label="真实姓名:" prop="username">
              <el-input v-model="form.username" placeholder="请输入真实姓名" maxlength="20" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="性别:" prop="gender">
              <el-select v-model="form.gender">
                <el-option
                  v-for="dict in dataList2"
                  :key="dict.id"
                  :label="dict.dictionaryValue"
                  :value="dict.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="是否管理员:" prop="isManager">
              <el-select v-model="form.isManager">
                <el-option
                  v-for="dict in dataList1"
                  :key="dict.id"
                  :label="dict.val"
                  :value="dict.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="状态:" prop="auditStatus">
              <el-select v-model="form.auditStatus" placeholder="请选择">
                <el-option
                  v-for="dict in statusOptions"
                  :key="dict.id"
                  :label="dict.value"
                  :value="dict.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="所属门店">
              <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
              <el-tree
                :data="storeTree"
                show-checkbox
                node-key="code"
                :props="defaultProps"
                :filter-node-method="filterNode"
                ref="tree"
                @check="select"
                :current-node-key="node"
                :default-checked-keys="arr"
                :default-expanded-keys="arr"
              ></el-tree>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="省:" prop="provinceCode">
              <el-select
                v-model="form.provinceCode"
                placeholder="请选择省"
                @change="selectProv"
                class="address"
              >
                <el-option
                  v-for="dict in prvoname"
                  :key="dict.code"
                  :label="dict.name"
                  :value="dict.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="市:" prop="cityCode" class="region" label-width="50px">
              <el-select
                v-model="form.cityCode"
                placeholder="请选择市"
                @change="selectCity"
                class="address"
              >
                <el-option
                  v-for="dict in cityname"
                  :key="dict.code"
                  :label="dict.name"
                  :value="dict.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="区:" prop="areaCode" class="region" label-width="50px">
              <el-select v-model="form.areaCode" placeholder="请选择区" class="address">
                <el-option
                  v-for="dict in areaname"
                  :key="dict.code"
                  :label="dict.name"
                  :value="dict.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="18">
            <el-form-item label="用户地址:" prop="address">
              <el-input v-model="form.address" placeholder="请输入地址" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="员工备注:" prop="remark">
              <el-input type="textarea" v-model="form.remark" placeholder="请输入地址" maxlength="200"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div style="margin-right:30px">
        <el-row>
          <el-form-item label="身份证正面照">
            <el-upload
              class="avatar-uploader"
              action="#"
              :on-change="imgPreview1"
              :auto-upload="false"
              :show-file-list="false"
              :on-success="handleAvatarSuccess1"
              :before-upload="beforeAvatarUpload1"
              accept="image/png, image/jpeg, image/jpg"
            >
              <img v-if="imgUrl1" :src="imgUrl1" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="身份证反面照">
            <el-upload
              class="avatar-uploader"
              action="#"
              :on-change="imgPreview"
              :auto-upload="false"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              accept="image/png, image/jpeg, image/jpg"
            >
              <img v-if="imgUrl" :src="imgUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="提示：">
            <span>照片不超过5MB，支持格式jpg，jpeg，png</span>
          </el-form-item>
        </el-row>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm" :loading="isDisable">确 定</el-button>
      <el-button @click="cancel">返回列表</el-button>
    </div>
  </div>
</template>
<script>
import { findSelect } from '@/api/system/user';
import { getStoreTree, addStoreStaff, getStoreDetail, updStoreUser } from '@/api/storeUser/index';
import { prvo, city, area } from '@/api/system/area';
export default {
  data() {
    return {
      node: '',
      id: '',
      arr: [],
      formData: new FormData(),
      formData1: new FormData(),
      filterText: '',
      imgUrl: '',
      imgUrl1: '',
      statusOptions: [
        {
          id: 3,
          value: '启用'
        },
        {
          id: 4,
          value: '禁用'
        }
      ],
      dataList1: [
        {
          id: 0,
          val: '是'
        },
        {
          id: 1,
          val: '否'
        }
      ],
      dataList2: [],
      Pname: '',
      Cname: '',
      prvoname: [],
      cityname: [],
      areaname: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        id: 'code'
      },
      form: {
      },
      storeTree: [],
      isDisable: false,
      // 表单校验
      rules: {
        loginid: [
          { required: true, message: '用户账号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '用户密码不能为空', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' }
        ],

        gender: [{ required: true, message: '性别不能为空', trigger: 'blur' }],
        isManager: [
          { required: true, message: '是否管理员不能为空', trigger: 'blur' }
        ],
        provinceId: [
          { required: true, message: '省不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ],
        auditStatus: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
        provinceCode: [{ required: true, message: '省不能为空', trigger: 'blur' }],
        cityCode: [{ required: true, message: '市不能为空', trigger: 'blur' }],
        address: [{ required: true, message: '地址不能为空', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.provi();
    this.getGender();
    this.getTreeselect();
    this.id = this.$route.query.id;
    if (this.id) {
      this.getDetail(this.id);
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    // 查详情
    getDetail(id) {
      const that = this;
      getStoreDetail({ userId: id })
        .then(res => {
          console.log(res);
          if (res.code === 200) {
            console.log(res.data);
            this.form = res.data;
            this.arr = res.data.storeIds.split(',');
            this.imgUrl = res.data.backCardImage;
            this.imgUrl1 = res.data.frontCardImage;
            this.form.gender = Number(res.data.gender);
            this.$refs.tree.setCheckedKeys(res.data.storeIds.split(','));
            that.Pname = res.data.provinceCode;
            that.Cname = res.data.cityCode;
            that.cityName();
            that.areaName();
          }
        });
    },
    // 门店树点击
    select() {
      let childArr = this.$refs.tree.getCheckedKeys();
      console.log(childArr);
      let arr = [];
      for (let i = 0; i <= childArr.length - 1; i++) {
        if (typeof childArr[i] === 'number') {
          arr.push(childArr[i]);
        }
      }
      this.arr = arr;
      console.log(this.arr);
    },
    // 筛选树节点
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 选择省份
    selectProv(val) {
      console.log(val);
      this.Pname = val;
      this.cityName();
    },
    // 选择市
    selectCity(val) {
      console.log(val);
      this.Cname = val;
      this.areaName();
    },
    // 省
    provi() {
      prvo()
        .then(res => {
          console.log(res);
          this.prvoname = res.data;
        })
        .catch(() => { });
    },
    // 市
    cityName() {
      city({ provinceCode: this.Pname })
        .then(res => {
          console.log(res);
          this.cityname = res.data;
        })
        .catch(() => { });
    },
    // 区
    areaName() {
      console.log(this.Cname);
      area({ cityCode: this.Cname })
        .then(res => {
          console.log(res);
          this.areaname = res.data;
        })
        .catch(() => { });
    },
    // 门店树
    getTreeselect() {
      getStoreTree().then(response => {
        console.log(response);
        this.storeTree = response.data;
      });
    },
    // 性别
    getGender() {
      findSelect({ dictionaryKey: 'sex' }).then(response => {
        this.dataList2 = response.data;
      });
    },
    cancel() {
      this.$router.push({ path: '/store/findStoreStaff' });
    },
    submitForm() {
      if (this.id) {
        console.log(this.arr);
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.isDisable = true;
            updStoreUser(
              this.id,
              this.form.loginid,
              this.form.username,
              this.form.phone,
              this.form.gender,
              this.form.provinceCode,
              this.form.cityCode,
              this.form.areaCode,
              this.form.address,
              this.form.isManager,
              this.arr.join(','),
              this.form.remark,
              this.form.auditStatus,

              this.formData
            ).then((res) => {
              console.log(res);
              if (res.code === 200) {
                this.isDisable = false;
                this.msgSuccess('修改成功');
                this.$router.push({ path: '/store/findStoreStaff' });
              } else {
                this.isDisable = false;
                this.$message(res.message);
              }
            });
          }
        });
      } else {
        this.$refs.form.validate((valid) => {
          if (valid) {
            console.log(this.formData);
            this.isDisable = true;
            addStoreStaff(
              this.form.loginid,
              this.form.username,
              this.form.phone,
              this.form.gender,
              this.form.provinceCode,
              this.form.cityCode,
              this.form.areaCode,
              this.form.address,
              this.form.isManager,
              this.arr.join(','),
              this.form.remark,
              this.form.auditStatus,
              this.form.password,
              this.formData
            ).then(res => {
              if (res.code === 200) {
                this.msgSuccess('新增成功');
                this.$router.push({ path: '/store/findStoreStaff' });
                this.isDisable = false;
              } else {
                this.isDisable = false;
                this.$message(res.message);
              }
              // console.log(res);
            });
          }
        });
      }
    },

    handleAvatarSuccess1(res, file) {

    },
    beforeAvatarUpload1(file) {
      // const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 5;
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 5MB!');
      }
      return isLt2M;
    },
    imgPreview1(file, fileList) {
      let fileName = file.name;
      console.log(file, 'file123');
      let regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/;
      if (regex.test(fileName.toLowerCase())) {
        this.imgUrl1 = URL.createObjectURL(file.raw);

        this.formData.set('frontCardImage', file.raw);
      } else {
        this.$message.error('请选择图片文件');
      }
    },
    handleAvatarSuccess(res, file) { },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 5;
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 5MB!');
      }
      return isLt2M;
    },
    imgPreview(file, fileList) {
      let fileName = file.name;
      console.log(file, 'file123');
      let regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/;
      if (regex.test(fileName.toLowerCase())) {
        this.imgUrl = URL.createObjectURL(file.raw);

        this.formData.set('backCardImage', file.raw);
      } else {
        this.$message.error('请选择图片文件');
      }
    }
  }
};
</script>
<style lang="scss" scoped>
body {
  background: #fff;
}
.staff {
  padding: 20px 0;
  width: 100%;
  height: auto;
  overflow: hidden;
  background: #fff;
}
.el-select {
  width: 100%;
}

/deep/ .el-form-item__error {
  padding-top: 7px;
}
.el-form-item /deep/ .el-upload--picture-card {
  width: 254px;
  height: 100px;
}
/deep/ .vue-treeselect__input-container {
  height: 32px;
}
.el-form-item /deep/ .el-upload {
  width: 195px;
  height: 100px;
  line-height: 100px;
}
.el-form-item /deep/ .avatar {
  width: 254px;
  height: 100px;
  display: block;
}
/deep/ .el-table .cell {
  text-overflow: clip;
}
/deep/ .el-upload--text {
  border: 1px dashed;
  border-radius: 10px;
}
.ele-form {
  display: -webkit-flex;
  display: flex;
}
</style>
