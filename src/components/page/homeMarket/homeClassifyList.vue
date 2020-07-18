<template>
  <div class="classify">
    <div class="contian-box">
      <div class="addBtn">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增业务分类</el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="menuList"
        row-key="id"
        :tree-props="{children: 'subclass', hasChildren: 'hasChildren'}"
        :default-expand-all="true"
      >
        <el-table-column prop="name" label="商超业务分类名称" :show-overflow-tooltip="true" width="160"></el-table-column>
        <el-table-column prop="sepcNums" label="关联规格" align="center" width="100">
          <template slot-scope="scope" v-if="scope.row.level=='3'">
            <span>{{ scope.row.sepcNums}}</span>
            <el-button type="text" class="slot" @click="lookClass(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="goodsNums" label="关联商品" width="120">
          <template slot-scope="scope" class="slot" v-if="scope.row.level=='3'">
            <span>{{ scope.row.goodsNums}}</span>
            <el-button type="text" class="slot" @click="lookShop(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true"></el-table-column> -->
        <el-table-column prop="status" label="状态" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span v-if="scope.row.status=='0'">启用</span>
            <span v-if="scope.row.status=='1'">停用</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-if="scope.row.level=='3'"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-plus"
              @click="handleStop(scope.row)"
              v-if="scope.row.status=='0'&&(scope.row.level=='3'||scope.row.level=='2')"
            >停用</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-plus"
              @click="handleStop(scope.row)"
              v-if="scope.row.status=='1'&&(scope.row.level=='3'||scope.row.level=='2')"
            >启用</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-if="scope.row.level=='3'"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级分类" prop="parentId">
              <treeselect
                v-model="form.parentId"
                :options="menuList"
                :normalizer="normalizer"
                :multiple="false"
                :show-count="true"
                placeholder="选择上级菜单"
                noResultsText="没有数据"
                @select="select"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="分类图标" prop="imgUrl">
              <el-upload
                class="avatar-uploader"
                action="#"
                :on-change="imgPreview"
                :auto-upload="false"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="form.imgUrl" :src="form.imgUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="已选图标" prop="imgUrl">
              <el-upload
                class="avatar-uploader"
                action="#"
                :on-change="imgPreview1"
                :auto-upload="false"
                :show-file-list="false"
                :on-success="handleAvatarSuccess1"
                :before-upload="beforeAvatarUpload1"
              >
                <img v-if="form.imgUrl1" :src="form.imgUrl1" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="未选图标" prop="imgUrl">
              <el-upload
                class="avatar-uploader"
                action="#"
                :on-change="imgPreview2"
                :auto-upload="false"
                :show-file-list="false"
                :on-success="handleAvatarSuccess2"
                :before-upload="beforeAvatarUpload2"
              >
                <img v-if="form.imgUrl2" :src="form.imgUrl2" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类启用" prop="menuSortNumber">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { getClassifyTree, addClassify, getClassifyDetail, updClassify, delClassify, updClassifyStatus } from '@/api/homeMarket/index';
export default {
  components: { Treeselect },
  data() {
    return {
      disable: false,
      formData: new FormData(),
      menuList: [],
      loading: false,
      title: '',
      // 是否显示弹出层
      open: false,
      form: {
        status: 0
      },
      statusOptions: [
        {
          dictLabel: '是',
          dictValue: 0
        },
        {
          dictLabel: '否',
          dictValue: 1
        }
      ],
      rules: {
        parentId: [
          { required: true, message: '上级分类名称不能为空', trigger: 'blur' }
        ],
        imgUrl: [
          { required: true, message: '分类图标不能为空', trigger: 'blur' }
        ],
        imgUrl1: [
          { required: true, message: '选中图标不能为空', trigger: 'blur' }
        ],
        imgUrl2: [
          { required: true, message: '未选中图标不能为空', trigger: 'blur' }
        ],

        name: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '分类启用不能为空', trigger: 'blur' }
        ]
      }
    };
  },

  created() {
    this.getTree();
  },
  methods: {
    // 图片上传

    handleAvatarSuccess(res, file) { },
    beforeAvatarUpload(file) { },
    // 上传图片
    imgPreview(file, fileList) {
      let fileName = file.name;
      let regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/;
      if (regex.test(fileName.toLowerCase())) {
        this.form.imgUrl = URL.createObjectURL(file.raw);
        this.formData.set('icon', file.raw);
      } else {
        this.$message.error('请选择图片文件');
      }
    },

    handleAvatarSuccess1(res, file) { },
    beforeAvatarUpload1(file) { },
    // 上传图片
    imgPreview1(file, fileList) {
      let fileName = file.name;
      let regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/;
      if (regex.test(fileName.toLowerCase())) {
        this.form.imgUrl1 = URL.createObjectURL(file.raw);
        this.formData.set('hotIcon', file.raw);
      } else {
        this.$message.error('请选择图片文件');
      }
    },

    handleAvatarSuccess2(res, file) { },
    beforeAvatarUpload2(file) { },
    // 上传图片
    imgPreview2(file, fileList) {
      let fileName = file.name;
      let regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/;
      if (regex.test(fileName.toLowerCase())) {
        this.form.imgUrl2 = URL.createObjectURL(file.raw);
        this.formData.set('unSelectIcon', file.raw);
      } else {
        this.$message.error('请选择图片文件');
      }
    },
    normalizer(node) {
      console.log(node, '00000');
      if (node.subclass && !node.subclass.length) {
        delete node.subclass;
      }
      if (node.level === '3') {
        node['isDisabled'] = true;
      }

      return {
        id: node.id,
        label: node.name,
        children: node.subclass
      };
    },

    select(e) {
      console.log(e);
      this.form.level = String(Number(e.level) + 1);
    },
    getTree() {
      getClassifyTree().then(res => {
        console.log(res);
        if (res.code === 200) {
          this.menuList = res.data;
          // this.menuList.map((item) => {
          //   if (item.subclass) {
          //     item.subclass.map((itemTwo) => {
          //       if (itemTwo.level == '2') {
          //         itemTwo.disableCheckbox = true;
          //       }
          //     });
          //   }
          // });
        } else {
        }
      });
    },
    reset() {
      this.form = {
        id: undefined,
        parentId: 0,
        name: undefined,

        status: 0,
        level: '',
        imgUrl: '',
        imgUrl1: '',
        imgUrl2: ''
      };
    },
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null) {
        this.form.parentId = row.id;
      }
      this.open = true;
      this.title = '添加分类';
    },
    getTreeselect() {
      this.getTree();
    },
    handleUpdate(row) {
      this.reset();
      this.getTree();
      console.log(row);
      this.title = '修改分类';
      getClassifyDetail({ id: row.id }).then(response => {
        this.disable = true;
        this.open = true;
        this.form.id = row.id;
        this.form.name = row.name;
        this.form.status = Number(row.status);

        this.form.parentId = row.parentId;
        this.form.imgUrl = response.data.icon;
        this.form.imgUrl1 = response.data.hotIcon;
        this.form.imgUrl2 = response.data.unSelectIcon;
        this.form.level = response.data.level;
      });
    },
    handleStop(row) {
      let text = row.status === '1' ? '启用' : '停用';
      this.$confirm('是否确认' + text + '名称为"' + row.name + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          if (row.status === '1') {
            row.status = '0';
          } else {
            row.status = '1';
          }
          return updClassifyStatus({ id: row.id, level: row.level, status: row.status });
        })
        .then(() => {
          this.getTree();
          this.msgSuccess('操作成功');
        })
        .catch(function () { });
    },
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return delClassify({ id: row.id, level: row.level });
        })
        .then(() => {
          this.getTree();
          this.msgSuccess('删除成功');
        })
        .catch(function () { });
    },
    submitForm() {
      this.$refs['form'].validate(valid => {
        console.log('------', this.form);
        if (valid) {
          if (this.form.id !== undefined) {
            updClassify(
              this.form.id,
              this.form.name,
              this.form.parentId,
              this.form.status,
              this.form.level,
              this.formData
            ).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功');
                this.open = false;
                this.getTree();
              } else {
                this.msgError(response.message);
              }
            });
          } else {
            console.log('------', this.form);
            addClassify(
              this.form.name,
              this.form.parentId,
              this.form.status,
              this.form.level,
              this.formData
            ).then(response => {
              if (response.code === 200) {
                this.msgSuccess('新增成功');
                this.open = false;
                this.getTree();
              } else {
                this.msgError(response.message);
              }
            });
          }
        }
      });
    },
    cancel() {
      this.open = false;
    },
    lookClass(item) {
      console.log(item);
      this.$router.push({ path: '/homeMarket/homeSpecsList', query: { id: item.id } });
    },
    lookShop(item) {
      console.log(item);
      this.$router.push({ path: '/homeMarket/homeShopList', query: { id: item.id } });
    }
  }
};
</script>
<style scoped lang="scss">
.ele-form {
  background-color: #fff;
  text-align: left;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .el-form-item {
    margin-bottom: 0px;
  }
}
.contian-box {
  background-color: #fff;
  margin-top: 10px;
  padding: 15px;
  min-height: 698px;
  .option-btn {
    margin-bottom: 15px;
  }
}
.el-upload--text {
  img {
    width: 50px;
  }
}
.addBtn {
  text-align: left;
  // padding-top: px;
  padding-bottom: 15px;
}
.avatar-uploader .el-upload {
  // border: 1px dashed #d9d9d9;
  // border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  font-size: 28px;
  color: #8c939d;
  width: 78px;
  height: 78px;
  line-height: 78px;
  text-align: center;
}
/deep/ .el-form-item__label {
  font-size: 12px;
  color: #333;
  font-weight: bold;
}
.el-table img {
  width: 20px;
  height: 20px;
}
/deep/.el-input-number.is-controls-right .el-input-number__decrease {
  bottom: 4px;
}
/deep/ .el-input-number__increase {
  top: 5px;
}
/deep/ .el-input-number.is-controls-right .el-input-number__increase {
  line-height: 16px;
}
/deep/.el-input-number.is-controls-right .el-input-number__decrease {
  line-height: 13px;
}
.slot {
  color: #409eff;
}
</style>
