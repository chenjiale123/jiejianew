<template>
  <div>
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="90px"
      class="ele-form"
    >
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>

      <el-form-item label="轮播图类型:" prop="type">
        <!-- <el-input v-model="form.type" placeholder="请输入版本号" /> -->
        <el-select v-model="queryParams.type" placeholder="请选择">
          <el-option v-for="item in typeData" :key="item.id" :label="item.label" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态:" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择">
          <el-option v-for="item in statusData" :key="item.id" :label="item.label" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="bt-item">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
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
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="标题" align="center" prop="title" :show-overflow-tooltip="true" />
        <el-table-column label="轮播图类型" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span v-if="scope.row.type=='1'">安卓</span>
            <span v-if="scope.row.type=='2'">ios</span>
            <span v-if="scope.row.type=='3'">小程序</span>
          </template>
        </el-table-column>

        <el-table-column label="状态" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{scope.row.status=='0'?'上架':'下架'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="图片路径" align="center" prop="url" :show-overflow-tooltip="true" />
        <el-table-column label="备注" align="center" prop="remarks" :show-overflow-tooltip="true" />
        <el-table-column label="跳转地址" align="center" prop="location" :show-overflow-tooltip="true" />
        <el-table-column label="排序" align="center" prop="sort" :show-overflow-tooltip="true" />
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
              @click="handleUpdata(scope.row)"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            >删除</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-key"
              @click="updStatus(scope.row)"
            >{{ scope.row.status==='0'?'下架':'上架'}}</el-button>
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
    <!-- 添加或者修改banner弹框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="600px" class="dialogStyle">
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="标题:" prop="title">
              <el-input v-model="form.title" placeholder="请输入标题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="轮播图类型:" prop="type">
              <!-- <el-input v-model="form.type" placeholder="请输入版本号" /> -->
              <el-select v-model="form.type" placeholder="请选择">
                <el-option
                  v-for="item in typeData"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态:" prop="status">
              <el-select v-model="form.status" placeholder="请选择">
                <el-option
                  v-for="item in statusData"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序:" prop="sort">
              <el-input v-model="form.sort" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注:" prop="remarks">
              <el-input v-model="form.remarks" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="跳转地址:" prop="location">
              <el-input v-model="form.location" placeholder="请输入跳转地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="上传轮播图" prop="url">
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
                <img v-if="form.url" :src="form.url" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
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
import { findBannerList, addBanner, delBanner, updBanner, updBannerStatus } from '../../../api/verstion';
export default {
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      loading: true,
      datalist: [],
      total: 0,
      title: '添加轮播图',
      open: false,
      rules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '图片类型不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
        sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
        remarks: [{ required: true, message: '备注不能为空', trigger: 'blur' }],
        imgUrl: [{ required: true, message: '上传图片不能为空', trigger: 'blur' }]
      },
      form: {},
      typeData: [{
        label: '安卓',
        id: 1
      }, {
        label: 'ios',
        id: 2
      }, {
        label: '小程序',
        id: 3
      }
      ],
      statusData: [{
        label: '上架',
        id: 0
      }, {
        label: '下架',
        id: 1
      }],
      imgUrl: null,
      multiple: true,
      formData: new FormData(),
      ids: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      findBannerList(this.queryParams).then((res) => {
        if (res.code === 200) {
          this.datalist = res.data.list;
          this.total = res.data.total;
          this.loading = false;
        }
      });
    },
    handleAdd() {
      this.open = true;
    },
    handleUpdata(item) {
      this.open = true;
      this.title = '修改轮播图';
      console.log(item, '轮播图');
      this.form = item;
      this.form.status = Number(item.status);
      this.form.type = Number(item.type);
      this.form.url = item.url;
    },
    handleDelete(item) {
      const that = this;
      const userIds = item.id ? item.id : this.ids.join(',');
      this.$confirm('是否确认删除选中的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return delBanner({ ids: userIds });
        })
        .then(() => {
          that.getList();
          that.msgSuccess('删除成功');
        })
        .catch(function () {
          that.$message('已取消删除');
        });
    },
    handleSelectionChange(val) {
      console.log(val, '555');
      const that = this;
      const selectArry = val;
      if (selectArry.length > 0) {
        selectArry.forEach((item) => {
          that.ids.push(item.id);
        });
        this.multiple = false;
      } else {
        this.multiple = true;
        that.ids = [];
      }
    },
    imgPreview(file, fileList) {
      console.log(file, fileList);
      this.form.url = URL.createObjectURL(file.raw);
      this.formData.set('file', file.raw);
      this.form.formData = this.formData;
    },
    handleAvatarSuccess() { },
    beforeAvatarUpload() { },
    submitForm() {
      const that = this;
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.id) {
            updBanner(that.form).then(result => {
              if (result.code === 200) {
                that.open = false;
                that.getList();
              }
            });
          } else {
            addBanner(that.form).then(res => {
              console.log(res);
              if (res.code === 200) {
                that.open = false;
                that.getList();
              }
            });
          }
        }
      });
    },
    cancel() {
      this.open = false;
    },
    updStatus(item) {
      console.log(item, '商品');
      let status;
      if (Number(item.status) === 1) {
        status = 0;
      } else if (Number(item.status) === 0) {
        status = 1;
      }
      updBannerStatus({ id: item.id, status: status }).then((res) => {
        if (res.code === 200) {
          this.$message(Number(item.status) === 1 ? '上架成功' : '下架成功');
          this.getList();
        }
      });
    },
    handleQuery() {
      this.getList();
    },
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        type: null,
        status: null
      };
      this.getList();
    }

  }
};
</script>
<style lang="scss" scoped>
.avatar {
  width: 130px;
}
.ele-form {
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 10px 20px 0px 20px;
  margin-bottom: 10px;
  position: relative;
  text-align: left;
}
.contian-box {
  background-color: #fff;
  min-height: 746px;
  padding-left: 15px;
  padding-right: 15px;
}
.btn-option {
  padding-top: 15px;
  padding-bottom: 15px;
}
</style>
