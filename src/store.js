import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export const Store = new Vuex.Store({
    state: {
      server:"/mywebapp", // 服务器发布地址
      imgDir:"/mywebapp/res/img", // 图片资源地址
      // 全局状态
      UID:-1,
      loginState: false,
      // 网站作者信息
      stuNo:10,
      email:'https://github.com/WhiteRobe',
      salt:'FosRoda' // 盐信息
    },
    mutations: {
      online (state,uid_num) {
        state.UID=uid_num;
        state.loginState=true;
      },
      offline(state){
        state.UID=-1;
        state.loginState=false;
      }
    }
})