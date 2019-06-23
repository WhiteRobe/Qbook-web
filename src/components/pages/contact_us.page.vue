<style>
.contactUsFrom{
	/*text-align: center; 让div内部文字居中*/
	background-color: #fff;
	border-radius: 10px;
	height:324px;
	width:512px;
	margin: auto;
	position: relative;
	top: 270px;
	left: 0;
	right: 0;
	bottom: 0;
}
</style>
<template>
	<!--该页面已被废弃-->
	<div :style="{backgroundImage:'url('+ContactUsBGURL+')',height:864+'px',weight:1920+'px'}">
		<div class="contactUsFrom">
			<Collapse v-model="value1" accordion>
        <Panel name="1">
            <Icon type="ios-aperture" />我们的理念
            <p slot="content"><font size="5">快购阅读致力于创建优良的阅读体验，您的每次购买，都是对我们的支持。<br/>我们的理念是：爱上就是一瞬间的感觉，错过了这一瞬间，不如就索性放弃。</font></p>
        </Panel>
        <Panel name="2">
            <Icon type="ios-call" />联系我们
            <p slot="content">
				<Input v-model="opinoions" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入您对我们的意见..." />
				<Divider/>
				<Button size="large" long icon="md-log-in" type="primary" @click="submit">提交</Button>
			</p>
        </Panel>
        <Panel name="3">
            <Icon type="ios-people" />加入我们
            <p slot="content">您可以通过Email:{{email}}联系我!</p>
        </Panel>
   		</Collapse>
		</div>
	</div>
</template>
<script>
	import ContactUsBG from '../../pics/contact_us_bg.jpg';
	import {Store} from '../../store.js';
  	export default{
		name:"ContactUsPage",
		data:function(){
			return{
				value1:'1', // 折叠面板的默认展示页面
				opinoions:"",
				ContactUsBGURL:ContactUsBG
			}
		},
		computed:{
			stuNo(){
				return Store.state.stuNo;
			},
			email(){
				return Store.state.email;
			}
		},
		methods:{
			submit(){
				if(this.opinoions==="")return;
				this.$Loading.start();
				console.log(this.opinoions);
				this.$Message.info('感谢您的反馈，我们已经收到！ ^_^');
				this.$Loading.finish();
			}
		}
  }
</script>