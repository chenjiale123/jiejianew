<template>
  <div class="wrap">
    <div class="baseInfo">基本信息</div>
    <div class="contain-box">
      <el-form
        :model="queryParam"
        ref="queryForm"
        label-width="110px"
        class="ele-form"
        :rules="rules"
      >
        <el-form-item label="门店名称:" prop="name">
          <el-input
            v-model="queryParam.name"
            placeholder="请输入门店名称"
            clearable
            size="small"
            maxlength="25"
          />
        </el-form-item>
        <el-form-item label="门店特性:" prop="features">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="queryParam.features"
            maxlength="100"
          ></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="10">
            <el-form-item label="所在地:" prop="provinceCode">
              <el-select
                v-model="queryParam.provinceCode"
                placeholder="请选择省"
                @change="selectProv"
                class="address"
              >
                <el-option
                  v-for="dict in prvoname"
                  :key="dict.code"
                  :label="dict.name"
                  :value="dict.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item prop="cityCode" class="region">
              <el-select
                v-model="queryParam.cityCode"
                placeholder="请选择市"
                @change="selectCity"
                class="address"
              >
                <el-option
                  v-for="dict in cityname"
                  :key="dict.code"
                  :label="dict.name"
                  :value="dict.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item prop="areaCode" class="region">
              <el-select v-model="queryParam.areaCode" placeholder="请选择区" class="address">
                <el-option
                  v-for="dict in areaname"
                  :key="dict.code"
                  :label="dict.name"
                  :value="dict.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="详细地址:" prop="address">
            <el-input
              v-model="queryParam.address"
              placeholder="请输入详细地址"
              clearable
              size="small"
              maxlength="50"
            />
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="经度:" prop="longitude">
              <el-input
                v-model="queryParam.longitude"
                placeholder="请选择"
                size="small"
                style="width:120px"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="纬度:" prop="latitude">
              <el-input
                v-model="queryParam.latitude"
                placeholder="请选择"
                size="small"
                style="width:120px"
                :disabled="true"
              />
            </el-form-item>
            <!-- <el-button>地图选点</el-button> -->
          </el-col>
        </el-row>
        <el-form-item class label="门店成立时间:" prop="openTime">
          <el-date-picker v-model="queryParam.openTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item class label="门店联系电话:" prop="storeContactPhone">
          <el-input
            v-model="queryParam.storeContactPhone"
            placeholder="请输入门店联系电话"
            clearable
            size="small"
          />
        </el-form-item>
        <div class="concatInfo">
          联系信息
          <span class="tip">(联系信息供销售与售后服务使用)</span>
        </div>
        <el-form-item class label="联系人:" prop="contactPerson">
          <el-input
            v-model="queryParam.contactPerson"
            placeholder="请输入联系人"
            clearable
            size="small"
            maxlength="15"
          />
        </el-form-item>
        <el-form-item class label="联系手机:" prop="contactPhone">
          <el-input
            v-model="queryParam.contactPhone"
            placeholder="请输入联系人手机"
            clearable
            size="small"
            maxlength="11"
          />
        </el-form-item>
        <el-form-item class label="联系邮箱:">
          <el-input
            v-model="queryParam.contactMail"
            placeholder="请输入联系人邮箱"
            clearable
            size="small"
            maxlength="25"
          />
        </el-form-item>
      </el-form>
      <div class="map-chart">
        <div id="container" ref="container" />
        <div id="panel"></div>
        <div id="myPageTop">
          <table>
            <tr>
              <td>
                <label>请输入关键字：</label>
              </td>
            </tr>
            <tr>
              <td>
                <input type="text" id="tipinput" v-model="sAddress" onfocus="this.value=''" />
              </td>
              <td>
                <button @click="search">搜索</button>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <!-- <amap></amap> -->
    </div>
    <div class="storeInfo">门店介绍</div>
    <div ref="editor" class="editor">
      <editorElem :catchData.sync="catchData" :content="content"></editorElem>
    </div>
    <div class="ftBtn">
      <el-button type="primary" size="mini" @click="submitFileForm" :loading="isDisable">提交</el-button>
      <el-button size="mini" @click="resetQuery">返回列表</el-button>
    </div>

    <!-- <div>门店介绍</div> -->
  </div>
</template>
<script>
import { prvo, city, area } from '@/api/system/area';
import { addStore, updataStore, findDetail } from '../../../api/store/index';
import editorElem from '../../common/wangEditor';
// import { AMapManager, lazyAMapApiLoaderInstance } from 'vue-amap';
// import AMap from 'AMap';
import moment from 'moment';
import MapLoader from '@/utils/Amap';
// let amapManager = new AMapManager();
export default {
  data() {
    return {
      queryParam: {
        name: undefined,
        features: undefined,
        provinceCode: undefined,
        cityCode: undefined,
        areaCode: undefined,
        address: undefined,
        longitude: undefined,
        latitude: undefined,
        openTime: undefined,
        storeContactPhone: undefined,
        contactPerson: undefined,
        contactPhone: undefined,
        contactMail: undefined,
        openStatus: undefined,
        introduction: undefined
      },
      prvoname: [],
      cityname: [],
      areaname: [],
      Cname: '',
      Pname: '',
      input: '',
      placeSearch: null,
      mapObj: null,
      editorContent: '',
      catchData: null,
      content: null,
      rules: {
        name: [
          { required: true, message: '门店名称不能为空', trigger: 'blur' }
        ],
        features: [
          { required: true, message: '门店特性不能为空', trigger: 'blur' }
        ],
        provinceCode: [
          { required: true, message: '省不能为空', trigger: 'blur' }
        ],
        cityCode: [
          { required: true, message: '市不能为空', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '详细地址不能为空', trigger: 'blur' }
        ],
        longitude: [
          { required: true, message: '经纬度不能为空', trigger: 'blur' }
        ],
        openTime: [
          { required: true, message: '门店成立时间不能为空', trigger: 'blur' }
        ],
        storeContactPhone: [
          { required: true, message: '门店联系电话不能为空', trigger: 'blur' },
          {
            pattern: /(^0\d{2,3}\-\d{7,8}$)|(^1[3|4|5|6|7|8][0-9]{9}$)/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ],
        contactPerson: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
        contactPhone: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' },
          {
            pattern: /(^0\d{2,3}\-\d{7,8}$)|(^1[3|4|5|6|7|8][0-9]{9}$)/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }]
      },
      sAddress: null,
      poiArr: [],
      markers: [],
      windowsArr: [],
      isDisable: false
    };
  },
  components: {
    editorElem

  },
  created() {
    this.provi();
    this.id = this.$route.query.id;
    // console.log(id, '0000----------');
    if (this.id) {
      this.lookEdit(this.id);
    }
  },
  mounted: function () {
    this.AMapInit();
    // this.placeSearchs(this.sAddress);
  },
  methods: {
    lookEdit(id) {
      const that = this;
      findDetail({ storeId: id }).then((res) => {
        console.log(res, '-------');
        if (res.code === 200) {
          that.queryParam = res.data;
          that.content = res.data.introduction;
          console.log(res.data.introduction);
          that.Pname = res.data.provinceCode;
          that.Cname = res.data.cityCode;
          that.cityName();
          that.areaName();
        }
      });
    },
    provi() {
      prvo()
        .then(res => {
          console.log(res);
          this.prvoname = res.data;
        })
        .catch(() => { });
    },
    // 市
    cityName() {
      city({ provinceCode: this.Pname })
        .then(res => {
          console.log(res);
          this.cityname = res.data;
        })
        .catch(() => { });
    },
    // 区
    areaName() {
      console.log(this.Cname);
      area({ cityCode: this.Cname })
        .then(res => {
          console.log(res);
          this.areaname = res.data;
        })
        .catch(() => { });
    },
    // 选择省份
    selectProv(val) {
      console.log(val);
      this.Pname = val;
      this.cityName();
    },
    // 选择市
    selectCity(val) {
      console.log(val);
      this.Cname = val;
      this.areaName();
    },
    submitFileForm() {
      this.$refs.queryForm.validate((validate) => {
        if (validate) {
          const that = this;
          that.isDisable = true;
          // console.log(this.catchData, '----------------');
          if (this.catchData) {
            this.queryParam.introduction = this.catchData;
          }
          this.queryParam.openTime = moment(this.queryParam.openTime).format('YYYY-MM-DD');
          if (this.id) {
            const objParam = {
              address: this.queryParam.address,
              areaCode: this.queryParam.areaCode,
              cityCode: this.queryParam.cityCode,
              contactMail: this.queryParam.contactMail,
              contactPerson: this.queryParam.contactPerson,
              contactPhone: this.queryParam.contactPhone,
              features: this.queryParam.features,
              id: this.id,
              introduction: this.queryParam.introduction,
              latitude: this.queryParam.latitude,
              longitude: this.queryParam.longitude,
              name: this.queryParam.name,
              openTime: this.queryParam.openTime,
              provinceCode: this.queryParam.provinceCode,
              storeContactPhone: this.queryParam.storeContactPhone
            };
            updataStore(objParam).then((res) => {
              console.log(res, '=======');
              if (res.code === 200) {
                that.msgSuccess('修改成功');

                setTimeout(function () {
                  that.$router.push({ path: '/store/findStoreList' });
                  that.isDisable = false;
                }, 1000);
              } else {
                that.isDisable = false;
                that.msgInfo(res.message);
              }
            });
          } else {
            addStore(this.queryParam).then((res) => {
              if (res.code === 200) {
                that.msgSuccess('添加成功');

                setTimeout(function () {
                  that.$router.push({ path: '/store/findStoreList' });
                  that.isDisable = false;
                }, 1000);
              } else {
                that.isDisable = false;
                that.msgInfo(res.message);
              }
            });
          }
        }
      });
    },
    resetQuery() {
      this.$router.push({ path: '/store/findStoreList' });
    },
    AMapInit() {
      const that = this;
      var geolocation;
      // this.mapObj = new AMap.Map('container', {
      //   resizeEnable: true
      // });
      MapLoader().then(() => {
        that.mapObj = new AMap.Map('container', {
          resizeEnable: true,
          zoom: 11
        });
        // 定位插件
        that.mapObj.plugin('AMap.Geolocation', function () {
          geolocation = new AMap.Geolocation({
            timeout: 10000,
            GeoLocationFirst: false,
            maximumAge: 0, // 定位结果缓存0毫秒，默认：0
            zoomToAccuracy: true,
            showMarker: true, // 是否显示定位点
            buttonOffset: new AMap.Pixel(10, 20) // 定位按钮距离对应角落的距离
          });
          that.mapObj.addControl(geolocation);
          geolocation.getCurrentPosition();
        });
        //  监听定位是否成功还是失败，成功则可以得到当前位置的经度和纬度
        AMap.event.addListener(geolocation, 'complete', function (data) {
          that.queryParam.longitude = data.position.getLng(); // 定位成功返回的经度
          that.queryParam.latitude = data.position.getLat(); // 定位成功返回的纬度
          console.log(data.position.getLng(), data.position.getLat());
        }); // 返回定位信息
        AMap.event.addListener(geolocation, 'error', function (data) {
          if (data.info === 'FAILED') {
            that.message('获取您当前位置失败！');
          }
        });
        // 获取点击经纬度
        AMap.event.addListener(that.mapObj, 'click', function (e) {
          console.log(e.lnglat);
          that.mapObj.clearMap(); // 清除地图上所有添加的覆盖物
          // eslint-disable-next-line no-new
          new AMap.Marker({
            position: e.lnglat,
            map: that.mapObj
          });
          that.queryParam.longitude = e.lnglat.getLng();
          that.queryParam.latitude = e.lnglat.getLat();
        });
      }, e => {
        console.log('地图加载失败', e);
      });
    },
    placeSearchs(name) {
      const that = this;
      MapLoader().then(() => {
        that.mapObj = new AMap.Map('container', {
          resizeEnable: true,
          zoom: 11
        });
        var MSearch;
        this.mapObj.plugin(
          ['AMap.PlaceSearch', 'AMap.ToolBar', 'AMap.Scale'],
          () => {
            this.mapObj.addControl(new AMap.ToolBar());
            this.mapObj.addControl(new AMap.Scale());
            MSearch = new AMap.PlaceSearch({
              // 构造地点查询类
              city: '' // 城市
            });
            AMap.event.addListener(MSearch, 'complete', this.keywordSearch_CallBack); // 返回地点查询结果
            MSearch.search(name); // 关键字查询
          }
        );
        that.mapObj.on('click', function (e) {
          console.log(e, '000000000000');
          that.queryParam.longitude = e.lnglat.lng;
          that.queryParam.latitude = e.lnglat.lat;
          // document.getElementById('lnglat').value = e.lnglat.getLng() + ',' + e.lnglat.getLat();
        });
      }, e => {
        console.log('地图加载失败', e);
      });
    },
    addMarker(lng, lat) {
      var marker;
      marker = new AMap.Marker({
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
        position: [lng, lat]
      });
      marker.setMap();
    },
    keywordSearch_CallBack(data) {
      console.log(data, 'data==========');
      var poiArr = data.poiList.pois;
      var resultCount = poiArr.length;
      this.poiArr = poiArr; // 左边要渲染的数据
      for (var i = 0; i < resultCount; i++) {
        this.addmarker(i, poiArr[i]);
        this.poiArr[i].url = this.poiArr[i].photos ? this.poiArr[i].photos[0] ? this.poiArr[i].photos[0].url : '' : '';
      }
      this.mapObj.setFitView();
    },
    addmarker(i, d) {
      var lngX = d.location.getLng();
      var latY = d.location.getLat();
      var markerOption = {
        map: this.mapObj,
        position: new AMap.LngLat(lngX, latY)
      };
      var mar = new AMap.Marker(markerOption);
      this.markers.push(new AMap.LngLat(lngX, latY));
      var infoWindow = new AMap.InfoWindow({
        content:
          '<h3>' +
          d.name +
          '</h3>' +
          this.TipContents(d.name, d.address) +
          `</br>`,
        size: new AMap.Size(300, 0),
        autoMove: true,
        offset: new AMap.Pixel(0, -30)
      });
      this.windowsArr.push(infoWindow);
      var _this = this;
      var aa = (e) => {
        var obj = mar.getPosition();
        this.map = obj; // 这里保存的地址经纬度
        this.address = d.name; // 这里保存的是地址名字
        window.removeEventListener('click', _this.demo);
        infoWindow.open(_this.mapObj, obj);
        window.addEventListener('click', _this.demo);
      };
      AMap.event.addListener(mar, 'click', aa);
      // console.log('000000', this.map);
    },
    TipContents(name, address) {
      // 窗体内容
      if (
        name === '' ||
        name === 'undefined' ||
        name == null ||
        name === ' undefined' ||
        typeof name === 'undefined'
      ) {
        type = '暂无';
      }
      if (
        address === '' ||
        address === 'undefined' ||
        address == null ||
        address === ' undefined' ||
        typeof address === 'undefined'
      ) {
        address = '暂无';
      }
      var str = `地址：${address}`;
      return str;
    },
    demo(e) {
      console.log(e, '9090');
      if (e.target.id === `me`) {
        e.stopPropagation();
        this.saveAddress();
      }
      console.log(this.map, 'lll');
      this.queryParam.longitude = this.map.lng;
      this.queryParam.latitude = this.map.lat;
    },
    saveAddress() {
    },

    openMarkerTipById1(pointid, thiss) {
      // 根据id 打开搜索结果点tip
      thiss.currentTarget.style.background = '#CAE1FF';
      this.selectedIndex = pointid;
      this.map = this.markers[pointid];
      window.removeEventListener('click', this.demo);
      this.windowsArr[pointid].open(this.mapObj, this.markers[pointid]);
      window.addEventListener('click', this.demo);
    },
    onmouseout_MarkerStyle(pointid, thiss) {
      // 鼠标移开后点样式恢复
      thiss.currentTarget.style.background = '';
    },

    search() {
      this.mapObj = '';
      this.AMapInit();
      this.placeSearchs(this.sAddress);
    }

  }
};
</script>
<style lang="scss"  scoped>
.wrap {
  background-color: #fff;
  padding-top: 20px;
  padding-left: 10px;
  padding-bottom: 30px;
  padding-right: 30px;
  .ele-form {
    // width: 600px;
    margin-right: 30px;
  }
}
.region {
  /deep/ .el-form-item__content {
    margin-left: 30px !important;
  }
}
/deep/ .el-form-item__content {
  text-align: left;
}
#panel {
  position: absolute;
  background-color: white;
  max-height: 90%;
  overflow-y: auto;
  top: 80px;
  right: 10px;
  width: 280px;
}
.editor {
  // width: 600px;
  width: 738px;
  margin-left: 110px;
  // margin: auto;
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
}
.concatInfo .tip {
  font-size: 12px;
  color: #999;
  display: inline-block;
  padding-left: 10px;
  font-weight: normal;
}
.ftBtn {
  margin-top: 30px;
  text-align: left;
  margin-left: 110px;
}
.contain-box {
  display: -webkit-flex;
  display: flex;
}
.map-chart {
  position: relative;
  margin-bottom: 15px;
  width: 600px;
  height: 400px;
  border: 1px #dddddd solid;
}
/deep/ .amap-logo,
/deep/ .amap-copyright {
  display: none !important;
}

#container {
  margin-bottom: 15px;
  width: 100%;
  height: 400px;
  border: 1px #dddddd solid;
  z-index: 0;
}
#panel {
  position: absolute;
  background-color: white;
  max-height: 90%;
  overflow-y: auto;
  top: 10px;
  right: 10px;
  width: 280px;
}

#pickerBox {
  position: absolute;
  z-index: 9999;
  top: 50px;
  right: 30px;
  width: 300px;
}

#pickerInput {
  width: 200px;
  padding: 5px 5px;
}

#poiInfo {
  background: #fff;
}

.amap_lib_placeSearch .poibox.highlight {
  background-color: #cae1ff;
}

.amap_lib_placeSearch .poi-more {
  display: none !important;
}

.amap-info-content {
  font-size: 12px;
}
#myPageTop {
  position: absolute;
  top: 5px;
  right: 10px;
  background: #fff none repeat scroll 0 0;
  border: 1px solid #ccc;
  margin: 10px auto;
  padding: 6px;
  font-family: "Microsoft Yahei", "微软雅黑", "Pinghei";
  font-size: 14px;
  z-index: 99999999;
}
#myPageTop label {
  margin: 0 20px 0 0;
  color: #666666;
  font-weight: normal;
}
#myPageTop input {
  width: 170px;
}
#myPageTop .column2 {
  padding-left: 25px;
}
</style>
