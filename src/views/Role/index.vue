<template>
  <div class="role">
    <el-table :data="tableData" border stripe>
      <el-table-column
        prop="num"
        label="序号"
        width="50px">
      </el-table-column>
      <el-table-column
        prop="id"
        label="ID"
        width="289px">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="名称"
        width="80px">
        <template slot-scope="scope">
          <div v-if="!(tableData[scope.row.num-1] === undefined ? undefined : tableData[scope.row.num-1].editStatus)">{{ scope.row.roleName }}</div>
          <el-input v-model="tableData[scope.row.num-1].roleName" v-if="tableData[scope.row.num-1] === undefined ? undefined : tableData[scope.row.num-1].editStatus" placeholder="请输入新名称" size="mini"></el-input>
          <el-button v-if="tableData[scope.row.num-1] === undefined ? undefined : tableData[scope.row.num-1].editStatus" class="button-new-tag" size="small" @click.stop="saveRoleName(tableData[scope.row.num-1])">保存</el-button>
          <el-button v-if="tableData[scope.row.num-1] === undefined ? undefined : tableData[scope.row.num-1].editStatus" class="button-new-tag" size="small" @click.stop="cancelEditName(tableData[scope.row.num-1])">取消</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="roleRight"
        label="权限"
        min-width="460px">
        <template slot-scope="scope">
          <el-tag
            v-for="right in scope.row.roleRight"
            :key="right.id"
            closable
            @close="removeAuthority(scope.row.roleName, right.name, right.id, scope.row)">
            {{right.name}}
          </el-tag>
          <el-select v-model="tableData[scope.row.num-1].newVal" v-if="tableData[scope.row.num-1] === undefined ? undefined : tableData[scope.row.num-1].show"  placeholder="请选择" size="small" class="input-new-tag">
            <el-option
              v-for="editAuthority in tableData[scope.row.num-1].editAuthority"
              :key="editAuthority.id"
              :label="editAuthority.name"
              :value="editAuthority.id"
              >
            </el-option>
          </el-select>
          <el-button v-if="(tableData[scope.row.num-1] === undefined ? undefined : (!tableData[scope.row.num-1].show && tableData[scope.row.num-1].editAuthority.length))" class="button-new-tag" size="small" @click.stop="showSelect(tableData[scope.row.num-1])">+</el-button>
          <el-button v-if="tableData[scope.row.num-1] === undefined ? undefined : (tableData[scope.row.num-1].show && tableData[scope.row.num-1].newVal)" class="button-new-tag" size="small" @click.stop="save(tableData[scope.row.num-1])">保存</el-button>
          <el-button v-if="tableData[scope.row.num-1] === undefined ? undefined : tableData[scope.row.num-1].show" class="button-new-tag" size="small" @click.stop="hideSelect(tableData[scope.row.num-1])">取消</el-button>
        </template>
      </el-table-column>
      <el-table-column width="100px">
        <template slot-scope="scope">
          <el-button :disabled="true" type="primary" size="mini" @click="changeEditStatus(tableData[scope.row.num-1])">编辑名字</el-button>
        </template>
      </el-table-column>
      <el-table-column width="70px">
        <template slot-scope="scope">
          <el-button :disabled="true" type="danger" size="mini" @click="deleteUser(tableData[scope.row.num-1])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="btnClass">
      <el-button type="primary" @click="addUser">新增角色</el-button>
      <el-button type="primary" @click="popAuthority">查看权限信息</el-button>
    </div>
  </div>
</template>

<script>
export default {
    name: 'role',
    data() {
      return {
        // 权限
        right: null,
        // 表格数据
        tableData: null,
        
      }
    },
    async created() {
      const right = await this.$http.get('/api/right')
      this.right = right
      await this.getList()
    },
    methods: {
      async getList() {
        // 获取角色
        const roles = await this.$http.get('/api/roles')
        // 序列
        let num = 0
        for(let i of roles) {
          // 处理权限
          const roleRight = await this.$http.get(`/api/roles/${i.id}/right`)
          i.roleRight = []
          for(let j of roleRight) {
            i.roleRight.push(j)
          }

          // 处理可编辑权限
          i.editAuthority = JSON.parse(JSON.stringify(this.right))
          for(let tableRoleRight of i.roleRight) {
            for(let y=0;y<i.editAuthority.length;y++) {
              let editAuthority = i.editAuthority[y]
              if(tableRoleRight.id === editAuthority.id) i.editAuthority.splice(y,1)
            }
          }
          
          // 处理序列
          num++
          i.num = num

          // 处理新增标签显隐
          i.show = false
          // 处理新标签值
          i.newVal = ''

          // 处理名字的可编辑状态
          i.editStatus = false
        }
        this.tableData = roles
      },
      // 权限
      async removeAuthority(roleName, right, id, row) {
        const idList = []
        for(let i of row.roleRight) {
          if(id != i.id) idList.push(i.id)
        }
        this.$confirm(`确定删除 ${roleName} 的 ${right} 权限?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await this.$http.put(`/api/roles/${row.id}/right`,idList)
          if(res) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            await this.getList()
          }
        })
      },
      async save(role) {
        const idList = []
        for(let i of role.roleRight) {
          idList.push(i.id)
        }
        idList.push(role.newVal)
        const res = await this.$http.put(`/api/roles/${role.id}/right`, idList)
        if(res) {
          this.$message({
            type: 'succsee',
            message: '添加成功'
          })
          await this.getList()
        }
      },
      showSelect(right) {
        right.show = true
      },
      hideSelect(right) {
        right.newVal = ''
        right.show = false
      },

      // 更改名称
      changeEditStatus(role) {
        role.editStatus = true
      },
      async saveRoleName(role) {
        const res = await this.$http.put(`/api/roles?roleId=${role.id}&roleName=${role.roleName}`)
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        await this.getList()
      },
      cancelEditName(role) {
        role.editStatus = false
      },

      // 删除角色
      async deleteUser(role) {
        this.$confirm(`确定删除 ${role.roleName} 角色?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.$http.delete(`/api/roles/${role.id}`)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          await this.getList()
        })
      },

      // 新增角色
      async addUser() {
        this.$prompt('请输入新角色名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[0-9a-zA-Z\u4E00-\u9FFF]+$/,
          inputErrorMessage: '格式不正确'
        }).then(async ({ value }) => {
          const res = await this.$http.post('/api/roles', {name: value})
          if(res) {
            await this.getList()
            this.$message({
              type: 'success',
              message: value + '角色添加成功 '
            })
            
          }
          
        })
      },

      // 查看系统权限
      popAuthority() {
        let text = ''
        for(let i of this.right) {
          text += i.name + '\n' 
        }

        this.$alert(text, '系统权限', {
          confirmButtonText: '确定'
        })
      }
    }
}
</script>

<style scoped>
  .btnClass {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
  }
</style>

<style>
  .el-tag + .el-tag {
    margin-top: 1px;
    margin-left: 10px;
  }
  .button-new-tag, .input-new-tag {
    margin-top: 1px;
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
</style>