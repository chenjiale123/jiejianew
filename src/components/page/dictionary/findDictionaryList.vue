<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
      class="ele-form"
    >
      <el-form-item label="字典Key" prop="dictName">
        <el-input
          v-model="queryParams.dictionaryKey"
          placeholder="请输入字典key"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="contian-box">
      <el-row :gutter="10" class="mb8 option-btn">
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
      <el-table v-loading="loading" :data="typeList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="字典key" align="center" prop="dictionaryKey" />
        <el-table-column
          label="字典名称"
          align="center"
          prop="description"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
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
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="字典key" prop="dictionaryKey">
          <el-input v-model="form.dictionaryKey" placeholder="请输入字典key" />
        </el-form-item>
        <el-form-item label="字典描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入字典描述" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listType, getType, delType, addType, updateType, exportType } from '@/api/system/dict/type';

export default {
  name: 'Dict',
  data() {
    return {
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
      // 字典表格数据
      typeList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],

      // 查询参数
      queryParams: {
        pageNum: 1,
        id: undefined,
        pageSize: 20,
        dictionaryKey: undefined

      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        dictionaryKey: [
          { required: true, message: '字典名称不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '字典类型不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询字典类型列表 */
    getList() {
      this.loading = true;
      listType(this.queryParams).then(response => {
        console.log(response.data);
        this.typeList = response.data.list;
        this.total = response.data.total;

        this.loading = false;
      }
      )
        .catch(err => {
          this.msgError('请求失败');
        });
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: '',
        dictionaryKey: '',
        description: ''
      };
      this.resetForm('form');
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        id: undefined,
        pageSize: 20,
        dictionaryKey: undefined
      };
      this.resetForm('queryForm');
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加字典类型';
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const dictId = row.id || this.ids;

      this.form = row;
      this.form.id = row.id;
      this.open = true;
      this.title = '修改字典类型';
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != '') {
            updateType(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.message);
              }
            });
          } else {
            addType(this.form).then(response => {
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const dictIds = row.id || this.ids.join(',');
      this.$confirm('是否确认删除字典编号为"' + dictIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delType({ ids: dictIds });
      }).then(() => {
        this.getList();
        this.msgSuccess('删除成功');
      }).catch(function () { });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有类型数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return exportType(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () { });
    }
  }
};
</script>
<style lang="scss" scoped>
.ele-form {
  background-color: #fff;
  text-align: left;
  padding: 15px 15px 15px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .el-form-item {
    margin-bottom: 0px;
  }
}
.contian-box {
  background-color: #fff;
  margin-top: 10px;
  padding: 15px;
  min-height: 698px;
  .option-btn {
    margin-bottom: 15px;
  }
}
</style>
