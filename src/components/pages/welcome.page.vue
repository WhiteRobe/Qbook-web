<style>
.layoutCenter{
    text-align: center; /*让div内部文字居中*/
    background-color: #fff;
    border-radius: 10px;
    width: 432px;
    height: 256px;
    margin: auto;
    position: relative;
    top: 298px;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>
<template>
	<Carousel autoplay :autoplay-speed="4500" loop :height="864">
        <CarouselItem>
			<div :style="{backgroundImage:'url('+CarouseURL1+')',height:864+'px'}">
				<div class="layoutCenter">
					<Card :bordered="false" dis-hover>
						<p slot="title">阅读是一种习惯</p>
						<p>我们致力于为您提供最贴心、最懂你的电子书推荐，以及优质的购买、服务和阅读体验。<br/>看上就是喜欢，从不犹豫，快购阅读。 </p>
						<Divider/>
						<Button type="primary" shape="circle" size="large" to="/shop">点击开始</Button>
					</Card>
				</div>
			</div>
        </CarouselItem>
        <CarouselItem>
            <div :style="{backgroundImage:'url('+CarouseURL2+')',height:864+'px'}">
				<div class="layoutCenter">
					<Card :bordered="false" dis-hover>
						<p slot="title">阅读是一种习惯</p>
						<p>我们致力于为您提供最贴心、最懂你的电子书推荐，以及优质的购买、服务和阅读体验。<br/>看上就是喜欢，从不犹豫，快购阅读。 </p>
						<Divider/>
						<Button type="primary" shape="circle" size="large" to="/shop">点击开始</Button>
					</Card>
				</div>
			</div>
        </CarouselItem>
        <CarouselItem>
            <div :style="{backgroundImage:'url('+CarouseURL3+')',height:864+'px'}">
				<div class="layoutCenter">
					<Card :bordered="false" dis-hover>
						<p slot="title">阅读是一种习惯</p>
						<p>我们致力于为您提供最贴心、最懂你的电子书推荐，以及优质的购买、服务和阅读体验。<br/>看上就是喜欢，从不犹豫，快购阅读。 </p>
						<Divider/>
						<Button type="primary" shape="circle" size="large" to="/shop">点击开始</Button>
					</Card>
				</div>
			</div>
        </CarouselItem>
    </Carousel>
</template>
<script type="text/javascript">
	import Carouse1 from "../../pics/Carouse (1).jpg";
	import Carouse2 from "../../pics/Carouse (2).jpg";
	import Carouse3 from "../../pics/Carouse (3).jpg";
	export default{
		name:"WelcomePage",
		data:function(){
			return{
				CarouseURL1:Carouse1,
				CarouseURL2:Carouse2,
				CarouseURL3:Carouse3
			}
		}
	}
</script>