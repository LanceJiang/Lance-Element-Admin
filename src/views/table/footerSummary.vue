<template>
	<div class="flex-column-page-wrap pageWrap">
		<LeTable
			v-model:searchParams="searchParams"
			class="local_table tabs_content-wrap"
			:list="localList"
			:total="total"
			:options="options"
			:columns="localColumns"
		>
			<template #toolLeft>
				<h3 style="line-height: 36px">底部统计(摘要)表格示例</h3>
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
	showSummary: true,
	summaryMethod: ({ columns, data }) => {
		const sums = []
		columns.forEach((column, index) => {
			if(index === 0) {
				return sums[index] = '统计' // /Total
			}
			// const values = data.map((item) => Number(item[column.property]))
			const prop = column.property
			if (prop.indexOf('amount') === 0) {
				sums[index] = `￥ ${formatNumber(data.reduce((total, cur) => {
					const value = +(cur[prop])
					if (!Number.isNaN(value)) {
						return total + value
					} else {
						return total
					}
				}, 0), 2)}`
			} else if(index === 1) {
				sums[index] = (<div>
					columns: {columns.length}<br/>
					curPageTotal: {data.length}
				</div>)
			} else {
				sums[index] = <div style="color: var(--el-color-danger)">- 空 -</div>
			}
		})
		return sums
	}
})
const searchParams = ref({
	page: 1,
	size: 20
})
const commonFormatter = (row, column, cellValue) => {
	return formatNumber(cellValue, 2)
}
const localColumns = computed(() => {
	return [
		{
			prop: 'id',
			label: 'ID值'
			// minWidth: '200px'
		},
		{
			prop: 'name',
			label: '名称'
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
		},
		{
			label: '金额3',
			prop: 'amount3',
			formatter: commonFormatter
		},
		{
			label: '金额4(string)',
			prop: 'amount4',
			formatter: (row, column, cellValue) => {
				return <div style="color: red;">{formatNumber(cellValue, 2)}</div>
			}
		}
	]
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
