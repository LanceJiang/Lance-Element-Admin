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
				<h3 style="line-height: 36px">树形表格示例</h3>
			</template>
		</LeTable>
	</div>
</template>
<script setup lang="tsx" name="treeTable">
import { ref, toRefs, reactive, computed, watch, onMounted } from 'vue'
import { get_treeList } from '@/views/table/queryApi.js'
const total = ref(0)
const list = ref([])
const selectionChange = e => {
	// console.error('click 测试', e)
	console.log(e, 'selectionChange')
}
const load = (row, treeNode: unknown, resolve: (data: any[]) => void) => {
	loadChildrenApi(row).then(res => {
		resolve(res.data)
	})
}
const options = ref({
	// rowKey: 'value',
	loading: false,
	size: 'small',
	// showIndex: true,
	multipleSelect: true,
	lazy: true,
	load: load,
	treeProps: { children: 'children', hasChildren: 'hasChildren' },
	onSelectionChange: selectionChange
})
const searchParams = ref({
	page: 1,
	size: 20
})

const columns = [
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
		label: '地址',
		prop: 'address'
	}
	/*{
		label: '详情',
		prop: 'details',
		width: '120px',
		type: 'expand',
		slots: {
			default: ({row, column, $index}) => {
				// console.error($index, '$index')
				return <div>
					<span style="padding: 0 12px;color: red;">{JSON.stringify(row)}</span><br/>
					(slots.default: fn)
				</div>
			}
		}
	}*/
]

// 列配置对象
const tabs_columnsConfig = {
	// 所有的 columns 配置
	columns,
	// 默认展示配置
	defaultCheckedOptions: [columns[0]]
}
const tabs_checkedColumns = ref([columns[0]])
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
	get_treeList(input)
		.then(data => {
			// console.log(data, 'data////')
			list.value = data.list
			total.value = data.total
		})
		.finally(() => {
			options.value.loading = false
		})
}

const loadChildrenApi = row => {
	console.error(row, 'test loadChildrenApi')
	return new Promise(resolve => {
		setTimeout(() => {
			const total = 5
			const id_base = +new Date()
			const res = {
				data: Array.from({ length: total }).map((_, i) => {
					return {
						id: `${id_base}_${i}`,
						date: '2020-02-01',
						name: `狼妖_${i}`,
						address: `浪浪山 888_${i} 号`,
						hasChildren: Math.random() > 0.5
					}
				}),
				total: total
			}
			resolve(res)
		}, 500)
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
