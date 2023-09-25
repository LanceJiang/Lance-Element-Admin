<template>
	<div class="child-wrap input-group">
		<li style="color: var(--el-color-danger)">子组件</li>
		<input v-model="value" type="text" class="form-control" placeholder="请输入" />
		<div class="input-group-append">
			<button @click="handleAdd" class="btn btn-primary" type="button">添加</button>
		</div>
	</div>
</template>
<script setup>
// ref defineExpose 输出
import { ref, defineExpose } from 'vue'
const list = ref(['JavaScript', 'HTML', 'CSS'])
const value = ref('')

// const emits = defineEmits(['add'])
const handleAdd = () => {
	list.value.push(value.value)
	value.value = ''
}
defineExpose({ list })
</script>
