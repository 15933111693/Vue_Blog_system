<template>
  <div class="userManager">
    <!-- 搜索框 -->
    <div class="search">
      <div style="width:50vw ">
        <el-input placeholder="请输入内容" v-model="searchText" :clearable="true">
          <el-select v-model="searchItem" ref="select" slot="prepend" placeholder="请选择搜索标题">
            <el-option
              v-for="searchItem in searchItemArray"
              :key="searchItem.value"
              :label="searchItem.label"
              :value="searchItem.value">
            </el-option>
          </el-select>
          <el-button @click="search(1,10)" slot="append" icon="el-icon-search"></el-button>
      </el-input>
      </div>
    </div>

    <!-- 用户列表 -->
    <div class="cards">
      <el-row :gutter="20">
        <el-col v-for="data of theFirstData" :key="data.main.id" :span="6" :xs="24" >
          <el-card class="card">
            <div slot="header" class="clearfix">
              <el-button v-if="data.status != 'main'" @click="toMain(data)" type="primary" size="mini" icon="el-icon-more" circle></el-button>
              <el-button v-if="data.status != 'mobile' && data.mobile != undefined" @click="toMobile(data)" type="primary" size="mini" icon="el-icon-phone" circle></el-button>
              <el-button v-if="data.status != 'email' && data.email != undefined" @click="toEmail(data)" type="primary" size="mini" icon="el-icon-message" circle></el-button>

              <div style="float: right">
                <el-button v-if="data.editStatus" @click="saveUserInfo(data)" type="warning" size="mini" plain>保存</el-button>
                <el-button v-if="data.editStatus" @click="cancelEdit(data)" type="danger" size="mini" plain>取消</el-button>
                <el-button v-if="!data.editStatus" type="warning" size="mini" icon="el-icon-setting" circle @click="edit(data)"></el-button>
                <el-button @click="delUser(data)" type="danger" size="mini" icon="el-icon-delete" circle></el-button>
              </div>
            </div>
            <div class="card_main">
              <div class="card_avatar" @click="uploadId(data.main.id)">
                <el-upload 
                  :show-file-list="false"
                  :action="''"
                  :before-upload="beforeUpload"
                  :http-request="upload"
                >
                  <img style="width:70px;height:70px;border-radius:50%" :src="data.main.avatar" />
                </el-upload>
                
              </div>
              <div class="card_userInfo">
                <div class="card_userInfo_left">
                  <div v-if="data.status === 'main'">昵称</div>
                  <div v-if="data.status === 'main'">介绍</div>
                  <div v-if="data.status === 'mobile'">手机账号</div>
                  <div v-if="data.status === 'mobile'">手机密码</div>
                  <div v-if="data.status === 'email'">邮箱账号</div>
                  <div v-if="data.status === 'email'">邮箱密码</div>
                  <div v-if="data.status === 'main'">id</div>
                </div>
                <div class="card_userInfo_right">
                  <div v-if="data.status === 'main'" class="card_userInfo_right_content">
                    <div v-if="!data.editStatus">{{ data.main.name }}</div>
                    <el-input v-if="data.editStatus" v-model="data.main.name" placeholder=""></el-input>
                  </div>
                  <div v-if="data.status === 'main'" class="card_userInfo_right_content">
                    <div v-if="!data.editStatus">{{ data.main.introduce }}</div>
                    <el-input v-if="data.editStatus" v-model="data.main.introduce" placeholder=""></el-input>
                  </div>
                  <div v-if="data.status === 'mobile'">{{ data.mobile === undefined ? '' : data.mobile.account }}</div>
                  <div v-if="data.status === 'mobile'" class="card_userInfo_right_content">
                    <div v-if="!data.editStatus">{{ data.mobile === undefined ? '' : data.mobile.credential }}</div>
                    <el-input v-if="data.editStatus" v-model="data.mobile.credential" placeholder=""></el-input>
                  </div>
                  <div v-if="data.status === 'email'">{{ data.email === undefined ? '' : data.email.account }}</div>
                  <div v-if="data.status === 'email'" class="card_userInfo_right_content">
                    <div v-if="!data.editStatus">{{ data.email === undefined ? '' : data.email.credential }}</div>
                    <el-input v-if="data.editStatus" v-model="data.email.credential" placeholder=""></el-input>
                  </div>
                  <div v-if="data.status === 'main'" style="font-size:10px;height:20px;line-height:20px">{{ data.main.id }}</div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col v-for="data of theSecoundData" :key="data.main.id" :span="6" :xs="24" >
          <el-card class="card">
            <div slot="header" class="clearfix">
              <el-button v-if="data.status != 'main'" @click="toMain(data)" type="primary" size="mini" icon="el-icon-more" circle></el-button>
              <el-button v-if="data.status != 'mobile' && data.mobile != undefined" @click="toMobile(data)" type="primary" size="mini" icon="el-icon-phone" circle></el-button>
              <el-button v-if="data.status != 'email' && data.email != undefined" @click="toEmail(data)" type="primary" size="mini" icon="el-icon-message" circle></el-button>

              <div style="float: right">
                <el-button v-if="data.editStatus" @click="saveUserInfo(data)" type="warning" size="mini" plain>保存</el-button>
                <el-button v-if="data.editStatus" @click="cancelEdit(data)" type="danger" size="mini" plain>取消</el-button>
                <el-button v-if="!data.editStatus" type="warning" size="mini" icon="el-icon-setting" circle @click="edit(data)"></el-button>
                <el-button @click="delUser(data)" type="danger" size="mini" icon="el-icon-delete" circle></el-button>
              </div>
            </div>
            <div class="card_main">
              <div class="card_avatar" @click="uploadId(data.main.id)">
                <el-upload 
                  :show-file-list="false"
                  :action="''"
                  :before-upload="beforeUpload"
                  :http-request="upload"
                >
                  <img style="width:70px;height:70px;border-radius:50%" :src="data.main.avatar" />
                </el-upload>
                
              </div>
              <div class="card_userInfo">
                <div class="card_userInfo_left">
                  <div v-if="data.status === 'main'">昵称</div>
                  <div v-if="data.status === 'main'">介绍</div>
                  <div v-if="data.status === 'mobile'">手机账号</div>
                  <div v-if="data.status === 'mobile'">手机密码</div>
                  <div v-if="data.status === 'email'">邮箱账号</div>
                  <div v-if="data.status === 'email'">邮箱密码</div>
                  <div v-if="data.status === 'main'">id</div>
                </div>
                <div class="card_userInfo_right">
                  <div v-if="data.status === 'main'" class="card_userInfo_right_content">
                    <div v-if="!data.editStatus">{{ data.main.name }}</div>
                    <el-input v-if="data.editStatus" v-model="data.main.name" placeholder=""></el-input>
                  </div>
                  <div v-if="data.status === 'main'" class="card_userInfo_right_content">
                    <div v-if="!data.editStatus">{{ data.main.introduce }}</div>
                    <el-input v-if="data.editStatus" v-model="data.main.introduce" placeholder=""></el-input>
                  </div>
                  <div v-if="data.status === 'mobile'">{{ data.mobile === undefined ? '' : data.mobile.account }}</div>
                  <div v-if="data.status === 'mobile'" class="card_userInfo_right_content">
                    <div v-if="!data.editStatus">{{ data.mobile === undefined ? '' : data.mobile.credential }}</div>
                    <el-input v-if="data.editStatus" v-model="data.mobile.credential" placeholder=""></el-input>
                  </div>
                  <div v-if="data.status === 'email'">{{ data.email === undefined ? '' : data.email.account }}</div>
                  <div v-if="data.status === 'email'" class="card_userInfo_right_content">
                    <div v-if="!data.editStatus">{{ data.email === undefined ? '' : data.email.credential }}</div>
                    <el-input v-if="data.editStatus" v-model="data.email.credential" placeholder=""></el-input>
                  </div>
                  <div v-if="data.status === 'main'" style="font-size:10px;height:20px;line-height:20px">{{ data.main.id }}</div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 分页 -->
    <div class="pageFooter">
      <el-pagination
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page.sync="currentPage"
      ></el-pagination>
    </div>
  </div>
</template>

<script>

export default {
  name: 'userManager',
  data() {
    return {
      searchText: '',
      searchItem: '',
      searchItemArray: [
        {value: 'RoleName', label: '权限名称'},
        {value: 'Q', label: '用户信息'}
      ],
      searchStatus: false,
      
      // 用户信息
      data: [],
      imgUserId: '',
      
      // 编辑的唯一性
      uniqueness: null,

      // 分页
      pageSize: 8,
      total: 0,
      currentPage: 1
      // previousPageLink: null,
      // nextPageLink: null
    }
  },
  computed: {
    theFirstData() {
      const data = this.data.slice(0,4)
      return data
    },
    theSecoundData() {
      const data = this.data.slice(4,8)
      return data
    }
  },
  watch: {
    async currentPage(newVal) {
      if(this.searchStatus) await this.search(newVal, this.pageSize)
      else await this.init(newVal)
    }
  },
  async created() {
    await this.init(this.currentPage)
  },
  mounted() {
    this.$nextTick(() => {
      if(this.$refs.select) this.$refs.select.$el.style.minWidth = '150px' // 设置搜索栏宽度
    })
  },
  methods: {
    async init(currentPage) {
      const res = await this.getUserInfo(currentPage, this.pageSize)

      // 用户信息
      this.data = []
      const mainInfos = res.data
      for (let mainInfo of mainInfos) {
        const userInfo = { status: 'main', main: mainInfo, editStatus: false }

        const id = mainInfo.id
        const adminInfo = await this.$http.get(`/api/users/${id}/userAuthes`)
        for (let info of adminInfo) {
          if (info.authType === 1) userInfo.mobile = info
          if (info.authType === 2) userInfo.email = info
        }

        this.data.push(userInfo)
      }

      // 页码设置
      const pageConfig = JSON.parse(res.headers['x-pagination'])
      this.total = pageConfig.totalCount
      this.currentPage = pageConfig.currentPage
      // 上一页请求链接和下一页请求链接
      // this.previousPageLink = pageConfig.previousPageLink
      // this.nextPageLink = pageConfig.nextPageLink
    },
    async getUserInfo(currentPage, pageSize) {
      const res = await this.$axios.get('https://localhost:5001/api/users', {
        headers: {
          Authorization: localStorage.token
        },
        params: {
          PageNumber: String(currentPage),
          PageSize: String(pageSize)
        }
      })
      return res
    },
    toMain(data) {
      this.cancelEdit(this.uniqueness)
      data.status = 'main'
    },
    toMobile(data) {
      this.cancelEdit(this.uniqueness)
      data.status = 'mobile'
    },
    toEmail(data) {
      this.cancelEdit(this.uniqueness)
      data.status = 'email'
    },
    edit(data) {
      if(!this.uniqueness) {
        this.uniqueness = data
      }else {
        this.cancelEdit(this.uniqueness)
        this.uniqueness = data
      }
      this.uniqueness.editData = {}
      const mapData = this.uniqueness[this.uniqueness.status]
      for(let i in mapData) {
        this.uniqueness.editData[i] = mapData[i]
      }
      this.uniqueness.editStatus = true
    },
    async saveUserInfo(data) {
      const statusHash = {
        main: async () => {
          const nickName = data.main.name
          const introduce = data.main.introduce
          const nickNameRes = await this.$http.put(`/api_site/userinfo/${data.main.id}/nickName?nickName=${nickName}`)
          const introduceRes = await this.$http.put(`/api_site/userinfo/${data.main.id}/introduce?introduce=${introduce}`)
          return true
        },
        mobile: async () => {
          const postData = {
            "account": data.mobile.account,
            "credential": data.mobile.credential,
            "authType": 1
          }
          const res = await this.$http.put(`/api/users/${data.mobile.userId}/userAuthes/${data.mobile.id}`, postData)
          return true
        },
        email: async () => {
          const postData = {
            "account": data.email.account,
            "credential": data.email.credential,
            "authType": 2
          }
          const res = await this.$http.put(`/api/users/${data.email.userId}/userAuthes/${data.email.id}`, postData)
          return true
        }
      }

      const res = await statusHash[data.status]()
      if(res) {
        await this.init(this.currentPage)
        this.$message({
          type: 'success',
          message: '修改成功'
        })
      }else {
        this.$message.error('修改失败')
      }
    },
    cancelEdit(data) {
      if(!this.uniqueness) return
      this.uniqueness.editStatus = false
      this.uniqueness[this.uniqueness.status] = null
      this.uniqueness[this.uniqueness.status] = this.uniqueness.editData
      delete this.uniqueness.editData
      if(this.uniqueness.main.id === data.main.id) this.uniqueness = null
    },
    async delUser(data) {
      this.$confirm(`确定删除 ${data.main.name} 用户?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.$http.delete(`/api/users/${data.main.id}`)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          await this.init(this.currentPage)
        })
    },
    async search(currentPage, pageSize) {
      if(!this.searchItem) {
        this.$message({
          type: 'warning',
          message: '请选择搜索标题'
        })
        return
      }

      const params = {
        PageNumber: String(currentPage),
        PageSize: String(pageSize)
      }

      params[this.searchItem] = this.searchText

      const res = await this.$axios.get('https://localhost:5001/api/users', {
        headers: {
          Authorization: localStorage.token
        },
        params: params
      })

      // 用户信息
      this.data = []
      const mainInfos = res.data
      for (let mainInfo of mainInfos) {
        const userInfo = { status: 'main', main: mainInfo, editStatus: false }

        const id = mainInfo.id
        const adminInfo = await this.$http.get(`/api/users/${id}/userAuthes`)
        for (let info of adminInfo) {
          if (info.authType === 1) userInfo.mobile = info
          if (info.authType === 2) userInfo.email = info
        }

        this.data.push(userInfo)
      }

      // 页码设置
      const pageConfig = JSON.parse(res.headers['x-pagination'])
      this.total = pageConfig.totalCount
      this.currentPage = pageConfig.currentPage
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
    async upload(req) {
      const formData = new FormData()
      formData.append('file', req.file)

      const res = await this.$axios.post(`https://localhost:5001/api_common/users/${this.imgUserId}/file`, formData, {
        headers: {
          Authorization: localStorage.token,
          'Content-Type': 'multipart/form-data'
        }
      })
      this.imgUserId = ''
      if(res) {
        await this.init(this.currentPage)
      }

      return res
    },
    uploadId(id) {
      this.imgUserId = id
    }
  }
}
</script>

<style scoped>
.userManager {
  width: 100%;
  min-height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
}
/* 搜索栏 */
.search {
  height: 10vh;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
}

/* 用户列表 */
.cards {
  min-height: calc(70vh - 50px);
  padding: 0 20px;
}

.card_avatar {
  display: flex;
  justify-content: center;
}

.card_avatar > div {
  width: 70px;
  height: 70px;
  border-radius: 50%;
}

.card_userInfo {
  display: flex;
  color: #ccc;
  font-size: 18px;
  font-weight: 500;
}

.card_userInfo_left > div, .card_userInfo_right > div{
  margin-top: 5px;
  min-width: 80px;
}

.card_userInfo_right {
  margin-left: 5px;
}

.card_userInfo_right_content {
  display: flex;
}

/* 分页 */
.pageFooter {
  height: 10vh;
  display: flex;
  justify-content: center;
}
</style>

<style>
.el-col {
  margin-top: 20px;
}
.el-card__header {
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 10px;
  padding-right: 10px;
}
.card_userInfo_right_content > div > input {
  height: 20px;
}
</style>