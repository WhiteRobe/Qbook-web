<style>

</style>
<template>
	<div>
		<div style="top:32px;position: relative;">
			<Row>
				<div style="left:32px;margin: 16px;position: relative;">
					<Breadcrumb>
						<BreadcrumbItem to="/shop">
							<Icon type="ios-home"></Icon>&nbsp;商店首页
						</BreadcrumbItem>
						<BreadcrumbItem to="/orderList">
							<Icon type="ios-list-box"></Icon>&nbsp;我的订单列表
						</BreadcrumbItem>
						<BreadcrumbItem>
							<Icon type="ios-eye"></Icon>&nbsp;我的订单详情
						</BreadcrumbItem>
					</Breadcrumb>
				</div>
			</Row>
			<Divider/>
			<Row>
				<Col span="1">&nbsp;<!--用于对齐--></Col>
				<Col span="22">
					<Card shadow bordered >
						<Row  type="flex" justify="center" align="middle" :gutter="20">
							<!--订单信息总览-->
							<Col span="1">&nbsp;<!--用于对齐--></Col>
							<Col span="14">
								<Row v-if="OSTATUS!=='已撤销'">
									<Steps :current="OSTATUS==='已提交'?1:(OSTATUS==='处理中'?2:3)">
											<Step title="已提交" content="订单提交"></Step>
											<Step title="处理中" content="订单后台处理中"></Step>
											<Step title="完成" content="订单完成"></Step>
									</Steps>
								</Row>
								<Row v-else>
									<Alert type="error">订单已撤销</Alert>
								</Row>

								<Divider dashed/>
								<Row>
									<font face="微软雅黑" color="#808695">单号:</font>
									<font face="微软雅黑">{{ORDERID}}</font><br/>
									<font face="微软雅黑" color="#808695">日期:</font>
									<font face="微软雅黑">{{ODATE}}</font>
								</Row>
							</Col>
							<Divider type="vertical" />
							<Col span="6">
								<font face="微软雅黑" color="#2d8cf0" size="5">订单总价:</font>
								<font face="微软雅黑" color="#2d8cf0" size="5">￥{{TOTAL_PRICE.toFixed(2)}}</font>
							</Col>
							<Col span="3">&nbsp;<!--用于对齐--></Col>
						</Row>
					</Card>
					<Divider orientation="left">订单内容</Divider>

					<Row>
						<!--每行搜索到的数据-->
						<div v-if="listDetail.length<=0">
							<Alert show-icon>
								没有任何结果
								<Icon type="ios-bulb-outline" slot="icon"></Icon>
								<template slot="desc">该订单(单号:{{ORDERID}})的数据有误，请联系客服。</template>
							</Alert>
						</div>
						<div v-else>
							<div v-for="(item,index) in listDetail" :key="item.IUID">
								<Card shadow bordered >
									<Row  type="flex" justify="center" align="middle" :gutter="20">
										<Col span="1">&nbsp;<!--用于占位--></Col>
										<Col span="4">
											<img :src="imgDir+'/'+item.COVER_PIC" style="width:100px;height:140px;" @click="handleCoverImgClick(item.IUID)"></img>
										</Col>
										<Col span="6">
											<font face="微软雅黑" color="#808695" >书名:</font>
											<font face="微软雅黑">{{item.INAME}}</font><br/>
											<font face="微软雅黑" color="#808695" >作者:</font>
											<font face="微软雅黑">{{item.AUTHOR}}</font><br/>
											<font face="微软雅黑" color="#808695" >出版社:</font>
											<font face="微软雅黑">{{item.PUBLISHER}}</font><br/>
										</Col>
										<Col span="6">
											<font face="微软雅黑" color="#808695" >ISBN:</font>
											<font face="微软雅黑">{{item.ISBN}}</font><br/>
											<font face="微软雅黑" color="#808695" >数量:</font>
											<font face="微软雅黑">{{item.AMOUNT}}</font><br/>
											<font face="微软雅黑" color="#2d8cf0" >总价:</font>
											<font face="微软雅黑" color="#2d8cf0">￥{{(item.PRICE*(1-item.DISCOUNT/100)*item.AMOUNT).toFixed(2)}}</font><br/>
										</Col>
										<Col span="6">
											<Button type="primary" icon="md-send" long @click="sendToEmail(item.IUID)">发送电子版到邮箱</Button>
										</Col>
										<Col span="1">&nbsp;<!--用于占位--></Col>
									</Row>
								</Card>
								<br/>
							</div>
						</div>
					</Row>
				</Col>
				<Col span="1">&nbsp;<!--用于对齐--></Col>
			</Row>
		</div>
		<Spin size="large" fix v-if="spinShow"></Spin>
		<BackTop :height="200"></BackTop>
	</div>
</template>
<script>
	import axios from 'axios';
	import {Store} from '../../store.js';
  export default{
		name:"ListDetailPage",
		data:function(){
			return{
				spinShow:true,
				listDetail:[],

				ORDERID:"$ORDERID",
				OSTATUS:"已提交",
				TOTAL_PRICE:-1,
				ODATE:"$ODATE"
			}
		},
		computed:{
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
				var jsonMsg = {
					"ORDERID":mvue.$route.query.ORDERID,
					"UID":Store.state.UID
				};
				axios.get(Store.state.server+"/GetOrderListDetailServlet",{ params:{"jsondata":jsonMsg} })
					.then(function (response) {
						let res = response.data;
						let isSuccess = res.FLAG;
						//console.log(res.MSG,isSuccess);
						if(isSuccess){
							//mvue.$Message.info('订单详情获取成功');
							mvue.$Loading.finish(); // 进度条载入完毕
							mvue.spinShow = false;
							mvue.listDetail.splice(0,mvue.listDetail.length); // 清空以重置
							for(var i=0;i<res.ITEMS.length;i++){ // 载入数据
								mvue.listDetail.splice(i,1,res.ITEMS[i]);
							}
							
							mvue.ORDERID = res.ORDER.ORDERID;
							mvue.OSTATUS = res.ORDER.OSTATUS;
							mvue.TOTAL_PRICE = res.ORDER.TOTAL_PRICE;
							mvue.ODATE = res.ORDER.ODATE;
						} else {
							mvue.$Message.error('订单详情获取失败:'+res.MSG);
							mvue.$Loading.error(); // 进度条载入失败
							mvue.spinShow = false;
						}
					})
					.catch(function (error) {
						console.log(error);
						mvue.$Message.error('订单详情获取失败:连接超时!');
						mvue.$Loading.error(); // 进度条载入失败
						mvue.spinShow = false;
					});
			},
			handleCoverImgClick(IUID){
				this.$router.push("/itemDetail?IUID="+IUID);
			},
			sendToEmail(IUID){
				//console.log("发送"+IUID+"到邮箱");
				this.$Message.success({
					content: '已把编号为['+IUID+']的书籍的电子版文件发送到您的邮箱^_^',
					duration: 5,
					closable: true
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