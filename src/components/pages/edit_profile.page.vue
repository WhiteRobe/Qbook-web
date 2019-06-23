<style>
	.editProfileFrom{
	text-align: center; /*让div内部文字居中*/
	background-color: #fff;
	border-radius: 10px;
	height:324px;
	width:512px;
	margin: auto;
	position: relative;
	top: 154px;
	left: 0;
	right: 0;
	bottom: 0;
}
.edit-profile-back-to-welcome-top{
	padding: 10px;
	background: rgba(0, 153, 229, .7);
	color: #fff;
	text-align: center;
	border-radius: 2px;
}
.editProfileAvatarDiv{
	width: 172px; /* 跟mineAvatarDiv中的width与height一致 */
	height: 172px; /* 跟mineAvatarDiv中的width与height一致 */
	padding: 2x;
	background: #ececec;
	border-radius: 172px;
	box-shadow: 0px 0px 1px rgba(0,0,0,0.4);
	-moz-border-radius: 172px; /* 跟mineAvatarDiv中的width与height一致 */
	-webkit-border-radius: 172px; /* 跟mineAvatarDiv中的width与height一致 */

	text-align: center;
	margin: auto;
	position: relative;
}
.editProfileAvatarImage{
	width: 172px; /* 跟mineAvatarDiv中的width与height一致 */
	height: 172px;/* 跟mineAvatarDiv中的width与height一致 */
	line-height: 0;	/* remove line-height */ 
	display: inline-block;	/* circle wraps image */
	border-radius: 50%;	/* relative value */
	-moz-border-radius: 50%;
	-webkit-border-radius: 50%;
	transition: linear 0.25s;
}
</style>
<template>
	<div :style="{backgroundImage:'url('+EditProfileBGURL+')',height:864+'px',weight:1920+'px'}">
		<div class="editProfileFrom">
		<Card :bordered="false" dis-hover>
				<p slot="title">修改您的个人资料</p>
				<Row>
					<Col span="1">&nbsp;</Col>
					<Col span="11">
							<div class="editProfileAvatarDiv">
								<img class="editProfileAvatarDiv" :src="imgDir+'/'+avatar"></img>
							</div>
							<br/>
							<Upload :action="serverURL+'/FileUploadServlet'" :max-size="1024*5" show-upload-list :before-upload="manualUpload">
								<Button icon="ios-cloud-upload-outline">更改头像</Button>
								&nbsp;<Icon type="md-checkmark-circle" color="#19be6b" v-if="file!=undefined"/>
							</Upload>
					</Col>
					<Col span="11">
						<!--<Input prefix="md-contact" name="idinput" type="text" placeholder="请输入您的新账号" style="width: auto" 
							v-validate="{ required:true, idAjax:true, regex:/^[a-zA-Z0-9]{6,12}$/}" v-model="id" @keydown.enter.native="submit">
							<Tooltip transfer :max-width="200" class="ascyicon" v-show="veeErrors.has('idinput')" slot="suffix">
									<p slot="content">用户名不合法，应为:大小写英文与数字的组合、长度大等于6小等于12</p>
									<Icon color="#ed4014" type="md-close-circle" />
							</Tooltip>
						</Input>
						<br/><br/>-->

						<Input prefix="md-key" name="pwinput" type="password" placeholder="请输入您的密码" style="width: auto"
							v-validate="{ required:true, regex:/^[a-zA-Z0-9]{6,32}$/}" v-model="pw" @keydown.enter.native="submit">
							<Tooltip transfer :max-width="200" class="ascyicon" v-show="veeErrors.has('pwinput')" slot="suffix">
									<p slot="content">密码格式不合法，应为:大小写英文与数字的组合、长度大等于6小等于32</p>
									<Icon color="#ed4014" type="md-close-circle" />
							</Tooltip>
						</Input>
						<br/><br/>

						<Input prefix="ios-key-outline" name="newpwinput" type="password" placeholder="请输入您的新密码" style="width: auto"
							v-validate="{ regex:/(^[a-zA-Z0-9]{6,32}$)|(^[a-zA-Z0-9]{0,0}$)/}" v-model="newpw" @keydown.enter.native="submit" >
							<Tooltip transfer :max-width="200" class="ascyicon" v-show="veeErrors.has('newpwinput')" slot="suffix">
									<p slot="content">密码格式不合法，应为:大小写英文与数字的组合、长度大等于6小等于32</p>
									<Icon color="#ed4014" type="md-close-circle" />
							</Tooltip>
						</Input>
						<br/><br/>

						<Input prefix="ios-key" name="renewpwinput" type="password" placeholder="请再次输入您的新密码" style="width: auto"
							v-validate="{'is': newpw}" v-model="renewpw" @keydown.enter.native="submit">
							<Tooltip transfer :max-width="200" class="ascyicon" v-show="veeErrors.has('renewpwinput')" slot="suffix">
									<p slot="content">两次密码输入不一致</p>
									<Icon color="#ed4014" type="md-close-circle" />
							</Tooltip>
						</Input>
						<br/><br/>

						<Input prefix="md-mail" name="emailinput" type="email" placeholder="请输入您的新邮箱" style="width: auto"
							v-validate="'required|email'" v-model="email" @keydown.enter.native="submit">
							<Tooltip transfer :max-width="200" class="ascyicon" v-show="veeErrors.has('emailinput')" slot="suffix">
									<p slot="content">邮箱格式不合法</p>
									<Icon color="#ed4014" type="md-close-circle" />
							</Tooltip>
						</Input>
					</Col>
					<Col span="1">&nbsp;</Col>
				</Row>
				<Row>
					<Divider/>
					<Button size="large" long icon="ios-cloud-upload" type="primary" @click="submit" :disabled="submitBtnDisable">提 交</Button>
					<br/><br/>
					<font color="#808695" size="1"><router-link to="/shop">放弃修改并返回首页!</router-link></font>
				</Row>
			</Card>
		</div>

		<Spin size="large" fix v-if="spinShow"></Spin>
		<BackTop :height="0" :bottom="30"  on-click="goToShopPage">
			<div class="edit-profile-back-to-welcome-top">返回商店页面</div>
		</BackTop>
	</div>
</template>
<script type="text/javascript">
	import {Store} from '../../store.js';
	import EditProfileBG from '../../pics/edit_profile_bg.jpg';
	import axios from 'axios';
	import md5 from 'js-md5';
  export default{
		name:"EditProfilePage",
		data:function(){
			return{
				EditProfileBGURL:EditProfileBG,
				//id:'',
				pw:'',
				newpw:'',
				renewpw:'',
				email:'',
				avatar:'defaultAVATAR.jpg',

				file:undefined,
				spinShow:false,
				submitBtnDisable:false
			}
		},
		computed:{
			myUID:function(){
				return Store.state.UID;
			},
			serverURL(){
				return Store.state.server;
			},
			imgDir(){
				return Store.state.imgDir;
			}
		},
		methods:{
			getPageData(){
				var mvue = this;
				axios.get(Store.state.server+"/ProfileManagerServlet",{ params:{"jsondata":{"UID":Store.state.UID}} })
					.then(function (response) {
						let res = response.data;
						let isSuccess = res.FLAG;
						//console.log(res.MSG,isSuccess);
						if(isSuccess){
							mvue.$Loading.finish(); // 进度条载入完毕
							mvue.spinShow = false;
							
							mvue.id = res.ID;
							mvue.email = res.EMAIL;
							mvue.avatar = res.AVATAR;
						} else {
							mvue.$Message.error('个人资料获取失败:'+res.MSG+'已经为您跳转回主页。');
							mvue.$Loading.error(); // 进度条载入失败
							mvue.spinShow = false;
							mvue.$router.push("/shop");
						}
					})
					.catch(function (error) {
						console.log(error);
						mvue.$Message.error('个人资料获取失败:连接超时!已经为您跳转回主页。');
						mvue.$Loading.error(); // 进度条载入失败
						mvue.spinShow = false;
						mvue.$router.push("/shop");
					});
			},
			goToShopPage(){
				this.$router.push("/shop");
			},
			manualUpload(temp_file){
				if(temp_file.size > 1024 * 1024 * 5){
					this.$Message.error('文件过大!上传文件需要小于5MB！');
					this.file = undefined;
					return false;
				}
				if(temp_file.type !== "image/jpeg"){
					this.$Message.error('文件格式错误，支持jpg格式的图片！');
					this.file = undefined;
					return false;
				}
				this.$Message.success('新头像图片已成功读取！');
				this.file = temp_file;
				return false;
			},
			submit(){
				//console.log(this.pw,this.newpw );
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
						this.spinShow=true;
						this.submitBtnDisable=true;
						this.$Loading.start(); // 进度条开始载入
						var jsonMsg = {
							"UID":Store.state.UID,
							"ID":this.id,
							"PW":md5(this.pw + Store.state.salt), // md5加密
							"NEWPW":this.newpw===''?'':md5(this.newpw + Store.state.salt), // md5加密
							"EMAIL":this.email,
							"AVATAR":this.file!=undefined?(''+Store.state.UID):'NULL'
						};
						var fd = new FormData();
						fd.append('jsondata',JSON.stringify(jsonMsg));
						if(this.file!=undefined) {
							fd.append('pic',this.file);
						}
						var mvue = this;
						axios({
								url:Store.state.server+"/ProfileManagerServlet",
								data:fd,
								method:'post',
								headers: {'Content-Type': 'multipart/form-data'}//application/x-www-form-urlencoded
							}).then(function (response) {
								mvue.spinShow = false;
								let res = response.data;
								let isSuccess = res.FLAG;
								//console.log(res.MSG,isSuccess);
								if(isSuccess){
									mvue.submitBtnDisable = true;
									mvue.$Message.success('资料修改成功，即将跳转到商店页面');
									setTimeout( () => { mvue.$router.push("/shop"); }, 500); 
								} else {
									mvue.submitBtnDisable = false;
									mvue.$Message.error('资料修改失败:'+res.MSG);
									mvue.$Loading.error(); // 进度条载入失败
								}
							}).catch(function (error) {
								//console.log(error);
								mvue.spinShow = false;
								mvue.submitBtnDisable = false;
								mvue.$Message.error('资料修改失败:连接超时');
								mvue.$Loading.error(); // 进度条载入失败
							});
					}
				});
			}
		},
		beforeRouteEnter (to, from, next) {
			next(vm => {
				vm.spinShow = true;
				vm.$Loading.start();
				setTimeout( () => { 
					vm.getPageData();
				}, 1500); // 等待AJAX同步用户登陆状态并载入
			});
		}
  }
</script>