<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24" class="contain-left">
        <div class="head-input">
          <el-input
            v-model="filterText"
            placeholder="请输入部门名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
            @clear="clearInput"
          />
        </div>
        <div class="head-tree">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
            :highlight-current="true"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          label-width="68px"
          class="ele-form"
        >
          <el-form-item label="用户名称" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入用户名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.userStatus"
              placeholder="用户状态"
              clearable
              size="small"
              style="width: 200px"
            >
              <el-option
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="bt-item">
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="ele-table">
          <el-row :gutter="10" class="mb8 btn-option">
            <el-col :span="1.5">
              <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
            </el-col>
            <!-- <el-col :span="1.5">
                        <el-button
                            type="success"
                            icon="el-icon-edit"
                            size="mini"
                            :disabled="single"
                            @click="handleUpdate"
                        >修改</el-button>
            </el-col>-->
            <el-col :span="1.5">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
              >删除</el-button>
            </el-col>
          </el-row>

          <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="40" align="center" />
            <!-- <el-table-column label="用户编号" align="center" prop="userId" /> -->
            <el-table-column
              label="用户名称"
              align="center"
              prop="username"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="用户省"
              align="center"
              prop="province"
              :show-overflow-tooltip="true"
            />
            <el-table-column label="用户市" align="center" prop="city" :show-overflow-tooltip="true" />
            <el-table-column label="用户区" align="center" prop="area" width="120" />
            <el-table-column label="用户地址" align="center" prop="address" width="120" />

            <el-table-column label="手机号码" align="center" prop="phone" width="120" />

            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  :active-value="0"
                  :inactive-value="1"
                  @change="handleStatusChange(scope.row)"
                ></el-switch>
              </template>
            </el-table-column>

            <el-table-column
              label="操作"
              align="center"
              width="180"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                >修改</el-button>
                <el-button
                  v-if="scope.row.userId !== 1"
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />
        </div>
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body class="dialogStyle">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="90px"
        :hide-required-asterisk="true"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户账号:" prop="loginid">
              <el-input v-model="form.loginid" placeholder="请输入用户账号" :readonly="isreadOnly" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户姓名:" prop="username">
              <el-input v-model="form.username" placeholder="请输入用户姓名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="归属部门:" prop="deptId">
              <treeselect
                v-model="form.deptId"
                :options="deptOptions"
                placeholder="请选择归属部门"
                :normalizer="normalizer"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码:" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户学历:" prop="education">
              <el-select v-model="form.education" placeholder="请输入学历">
                <el-option
                  v-for="dict in dataList1"
                  :key="dict.id"
                  :label="dict.dictionaryValue"
                  :value="dict.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12" v-if="passwordShow">
            <el-form-item label="用户密码:" prop="password">
              <el-input v-model="form.password" placeholder="请输入用户密码" type="password" />
            </el-form-item>
          </el-col>-->
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户性别:" prop="sex">
              <el-select v-model="form.sex" placeholder="请选择">
                <el-option
                  v-for="dict in dataList2"
                  :key="dict.id"
                  :label="dict.dictionaryValue"
                  :value="dict.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户角色:" prop="roles">
              <el-select v-model="form.roles" multiple placeholder="请选择">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="用户地址:" prop="address">
              <el-input v-model="form.address" placeholder="请输入地址" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="省:" prop="provinceId">
              <el-select
                v-model="form.provinceId"
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
          <el-col :span="7">
            <el-form-item label="市:" prop="cityId" class="region">
              <el-select
                v-model="form.cityId"
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
          <el-col :span="7">
            <el-form-item label="区:" prop="areaId" class="region">
              <el-select v-model="form.areaId" placeholder="请选择区" class="address">
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
          <el-col :span="12">
            <el-form-item label="身份证正面照">
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
          </el-col>

          <el-col :span="12">
            <el-form-item label="身份证反面照">
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
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" :loading="isDisable">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <!-- <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm" >确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>-->
  </div>
</template>

<script>
import {
  listUser,
  getUser,
  delUser,
  addUser,
  updateUser,
  exportUser,
  resetUserPwd,
  changeUserStatus,
  importTemplate,
  findSelect
} from '@/api/system/user';

import { prvo, city, area } from '@/api/system/area';
import { getToken } from '@/utils/auth';
import { treeselect } from '@/api/system/dept';
import { getRole } from '@/api/system/role';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

export default {
  name: 'User',
  components: { Treeselect },
  data() {
    return {
      passwordShow: '',
      user: '',
      imgUrl: '',
      imgUrl1: '',
      formData: new FormData(),
      formData1: new FormData(),
      dataList1: [],
      dataList2: [],
      isreadOnly: false,
      // 字典参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: undefined,
        dictionaryKey: undefined,
        dictionaryId: undefined,
        parentDictionaryKey: undefined
      },
      Pname: '',
      Cname: '',
      prvoname: [],
      cityname: [],
      areaname: [],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: '',
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      filterText: '',
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [
        {
          dictLabel: '启用',
          dictValue: '0'
        },
        {
          dictLabel: '禁用',
          dictValue: '1'
        }
      ],

      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {
        roles: []
      },
      defaultProps: {
        children: 'children',
        label: 'deptName'
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/system/user/importData'
      },

      // 表单校验
      rules: {
        loginid: [
          { required: true, message: '用户账号不能为空', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' }
        ],

        deptId: [
          { required: true, message: '归属部门不能为空', trigger: 'blur' }
        ],
        roles: [
          { required: true, message: '用户角色不能为空', trigger: 'blur' }
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
        sex: [{ required: true, message: '性别不能为空', trigger: 'blur' }],
        education: [
          { required: true, message: '学历不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        address: [{ required: true, message: '地址不能为空', trigger: 'blur' }]
      },
      isDisable: false
    };
  },
  watch: {
    // 根据名称筛选部门树
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
    this.getTreeselect();
    this.getRoleNode();

    this.provi();
    this.getEducation();
    this.getGender();
  },
  activated() {
    //  this.getList();
    this.getTreeselect();
    this.getRoleNode();

    this.provi();
    this.getEducation();
    this.getGender();
  },
  methods: {
    // 选择省份
    selectProv(val) {
      console.log(val);
      this.Pname = val;
      this.cityName(this.Pname);
    },
    // 选择市
    selectCity(val) {
      console.log(val);
      this.Cname = val;
      this.areaName(this.Cname);
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
    cityName(name) {
      city({ provinceCode: name })
        .then(res => {
          console.log(res);
          this.cityname = res.data;
        })
        .catch(() => { });
    },
    // 区
    areaName(name) {
      area({ cityCode: name })
        .then(res => {
          console.log(res);
          this.areaname = res.data;
        })
        .catch(() => { });
    },
    // 正面照上传

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

        this.formData.set('frontCardImage', file.raw);
      } else {
        this.$message.error('请选择图片文件');
      }
    },

    // 反面照上传
    handleAvatarSuccess1(res, file) {
      // this.form.backCardImage = URL.createObjectURL(file.raw);
      // console.log( this.form.backCardImage);
      //   console.log(file)
    },
    beforeAvatarUpload1(file) {
      // const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 5;

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 5MB!');
      }
      return isLt2M;
    },
    imgPreview1(file, fileList) {
      let fileName = file.name;
      let regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/;
      if (regex.test(fileName.toLowerCase())) {
        console.log(file);
        this.imgUrl1 = URL.createObjectURL(file.raw);

        this.formData.set('backCardImage', file.raw);
      } else {
        this.$message.error('请选择图片文件');
      }
    },
    handleNodeClick(data) {
      console.log(data);
      this.queryParams.deptId = data.id;
      this.getList();
    },
    // el-tree
    normalizer(node) {
      // 去掉children=[]的children属性
      if (node.children == null || node.children.length === 0) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.deptName,
        children: node.children
      };
    },

    /** 查询用户列表 */
    getList() {
      this.loading = true;
      //  console.log(user)
      listUser(this.queryParams)
        .then(response => {
          console.log(response);
          if (response.code === 200) {
            this.userList = response.data.list;
            this.total = response.data.total;
            this.loading = false;
          } else {
            this.msgError(response.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        console.log(response);
        this.deptOptions = response.data;
      });
    },
    // 查询角色列表
    getRoleNode() {
      getRole({
        pageNum: 1,
        pageSize: 99999999
      }).then(res => {
        console.log(res.data.list, '角色');
        this.roleOptions = res.data.list.filter(item => item.status === 0);
      });
    },
    // 查询教育字典值
    getEducation() {
      findSelect({ dictionaryKey: 'educationalBackground' }).then(response => {
        console.log(response);
        this.dataList1 = response.data;
      });
    },
    // 查询性别字典值
    getGender() {
      findSelect({ dictionaryKey: 'sex' }).then(response => {
        this.dataList2 = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.deptName.indexOf(value) !== -1;
    },
    clearInput() {
      this.queryParams.deptId = undefined;
      this.getList();
    },

    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === 0 ? '启用' : '停用';
      this.$confirm(
        '确认要"' + text + '""' + row.username + '"用户吗?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(function () {
          return changeUserStatus({ userId: row.id, userStatus: row.status });
        })
        .then(() => {
          this.msgSuccess(text + '成功');
          this.getList();
        })
        .catch(function () {
          row.status = row.status === 0 ? 1 : 0;
        });
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        loginid: undefined,
        username: undefined,
        phone: undefined,
        deptid: undefined,
        sex: undefined,
        education: undefined,
        provinceId: undefined,
        cityId: undefined,
        areaId: undefined,
        address: undefined,
        password: undefined,
        roles: undefined,
        status: 0
      };
      // this.resetForm('form');
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        id: undefined,
        dictionaryKey: undefined,
        dictionaryId: undefined,
        parentDictionaryKey: undefined
      };
      // this.resetForm('queryForm');
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getTreeselect();
      this.open = true;
      this.title = '添加用户';
      this.user = '';
      this.imgUrl = '';
      this.imgUrl1 = '';
      this.isreadOnly = false;
      if (this.queryParams.deptId) {
        this.form.deptId = this.queryParams.deptId;
      }
      if (this.user == '') {
        this.passwordShow = true;
      } else {
        this.passwordShow = false;
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      this.user = row.id || this.ids;

      console.log(this.user);
      if (this.user !== '') {
        this.passwordShow = false;
      } else {
        this.passwordShow = true;
      }

      getUser({ userid: this.user }).then(response => {
        this.cityName(response.data.userDetail.provinceId);
        this.areaName(response.data.userDetail.cityId);
        console.log(response.data);
        this.form.deptId = response.data.userDetail.deptid;
        this.form.provinceId = String(response.data.userDetail.provinceId);
        this.form.cityId = String(response.data.userDetail.cityId);
        this.form.areaId = String(response.data.userDetail.areaId);
        this.form.education = Number(response.data.userDetail.education);
        this.form.sex = Number(response.data.userDetail.sex);
        this.form.roles = response.data.userRoleIds;
        this.imgUrl = response.data.userDetail.frontCardImage;
        this.imgUrl1 = response.data.userDetail.backCardImage;
        this.form.loginid = response.data.userDetail.loginid;
        this.form.username = response.data.userDetail.username;
        this.form.address = response.data.userDetail.address;
        this.form.phone = response.data.userDetail.phone;
        this.open = true;
        this.title = '修改用户';
        this.isreadOnly = true;
      });
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.userName + '"的新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          resetUserPwd(row.userId, value).then(response => {
            if (response.code === 200) {
              this.msgSuccess('修改成功，新密码是：' + value);
            } else {
              this.msgError(response.message);
            }
          });
        })
        .catch(() => { });
    },
    /** 提交按钮 */
    submitForm: function () {
      const that = this;
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.user !== '') {
            console.log(this.form, '表单');
            this.isDisable = true;
            updateUser(
              this.user,
              this.form.loginid,
              this.form.username,
              this.form.phone,
              this.form.deptId,
              this.form.sex,
              this.form.education,
              this.form.provinceId,
              this.form.cityId,
              this.form.areaId,
              this.form.address,
              this.form.roles.join(','),
              this.formData
            ).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功');
                this.open = false;
                this.isDisable = false;
                this.getList();
              } else {
                this.isDisable = false;
                this.msgError(response.message);
              }
            });
          } else {
            that.isDisable = true;
            addUser(
              this.form.loginid,
              this.form.username,
              this.form.phone,
              this.form.deptId,
              this.form.sex,
              this.form.education,
              this.form.provinceId,
              this.form.cityId,
              this.form.areaId,
              this.form.address,
              this.form.roles.join(','),
              this.formData
            ).then(response => {
              if (response.code === 200) {
                this.msgSuccess('新增成功');
                this.open = false;
                this.isDisable = false;
                this.getList();
              } else {
                this.isDisable = false;
                this.msgError(response.message);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const that = this;
      const userIds = row.id || this.ids.join(',');
      this.$confirm(
        '是否确认删除选中用户的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(function () {
          return delUser({ userIds: userIds });
        })
        .then(() => {
          that.getList();
          that.msgSuccess('删除成功');
        })
        .catch(function () {
          that.$message('已取消删除');
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有用户数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return exportUser(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function () { });
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = '用户导入';
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then(response => {
        this.download(response.msg);
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, '导入结果', { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
  }
};
</script>
<style lang="scss" scoped>
.contain-left {
  background-color: #fff;
  height: calc(100vh - 150px);
}
.head-input {
  margin-top: 10px;
}
.ele-form {
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 10px 20px 10px 20px;
  margin-bottom: 10px;
  position: relative;

  .el-form-item {
    margin-bottom: 0;
  }
  .bt-item {
    position: absolute;
    right: 10px;
  }
}

.btn-option {
  padding-top: 15px;
  margin-bottom: 15px;
}
.ele-table {
  background-color: #fff;
  min-height: 746px;
  padding-left: 15px;
  padding-right: 15px;
}
.el-table {
  border: 0px;
  background-color: #fff;
  // padding: 0 20px;

  img {
    width: 80px;
    height: 80px;
  }
}
.vue-treeselect__control {
  height: 32px;
}
.dialogStyle /deep/ .el-form-item__label {
  font-size: 12px;
  color: #333;
  font-weight: bold;
}
.region {
  /deep/ .el-form-item__label {
    width: 35px !important;
  }
  /deep/ .el-form-item__content {
    margin-left: 35px !important;
  }
}
.el-form-item {
  margin-right: 20px;
  margin-bottom: 20px;
}
.el-pagination {
  text-align: center;
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
</style>
