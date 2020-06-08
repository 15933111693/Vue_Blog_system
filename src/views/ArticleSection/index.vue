<template>
  <div class="articleSection">
    <MyPageTable></MyPageTable>
  </div>
</template>

<script>
import MyPageTable from '../../components/MyTablePage/index'
export default {
    name: 'articleSection',
    components: {
        MyPageTable
    },
}
</script>

<style>
  .articleSection {
    margin-top: 10px;
  }
</style>