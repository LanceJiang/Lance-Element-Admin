<template>
	<div style="background: #42b983">
		父组件 (props 渲染)<br />
		<!-- 子组件 -->
		<ChildComponents :list="list"></ChildComponents>
		<!-- 父组件 -->
		<div class="child-wrap input-group">
			<input v-model="value" type="text" class="form-control" placeholder="请输入" />
			<div class="input-group-append">
				<button @click="handleAdd" class="btn btn-primary" type="button">添加</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import ChildComponents from './child.vue'
const list = ref(['JavaScript', 'HTML', 'CSS'])
const value = ref('')
// add 触发后的事件处理函数
const handleAdd = () => {
	list.value.push(value.value)
	value.value = ''
}
</script>
