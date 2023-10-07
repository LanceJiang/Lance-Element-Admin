<template>
	<div class="flex-column-page-wrap pageWrap">
		<LeTable
			v-model:searchParams="searchParams"
			class="local_table tabs_content-wrap"
			:list="localList"
			:total="total"
			:options="options"
			:columns="localColumns"
			:columnsConfig="tabs_columnsConfig"
			v-model:checkedOptions="tabs_checkedColumns"
		>
			<template #toolLeft>
				<h3 style="line-height: 36px">展开行表格示例</h3>
			</template>
			<template #expand="{ row }">
				<p style="background: var(--el-color-primary);">名称: {{ row.name }}</p>
				<p>日期: {{ row.date }}</p>
				<p>金额1: {{ row.amount1 }}</p>
				<p>金额2: {{ row.amount2 }}</p>
			</template>
		</LeTable>
	</div>
</template>
<script setup lang="tsx" name="footerSummary">
import { ref, toRefs, reactive, computed, watch, onMounted } from 'vue'
import { get_priceList } from '@/views/table/queryApi.js'
import { formatNumber } from '@/utils'
const total = ref(0)
const list = ref([])
const options = ref({
	// rowKey: 'value',
	loading: false,
	// size: 'small',
})
const searchParams = ref({
	page: 1,
	size: 20
})
const commonFormatter = (row, column, cellValue) => {
	return formatNumber(cellValue, 2)
}
const columns = [
	{
		// 展开行处理
		prop: 'expand',
		label: '展开行',
		type: 'expand',
		slots: {
			header: () => {
				return <div style="color: var(--el-color-danger);">展开行</div>
			},
			// 两种渲染方式
			default: 'expand',
			/*default: ({row, column}) => {
				return <><p style="background: var(--el-color-danger);">名称: { row.name }</p>
					<p>日期: { row.date }</p>
					<p>金额1: { row.amount1 }</p>
					<p>金额2: { row.amount2 }</p></>
			}*/
		},
		width: '70px'
	},
	{
		prop: 'id',
		label: 'ID值'
		// minWidth: '200px'
	},
	{
		prop: 'name',
		label: '名称',
		// minWidth: '200px'
	},
	{
		prop: 'date',
		label: '日期'
		// minWidth: '200px'
	},
	{
		label: '金额1',
		prop: 'amount1',
		formatter: commonFormatter
	},
	{
		label: '金额2',
		prop: 'amount2',
		formatter: commonFormatter
	}
]
const tabs_columnsConfig = {
	// 所有的 columns 配置
	columns,
	// 默认展示配置
	// defaultCheckedOptions: [columns[0]]
}
const tabs_checkedColumns = ref([...columns])

const localColumns = computed(() => {
	const checkedColumns = tabs_checkedColumns.value as any[]
	if (!checkedColumns.length) return columns
	return checkedColumns
		.map(v => {
			const cur = columns.find(column => column.prop === v.prop)
			if (cur) {
				const fixedFlag = cur.fixed
				if (fixedFlag) {
					v.fixed = fixedFlag
				}
				return cur
			}
			return false
		})
		.filter(Boolean)
})

// const { } = toRefs(state)
const localList = computed(() => {
	// 相关数据组装处理
	return list.value
})
// 获取请求参数方法
const getRequestParams = () => {
	// console.error('getRequestParams', e)
	return {
		...searchParams.value
		// ...this.tabs_filterParams
	}
}
// 列表请求
const queryList = () => {
	options.value.loading = true
	const input = getRequestParams()
	console.warn('input', JSON.stringify(input))
	get_priceList(input)
		.then(data => {
			// console.log(data, 'data////')
			list.value = data.list
			total.value = data.total
		})
		.finally(() => {
			options.value.loading = false
		})
}

watch(
	() => searchParams.value,
	() => {
		queryList()
	}
)
onMounted(() => {
	// 尝试搜索
	searchParams.value = {
		...searchParams.value,
		page: 1
	}
	// queryList()
})
</script>
<style scoped lang="scss">
.pageWrap {
	//padding-top: 12px;
	padding: 12px 12px 0 12px;
	overflow: auto;
	background-color: $le-bg-color_1;
}

// 其他样式
.local_table {
	//padding: 0 12px;
	box-shadow: 0 0 6px 4px rgb(145 159 175 / 6%);
	border-top: 1px solid $le-border-color_3;
	border-radius: 6px 6px 0 0;
	//padding: 12px 12px 0 12px;
	&.tabs_content-wrap {
		border-top: 0;
		border-radius: 0;
	}
}
</style>