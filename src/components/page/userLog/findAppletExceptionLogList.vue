<template>
  <div class="log">
    <!-- <el-form
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

        <el-form-item label="时间" prop="time">
          <el-date-picker
            v-model="queryParams.time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </div>
      <div>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </div>
    </el-form>-->
    <div class="contian-box">
      <el-table v-loading="loading" :data="datalist" @selection-change="handleSelectionChange">
        <el-table-column label="ip地址" align="center" prop="ip" />
        <el-table-column
          label="操作时间"
          align="center"
          prop="createTime"
          :show-overflow-tooltip="true"
        />

        <el-table-column label="接口地址" align="center" prop="url" :show-overflow-tooltip="true" />
        <el-table-column
          label="异常内容"
          align="center"
          prop="exceptionMessage"
          :show-overflow-tooltip="true"
        />
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
// import { getCLog, getCResponse } from '@/api/log';
// import { listUser } from '@/api/system/user';
// import moment from 'moment';
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
        time: [new Date(), new Date()],
        pageNum: 1,
        pageSize: 20
      }
    };
  },
  created() {

  },
  methods: {

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
.el-dialog__body {
  max-height: 500px;
  overflow: auto;
}
/deep/ .el-input__icon,
/deep/ .el-range-separator {
  height: auto;
}
</style>
