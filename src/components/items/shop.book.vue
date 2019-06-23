<style>

</style>
<template>
	<div style="text-align: center">
		<Card shadow bordered>
			<div style="height:310px;min-width:135px;">
				<Tooltip :content="bookDesc" :max-width="200" transfer>
					<img :src="bookcoverURL" style="width: 135px;height: 185px;" @click="handleClick" ></img>
				</Tooltip>
				<br/>
				<font face="微软雅黑" color="#808695">书名:</font>
				<font face="微软雅黑">{{bookName}}</font></br>
				<font face="微软雅黑" color="#808695">作者:</font>
				<font face="微软雅黑">{{author}}</font></br>
				<font face="微软雅黑" color="#808695">出版社:</font>
				<font face="微软雅黑">{{publisher}}</font></br>
				<font face="微软雅黑" color="#808695">单价:</font>
				<font face="微软雅黑">{{price}}</font></br>
				<font face="微软雅黑" color="#808695" v-if="discount>0">折扣:</font>
				<font face="微软雅黑" color="#19be6b"v-if="discount>0">{{discount2String}}</font></br>
			</div>
		</Card>
	</div>
</template>
<script type="text/javascript">
	import DemoBookcover from "../../pics/demo_bookcover.jpg";
	export default{
		name:"ShopBook",
		data:function(){
			return{
				//bookcoverURL:DemoBookcover,
				//bookUID:-1, // 书在数据库中的编号
				//author:"[英]伊恩·麦克尤恩",
				//publisher:"南海出版社",
				//bookDesc:"这是书的内容简介",
				//price:"￥58.0"
			}
		},
		props:{
			// 均不做强制要求 鲁棒
			bookcoverURL:{
				type:String,
				default:DemoBookcover
			},
			bookName:{
				type:String,
				default:"Mysql从入门到精通(测试)"
			},
			bookUID:{
				type:Number,
				default:-1
			},
			author:{
				type:String,
				default:"[英]伊恩·麦克尤恩(测试)"
			},
			publisher:{
				type:String,
				default:"南海出版社(测试)"
			},
			bookDesc:{
				type:String,
				default:"这是书的内容简介(测试)"
			},
			price:{
				type:String,
				default:"￥58.0(测试)"
			},
			discount:{
				type:Number,
				default:0
			}
		},
		computed:{
			discount2String(){
				return ''+this.discount+' %off'
			}
		},
		methods:{
			handleClick:function(){
				this.$emit('on-click',this.bookUID);
				// 更新内容测试
				// this.DemoBookcoverURL="https://img3.doubanio.com/view/subject/l/public/s29920535.jpg";
				// this.author="[日]日野原重明";
				// this.publisher="人民邮电出版社";
				// this.bookDesc="这是书的内容简介";
				// this.price="￥45.0";
			}
		}
	}
</script>