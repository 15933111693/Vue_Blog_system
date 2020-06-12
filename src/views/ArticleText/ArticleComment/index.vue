<template>
  <div class="articleComment">
    <MyPageTable
      :showSearch="showSearch"
      :search.sync="search"
      :searchItem.sync="searchItem"
      :searchItemArray="searchItemArray"
      :tableData="tableData"
      :columns="columns"
      :total="total"
      :pageSize="pageSize"
      :table_button_width="50"
      @del="del"
      @submit="submit(1, 10)"
    ></MyPageTable>
  </div>
</template>

<script>
import MyPageTable from '../../../components/MyTablePage/index'
export default {
  name: 'articleComment',
  components: {
    MyPageTable
  },
  data() {
    return {
      // 搜索
      showSearch: true,
      search: '',
      searchItem: '',
      searchItemArray: [
        { value: 'Q', label: '文章内容' }
      ],
      searchStatus: false,

      // 表格
      tableData: [],
      columns: [
        {id: 'content', label: '评论内容', sortable: false},
        {id: 'userName', label: '评论人', sortable: false},
        {id: 'articleTitle', label: '评论文章', sortable: false},
        {id: 'createTime', label: '评论时间', sortable: false}
      ],

      // 分页
      total: 0,
      currentPage: 1,
      pageSize: 10
    }
  },
  beforeRouteUpdate (to, from, next) {
    if(!to.query.articleId) {
      this.tableData = []
      this.showSearch = false
    }
    next()
  },
  async created() {
    if(this.$route.query.articleId) await this.init()
  },
  methods: {
    async init() {
      const res = await this.getData(this.currentPage, this.pageSize, this.$route.query.articleId)

      const tableData = res.data
      for(let data of tableData) {
        data.del = true
      }
      this.tableData = tableData

      const pageConfig = JSON.parse(res.headers['x-pagination'])
      this.total = pageConfig.totalCount
      this.currentPage = pageConfig.currentPage
    },
    async getData(currentPage, pageSize, articleId) {
      const res = await this.$axios.get(`https://localhost:5001/api/article/${articleId}/comment`, {
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
    async del(index) {
      const comment = this.tableData[index]
      const articleId = comment.articleId
      const commentId = comment.id
      const res = await this.$http.delete(`/api/article/${articleId}/comment/${commentId}`)
      await this.init()
      this.$message({
        type: 'success',
        message: '删除成功'
      })
    },
    async submit(currentPage, pageSize) {
      const params = {
        PageNumber: String(currentPage),
        PageSize: String(pageSize),
      }

      params[this.searchItem] = this.search
      
      const articleId = this.$route.query.articleId
      const res = await this.$axios.get(`https://localhost:5001/api/article/${articleId}/comment`, {
        headers: {
          Authorization: localStorage.token
        },
        params: params
      })

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
.articleComment {
  margin-top: 10px;
}
</style>