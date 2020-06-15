import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/admin/login',
    component: () => import('@/views/AdminLogin/index'),
    name: 'Login',
    hidden: true,
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  
  {
    path: '/admin',
    component: Layout,
    redirect: '/admin/role',
  },

  {
    path: '/admin/role',
    component: Layout,
    children: [{
      path: '',
      name: 'Role',
      component: () => import('@/views/Role/index'),
      meta: { title: '角色管理', icon: 'role' }
    }]
  },

  {
    path: '/admin/userManager',
    component: Layout,
    children: [{
      path: '',
      name: 'User',
      component: () => import('@/views/UserManager/index'),
      meta: { title: '用户管理', icon: 'user' }
    }]
  },

  {
    path: '/admin/barner',
    component: Layout,
    children: [{
      path: '',
      name: 'Barner',
      component: () => import('@/views/Barner/index'),
      meta: { title: 'Barner', icon: 'classify' }
    }]
  },

  {
    path: '/admin/article',
    component: Layout,
    meta: { title: '文章管理', icon: 'article' },
    children: [{
      path: '',
      name: 'Article',
      component: () => import('@/views/ArticleText/index'),
      meta: { title: '文章管理'}
    },{
      path: 'articleComment',
      name: 'ArticleComment',
      component: () => import('@/views/ArticleText/ArticleComment/index'),
      hidden: true,
      meta: { title: '文章评论' }
    }]
  },

  {
    path: '/admin/articleSection',
    component: Layout,
    children: [{
      path: '',
      name: 'ArticleSection',
      component: () => import('@/views/ArticleSection/index'),
      meta: { title: '文章标签', icon: 'section' }
    }]
  },

  {
    path: '/admin/articleClassify',
    component: Layout,
    children: [{
      path: '',
      name: 'ArticleClassify',
      component: () => import('@/views/ArticleClassify/index'),
      meta: { title: '文章分类', icon: 'classify' }
    }]
  },

  {
    path: '/admin/creatorReview',
    component: Layout,
    children: [{
      path: '',
      name: 'CreatorReview',
      component: () => import('@/views/CreatorReview/index'),
      meta: { title: '创作者审核', icon: 'review' }
    }]
  },

  {
    path: '/admin/reviewCenter',
    component: Layout,
    meta: { icon: 'review' },
    children: [{
      path: '',
      name: 'ReviewCenter',
      component: () => import('@/views/ReviewCenter/index'),
      meta: { title: '审核中心' }
    },{
      path: 'articleContent',
      name: 'ArticleContent',
      component: () => import('@/views/ReviewCenter/ArticleContent/index'),
      hidden: true,
      meta: { title: '文章' }
    }]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
