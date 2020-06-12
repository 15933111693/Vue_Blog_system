<template>
  <div class="articleClassify">
    <MyPageTable
      :showSearch="false"
      :showPagination="false"
      :tableData="tableData"
      :columns="columns"
      :table_button_width="100"
      :showAdd="true"
      :addObj="addObj"
      @save="save"
      @del="del"
      @add="add"
    ></MyPageTable>
  </div>
</template>

<script>
import MyPageTable from '../../components/MyTablePage/index'
export default {
  name: 'articleClassify',
  components: {
    MyPageTable
  },
  data() {
    return {
      // 表格
      tableData: [],
      columns: [
        {id: 'id', label: 'ID', sortable: false},
        {id: 'name', label: '名称', sortable: false},
        {id: 'remark', label: '分类', sortable: false}
      ],
      addObj: () => {
        return {
          name: '', 
          remark: '',
          editStatus: {
            name: true,
            remark: true
          }
        }
      }
    }
  },
  async created() {
    await this.init()
  },
  methods: {
    async init() {
      const tableData = await this.getData()
      for(let row of tableData) {
        row.edit = true
        row.del = true
        row.editStatus = {name: false}
      }

      this.tableData = tableData

    },
    async getData() {
      const res = await this.$http.get('/api/categories')
      return res
    },
    async save(row) {
      const categoryId = row.id
      const data = {
        name: row.name,
        remark: row.remark
      }

      const res = await this.$http.put(`/api/categories/${categoryId}`, data)
      if(res) {
        await this.init()
        this.$message({
          type: 'success',
          message: '修改成功'
        })
      }
    },
    async del(index) {
      const categoryId = this.tableData[index].id
      const res = await this.$http.delete(`/api/categories/${categoryId}`)
      // if(res) {
        await this.init()
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      // }
    },
    async add(data) {
      const res = await this.$http.post('/api/categories', data)
      if(res) {
        await this.init()
        this.$message({
          type: 'success',
          message: '新增成功'
        })
      }
    }
  }
}
</script>

<style scoped>
.articleClassify {
  margin-top: 10px;
}
</style>