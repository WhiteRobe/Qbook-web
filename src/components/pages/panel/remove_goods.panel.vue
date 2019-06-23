<style>

</style>
<template>
	<div style="top: 20px; left: 20px; margin: auto; width:700px; position: relative;">
		<Divider orientation="left">请输入要移除的商品序号:</Divider>
		<Poptip trigger="focus">
			<div slot="content">您输入的是:{{ inputIUID }}</div>
			<InputNumber  v-model="inputIUID" :min="1" placeholder="请输入要移除的商品序号" style="width: 275px" />
			&nbsp;<Button type="primary" shape="circle" icon="ios-search" @click="search"></Button>
		</Poptip>
		<Divider orientation="left">查询到的待移除商品:</Divider>
		<div v-if="findItem">
			<Card shadow bordered dis-hover >
				<Row :gutter="30">
					<Col span="1">&nbsp;</Col>
					<Col span="7">
						<img :src="imgDir+'/'+book.COVER_PIC" style="width:135px;height:185px;" @click="handleCoverImgClick(book.IUID)"></img>
					</Col>
					<Col span="9">
						<font face="微软雅黑" color="#808695" >书名:</font>
						<font face="微软雅黑" >{{book.INAME}}</font><br/><br/>
						<font face="微软雅黑" color="#808695" >作者:</font>
						<font face="微软雅黑" >{{book.AUTHOR}}</font><br/><br/>
						<font face="微软雅黑" color="#808695" >出版社:</font>
						<font face="微软雅黑" >{{book.PUBLISHER}}</font><br/><br/>
						<font face="微软雅黑" color="#808695" >上架时间:</font>
						<font face="微软雅黑" >{{book.ODATE}}</font><br/><br/>
						<font face="微软雅黑" color="#808695" >ISBN:</font>
						<font face="微软雅黑" >{{book.ISBN}}</font>
					</Col>
					<Col span="6">
						<font face="微软雅黑" color="#808695" >IUID:</font>
						<font face="微软雅黑" >{{book.IUID}}</font><br/><br/>
						<font face="微软雅黑" color="#808695" >单价:</font>
						<font face="微软雅黑" >￥{{book.PRICE}}</font><br/><br/>
						<font face="微软雅黑" color="#808695" >折扣:</font>
						<font face="微软雅黑" >{{book.DISCOUNT}}</font><br/><br/>
						<font face="微软雅黑" color="#808695" >在售状态:</font>
						<font face="微软雅黑" >{{book.ONSALE?'在售':'禁售'}}</font><br/><br/>
						<font face="微软雅黑" color="#808695" >售出量:</font>
						<font face="微软雅黑" >{{book.SALED}} 本</font>
					</Col>
					<Col span="1">&nbsp;</Col>
				</Row>
				<br/><br/>
				<Row>
					<Col span="1">&nbsp;</Col>
					<Col span="23">
						<Poptip confirm title="确认删除该商品?" @on-ok="comfirmDeleteAction" @on-cancel="cancelDeleteAction">
							<Button type="error" long icon="md-trash">删除商品</Button>
						</Poptip>
					</Col>
				</Row>
			</Card>
		</div>
		<div v-else>
			<Alert show-icon>
				没有搜索结果
				<Icon type="ios-bulb-outline" slot="icon"></Icon>
				<template slot="desc">没有搜索到数据，请确认是否输入了正确的商品IUID！ </template>
			</Alert>
		</div>
		<Spin size="large" fix v-if="spinShow"></Spin>
	</div>
</template>
<script type="text/javascript">
	import {Store} from '../../../store.js';
	import axios from 'axios';
	export default{
		name:"RemoveGoodsPanel",
		data:function(){
			return{
				spinShow:false,
				findItem:false,
				inputIUID:0,
				book:{
					IUID:'',
					INAME:'',
					AUTHOR:'',
					PUBLISHER:'',
					DESCS:'',
					PRICE:'',
					DISCOUNT:'',
					COVER_PIC:'',
					ONSALE:true,
					SALED:'',
					// ODATE:'',
					ISBN:''
				}
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
			handleCoverImgClick(IUID){
				this.$router.push("/itemDetail?IUID="+IUID);
			},
			comfirmDeleteAction(){
				if(this.inputIUID<=0 || !this.findItem) return;
				var mvue = this;
				this.$Loading.start();
				this.spinShow = true;
				var jsonMsg = {
					"UID":this.myUID,
					"METHOD":"REMOVE", // INSERT MODIFY REMOVE
					"ITEM":{
						"IUID":this.inputIUID,
						"ISBN":this.book.ISBN
					}
				};
				var fd = new FormData();
				fd.append('jsondata',JSON.stringify(jsonMsg));
				axios({
						url:Store.state.server+"/GoodsManagerServlet",
						data:fd,
						method:'post',
						headers: {'Content-Type': 'multipart/form-data'}//application/x-www-form-urlencoded
					}).then(function (response) {
						let res = response.data;
						let isSuccess = res.FLAG;
						//console.log(res.MSG,isSuccess);
						if(isSuccess){
							mvue.$Message.success('删除商品获取成功');
							mvue.$Loading.finish(); // 进度条载入完毕
							mvue.spinShow = false;
							// 还原页面状态
							mvue.inputIUID = 0;
							mvue.findItem = false;
						} else {
							mvue.$Message.error('删除商品失败:请检查服务器日志！');
							mvue.$Loading.error(); // 进度条载入失败
							mvue.spinShow = false;
						}
					}).catch(function (error) {
						console.log(error);
						mvue.$Message.error('删除商品失败:连接超时!');
						mvue.$Loading.error(); // 进度条载入失败
						mvue.spinShow = false;
					});
			},
			cancelDeleteAction(){
				// Do nothing...
			},
			search(){
				var mvue = this;
				var jsonMsg = {
					"IUID":this.inputIUID,
					"UID":this.myUID
				};
				this.spinShow = true;
				this.findItem = false;
				this.$Loading.start();
				axios.get(Store.state.server+'/GoodsManagerServlet',{params:{'jsondata':jsonMsg}})
					.then(function (response) {
						let res = response.data;
						let isSuccess = res.FLAG;
						//console.log(res.MSG,isSuccess);
						if(isSuccess){
							mvue.spinShow = false;
							mvue.findItem = true;
							mvue.$Loading.finish(); // 进度条载入完毕

							mvue.book.IUID = res.ITEM.IUID;
							mvue.book.INAME = res.ITEM.INAME;
							mvue.book.AUTHOR = res.ITEM.AUTHOR;

							mvue.book.PUBLISHER = res.ITEM.PUBLISHER;
							mvue.book.DESCS = res.ITEM.DESCS;
							mvue.book.PRICE = res.ITEM.PRICE;

							mvue.book.DISCOUNT = res.ITEM.DISCOUNT;
							mvue.book.COVER_PIC = res.ITEM.COVER_PIC;
							mvue.book.ONSALE = res.ITEM.ONSALE;
							
							mvue.book.SALED = res.ITEM.SALED;
							mvue.book.ODATE = res.ITEM.ODATE;
							mvue.book.ISBN = res.ITEM.ISBN;
						} else {
							mvue.$Message.error('商品详情获取失败:'+res.MSG);
							mvue.$Loading.error(); // 进度条载入失败
							mvue.spinShow = false;
						}
					})
					.catch(function (error) {
						console.log(error);
						mvue.$Message.error('商品详情获取失败:连接超时!');
						mvue.$Loading.error(); // 进度条载入失败
						mvue.spinShow = false;
					});
			}
		}
	}
</script>