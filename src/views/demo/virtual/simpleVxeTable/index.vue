<template>
	<div class="column-page-wrap">
		<div style="height: 400px">
			<Simple_VxeTable :columns="columns" :data="tableData" :svirtual-y-config="{ enabled: false }" show-footer />
		</div>
	</div>
</template>
<script setup lang="tsx">
import SimpleVxeTable from './components/table/index'
import { Simple_VxeTable } from './components/table/index'
import { ref } from 'vue'
const tableData = Array.from({ length: 1000 }).map((_, index) => {
	return {
		id: index + 1,
		name: `用户${index + 1}`,
		age: Math.floor(Math.random() * 50) + 20,
		address: `地址${index + 1}`
	}
})

const columns = [
	// { prop: 'name', label: '姓名', width: 200 },
	// {
	// 	prop: 'age',
	// 	label: '年龄',
	// 	formatter: row => `${row.age} 岁`
	// }
	{
		field: 'id',
		title: 'ID',
		width: 100,
		fixed: 'left',
		footerRender() {
			return 'footer ID'
		}
	},
	{
		field: 'name',
		title: '姓名',
		width: 150,
		footerRender() {
			return 'footer 姓名'
		}
	},
	{
		field: 'age',
		title: '年龄',
		width: 100,
		footerRender() {
			return 'footer 年龄'
		}
	},
	{
		field: 'address',
		title: '地址',
		width: 300,
		fixed: 'right',
		footerRender() {
			return 'footer 地址'
		}
	}
]
</script>

<style scoped lang="scss"></style>
