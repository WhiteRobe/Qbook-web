<style>

</style>
<template>
	<div style="top: 20px; left: 20px; margin: auto; width:700px; position: relative;">
		<Form :model="formItem" label-position="top" :rules="ruleValidate" ref="formValidate">
			<FormItem label="书名" prop="INAME">
				<Input type="text" v-model="formItem.INAME" placeholder="请输入书名..."></Input>
			</FormItem>
			<FormItem label="作者名" prop="AUTHOR">
				<Input type="text" v-model="formItem.AUTHOR" placeholder="请输入作者名..."></Input>
			</FormItem>
			<FormItem label="出版社" prop="PUBLISHER">
				<Input type="text" v-model="formItem.PUBLISHER" placeholder="请输入出版社..."></Input>
			</FormItem>
			<FormItem label="简介" prop="DESCS">
				<Input type="textarea" v-model="formItem.DESCS" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入商品简介..."></Input>
			</FormItem>
			<FormItem label="价格" prop="PRICE">
				<Input type="text" v-model="formItem.PRICE" placeholder="请输入商品价格..."></Input>
			</FormItem>
			<FormItem label="折扣" prop="DISCOUNT">
				<Input type="text" v-model="formItem.DISCOUNT" placeholder="请输入商品折扣..."></Input>
			</FormItem>
			<FormItem label="ISBN" prop="ISBN">
				<Input type="text" v-model="formItem.ISBN" placeholder="请输入书的ISBN..."></Input>
			</FormItem>
			<FormItem label="封面" ><!--最大5MB-->
				<Upload :action="serverURL+'/FileUploadServlet'" :max-size="1024*5" 
				 :name="formItem.ISBN" show-upload-list :before-upload="manualUpload">
					<Button icon="ios-cloud-upload-outline">上传封面图片文件</Button>
					&nbsp;<Icon type="md-checkmark-circle" color="#19be6b" v-if="file!=undefined"/>
				</Upload>
			</FormItem>
			<!--提交按钮-->
			<FormItem>
				<Button type="primary" long icon="ios-cloud-upload" @click="handleSubmitValidate">提 交</Button>
			</FormItem>
		</Form>
		<!--载入遮罩-->
		<Spin size="large" fix v-if="spinShow"></Spin>
	</div>
</template>
<script type="text/javascript">
	import {Store} from '../../../store.js';
	import axios from 'axios';
	export default{
		name:"AddGoodsPanel",
		data:function(){
			return{
				spinShow:false,
				acceptFormat:['jpg'], // 只接受JPG文件
				formItem:{
					INAME:'',
					AUTHOR:'',
					PUBLISHER:'',
					DESCS:'',
					PRICE:'',
					DISCOUNT:'',
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
						{ type: 'number', min:0, message: '价格应当为大于等于0的数字', trigger: 'blur', transform:(value) => Number(value) } // 解决Iview Input 只能为string的深坑
					],
					DISCOUNT:[
						{ required: true, message: '折扣不能为空', trigger: 'blur' },
						{ type: 'integer', min:0, max:100, message: '折扣值应当介于0~100之间的整数', trigger: 'blur', transform:(value) => Number(value) }
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
			resetFormData(){
				this.formItem.INAME='';
				this.formItem.AUTHOR='';
				this.formItem.PUBLISHER='';
				this.formItem.DESCS='';
				this.formItem.PRICE='';
				this.formItem.DISCOUNT='';
				this.formItem.ISBN='';
				this.file=undefined;
			},
			handleSubmitValidate(){
				this.$refs.formValidate.validate( (valid) => {
					if(!valid) return this.$Message.error('表单填写错误!');
					else{
						this.submit();
					}
				});
			},
			submit(){
				if(this.file==undefined){
					this.$Message.info('尚未上传封面!');
					return;
				}
				this.$Loading.start();
				var mvue = this;
				this.spinShow = true;
				var jsonMsg = {
					"UID":this.myUID,
					"METHOD":"INSERT", // INSERT MODIFY REMOVE
					"ITEM":this.formItem
				};
				var fd = new FormData();
				fd.append('jsondata',JSON.stringify(jsonMsg));
				fd.append('pic',this.file);
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
							mvue.resetFormData(); // 清空表单已填数据
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
				// console.log(temp_file);
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