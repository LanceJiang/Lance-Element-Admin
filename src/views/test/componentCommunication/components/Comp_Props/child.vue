<template>
	<ul class="parent list-group" style="background: #007bfc">
		<li style="color: var(--el-color-danger)">子组件</li>
		<li v-for="i in props.list" :key="i" class="list-group-item">{{ i }}</li>
	</ul>
</template>
<script setup lang="ts">
// import { defineProps } from 'vue'
import { PropType } from 'vue'
const props = defineProps({
	list: {
		type: Array as PropType<any[]>,
		default: () => []
	}
})
</script>
