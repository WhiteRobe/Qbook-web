<style>
.contact-us-drawer-profile{
	font-size: 14px;
}
.contact-us-drawer-profile .ivu-col{
	margin-bottom: 12px;
}
</style>
<template>
	<div>
		<Drawer :closable="false" width="640" v-model="canShow">
			<p :style="pStyle"><Icon type="ios-aperture" />&nbsp;我们的理念</p>
			<div class="contact-us-drawer-profile">
				<Row>
					快购阅读致力于创建优良的阅读体验，您的每次购买，都是对我们的支持。
				</Row>
				<br/>
				<Row>
					我们的理念是：爱上就是一瞬间的感觉，错过了这一瞬间，不如就索性放弃。
				</Row>
				<br/>
				<Row>
					感谢您的使用!
				</Row>
			</div>
			<Divider />
			<p :style="pStyle"><Icon type="ios-call" />&nbsp;意见反馈</p>
			<div class="contact-us-drawer-profile">
				<Row>
					<Input v-model="opinoions" type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="请输入您对我们的意见..." />
					<br/><br/>
					<Button size="large" long icon="md-log-in" type="primary" @click="submit">提交</Button>
				</Row>
				<br/>
				<Row>
					<Col span="24">
						您的任何意见我们都会进行保留和参考，感谢您的热心反馈。
					</Col>
				</Row>
			</div>
			<Divider />
			<p :style="pStyle"><Icon type="ios-people" />&nbsp;联系我们</p>
			<div class="contact-us-drawer-profile">
				<Row>
					<Col span="12">
						邮箱: {{email}}
					</Col>
					<Col span="12">
						学号: {{stuNo}}
					</Col>
				</Row>
				<Row>
					<Col span="12">
						开源仓库: <a href="https://gitee.com/shenpibaipao/Qbook-client" target="_blank">https://gitee.com/Qbook-client</a>
					</Col>
				</Row>
			</div>
		</Drawer>
	</div>
</template>
<script type="text/javascript">
	import {Store} from '../../../store.js';
	export default{
		name:"ContactUsWidge",
		data:function(){
			return{
				canShow:false,
				opinoions:"",
				pStyle: {
                    fontSize: '16px',
                    color: 'rgba(0,0,0,0.85)',
                    lineHeight: '24px',
                    display: 'block',
                    marginBottom: '16px'
                }
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
				// 关闭窗口 清空意见消息
				this.canShow=false;
				this.opinoions="";
			}
		}
	}
</script>