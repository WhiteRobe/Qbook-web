<style>
.search-back-to-shop-top{
	padding: 10px;
	background: rgba(0, 153, 229, .7);
	color: #fff;
	text-align: center;
	border-radius: 2px;
}
</style>
<template>
	<div>
		<div style="top:32px;position: relative;">
			<div style="text-align: center;width:620px;margin: auto;">
				<Input search enter-button placeholder="查找您要搜索的电子书籍.." @on-search="handleSearch">
					<Select v-model="m_type" slot="prepend" style="width: 80px">
						<Option value="bookName">书名</Option>
						<Option value="authorName">作者名</Option>
						<Option value="publiserName">出版社</Option>
					</Select>
				</Input>
			</div>
			<Divider/>
			<Row>
				<Col span="4">
					<div style="text-align: center;margin: auto;">
						<h3>搜索过滤</h3>
						<Divider dashed/>
						<RadioGroup v-model="m_filter" vertical @on-change="getPageData">
							<Radio label="hot">书籍销量</Radio>
							<Radio label="time">上架时间</Radio>
							<Radio label="discount">折扣力度</Radio>
						</RadioGroup>
						<br/><br/>
						<RadioGroup v-model="m_order" type="button" size="large" @on-change="getPageData">
							<Radio label="asc">升序</Radio>
							<Radio label="desc">降序</Radio>
						</RadioGroup>
					</div>
				</Col>
				<Col span="19">
					<Row>
						<!--每行搜索到的数据-->
						<div v-if="totalHitNum<=0">
							<Alert show-icon>
								没有任何结果
								<Icon type="ios-bulb-outline" slot="icon"></Icon>
								<template slot="desc">请检查您的搜索关键字及筛选方案</template>
							</Alert>
						</div>
						<div v-else>
							<div v-for="(item,index) in searchResult" :key="item.IUID">
								<Card shadow bordered >
									<Row  type="flex" justify="center" align="middle">
										<Col span="2">&nbsp;<!--用于对齐--></Col>
										<Col span="3">
											<img :src="imgDir+'/'+item.COVER_PIC" style="width:100px;height:145px;" @click="handleCoverImgClick(item.IUID)"></img>
										</Col>
										<Col span="9">
											<font face="微软雅黑" color="#808695">书名:</font>
											<font face="微软雅黑">{{item.INAME}}</font><br/>
											<font face="微软雅黑" color="#808695">作者:</font>
											<font face="微软雅黑">{{item.AUTHOR}}</font><br/>
											<font face="微软雅黑" color="#808695">出版社:</font>
											<font face="微软雅黑">{{item.PUBLISHER}}</font><br/>
											<font face="微软雅黑" color="#808695">ISBN:</font>
											<font face="微软雅黑">{{item.ISBN}}</font><br/>
											<font face="微软雅黑" color="#808695">单价:</font>
											<font face="微软雅黑">￥{{item.PRICE}}</font><br/>
										</Col>
										<Col span="7">
											<Tooltip placement="top" :content="item.DESCS" :delay="500" transfer max-width="450">
												<Button type="warning" long ><Icon type="md-bookmarks" />&nbsp;查 看 简 介</Button>
											</Tooltip>
											&nbsp;
											<Button type="success" @click="addToCart(item.IUID)"><Icon type="md-cart" />&nbsp;加 入 购 物 车</Button>
											<br/><br/>
											<Button type="primary" long :to="'/itemDetail?IUID='+item.IUID">
												<Icon type="ios-book" />&nbsp;查 看 详 情
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
							<Page :total="totalHitNum" show-elevator @on-change="changePage" show-total :page-size="6"/>
						</div>
					</Row>
				</Col>
				<Col span="1">&nbsp;<!--用于对齐--></Col>
			</Row>
		</div>
		<!--载入效果-->
		<Spin size="large" fix v-if="spinShow"></Spin>
		<BackTop :height="200"></BackTop>
		<BackTop :height="0" :bottom="30" :right="88" on-click="goToShopPage">
			<div class="search-back-to-shop-top">返回商店首页</div>
		</BackTop>
	</div>
</template>
<script type="text/javascript">
	import axios from 'axios';
	import {Store} from '../../store.js';
	export default{
		name:"SearchPage",
		data:function(){
			return{
				spinShow:true,
				page:0, // 当前页数
				totalHitNum:0, // 总结果数
				searchResult:[], // 搜索结果

				m_type:"bookName", // 搜索类型 [ bookName | authorName] 
				m_order:'decs', // 排序方法 [ asc | desc ]
				m_filter:'hot' // 过滤因子 [hot | time | discount]
			}
		},
		created(){
			this.m_type = this.$route.query.searchType;
			this.m_filter = this.$route.query.filter;
			this.m_order = this.$route.query.order;
			this.getPageData();
		},
		methods:{
			goToShopPage(){
				this.$router.push("/shop");
			},
			handleSearch(value){
				if(value===""){
					this.$Message.info('没有填入搜索关键字');
					return;
				}
				else {
					this.$router.push("/search?key="+value+"&searchType="+this.searchType);
					this.getPageData();
				}
			},
			changePage(page_index){
				// 改变页码
				this.page = page_index-1; // 页码从0记起
				this.getPageData();
			},
			getPageData(){
				// 获取某一页的数据
				this.$Loading.start();
				this.spinShow = true;
				var mvue = this;
				axios.get(Store.state.server+'/GetSearchResultServlet',
					{
						params:{
							"jsondata":{
								"KEY":mvue.searchKey,
								"PAGE":mvue.page,
								"FILTER":mvue.searchFilterValue,
								"TYPE":mvue.searchTypeValue,
								"ORDER":mvue.searchOrderValue
							}
						}
					})
					.then(function (response) {
						mvue.$Loading.finish();
						mvue.spinShow = false;
						let res = response.data;
						let isSuccess = res.FLAG;
						if(isSuccess){
							//console.log(res);
							mvue.searchResult.splice(0,mvue.searchResult.length);// 清空显示内容
							for(var i=0;i<res.ITEMS.length;i++){
								mvue.searchResult.splice(i,1,res.ITEMS[i]);
							}
							mvue.totalHitNum = parseInt(''+res.TOTAL); // 强制转化为int
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
			handleCoverImgClick(IUID){
				this.$router.push("/itemDetail?IUID="+IUID);
			},
			addToCart(IUID){
				if(Store.state.UID==-1){
					this.$Message.warning('您未登录或已掉线，请刷新页面或重新登陆后重试');
				} else {
					var mvue = this;
					mvue.$Loading.start();
					var jsonMsg = {
						"UID":Store.state.UID,
						"IUID":IUID,
						"AMOUNT":1, // 暂时默认只添加/移除一件商品
						"METHOD":'MODIFY' // 修改模式
					};
					axios.post(Store.state.server+"/CartManagerServlet","jsondata="+JSON.stringify(jsonMsg))
						.then(function (response) {
							let res = response.data;
							let isSuccess = res.FLAG;
							//console.log(res.MSG,isSuccess);
							if(isSuccess){
								mvue.$Message.info('添加成功，但请您注意：©快购阅读提倡"第一瞬间的感觉"，当您离开应用时您的购物车将会被清空TAT');
								mvue.$Loading.finish(); // 进度条载入完毕
							} else {
								mvue.$Message.error('添加失败:'+res.MSG);
								mvue.$Loading.error(); // 进度条载入失败
							}
						})
						.catch(function (error) {
							//console.log(error);
							mvue.$Loading.error(); // 进度条载入失败
						});
				}
			}
		},
		computed:{
			serverURL(){
				return Store.state.server;
			},
			imgDir(){
				return Store.state.imgDir;
			},
			searchKey(){
				let key = this.$route.query.key;
				if(key!=undefined) return key;
				else return '';
			},
			searchFilterValue(){
				// 默认hot 且enum[hot | time | discount]
				if(this.m_filter!=undefined){
					if(this.m_filter==='time') return this.m_filter;
					else if(this.m_filter==='discount') return this.m_filter;
					return 'hot';
				}
				else return 'hot';
			},
			searchTypeValue(){
				// 默认搜书名 且enum[ bookName | autherName | publiserName ]
				if(this.m_type!=undefined){
					if(this.m_type==='authorName') return this.m_type;
					else if(this.m_type==='publiserName') return this.m_type;
					else return 'bookName';
				}
				else return 'bookName';
			},
			searchOrderValue(){
				// 默认降序 且enum[ asc | desc ]
				if(this.m_order!=undefined){
					if(this.m_order==='asc') return this.m_order;
					else return 'desc';
				}
				else return 'desc';
			}
		}
	}
</script>