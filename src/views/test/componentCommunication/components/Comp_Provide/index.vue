<template>
	<div style="background: #f8f">
		父组件 (provide/inject)<br />
		<!-- 父组件 -->
		<ul class="parent input-group">
			<input v-model="value" type="text" placeholder="请输入" />
			<div class="input-group-append">
				<button @click="handleAdd" class="btn btn-primary" type="button">添加</button>
			</div>
		</ul>
		<!-- 子组件 -->
		<ChildComponents></ChildComponents>
	</div>
</template>
<script setup>
import { onMounted, provide } from 'vue'
import ChildComponents from './child.vue'
const list = ref(['JavaScript', 'HTML', 'CSS'])
const value = ref('')
provide('list', list.value)
const handleAdd = () => {
	list.value.push(value.value)
	value.value = ''
}
</script>
