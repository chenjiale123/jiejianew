<template>
  <div>
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
      class="ele-form"
    >
      <div>
        <el-form-item label="版本类型" prop="type">
          <el-select v-model="queryParams.type" placeholder="请选择">
            <el-option
              v-for="item in typeData"
              :key="item.id"
              :label="item.describe"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="版本号" prop="verCode">
          <el-input v-model="queryParams.verCode" placeholder="请输入版本号" />
        </el-form-item>
      </div>
      <div>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
    <div class="contian-box">
      <el-row :gutter="10" class="mb8 btn-option">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
        </el-col>

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
      <el-table v-loading="loading" :data="datalist" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="40" align="center" />
        <el-table-column label="版本名称" align="center" prop="verName" />
        <el-table-column label="版本号" align="center" prop="verCode" :show-overflow-tooltip="true" />

        <el-table-column label="地址" align="center" prop="url" :show-overflow-tooltip="true" />
        <el-table-column label="版本信息" align="center" prop="info" :show-overflow-tooltip="true" />
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          :show-overflow-tooltip="true"
        />
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
              icon="el-icon-key"
              @click="handleUpdata(scope.row)"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-key"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
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
            <el-form-item label="版本名称:" prop="verName">
              <el-input v-model="form.verName" placeholder="请输入版本名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="版本号:" prop="verCode">
              <el-input v-model="form.verCode" placeholder="请输入版本号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :span="12">
            <el-form-item label="版本id:" prop="id">
              <el-input v-model="form.id" placeholder="请输入版本id" />
            </el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-form-item label="版本信息:" prop="info">
              <el-input v-model="form.info" placeholder="请输入版本信息" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否更新:" prop="force">
              <el-select v-model="form.force" placeholder="请选择">
                <el-option
                  v-for="dict in forceData"
                  :key="dict.id"
                  :label="dict.describe"
                  :value="dict.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="版本类型:" prop="type">
              <el-select v-model="form.type" placeholder="请选择版本类型">
                <el-option
                  v-for="dict in typeData"
                  :key="dict.id"
                  :label="dict.describe"
                  :value="dict.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="上传文件">
              <el-upload
                class="avatar-uploader"
                action="#"
                :on-change="imgPreview"
                :auto-upload="false"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <!-- <img v-if="imgUrl" :src="imgUrl" class="avatar" /> -->
                <el-button size="small" type="primary">点击上传</el-button>
                <div>{{file}}</div>
              </el-upload>
              <!-- <el-upload
                class="upload-demo"
                action="#"
                :on-change="handleChangeFile"
                :file-list="fileList"
              >
                <el-button size="small" type="primary">点击上传</el-button>

              </el-upload>-->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addVersion, delVersion, getVersionList, updateVersion } from '../../../api/verstion';
export default {
  data() {
    return {
      content: '',
      open: false,
      title: '',
      userList: [],
      total: 0,
      datalist: [],
      loading: false,
      queryParams: {
        type: undefined,
        verCode: undefined,
        pageNum: 1,
        pageSize: 20
      },
      typeData: [{ id: 0, describe: '安卓' }, { id: 1, describe: '苹果' }],
      forceData:
        [{ id: 0, describe: '否' }, { id: 1, describe: '是' }],
      ids: '',
      form: {},
      multiple: true,
      rules: {
        verName: [{ required: true, message: '版本名称不能为空', trigger: 'blur' }],
        verCode: [{ required: true, message: '版本号不能为空', trigger: 'blur' }],
        force: [{ required: true, message: '是否更新不能为空', trigger: 'blur' }],
        info: [{ required: true, message: '版本信息不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '版本类型不能为空', trigger: 'blur' }]
      },
      isUpdata: false,
      fileList: [],
      formData: new FormData(),
      file: ''
    };
  },
  created() {
    this.getList();
  },
  methods: {

    cancel() {
      this.open = false;
    },

    getList() {
      this.loading = true;
      const that = this;
      getVersionList(this.queryParams)
        .then(res => {
          console.log(res);
          if (res.code === 200) {
            this.datalist = res.data.list;
            this.total = res.data.total;
            this.loading = false;
          }
        })
        .catch((err) => {
          that.$message(err);
        });
    },
    handleChangeFile(file, fileList) {
      this.fileList = fileList.slice(-1);
      this.formData.append(file.raw);
    },
    handleAvatarSuccess() { },
    beforeAvatarUpload() { },
    imgPreview(file, fileList) {
      this.formData.set('frontCardImage', file.raw);
      this.file = file.raw;
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    handleQuery() {
      this.getList();
    },
    handleDelete(row) {
      const that = this;
      const userIds = row.id || this.ids.join(',');
      this.$confirm('是否确认删除版本为"' + userIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return delVersion({ ids: userIds });
        })
        .then(() => {
          that.getList();
          that.msgSuccess('删除成功');
        })
        .catch(function () {
          that.$message('已取消删除');
        });
    },
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加版本';
      this.isUpdata = false;
    },
    handleUpdata(row) {
      this.reset();
      this.form.id = row.id || this.ids;
      this.title = '修改版本';
      this.isUpdata = true;
      this.form.verName = String(row.verName);
      this.form.verCode = String(row.verCode);
      this.form.force = row.force;
      this.form.info = String(row.info);
      this.form.type = row.type;

      this.open = true;
    },
    reset() {
      this.form = {
        id: undefined,
        verName: undefined,
        verCode: undefined,
        force: 0,
        info: undefined,
        type: 0,
        file: undefined

      };
    },
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.isUpdata) {
            updateVersion(
              this.form.id,
              this.form.verName,
              this.form.verCode,
              this.form.force,
              this.form.info,
              this.form.type,
              this.formData

            ).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.message);
              }
            });
          } else {
            addVersion(
              this.form.verName,
              this.form.verCode,
              this.form.force,
              this.form.info,
              this.form.type,
              this.formData
            ).then(response => {
              if (response.code === 200) {
                this.msgSuccess('新增成功');
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.message);
              }
            });
          }
        }
      });
    },
    resetQuery() {
      this.queryParams = {
        type: undefined,
        verCode: undefined,
        pageNum: 1,
        pageSize: 20
      };
      this.getList();
    }
  }
};
</script>
<style lang="scss" scoped>
.dialogStyle {
  // width: 500px;
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
/deep/ .el-upload--text {
  text-align: left !important;
}
.btn-option {
  padding-top: 15px;
  margin-bottom: 15px;
}
.contian-box {
  background-color: #fff;
  min-height: 746px;
  padding-left: 15px;
  padding-right: 15px;
}
</style>
