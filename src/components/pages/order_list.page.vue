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
						<BreadcrumbItem>
							<Icon type="ios-list-box"></Icon>&nbsp;我的订单列表
						</BreadcrumbItem>
					</Breadcrumb>
				</div>
			</Row>
			<Divider/>
			<Row>
				<Col span="1">&nbsp;<!--用于对齐--></Col>
				<Col span="22">
					<Row>
						<!--每行搜索到的数据-->
						<div v-if="totalHitNum<=0">
							<Alert show-icon>
								没有任何结果
								<Icon type="ios-bulb-outline" slot="icon"></Icon>
								<template slot="desc">您还没有进行过任何的购买。</template>
							</Alert>
						</div>
						<div v-else>
							<div v-for="(item,index) in orderList" :key="item.ORDERID">
								<Card shadow bordered >
									<Row  type="flex" justify="center" align="middle" :gutter="20">
										<Col span="1">&nbsp;<!--用于对齐--></Col>
										<Col span="14">

											<Row v-if="item.OSTATUS!=='已撤销'">
												<Steps :current="item.OSTATUS==='已提交'?1:(item.OSTATUS==='处理中'?2:3)">
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
												<font face="微软雅黑">{{item.ORDERID}}</font><br/>
												<font face="微软雅黑" color="#808695">日期:</font>
												<font face="微软雅黑">{{item.ODATE}}</font>
											</Row>
										</Col>
										<Divider type="vertical" />
										<Col span="6">
											<font face="微软雅黑" color="#2d8cf0" size="5">总价:</font>
											<font face="微软雅黑" color="#2d8cf0" size="5">￥{{item.TOTAL_PRICE.toFixed(2)}}</font><br/><br/>
											<Button type="primary" long :to="'/listDetail?ORDERID='+item.ORDERID">
												<Icon type="md-eye" />&nbsp;查 看 详 情
											</Button>
										</Col>
										<Col span="3">&nbsp;<!--用于对齐--></Col>
									</Row>
								</Card>
								<br/>
							</div>
						</div>
					</Row>
					<Row>
						<!--页码导航-->
						<div style="text-align: center;margin: auto;">
							<Page :total="totalHitNum" show-elevator @on-change="changePage" show-total :page-size="pageSize"/>
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
		name:"OrderListPage",
		data:function(){
			return{
				spinShow:true,
				totalHitNum:0,
				pageSize:10, // 每页显示的数目
				orderList:[]
			}
		},
		methods:{
			changePage(pageIndex){
				this.getPageData(pageIndex);
			},
			getPageData(page){
					var mvue = this;
					var jsonMsg = {
						"UID":Store.state.UID,
						"ITEMNUM":this.pageSize,
						"PAGE":(page-1)
					};
					axios.post(Store.state.server+"/GetOrderListServlet","jsondata="+JSON.stringify(jsonMsg))
						.then(function (response) {
							let res = response.data;
							let isSuccess = res.FLAG;
							//console.log(res.MSG,isSuccess);
							if(isSuccess){
								//mvue.$Message.info('订单列表获取成功');
								mvue.$Loading.finish(); // 进度条载入完毕
								mvue.orderList.splice(0,mvue.orderList.length); // 清空以重置
								for(var i=0;i<res.ITEMS.length;i++){ // 载入数据
									mvue.orderList.splice(i,1,res.ITEMS[i]);
								}
								mvue.totalHitNum = res.TOTAL;
							} else {
								mvue.$Message.error('订单列表获取失败:'+res.MSG);
								mvue.$Loading.error(); // 进度条载入失败
							}
						})
						.catch(function (error) {
							console.log(error);
							mvue.$Message.error('订单列表获取失败:连接超时!');
							mvue.$Loading.error(); // 进度条载入失败
						});
					this.spinShow = false;
			}
		},
		beforeRouteEnter (to, from, next) {
			next(vm => {
				vm.spinShow = true;
				vm.$Loading.start();
				setTimeout( () => { 
					vm.getPageData(1);
				}, 1500); // 等待AJAX同步用户登陆状态并载入
			});
		}
  }
</script>