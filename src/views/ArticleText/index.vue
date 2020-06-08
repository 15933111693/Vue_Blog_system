<template>
  <div class="articleText">
    <MyPageTable 
      :search.sync="search"
      :searchItem.sync="searchItem"
      :searchItemArray="searchItemArray"
      :tableData="tableData"
      :columns="columns"
      :total="total"
      :pageSize="10"
      :table_button_width="100"> 
      <template #table_switch="{ col }">
        <!-- <el-switch
          v-model="value"
          active-color="#13ce66"
          inactive-color="#ff4949"
          width="35">
        </el-switch> -->
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
      tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          edit: true,
          del: true,
          switch: true,
          editStatus: {
            name: false
          }
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          edit: true,
          del: true,
          editStatus: {
            name: false
          }
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          edit: true,
          del: true,
          editStatus: {
            name: false
          }
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
          edit: true,
          del: true,
          editStatus: {
            name: false
          }
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          edit: true,
          del: true,
          editStatus: {
            name: false
          }
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          edit: true,
          del: true,
          editStatus: {
            name: false
          }
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          edit: true,
          del: true,
          editStatus: {
            name: false
          }
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
          edit: true,
          del: true,
          editStatus: {
            name: false
          }
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          edit: true,
          del: true,
          editStatus: {
            name: false
          }
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          edit: true,
          del: true,
          editStatus: {
            name: false
          }
        }    
      ],
      columns: [
        {id: 'date', label: '日期', sortable: 'custom'},
        {id: 'name', label: '姓名', sortable: false},
        {id: 'address', label: '地址', sortable: false},
      ],
      value: false,

      // 分页
      total: 100
    }
  },
  methods: {
    handleClick(row) {
      console.log(row)
    }
  }
}
</script>

<style scoped>
  .articleText {
    margin-top: 10px;
  }
</style>