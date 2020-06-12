<template>
  <div class="editorPage">
    <!-- 文章标题 -->
    <div class="item">
      <el-input v-model="i_item" placeholder="请填写文章标题" :clearable="true"></el-input>
    </div>

    <!-- 封面上传 -->
    <div class="upload">
      <el-upload
        class="avatar-uploader"
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>

    <!-- editor -->
    <div ref="editor" class="editor">
    </div>

    <!-- 底部按钮 -->
    <div class="button">
      <!-- 标签 -->
      <el-tag
        :key="tag"
        v-for="tag in dynamicTags"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)">
        {{tag}}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="inputVisible"
        v-model="inputValue"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput">新标签</el-button>

      
      <div style="float:right;">
        <!-- 分类 -->
        <el-select v-if="classifys.length" v-model="i_classify" placeholder="分类">
          <el-option
            v-for="classify in classifys"
            :key="classify.value"
            :label="classify.label"
            :value="classify.value">
          </el-option>
        </el-select>

        <!-- 提交 -->
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Editor from '../../../node_modules/wangeditor'

export default {
  name: 'editorpage',
  props: {
    classifys: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 标题
      i_item: '',
      
      // 封面图片
      imageUrl: '',

      // 富文本编辑器
      editorContent: '',

      // 底部按钮
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      i_classify: '',
    }
  },
  watch: {
  },
  mounted() {
    this.initEditor()
  },
  methods: {
    // 封面图片上传
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/*';
      // const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!');
      // }
      // return isJPG && isLt2M;
    },

    // 富文本编辑器
    initEditor() {
      const editor = new Editor(this.$refs.editor)
      editor.customConfig.onchange = (html) => {
        this.editorContent = html
      }
      editor.create()
    },

    // 底部按钮
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },

    submit() {
      const data = {
        item: this.i_item,
        imageUrl: this.imageUrl,
        editorContent: this.editorContent,
        tags: this.dynamicTags,
        classify: this.i_classify,
      }
      this.$emit(submit,data)
    }
  }
}
</script>

<style scoped>
  /* 标题 */
  .item {
    width: 50vw;
  }

  /* 上传封面 */
  .upload {
    margin: 10px 0;
  }

  /* button */
  .button {
    margin-top: 10px;
  }
</style>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>