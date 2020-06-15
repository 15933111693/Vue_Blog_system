<template>
  <div class="creatorReview">
    <MyPageTable
      :search.sync="search"
      :searchItem.sync="searchItem"
      :searchItemArray="searchItemArray"
      :tableData="tableData"
      :columns="columns"
      :total="total"
      :pageSize="10"
      :table_button_width="50"
      @topage="topage"
      @submit="submit(1,10)"
    >
      <template #table_button="{ scope }">
        <el-button :disabled="scope.row.auditStatus === '是' ? true : false" type="text" @click="review(scope.row)">审核</el-button>
      </template>
    </MyPageTable>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <el-input v-model="reviewText" placeholder="请输入审核备注"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pass(false)">不通过</el-button>
        <el-button type="primary" @click="pass(true)">通过</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MyPageTable from '../../components/MyTablePage/index'

export default {
  name: 'CreatorReview',
  components: {
    MyPageTable
  },
  data() {
    return {
      // 搜索
      search: '',
      searchItem: '',
      searchItemArray:  [{
          value: 'Q',
          label: '用户'
        }],
      searchStatus: false,

      // table
      tableData: [],
      columns: [
        {id: 'userName', label: '用户名', sortable: false},
        {id: 'introduction', label: '介绍', sortable: false},
        {id: 'remark', label: '提交审核信息', sortable: false},
        {id: 'isPass', label: '是否通过', sortable: false},
        {id: 'auditStatus', label: '审核状态', sortable: false},
        {id: 'createTime', label: '创建时间', sortable: false},
      ],
      dialogVisible: false,
      reviewText: '',
      currentReview: null,

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
        data.isPass = data.isPass ? '是' : '否'
        data.auditStatus = data.auditStatus ? '是' : '否'
        data.btn = true
      }

      this.tableData = tableData

      const pageConfig = JSON.parse(res.headers['x-pagination'])
      this.total = pageConfig.totalCount
      this.currentPage = pageConfig.currentPage
    },
    async getData(currentPage, pageSize) {
      const res = await this.$axios.get('https://localhost:5001/api_assessor/creatorAuthe', {
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
    async review(data) {
      this.dialogVisible = true
      this.currentReview = data
    },
    async pass(type) {
      if(!this.reviewText) {
        this.$message({
          type: 'warning',
          message: '请输入审核内容'
        })
        return
      }

      const currentReview = this.currentReview
      const reviewText = this.reviewText

      const data = {
        IsPass: type,
        ReviewRemark: reviewText,
        auditId: this.currentReview.creatorAutheAuditId
      }

      const res = await this.$http.put(`/api_assessor/${this.currentReview.creatorAutheAuditId}/state`, null, {
        params: data
      })

      this.$message({
        type: 'success',
        message: '审核成功'
      })
      await this.init()
      
      this.reviewText = ''
      this.dialogVisible = false
      this.currentReview = null
    },
    async submit(currentPage, pageSize) {
      console.log('submit')
      const params = {
        PageNumber: String(currentPage),
        PageSize: String(pageSize)
      }
      params[this.searchItem] = this.search

      const res = await this.$axios.get('https://localhost:5001/api_assessor/creatorAuthe', {
        headers: {
          Authorization: localStorage.token
        },
        params: params
      })

      const tableData = res.data
      for(let data of tableData) {
        data.isPass = data.isPass ? '是' : '否'
        data.auditStatus = data.auditStatus ? '是' : '否'
        data.btn = true
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
  .creatorReview {
    margin-top: 10px;
  }
</style>