<template>
  <div>
    <el-form :model="queryParam" ref="queryForm" :inline="true" label-width="90px" class="ele-form">
      <el-form-item label="用户名:" prop="userName">
        <el-input
          v-model="queryParam.info"
          placeholder="请输入用户名"
          clearable
          size="small"
          style="width: 160px"
        />
      </el-form-item>
      <el-form-item label="所属门店:" prop="storeId">
        <el-select
          v-model="queryParam.storeId"
          placeholder="请选择"
          clearable
          size="small"
          style="width: 200px"
        >
          <el-option v-for="dict in storeList" :key="dict.id" :label="dict.name" :value="dict.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="账号状态" prop="status">
        <el-select
          v-model="queryParam.auditStatus"
          placeholder="请选择"
          clearable
          size="small"
          style="width: 200px"
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
    <div class="contian-box" ref="contianBox">
      <el-row :gutter="10" class="mb8 option-btn">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="orderList" ref="tables" :max-height="clieHeight">
        <el-table-column label="登录账号" align="center" prop="loginid" :show-overflow-tooltip="true" />
        <el-table-column label="员工姓名" align="center" prop="username" :show-overflow-tooltip="true" />
        <el-table-column label="所属门店" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div v-html="formatterColumn(scope.row.stores)"></div>
          </template>
        </el-table-column>
        <el-table-column
          label="是否门店管理员"
          align="center"
          prop="isManager"
          :show-overflow-tooltip="true"
          width="120"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.isManager==0">是</div>

            <div v-else-if="scope.row.isManager==1">否</div>
          </template>
        </el-table-column>

        <el-table-column label="创建时间" align="center" prop="createTime" width="180" />
        <el-table-column label="联系电话" align="center" prop="phone" width="120" />
        <el-table-column label="账号状态" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.auditStatus==1">待审核</div>
            <div v-else-if="scope.row.auditStatus==2">
              审核不通过
              <el-tooltip
                class="item"
                effect="dark"
                :content="scope.row.rejectReason"
                placement="top"
              >
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
            <div v-else-if="scope.row.auditStatus==3">启用</div>
            <div v-else-if="scope.row.auditStatus==4">
              <span class>禁用</span>
              <el-tooltip
                class="item"
                effect="dark"
                :content="scope.row.rejectReason"
                placement="top-start"
              >
                <span class="el-icon-info"></span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="员工备注" align="center" prop="remark" width="120" />
        <el-table-column
          label="操作"
          align="center"
          width="190"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleLook(scope.row)">查看</el-button>
            <el-button
              v-if="scope.row.auditStatus==3||scope.row.auditStatus==4"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              v-if="scope.row.auditStatus==4"
              size="mini"
              type="text"
              @click="handleisOpen(scope.row)"
            >启用</el-button>
            <el-popover
              placement="right"
              width="300"
              trigger="click"
              :ref="`popover-${scope.row.id}`"
            >
              <el-form ref="numberValidateForm" class="demo-ruleForm">
                <el-form-item
                  :rules="[
                      { required: true, message: '备注不能为空', trigger: 'blur'},
                    ]"
                >
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请输入备注"
                    v-model="remark"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitRemark(scope.row)">确定</el-button>
                  <el-button @click="calcel(scope.row)">取消</el-button>
                </el-form-item>
              </el-form>
              <el-button
                v-if="scope.row.auditStatus==3"
                size="mini"
                type="text"
                slot="reference"
                @click="visible = true"
              >禁用</el-button>
            </el-popover>
            <el-button
              v-if="scope.row.auditStatus==1"
              size="mini"
              type="text"
              @click="handleexamine(scope.row)"
            >审核</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParam.pageNum"
        :limit.sync="queryParam.pageSize"
        @pagination="getUserList"
      />
    </div>
    <!-- 查看门店弹框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <p class="daiTitle">用户信息</p>
      <el-row class="daiCont">
        <el-col :span="18">
          <el-row>
            <el-col :span="6" align="right" class="lableTitle">登录账号:</el-col>
            <el-col :span="12" class="alginLeft">{{userInfo.loginid}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" align="right" class="lableTitle">手机号码:</el-col>
            <el-col :span="12" class="alginLeft">{{userInfo.phone}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" align="right" class="lableTitle">真实姓名:</el-col>
            <el-col :span="12" class="alginLeft">{{userInfo.username}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" align="right" class="lableTitle">性别:</el-col>
            <el-col :span="12" class="alginLeft">{{userInfo.gender==0?'女':'男'}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" align="right" class="lableTitle">是否门店管理员:</el-col>
            <el-col :span="12" class="alginLeft">{{userInfo.isManager==0?'是':'否'}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" align="right" class="lableTitle">状态:</el-col>
            <el-col :span="12" class="alginLeft">
              <div v-if="userInfo.auditStatus==1">待审核</div>
              <div v-else-if="userInfo.auditStatus==2">
                审核不通过
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="userInfo.rejectReason"
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </div>
              <div v-else-if="userInfo.auditStatus==3">启用</div>
              <div v-else-if="userInfo.auditStatus==4">禁用</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" align="right" class="lableTitle">常驻地:</el-col>
            <el-col :span="12" class="alginLeft">{{userInfo.province+userInfo.city+userInfo.area}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" align="right" class="lableTitle">详细地址:</el-col>
            <el-col :span="12" class="alginLeft">{{userInfo.address}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" align="right" class="lableTitle">员工备注信息:</el-col>
            <el-col :span="12" class="alginLeft">{{userInfo.remark}}</el-col>
          </el-row>
        </el-col>
        <el-col class :span="6">
          <el-row>
            <el-col :span="24">身份证正反电子版:</el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="imgCard">
                <img :src="userInfo.frontCardImage" alt />
              </div>
              <div class="imgCard">
                <img :src="userInfo.backCardImage" alt />
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="daiStore">
        <div class="daiTitle">所属门店:</div>
        <div class="stList">
          <div
            v-for="(item,index) in userInfo.stores"
            :key="index"
          >{{userInfo.province+userInfo.city+userInfo.area+item}}</div>
        </div>
      </el-row>
      <div class="examine" v-if="isshenhe">
        <el-button @click="shenhe">审核通过</el-button>

        <el-popover placement="top-start" width="300" trigger="manual" v-model="visibles">
          <el-form ref="numberValidateForm" class="demo-ruleForm">
            <el-form-item
              :rules="[
                      { required: true, message: '备注不能为空', trigger: 'blur'},
                    ]"
            >
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入备注"
                v-model="remark"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitExamine">确定</el-button>
              <el-button @click="visibles=false">取消</el-button>
            </el-form-item>
          </el-form>
          <el-button slot="reference" @click="shenhe(2)">审核不通过</el-button>
        </el-popover>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getStoreUserList, updStoreStatus, getStoreDetail } from '../../../api/storeUser/index';
import { getStoreList } from '../../../api/store/index';
export default {
  data() {
    return {
      statusOptions: [{
        id: 1,
        value: '待审核'
      }, {
        id: 2,
        value: '审核不通过'
      }, {
        id: 3,
        value: '启用'
      },
      {
        id: 4,
        value: '禁用'
      }],
      storeList: [],
      orderList: [],
      open: false,
      title: '查看员工信息',
      loading: false,
      total: 0,
      queryParam: {
        pageNum: 1,
        pageSize: 20,
        info: undefined,
        auditStatus: undefined,
        storeId: undefined
      },
      queryParam1: {
        pageNum: 1,
        pageSize: 999

      },
      visible: false,
      numberValidateForm: '',
      remark: '',
      userInfo: {},
      isshenhe: false,
      clieHeight: null,
      visibles: false
    };
  },
  created() {
    // this.getUserList();
    // this.getList();
  },
  mounted() {
    this.getUserList();
    this.getList();
    this.clieHeight = window.innerHeight - 320;
    console.log(this.clieHeight, '----');
  },
  methods: {
    formatterColumn(cellValue) {
      let value = cellValue.join('</br>');
      return value;
    },
    calcel(scope) {
      this.$refs[`popover-${scope.id}`].doClose();
    },
    getList() {
      // this.loading = false;
      getStoreList(this.queryParam1).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.storeList = res.data.list;
        }
      });
    },
    getUserList() {
      this.loading = false;
      getStoreUserList(this.queryParam).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.orderList = res.data.list;
          this.total = res.data.total;
        }
      });
    },
    handleQuery() {
      this.getUserList();
    },
    resetQuery() {
      this.queryParam = {
        pageNum: 1,
        pageSize: 20,
        info: undefined,
        auditStatus: undefined,
        storeId: undefined
      };
      this.getUserList();
    },
    // 查看
    handleLook(item) {
      getStoreDetail({ userId: item.id }).then(res => {
        this.open = true;
        if (res.code === 200) {
          this.userInfo = res.data;
        }
      });
    },
    // 新增
    handleAdd() {
      this.$router.push({ path: '/store/addStoreStaff' });
    },
    submitRemark(item) {
      const that = this;
      let status = 0;
      if (item.auditStatus === 3) {
        status = 4;
      }

      this.$confirm('确认禁用该员工吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return updStoreStatus({ userId: item.id, auditStatus: status, rejectReason: that.remark }).then((res) => {
          console.log(res);
          if (res.code === 200) {
            that.getUserList();
            that.$message('修改成功');
            that.$refs[`popover-${item.id}`].doClose();
          } else {
            that.msgInfo(res.message);
          }
        });
      });
      // .catch(function () {
      //   that.$message('已取消删除');
      // });
    },
    handleisOpen(item) {
      const that = this;
      this.$confirm('确认启用该员工吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          updStoreStatus({ userId: item.id, auditStatus: 3 }).then((res) => {
            console.log(res);
            if (res.code === 200) {
              that.getUserList();
              that.$message('修改成功');
            } else {
              that.msgInfo(res.message);
            }
          });
        })
        .catch(function () {
          that.$message('已取消删除');
        });
    },
    handleexamine(item) {
      this.isshenhe = true;
      // this.userInfo = item;
      getStoreDetail({ userId: item.id }).then(res => {
        this.open = true;
        if (res.code === 200) {
          this.userInfo = res.data;
        }
      });
    },
    shenhe(numb) {
      const that = this;
      if (numb === 2) {
        this.visibles = true;
      } else {
        updStoreStatus({ userId: this.userInfo.id, auditStatus: 3 }).then((res) => {
          if (res.code === 200) {
            that.getUserList();
            this.open = false;
            this.isshenhe = false;
            that.$message('修改成功');
          } else {
            that.msgInfo(res.message);
          }
        });
      }
    },
    submitExamine() {
      const that = this;
      updStoreStatus({ userId: this.userInfo.id, auditStatus: 2, rejectReason: that.remark }).then((res) => {
        if (res.code === 200) {
          that.getUserList();
          this.open = false;
          this.visibles = false;
          this.isshenhe = false;
          that.$message('修改成功');
        } else {
          that.msgInfo(res.message);
        }
      });
    },
    handleEdit(event) {
      this.$router.push('/store/addStoreStaff?id=' + event.id);
      console.log(event);
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
.contian-box {
  background-color: #fff;
  min-height: 436px;
  padding-left: 15px;
  padding-right: 15px;
}
.option-btn {
  padding-top: 15px;
  margin-bottom: 15px;
}
.daiTitle {
  font-size: 14px;
  font-weight: bold;
}
.daiCont {
  line-height: 30px;
}
.lableTitle {
  font-size: 12px;
  font-weight: bold;
}
.alginLeft {
  padding-left: 10px;
}
.daiStore {
  padding-bottom: 30px;
  margin-top: 10px;
}
.stList {
  margin-top: 5px;
  padding-top: 5px;
  padding-left: 8px;
}
.imgCard {
  width: 150px;
  img {
    width: 100%;
  }
}
.examine {
  padding-bottom: 30px;
}
</style>
