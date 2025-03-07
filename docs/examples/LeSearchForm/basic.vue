<template>
	<LeSearchForm
		v-model:searchData="searchParams"
		:forms="searchForms"
		:loading="queryLoading"
	/>
</template>

<script lang="tsx" setup>
import { ref, watch } from 'vue'
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
