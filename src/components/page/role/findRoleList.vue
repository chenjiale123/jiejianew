<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" class="ele-form">
      <div>
        <el-form-item label="角色名称:" prop="roleName">
          <el-input
            v-model="queryParams.roleName"
            placeholder="请输入角色名称"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="状态:" prop="roleStatus">
          <el-select
            v-model="queryParams.roleStatus"
            placeholder="角色状态"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
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
      <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="角色编号" prop="id" width="120" />
        <el-table-column label="角色名称" prop="name" :show-overflow-tooltip="true" width="150" />
        <el-table-column label="更新人" prop="updUser" :show-overflow-tooltip="true" width="150" />
        <el-table-column label="状态" align="center" width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="0"
              :inactive-value="1"
              @change="handleStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="更新时间" align="center" prop="updTime" width="180">
          <template slot-scope="scope">
            <span>{{scope.row.updTime }}</span>
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
            <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-circle-check"
            @click="handleDataScope(scope.row)"

            >数据权限</el-button>-->
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
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getRoleNode"
      />
    </div>

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body class="dialogStyle">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称:" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色描述:" prop="roleDescription">
          <el-input v-model="form.roleDescription" placeholder="请输入角色描述" />
        </el-form-item>

        <el-form-item label="状态:">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单权限:">
          <el-tree
            :data="menuOptions"
            show-checkbox
            ref="menu"
            node-key="id"
            empty-text="加载中，请稍后"
            :props="defaultProps"
            :default-checked-keys="YYOptions"
            class="ele-tree"
          ></el-tree>
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
import { listRole, getRole, delRole, addRole, updateRole, exportRole, dataScope, changeRoleStatus } from '@/api/system/role';
import { menuTreeselect, roleMenuTreeselect, findMenus } from '@/api/system/menu';
import { treeselect as deptTreeselect, roleDeptTreeselect } from '@/api/system/dept';
import { getAllLeaf, collectId } from '@/api/index';
import Bus from '../../../utils/bus';
export default {
  name: 'Role',
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
      // 角色表格数据
      roleList: [],
      YYOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [
        {
          dictLabel: '启用',
          dictValue: 0
        },
        {
          dictLabel: '禁用',
          dictValue: 1
        }
      ],
      // 数据范围选项
      dataScopeOptions: [
        {
          value: '1',
          label: '全部数据权限'
        },
        {
          value: '2',
          label: '自定数据权限'
        },
        {
          value: '3',
          label: '本部门数据权限'
        },
        {
          value: '4',
          label: '本部门及以下数据权限'
        },
        {
          value: '5',
          label: '仅本人数据权限'
        }
      ],
      // 菜单列表
      menuOptions: [],
      // 部门列表
      deptOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        roleName: undefined,

        roleStatus: 0
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: 'submenu',
        label: 'name'
      },
      // 表单校验
      rules: {
        roleStatus: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
        roleDescription: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
        roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.getRoleNode();
  },
  methods: {
    // 查询角色列表
    getRoleNode() {
      getRole({
        pageNum: 1,
        pageSize: 20
      }).then(res => {
        if (res.code === 200) {
          console.log(res);
          this.roleList = res.data.list;
          this.loading = false;
          this.total = res.data.total;
        } else {
          this.msgError('查找失败');
        }
      })
        .catch(err => {
          this.msgError('请求失败');
        });
    },
    /** 查询菜单树结构 */
    getMenuTreeselect() {
      menuTreeselect().then(response => {
        this.menuOptions = response.data;
      });
    },
    /** 查询部门树结构 */
    getDeptTreeselect() {
      deptTreeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      // let checkedKeys = this.$refs.menu.getHalfCheckedKeys();
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getCheckedKeys();
      // console.log(checkedKeys,halfCheckedKeys)
      // checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return halfCheckedKeys;
    },
    // 所有部门节点数据
    getDeptAllCheckedKeys() {
      // 目前被选中的部门节点
      let checkedKeys = this.$refs.dept.getHalfCheckedKeys();
      // 半选中的部门节点
      let halfCheckedKeys = this.$refs.dept.getCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    /** 根据角色ID查询菜单树结构 */
    getRoleMenuTreeselect(roleId) {
      roleMenuTreeselect({ roleId: roleId }).then(response => {
        this.form.roleName = response.data.roleVo.name;
        this.form.roleDescription = response.data.roleVo.roleDescription;
        this.menuOptions = response.data.allMenuVo;

        let node = collectId(response.data.YYMenuVo);

        this.YYOptions = node;
        this.form.status = response.data.roleVo.status;

        this.open = true;
        this.title = '修改角色';
      });
    },
    /** 根据角色ID查询部门树结构 */
    getRoleDeptTreeselect(roleId) {
      roleDeptTreeselect(roleId).then(response => {
        this.deptOptions = response.depts;
        this.$refs.dept.setCheckedKeys(response.checkedKeys);
      });
    },
    // 角色状态修改
    handleStatusChange(row) {
      let that = this;
      let text = row.status === 0 ? '启用' : '停用';
      this.$confirm('确认要"' + text + '""' + row.name + '"角色吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          updateRole({ id: row.id, status: row.status }).then(response => {
            if (response.code === 200) {
              that.msgSuccess('修改成功');
              console.log('3333');
              that.getRoleNode();
            } else {
              that.msgError(response.message);
            }
          });
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
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false;
      this.reset();
    },
    // 表单重置
    reset() {
      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      this.form = {
        id: '',
        roleName: undefined,
        roleDescription: undefined,

        status: 0,
        menuIds: []
      };
    },
    /** 搜索按钮操作 */
    handleQuery() {
      getRole(this.queryParams).then(res => {
        this.roleList = res.data.list;
        this.loading = false;
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm('queryForm');
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
      this.getMenuTreeselect();
      this.open = true;
      this.title = '添加角色';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form.id = row.id || this.ids;

      this.$nextTick(() => {
        this.getRoleMenuTreeselect(this.form.id);
      });
      this.form.roleStatus = row.status;

      console.log(this.form.status);
    },
    findMenus() {
      findMenus().then((res) => {
        console.log(res);
        if (res.code === 200) {
          Bus.$emit('listenMenu', res.data);
        }
      });
    },

    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != '') {
            this.form.menuIds = this.getMenuAllCheckedKeys().toString();

            updateRole(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功');
                this.open = false;
                this.getRoleNode();
                this.findMenus();
              } else {
                this.msgError(response.message);
              }
            });
          } else {
            this.form.menuIds = this.getMenuAllCheckedKeys().toString();

            addRole(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('新增成功');
                this.open = false;
                this.getRoleNode();
              } else {
                this.msgSuccess(response.message);
              }
            });
          }
        }
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const that = this;
      const roleIds = row.id || this.ids.join();
      console.log(roleIds);
      this.$confirm('是否确认删除选中的角色数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return delRole({ roleIds: roleIds });
        })
        .then(() => {
          this.msgSuccess('删除成功');

          this.getRoleNode();
        })
        .catch(function () { that.$message('你取消了删除'); });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有角色数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return exportRole(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function () { });
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
.dialogStyle /deep/ .el-form-item__label {
  font-size: 12px;
  color: #333;
  font-weight: bold;
}
.ele-tree {
  max-height: 420px;
  overflow-y: auto;
}
</style>
