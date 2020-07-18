<template>
  <div class="app-container">
    <el-form :inline="true" class="ele-form">
      <el-form-item>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-form-item>
    </el-form>
    <div class="contian-box">
      <el-table
        v-loading="loading"
        :data="deptList"
        row-key="id"
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="deptName" label="部门名称" width="260"></el-table-column>
        <!-- <el-table-column prop="orderNum" label="排序" width="200"></el-table-column> -->
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="0"
              :inactive-value="1"
              @change="handleStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >修改</el-button>
            <el-button size="mini" type="text" icon="el-icon-plus" @click="handleAdd(scope.row)">新增</el-button>
            <el-button
              v-if="scope.row.parentId != 0"
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24" v-if="form.parentId !== 0">
            <el-form-item label="上级部门" prop="parentId">
              <treeselect
                v-model="form.parentId"
                :options="deptOptions"
                :normalizer="normalizer"
                placeholder="选择上级部门"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门名称" prop="deptName">
              <el-input v-model="form.deptName" placeholder="请输入部门名称" />
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
import { listDept, delDept, addDept, updateDept, openDept } from '@/api/system/dept';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

export default {
  name: 'Dept',
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 表格树数据
      deptList: [],
      // 部门树选项
      deptOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        deptName: undefined,
        status: undefined
      },
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
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: '上级部门不能为空', trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' }
        ]

      }
    };
  },
  created() {
    this.getList();
    // this.getDicts("sys_normal_disable").then(response => {
    //   this.statusOptions = response.data;
    // });
  },
  methods: {
    // 状态
    handleStatusChange(row) {
      console.log(row);
      openDept({ id: row.id, status: row.status }).then(response => {
        console.log(response.data);
        this.msgSuccess('操作成功');
      });
    },
    /** 查询部门列表 */
    getList() {
      const that = this;
      this.loading = true;
      listDept().then(response => {
        console.log(response.data);
        if (response.code == 200) {
          this.deptList = this.handleTree(response.data, 'deptId');
          this.loading = false;
        } else {
          this.$message(response.message);
        }
      })
        .catch(err => {
          that.$message('请求失败');
        });
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.deptName,
        children: node.children
      };
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
        id: undefined,
        parentId: undefined,
        deptName: undefined

      };
      this.resetForm('form');
    },

    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      if (row !== undefined) {
        this.form.parentId = row.id;
      }
      this.open = true;
      this.title = '添加部门';
      listDept().then(response => {
        this.deptOptions = this.handleTree(response.data, 'deptId');
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      console.log(row);

      this.open = true;
      this.title = '修改部门';
      let that = this;
      listDept().then(response => {
        that.deptOptions = that.handleTree(response.data, 'deptId');
        //  that.form=row
        console.log(that.form);
        that.form.deptName = row.deptName;
        that.form.parentId = row.parentId;
        this.form.id = row.id;
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateDept(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.message);
              }
            });
          } else {
            addDept(this.form).then(response => {
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
      console.log(row);
      const that = this;
      this.$confirm('是否确认删除名称为"' + row.deptName + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        delDept({ ids: row.id }).then((item) => {
          console.log(item);
          if (item.code !== 200) {
            that.$message(item.message);
          } else {
            that.getList();
            that.msgSuccess('删除成功');
          }
        });
      }).catch(function () { that.$message('您取消了删除'); });
      // .then(() => {
      //   this.getList();
      //   this.msgSuccess('删除成功');
      // })
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
  padding: 0px 15px 15px 15px;
  min-height: 698px;
}
</style>
