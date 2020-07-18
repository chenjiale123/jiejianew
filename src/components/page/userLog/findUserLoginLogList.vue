<template>
  <div class="log">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
      class="ele-form"
    >
      <div>
        <el-form-item label="用户" prop="loginId">
          <el-select v-model="queryParams.loginid" placeholder="请选择">
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            ></el-option>
          </el-select>
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
          label="登录时间"
          align="center"
          prop="loginTime"
          :show-overflow-tooltip="true"
        />
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
import { getLog, getResponse } from '@/api/log';
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
        loginid: '',
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
    find(row) {
      this.open = true;
      getResponse({ id: row.id }).then(res => {
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
      let user = JSON.parse(sessionStorage.getItem('user'));
      //  console.log(user)
      listUser({ pageSize: 99999, pageNum: 1 }).then(response => {
        console.log(response);
        this.userList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },

    getList() {
      this.loading = true;
      getLog({ pageNum: this.queryParams.pageNum, pageSize: this.queryParams.pageSize })
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
      console.log('time', this.queryParams.time);
      getLog({
        loginid: this.queryParams.loginid,
        startTime: moment(this.queryParams.startTime).format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(this.queryParams.endTime).format('YYYY-MM-DD HH:mm:ss'),
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
