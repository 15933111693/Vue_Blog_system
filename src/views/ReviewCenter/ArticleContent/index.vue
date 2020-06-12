<template>
  <div class="articleContent">
    <!-- 文章标题 -->
    <div><h1>{{ articleTitle }}</h1></div>
    <!-- 文章封面 -->
    <div style="width:100px;height:100px"><img :src="avatar" width="100px" height="100px" alt=""></div>
    <!-- 文章内容 -->
    <div ref="articleContent">
      
    </div>
    <!-- 文章类型 -->
    <div class="article_footer">
      <div class="article_footer_classify">分类: {{ categoryName }}</div>
      <div class="article_footer_tags">
        <el-tag
          v-for="tag of tags"
          :key="tag.id"
        >{{ tag.name }}</el-tag>
      </div>
      <!-- <div>
        <el-button type="primary" @click="() => {}">通过审核</el-button>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
    name: 'ArticleContent',
    data() {
      return {
        articleTitle: '',
        avatar: '',
        articleContent: '',
        categoryName: '',
        tags: [],
        
      }  
    },
    async created() {
      const articleId = this.$route.query.artilceId
      const res = await this.$http.get(`/api_site/article/${articleId}`)
      this.articleTitle = res[0].articleTitle
      this.avatar = res[0].avatar
      this.articleContent = res[0].articleContent
      this.categoryName = res[0].categoryName
      this.tags = res[0].tags
      
      this.$nextTick(() => {
        this.$refs.articleContent.innerHTML = this.articleContent
      })
    },
    // mounted() {
    //   this.$nextTick(() => {
    //     this.$refs.articleContent.innerHTML = this.articleContent
    //   })
    // }
}
</script>

<style scoped>
  .article_footer {
    margin-top: 10px;
  }
</style>

<style scoped>

</style>