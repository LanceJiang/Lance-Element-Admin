<template>
	<div class="child-wrap input-group">
		<li style="color: var(--el-color-danger)">子组件</li>
		<input v-model="value" type="text" class="form-control" placeholder="请输入" />
		<div class="input-group-append">
			<button @click="handleSubmit" class="btn btn-primary" type="button">添加</button>
		</div>
	</div>
</template>
<script setup>
import { ref, defineEmits } from 'vue'
const value = ref('')
const emits = defineEmits(['add'])
const handleSubmit = () => {
	emits('add', value.value)
	value.value = ''
}
</script>
