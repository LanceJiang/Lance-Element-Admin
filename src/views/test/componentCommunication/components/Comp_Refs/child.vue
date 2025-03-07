<template>
	<div class="child-wrap input-group">
		<li style="color: var(--el-color-danger)">子组件</li>
		<input v-model="value" type="text" class="form-control" placeholder="请输入" />
		<div class="input-group-append">
			<button class="btn btn-primary" type="button" @click="handleAdd">添加</button>
		</div>
	</div>
</template>
<script setup>
// ref
import { ref } from 'vue'
const list = ref(['JavaScript', 'HTML', 'CSS'])
const value = ref('')

// const emits = defineEmits(['add'])
const handleAdd = () => {
	list.value.push(value.value)
	value.value = ''
}
defineExpose({ list })
</script>
