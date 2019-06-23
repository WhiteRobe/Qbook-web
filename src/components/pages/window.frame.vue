<style scoped>
.layout{
    border: 1px solid #d7dde4;
    background: #2d8cf0;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}
.layout-logo{
    float: left;
    top: 15px;
    left: 10px;
    margin: 0 auto;
    margin-left: 10px;
}
.layout-nav{
    width: 330px;
    margin: 0 auto;
    margin-right: 10px;
    float:right;
}
.layout-footer-center{
    text-align: center;
}
</style>

<template>
    <div class="layout">
        <Layout>
            <Header>
                <Menu mode="horizontal" theme="dark" active-name="1" @on-select="handleMenuItemSelect">
                    <div class="layout-logo">
                        <Avatar :src="logoUrl" @click.native="goToShopPage"></Avatar>
                        <font face="微软雅黑" size="5" color="#ffffff" style="font-weight:bold">&nbsp;快购阅读</font>
                    </div>
                    <div class="layout-nav" v-if="isLoginIn">
                        <MenuItem name="MINE_WIDGE">
                            <Icon type="md-person" />
                            我的..
                        </MenuItem>
                        <MenuItem name="CART_WIDGE">
                            <Icon type="md-cart" />
                            购物车
                        </MenuItem>
                        <MenuItem name="3">
                            <Dropdown trigger="click" style="margin-left: 20px" transfer @on-click="handleDropDownMenuClick">
                                <a href="javascript:void(0)" style="color:#ffffff">
                                    <Icon type="md-more" />
                                    更多
                                    <Icon type="ios-arrow-down" />
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="EDIT_PROFILE">
                                    <Icon type="ios-school" />
                                        修改资料
                                    </DropdownItem>
                                    <DropdownItem name="CONTACT_US">
                                        <Icon type="md-contacts" />
                                        联系客服
                                    </DropdownItem>
                                    <DropdownItem name="SHOW_ORDER_LIST">
                                        <Icon type="md-checkbox-outline" />
                                        查看订单
                                    </DropdownItem>
                                    <DropdownItem divided name="LOGOUT">
                                        <Icon type="md-log-out" />
                                        退出登录
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </MenuItem>
                    </div>
                    <div class="layout-nav" v-else>
                        <MenuItem name="1" to="/login">
                            <Icon type="md-log-in" />
                            登录
                        </MenuItem>
                        <MenuItem name="2" to="/register">
                            <Icon type="md-person-add" />
                            注册
                        </MenuItem>
                        <MenuItem name="CONTACT_US_WIDGE"><!--to="/contact"-->
                            <Icon type="md-contacts" />
                            联系我们
                        </MenuItem>
                    </div>
                </Menu>
            </Header>
            <Content :style="{padding: '0 0px'}">
                <!-- 内部界面 -->
                <slot name="page_content"></slot>
            </Content>
            <Footer class="layout-footer-center">
                <Divider />
                <font color="#808695">2018-2019 &copy; 快购阅读</font>
            </Footer>
        </Layout>
        <!--抽屉效果-->
        <contact-us-widge ref="contactUsWidge"></contact-us-widge>
        <cart-widge ref="cartWidge"></cart-widge>
        <mine-widge ref="mineWidge"></mine-widge>
    </div>
</template>

<script type="text/javascript">
    import ContactUsWidge from "./widge/contact.us.widge.vue";
    import CartWidge from "./widge/cart.widge.vue";
    import MineWidge from "./widge/mine.widge.vue";
    import Logo_Jpg from '../../pics/logo.jpg';
    import {Store} from '../../store.js';
    import axios from 'axios';
    export default {
        name:"WindowFrame",
        provide:function(){
            return {
                gFrameWindow:this
            }
        },
        data:function(){
            return {
                logoUrl:Logo_Jpg
            }
        },
        methods:{
            goToShopPage(){
                //console.log('返回首页');
                this.$router.push("/shop");
            },
            handleDropDownMenuClick(menuName){
                //console.log(menuName);
                switch(menuName){
                    case 'EDIT_PROFILE':
                        this.$router.push("/editProfile"); // 跳转到修改资料页面
                        break;
                    case 'CONTACT_US':
                        // this.$router.push("/contact"); // 跳转到联系我们 - 废弃
                        this.$refs.contactUsWidge.canShow = true; // 打开联系我侧拉框
                        break;
                    case 'SHOW_ORDER_LIST':
                        this.$router.push("/orderList"); // 跳转到联系我们
                        break;
                    case 'LOGOUT':
                        this.logout();
                        break;
                    default:
                        break;
                }
            },
            handleMenuItemSelect(menuName){
                switch(menuName){
                    case 'MINE_WIDGE':
                        this.$refs.mineWidge.initData();
                        break;
                    case 'CONTACT_US_WIDGE': // 显示联系我们右侧抽屉框
                        this.$refs.contactUsWidge.canShow=true;
                        //console.log(this.$refs.contactUsWidge.canShow);
                        break;
                    case 'CART_WIDGE':
                        this.loadCartData(); // 载入购物车数据
                        break;
                    default:
                        break;
                }
            },
            logout : function(){ // 退出登录
                var mvue = this;
                axios.get(Store.state.server+"/CheckLoginStatusServlet",
                    {
                        params: { // get 模式手动赋值
							"jsondata": {"UID":this.getUID}
						}
                    })
                    .then(function (response) {
                        let res = response.data;
                        let isSuccess = res.FLAG;
                        //console.log(res.MSG,isSuccess);
                        if(isSuccess){
                            mvue.$Notice.success({
                                title: '退出成功',
                                desc: '您已安全退出，记得常回来看看!'
                            });
                            Store.commit('offline'); // 设置登录状态:退出
                            mvue.$router.push("/"); // 跳转到首页
                        } else {
                            mvue.$Notice.error({
                                title: '退出失败',
                                desc: res.MSG
                            });
                        }
                    })
                    .catch(function (error) {
                        mvue.$Notice.error({
                            title: '退出失败',
                            desc: '连接超时：未从服务器获得数据'
                        });
                        console.log(error);
                    });
            },
            loadCartData(){
                var mvue = this;
                mvue.$Loading.start(); // 进度条开始载入
                axios.get(Store.state.server+"/CartManagerServlet",
                    {
                        params: { // get 模式手动赋值
							"jsondata": {"UID":this.getUID}
						}
                    })
                    .then(function (response) {
                        let res = response.data;
                        let isSuccess = res.FLAG;
                        //console.log(res.MSG,isSuccess);
                        if(isSuccess){
                            mvue.$Loading.finish(); // 进度条载入完毕
                            var cartItems = mvue.$refs.cartWidge.cartItems;
                            cartItems.splice(0,cartItems.length);// 清空购物车显示内容以重新加载
                            for(var i=0;i<res.ITEMS.length;i++){ // 载入数据
                                cartItems.splice(i,1,res.ITEMS[i]);
                            }
                            mvue.$refs.cartWidge.canShow = true; // 显示购物车的抽屉效果
                        } else {
                            mvue.$Loading.error(); // 进度条载入失败
                            mvue.$Notice.error({
                                title: '载入购物车数据失败',
                                desc: res.MSG
                            });
                            mvue.$refs.cartWidge.canShow = false;
                        }
                    })
                    .catch(function (error) {
                        mvue.$Loading.error(); // 进度条载入失败
                        mvue.$Notice.error({
                            title: '载入购物车数据失败',
                            desc: '连接超时：未从服务器获得数据'
                        });
                        mvue.$refs.cartWidge.canShow = false;
                        console.log(error);
                    });
            }
        },
        computed:{
            isLoginIn:function(){
                return Store.state.loginState;
            },
            getUID:function(){
                return Store.state.UID;
            }
        },
        components:{
            'contact-us-widge':ContactUsWidge,
            'cart-widge':CartWidge,
            'mine-widge':MineWidge
        }
    }
</script>