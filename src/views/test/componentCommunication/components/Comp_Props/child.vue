<template>
	<ul class="parent list-group" style="background: #007bfc">
		<li style="color: var(--el-color-danger)">子组件</li>
		<li class="list-group-item" v-for="i in props.list" :key="i">{{ i }}</li>
	</ul>
</template>
<script setup>
// import { defineProps } from 'vue'
const props = defineProps({
	list: {
		type: Array,
		default: () => []
	}
})
</script>
