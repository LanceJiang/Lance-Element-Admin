<template>
	<div class="child-wrap input-group">
		<li style="color: var(--el-color-danger)">子组件</li>
		<li v-for="i in list" :key="i" class="list-group-item">{{ i }}</li>
	</div>
</template>
<script setup>
// ref defineExpose 输出
import { inject } from 'vue'
// 接收父组件的数据
const list = inject('list')
</script>
