<style>
.cart-drawer-profile{
	font-size: 14px;
}
.cart-list{
	overflow-y: auto;
	max-height: 550px;
	overflow-x: hidden;
	/*max-width:640px;*/
}
.cart-payment-spin-load{
	animation: cart-ani-demo-spin 1s linear infinite;
}
@keyframes cart-ani-demo-spin {
	from { transform: rotate(0deg);}
	50%  { transform: rotate(180deg);}
	to   { transform: rotate(360deg);}
}
</style>
<template>
	<div>
		<Drawer :closable="false" width="640" v-model="canShow">
			<div class="cart-drawer-profile">
				<Alert show-icon>
					<Icon type="ios-bulb-outline" slot="icon"></Icon>
					<p>&nbsp;我们的理念</p>
					<template slot="desc">
						©快购阅读提倡“第一眼的爱上”，购物车中的内容只会为您保留30分钟。<br/>喜爱，从不等待。感谢您对我们的理念的理解与支持。
					</template>
				</Alert>
			</div>
			<Divider />
			<!--购物车内容-->
			<p :style="pStyle"><Icon type="md-cart" />&nbsp;购 物 车</p>
			<div class="cart-list">
				<div v-show="cartItems.length<=0">
					<Alert banner type="warning">购物车中没有任何物品。</Alert>
				</div>
				<div v-for="(item, index) in cartItems" :key="item.IUID">
					<Row>
						<Card shadow bordered >
							<Row  type="flex" justify="center" align="middle">
								<Col span="3">
									<img :src="imgDir+'/'+item.COVER_PIC" style="width:50px;height:72px;" @click="handleCoverImgClick(item.IUID)"></img>
								</Col>
								<Col span="7">
									<font face="微软雅黑" color="#808695">书名:</font>
									<font face="微软雅黑">{{item.INAME}}</font><br/>
									<font face="微软雅黑" color="#808695">作者:</font>
									<font face="微软雅黑">{{item.AUTHOR}}</font><br/>
									<font face="微软雅黑" color="#808695">出版社:</font>
									<font face="微软雅黑">{{item.PUBLISHER}}</font><br/>
								</Col>
								<Col span="7">
									<font face="微软雅黑" color="#808695">ISBN:</font>
									<font face="微软雅黑">{{item.ISBN}}</font><br/>
									<font face="微软雅黑" color="#19be6b" v-if="item.DISCOUNT>0">折扣:</font>
									<font face="微软雅黑" color="#19be6b" v-if="item.DISCOUNT>0">{{item.DISCOUNT}}%off</font><br/>
									<font face="微软雅黑" color="#808695">单价:</font>
									<font face="微软雅黑">￥{{item.PRICE}}</font><br/>
								</Col>
								<Col span="4">
									<font face="微软雅黑" color="#2d8cf0">现价:</font>
									<font face="微软雅黑" color="#2d8cf0">￥{{(item.PRICE*(1-item.DISCOUNT/100.0)).toFixed(2)}}</font><br/><br/>
									<Button size="large" long icon="md-trash" type="error" @click="removeCartItem(item.IUID)">移除</Button>
								</Col>
								<Col span="1">&nbsp;<!--用于对齐--></Col>
							</Row>
						</Card>
						<br/>
					</Row>
				</div>
			</div>
			<Divider orientation="right"><font color="#2b85e4">总价:{{totalPrice}}</font></Divider>
			<Button size="large" long icon="md-log-in" type="primary" @click="submit">提 交 订 单</Button>
			<Spin fix v-if="paymentSpinShow">
				<Icon type="ios-loading" size=18 class="cart-payment-spin-load"></Icon>
				<div>支付中...</div>
			</Spin>
		</Drawer>
	</div>
</template>
<script type="text/javascript">
	import {Store} from '../../../store.js';
	import axios from 'axios';
	export default{
		name:"CartWidge",
		data:function(){
			return{
				canShow:false,
				paymentSpinShow:false,
				pStyle: {
                    fontSize: '16px',
                    color: 'rgba(0,0,0,0.85)',
                    lineHeight: '24px',
                    display: 'block',
                    marginBottom: '16px'
                },
				cartItems:[] // 购物车内容
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
			totalPrice(){
				var sum = 0;
				for(var i=0;i<this.cartItems.length;i++){
					let item = this.cartItems[i];
					sum += parseFloat( (item.PRICE*(1-item.DISCOUNT/100.0)).toFixed(2) ); // toFixed会返回字符串
				}
				return sum.toFixed(2); // 转2位字符串
			}
		},
		methods:{
			submit(){
				if(this.myUID==-1)return; // just for robust
				if(this.cartItems.length<=0){
					this.$Message.info('购物车中没有可供提交的内容!');
					this.canShow = false; // 关闭抽屉框
					return;
				}
				// 交易
				var mvue = this;
				this.doPayMent().then( (paymentSuccessFlag) => {
					// console.log("开始发送订单");
					if(!paymentSuccessFlag){
						mvue.$Message.error('支付失败，请稍后重试!');
						return;
					}
					mvue.$Loading.start();
					var jsonMsg = {
						"UID":mvue.myUID,
						"ITEMS":mvue.cartItems
					}
					// 提交订单
					axios.post(Store.state.server+"/OrderSubmitServlet","jsondata="+JSON.stringify(jsonMsg))
						.then(function (response) {
							let res = response.data;
							let isSuccess = res.FLAG;
							//console.log(res.MSG,isSuccess);
							if(isSuccess){
								mvue.$Message.info('订单提交成功');
								mvue.$Loading.finish(); // 进度条载入完毕
								mvue.$router.push("/orderList"); // 跳到我的订单页面
								mvue.canShow = false; // 关闭抽屉框
								mvue.cartItems.splice(0,mvue.cartItems.length);// 清空购物车显示内容
							} else {
								mvue.$Message.error('订单提交失败:'+res.MSG);
								mvue.$Loading.error(); // 进度条载入失败
							}
						})
						.catch(function (error) {
							console.log(error);
							mvue.$Message.error('订单提交失败:连接超时!');
							mvue.$Loading.error(); // 进度条载入失败
						});
					}
				);
			},
			removeCartItem(IUID){
				if(this.myUID == -1){
					this.$Message.warning('您未登录或已掉线，请刷新页面或重新登陆后重试');
					return;
				}
				var jsonMsg = {
					"UID":this.myUID,
					"IUID":IUID,
					"AMOUNT":1, // 暂时默认只添加/移除一件商品
					"METHOD":'DELETE' // 修改模式
				};
				var mvue = this;
				mvue.$Loading.start(); // 进度条开始载入
				axios.post(Store.state.server+"/CartManagerServlet","jsondata="+JSON.stringify(jsonMsg))
					.then(function (response) {
						let res = response.data;
						let isSuccess = res.FLAG;
						//console.log(res.MSG,isSuccess);
						if(isSuccess){
							//console.log(mvue.cartItems);
							for(var i=0;i<mvue.cartItems.length;i++){
								//console.log(mvue.cartItems[i].IUID, IUID);
								if(mvue.cartItems[i].IUID == IUID){
									mvue.cartItems.splice(i,1); // 响应式移除
									break;
								}
							}
							//console.log(mvue.cartItems);
							mvue.$Message.info('移除商品成功');
							mvue.$Loading.finish(); // 进度条载入完毕
						} else {
							mvue.$Message.error('移除商品成功失败:'+res.MSG);
							mvue.$Loading.error(); // 进度条载入失败
						}
					})
					.catch(function (error) {
						//console.log(error);
						mvue.$Message.error('移除商品成功失败:连接超时!');
						mvue.$Loading.error(); // 进度条载入失败
						this.canShow = false;
						this.canShow = true;
					});
			},
			handleCoverImgClick(IUID){
				this.canShow = false;
				this.$router.push("/itemDetail?IUID="+IUID);
			},
			doPayMent(){
				// 支付 此时默认支付 模拟支付过程
				var mvue = this;
				mvue.paymentSpinShow = true;
				var mPromise = new Promise( (resolve, reject) => {
					setTimeout(function(){
						mvue.$Message.info('订单确认中请等待...');
						mvue.paymentSpinShow = false;
						let paymentSuccessFlag = true;
						resolve(paymentSuccessFlag);
					}, 1000);
				});
				return mPromise;
			}
		}
	}
</script>