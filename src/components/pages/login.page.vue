<style>
.loginFrom{
	text-align: center; /*让div内部文字居中*/
	background-color: #fff;
	border-radius: 10px;
	height:324px;
	width:512px;
	margin: auto;
	position: relative;
	top: 206px;
	left: 0;
	right: 0;
	bottom: 0;
}
.login-back-to-welcome-top{
	padding: 10px;
	background: rgba(0, 153, 229, .7);
	color: #fff;
	text-align: center;
	border-radius: 2px;
}
</style>
<template>
	<div :style="{backgroundImage:'url('+LoginBGURL+')',height:864+'px',weight:1920+'px'}">
		<div class="loginFrom">
			<Card :bordered="false" dis-hover>
				<p slot="title">欢迎回来，继续您的阅读之旅 ^_^</p>
				<Input prefix="md-contact" name="idinput" type="text" placeholder="请输入您的账号" style="width: auto" 
					v-validate="{ required:true, regex:/^[a-zA-Z0-9]{6,12}$/}" v-model="id" @keydown.enter.native="submit">
					<Tooltip transfer :max-width="200" class="ascyicon" v-show="veeErrors.has('idinput')" slot="suffix">
							<p slot="content">用户名不合法，应为:大小写英文与数字的组合、长度大等于6小等于12</p>
							<Icon color="#ed4014" type="md-close-circle" />
					</Tooltip>
				</Input>
				<br/><br/>

				<Input prefix="md-key" name="pwinput" type="password" placeholder="请输入您的密码" style="width: auto"
					v-validate="{ required:true, regex:/^[a-zA-Z0-9]{6,32}$/}" v-model="pw" @keydown.enter.native="submit">
					<Tooltip transfer :max-width="200" class="ascyicon" v-show="veeErrors.has('pwinput')" slot="suffix">
							<p slot="content">密码格式不合法，应为:大小写英文与数字的组合、长度大等于6小等于32</p>
							<Icon color="#ed4014" type="md-close-circle" />
					</Tooltip>
				</Input>

				<br/><br/>

				<Input prefix="md-barcode" name="valicodeinput" type="text" placeholder="请输入验证码" style="width: auto"
					v-validate="'required|vcAjax'" v-model="vc" @keydown.enter.native="submit">
					<Tooltip transfer :max-width="200" class="ascyicon" v-show="veeErrors.has('valicodeinput')" slot="suffix">
							<p slot="content">验证码错误，请检查</p>
							<Icon color="#ed4014" type="md-close-circle" />
					</Tooltip>
				</Input>
				<br/><br/>
				验证码：<img :src="catchaURL+'?rs='+catchaSeed" @click="refreshCatcha($event)"/>
				<br/><br/>
				<Checkbox  v-model="keepLoginState"><Icon type="md-lock"></Icon><font color="#808695">记住我的登录状态</font></Checkbox >
				<Divider/>
				<Button size="large" long icon="md-log-in" type="primary" @click="submit">提交</Button>
				<br/><br/>
				<font color="#808695" size="1">还没有账号？立即<router-link to="/register">注册</router-link>!</font>
			</Card>
		</div>
		<BackTop :height="0" :bottom="30"  on-click="goToWelcomePage">
			<div class="login-back-to-welcome-top">返回首页</div>
		</BackTop>
	</div>
</template>
<script type="text/javascript">
	//import Vue from 'vue';
	//import VeeValidate,{ Validator } from 'vee-validate';
	//import zh_CN from 'vee-validate/dist/locale/zh_CN';
	//Vue.use(VeeValidate);
	import {Store} from '../../store.js';
	import axios from 'axios';
	import md5 from 'js-md5';

	import LoginBG from '../../pics/login_bg.jpg';

	//import qs from 'qs'; // 处理asiox post传参的坑
  	export default{
		name:"LoginPage",
		data:function(){
			return{
				catchaSeed:Math.random(),
				LoginBGURL:LoginBG,
				id:'',
				pw:'',
				vc:'', // 验证码
				keepLoginState:false // 保持登录状态
			}
		},
		computed:{
			catchaURL(){
				return Store.state.server+"/GetCaptcha";
			}
		},
		methods:{
			goToWelcomePage(){
				this.$router.push("/welcome");
			},
			refreshCatcha(event){
				//let instance = event.target;
				//instance.src=instance.src+'?rd='+Math.random();
				this.catchaSeed = Math.random();
			},
			submit:function(){
				this.$validator.validate().then(result => {
					if (!result) {
						// do stuff if not valid.
						//console.log('未通过表单验证');
						this.$Notice.warning({
							title: '未通过表单验证',
							desc: "请检查您的各项输入是否符合要求"
						});
					}
					else{
						this.$Loading.start(); // 进度条开始载入
						var jsonMsg = {
							"ID":this.id,
							"PW":md5(this.pw + Store.state.salt), // md5加密
							"VC":this.vc,
							"KLS":this.keepLoginState // 登录Cookie
						};
						//console.log(JSON.stringify(jsonMsg));
						var mvue = this;// 向内传vue实体
						// 采用字符串方式发送
						axios.post(Store.state.server+"/LoginServlet","jsondata="+JSON.stringify(jsonMsg))
							.then(function (response) {
								let res = response.data;
								let isSuccess = res.FLAG;
								//console.log(res.MSG,isSuccess);
								if(isSuccess){
									mvue.$Notice.success({
										title: '登录成功',
										desc: res.MSG //'欢迎回来！会员:'+mvue.id+'，即将为您进行跳转!'
									});
									mvue.$Loading.finish(); // 进度条载入完毕
									Store.commit('online',res.UID); // 设置登录状态
									mvue.$router.push("/shop"); // 跳转到商店页面
								} else {
									mvue.$Notice.error({
										title: '登录失败',
										desc: res.MSG
									});
									mvue.$Loading.error(); // 进度条载入失败
								}
							})
							.catch(function (error) {
								//console.log(error);
								mvue.$Loading.error(); // 进度条载入失败
							});
					}
				});
			}
		}
  }
</script>