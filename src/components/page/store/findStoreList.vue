<template>
  <div>
    <el-form :model="queryParam" ref="queryForm" :inline="true" label-width="80px" class="ele-form">
      <el-form-item label="门店名称:" prop="userName">
        <el-input
          v-model="queryParam.name"
          placeholder="请输入门店名称"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>

      <el-form-item label="营业状态" prop="status">
        <el-select
          v-model="queryParam.openStatus"
          placeholder="请选择"
          clearable
          size="small"
          style="min-width: 90px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.id"
            :label="dict.value"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="bt-item">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="ele-table">
      <div class="btn-option">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </div>
      <el-table v-loading="loading" :data="orderList" :max-height="clieHeight">
        <el-table-column label="门店名称" align="center" prop="name" :show-overflow-tooltip="true" />
        <el-table-column
          label="所在地"
          align="center"
          prop="province"
          :show-overflow-tooltip="true"
          width="180"
        />
        <el-table-column label="门店的详细地址" align="center" :show-overflow-tooltip="true" width="260">
          <template slot-scope="scope">{{scope.row.city+scope.row.area}}</template>
        </el-table-column>
        <el-table-column label="开设时间" align="center" prop="openTime" width="180" />
        <el-table-column label="联系电话" align="center" prop="storeContactPhone" width="180" />
        <el-table-column label="门店状态" align="center" width="110">
          <template slot-scope="scope">
            <span class v-if="scope.row.openStatus==1">营业中</span>
            <span class v-if="scope.row.openStatus==0">待营业</span>
            <span class v-if="scope.row.openStatus==2">停业</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="210px">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleLook(scope.row)">查看</el-button>
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="handleisOpen(scope.row)">
              <template>
                <span v-if="scope.row.openStatus==1">停业</span>
                <span v-if="scope.row.openStatus==0||scope.row.openStatus==2">开业</span>
              </template>
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
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
        @pagination="getList"
      />
    </div>

    <!-- 查看门店弹框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <p class="baseInfo">用户信息</p>
      <el-row class="rowData">
        <el-col :span="16">
          <el-row>
            <el-col :span="6">门店名称:</el-col>
            <el-col :span="12">{{storeInfo.name?storeInfo.name:''}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6">门店特性:</el-col>
            <el-col :span="12">{{storeInfo.features?storeInfo.features:""}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6">所在地:</el-col>
            <el-col :span="12">{{storeInfo.province+storeInfo.city+storeInfo.area}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6">详细地址:</el-col>
            <el-col :span="12">{{storeInfo.address}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6">经纬度:</el-col>
            <el-col :span="12">{{storeInfo.longitude + ' - ' + storeInfo.latitude}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6">门店成立时间:</el-col>
            <el-col :span="12">{{storeInfo.openTime}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6">门店联系电话:</el-col>
            <el-col :span="12">{{storeInfo.storeContactPhone}}</el-col>
          </el-row>
          <div class="concatInfo">
            联系信息
            <span class="tip">(联系信息供销售与售后服务使用)</span>
          </div>
          <el-row>
            <el-col :span="6">联系人:</el-col>
            <el-col :span="12">{{storeInfo.contactPerson}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6">联系手机:</el-col>
            <el-col :span="12">{{storeInfo.contactPhone}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6">联系邮箱:</el-col>
            <el-col :span="12">{{storeInfo.contactMail}}</el-col>
          </el-row>
        </el-col>
      </el-row>
      <div class="storeInfo">门店介绍</div>
      <div v-html="storeInfo.introduction"></div>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="submitFileForm">确 定</el-button> -->
        <el-button @click="open = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getStoreList, delStore, updateStatus, findDetail } from '../../../api/store/index';

export default {
  data() {
    return {
      orderList: [],
      open: false,
      title: '查看门店',
      loading: false,
      queryParam: {
        pageNum: 1,
        pageSize: 20,
        name: undefined,
        openStatus: undefined
      },
      from: {},
      total: 0,
      statusOptions: [
        {
          id: 0,
          value: '待营业'
        },
        {
          id: 1,
          value: '营业中'
        },
        {
          id: 2,
          value: '停业'
        }
      ],
      storeInfo: {},
      clieHeight: null

    };
  },
  created() {
    this.getList();
  },
  mounted() {
    this.clieHeight = window.innerHeight - 310;
  },
  methods: {
    getList() {
      this.loading = false;
      getStoreList(this.queryParam).then((res) => {
        console.log(res, '门店');
        if (res.code === 200) {
          this.orderList = res.data.list;
          this.total = res.data.total;
        }
      });
    },
    handleQuery() {
      this.getList();
    },
    resetQuery() {
      this.queryParam = {
        pageNum: 1,
        pageSize: 20,
        name: undefined,
        openStatus: undefined
      };
      this.getList();
    },
    handleLook(item) {
      this.open = true;
      findDetail({ storeId: item.id }).then((res) => {
        if (res.code === 200) {
          this.storeInfo = res.data;
        }
      });
    },
    // 编辑
    handleEdit(item) {
      this.$router.push({ path: '/store/addStore', query: { id: item.id } });
    },
    handleDelete(item) {
      const that = this;
      console.log(item);
      // storeId
      // delStore()
      this.$confirm('是否确认删除该门店吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return delStore({ storeId: Number(item.id) }).then((res) => {
            if (res.code === 200) {
              that.getList();
              that.msgSuccess('删除成功');
            } else {
              that.msgError(res.message);
            }
          });
        })
        .catch(function () {
          that.$message('已取消删除');
        });
    },
    handleisOpen(item) {
      const that = this;
      let status = 0;
      if (item.openStatus === 1) {
        status = 2;
      } else if (item.openStatus === 0) {
        status = 1;
      } else if (item.openStatus === 2) {
        status = 1;
      }
      updateStatus({ id: item.id, status: status }).then((res) => {
        console.log(res);
        if (res.code === 200) {
          that.getList();
          that.msgSuccess('修改成功');
        } else {
          that.msgError('修改失败');
        }
      }).catch((error) => {
        console.log(error);
      });
      ;
    },
    submitFileForm() {

    },
    handleAdd() {
      this.$router.push({ path: '/store/addStore' });
    }

  }
};
</script>
<style lang="scss" scoped>
.ele-form {
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 20px 20px 0px 20px;
  margin-bottom: 10px;
  position: relative;
}
.ele-table {
  background-color: #fff;
  min-height: 436px;
  padding-left: 15px;
  padding-right: 15px;
  .btn-option {
    text-align: left;
    padding-top: 15px;
    margin-bottom: 15px;
  }
}
.concatInfo,
.baseInfo,
.storeInfo {
  font-size: 14px;
  border-bottom: 1px solid #e5e5e5;
  text-align: left;
  margin-bottom: 10px;
  padding-bottom: 5px;
  font-weight: bold;
  margin-top: 10px;
}
.concatInfo .tip {
  font-size: 12px;
  color: #999;
  display: inline-block;
  padding-left: 10px;
  font-weight: normal;
}
.rowData {
  line-height: 30px;
}
</style>
