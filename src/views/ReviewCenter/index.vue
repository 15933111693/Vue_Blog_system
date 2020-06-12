<template>
  <div class="reviewCenter">
    <MyPageTable
      :search.sync="search"
      :searchItem.sync="searchItem"
      :searchItemArray="searchItemArray"
      :tableData="tableData"
      :columns="columns"
      :total="total"
      :pageSize="10"
      :table_button_width="150"
      @topage="topage"
      @submit="submit(1,10)"
    >
      <template #table_button="{ scope }">
        <el-button type="text" @click="$router.push(`/admin/reviewCenter/articleContent?artilceId=${scope.row.articleId}`)">查看</el-button>
        <el-button type="text" @click="review(scope.row)">审核</el-button>
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
  name: 'reviewCenter',
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
          value: 'classify',
          label: '分类'
        }, {
          value: 'tags',
          label: '标签'
        }, {
          value: 'article',
          label: '文章'
      }],
      searchStatus: false,

      // table
      tableData: [],
      columns: [
        {id: 'articleId', label: 'ID', sortable: false},
        {id: 'aticleTitle', label: '文章标题', sortable: false},
        {id: 'userName', label: '文章作者', sortable: false},
        {id: 'tags', label: '文章标签', sortable: false},
        {id: 'star', label: '点赞数量', sortable: false},
        {id: 'articleCreateTime', label: '创建时间', sortable: false},
        {id: 'articleModifyTime', label: '修改时间', sortable: false},
        {id: 'categoryName', label: '分类', sortable: false},
        {id: 'isPass', label: '是否审核通过', sortable: false},
        {id: 'auditStatus', label: '审核状态', sortable: false},
        {id: 'userReviewAuditId', label: '审核表ID', sortable: false},
        {id: 'auditCreateTime', label: '审核报表生成时间', sortable: false},
        {id: 'auditModifyTime', label: '审核报表修改时间', sortable: false},
        {id: 'reviewRemark', label: '审核文章备注', sortable: false}
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
        let tags = ''
        for(let tag of data.tags) {
          tags += tag.name + ' '
        }
        data.isPass = data.isPass ? '是' : '否'
        data.auditStatus = data.auditStatus ? '是' : '否'
        data.tags = tags
        data.del = true
      }

      this.tableData = tableData

      const pageConfig = JSON.parse(res.headers['x-pagination'])
      this.total = pageConfig.totalCount
      this.currentPage = pageConfig.currentPage
    },
    async getData(currentPage, pageSize) {
      const res = await this.$axios.get('https://localhost:5001/api_assessor/articleReview', {
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
        Remark: reviewText,
        state: type
      }

      const res = await this.$http.put(`/api_assessor/articleReview/${currentReview.userReviewAuditId}`, null, {
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
    async del(index) {
      const res = await this.$http.delete(`/api_assessor/articleReview/${this.tableData[index].userReviewAuditId}`) 
      this.$message({
        type: 'success',
        message: '删除成功'
      })
    },
    async submit(currentPage, pageSize) {
      const params = {
        PageNumber: String(currentPage),
        PageSize: String(pageSize)
      }
      params[this.searchItem] = this.search

      const res = await this.$axios.get('https://localhost:5001/api_assessor/articleReview', {
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
        data.isPass = data.isPass ? '是' : '否'
        data.auditStatus = data.auditStatus ? '是' : '否'
        data.tags = tags
        data.del = true
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
  .reviewCenter {
    margin-top: 10px;
  }
</style>

<style>

</style>