import VueRouter from 'vue-router';
import {Store} from './store.js';

import axios from 'axios';

import WelcomePage from "./components/pages/welcome.page.vue";
import LoginPage from "./components/pages/login.page.vue";
import RegisterPage from "./components/pages/register.page.vue";
import EditProfilePage from "./components/pages/edit_profile.page.vue";
import OrderListPage from "./components/pages/order_list.page.vue";
import ListDetailPage from "./components/pages/list_detail.page.vue";
//import ContactUsPage from "./components/pages/contact_us.page.vue";
import ConsolePage from "./components/pages/console.page.vue";
import ShopPage from "./components/pages/shop.page.vue";
import SearchPage from "./components/pages/search.page.vue";
import ItemDetailPage from "./components/pages/item_detail.page.vue";

import testItem from "./components/items/shop.book.vue";

export const AppRouter = new VueRouter({
    routes:[
        { path:"/", component: WelcomePage},
        { path: '/login', component: LoginPage },
        { path: '/register', component: RegisterPage },
        { path: '/editProfile', component: EditProfilePage },
        //{ path: '/contact', component: ContactUsPage },
        //{ path: '/test', component: ConsolePage }
        { path: '/shop', component: ShopPage },
        { path: '/orderList', component: OrderListPage },
        { path: '/listDetail', component: ListDetailPage },
        { path: '/mine', component: { template: '<div>该地址无效!</div>' } },
        { path: '/search', component: SearchPage },
        { path: '/itemDetail', component: ItemDetailPage },
        { path: '/console', component: ConsolePage }
        
    ]
});

// 路由守卫
AppRouter.beforeEach((to, from, next) => {
    //console.log("导航ing");
    checkLoginStatu();// 发送一个AJAX确认是否为在线状态
    if(to.path.indexOf('/console')!=-1 ){
        // 禁止无权限用户进入控制台页面
        return checkAuth(next);
    }
	return next();
});

function checkLoginStatu(){
    // 发送一个AJAX确认是否为在线状态
    var jsonMsg = {
        UID:Store.state.UID
    };
    axios.post(Store.state.server+"/CheckLoginStatusServlet","jsondata="+JSON.stringify(jsonMsg))
        .then(function (response) {
            let res = response.data;
            let isSuccess = res.FLAG;
            //console.log(res.MSG,isSuccess);
            if(isSuccess){
                Store.commit('online', res.UID); // 设置登陆状态
            } else {
                Store.commit('offline'); // 下线
                //console.log(res.MSG);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function checkAuth(next){
    // 发送一个AJAX确认是否为在线状态
    var jsonMsg = {
        UID:Store.state.UID
    };
    axios.get(Store.state.server+"/ProfileManagerServlet",{ params:{ "jsondata":jsonMsg }})
        .then(function (response) {
            let res = response.data;
            let isSuccess = res.FLAG;
            //console.log(res.MSG,isSuccess);
            if(isSuccess){
                if(res.AUTH>=9) next(); // 权限足够则跳转
                else next("/shop");
            } else {
                next("/shop"); // 无权限用户直接返回首页
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}