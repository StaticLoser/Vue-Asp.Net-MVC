import Vue from 'vue'
import App from './views/App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import axios from 'axios'
import Cookies from 'js-cookie'
import VueCookies from 'vue-cookies'
import * as echarts from 'echarts'; 
Vue.prototype.$echarts = echarts
Vue.prototype.$cookie = VueCookies;
Vue.prototype.$Cookies = Cookies;

Vue.prototype.axios = axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

