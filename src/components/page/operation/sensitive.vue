<template>
  <div class="arguement">
    <div class="ele-table">
      <el-form :inline="true" class="ele-form">
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增敏感词</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="loading" :data="senList">
        <el-table-column
          label="敏感词库名称"
          align="center"
          prop="sensitiveVocabularyName"
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
      <el-form ref="form" :model="form" :rules="rules" label-width="125px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="敏感词词库名称:" prop="head">
              <el-input v-model="form.head" placeholder="请输入敏感词词库名称" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="敏感词:" prop="content">
              <el-input type="textarea" v-model="form.content" class="area"></el-input>
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
  getSentive,
  sentiveDetail,
  addSentive,
  sentiveDel,
  updSentive
} from '@/api/operation/sentive';
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
          { required: true, message: '服务标题不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '服务内容不能为空', trigger: 'blur' }
        ]
      },
      form: {
        content: '',
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
      getSentive(this.queryParam).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.senList = res.data.list;
          this.total = res.data.total;
        }
      });
    },
    handerEdit(row) {
      var that = this;
      this.title = '编辑敏感词';
      this.open = true;

      this.form.id = row.id;
      that.form.head = row.sensitiveVocabularyName;
      console.log(row);

      sentiveDetail({ id: this.form.id }).then(res => {
        console.log(res);
        var a = res.data.sensitiveVocabulary.replace(/[/n]/g, '\n');

        that.form.content = a;
      });
    },
    handerDel(row) {
      this.$confirm('是否确认删除敏感词id为"' + row.id + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return sentiveDel({ id: row.id });
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
            let com = this.form.content.replace(/[\n ]/g, '/n');
            updSentive(this.form.id, com, this.form.head).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功');
                this.open = false;
                this.getArgueList();
              } else {
                this.msgError(response.message);
              }
            });
          } else {
            console.log();
            let com = this.form.content.replace(/[\n ]/g, '/n');

            addSentive(com, this.form.head).then(response => {
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
      this.title = '添加敏感词';
      this.open = true;
      this.form = {
        head: '',
        content: ''
      };
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
