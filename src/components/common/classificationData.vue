<template>
  <div class="daiLog">
    <div class="head-input">
      <el-input
        v-model="filterText"
        placeholder="请输入部门名称"
        clearable
        size="small"
        prefix-icon="el-icon-search"
        style="margin-bottom: 20px"
        @clear="clearInput"
      />
    </div>
    <div class="head-tree">
      <el-tree
        :data="classOptions"
        :props="defaultProps"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        node-key="code"
        ref="tree"
        :highlight-current="true"
        default-expand-all
        @node-click="handleNodeClick"
      />
    </div>
  </div>
</template>
<script>
import { getClassifyTree } from '../../api/business/index';
export default {
  data() {
    return {
      filterText: '',
      classOptions: [],
      defaultProps: {
        children: 'subclass',
        label: 'name'
      }
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    getClassifyTree().then((res) => {
      if (res.code === 200) {
        this.classOptions = res.data;
      }
    });
  },
  methods: {
    clearInput() { },
    handleNodeClick(node, data) {
      const trees = this.$refs.tree.getNode(data);
      console.log(node, data);
      console.log('当前选择的是', this.classOptions[0].name + data.parent.data.name + node.name);
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    }
  }
};
</script>
<style lang="scss" scoped>
.daiLog {
  width: 500px;
}
</style>
