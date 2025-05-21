<template>
	<div class="column-page-wrap">
		<SimpleVxeTable style="height: 400px" :data="tableData" :columns="columns" border row-key />
	</div>
</template>
<script setup lang="tsx">
import SimpleVxeTable from './components/table/index'
import { ref } from 'vue'
const tableData = Array.from({ length: 100 }).map((_, i) => {
	return {
		id: i,
		name: '张三' + i,
		age: 28 + i
	}
})

const columns = [
	{ prop: 'name', label: '姓名', width: 200 },
	{
		prop: 'age',
		label: '年龄',
		formatter: row => `${row.age} 岁`
	}
]
</script>

<style scoped></style>
<style>
.vxe-table--wrapper {
	overflow-y: auto;
}
</style>
