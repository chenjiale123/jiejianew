<template>
  <div>
    <el-form :model="queryParam" ref="queryForm" :inline="true" label-width="80px" class="ele-form">
      <el-form-item label="规格信息:" prop="name">
        <el-input
          v-model="queryParam.name"
          placeholder="请输入规格信息"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>

      <el-form-item label="商品分类" prop="storeId">
        <el-cascader
          v-model="queryParam.classId"
          :options="options"
          :props="SetKesDept"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item class="bt-item">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="ele-table">
      <div class="addBtn">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增规格</el-button>
      </div>
      <el-table v-loading="loading" :data="marketList" :max-height="clieHeight">
        <el-table-column
          label="规格名称"
          align="center"
          prop="name"
          :show-overflow-tooltip="true"
          width="210"
        />
        <el-table-column
          label="备注"
          align="center"
          prop="remark"
          :show-overflow-tooltip="true"
          width="180"
        />

        <el-table-column label="规格值" align="center" prop="values">
          <template slot-scope="scope">
            <span
              v-for="(item,index) in scope.row.marketSpecValues"
              :key="index"
            >{{(index+1)==scope.row.marketSpecValues.length? item.value:item.value+'、'}}</span>
            <!-- <span>{{scope.row.values}}</span> -->
            <!-- <span v-if="scope.row.values.length>200" class="slot">更多</span> -->
          </template>
        </el-table-column>
        <el-table-column label="所属分类" align="center" prop="className" />
        <el-table-column label="规格排序" align="center" width="90">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.sort"
              @blur="sortChange(scope.row)"
              oninput="this.value=this.value.replace(/[^0-9]/g,'')"
              maxlength="4"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name width="160px">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
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
        @pagination="getMarketList"
      />
    </div>

    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="18">
            <el-form-item label="规格名称" prop="name">
              <el-input
                v-model="form.name"
                placeholder="请输入规格名称"
                oninput="this.value=this.value.replace(/\s+/g,'')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="规格备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入规格备注" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="商品分类" prop="classId">
              <el-cascader
                v-model="form.classId"
                :options="options"
                :props="SetKesDept"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-col>

          <el-col :span="18">
            <div v-for="(item, index) in form.dynamicItem" :key="index">
              <el-form-item
                label="规格值"
                :prop="'dynamicItem.' + index + '.value'"
                :rules="{
                    required: true, message: '规格值不能为空', trigger: 'blur'
                 }"
                class="itemForm"
              >
                <el-input
                  v-model="item.value"
                  style="width:220px"
                  oninput="this.value=this.value.replace(/\s+/g,'')"
                ></el-input>
                <el-button
                  icon="el-icon-plus"
                  type="text"
                  size="small"
                  @click="addMak"
                  class="addText"
                  v-if="index===0"
                >添加规格值</el-button>
                <i v-else class="el-icon-delete deleteBtn" @click="deleteItem(item, index)"></i>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="18">
            <el-form-item label="规格排序" prop="sort">
              <el-input
                v-model="form.sort"
                placeholder="请输入规格排序"
                style="width:220px"
                oninput="this.value=this.value.replace(/[^0-9]/g,'')"
              />
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
import { getClassifyTree, getClassifyDetail } from '../../../api/business/index';

import {
  getMarket,
  addMarket,
  updSort,
  delMarket,
  getMarketDetail,
  updMarket
} from '../../../api/marketSpec/index';
export default {
  data() {
    return {
      value: [],
      SetKesDept: {
        value: 'id',
        label: 'name',
        children: 'subclass'
      },
      title: '',
      orderList: [],
      marketList: [],
      open: false,
      loading: false,
      queryParam: {
        pageNum: 1,
        pageSize: 20,
        name: undefined,
        classId: undefined
      },
      form: {
        dynamicItem: [{ value: '' }],
        delId: [],
        name: '',
        remark: '',
        sort: '',
        classId: '',
        values: ''
      },
      total: 0,
      statusOptions: [
        {
          id: 0,
          value: '待停业'
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
      options: [],
      rules: {
        name: [
          { required: true, message: '规格名称不能为空', trigger: 'blur' }
        ],
        classId: [
          { required: true, message: '商品分类不能为空', trigger: 'blur' }
        ]
      },
      clieHeight: null
    };
  },
  created() {
    if (this.$route.query.id) {
      this.classId = this.$route.query.id;
      this.queryParam.classId = this.$route.query.id;
      this.getClassifyDetail();
    }

    this.getList();
    this.getMarketList();
  },
  mounted() {
    this.clieHeight = window.innerHeight - 350;
  },
  methods: {
    addMak() {
      console.log(this.form.dynamicItem);

      this.form.dynamicItem.push({
        value: ''
      });
    },
    getClassifyDetail() {
      getClassifyDetail({ id: this.classId }).then(res => {
        if (res.code === 200) {
          this.treeText = res.data.name;
        }
      });
    },
    deleteItem(item, index) {
      this.form.dynamicItem.splice(index, 1);
      console.log(this.form);

      console.log(this.form.delId);
      this.form.delId.push(item.id);
    },
    handleAdd(row) {
      this.resetQuery();
      // this.getList();
      if (row != null) {
        this.form.classId = row.id;
      }
      this.open = true;
      this.title = '添加规格';
      this.form = {
        dynamicItem: [{ value: '' }],
        name: '',
        remark: '',
        sort: '',
        classId: '',
        values: '',
        delId: []
      };
    },
    getList() {
      this.loading = false;
      getClassifyTree({ status: 0 }).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.options = res.data;
          this.options.forEach((item) => {
            item.subclass.forEach((itemTwo) => {
              if (!itemTwo.subclass) {
                itemTwo.disabled = true;
              }
            });
          });
        }
      });
    },
    getMarketList() {
      getMarket(this.queryParam).then(res => {
        if (res.code === 200) {
          this.marketList = res.data.list;
          this.total = res.data.total;
        }
      });
    },
    handleChange(value) {
      console.log(value, '00000000');
    },
    sortChange(row) {
      console.log(row);
      updSort(row.id, row.sort).then(res => {
        if (res.code === 200) {
          this.msgSuccess('修改成功');
          console.log(res);
          this.getMarketList();
        }
      });
    },
    handleQuery() {
      if (this.queryParam.classId !== undefined) {
        this.queryParam.classId = this.queryParam.classId[this.queryParam.classId.length - 1];
        this.getMarketList();
      } else {
        this.getMarketList();
      }
    },
    resetQuery() {
      this.queryParam = {
        pageNum: 1,
        pageSize: 20,
        name: undefined,
        classId: this.classId
      };
      this.getMarketList();
    },

    handleEdit(row) {
      let that = this;
      // this.resetQuery();
      this.getList();
      console.log(row);
      this.title = '修改规格';
      console.log(that.form.dynamicItem);
      getMarketDetail({ id: row.id }).then(response => {
        console.log(response.data);
        this.open = true;
        this.form.id = row.id;
        this.form.name = row.name;

        this.form.sort = row.sort;
        this.form.remark = row.remark;
        this.form.classId = response.data.classId;

        var item = [];
        for (let i = 0; i < response.data.marketSpecValues.length; i++) {
          item.push({
            value: response.data.marketSpecValues[i].value,
            id: response.data.marketSpecValues[i].id
          });
        }

        that.form.dynamicItem = item;
      });
    },
    handleDelete(item) {
      const that = this;
      console.log(item);

      this.$confirm('是否确认删除该规格吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return delMarket({ id: Number(item.id) }).then(res => {
            if (res.code === 200) {
              that.getMarketList();
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
    sameArr(arrOne, arrTwo) {
      return arrOne.filter(item => {
        return (
          arrTwo.findIndex(subItem => {
            return subItem.id == item.id;
          }) === -1
        );
      });
    },

    submitForm() {
      this.$refs['form'].validate(valid => {
        console.log('------', this.form);
        if (valid) {
          if (this.form.id !== undefined) {
            var date = [];

            for (let i in this.form.dynamicItem) {
              if (this.form.dynamicItem[i].id !== undefined) {
                date.push({
                  value: this.form.dynamicItem[i].value,
                  id: this.form.dynamicItem[i].id
                });
              }
            }

            var a = this.sameArr(this.form.dynamicItem, date);

            var spit = [];

            for (let i in a) {
              spit.push(a[i].value);
            }
            console.log(spit);

            updMarket({
              id: this.form.id,
              name: this.form.name,
              remark: this.form.remark,
              sort: this.form.sort,
              classId: this.form.classId[this.form.classId.length - 1],
              upd: date,
              del: this.form.delId.join(','),
              values: spit.join(',')
            }).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功');
                this.open = false;
                this.getMarketList();
              } else {
                this.msgError(response.message);
              }
            });
          } else {
            var dates = [];

            for (let i in this.form.dynamicItem) {
              dates.push(this.form.dynamicItem[i].value);
            }
            console.log(dates);

            addMarket({
              name: this.form.name,
              remark: this.form.remark,
              sort: this.form.sort,
              classId: this.form.classId[this.form.classId.length - 1],
              values: dates.join(',')
            }).then(response => {
              if (response.code === 200) {
                this.msgSuccess('新增成功');
                this.open = false;
                this.getMarketList();
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
    }
  }
};
</script>
<style lang="scss" scoped>
.addText {
  // margin-bottom: 10px;
}
.addBtn {
  text-align: left;
  padding-bottom: 15px;
  padding-top: 15px;
}
.deleteBtn {
  display: inline-block;
  margin-left: 10px;
  position: absolute;
  top: 10px;
  cursor: pointer;
}
.itemForm {
}
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
  min-height: 430px;
  padding-left: 15px;
  padding-right: 15px;
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
.slot {
  color: #409eff;
}
.el-form-item__error {
  left: 0;
}
</style>
