<template>
  <div class="log">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="90px"
      class="ele-form"
    >
      <div>
        <el-form-item label="用户手机号:" prop="mobilePhone">
          <el-input v-model="queryParams.mobilePhone" placeholder="请输入手机号码" maxlength="11" />
        </el-form-item>

        <el-form-item label="开始时间" prop="time">
          <el-date-picker v-model="queryParams.startTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="queryParams.endTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="contian-box">
      <el-table v-loading="loading" :data="datalist" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ip地址" align="center" prop="ip" />
        <el-table-column
          label="操作时间"
          align="center"
          prop="operationTime"
          :show-overflow-tooltip="true"
        />

        <el-table-column label="接口地址" align="center" prop="url" :show-overflow-tooltip="true" />
        <el-table-column label="异常内容" align="center" prop="response" :show-overflow-tooltip="true" />
        <el-table-column label="请求参数" align="center" prop="params" :show-overflow-tooltip="true" />

        <el-table-column
          label="操作"
          align="center"
          width="180"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-key" @click="find(scope.row)">查看详情</el-button>
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

    <!-- 响应内容 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <div class="list">
        <span>{{content}}</span>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getClienLog, getClienResponse } from '@/api/log';
import { listUser } from '@/api/system/user';
import moment from 'moment';
export default {
  data() {
    return {
      content: '',
      open: false,
      title: '响应内容',
      userList: [],
      total: 0,
      datalist: [],
      loading: false,
      queryParams: {
        mobilePhone: '',
        startTime: new Date(),
        endTime: new Date(),
        pageNum: 1,
        pageSize: 20
      }
    };
  },
  created() {
    this.getList();
    this.getUserList();
  },
  methods: {
    // 详情
    find(row) {
      this.open = true;
      getClienResponse({ id: row.id }).then(res => {
        console.log(res);
        this.content = res.data;
      });
    },
    submitForm() {
      this.open = false;
    },
    cancel() {
      this.open = false;
    },
    getUserList() {
      this.loading = true;
      //  console.log(user)
      listUser({ pageSize: 9999, pageNum: 1 }).then(response => {
        console.log(response);
        this.userList = response.data.list;

        this.loading = false;
      });
    },

    getList() {
      this.loading = true;
      getClienLog({ pageNum: this.queryParams.pageNum, pageSize: this.queryParams.pageSize })
        .then(res => {
          console.log(res);
          this.datalist = res.data.list;
          this.total = res.data.total;
          this.loading = false;
        })
        .catch(err => {
          this.msgError(err);
        });
    },
    handleSelectionChange() { },
    handleQuery() {
      getClienLog({
        mobilePhone: this.queryParams.mobilePhone ? this.queryParams.mobilePhone : undefined,
        startTime: this.queryParams.time ? moment(this.queryParams.startTime).format('YYYY-MM-DD HH:mm:ss') : undefined,
        endTime: this.queryParams.time ? moment(this.queryParams.endTime).format('YYYY-MM-DD HH:mm:ss') : undefined,
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize
      }).then(res => {
        console.log(res);
        this.datalist = res.data.list;
        this.total = res.data.total;
        this.loading = false;
      });
    },
    resetQuery() { }
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
/deep/ .el-dialog__body {
  max-height: 500px;
  overflow: auto;
}
/deep/ .el-input__icon,
/deep/ .el-range-separator {
  height: auto;
}
</style>
