<template>
  <div class="arguement">
    <div class="ele-table">
      <el-table v-loading="loading" :data="argueList">
        <el-table-column
          label="标题"
          align="center"
          prop="title"
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
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
    </div>

    <el-dialog :title="title" :visible.sync="open" width="777px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="服务协议标题" prop="head">
              <el-input v-model="form.head" placeholder="请输入服务协议标题" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="服务协议内容" prop="content">
              <editorElem :catchData.sync="catchData" :content="content"></editorElem>
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
import editorElem from '../../common/wangEditor';
import { getArgue, editArgue, ArgueDetail } from '@/api/operation/index';
export default {
  components: {
    editorElem
  },
  data() {
    return {
      title: '',
      open: false,
      argueList: [],
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
      form: {},
      catchData: null,
      content: ''
    };
  },
  created() {
    this.getArgueList();
  },
  methods: {
    getArgueList() {
      getArgue(this.queryParam).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.argueList = res.data;
        }
      });
    },
    handerEdit(row) {
      this.title = '编辑服务协议';
      this.open = true;

      this.form.head = row.title;
      this.form.id = row.id;

      ArgueDetail({ id: this.form.id }).then(res => {
        console.log(res);
        this.content = res.data.content;
      });
    },
    submitForm() {
      console.log(this.catchData);
      editArgue(this.form.id, this.form.head, this.catchData).then(res => {
        console.log(res);
      });
    },
    cancel() {
      this.open = false;
    }
  }
};
</script>
<style lang="scss">
</style>
