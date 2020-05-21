import Vue from 'vue'
import App from './App.vue'
import store from './store'
import VueRouter from 'vue-router';
import { routes } from './router/routes';
import { index } from './components/index';
import Toasted from 'vue-toasted';


// Router
Vue.use(VueRouter);
const router = new VueRouter({
    routes,
    linkActiveClass: 'open active',
    scrollBehavior: () => ({ y: 0 }),
    mode: 'hash'
});
Vue.use(Toasted, {
  router
});

new Vue({
  el: '#app',
  router,
  store,
  beforeCreate: function(){
    //Vue.config.productionTip = false

    //Vue.prototype.$hostname = (Vue.config.productionTip) ? 'https://www.your-api.com' : 'http://localhost:3000'
  },
  render: h => h(App),
  components: { App }
})
