<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" class="ele-form">
      <el-form-item label="字典类型" prop="dictType">
        <el-select v-model="queryParams.parentDictionaryKey" size="small">
          <el-option
            v-for="item in typeOptions"
            :key="item.id"
            :label="item.description"
            :value="item.dictionaryKey"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="字典标签" prop="dictLabel">
        <el-input
          v-model="queryParams.dictLabel"
          placeholder="请输入字典标签"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <!-- <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="数据状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>-->
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
        <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"

        >导出</el-button>
        </el-col>-->
      </el-row>

      <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="字典值key" align="center" prop="dictionaryKey" />
        <el-table-column label="字典值描述" align="center" prop="description" />
        <el-table-column label="字典值" align="center" prop="dictionaryValue" />
        <el-table-column label="所属字典key" align="center" prop="parentKey" />

        <el-table-column label="所属字典描述" align="center" prop="parentDesc" />

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
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="所属字典id:">
          <el-select v-model="form.dictionaryId" placeholder="请选择">
            <el-option
              v-for="item in typeOptions"
              :key="item.id"
              :label="item.description"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字典值key:">
          <el-input v-model="form.dictionaryKey" />
        </el-form-item>
        <el-form-item label="字典值描述:" prop="description">
          <el-input v-model="form.description" placeholder="请输入字典值描述" />
        </el-form-item>
        <el-form-item label="字典值的value:" prop="dictionaryValue">
          <el-input v-model="form.dictionaryValue" placeholder="请输入字典值的value" />
        </el-form-item>
        <el-form-item label="显示排序:" prop="sort">
          <el-input v-model="form.sort" controls-position="right" :min="0" />
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
import { listData, getData, delData, addData, updateData, exportData } from '@/api/system/dict/data';
import { listType, getType } from '@/api/system/dict/type';

export default {
  name: 'Data',
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
      dataList: [],
      // 默认字典类型
      defaultDictType: '',
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 类型数据字典
      typeOptions: [],
      // 值查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        id: undefined,
        dictionaryKey: undefined,
        dictionaryId: undefined,
        parentDictionaryKey: undefined
      },
      // 类型参数
      queryType: {
        pageNum: 1,
        id: undefined,
        pageSize: 9999,
        dictionaryKey: undefined

      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        dictionaryId: [
          { required: true, message: '字典不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '描述不能为空', trigger: 'blur' }
        ],
        dictionaryValue: [
          { required: true, message: '数据键值不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '数据顺序不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    const dictId = this.$route.params && this.$route.params.dictId;
    // this.getType(dictId);
    this.getTypeList();
    this.getList();
  },
  methods: {
    /** 查询字典类型详细 */
    getType(dictId) {
      getType(dictId).then(response => {
        this.queryParams.dictType = response.data.dictType;
        this.defaultDictType = response.data.dictType;
        this.getList();
      });
    },
    /** 查询字典类型列表 */
    getTypeList() {
      listType(this.queryType).then(response => {
        console.log(response, 'typeLIST');
        this.typeOptions = response.data.list;
      });
    },
    /** 查询字典数据列表 */
    getList() {
      this.loading = true;
      listData(this.queryParams).then(response => {
        this.dataList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      })
        .catch(err => {
          this.msgError('请求失败');
        });
    },
    // 数据状态字典翻译
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
        id: undefined,
        description: undefined,
        dictionaryKey: undefined,
        dictionaryValue: undefined,
        sort: 0

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
        pageSize: 20,
        id: undefined,
        dictionaryKey: undefined,
        dictionaryId: undefined,
        parentDictionaryKey: undefined
      };
      this.resetForm('queryForm');
      // this.queryParams.dictType = this.defaultDictType;
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加字典数据';
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
      this.open = true;
      this.title = '修改字典数据';
      this.form = {
        dictionaryId: row.parentId,
        id: row.id,
        description: row.description,
        dictionaryKey: row.description,
        dictionaryValue: row.dictionaryValue,
        sort: row.sort

      };
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateData(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.message);
              }
            });
          } else {
            addData(this.form).then(response => {
              console.log(response);
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
      const dictCodes = row.id || this.ids.join(',');
      this.$confirm('是否确认删除字典编码为"' + dictCodes + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delData({ ids: dictCodes });
      }).then(() => {
        this.getList();
        this.msgSuccess('删除成功');
      }).catch(function () { });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return exportData(queryParams);
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
/deep/ .el-form-item__label {
  font-size: 12px;
  font-weight: bold;
}
</style>
