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
				<h3 style="line-height: 36px;">多级表头示例</h3>
				<el-button @click="toggleColumns">切换 columns</el-button>
			</template>
			<template #validNum="{row, column}">
				<span style="color: #e6a23c;">{{row[column.property]}}</span><br/>
				(slots.default: string)
			</template>
		</LeTable>
	</div>
</template>
<script setup lang="tsx" name="mutipleHeader">
import { ref, toRefs, reactive, computed, watch, onMounted } from 'vue'
import i18n from '@/lang/index'
import { ElMessage } from 'element-plus'
import { get_mutipleHeaderList } from '@/views/table/queryApi.js'
const total = ref(0)
const list = ref([])
const options = ref({
	// rowKey: 'value',
	loading: false,
	size: 'small',
	// showIndex: true,
	multipleSelect: true
})
const searchParams = ref({
	page: 1,
	size: 20
})

const showAll = ref(true)

const localColumns = computed(() => {
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
})
// 切换columns
const toggleColumns = () => {
	showAll.value = !showAll.value
}
const testClick = (e) => {
	// console.error('click 测试', e)
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
	get_mutipleHeaderList(input)
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
	background-color: #f5f6f7;
}

// 其他样式
.local_table {
	//padding: 0 12px;
	box-shadow: 0 0 6px 4px rgb(145 159 175 / 6%);
	border-top: 1px solid #eaedf0;
	border-radius: 6px 6px 0 0;
	background-color: #fff;
	//padding: 12px 12px 0 12px;
	&.tabs_content-wrap {
		border-top: 0;
		border-radius: 0;
	}

	// 若因调整 toolRight 导致宽度 不为96px 时 需要做调整 调整1 eg:
	/*&::v-deep {
		.le-column-wrap {
			display: none;
		}
	}*/
}

.local_search-group-wrap ::v-deep {
	// 若因调整 toolRight 导致宽度 不为96px 时 需要做调整 调整2 eg:
	/*.tags-wrap {
		margin-right: 48px;
	}
	.le-search-group-tags .tags-action {
		right: -48px;
	}*/
}

.le-button-wrap {
	padding-bottom: 12px;
}
</style>
