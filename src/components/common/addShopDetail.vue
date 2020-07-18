<template>
  <div class="shopDetail">
    <div v-if="active==2">
      <p class="editTitle">图文描述</p>
      <div class="stepThree">
        <div ref="editor" class="editor">
          <editorElem :catchData.sync="catchData" :content="content"></editorElem>
        </div>
        <div class="tips">
          <div class="tH2">图片规范:</div>
          <div>1、 图片宽度支持范围是480-790像素，建议700像素</div>
          <div>2、 高度:不要超过1334像素</div>
          <div>3、 单张图片：不超过1024KB，所有图片不超过10240KB</div>
          <div>4、 图片格式：JPG、PNG、BMP</div>
          <div>5、 图片数量：最多不能超过50张图片</div>
        </div>
      </div>
      <form>
        <div class="ftBtn">
          <el-button @click="addShop" type="primary">添加</el-button>
          <el-button @click="backStep">
            <span v-if="id">返回</span>
            <span v-else>返回上一步</span>
          </el-button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
// import api from '../../axios/http';
import editorElem from './wangEditor';
import { saveGoodsInfo, updateInfoDetails } from '../../api/business/index';
import Bus from '../../utils/bus';
export default {
  data() {
    return {
      catchData: null,
      content: null,
      id: '',
      baseInfo: {}
    };
  },
  components: {
    editorElem
  },
  computed: {
    active: {
      get: function () {
        return this.$store.state.active;
      },
      set: function () {
      }

    }
  },

  created() {
    this.id = this.$route.query.id;
    if (this.id) {
      this.baseInfo = this.$store.state.baseInfo;

      this.content = this.baseInfo.describe;
      this.$nextTick(function () { // 解决第一次监听不到数据
        Bus.$emit('listenToA', this.content);
      });
    }
    console.log(this.content, '99999999');
    // const baseInfo = this.$store.state.baseInfo;
  },
  methods: {
    backStep() {
      if (this.id) {
        this.$emit('update:isShowBaseInfo', false);
      } else {
        this.$store.commit('changState', 1);
      }
    },
    addShop() {
      const that = this;
      if (this.id) {
        // this.baseInfo.services = this.formParam.services.toString();
        // this.baseInfo.mainImg = this.formParam.mainImg.toString();
        console.log(this.catchData, '=============');
        this.baseInfo.id = this.id;
        this.baseInfo.describe = String(this.catchData);
        // console.log(this.formParam.services, this.formParam.mainImg);
        let formData = new FormData();
        formData.append('describe', this.baseInfo.describe);
        formData.append('id', this.baseInfo.id);
        this.$http({
          method: 'post',
          url: 'marketGoods/updateMarketGoodsInfo',
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true,
          data: formData
        }).then((res) => {
          if (res.code === 200) {
            that.msgSuccess('修改成功');
            that.$emit('update:isShowBaseInfo', false);
          } else {
            that.msgInfo(res.message);
          }
        });
        // updateInfoDetails(this.baseInfo).then(res => {
        //   if (res.code === '200') {
        //     that.msgSuccess('修改成功');
        //     that.$emit('update:isShowBaseInfo', false);
        //   }
        // });
      } else {
        const baseInfo = this.$store.state.baseInfo;
        baseInfo.services = this.$store.state.baseInfo.services.toString();
        // baseInfo.mainImg = this.$store.state.baseInfo.mainImg.toString();
        const goodsDetails = this.$store.state.goodsDetails;
        const describe = {
          describe: String(this.catchData)
        };
        const dataInfo = Object.assign({}, baseInfo, goodsDetails, describe);
        console.log(dataInfo);
        let formData = new FormData();
        // for (var key in this.formMess) {
        //   formData.append(key, this.formMess[key]);
        // }
        dataInfo.fmainImg.forEach((item) => {
          formData.append('mainImgFiles', item.raw);
        });
        formData.append('articleNo', dataInfo.articleNo);
        formData.append('classId', dataInfo.classId);
        formData.append('describe', dataInfo.describe);

        formData.append('marketGoodsDetailStrs', JSON.stringify(dataInfo.marketGoodsDetailStrs));
        formData.append('name', dataInfo.name);
        formData.append('services', dataInfo.services);
        formData.append('specCheckedName', JSON.stringify(dataInfo.specCheckedName));
        formData.append('goodsStatus', dataInfo.goodsStatus);
        formData.append('title', dataInfo.title);

        this.$http({
          method: 'post',
          url: 'marketGoods/saveMarketGoodsInfo',
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true,
          data: formData
        }).then((res) => {
          if (res.code === 200) {
            that.msgSuccess('添加成功');
            setTimeout(function () {
              that.$router.push({ path: '/business/findShopList' });
              that.$store.commit('changState', 0);
            }, 1000);
          } else {
            that.msgInfo(res.message);
          }
        });

        // saveGoodsInfo(dataInfo).then((res) => {
        //   if (res.code === '200') {
        //     that.msgSuccess('添加成功');
        //     setTimeout(function () {
        //       // that.$router.push({ path: '/business/findShopList' });
        //       // that.$store.commit('changState', 0);
        //     }, 1000);
        //   } else {
        //     that.msgInfo(res.message);
        //   }
        // });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.editor {
  // width: 600px;
  width: 738px;
  margin-left: 110px;
  margin-right: 50px;
  // margin: auto;
}
.shopDetail {
  text-align: left;
  padding-top: 15px;
  padding-bottom: 30px;
}
.stepThree {
  display: -webkit-flex;
  display: flex;
  margin-top: 10px;
}
.ftBtn {
  margin-top: 20px;
  margin-left: 110px;
}
.tips {
  line-height: 30px;
  font-size: 12px;
  .tH2 {
    font-size: 16px;
    margin-bottom: 10px;
  }
}
.editTitle {
  font-weight: bold;
}
</style>
