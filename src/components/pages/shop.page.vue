<style>

</style>
<template>
	<div>
		<div style="top:32px;position: relative;">
			<div style="text-align: center;width:620px;margin: auto;">
				<Input search enter-button placeholder="查找您要搜索的电子书籍.." @on-search="handleSearch">
					<Select v-model="searchType" slot="prepend" style="width: 80px">
						<Option value="bookName">书名</Option>
						<Option value="authorName">作者名</Option>
						<Option value="publiserName">出版社</Option>
					</Select>
				</Input>
			</div>
			<Divider/>
			<div style="margin: 32px;">
				<font face="微软雅黑" style="font-weight:bold;" size="5">热门物品</font>
				&nbsp;&nbsp;<router-link to="/search?filter=hot"><font color="#808695" size="2">更多&gt;</font></router-link>
				<br/><br/>
				<Row :gutter="16">
					<Col span="4" v-for="(item, index) in hotItems" :key="item.IUID">
						<shop-book 
							:bookcoverURL="imgDir+'/'+item.COVER_PIC" 
							:bookName="item.INAME" 
							:bookUID="item.IUID" 
							:author="item.AUTHOR" 
							:publisher="item.PUBLISHER" 
							:bookDesc="item.DESCS" 
							:price="'￥'+item.PRICE"
							@on-click="jumpToItemDetail"
						></shop-book>
					</Col>
				</Row>
			</div>
			<Divider/>
			<div style="margin: 32px;">
				<font face="微软雅黑" style="font-weight:bold;" size="5">最新物品</font>
				&nbsp;&nbsp;<router-link to="/search?filter=time"><font color="#808695" size="2">更多&gt;</font></router-link>
				<br/><br/>
				<Row :gutter="16">
					<Col span="4" v-for="(item, index) in newItems" :key="item.IUID">
						<shop-book 
							:bookcoverURL="imgDir+'/'+item.COVER_PIC" 
							:bookName="item.INAME" 
							:bookUID="item.IUID" 
							:author="item.AUTHOR" 
							:publisher="item.PUBLISHER" 
							:bookDesc="item.DESCS" 
							:price="'￥'+item.PRICE"
							@on-click="jumpToItemDetail"
						></shop-book>
					</Col>
				</Row>
			</div>
			<Divider/>
			<div style="margin: 32px;">
				<font face="微软雅黑" style="font-weight:bold;" size="5">折扣物品</font>
				&nbsp;&nbsp;<router-link to="/search?filter=discount"><font color="#808695" size="2">更多&gt;</font></router-link>
				<br/><br/>
				<Row :gutter="16">
					<Col span="4" v-for="(item, index) in saleItems" :key="item.IUID">
						<shop-book 
							:bookcoverURL="imgDir+'/'+item.COVER_PIC" 
							:bookName="item.INAME"
							:bookUID="item.IUID" 
							:author="item.AUTHOR" 
							:publisher="item.PUBLISHER" 
							:bookDesc="item.DESCS" 
							:price="'￥'+item.PRICE"
							:discount="item.DISCOUNT"
							@on-click="jumpToItemDetail"
						></shop-book>
					</Col>
				</Row>
			</div>
		</div>
		<!--载入效果-->
		<Spin size="large" fix v-if="spinShow"></Spin>
		<BackTop :height="200"></BackTop>
	</div>
</template>
<script type="text/javascript">
	import {Store} from '../../store.js';
	import ShopBook from '../items/shop.book.vue';
	import axios from 'axios';
	//import ShopBG from '../../pics/shop_bg.jpg';
	export default{
		name:"ShopPage",
		data:function(){
			return{
				spinShow:true,
				searchType:'bookName',//搜索类型 [bookName | authorName] 
				//ShopBGURL:ShopBG,
				hotItems:[],
				newItems:[],
				saleItems:[]
			}
		},
		created(){
			this.$Loading.start();
			this.spinShow = true;
			var mvue = this;
			axios.get(Store.state.server+'/GetShopPageDataServlet')
				.then(function (response) {
					mvue.$Loading.finish();
					mvue.spinShow = false;
					let res = response.data;
					let isSuccess = res.FLAG;
					if(isSuccess){
						//console.log(res);
						mvue.hotItems.splice(0,mvue.hotItems.length);// 清空显示内容
						mvue.newItems.splice(0,mvue.newItems.length);// 清空显示内容
						mvue.saleItems.splice(0,mvue.saleItems.length);// 清空显示内容
						// 载入显示内容
						for(var i=0;i<res.HOTITEMS.length;i++){
							mvue.hotItems.splice(i,1,res.HOTITEMS[i]);
						}
						for(var i=0;i<res.NEWITEMS.length;i++){
							mvue.newItems.splice(i,1,res.NEWITEMS[i]);
						}
						for(var i=0;i<res.SALEITEMS.length;i++){
							mvue.saleItems.splice(i,1,res.SALEITEMS[i]);
						}
						//this.hotItems=res.HOTITEMS;
						//mvue.newItems=res.NEWITEMS;
						//mvue.saleItems=res.SALEITEMS;
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
			spinOff(){
				this.spinShow = false;
			},
			spinOn(){
				this.spinShow = true;
			},
			handleSearch(value){
				if(value===""){
					this.$Message.info('没有填入搜索关键字');
					return;
				}
				else this.$router.push("/search?key="+value+"&searchType="+this.searchType);
			},
			jumpToItemDetail(IUID){
				//console.log(IUID);
				// 跳转到商品详情页面
				this.$router.push("/itemDetail?IUID="+IUID);
			}
		},
		components:{
			'shop-book':ShopBook
		}
	}
</script>