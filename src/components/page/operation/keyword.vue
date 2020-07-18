<template>
  <div class="arguement">
    <div class="ele-table">
      <el-form :inline="true" class="ele-form">
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增关键词</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="loading" :data="senList">
        <el-table-column
          label="关键字名称"
          align="center"
          prop="hotKeywordName"
          :show-overflow-tooltip="true"
          width="260"
        />
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          :show-overflow-tooltip="true"
          width="180"
        />
        <el-table-column
          label="排序"
          align="center"
          prop="sort"
          :show-overflow-tooltip="true"
          width="180"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.sort" @blur="sortChange(scope.row)"></el-input>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handerEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handerDel(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParam.pageNum"
        :limit.sync="queryParam.pageSize"
        @pagination="getArgueList"
      />
    </div>

    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="热门关键词:" prop="head">
              <el-input v-model="form.head" placeholder="请输入关键词名称" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="排序:" prop="head">
              <el-input v-model="form.sort" placeholder="请输入排序" />
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
import {
  getKeyList,
  addKeyList,
  keyListDel,
  updKeyList,
  keyListSort
} from '@/api/operation/keyword';
export default {
  data() {
    return {
      title: '',
      open: false,
      senList: [],
      loading: false,
      queryParam: {
        pageNum: 1,
        pageSize: 20
      },
      total: 0,
      rules: {
        head: [
          { required: true, message: '热门关键词不能为空', trigger: 'blur' }
        ],
        sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }]
      },
      form: {
        sort: '',
        head: '',
        id: ''
      },
      catchData: null,
      content: ''
    };
  },
  created() {
    this.getArgueList();
  },
  methods: {
    getArgueList() {
      getKeyList(this.queryParam).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.senList = res.data.list;
          this.total = res.data.total;
        }
      });
    },
    handerEdit(row) {
      var that = this;
      this.title = '编辑关键词';
      this.open = true;

      this.form.id = row.id;
      that.form.head = row.hotKeywordName;
      this.form.sort = row.sort;
      console.log(row);
    },
    handerDel(row) {
      this.$confirm(
        '是否确认删除热门关键词id为"' + row.id + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(function () {
          return keyListDel({ id: row.id });
        })
        .then(() => {
          this.msgSuccess('删除成功');

          this.getArgueList();
        })
        .catch(function () {
          that.$message('你取消了删除');
        });
    },
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updKeyList(this.form.id, this.form.head, this.form.sort).then(
              response => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功');
                  this.open = false;
                  this.getArgueList();
                } else {
                  this.msgError(response.message);
                }
              }
            );
          } else {
            console.log();

            addKeyList(this.form.head, this.form.sort).then(response => {
              if (response.code === 200) {
                this.msgSuccess('新增成功');
                this.open = false;
                this.getArgueList();
              } else {
                this.msgSuccess(response.message);
              }
            });
          }
        }
      });
    },
    cancel() {
      this.open = false;
    },
    handleAdd() {
      var that = this;
      this.title = '添加热门关键词';
      this.open = true;
      this.form = {
        head: '',
        sort: ''
      };
    },
    sortChange(row) {
      console.log(row);
      keyListSort({ id: row.id, sort: row.sort }).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.msgSuccess('修改成功');

          this.getArgueList();
        } else {
          this.msgSuccess(res.message);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.area {
  height: 300px;
  overflow: hidden;
}
textarea {
  height: 300px;
  overflow: hidden;
}
.ele-form {
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 10px 20px 0px 20px;
  // margin-bottom: 10px;
  position: relative;
}
.ele-table {
  background-color: #fff;
  min-height: 746px;
  padding-left: 15px;
  padding-right: 15px;
}
</style>
