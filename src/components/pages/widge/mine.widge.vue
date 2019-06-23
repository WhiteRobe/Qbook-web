<style>
.mine-drawer-profile-profile{
	font-size: 14px;
}
.mine-drawer-profile-profile .ivu-col{
	margin-bottom: 12px;
}
.mineAvatarDiv{
	width: 128px; /* 跟mineAvatarDiv中的width与height一致 */
	height: 128px; /* 跟mineAvatarDiv中的width与height一致 */
	padding: 2x;
	background: #ececec;
	border-radius: 128px;
	box-shadow: 0px 0px 1px rgba(0,0,0,0.4);
	-moz-border-radius: 128px; /* 跟mineAvatarDiv中的width与height一致 */
	-webkit-border-radius: 128px; /* 跟mineAvatarDiv中的width与height一致 */

	text-align: center;
	margin: auto;
	position: relative;
}
.mineAvatarImage{
	width: 128px; /* 跟mineAvatarDiv中的width与height一致 */
	height: 128px;/* 跟mineAvatarDiv中的width与height一致 */
	line-height: 0;	/* remove line-height */ 
	display: inline-block;	/* circle wraps image */
	border-radius: 50%;	/* relative value */
	-moz-border-radius: 50%;
	-webkit-border-radius: 50%;
	transition: linear 0.25s;
}
</style>
<template>
	<div>
		<Drawer :closable="false" width="360" v-model="canShow" placement="left" title="我的资料">
			<p :style="pStyle"><Icon type="ios-aperture" />&nbsp;您的UID为：{{UID_S}}</p>
			<div class="mine-drawer-profile-profile">
				<div class="mineAvatarDiv">
					<img class="mineAvatarImage" :src="imgDir+'/'+AVATAR"></img>
				</div>
			</div>
			<Divider />
			<div class="mine-drawer-profile-profile">
				<Row>
					<Col span="2">&nbsp;<!--用于对齐--></Col>
					<Col span="22">
						<br/><br/>
						<font face="微软雅黑" color="#808695">ID:</font>
						<font face="微软雅黑">{{ID}}</font><br/><br/>
						<font face="微软雅黑" color="#808695">邮箱:</font>
						<font face="微软雅黑">{{EMAIL}}</font><br/><br/>
						<font face="微软雅黑" color="#808695">账户等级:</font>
						<font face="微软雅黑">{{auth2String}}</font><br/><br/>
					</Col>
				</Row>
				<Divider />
				<Row>
					<Col span="1">&nbsp;<!--用于对齐--></Col>
					<Col span="22">
						<Button type="success" long @click="editProfileAction">修 改 资 料</Button>
						<br/><br/>
						<Button type="error" long @click="logout">退 出 登 录</Button>
						<div v-if="AUTH>=10">
							<br/>
							<Divider>管理员控制台</Divider>
							<Button type="primary" long @click="gotoConsoleAction">进 入 控 制 台</Button>
						</div>
					</Col>
					<Col span="1">&nbsp;<!--用于对齐--></Col>
				</Row>
			</div>
		</Drawer>
	</div>
</template>
<script type="text/javascript">
	import {Store} from '../../../store.js';
	import axios from 'axios';
	export default{
		name:"MineWidge",
		inject:['gFrameWindow'],
		data:function(){
			return{
				canShow:false,
				pStyle: {
                    fontSize: '16px',
                    color: 'rgba(0,0,0,0.85)',
                    lineHeight: '24px',
                    display: 'block',
                    marginBottom: '16px'
                },
				UID_S:-1,
				ID:'$ID',
				EMAIL:"$EMAIL",
				AVATAR:"defaultAVATAR.jpg",
				AUTH:-1
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
			},
			auth2String(){
				switch(this.AUTH){
					case 0:
						return '普通会员Lv.'+this.AUTH;
					case 1:
					case 2:
					case 3:
					case 4:
						return '白银会员Lv.'+this.AUTH;
					case 5:
					case 6:
					case 7:
					case 8:
						return '超级会员Lv.'+this.AUTH;
					case 9:
						return '管理员';
					case 10:
						return '超级管理员';
					default:
						return '未知用户';
				}
			}
		},
		methods:{
			initData(){
				var mvue = this;
                axios.get(Store.state.server+"/ProfileManagerServlet",
                    {
                        params: { // get 模式手动赋值
							"jsondata": {"UID":this.myUID}
						}
                    })
                    .then(function (response) {
                        let res = response.data;
                        let isSuccess = res.FLAG;
                        if(isSuccess){
							mvue.canShow = true;
							mvue.UID_S = res.UID;
							mvue.ID = res.ID;
							mvue.EMAIL = res.EMAIL;
							mvue.AUTH = res.AUTH;
							mvue.AVATAR = res.AVATAR;
                        } else {
							mvue.canShow = false;
                            mvue.$Notice.error({
                                title: '获取个人资料失败',
                                desc: res.MSG
                            });
                        }
                    })
                    .catch(function (error) {
						mvue.canShow = false;
                        mvue.$Notice.error({
                            title: '获取个人资料失败',
                            desc: '连接超时：未从服务器获得数据'
                        });
                        console.log(error);
                    });
			},
			logout(){
				this.canShow = false;
				this.gFrameWindow.logout();
			},
			editProfileAction(){
				this.canShow = false;
				this.$router.push("/editProfile"); // 跳转资料修改页
			},
			gotoConsoleAction(){
				this.canShow = false;
				this.$router.push("/console"); // 跳转管理员控制台
			}
		}
	}
</script>