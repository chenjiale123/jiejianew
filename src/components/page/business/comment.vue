<template>
  <div class="comment">
    <el-form :model="queryParam" ref="queryForm" :inline="true" label-width="80px" class="ele-form">
      <div class="clearFix formContain">
        <div class="rowFlex">
          <div class="formItem">
            <el-form-item label="商品货号:" prop="goodsNumber">
              <el-input
                v-model="queryParam.goodsNumber"
                placeholder="请输入商品货号"
                clearable
                size="small"
              />
            </el-form-item>
          </div>
          <div class="formItem">
            <el-form-item label="商品编号:" prop="goodsArticleNo">
              <el-input
                v-model="queryParam.goodsArticleNo"
                placeholder="请输入商品编号"
                clearable
                size="small"
              />
            </el-form-item>
          </div>
          <div class="formItem">
            <el-form-item label="商品名称:" prop="goodsName">
              <el-input
                v-model="queryParam.goodsName"
                placeholder="请输入商品名称"
                clearable
                size="small"
              />
            </el-form-item>
          </div>
        </div>
        <div class="rowFlex">
          <div class="formItem">
            <el-form-item label="评论状态:">
              <el-select v-model="queryParam.status" placeholder="评论状态" clearable size="small">
                <el-option
                  v-for="dict in optionsid"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="formItem">
            <el-form-item label="商品分类:">
              <el-cascader
                v-model="queryParam.classId"
                :options="options"
                :props="SetKesDept"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </div>
          <div class="formItem">
            <el-form-item label="用户信息:" prop="memberInfo">
              <el-input
                v-model="queryParam.memberInfo"
                placeholder="请输入用户信息"
                clearable
                size="small"
              />
            </el-form-item>
          </div>
          <div class="formItem">
            <el-form-item class="bt-item">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>

    <div class="ele-table">
      <el-table v-loading="loading" :data="commentList">
        <el-table-column
          label="商品编号"
          align="center"
          prop="goodsArticleNo"
          :show-overflow-tooltip="true"
          width="110"
        />
        <el-table-column
          label="商品货号"
          align="center"
          prop="goodsNumber"
          :show-overflow-tooltip="true"
          width="180"
        />

        <el-table-column
          label="商品名称"
          align="center"
          prop="goodsName"
          :show-overflow-tooltip="true"
          width="180"
        />
        <el-table-column
          label="评论内容"
          align="center"
          prop="content"
          :show-overflow-tooltip="true"
          width="380"
        >
          <template slot-scope="scope">
            <p v-html="scope.row.content" style="width:25px;height:25px"></p>
          </template>
        </el-table-column>
        <el-table-column
          label="评论用户"
          align="center"
          prop="username"
          :show-overflow-tooltip="true"
          width="120"
        />
        <el-table-column
          label="发布时间"
          align="center"
          prop="commentTime"
          :show-overflow-tooltip="true"
          width="100"
        />
        <el-table-column
          label="状态"
          align="center"
          prop="status"
          :show-overflow-tooltip="true"
          width="120"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status==0">正常</span>

            <el-tooltip
              class="item"
              effect="dark"
              :content="scope.row.remark"
              placement="top"
              v-else
            >
              <span>
                锁定
                <i class="el-icon-info"></i>
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="lock(scope.row)"
              v-if="scope.row.status==0"
            >锁定</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              v-if="scope.row.status==1"
              @click="lock(scope.row)"
            >解锁</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="detail(scope.row)">详情</el-button>
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
    <el-dialog :title="title" :visible.sync="open" width="800px" height="1000px" append-to-body>
      <div class="detail">
        <div class="item">
          <h3 class="titleH">商品信息</h3>
          <div class="list">
            <div class="left">
              <div>
                <span>商品编号：</span>
                <span>{{Commdetail.goodsNumber}}</span>
              </div>
              <div>
                <span>商品名称：</span>
                <span>{{Commdetail.goodsName}}</span>
              </div>
            </div>
            <div class="right">
              <div>
                <span>商品货号：</span>
                <span>{{Commdetail.goodsArticleNo}}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="item">
          <h3 class="titleH">门店信息</h3>
          <div class="list">
            <div class="left">
              <div>
                <span>门店名称:</span>
                <span>{{Commdetail.storeName}}</span>
              </div>
              <div>
                <span>所在地:</span>
                <span>{{Commdetail.region}}</span>
              </div>
            </div>
            <div class="right">
              <div>
                <span>门店联系电话:</span>
                <span>{{Commdetail.storeContactPhone}}</span>
              </div>
              <div>
                <span>详细地址:</span>
                <span>{{Commdetail.address}}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="item">
          <h3 class="titleH">评价用户信息</h3>
          <div class="list">
            <div class="left">
              <div>
                <span>用户ID:</span>
                <span>{{Commdetail.memberId}}</span>
              </div>
              <div>
                <span>评价用户名:</span>
                <span>{{Commdetail.username}}</span>
              </div>
            </div>
            <div class="right">
              <div>
                <span>评价用户手机号:</span>
                <span>{{Commdetail.mobilePhone}}</span>
              </div>
              <div>
                <span>评价用户昵称:</span>
                <span>{{Commdetail.username}}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="item">
          <h3 class="titleH">评价用户信息</h3>
          <div class="list1">
            <div class="main">
              <span>商品规格：</span>
              <span>{{Commdetail.specValue}}</span>
            </div>
            <div class="main">
              <span>评价等级：</span>
              <span>{{Commdetail.score}}</span>
            </div>
            <div class="main">
              <span>评价内容：</span>
              <span v-html="Commdetail.content"></span>
            </div>
          </div>
        </div>

        <div class="btn">
          <el-button type="primary" @click="close">关闭</el-button>
          <el-button
            v-if="Commdetail.status==0"
            type="primary"
            @click="lock1(form.id,form.status)"
          >锁定</el-button>
          <el-button v-else type="primary" @click="lock1(form.id,form.status)">解锁</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog :title="title1" :visible.sync="open1" width="800px" height="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
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
import { getCommentList, getCommentDetail, updComment } from '../../../api/comment/index';
import { getClassifyTree } from '../../../api/business/index';
export default {
  data() {
    return {
      rules: {
        remark: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' }
        ]

      },
      form: { remark: '', status: '', id: '' },
      title: '评论详情',
      open: false,
      title1: '备注',
      open1: false,
      queryParam: {
        code: '',
        pageNum: 1,
        pageSize: 20
      },
      commentList: [],
      code: [],
      options: [],
      SetKesDept: {
        value: 'id',
        label: 'name',
        children: 'subclass'
      },
      total: 0,
      optionsid: [
        {
          dictValue: 0,
          dictLabel: '正常'
        },
        {
          dictValue: 1,
          dictLabel: '锁定'
        }
      ],
      queryParam: {
        goodsNumber: '',
        goodsArticleNo: '',
        goodsName: '',
        status: '',
        classId: '',
        memberInfo: '',
        type: 1,
        pageNum: 1,
        pageSize: 20
      },
      Commdetail: ''
    };
  },
  created() {
    this.getList();
    this.getTreeList();
  },
  methods: {
    submitForm() {
      if (this.form.status == 0) {
        this.form.status = 1;
      } else {
        this.form.status = 0;
      }
      updComment(this.form.id, this.form.status, this.form.remark)
        .then(res => {
          console.log(res);
          this.open1 = false;
          this.open = false;
          if (res.code == 200) {
            this.getList();
            this.msgSuccess('修改成功');
          } else {
            this.msgError(res.message);
          }
        });
    },
    cancel() {
      this.open1 = false;
    },
    getTreeList() {
      this.loading = false;
      getClassifyTree({ status: 0 }).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.options = res.data;
        }
      });
    },
    getList() {
      this.loading = false;
      if (this.queryParam.classId !== '') {
        this.queryParam.classId = this.queryParam.classId[this.queryParam.classId.length - 1];
        console.log(this.queryParam.classId);
      }

      getCommentList(this.queryParam).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.commentList = res.data.list;
          this.total = res.data.total;
        }
      });
    },
    lock(row) {
      console.log(row);
      this.form.remark = '';
      this.open1 = true;
      this.form.id = row.id;
      this.form.status = row.status;
    },

    lock1(id, status) {
      this.open1 = true;
      this.form.remark = '';
      this.open1 = true;
      this.form.id = id;
      this.form.status = status;
    },
    detail(row) {
      this.open = true;
      this.form.id = row.id;
      this.form.status = row.status;
      getCommentDetail({ id: row.id, type: 1 }).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.Commdetail = res.data;
        }
      });
    },
    getCommentList() { },
    handleQuery() {
      this.getList();
    },
    resetQuery() {
      this.queryParam = {
        goodsNumber: '',
        goodsArticleNo: '',
        goodsName: '',
        status: '',
        classId: '',
        memberInfo: '',
        type: 1,
        pageNum: 1,
        pageSize: 20
      };
    },
    handleChange() { },
    close() {
      this.open = false;
    }

  }
};
</script>
<style lang="scss" scoped>
.ele-form {
  background-color: #fff;
  padding: 20px 20px 0px 20px;
  margin-bottom: 10px;
  position: relative;
}
.el-dialog {
  height: 1000px !important;
}

.detail {
  width: 100%;
  height: auto;
  overflow: auto;
}
.item {
  width: 100%;
  height: auto;
  overflow: hidden;
  margin-bottom: 8px;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 10px;
  line-height: 30px;
  // margin-top: 20px;
}
.titleH {
  margin-bottom: 5px;
}
.item > h1 {
  display: block;
  border-bottom: 1px solid #999;
  padding: 10px 0;
  font-size: 20px;
}
.item > .list {
  display: flex;
  justify-content: space-between;
}
.item > .list > .left {
  width: 35%;
  height: auto;
  overflow: hidden;
}
.item > .list > .left > div > span:nth-child(1) {
  font-size: 12px;
  font-weight: bold;
}
.item > .list > .left > div > span:nth-child(2) {
  font-size: 12px;

  color: rgb(39, 38, 38);
}

.item > .list > .right {
  width: 65%;
  height: auto;
  overflow: hidden;
}
.item > .list > .right > div > span:nth-child(1) {
  font-size: 12px;

  font-weight: bold;
}
.item > .list > .right > div > span:nth-child(2) {
  font-size: 12px;

  color: rgb(39, 38, 38);
}

.item > .list1 > .main {
  width: 100%;
  font-size: 15px;

  margin-top: 10px;
}
.item > .list1 > .main > span:nth-child(1) {
  font-size: 15px;

  font-weight: bold;
}
.item > .list1 > .main > span:nth-child(2) {
  font-size: 15px;

  color: rgb(39, 38, 38);
}
.btn {
  width: 200px;
  overflow: hidden;
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 40px;
}
.el-tooltip img {
  display: inline-block;
  width: 30px;
  height: 30px;
}
.ele-table {
  padding: 20px;
  background-color: #fff;
  min-height: 500px;
}
.ele-table img {
  display: inline-block;
  width: 30px;
  height: 30px;
}
.rowFlex {
  position: relative;
  clear: both;
  min-width: 1100px;
  .formItem {
    float: left;
    // display: inline-block;
  }
}
.formContain {
  overflow-x: auto;
}
.clearFix::after {
  content: "";
  display: block;
  height: 0px;
  clear: both;
  visibility: hidden;
}
</style>
