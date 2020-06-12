<template>
  <div class="barner">
    <div class="barner_table">
      <el-table :data="tableData" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="picture" label="图片">
          <template slot-scope="scope">
            <img width="50px" height="50px" :src="scope.row.picture">
          </template>
        </el-table-column>
        <el-table-column prop="url" label="链接"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="50">
          <template slot-scope="scope">
            <el-button @click="del(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="barner_add">
      <el-button type="primary" @click="add" icon="el-icon-plus" :round="true"></el-button>
    </div>
    
    <div class="barner_pop">
      <el-dialog
        title="新增barner"
        :visible.sync="dialogVisible"
        width="30%"
        >
        <div class="dialog_content">
          <el-upload
            class="upload-demo"
            action="''"
            :limit="1"
            :http-request="upload"
            :before-upload="beforeUpload"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>

          <el-input v-model="url" placeholder="链接"></el-input>
          <el-input v-model="remark" placeholder="备注"></el-input>
        </div>
        
        
        
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>


export default {
  name: 'Barne',
  data() {
    return {
      // tableData
      tableData: [],

      // dialog
      dialogVisible: false,
      imageFile: null,
      url: '',
      remark: ''
    }
  },
  async created() {
    await this.init()
  },
  methods: {
    // 请求列表数据
    async init() {
      const res = await this.$http.get('/api/banner')
      this.tableData = res
    },

    // table
    async del(data) {
      const res = await this.$http.delete(`/api/banner/${data.id}`)
      this.$message({
        type: 'success',
        message: '删除成功'
      })
      await this.init()
    },

    // dialog
    add() {
      this.dialogVisible = true
    },
    upload(req) {
      this.imageFile = req.file
    },
    beforeUpload(file){
       const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
    },
    async submit() {
      const warningMessage = m => {
        this.$message({
          type: 'warning',
          message: m
        })
      }
      if(!this.imageFile) {
        warningMessage('请传入图片')
        return  
      }
      if(!this.url) {
        warningMessage('请输入url')
        return  
      }
      if(!this.remark) {
        warningMessage('请输入备注')
        return
      }

      const formData = new FormData()
      formData.append('file', this.imageFile)
      formData.append('url', this.url)
      formData.append('remark', this.remark)

      const res = await this.$axios.post(`https://localhost:5001/api/banner`, formData, {
        headers: {
          Authorization: localStorage.token,
          'Content-Type': 'multipart/form-data'
        }
      })
      if(res) {
        this.$message({
          type: 'success',
          message: '增加成功!'
        })
        await this.init()
      }

      dialogVisible = false
    }
  }
}
</script>

<style scoped>
  /* .barner {
    margin-top: 10px;
  } */

  .barner_add {
    position: fixed;
    bottom: 10%;
    right: 5%;
  }
  .barner_add > button {
    border-radius: 50%;
    padding: 15px;
  }

  .dialog_content > div {
    margin-top: 10px;
  }
</style>
