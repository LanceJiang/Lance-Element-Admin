<template>
	<div style="background: #ff0">
		父组件 (emit 渲染)<br />
		<!-- 父组件 -->
		<ul class="parent list-group">
			<li class="list-group-item" v-for="i in list" :key="i">{{ i }}</li>
		</ul>
		<!-- 子组件 -->
		<ChildComponents @add="handleAdd"></ChildComponents>
	</div>
</template>
<script setup>
import { ref } from 'vue'
import ChildComponents from './child.vue'
const list = ref(['JavaScript', 'HTML', 'CSS'])
// add 触发后的事件处理函数
const handleAdd = value => {
	list.value.push(value)
}
</script>
