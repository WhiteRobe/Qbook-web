<style>

</style>
<template>
	<div style="top:32px;position: relative;position: relative;">
		<Row>
			<div style="left:32px;margin: 16px;position: relative;">
				<Breadcrumb>
					<BreadcrumbItem to="/shop">
						<Icon type="ios-home"></Icon>&nbsp;商店首页
					</BreadcrumbItem>
					<BreadcrumbItem>
						<Icon type="ios-rose"></Icon>&nbsp;控制台
					</BreadcrumbItem>
				</Breadcrumb>
			</div>
		</Row>
		<Divider dashed/>
		<Row :gutter="30">
			<Col span="1">&nbsp;</Col>
			<Col span="4">
				<Menu theme="light" active-name="GOODS_MANAGER" @on-select="handleMenuSelect">
					<MenuGroup title="内容管理">
						<MenuItem name="GOODS_MANAGER">
							<Icon type="md-document" />
							商品管理
						</MenuItem>
					</MenuGroup>
					<MenuGroup title="账户管理">
						<MenuItem name="ACCOUNT_MANAGER">
							<Icon type="md-heart" />
							用户管理
						</MenuItem>
					</MenuGroup>
				</Menu>
			</Col>
			<Col span="1">&nbsp;</Col>
			<Col span="17" v-if="mode==='GOODS_MANAGER'">
				<Card shadow bordered dis-hover>
					<Tabs value="addGoodsTag" type="card">
						<TabPane label="添加商品" name="addGoodsTag" icon="md-add">
							<add-goods-panel></add-goods-panel>
						</TabPane>
						<TabPane label="更新商品" name="modifyGoodsTag" icon="md-brush">
							<edit-goods-panel></edit-goods-panel>
						</TabPane>
						<TabPane label="删除商品" name="removeGoodsTag" icon="md-remove">
							<remove-goods-panel></remove-goods-panel>
						</TabPane>
					</Tabs>
				</Card>
			</Col>
			<Col span="17" v-else-if="mode==='ACCOUNT_MANAGER'">
				<Alert show-icon>
					<Icon type="ios-bulb-outline" slot="icon"></Icon>提示
					<span slot="desc">账户管理暂不可用。 </span>
				</Alert>
			</Col>
			<Col span="17" v-else>
				<Alert type="error" show-icon>
					错误<span slot="desc">未知管理内容，请刷新页面后重试！</span>
				</Alert>
			</Col>
			<Col span="1">&nbsp;</Col>
		</Row>
	</div>
</template>
<script type="text/javascript">
	import {Store} from '../../store.js';
	import AddGoodsPanel from './panel/add_goods.panel.vue';
	import EditGoodsPanel from './panel/edit_goods.panel.vue';
	import RemoveGoodsPanel from './panel/remove_goods.panel.vue';
	import axios from 'axios';
	export default {
		name:"ConsolePage",
		data:function(){
			return{
				mode:"GOODS_MANAGER"
			}
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
			handleMenuSelect(menuName){
				this.mode = menuName;
			}
		},
		components:{
			'add-goods-panel':AddGoodsPanel,
			'edit-goods-panel':EditGoodsPanel,
			'remove-goods-panel':RemoveGoodsPanel
		}
	}
</script>