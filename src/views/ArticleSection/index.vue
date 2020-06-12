<template>
  <div class="articleSection">
    <MyPageTable 
      :showSearch="false"
      :tableData="tableData"
      :columns="columns"
      :total="total"
      :pageSize="pageSize"
      @topage="topage"
    ></MyPageTable>
  </div>
</template>

<script>
import MyPageTable from '../../components/MyTablePage/index'
export default {
    name: 'articleSection',
    components: {
      MyPageTable
    },
    data() {
      return {
        // 表格
        tableData: [],
        columns: [
          {id: 'id', label: 'ID', sortable: false},
          {id: 'name', label: '名称', sortable: false}
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

<style>
  .articleSection {
    margin-top: 10px;
  }
</style>