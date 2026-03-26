<template>
	<div class="column-page-wrap">
		<!-- 可视区域 -->
		<div class="view-container" :style="{ height: viewHeight + 'px' }" @scroll="handleScroll">
			<!-- 滚动条区域 -->
			<div
				class="content-container"
				:style="{
					height: itemHeight * data.length + 'px'
				}"
			></div>
			<!-- 实际渲染的区域 -->
			<div
				class="item-container"
				:style="{
					transform: `translateY(${scrollTop}px)`
				}"
			>
				<!-- 具体渲染数据 -->
				<div
					v-for="(item, index) in showData"
					:key="index"
					class="item"
					:style="{
						height: itemHeight + 'px'
					}"
				>
					{{ item }}
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="tsx">
// 线上单独访问地址: https://code.juejin.cn/pen/7498560281003196470

import { ref } from 'vue'
const data = new Array(500).fill(0).map((_, i) => i) // 模拟真实数据
const viewHeight = ref(400) // 可视容器高度
const itemHeight = ref(20) // 每一项的高度
const scrollTop = ref(0) // 初始滚动距离
const showData = ref<number[]>([]) // 显示的数据
showData.value = data.slice(0, 20) // 初始展示的数据 （前20个）
// 滚动事件
const handleScroll = (e: Event) => {
	// 获取滚动距离
	const _scrollTop = (e.target as HTMLElement).scrollTop
	// 初始索引 = 滚动距离 / 每一项的高度
	const startIndex = Math.round(_scrollTop / itemHeight.value)
	// 结束索引 = 初始索引 + 容器高度 / 每一项的高度
	const endIndex = startIndex + viewHeight.value / itemHeight.value
	// 根据初始索引和结束索引，截取数据
	showData.value = data.slice(startIndex, endIndex)
	// scrollTop.value = startIndex * itemHeight.value // 方式1
	scrollTop.value = _scrollTop - (_scrollTop % itemHeight.value) // 方式2
	console.log(showData.value, 'showData')
}
</script>

<style scoped>
.view-container {
	height: 400px;
	width: 200px;
	border: 1px solid #00f;
	overflow-y: scroll;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.content-container {
	height: 1000px;
}

.item-container {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
}

.item {
	box-sizing: border-box;
	border: 1px solid #f00;
	height: 20px;
	&:nth-child(2n) {
		border-color: #00f;
	}
}
</style>
