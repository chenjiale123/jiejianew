<template>
  <div>
    <el-form
      :model="formParam"
      ref="queryForm"
      label-width="110px"
      class="ele-form"
      v-if="active==0"
      :rules="rules"
    >
      <el-form-item label="商品名称:" prop="name">
        <el-input v-model="formParam.name" placeholder="请输入商品名称" clearable size="small" />
      </el-form-item>
      <el-form-item label="商品副标题:" prop="title">
        <el-input v-model="formParam.title" placeholder="请输入商品副标题" clearable size="small" />
      </el-form-item>
      <el-form-item label="商品状态:" prop="goodsStatus">
        <el-select v-model="formParam.goodsStatus" placeholder="请选择" clearable size="small">
          <el-option v-for="dict in shopState" :key="dict.id" :label="dict.value" :value="dict.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品货号:" prop="articleNo">
        <el-input v-model="formParam.articleNo" placeholder="请输入商品货号" clearable size="small" />
      </el-form-item>
      <el-form-item label="商品主图:">
        <div v-if="mainImg.length>0">
          <div class="editImg" v-for="(item,index) in mainImg" :key="index">
            <img class="el-upload-list__item-thumbnail" :src="item" alt />
            <span class="el-upload-list__item-actions">
              <span
                v-if="!disabled"
                class="el-upload-list_item-delete"
                @click="handleRemoveImg(index)"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </div>
        <el-upload
          action="#"
          list-type="picture-card"
          accept="image/png, image/jpeg, image/jpg"
          :auto-upload="false"
          :on-change="uploadImg"
          :on-remove="handleRemove"
          :before-upload="beforeUpload"
          :file-list="files"
        >
          <i slot="default" class="el-icon-plus"></i>
        </el-upload>
        <span v-if="imgErrors" class="imgError">商品主图不能为空</span>
      </el-form-item>
      <el-form-item label="服务方式:" prop="services">
        <el-checkbox-group v-model="formParam.services" @change="handleCheckedChange">
          <el-checkbox
            v-for="item in servicesList"
            :label="item.services"
            :key="item.services"
          >{{item.value}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item prop>
        <div v-if="id">
          <el-button type="primary" @click="saveTwo">保存</el-button>
          <el-button @click="toBack">返回</el-button>
        </div>
        <el-button v-else type="primary" @click="save">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// import api from '../../axios/http';
import Cookies from 'js-cookie';
import { updateInfoDetails } from '../../api/business/index';
import Bus from '../../utils/bus';
export default {
  data() {
    return {
      checkList: ['选中且禁用', '复选框 A'],
      fileList: [],
      servicesList: [{
        services: '1',
        value: '送货上门'
      }, {
        services: '2',
        value: '快递'
      },
      {
        services: '3',
        value: '门店自提'
      }
      ],
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
      formParam: {
        name: undefined,
        title: undefined,
        goodsStatus: undefined,
        articleNo: undefined,
        services: [],
        fmainImg: []
      },
      mainImg: [],

      disabled: false,
      id: '',
      heard: {},
      uploadImageUrl: '',
      type: {
        type: 1
      },
      files: [],
      imgErrors: false,
      baseInfos: {},
      rules: {
        name: [
          { required: true, message: '商品名称不能为空', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '商品副标题不能为空', trigger: 'blur' }
        ],

        goodsStatus: [
          { required: true, message: '商品状态不能为空', trigger: 'blur' }
        ],
        articleNo: [
          { required: true, message: '商品货号不能为空', trigger: 'blur' }
        ],
        services: [
          { required: true, message: '服务方式不能为空', trigger: 'blur' }
        ]

      }

    };
  },
  props: ['isShowBaseInfo'],
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
    this.uploadImageUrl = this.digitalUploadUrl;
    this.heard = { 'Authentication': Cookies.get('token') };
    this.id = this.$route.query.id;
    this.baseInfos = this.$store.state.baseInfo;
    console.log(this.baseInfos, '9090909');
    Bus.$on('listenBaseInfo', (e) => {
      if (e) {
        this.formParam.services = e.services.split(',');
        this.files = e.fmainImg;
        this.files.forEach((item) => {
          item.url = window.URL.createObjectURL(item.raw);
        });
      }
    });
    if (this.id) {
      this.formParam.name = this.baseInfos.name;
      this.formParam.articleNo = this.baseInfos.articleNo;
      this.formParam.title = this.baseInfos.className;
      this.formParam.goodsStatus = this.baseInfos.goodsStatus;
      this.formParam.services = this.baseInfos.services.split(',');
      this.mainImg = this.baseInfos.mainImg.split(',');
    }
  },
  methods: {
    handleCheckedChange(value) {

    },
    handleRemove(file, filelist) {
      console.log(filelist, '9999');
      this.files = filelist;
    },
    handleRemoveImg(index) {
      this.mainImg.splice(index, 1);
    },
    uploadImg(file, filelist) {
      // console.log(file);
      this.files = filelist;
      console.log(filelist, '9999');
    },
    beforeUpload(file) {
      console.log(file);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isLt2M;
    },
    save() {
      this.$refs['queryForm'].validate(valid => {
        if (this.files.length < 1) {
          this.imgErrors = true;
        } else {
          this.imgErrors = false;
        }
        if (valid && !this.imgErrors) {
          this.formParam.services = this.formParam.services.toString();
          this.formParam.fmainImg = this.files;
          this.$nextTick(function () { // 解决第一次监听不到数据
            Bus.$emit('listenBaseInfo', this.formParam);
          });
          this.$store.commit('getBaseInfo', this.formParam);
          this.active = 1;
          this.$store.commit('changState', 1);
        }
      });
    },
    saveTwo() {
      const that = this;
      let formData = new FormData();
      console.log(this.files, this.formParam.mainImg);
      this.$refs['queryForm'].validate(valid => {
        if (this.files.length < 1 && this.mainImg.length < 1) {
          this.imgErrors = true;
        } else {
          this.imgErrors = false;
        }
        if (valid && !this.imgErrors) {
          this.formParam.services = this.formParam.services.toString();
          if (this.mainImg.length > 0) {
            this.formParam.mainImg = this.mainImg.toString();
            formData.append('mainImg', this.formParam.mainImg);
          }
          if (this.files.length > 0) {
            this.formParam.fmainImg = this.files;
            this.formParam.fmainImg.forEach((item) => {
              formData.append('mainImgFiles', item.raw);
            });
          }
          this.formParam.id = this.id;
          formData.append('articleNo', this.formParam.articleNo);
          formData.append('name', this.formParam.name);
          formData.append('services', this.formParam.services);
          formData.append('goodsStatus', this.formParam.goodsStatus);
          formData.append('title', this.formParam.title);
          formData.append('id', this.formParam.id);

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
              this.$emit('update:isShowBaseInfo', false);
              this.$store.commit('getBaseInfo', this.formParam);
            } else {
              that.msgInfo(res.message);
            }
          });
        }
      });

      // updateInfoDetails(this.formParam).then(res => {
      //   if (res.code === '200') {
      //     this.$message('修改成功');
      //     this.$emit('update:isShowBaseInfo', false);
      //     this.$store.commit('getBaseInfo', this.formParam);
      //   }
      // });
    },
    toBack() {
      this.$emit('update:isShowBaseInfo', false);
    }
  }
};
</script>
<style lang="scss" scoped>
.ele-form {
  width: 700px;
  text-align: left;
  padding-top: 15px;
  padding-bottom: 30px;
}
.imgError {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
}
.editImg {
  display: inline-block;
  position: relative;
  overflow: hidden;
  background-color: #fff;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 148px;
  height: 148px;
  margin: 0 8px 8px 0;
  display: inline-block;
  img {
    width: 100%;
    display: inline-block;
  }
}
.el-upload-list_item-delete {
  cursor: pointer;
  position: static;
  font-size: inherit;
  color: inherit;
  // top: 50%;
  line-height: 148px;
}
.el-upload-list__item-actions:hover {
  opacity: 1;
}
.el-upload-list__item-actions {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  cursor: default;
  text-align: center;
  color: #fff;
  opacity: 0;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-transition: opacity 0.3s;
  transition: opacity 0.3s;
}
</style>
