import Vue from 'vue'
import VueRouter from 'vue-router'
// import Activity from '../views/Activity.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/Activity',
    name: 'Activity',
    component: () => import(/* webpackChunkName: "about" */ '../views/Activity.vue')
  },
  {
    path: '/ActivityManager',
    name: 'ActivityManager',
    component: () => import(/* webpackChunkName: "about" */ '../views/ActivityManager.vue')
  },
  {
    path: '/TestManagement',
    name: 'TestManagement',
    component: () => import(/* webpackChunkName: "about" */ '../views/TestManagement.vue')
  },
  {
    path: '/courseManagement',
    name: 'courseManagement',
    component: () => import(/* webpackChunkName: "about" */ '../views/courseManagement.vue')
  },
  {
    path: '/viewData',
    name: 'viewData',
    component: () => import(/* webpackChunkName: "about" */ '../views/viewData.vue')
  },
  {
    path: '/addTest',
    name: 'addTest',
    component: () => import(/* webpackChunkName: "about" */ '../views/addTest.vue')
  },
  {
    path: '/creatActivities',
    name: 'creatActivities',
    component: () => import(/* webpackChunkName: "about" */ '../views/creatActivities.vue')
  },
  {
    path: '/singleQuestion',
    name: 'singleQuestion',
    component: () => import(/* webpackChunkName: "about" */ '../views/singleQuestion.vue')
  },

  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
