<template>
  <div class="wrap">
    <div v-if="id" class="editInfo">
      <div class="tab-top">
        <span class="tipOneImg" v-if="classStatus==1&&!isEdit">
          <img src="../../../assets/img/tip.png" width="20px" />
        </span>
        <el-tabs v-model="activeName" @tab-click="handleClickTab" v-if="!isEdit">
          <el-tab-pane label="基本信息" name="first">
            <div class="contTitle">
              <span>基本信息</span>
            </div>
            <div class="baseinfo">
              <div>
                <span class="title">商品名称：</span>
                {{baseInfos.name}}
              </div>
              <div>
                <span class="title">商品副标题：</span>
                {{baseInfos.title}}
              </div>
              <div>
                <span class="title">商品货号：</span>
                {{baseInfos.articleNo}}
              </div>
              <div>
                <span class="title">商品主图：</span>
                <span>
                  <img
                    class="mainImgs"
                    :src="item"
                    v-for="(item, index) in mainImg"
                    :key="index"
                    alt
                  />
                </span>
              </div>
              <div class="itemLine">
                <div class="title">服务方式：</div>
                <div>
                  <div v-for="(item,index) in baseInfos.services" :key="index" class="services">
                    <span v-if="item==1">送货上门</span>
                    <span v-if="item==2">快递</span>
                    <span v-if="item==3">门店自提</span>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="业务规格" name="second">
            <div class="contTitle">
              <span class="classifi">商品分类</span>
              <!-- <el-button type="primary" @click="clickEdit">编辑</el-button> -->
            </div>
            <div class="shopClassifi">
              <span class="classifiTitle">商品分类：</span>
              <div class="inputDiv">
                <el-input
                  v-model="treeText"
                  placeholder="请输入"
                  size="small"
                  :disabled="true"
                  class="classiInput"
                />
              </div>
              <el-tooltip
                class="item"
                effect="dark"
                content="该分类已停用，为了避免商品展示受影响，请尽快更换其他商品分类"
                placement="top-start"
                v-if="classStatus==1"
              >
                <div class="tipTwoTip">
                  <img src="../../../assets/img/tips.png" alt width="30px" />
                </div>
              </el-tooltip>
            </div>

            <div class="specifi">业务规格配置</div>
            <div class="specifiTable">
              <el-table :data="tableDatas">
                <el-table-column
                  label="商品名称"
                  align="center"
                  prop="name"
                  :show-overflow-tooltip="true"
                />
                <el-table-column
                  :label="item.specName"
                  align="center"
                  v-for="(item,index) in tableHead"
                  :key="item.specId"
                  :show-overflow-tooltip="true"
                >
                  <template slot-scope="scope">
                    <span>{{scope.row.specValues[index].specValueName}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="销售价格(元)"
                  align="center"
                  prop="price"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  label="规格图片"
                  align="center"
                  prop="specImg"
                  :show-overflow-tooltip="true"
                >
                  <template slot-scope="scope">
                    <el-popover placement="right" width="120" trigger="hover">
                      <img :src="scope.row.specImg" alt width="120px" />
                      <img
                        :src="scope.row.specImg"
                        slot="reference"
                        alt
                        class="mainImg"
                        width="50px"
                      />
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column
                  label="状态"
                  align="center"
                  prop="status"
                  :show-overflow-tooltip="true"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.status==0">启用</span>
                    <span v-if="scope.row.status==1">停用</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="图文描述" name="third">
            <div class="contTitle">
              <span>图文描述</span>
              <!-- <el-button type="primary" @click="clickEdit">编辑</el-button> -->
            </div>
            <div v-html="describe" class="content"></div>
          </el-tab-pane>
        </el-tabs>
        <div class="editBtn">
          <el-button type="primary" @click="clickEdit" v-if="!isEdit">编辑</el-button>
        </div>
      </div>
      <addShopBaseInfo v-if="isEdit&&activeName=='first'" :isShowBaseInfo.sync="isEdit"></addShopBaseInfo>
      <addSpecifications v-if="isEdit&&activeName=='second'" :isShowBaseInfo.sync="isEdit"></addSpecifications>
      <addShopDetail v-if="isEdit&&activeName=='third'" :isShowBaseInfo.sync="isEdit"></addShopDetail>
    </div>

    <div v-else>
      <step :active="active"></step>
      <addShopBaseInfo></addShopBaseInfo>
      <addSpecifications></addSpecifications>
      <addShopDetail></addShopDetail>
    </div>
  </div>
</template>
<script>
import step from '../../common/addBaseInfo';
import addShopBaseInfo from '../../common/addShopBaseInfo';
import addSpecifications from '../../common/addSpecifications';
import addShopDetail from '../../common/addShopDetail';
import { findInfoDetails, findGoodsInfoDetails } from '../../../api/business/index';
export default {
  data() {
    return {
      id: null,
      activeName: 'first',
      baseInfos: {},
      mainImg: [],
      isEdit: false,
      services: [],
      classId: '',
      treeText: '',
      tableDatas: [],
      describe: '',
      tableHead: [],
      classStatus: null
    };
  },
  components: {
    step,
    addShopBaseInfo,
    addSpecifications,
    addShopDetail
  },
  computed: {
    // ...mapState({
    //   baseInfo: state => state.baseInfo// 使用ES6的箭头函数来给count赋值
    // })
    baseInfo() {
      console.log(this.$store.state.baseInfo, '0000');
      return this.$store.state.baseInfo;
    },
    active() {
      return this.$store.state.active;
    }

  },
  watch: {
    isEdit: {
      handler: function (val, oldval) {
        console.log(val);

        this.listEdit(this.id);
        if (this.activeName === 'second') {
          this.getGoodsList();
        }
      },
      deep: true
    }

  },
  created() {
    console.log(this.baseInfo);
    const info = this.$store.state.baseInfo;
    console.log(info);
    this.$store.commit('changState', 0);
    this.id = this.$route.query.id;
    this.classId = this.$route.query.classId;
    if (this.id) {
      this.listEdit(this.id);
      this.getGoodsList();
    }

    console.log(this.id);
  },
  methods: {
    handleClickTab(val) {
      console.log(val, '0000');
      this.activeName = val.name;
    },
    listEdit(id) {
      findInfoDetails(id).then((res) => {
        if (res.code === 200) {
          this.baseInfos = res.data;
          this.mainImg = this.baseInfos.mainImg.split(',');
          this.services = this.baseInfos.services.split(',');
          this.describe = this.baseInfos.describe;

          console.log(this.mainImg);
        }
      });
    },
    getGoodsList() {
      const that = this;
      findGoodsInfoDetails({ id: this.id, classId: this.classId }).then(res => {
        if (res.code === 200) {
          this.treeText = res.data.classResult.className;
          this.tableDatas = res.data.marketGoodsDetails;
          this.classStatus = res.data.classResult.classStatus;
          if (this.tableDatas.length > 0) {
            this.tableDatas.forEach(ele => {
              that.tableHead = ele.specValues;
            });
          }

          // console.log(this.tableDatas[0].specValues[0].specName, '00000000');
        }
      });
    },
    clickEdit() {
      this.isEdit = true;
      if (this.activeName === 'first') {
        this.$store.commit('getBaseInfo', this.baseInfos);
      } else if (this.activeName === 'second') {
        this.$store.commit('GoodsDetails', this.tableDatas);
        this.$store.commit('changState', 1);
      } else if (this.activeName === 'third') {
        this.$store.commit('getBaseInfo', this.baseInfos);
        this.$store.commit('changState', 2);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.wrap {
  background-color: #fff;
  text-align: left;
  .mainImgs {
    width: 150px;
    vertical-align: middle;
    margin-right: 20px;
  }
  .baseinfo {
    line-height: 35px;
    padding-left: 20px;
    padding-bottom: 30px;
  }
  .title {
    width: 100px;
    text-align: right;
    display: inline-block;
    font-size: 12px;
    font-weight: bold;
  }
  .editInfo {
    padding-left: 20px;
  }
  .tab-top {
    position: relative;
  }
  .editBtn {
    position: absolute;
    top: 5px;
    right: 30px;
  }
  .services {
    // margin-left: 100px;
    margin-right: 10px;
  }
  .itemLine {
    display: -webkit-box;
    display: -moz-box;
    margin-top: 10px;
  }
  .contTitle {
    margin-bottom: 10px;
  }
  .content {
    min-height: 500px;
  }
  .classifi,
  .specifi {
    font-weight: bold;
    font-size: 14px;
  }
  .specifi {
    margin-top: 20px;
    margin-bottom: 15px;
  }
  .specifiTable {
    padding-left: 10px;
    padding-right: 15px;
    min-height: 500px;
  }
  .tipOneImg {
    position: absolute;
    margin-left: 155px;
    width: 30px;
    display: inline-block;
    margin-top: 8px;
  }
  .tipTwoTip {
    margin-left: 20px;
  }
}
.shopClassifi {
  display: flex;
  display: -webkit-flex;
  align-items: center;
  justify-items: center;
  .classifiTitle {
    display: inline-block;
    width: 120px;
  }
  .inputDiv {
    position: relative;
    z-index: 0;
  }
  .classiInput {
    position: relative;
    z-index: -2;
    width: 400px;
  }
}
</style>
