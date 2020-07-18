<template>
  <div>
    <el-form :model="queryParam" ref="queryForm" :inline="true" label-width="80px" class="ele-form">
      <div class="clearFix formContain">
        <div class="rowFlex">
          <div class="formItem">
            <el-form-item label="商品编号:" prop="number">
              <el-input v-model="queryParam.number" placeholder="请输入" clearable size="small" />
            </el-form-item>
          </div>
          <div class="formItem">
            <el-form-item label="商品货号:" prop="articleNo">
              <el-input v-model="queryParam.articleNo" placeholder="请输入" clearable size="small" />
            </el-form-item>
          </div>
          <div class="formItem">
            <el-form-item label="商品名称:" prop="name">
              <el-input v-model="queryParam.name" placeholder="请输入" clearable size="small" />
            </el-form-item>
          </div>
        </div>
        <div class="rowFlex">
          <div class="formItem">
            <el-form-item label="商品状态:" prop="goodsStatus">
              <el-select v-model="queryParam.goodsStatus" placeholder="请选择" clearable size="small">
                <el-option
                  v-for="dict in shopState"
                  :key="dict.id"
                  :label="dict.value"
                  :value="dict.id"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="formItem">
            <el-form-item label="商品分类:" prop="classId">
              <el-cascader
                v-model="queryParam.classId"
                :options="classOptions"
                :props="defaultProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </div>
          <div class="formItem">
            <el-form-item label="商品规格:" prop="status">
              <el-select v-model="queryParam.specValue" placeholder="请选择" clearable size="small">
                <el-option
                  v-for="dict in specValueList"
                  :key="dict.id"
                  :label="dict.name"
                  :value="dict.id"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="formItem">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>

    <div class="ele-table">
      <div class="addShop">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </div>
      <el-table :data="goodsList" v-loading="loading" :max-height="clieHeight">
        <el-table-column label="商品图片" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="商品信息异常"
              placement="top-start"
              v-if="scope.row.classStatus==1"
            >
              <span class="tipImg">
                <img src="../../../assets/img/tip.png" width="20px" />
              </span>
            </el-tooltip>
            <el-popover placement="right" width="120" trigger="hover">
              <img :src="scope.row.mainImg.split(',')[0]" alt width="120px" />
              <img :src="scope.row.mainImg.split(',')[0]" slot="reference" alt class="mainImg" />
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="商品编号" align="center" prop="number" :show-overflow-tooltip="true" />
        <el-table-column
          label="商品货号"
          align="center"
          prop="articleNo"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="商品名称" align="center" prop="name" :show-overflow-tooltip="true" />
        <el-table-column
          label="规格最低价(元)"
          align="center"
          prop="price"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="商品状态" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span v-if="scope.row.goodsStatus==1">上架中</span>
            <span v-if="scope.row.goodsStatus==2">未上架</span>
            <span v-if="scope.row.goodsStatus==3">已下架</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" :show-overflow-tooltip="true" width="160px">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="toDetail(scope.row.id,scope.row.classId)">详情</el-button>
            <el-button size="mini" type="text" @click="toShelf(scope.row.id,scope.row.goodsStatus)">
              <span v-if="scope.row.goodsStatus==1">下架</span>
              <span v-if="scope.row.goodsStatus==2||scope.row.goodsStatus==3">上架</span>
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDel(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParam.pageNum"
        :limit.sync="queryParam.pageSize"
        @pagination="getGoodsList"
      />
    </div>
  </div>
</template>
<script>
import { getClassifyTree, getClassifyDetail } from '../../../api/homeMarket/index';
import { getGoodsInfoList, deleteGoodsInfo, updateGoodsStatus } from '../../../api/homeMarket/shop';
import { getGoodsSpec } from '../../../api/homeMarket/spec';
export default {
  data() {
    return {
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        specValue: undefined,
        number: undefined,
        articleNo: undefined,
        goodsStatus: undefined,
        name: undefined,
        classId: undefined
      },
      shopState: [
        // eslint-disable-next-line no-multi-spaces
        {          id: 1,
          value: '上架中'
        },
        {
          id: 2,
          value: '未上架'
        }, {
          id: 3,
          value: '已下架'
        }
      ],
      specValueList: [],
      goodsList: [],
      loading: true,
      total: 0,
      title2: '选择分类',
      openTwo: false,
      classId: null,
      treeText: '',
      defaultKey: [],
      filterText: '',
      defaultProps: {
        value: 'id',
        label: 'name',
        children: 'subclass'
      },
      classOptions: [],
      clieHeight: null
    };
  },
  created() {
    if (this.$route.query.id) {
      this.classId = this.$route.query.id;
      this.queryParam.classId = this.$route.query.id;
      this.getClassifyDetail();
    }

    this.getSpecValue();
    this.getGoodsList();
    getClassifyTree({ status: 0 }).then((res) => {
      if (res.code === 200) {
        this.classOptions = res.data;
        this.classOptions.forEach((item) => {
          if (item.subclass) {
            item.subclass.map((itemTwo) => {
              if (!itemTwo.subclass && itemTwo.level === '2') {
                itemTwo.disabled = true;
              }
            });
          }
        });
      }
    });
  },

  mounted() {
    this.clieHeight = window.innerHeight - 370;
  },
  methods: {
    // 获取规格
    getSpecValue() {
      getGoodsSpec({ pageNum: 1, pageSize: 999 }).then((res) => {
        if (res.code === 200) {
          this.specValueList = res.data.list;
        }
      });
    },
    getClassifyDetail() {
      getClassifyDetail({ id: this.classId }).then(res => {
        if (res.code === 200) {
          this.treeText = res.data.name;
        }
      });
    },
    // 获取基础商品列表
    getGoodsList() {
      getGoodsInfoList(this.queryParam).then((res) => {
        if (res.code === 200) {
          this.loading = false;
          this.goodsList = res.data.list;
          this.total = res.data.total;
        }
      });
    },
    // 条件搜索
    handleQuery() {
      if (this.queryParam.classId && this.queryParam.classId.length > 0) {
        this.queryParam.classId = this.queryParam.classId[this.queryParam.classId.length - 1];
      }

      this.getGoodsList();
    },
    // 重置
    resetQuery() {
      this.queryParam = {
        pageNum: 1,
        pageSize: 10,
        specValue: undefined,
        number: undefined,
        articleNo: undefined,
        goodsStatus: undefined,
        name: undefined,
        classId: this.classId
      };
      this.$route.query.id ? this.classId = this.$route.query.id : this.classId = null;
      this.treeText = '';
      this.defaultKey = [];
      this.getGoodsList();
    },
    // 添加
    handleAdd() {
      this.$router.push({ path: '/homeMarket/addHomeShop' });
      this.$store.commit('changActive', 0);
    },
    toDetail(id, classId) {
      console.log(id, '======');
      this.$router.push({ path: '/homeMarket/addHomeShop', query: { id: id, classId: classId } });
    },
    handleDel(id) {
      const that = this;
      this.$confirm('是否确认删除该数据吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return deleteGoodsInfo({ id: id }).then((res) => {
            if (res.code === 200) {
              that.getGoodsList();
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
    toShelf(id, statu) {
      console.log(statu);
      const that = this;
      if (Number(statu) === 1) {
        const status = 3;
        this.$confirm('确认下架该商品吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(function () {
            return updateGoodsStatus({ id: id, goodsStatus: status }).then((res) => {
              if (res.code === 200) {
                that.getGoodsList();
                that.msgSuccess('已下架');
              } else {
                that.msgError(res.message);
              }
            });
          })
          .catch(function () {
            that.$message('已取消');
          });
      } else {
        const status = 1;
        updateGoodsStatus({ id: id, goodsStatus: status }).then((res) => {
          if (res.code === 200) {
            that.getGoodsList();
            that.msgSuccess('上架成功');
          } else {
            that.msgError(res.message);
          }
        });
      }
    },

    clearInput() { },

    handleChange(value) {
      console.log(value, '00000000');
    }

  }
};
</script>
<style lang="scss" scoped>
.ele-form {
  background-color: #fff;
  padding: 10px 20px 0px 20px;
  margin-bottom: 10px;
  position: relative;
  overflow: hidden;
  .el-form-item {
    margin-bottom: 15px;
  }
  .bt-item {
    // position: absolute;
    text-align: right;
    // right: 10px;
  }
}
.mainImg {
  width: 50px;
}
.ele-table {
  background-color: #fff;
  min-height: 380px;
  padding-left: 15px;
  padding-right: 15px;
  .addShop {
    text-align: left;
    padding-top: 20px;
    margin-bottom: 20px;
  }
}
.tipImg {
  padding-right: 10px;
  position: absolute;
  left: 20px;
  top: 20px;
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
