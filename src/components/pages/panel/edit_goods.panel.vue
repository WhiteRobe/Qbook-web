<style>

</style>
<template>
	<div style="top: 20px; left: 20px; margin: auto; width:700px; position: relative;">
		<Divider orientation="left">请输入待修改的商品序号:</Divider>
		<Poptip trigger="focus">
			<div slot="content">您输入的是:{{ inputIUID }}</div>
			<InputNumber  v-model="inputIUID" :min="1" placeholder="请输入要修改的商品序号" style="width: 275px" />
			&nbsp;<Button type="primary" shape="circle" icon="ios-search" @click="search"></Button>
		</Poptip>
		<Divider orientation="left">查询到的待修改商品:</Divider>
		<div v-if="findItem">
			<Row>
				<div style="text-align: center;">
					<img :src="imgDir+'/'+book.COVER_PIC" style="width:135px;height:185px;" @click="handleCoverImgClick(book.IUID)"></img>
					<br/>
					<font face="微软雅黑" color="#808695" >IUID:</font>
					<font face="微软雅黑" >{{book.IUID}}</font>
				</div>
			</Row>
			<br/><br/>
			<Row>
				<Form :model="book" label-position="top" :rules="ruleValidate" ref="formValidate">
					<FormItem label="书名" prop="INAME">
						<Input type="text" v-model="book.INAME" placeholder="请输入书名..."></Input>
					</FormItem>
					<FormItem label="作者名" prop="AUTHOR">
						<Input type="text" v-model="book.AUTHOR" placeholder="请输入作者名..."></Input>
					</FormItem>
					<FormItem label="出版社" prop="PUBLISHER">
						<Input type="text" v-model="book.PUBLISHER" placeholder="请输入出版社..."></Input>
					</FormItem>
					<FormItem label="简介" prop="DESCS">
						<Input type="textarea" v-model="book.DESCS" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入商品简介..."></Input>
					</FormItem>
					<FormItem label="价格" prop="PRICE">
						<Input type="text" v-model="book.PRICE" placeholder="请输入商品价格..."></Input>
					</FormItem>
					<FormItem label="折扣" prop="DISCOUNT">
						<Input type="text" v-model="book.DISCOUNT" placeholder="请输入商品折扣..."></Input>
					</FormItem>
					<FormItem label="在售状态" prop="ONSALE">
						<RadioGroup v-model="book.ONSALE">
							<Radio label="true">在售</Radio>
							<Radio label="false">禁售</Radio>
						</RadioGroup>
					</FormItem>
					<FormItem label="ISBN" prop="ISBN">
						<Input type="text" v-model="book.ISBN" placeholder="请输入书的ISBN..."></Input>
					</FormItem>
					<FormItem label="封面" ><!--最大5MB-->
						<Upload :action="serverURL+'/FileUploadServlet'" :max-size="1024*5" 
						:name="book.ISBN" show-upload-list :before-upload="manualUpload">
							<Button icon="ios-cloud-upload-outline">更改封面图片文件</Button>
							&nbsp;<Icon type="md-checkmark-circle" color="#19be6b" v-if="file!=undefined"/>
						</Upload>
					</FormItem>
					<!--提交按钮-->
					<FormItem>
						<Button type="primary" long icon="ios-cloud-upload" @click="handleSubmitValidate">提 交</Button>
					</FormItem>
				</Form>
			</Row>
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
		name:"EditGoodsPanel",
		data:function(){
			return{
				findItem:false,
				spinShow:false,
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
					ONSALE:'true', // 这里用了Radio 组件 通过  book.ONSALE==='true'转为真值
					// SALED:'',
					// ODATE:'',
					ISBN:''
				},
				file:undefined,
				ruleValidate:{
					INAME:[
						{ required: true, message: '书名不能为空', trigger: 'blur' },
						{ type: "string", max:50, message: '书名最长为50个字符', trigger: 'blur' }
					],
					AUTHOR:[
						{ required: true, message: '作者名不能为空', trigger: 'blur' },
						{ type: "string", max:100, message: '作者名最长为100个字符', trigger: 'blur' }
					],
					PUBLISHER:[
						{ required: true, message: '出版社名不能为空', trigger: 'blur' },
						{ type: "string", max:40, message: '出版社名最长为40个字符', trigger: 'blur' }
					],
					DESCS:[
						{ required: true, message: '简介不能为空', trigger: 'blur' },
						{ type: "string", max:300, message: '简介最长为300个字符', trigger: 'blur' }
					],
					PRICE:[
						{ required: true, message: '价格不能为空', trigger: 'blur' },
						{ type: 'number', min:0, message: '价格应当为大于等于0的数字', trigger: 'blur', transform:(value) => Number(value) } 
					],
					DISCOUNT:[
						{ required: true, message: '折扣不能为空', trigger: 'blur' },
						{ type: 'integer', min:0, max:100, message: '折扣值应当介于0~100之间的整数', trigger: 'blur', transform:(value) => Number(value) }
					],
					ONSALE:[
						{ required: true, message: '请选择一种状态', trigger: 'change' }
					],
					ISBN:[
						{ required: true, message: 'ISBN码不能为空', trigger: 'blur' },
						{ pattern: /^\d{13,13}$/, message: 'ISBN码格式错误', trigger: 'blur' }
					]
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
			handleSubmitValidate(){
				this.$refs.formValidate.validate( (valid) => {
					if(!valid) return this.$Message.error('表单填写错误!');
					else{
						this.submit();
					}
				});
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
							mvue.book.ONSALE = res.ITEM.ONSALE?'true':'false'; // 用了Radio组件的缘故
							
							// mvue.book.SALED = res.ITEM.SALED;
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
			},
			submit(){
				this.$Loading.start();
				var mvue = this;
				this.spinShow = true;
				var jsonMsg = {
					"UID":this.myUID,
					"METHOD":"MODIFY", // INSERT MODIFY REMOVE
					"WITHPIC":this.file!=undefined,
					"ITEM":this.book
				};
				var fd = new FormData();
				fd.append('jsondata',JSON.stringify(jsonMsg));
				if(this.file!=undefined){
					fd.append('pic',this.file);
				}
				axios({
						url:Store.state.server+"/GoodsManagerServlet",
						data:fd,
						method:'post',
						headers: {'Content-Type': 'multipart/form-data'}//application/x-www-form-urlencoded
					})
					.then(function (response) {
						let res = response.data;
						let isSuccess = res.FLAG;
						//console.log(res.MSG,isSuccess);
						if(isSuccess){
							mvue.$Message.info('提交成功!');
							mvue.$Loading.finish(); // 进度条载入完毕
							mvue.spinShow = false;
							mvue.findItem = false;
							mvue.inputIUID = 0;
						} else {
							mvue.$Message.error('提交失败:'+res.MSG);
							mvue.$Loading.error(); // 进度条载入失败
							mvue.spinShow = false;
						}
					})
					.catch(function (error) {
						//console.log(error);
						mvue.$Loading.error(); // 进度条载入失败
						mvue.spinShow = false;
					});
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
				this.$Message.success('封面图片已成功读取！');
				this.file = temp_file;
				return false;
			}
		}
	}
</script>