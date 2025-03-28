<template>
	<div class="column-page-wrap">
		<!-- 公用搜索组件 -->
		<LeSearchForm v-model:searchData="searchData" :forms="searchForms" :loading="tableOpts.options.loading" />
		<!-- 公用Table组件 -->
		<LeTable v-model:searchParams="tableOpts.searchParams" v-bind="tableOpts" v-model:checked-options="checkedColumns" :columns="activeColumns">
			<template #toolLeft>
				<el-button type="primary" size="default" @click="addItem">
					新增<el-icon><Plus /></el-icon>
				</el-button>
			</template>
			<template #toolRight>
				<el-button type="primary"> toolRight </el-button>
			</template>
			<template #top>
				<div class="p-[10px] mb-[10px]" style="background-color: rgb(248 113 113)">顶部自定义插槽#top</div>
			</template>
			<template #绑定状态="{ row }">
				<el-switch :active-value="1" :inactive-value="0" :loading="row.loading" v-model="row.google_key" @click="changGooGleKey(row)" />
			</template>
			<template #账号状态="{ row }">
				<el-tag :type="['success', 'warning', 'error'][row.status]">
					{{ { 0: '正常', 1: '锁定', 2: '禁用' }[row.status] || '-' }}
				</el-tag>
			</template>
			<template #角色="{ row }">
				<template v-if="row.roles.length">
					<el-tag>{{ row.roles.map(id => rolesOptions_config[id]).join('， ') }}</el-tag>
				</template>
				<template>-</template>
			</template>
			<template #图表="{ row }">
				<LeChart v-if="row.chartOption_price" width="120px" height="38px" :option="row.chartOption_price" is-init-option />
				<div v-else style="height: 30px" />
			</template>
			<template #描述="{ row }">
				<LeText :value="row.describe" line-clamp="2" />
			</template>
			<template #操作="{ row }">
				<div class="btn-actions-flex-gap">
					<el-tooltip placement="top" content="查看">
						<el-button class="local_btn" @click="changeItem(row)" icon="View"></el-button>
					</el-tooltip>
					<el-tooltip placement="top" content="修改">
						<el-button class="local_btn" type="primary" icon="Edit" @click="changeItem(row, true)" />
					</el-tooltip>
					<el-tooltip placement="top" content="删除">
						<el-button class="local_btn" type="danger" icon="Delete" @click.prevent="changGooGleKey(row)" />
					</el-tooltip>
				</div>
			</template>
		</LeTable>
		<!-- 编辑表单弹窗 -->
		<LeFormConfigDialog
			v-if="dialog.visible"
			ref="dialogRef"
			v-model="dialog.visible"
			v-bind="dialog"
			:formData="activeData"
			:title="`${dialog.isCreate ? '新增' : '编辑'}管理员`"
			@submit="submitHandler"
		/>
	</div>
</template>
<script setup lang="ts" name="adminManage">
import { ref, reactive, watch, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAdminList, queryEdit } from '@/api/demo'
import { forms, search_forms, columns, rolesOptions_config } from './config.data'
import { useTablePage } from '@/hooks/useTablePage'
import { SearchParams } from '@/components/Table'
import { colorBase1 } from '@/components/Chart.vue'

// todo ... 尝试调整 state 编写 合适的 Hooks 进行替换
// 搜索配置
const searchForms = ref(search_forms)
const state: any = reactive({
	// 需要展示的列
	columns,
	activeData: {},
	// 弹窗配置
	dialog: {
		visible: false,
		isCreate: true,
		formOptions: {
			forms,
			formConfig: {
				labelWidth: 80,
				itemWidth: '100%',
				submitLoading: false
			},
			isEdit: true
		}
	}
})
const updateParams = () => {
	const { dateRange, ...opts } = searchData.value || {}
	// 时间区间
	if (Array.isArray(dateRange) && dateRange.length) {
		opts.search_begin_date = `${dateRange[0]} 00:00:00`
		opts.search_end_date = `${dateRange[1]} 23:59:59`
	} else {
		opts.search_begin_date = opts.search_end_date = undefined
	}
	tableOpts.searchParams = {
		...(tableOpts.searchParams as SearchParams),
		...opts,
		page: 1
	}
}

const commonChartOpts = ({ xAxis = [], data = [], formatter, series: _series }) => {
	const series = _series || [
		{
			showSymbol: false,
			smooth: true,
			data,
			lineStyle: {
				width: 1
			},
			symbolSize: 0,
			areaStyle: {
				color: 'rgba(91, 143, 249, 0.1)'
			},
			type: 'line'
		}
	]
	return {
		legend: { show: false },
		color: colorBase1,
		grid: {
			top: 0,
			left: 0,
			bottom: 0,
			right: 0
		},
		tooltip: {
			trigger: 'axis',
			position: ['-150px', '-80px'],
			axisPointer: {
				label: {
					show: false
				}
			},
			formatter
		},
		xAxis: {
			show: false,
			type: 'category',
			data: xAxis,
			axisLine: {
				show: false
			},
			axisTick: {
				show: false
			},
			axisLabel: {
				show: false
			}
		},
		yAxis: {
			show: false,
			type: 'value',
			axisLine: {
				show: false,
				lineStyle: {
					width: 1
				}
			},
			axisTick: {
				show: false
			},
			axisLabel: {
				show: false
			}
		},
		series
	}
}

const getChartOption_price = (chart: any[]) => {
	const xAxis = chart.map(v => v.date)
	const series = ['min', 'max'].map(key => {
		const data = chart.map(v => v[key])
		return {
			name: key,
			showSymbol: false,
			smooth: true,
			data,
			lineStyle: {
				width: 1
			},
			symbolSize: 0,
			areaStyle: {
				color: 'rgba(91, 143, 249, 0.1)'
			},
			type: 'line'
		}
	})
	const formatter = series => {
		const markers = series.reduce((res, v) => {
			res += `<br>${v.marker}${v.seriesName}:  ${v.value}`
			return res
		}, '')
		const params = series[0]
		return markers ? `${params.axisValue}${markers}` : undefined
	}
	return commonChartOpts({ xAxis, series, formatter })
}
//获取管理员列表
const queryList = () => {
	// const params = getRequestParams() // todo...
	const params = tableOpts.searchParams
	console.error(JSON.stringify(params), '请求参数')
	tableOpts.options.loading = true
	getAdminList(params)
		.then((data: any) => {
			console.error(data, 'data...')
			tableOpts.list = data.data.map(v => ({ ...v, loading: false, chartOption_price: getChartOption_price(v.price_ary) }))
			tableOpts.total = data.total
		})
		.finally(() => {
			tableOpts.options.loading = false // 更改加载中的 loading值
		})
}
const { tableOpts, checkedColumns, activeColumns, searchData } = useTablePage(
	{
		// 搜索数据
		searchParams: {
			page: 1,
			size: 20
		},
		columns,
		options: {
			// showOverflowTooltip: false,
			loading: false,
			showIndex: true,
			size: 'small'
		},
		// 控制列配置
		columnsConfig: {
			columns,
			defaultCheckedOptions: columns.slice(0, 2)
		}
	},
	{
		searchData: {
			search_word: '', // search_word
			search_google_key: 1,
			search_status: 1,
			// dateRange: undefined
			dateRange: ['06/29/2025', '03/30/2025']
		},
		updateParams,
		queryList
	}
)
// 模拟后端请求获取的 选中的columns
checkedColumns.value = columns.slice(-3)
/*const getRequestParams = () => {
	const { dateRange, ...opts } = tableOpts?.searchParams || {}
	// 时间区间
	if (Array.isArray(dateRange) && dateRange.length) {
		opts.search_begin_date = `${dateRange[0]} 00:00:00`
		opts.search_end_date = `${dateRange[1]} 23:59:59`
	} else {
		opts.search_begin_date = opts.search_end_date = undefined
	}
	state.query = {
		...state.query,
		...opts
	}
	return state.query
}*/
const { dialog, activeData } = toRefs(state)
const submitHandler = params => {
	dialog.value.formOptions.formConfig.submitLoading = true
	if (!dialog.value.isCreate) {
		// 编辑
		params.id = activeData.value.id
	}
	queryEdit(params)
		.then(data => {
			ElMessage.success(`${dialog.value.isCreate ? '新增' : '修改'}成功~`)
			dialog.value.visible = false
			updateParams()
		})
		.finally(() => {
			dialog.value.formOptions.formConfig.submitLoading = false
		})
}
const dialogRef = ref()
const addItem = () => {
	activeData.value = {}
	dialog.value.isCreate = true
	dialog.value.formOptions.isEdit = true
	dialog.value.visible = true
	// window.dialogRef = dialogRef // 测试ref
}

const changeItem = (value: any, isEdit = false) => {
	console.log('changeItem', value, isEdit)
	activeData.value = { ...value }
	dialog.value.isCreate = false
	dialog.value.formOptions.isEdit = isEdit
	dialog.value.visible = true
}
const changGooGleKey = (row: Recordable) => {
	ElMessage({
		message: '操作成功!',
		type: 'success'
	})
	row.loading = true
	updateParams()
	/*if (key) {
		ElMessageBox.confirm('是否解除该账号谷歌验证绑定？', '提示', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			// type: 'info',
			buttonSize: 'default'
		}).then(() => {
			ElMessage({
				message: '解绑成功!',
				type: 'success'
			})
		})
	} else {
		ElMessageBox.confirm('是否删除该用户？', '提示', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'info',
			buttonSize: 'default'
		})
			.then(() => {
				ElMessage({
					message: '操作成功!',
					type: 'success'
				})
				updateParams()
			})
			.catch(() => {
				console.log('取消')
			})
	}*/
}
</script>

<style lang="scss" scoped>
.local_btn {
	width: 36px;
	height: 34px;
}
</style>
