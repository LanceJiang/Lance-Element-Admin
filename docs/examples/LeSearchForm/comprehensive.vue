<template>
	<LeSearchForm
		v-model:searchData="searchParams"
		:forms="searchForms"
		:loading="queryLoading"/>
</template>

<script lang="tsx" setup>
// todo...
import { ref, reactive, toRefs, watch } from 'vue'
const prefix = 'example.forms.'
const queryLoading = ref(false)
const searchParams = ref({
	select: '选项_1',
	switch: false
})
const searchForms = [
	// select
	{
		prop: 'select',
		label: '选择',
		itemType: 'select',
		options: Array.from({ length: 4 }).map((_, i) => (`选项_${i}`))
	},
	{
		prop: 'switch',
		label: 'switch',
		itemType: 'switch'
		// activeText: '开',
		// inactiveText: '关',
		// inlinePrompt: true
	},
]
const updateParams = () => {
	queryLoading.value = true
	console.warn('模拟发送请求参数', JSON.stringify(searchParams.value))
	new Promise((r) => setTimeout(r, 1000)).then(() => {
		console.log('模拟数据请求成功')
		queryLoading.value = false
	})
}
// 监听searchParams变化 更新query
watch(searchParams,
	updateParams
	// {
	// 	immediate: true
	// }
)
</script>
<style scoped>
/*:deep(.test_radio) {
	.el-radio {
		border-radius: 4px;
		background: #d0d0d0;
		&.is-checked {
			background: var(--el-color-warning);
		}
	}
}*/
</style>
