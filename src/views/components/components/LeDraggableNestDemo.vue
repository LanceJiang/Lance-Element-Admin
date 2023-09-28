<script setup lang="ts">
import { ref, toRefs, reactive } from 'vue'
const checkedOptions = ref([
	{
		label: 'Normal',
		prop: 'Normal'
	},
	{
		label: `test_children`,
		prop: 'test_children',
		children: [
			{
				label: 'child0_001',
				prop: 'child0_001'
			},
			{
				label: 'child0_002',
				prop: 'child0_002'
			}
		]
	},
	{
		label: `orderNo`,
		prop: 'orderNo'
	},
	{
		// 多语言
		t_label: `le.table.action`,
		prop: 'action',
		fixed: 'right'
	}
])
const onMove = ({ relatedContext, draggedContext }) => {
	const relatedElement = relatedContext.element
	const draggedElement = draggedContext.element
	// fixed 表示 固定的项
	return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
}
const update_checkedOptions = (values) => {
	console.error(JSON.stringify(values))
}
</script>

<template>
	<div class="common_title">LeDraggableNest</div>
	<div class="content">
		<LeDraggableNest
			style="background: var(--el-fill-color-lighter);"
			v-model="checkedOptions"
			@update:modelValue="update_checkedOptions"
			:move="onMove"
		/>
	</div>
</template>

<style scoped lang="scss">

</style>