<template>
	<div class="flex-column-page-wrap pageWrap">
		<LeTable
			ref="localTable"
			v-model:searchParams="searchParams"
			class="local_table tabs_content-wrap"
			:list="localList"
			:total="total"
			:options="options"
			:columns="localColumns"
			v-model:checkedOptions="tabs_checkedColumns"
			:columnsConfig="tabs_columnsConfig"
		>
			<template #toolLeft>
				<h3 style="line-height: 36px;">多级表头示例</h3>
			</template>
			<template #validNum="{row, column}">
				<span style="color: #e6a23c;">{{row[column.property]}}</span><br/>
				(slots.default: string)
			</template>
		</LeTable>
	</div>
</template>
<script setup lang="tsx" name="multipleHeader">
import { ref, toRefs, reactive, computed, watch, onMounted } from 'vue'
import { cloneDeep } from 'lodash-es';
import i18n from '@/lang/index'
import { ElMessage } from 'element-plus'
import { get_multipleHeaderList } from '@/views/table/queryApi.js'
const total = ref(0)
const list = ref([])
const options = ref({
	// rowKey: 'value',
	loading: false,
	size: 'small',
	showIndex: true,
	multipleSelect: true
})

const searchParams = ref({
	page: 1,
	size: 20
})

const showAll = ref(true)

/*const localColumns = computed(() => {
	const columns = [
		{
			prop: 'areaName',
			label: '所在区域',
			minWidth: '300px'
		},
		{
			prop: 'caseTotal',
			label: '上报问题数',
			minWidth: '100px',
			fixed: 'right',
			formatter (row, column, cellValue, index) {
				return <div>
					<el-link style="color: #409eff;">{cellValue}</el-link><br/>
					(formatter)
				</div>
			}
		}
	]
	return [
		{
			prop: 'projectName',
			label: '项目',
			minWidth: '200px'
		},
		...(showAll.value ? columns : []),
		{
			label: '其中',
			prop: 'in',
			align: 'center',
			// align: 'right',
			fixed: 'right',
			minWidth: '500px',
			slots: {
				// default 会被覆盖
				/!*default: ({row, column, $index }) => {
					console.error(row, 'row column $index', column, $index)
					return '其中...'
				},*!/
				header: ({ column, $index }) => {
					// console.error('column $index', column, $index)
					return <el-button onClick={testClick}>其中...</el-button>
				}
			},
			children: [
				{
					prop: 'invalidNum',
					label: '作废数（宗）',
					minWidth: 200,
					sortable: true,
					slots: {
						default: (args) => {
							// console.log(args)
							const {row, column, $index} = args
							// console.error($index, '$index')
							return <div>
								<span style="color: red;">{row[column.property]}</span><br/>
								(slots.default: fn)
							</div>
						}
					}
				},

				{
					prop: 'validNum',
					label: '有效问题数（宗）',
					sortable: true,
					minWidth: 300,
					slots: {
						default: 'validNum'
					}
				}
			]
		}
	]
})*/
const columns = [
	{
		prop: 'projectName',
		label: '项目',
		minWidth: '200px'
	},
	{
		prop: 'areaName',
		label: '所在区域',
		minWidth: '300px'
	},
	{
		prop: 'caseTotal',
		label: '上报问题数',
		minWidth: '100px',
		fixed: 'right',
		formatter (row, column, cellValue, index) {
			return <div>
				<el-link style="color: #409eff;">{cellValue}</el-link><br/>
				(formatter)
			</div>
		}
	},
	{
		label: '其中',
		prop: 'in',
		align: 'center',
		// align: 'right',
		// fixed: 'right',
		minWidth: '500px',
		slots: {
			// default 会被覆盖
			/*default: ({row, column, $index }) => {
				console.error(row, 'row column $index', column, $index)
				return '其中...'
			},*/
			header: ({ column, $index }) => {
				// console.error('column $index', column, $index)
				return <el-button onClick={testClick}>其中...</el-button>
			}
		},
		children: [
			{
				prop: 'invalidNum',
				label: '作废数（宗）',
				minWidth: 200,
				sortable: true,
				slots: {
					default: (args) => {
						// console.log(args)
						const {row, column, $index} = args
						// console.error($index, '$index')
						return <div>
							<span style="color: red;">{row[column.property]}</span><br/>
							(slots.default: fn)
						</div>
					}
				}
			},

			{
				prop: 'validNum_group',
				// label: '有效问题数（宗）',
				label: '有效问题group',
				// sortable: true,
				minWidth: 300,
				children: [
					{
						prop: 'validNum',
						label: '有效问题数（宗）',
						sortable: true,
						// minWidth: 300,
						slots: {
							default: 'validNum'
						}
					},
					{
						prop: 'validNum2',
						label: '有效问题数2',
						sortable: true
						// minWidth: 300,
						// slots: {
						// 	default: 'validNum'
						// }
					}
				]
				// slots: {
				// 	default: 'validNum'
				// }
			}
		]
	}
]
// 列配置对象
const tabs_columnsConfig = {
	// 所有的 columns 配置
	columns,
	// 默认展示配置
	defaultCheckedOptions: [columns[0]]
}
const tabs_checkedColumns = ref([columns[0], columns[3]])
const localColumns = computed(() => {
	const checkedColumns = tabs_checkedColumns.value as any[]
	if (!checkedColumns.length) return columns
	const clone_columns = cloneDeep(columns)
	const sortColumnChildren = (localColumn, targetColumn) => {
		const cur_children = localColumn.children
		if(Array.isArray(cur_children) && Array.isArray(targetColumn.children)) {
			// console.error(JSON.stringify(cur_children), 'cur_children   targetColumn_children', JSON.stringify(targetColumn.children))
			// children 排序
			localColumn.children = targetColumn.children.map(_column => {
				const findColumn = cur_children.find(l_column => l_column.prop === _column.prop)
				if(findColumn) {
					if(Array.isArray(findColumn.children)) {
						return sortColumnChildren(findColumn, _column)
					}
					return findColumn
				}
				return false
			}).filter(Boolean)
		}
		return localColumn
	}
	return checkedColumns.map(v => {
		// 深度克隆
		const cur = clone_columns.find(column => column.prop === v.prop)
		if (cur) {
			// children 内嵌处理
			return sortColumnChildren(cur, v)
		}
		return false
	})
	.filter(Boolean)
})
const localTable = ref(/*localTable*/)
watch(() => localColumns.value, () => {
	const ELTable = localTable.value?.tableRef
	console.log(ELTable, '获取 ELTable 测试')
	/*if(ELTable) {
		console.error('测试')
		/!*
		const table_states = ELTable.store.states
		const lastColumns = table_states._columns.value
		console.error(lastColumns, ' lastColumns')
		const sortColumnChildren = (localColumn, targetColumn) => {
			const cur_children = localColumn.children
			if(Array.isArray(cur_children) && Array.isArray(targetColumn.children)) {
				// console.error(JSON.stringify(cur_children), 'cur_children   targetColumn_children', JSON.stringify(targetColumn.children))
				// children 排序
				localColumn.children = targetColumn.children.map(_column => {
					const findColumn = cur_children.find(l_column => l_column.property === _column.prop)
					if(findColumn) {
						if(Array.isArray(findColumn.children)) {
							return sortColumnChildren(findColumn, _column)
						}
						return findColumn
					}
					return false
				}).filter(Boolean)
			}
			return localColumn
		}
		const newColumns = localColumns.value.map(v => {
			// 深度克隆
			const cur = lastColumns.find(column => column.property === v.prop)
			if (cur) {
				// children 内嵌处理
				return sortColumnChildren(cur, v)
			}
			return false
		}).filter(Boolean)
		// const newColumns = localColumns.map(v => lastColumns.find(_v => _v.property === v.prop)).filter(Boolean)
		table_states._columns.value = newColumns
		ELTable.store.updateColumns()
		// ELTable.doLayout?.()*!/
	}*/
})

const testClick = (e) => {
	// console.error('click 测试', e)
	options.value.showIndex = !options.value.showIndex
	// console.error(options.value, 'options.value')
	ElMessage.warning('this is a testClick.')
}
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
	get_multipleHeaderList(input)
		.then(data => {
			// console.log(data, 'data////')
			list.value = data.list
			total.value = data.total
		})
		.finally(() => {
			options.value.loading = false
		})
}
watch(() => searchParams.value, () => {
	queryList()
})
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
