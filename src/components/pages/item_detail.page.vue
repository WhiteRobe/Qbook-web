<style>

</style>
<template>
	<div>
		<div style="top:32px;position: relative;position: relative;">
			<div style="left:32px;margin: 16px;position: relative;">
				<Breadcrumb>
					<BreadcrumbItem to="/shop">
						<Icon type="ios-home"></Icon>&nbsp;商店首页
					</BreadcrumbItem>
					<BreadcrumbItem>
						<Icon type="ios-book"></Icon>&nbsp;书籍详情 : 《{{bookName}}》
					</BreadcrumbItem>
				</Breadcrumb>
			</div>
			<Divider orientation="left">商品详情</Divider>
			<!--<div :style="{backgroundImage:'url('+ItemDetailBGURL+')',height:472+'px',margin:'10px 96px 10px 96px'}">-->
			<div style="margin:10px 96px 10px 96px;position: relative;">
				<Card shadow bordered dis-hover>
					<Row :gutter="200">
						<Col span="3">&nbsp;<!--仅用于对齐--></Col>
						<Col span="6">
							<Card shadow bordered style="top:10px;text-align: center;position: relative;margin:auto; min-width:212px; min-height：240px;">
								<img :src="imgDir+'/'+bookcoverURL" style="width:135px;height:185px;" @click="handleCoverImgClick"></img><br/>
								<font face="微软雅黑" color="#808695">书名:</font>
								<font face="微软雅黑">{{bookName}}</font><br/>
								<font face="微软雅黑" color="#808695">作者:</font>
								<font face="微软雅黑">{{author}}</font><br/>
								<font face="微软雅黑" color="#808695">出版社:</font>
								<font face="微软雅黑">{{publisher}}</font><br/>
								<font face="微软雅黑" color="#808695">ISBN:</font>
								<font face="微软雅黑">{{isbn}}</font><br/>
							</Card>
							<br/>
							<div style="left:32px;top32px;min-width:212px;margin:0px 10px 0px 0px;position: relative;">
								<font face="微软雅黑" color="#808695">为这本书打分:</font><br/>
								<Rate v-model="rateValue" @on-change="rateChange" :disabled="!rateCanChange"/>
							</div>
						</Col>
						<Col span="12">
							<Card shadow bordered style="top:20px;position: relative;">
								<Row >
									<div style="min-height:312px;position: relative;margin:5px 0px 0px 0px;">
										<font face="微软雅黑" color="#808695">上架日期 : &nbsp;</font>
										<Tag color="geekblue">{{odate}}</Tag><br/><br/>
										<Tag color="error" v-if="saled>0">热销中</Tag>
										<Tag color="success" v-if="discount>0">打折中</Tag>
										<Divider dashed/>
										<font face="微软雅黑" color="#808695" size="5">单价: &nbsp;</font>
										<font face="微软雅黑" size="5">￥{{price}}</font><br/>
										<font face="微软雅黑" color="#19be6b" size="5">折扣: &nbsp;</font>
										<font face="微软雅黑" color="#19be6b" size="5">{{discount2String}}</font><br/>
										<br/>
										<font face="微软雅黑" color="#2d8cf0" size="6">现价: &nbsp;</font>
										<font face="微软雅黑" color="#2d8cf0" size="6">￥{{countPrice}}</font>
										<Alert show-icon v-if="owoned">
											<Icon type="ios-bulb-outline" slot="icon"></Icon>您已经拥有该书
											<span slot="desc">
												注意，您已经拥有该书，但我们仍允许您多次进行购买以支持本书作者。请问确定要重复购买吗？
											</span>
										</Alert>
									</div>
									<Divider dashed/>
								</Row>
								<Row :gutter="20">
									<Col span="2" order="1">&nbsp;<!--仅用于对齐--></Col>
									<Col span="9" order="2">
										<Button type="primary" long size="large" @click="addToCartAction"><Icon type="md-cart" />&nbsp;加入购物车</Button>&nbsp;&nbsp;
									</Col>
									<Col span="9" order="3">
										<Button type="success" long size="large" @click="buyRightNowAction"><Icon type="md-card" />&nbsp;立即购买</Button>
									</Col>
									<Col span="4" order="4">&nbsp;<!--仅用于对齐--></Col>
								</Row>
							</Card>
						</Col>
						<Col span="3">&nbsp;<!--仅用于对齐--></Col>
					</Row>
				</Card>
			</div>
			<Divider orientation="left">书籍简介</Divider>
			<div style="margin:10px 96px 10px 96px;">
				<Card shadow bordered>
					<font size="5">{{descs}}</font>
				</Card>
			</div>
		</div>
		<!--载入效果-->
		<Spin size="large" fix v-if="spinShow"></Spin>
		<BackTop :height="200"></BackTop>
	</div>
</template>
<script type="text/javascript">
	import {Store} from '../../store.js';
	import axios from 'axios';

	export default{
		name:"ItemDetailPage",
		inject: ['gFrameWindow'],
		data:function(){
			return{
				// 可以打分
				rateCanChange:true, 
				rateValue:0,
				//ItemDetailBGURL:ItemDetailBG,// 背景
				//---
				spinShow:true,
				iuid:-1,
				bookName:'$bookName',
				author:'$author',
				publisher:'$publisher',
				isbn:'$isbn',
				bookcoverURL:'default_book_cover.jpg',
				price:-1.0,
				discount:-1,
				descs:'$descs',
				odate:'$odate',
				saled:0,
				owoned:false
			}
		},
		computed:{
			serverURL(){
				return Store.state.server;
			},
			imgDir(){
				return Store.state.imgDir;
			},
			countPrice(){
				return (this.price*(1-this.discount/100.0)).toFixed(2);
			},
			discount2String(){
				return ''+this.discount+' %off'
			}
		},
		methods:{
			spinOff(){
				this.spinShow = false;
			},
			spinOn(){
				this.spinShow = true;
			},
			handleCoverImgClick(){
				// Do nothing here ...
			},
			buyRightNowAction(){
				// console.log('立即购买'+this.iuid);
				if(Store.state.UID==-1){
					this.$Message.warning('您未登录或已掉线，请刷新页面或重新登陆后重试!');
				} else {
					this.addToCartAction(); // 添加购物车
					this.gFrameWindow.loadCartData();// 弹出购物车页面
				}
			},
			addToCartAction(){
				//var IUID = this.iuid;
				if(Store.state.UID==-1){
					this.$Message.warning('您未登录或已掉线，请刷新页面或重新登陆后重试!');
				} else {
					var mvue = this;
					mvue.$Loading.start();
					var jsonMsg = {
						"UID":Store.state.UID,
						"IUID":this.iuid,
						"AMOUNT":1, // 暂时默认只添加/移除一件商品
						"METHOD":'MODIFY' // 修改模式
					};
					axios.post(Store.state.server+"/CartManagerServlet","jsondata="+JSON.stringify(jsonMsg))
						.then(function (response) {
							let res = response.data;
							let isSuccess = res.FLAG;
							if(isSuccess){
								mvue.$Message.info('添加成功，但请您注意：©快购阅读提倡"第一瞬间的感觉"，当您离开应用时您的购物车将会被清空TAT');
								mvue.$Loading.finish(); // 进度条载入完毕
							} else {
								mvue.$Message.error('添加失败:'+res.MSG);
								mvue.$Loading.error(); // 进度条载入失败
							}
						})
						.catch(function (error) {
							// console.log(error);
							mvue.$Message.error('添加失败:'+res.MSG);
							mvue.$Loading.error(); // 进度条载入失败
						});
				}
			},
			rateChange(){
				// 书本打分结束
				if(Store.state.UID==-1){
					this.$Message.warning('您尚未登陆，无法进行打分');
				} else {
					this.$Loading.start();
					this.$Message.success('打分成功');
					this.rateCanChange= false;
					this.$Loading.finish();
				}
			},
			getPageData(IUID){
				// 获取页面数据
				this.iuid = IUID; // 保证为int
				this.$Loading.start();
				this.spinShow = true;
				var mvue = this;
				axios.get(Store.state.server+'/GoodsManagerServlet',
					{
						params:{
							'jsondata':{"IUID":mvue.iuid, "UID":Store.state.UID}
						}
					})
					.then(function (response) {
						mvue.$Loading.finish();
						mvue.spinShow = false;
						let res = response.data;
						let isSuccess = res.FLAG;
						if(isSuccess){
							//console.log(res);
							mvue.owoned = res.OWNED;
							mvue.bookName = res.ITEM.INAME;
							mvue.author = res.ITEM.AUTHOR;
							mvue.publisher = res.ITEM.PUBLISHER;
							mvue.isbn = res.ITEM.ISBN;
							mvue.price = res.ITEM.PRICE;
							mvue.discount = res.ITEM.DISCOUNT;
							mvue.bookcoverURL = res.ITEM.COVER_PIC;
							mvue.descs = res.ITEM.DESCS;
							mvue.saled = res.ITEM.SALED;
							mvue.odate = res.ITEM.ODATE;
						} else {
							mvue.$Notice.error({
								title: '获取数据失败',
								desc: res.MSG
							});
						}
					})
					.catch(function (error) {
						mvue.$Loading.error();
						mvue.$Message.error('载入页面数据失败，请刷新重试');
						console.log(error);
					});
			}
		},
		beforeRouteEnter (to, from, next) {
			next(vm => {
				// 通过 `vm` 访问组件实例
				let IUID = parseInt(''+to.query.IUID);
				vm.getPageData(IUID);
			});
		},
		beforeRouteUpdate (to, from, next) {
			// 重复更新组件
			let IUID = parseInt(''+to.query.IUID); // 保证为int
			this.getPageData(IUID);
			next();
		}
	}
</script>