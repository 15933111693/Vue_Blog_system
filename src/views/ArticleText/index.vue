<template>
  <div class="articleText">
    <MyPageTable
      :showSwitch="true"
      :search.sync="search"
      :searchItem.sync="searchItem"
      :searchItemArray="searchItemArray"
      :tableData="tableData"
      :columns="columns"
      :total="total"
      :pageSize="10"
      :table_button_width="150"
      @topage="topage"
      @del="del"
      @submit="submit(1,10)"
    >
      <template #table_switch="{ scope }" >
        <el-switch @change="change(scope.row)"  v-model="scope.row.state" active-color="#13ce66" inactive-color="#ff4949" :width="35"></el-switch>
      </template>
      <template #table_button="{ scope }">
        <el-button type="text" @click="$router.push(`/admin/article/articleComment?articleId=${scope.row.articleId}`)">查看评论</el-button>
      </template>
    </MyPageTable>
  </div>
</template>

<script>
import MyPageTable from '../../components/MyTablePage/index'

export default {
  name: 'articleText',
  components: {
    MyPageTable
  },
  data() {
    return {
      // 搜索
      search: '',
      searchItem: '',
      searchItemArray: [
        {
          value: 'UserName',
          label: '用户'
        },
        {
          value: 'CategoryName',
          label: '分类'
        },
        {
          value: 'TagName',
          label: '标签'
        },
        {
          value: 'Q',
          label: '文章'
        }
      ],
      searchStatus: false,

      // table
      tableData: [],
      columns: [
        { id: 'articleId', label: 'ID', sortable: false },
        { id: 'aticleTitle', label: '文章标题', sortable: false },
        { id: 'userName', label: '文章作者', sortable: false },
        { id: 'tags', label: '文章标签', sortable: false },
        { id: 'star', label: '点赞数量', sortable: false },
        { id: 'createTime', label: '发表时间', sortable: false },
        { id: 'modifyTime', label: '修改时间', sortable: false },
        { id: 'categoryName', label: '分类', sortable: false }
      ],

      // 分页
      total: 0,
      currentPage: 1,
      pageSize: 10
    }
  },
  async created() {
    await this.init()
  },
  methods: {
    async init() {
      const res = await this.getData(this.currentPage, this.pageSize)

      const tableData = res.data
      for(let data of tableData) {
        let tags = ''
        for(let tag of data.tags) {
          tags += tag.name + ' '
        }
        data.del = true
        data.tags = tags
      }
      this.tableData = tableData

      const pageConfig = JSON.parse(res.headers['x-pagination'])
      this.total = pageConfig.totalCount
      this.currentPage = pageConfig.currentPage
    },
    async getData(currentPage, pageSize) {
      const res = await this.$axios.get('https://localhost:5001/api_assessor/article', {
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
    async topage(val) {
      this.currentPage = val
      if(this.searchStatus) await this.submit(this.currentPage, this.pageSize)
      else await this.init()
    },
    async change(data) {
      const articleId = data.articleId
      const res = await this.$http.put(`/api/article/${articleId}/state`)
    },
    async del(index) {
      const data = this.tableData[index]
      const articleId = data.articleId
      const res = await this.$http.delete(`/api_creator/article/${articleId}`)
      await this.init()
      this.$message({
        type: 'succcess',
        message: '删除成功!'
      })
    },
    async submit(currentPage, pageSize) {
      const params = {
        PageNumber: String(currentPage),
        PageSize: String(pageSize),
      }
      
      params[this.searchItem] = this.search

      const res = await this.$axios.get('https://localhost:5001/api_assessor/article', {
        headers: {
          Authorization: localStorage.token
        },
        params: params
      })

      const tableData = res.data
      for(let data of tableData) {
        let tags = ''
        for(let tag of data.tags) {
          tags += tag.name + ' '
        }
        data.del = true
        data.tags = tags
      }
      this.tableData = tableData

      const pageConfig = JSON.parse(res.headers['x-pagination'])
      this.total = pageConfig.totalCount
      this.currentPage = pageConfig.currentPage

      if(!this.searchItem && search == '') this.searchStatus = false
      else this.searchStatus = true
    }
  }
}
</script>

<style scoped>
.articleText {
  margin-top: 10px;
}
</style>