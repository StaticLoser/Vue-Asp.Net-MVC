import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import UserList from "../components/UserList.vue"
import articleList from '../components/articleList.vue'
import UserStatistics from '../components/UserStatistics.vue'
import ArticleStatistics from '../components/ArticleStatistics.vue'
import articleExam from '../components/articleExam.vue'
import articlePass from '../components/articlePass.vue'
import articleFailed from '../components/articleFailed.vue'
import ArticleInf from '../components/ArticleInf.vue'
import ArticleStati from '../components/ArticleStati.vue'
import adminStati from '../components/adminStati.vue'
import adminList from '../components/adminList.vue'
import userStati from '../components/userStati.vue'
import Login from '../views/Login.vue'


Vue.use(VueRouter)
const routes = [{
    name: "Home",
    path: "/",
    component: Home,
    beforeEnter: (to, from, next) => {
      console.log(to, from);
      var x = document.cookie;
      // console.log(x);
      if (x.indexOf("pass") != -1 && x.indexOf("adminName") != -1) {

        x = x.split(";")
        // console.log("进来了 ");
        let obj = {}
        x.forEach(i => {
          let values = i.split("=")
          obj[values[0].trim()] = values[1]
        })
        to.params.obj = obj
        //console.log(to.params.obj)
        next()
      } else {
        next("/Login")
      }

    },
    children: [{
        path: 'userList',
        name: 'userList',
        component: UserList
      }, {
        path: 'UserStatistics',
        name: 'UserStatistics',
        component: UserStatistics
      },
      {
        path: 'ArticleStatistics',
        name: 'ArticleStatistics',
        component: ArticleStatistics
      },
      {
        path: 'articleList',
        name: 'articleList',
        component: articleList
      }, {
        path: 'articleExam',
        name: 'articleExam',
        component: articleExam
      }, {
        path: 'articlePass',
        name: 'articlePass',
        component: articlePass
      }, {
        path: 'articleFailed',
        name: 'articleFailed',
        component: articleFailed
      },
      {
        path: 'ArticleInf',
        name: 'ArticleInf',
        component: ArticleInf
      },
      {
        path: 'ArticleStati',
        name: 'ArticleStati',
        component: ArticleStati
      },
      {
        path: 'userStati',
        name: 'userStati',
        component: userStati
      },{
        path: 'adminStati',
        name: 'adminStati',
        component: adminStati
      },{
        path: 'adminList',
        name: 'adminList',
        component: adminList
      }
      
    ]
  },
  {
    name: "Login",
    path: "/Login",
    component: Login
  }
]

const router = new VueRouter({
  routes
})
// router.beforeEach((to, from, next) => {
//   if (this.$Cookies.get('name')=="") next({ name: 'Login' })
//   else next()
// })


export default router