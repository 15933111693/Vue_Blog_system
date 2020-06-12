<template>
  <div>
      <!-- 搜索框 -->
      <div v-if="showSearch" class="search">
        <div>
          <el-input placeholder="请输入内容" v-model="i_search" :clearable="true">
              <el-select v-model="i_searchItem" ref="select" slot="prepend" placeholder="请选择搜索标题">
                <el-option
                  v-for="searchItem in searchItemArray"
                  :key="searchItem.value"
                  :label="searchItem.label"
                  :value="searchItem.value">
                </el-option>
              </el-select>
              <el-button @click="submit" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </div>

      <!-- 表格 -->
      <div class="table">
        <!-- 新增按钮 -->
        <div v-if="showAdd" style="float: right;margin-bottom: 10px">
          <el-button v-if="!addStatus" type="primary" @click="add">新增</el-button>
          <el-button v-if="addStatus" type="primary" @click="saveAdd">保存</el-button>
          <el-button v-if="addStatus" type="primary" @click="cancelAdd">取消</el-button>
        </div>

        <el-table :data="tableData" @sort-change="sortChange" border stripe>
          <el-table-column
            v-if="tableData.length"
            type="index"
            width="50">
          </el-table-column>
          <el-table-column v-for="col in columns"
            :property="col.id"
            :key="col.id"
            :label="col.label"
            :sortable="col.sortable">
            <template slot-scope="scope">
              <div class="table_row">
                <div v-if="scope.row.editStatus ? (scope.row.editStatus[col.id] === undefined ? true : !scope.row.editStatus[col.id]) : !scope.row.editStatus"> {{ scope.row[col.id] }} </div> 
                <el-input v-if="scope.row.editStatus ? (scope.row.editStatus[col.id] === undefined ? false : scope.row.editStatus[col.id]) : scope.row.editStatus" v-model="scope.row[col.id]" placeholder=""></el-input>
                <div style="margin-left:1px;">
                  <el-button v-if="scope.row.new === undefined ? (scope.row.editStatus ? (scope.row.editStatus[col.id] === undefined ? false : scope.row.editStatus[col.id]) : scope.row.editStatus) : !scope.row.new" type="text" @click="save(scope.row, col.id)">保存</el-button>
                </div>
                <div style="margin-left:1px;">
                  <el-button v-if="scope.row.new === undefined ? (scope.row.editStatus ? (scope.row.editStatus[col.id] === undefined ? false : scope.row.editStatus[col.id]) : scope.row.editStatus) : !scope.row.new" type="text" @click="cancel(scope.row, col.id)">取消</el-button>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="tableData.length && tableData[0].hasOwnProperty('state') && showSwitch" fixed="right" label="审核开关" width="50">
            <template slot-scope="scope">
              <slot name="table_switch" :scope="scope"></slot>
            </template>  
          </el-table-column>
          <el-table-column v-if="tableData.length && (tableData[0].edit || tableData[0].del)" fixed="right" label="操作" :width="table_button_width">
            <template slot-scope="scope" >
              <slot name="table_button" :scope="scope"></slot>
              <el-button v-if="scope.row.edit" type="text" @click="edit(scope.row)">编辑</el-button>
              <el-button v-if="scope.row.del" type="text" @click="del(scope.$index)">删除</el-button>
            </template>  
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div v-if="showPagination" class="pagination">
        <el-pagination
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :current-page.sync="currentPage">
        </el-pagination>
      </div>
  </div>
</template>

<script>
/* 
数据参数
  tableData {
    edit: true,  是否可编辑
    del: true,  是否可删除
    switch: true,  是否展示switch按钮
    editStatus: {  编辑状态
      name: false
    }
  }

  columns: [
    {
      id: 'date',  属性唯一值
      label: '日期', 展示属性
      sortable: 'custom' 是否可排序
    },
  ],
*/

/*
事件
  搜索
    submit 搜索内容提交时
  
  表格
    sortChange 排序时
    save 保存时
    del 删除时

  分页
    topage 切换页数时
*/
export default {
  name: 'myPageTable',
  props: {
    // 搜索
    showSearch: {
      type: Boolean,
      default: true
    },
    search: {
      type: String,
      default: ''
    },
    searchItem: {
      type: String,
      default: ''
    },
    searchItemArray: {
      type: Array,
      default: () => []
    },

    // 表格
    tableData: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    table_button_width: {
      type: Number,
      default: 0
    },
    showAdd: {
      type: Boolean,
      default: false
    },
    addObj: {
      type: Function,
      default: () => {}
    },
    showSwitch: {
      type: Boolean,
      default: false
    },

    // 分页
    showPagination: {
      type: Boolean,
      default: true
    },
    total: {
      type: Number,
      default: 0,
    },
    pageSize: {
      type: Number,
      default: 0,
    }
  },
  data() {
    return {
      // 搜索
      i_search: '',
      i_searchItem: '',

      // 表格
      addStatus: false,
      
      // 分页
      currentPage: 1
    }
  },
  watch: {
    // 搜索
    i_search(val) {
      this.$emit('update:search', val)
    },
    i_searchItem(val) {
      this.$emit('update:searchItem', val)
    },

    // 分页
    currentPage(newVal) {
      this.$emit('topage',newVal)
      console.log(`当前页数为${newVal}`)
    }
  },
  created() {
    
  },
  mounted() {
    
    this.$nextTick(() => {
      if(this.$refs.select) this.$refs.select.$el.style.minWidth = '150px' // 设置搜索栏宽度
    })
  },
  methods: {
    // 搜索
    submit() {
      if(this.i_searchItem === '') {
        this.$message({
          type: 'warning',
          message: '请先选择搜索标题'
        })
        return
      }
      this.$emit('submit')
    },

    // 表格
    sortChange({column, prop, order}) {
      let data = {
        prop: prop
      }
      if(order === 'ascending') data.dirction = 'up'
      if(order === 'descending') data.dirction = 'down'
      if(!order) data = null

      this.$emit('sortChange', data)
    },
    edit(row) {
      const editStatus = row.editStatus
      const oldData = {} 
      for(let status in editStatus) {
        editStatus[status] = true
        oldData[status] = row[status]
      }
      row.oldData = oldData
    },
    del(index) {
      this.$emit('del', index)
    },
    save(row, id) {
      this.$emit('save', row, id)
    },
    cancel(row, id) {
      row[id] = row.oldData[id]
      delete row.oldData[id]
      if(!row.oldData) delete row.oldData
      row.editStatus[id] = false
    },
    add() {
      this.addStatus = true
      const newData = this.addObj()
      newData.new = true
      this.tableData.push(newData)
      this.edit(this.tableData[this.tableData.length-1])
    },
    saveAdd() {
      this.addStatus = false
      const data = this.tableData[this.tableData.length-1]
      delete data.new
      delete data.editStatus
      delete data.oldData
      this.$emit('add', data)
      this.cancelAdd()
    },
    cancelAdd() {
      this.tableData.pop()
      this.addStatus = false
    }
  }
}
</script>

<style scoped>
  /* search */
  .search {
    display: flex;
    justify-content: center;
  }
  .search > div {
    width: 50vw;
  }
  
  /* table */
  .table {
    margin-top: 10px;
  }
  .table_row {
    display: flex;
  }

  /* pagination */
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
</style>