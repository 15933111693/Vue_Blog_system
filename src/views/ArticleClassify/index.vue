<template>
  <div class="articleClassify">
    <MyPageTable
      :showPagination="false"
    >
    </MyPageTable>
  </div>
</template>

<script>
import MyPageTable from '../../components/MyTablePage/index'
export default {
  name: 'articleClassify',
  components: {
    MyPageTable
  },
  methods: {
    editArticleClassify(col) {

    },
    deleteArticleClassify(col) {

    }
  }
}
</script>

<style scoped>
  .articleClassify {
    margin-top: 10px;
  }
</style>