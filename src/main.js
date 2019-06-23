import Vue from 'vue';

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import Vuex from 'vuex';
Vue.use(Vuex);

import iView from 'iview';
import 'iview/dist/styles/iview.css';
Vue.use(iView);

import {AppRouter} from "./router.js"; // 应用路由
import {Store} from "./store.js"; // 应用全局状态

import './validate.js'; // 引入校验规则

import WindowFrame from "./components/pages/window.frame.vue";
//-------------------//

var app = new Vue({
  el: '#app',
  data: {
    msg:"应用成功部署运行！"
  },
  components:{
    "window-frame":WindowFrame
  },
  router:AppRouter
});
