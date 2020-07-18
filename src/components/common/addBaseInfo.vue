<template>
  <div class="baseInfo">
    <el-steps :active="active" :align-center="true" status="finish">
      <el-step title="基本信息"></el-step>
      <el-step title="业务规格"></el-step>
      <el-step title="图文描述"></el-step>
    </el-steps>
  </div>
</template>
<script>
export default {
  props: ['active'],
  data() {
    return {

    };
  }
};
</script>
<style lang="scss" scoped>
.baseInfo {
  padding: 30px 0;
  width: 600px;
  margin: auto;

  /deep/ .el-step__title {
    font-size: 14px;
    color: #666;
  }
}
</style>
