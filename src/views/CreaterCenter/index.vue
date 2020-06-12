<template>
  <div class="createrCenter">
    <MyPageTable
      :search.sync="search"
      :searchItem.sync="searchItem"
      :searchItemArray="searchItemArray"
      :tableData="tableData"
      :columns="columns"
      :total="total"
      :pageSize="10"
      :table_button_width="100"
      @topage="topage"
    >

    </MyPageTable>
  </div>
</template>

<script>
import MyPageTable from '../../components/MyTablePage/index'
export default {
  name: 'createrCenter',
  components: {
    MyPageTable
  },
  data() {
    return {
      // 搜索
      search: '',
      searchItem: '',
      searchItemArray:  [{
          value: 'userName',
          label: '用户'
        }, {
          value: 'userId',
          label: '用户Id'
        }, {
          value: 'classify',
          label: '分类'
        }, {
          value: 'tags',
          label: '标签'
        }, {
          value: 'article',
          label: '文章'
      }],

      // table
      tableData: [],
      columns: [],

      // 分页
      total: 0,
      currentPage: 1,
      pageSize: 10
    }
  },
  async created() {
    // await this.init()
  },
  methods: {
    async init() {
      const res = await this.getData(this.currentPage, this.pageSize)

      const tableData = res.data
      this.tableData = tableData

      const pageConfig = JSON.parse(res.headers['x-pagination'])
      this.total = pageConfig.totalCount
      this.currentPage = pageConfig.currentPage
    },
    async getData(currentPage, pageSize) {
      const res = await this.$axios.get('https://localhost:5001/api/tags', {
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
      await this.init()
    }
  }
}
</script>

<style scoped>
  .createrCenter {
    margin-top: 10px;
  }
</style>

<style>

</style>