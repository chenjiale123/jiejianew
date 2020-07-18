<template>
  <div id="wangeditor">
    <div ref="editorElem" style="text-align:left"></div>
  </div>
</template>
<script>
import E from 'wangeditor';
import Cookies from 'js-cookie';
import Bus from '../../utils/bus';
export default {
  data() {
    return {
      editor: null,
      editorContent: ''
    };
  },
  props: ['content'],
  watch: {
    content() {
      console.log('222');
      this.editor.txt.html(this.content);
    }
  },

  mounted() {
    const that = this;
    this.editor = new E(this.$refs.editorElem);
    Bus.$on('listenToA', (e) => {
      if (e) {
        that.editor.txt.html(this.content);
      }
    });
    this.editor.customConfig.onchange = (html) => {
      this.editorContent = html;
      // that.catchData=this.editorContent; // 把这个html通过catchData的方法传入父组件
      //  this.$emit("catchData",this.editorContent);
      this.$emit('update:catchData', this.editorContent);
    };
    this.editor.customConfig.pasteIgnoreImg = true;
    this.editor.customConfig.uploadImgServer = '/api/common/uploadOfRichText?fileType=' + 2 + '&moduleType=' + 1;
    // this.editor.customConfig.uploadImgParamsWithUrl = true; // 如果还需要将参数拼接到 url 中
    this.editor.customConfig.uploadFileName = 'files';
    this.editor.customConfig.uploadImgHeaders = {
      'Authentication': Cookies.get('token')
    };
    this.editor.customConfig.uploadImgHooks = {
      before: function (xhr, editor, files) {
        // 图片上传之前触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件

        // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
        // return {
        //     prevent: true,
        //     msg: '放弃上传'
        // }
        // console.log(xhr, editor, files);
      },
      success: function (xhr, editor, result) {
        console.log(result);
        // 图片上传并返回结果，图片插入成功之后触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        // console.log('8989', result);
        this.imgUrl = Object.values(result.data.data).toString();
      },
      fail: function (xhr, editor, result) {
        var res = xhr.data;
        console.log(res);
        // 图片上传并返回结果，但图片插入错误时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
      },
      error: function (xhr, editor) {

        // 图片上传出错时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
      },
      customInsert: function (insertImg, result, editor) {
        // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

        console.log(result);
        if (result.code === '500') {
          that.$message(result.message);
          return;
        }

        let url = Object.values(result.data.data); // result.data就是服务器返回的图片名字和链接
        JSON.stringify(url); // 在这里转成JSON格式

        url.forEach((item) => {
          insertImg(item);
        });

        // result 必须是一个 JSON 格式字符串！！！否则报错
      }
    };

    // this.editor.customConfig.debug = true;
    this.editor.create(); // 创建富文本实例
  }

};
</script>
<style lang='scss'  scoped>
</style>
