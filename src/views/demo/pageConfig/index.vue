<template>
	<div class="testTable column-page-wrap">
		<!-- 公用搜索组件 -->
		<LeSearchForm ref="searchForm" v-model:search-data="searchData" :forms="forms" :loading="tableOpts.options.loading">
			<template #slot_label_test="{ label }">
				<div style="background: var(--el-color-danger); color: #fff; display: flex">
					label custom: string<span style="margin-left: auto; background: var(--el-color-primary)">{{ label }}</span>
				</div>
			</template>
		</LeSearchForm>
		<!--  LeTable 组件使用 示例：  -->
		<!--		:list="tableOpts.list"
		:total="tableOpts.total"
		:options="tableOpts.options"
		:columns_="tableOpts.columns"
		:columnsConfig="tableOpts.columnsConfig"-->
		<LeTable
			ref="tableRef"
			v-model:search-params="tableOpts.searchParams"
			v-bind="tableOpts"
			v-model:cur-row="tableOpts.curRow"
			v-model:checked-options="checkedColumns"
			:columns="activeColumns"
		>
			<template #toolLeft>
				<el-button @click="toggleForm">toggle searchForms（项目类型）测试</el-button>
				<el-button type="primary" @click="addHandler">
					新增
					<el-icon class="btn-icon">
						<Plus />
					</el-icon>
				</el-button>
				<el-button type="danger">
					删除
					<el-icon class="btn-icon">
						<Delete />
					</el-icon>
				</el-button>
				<el-button>
					Upload
					<el-icon class="btn-icon">
						<Upload />
					</el-icon>
				</el-button>
			</template>
			<template #toolRight>
				<el-button type="primary" @click="addHandler">
					toolRight
					<el-icon class="btn-icon">
						<Plus />
					</el-icon>
				</el-button>
			</template>
			<template #top>
				<div class="p-[10px] mb-[10px]" style="background-color: rgb(248 113 113)">顶部自定义插槽#top</div>
			</template>
			<template #testHeader="{ column }">
				<!-- 如果是自己定义header 时 需要自己添加 header的相关填充 -->
				<div class="slot_title-wrap">
					<el-tooltip placement="top" :content="column.label">
						<span class="label">{{ column.label }}自定义header</span>
					</el-tooltip>
				</div>
			</template>
			<template #testDefault="{ row, column, $index }">
				<div>
					我是 testDefault
					<br />
					value:{{ row[column.property] }}
					<br />
					index: {{ $index }}
				</div>
			</template>
			<template #图表="{ row }">
				<LeChart v-if="row.chartOption_price" width="120px" height="38px" :option="row.chartOption_price" is-init-option />
				<div v-else style="height: 30px" />
			</template>
			<template #操作="{ row, column, $index }">
				<div>
					<el-button icon="delete" />
				</div>
			</template>
		</LeTable>
		<LeFormConfigDialog
			v-if="visible"
			ref="dialogRef"
			v-model="visible"
			:title="`${isCreate ? '新增' : '编辑'}配置`"
			width="1200px"
			:form-data="activeData"
			:form-options="formOptions"
			@submit="submitHandler"
		/>
	</div>
</template>

<script name="pageConfig" lang="tsx" setup>
import { nextTick, ref, reactive, watch, computed, unref } from 'vue'
import { getAdminList } from '@/api/demo'
import { ElMessage } from 'element-plus'
import { useTablePage } from '@/hooks/useTablePage'
import i18n from '@/lang'
import { SearchParams } from '@/components/Table'
import { LeFormItem } from '@/components/FormConfig/formConfig.types.ts'
import { colorBase1 } from '@/components/Chart.vue'
// import { Plus, Delete } from '@element-plus/icons-vue'
const tableRef = ref()
// window.tableRef = tableRef
const _forms = [
	{
		prop: 'render',
		label: '自定义Render',
		itemType: 'render',
		/**注意：自定义的配置未在render内部调用会自动触发...*/
		onInput: e => {
			console.error('onInput....', e)
		},
		onChange: e => {
			// change: e => { // render  todo  onEvents...
			console.error('onChange....', e)
		},
		render: extendsParams => {
			const { form, params } = extendsParams
			// console.error(extendsParams, 'extendsParams')
			return <el-input v-model={params[form.prop]} placeholder="placeholder test... 666" />
			// return <el-input onChange={form.onInput} v-model={params[form.prop]} placeholder="placeholder test... 666" />
			// return <el-input onChange={form.onChange} v-model={params[form.prop]} placeholder="placeholder test... 666" />
			/*return <div style="background: #f0f; display: flex; padding: 0 10px;">
				<el-input modelValue={params[form.prop]} onInput={(e) => (params[form.prop] = e)} placeholder="placeholder render"/>
				<el-input modelValue={params.others} onInput={(e) => (params.others = e)} placeholder="placeholder others"/>
			</div>*/
		}
	},
	// select 单选
	{
		prop: 'projectType',
		label: '项目类型Select',
		itemType: 'select',
		// span: 8,
		placeholder: '请选择项目类型',
		options: [
			{ value: '类型one', label: '类型一' },
			{ value: '类型two', label: '类型二' }
		]
		/* rules: [
				{ required: true, message: '请选择项目类型', trigger: 'blur' }
		]*/
	},
	// select 多选
	{
		prop: 'select多选',
		label: 'select多选',
		itemType: 'select',
		multiple: true,
		collapseTags: true,
		maxCollapseTags: 1,
		filterable: true,
		itemWidth: '200px',
		// span: 8,
		options: [
			{ value: '类型one', label: '类型一' },
			{ value: '类型two', label: '类型二' },
			{ value: '类型three', label: '类型三' }
		]
		/* rules: [
				{ required: true, message: '请选择select多选', trigger: 'blur' }
		]*/
	},
	{
		prop: 'department',
		label: '所属部门radio',
		itemType: 'radio',
		span: 8,
		placeholder: '请选择所属部门',
		options: [
			{ value: '0', label: '部门一' },
			{ value: '1', label: '部门二' }
		]
		/* rules: [
				{ required: true, message: '请选择所属部门', trigger: 'blur' }
		]*/
	},
	{
		prop: 'cascader',
		label: '省市区',
		// t_label: `${prefix}test4`,
		itemType: 'cascader',
		// placeholder: '请选择cascader____',
		options: [
			{
				value: 'zhejiang',
				label: '浙江',
				children: [
					{
						value: 'hangzhou',
						label: '杭州',
						children: [
							{
								value: 'xihu',
								label: '西湖'
							}
						]
					}
				]
			},
			{
				value: 'jiangsu',
				label: '江苏',
				children: [
					{
						value: 'nanjing',
						label: '南京'
					}
				]
			}
		],
		slots: {
			// option: 'cascaderSelectSlot',
			option: ({ node, data }) => {
				return (
					<div style="color: #f0c;">
						{data.label} - <span style="background: #0ff">标记</span>
					</div>
				)
			}
		}
		/*rules: [
			{
				required: true,
				// message: 'validate.validateEmptyTips',
				message: i18n.global.t('le.validate.validateEmptyTips', {
					name: 'cascader' // i18n.global.t(`${prefix}test4`)
				}),
				trigger: 'blur'
			}
		]*/
	},
	{
		prop: 'custName',
		label: '客户名称',
		itemType: 'input',
		span: 8,
		placeholder: '请输入客户名称Test..............'
		/* rules: [
				{ required: true, message: '请输入客户名称', trigger: 'blur' },
				{ type: 'email', message: '请输入正确的客户名称(邮箱)', trigger: ['blur', 'change'] }
		]*/
	},
	{
		prop: 'inputNumber', // 提交的 params 的字段
		label: '数字', // label 标签
		itemType: 'inputNumber', // form-item 类型
		prefixIcon: '￥',
		suffixIcon: '*'
		// change: val => {
		// 	console.log('inputNumber   change.....', val)
		// }
	},
	{
		prop: 'inputNumberRange', // 提交的 params 的字段
		label: 'inputNumberRange', // label 标签
		itemType: 'inputNumberRange', // form-item 类型
		// controlsPosition: '',
		// itemWidth: '100px'
		itemStyle: 'width: 120px; max-width: 120px; overflow: hidden;'
		// prepend: 'Http://', // 额外form-item配置
		// append: '.com' // 额外form-item配置
		// placeholder: '请输入input..............' // 额外form-item配置
	},
	{
		prop: 'bondCode', // 默认走bondCode 对应的  bondCodeStart, bondCodeEnd 两个字段取值 若有不同 请 使用 startKey, endKey 作定义
		// startKey: 'woCaoStart',
		// endKey: 'woCaoEnd',
		label: '起止时间',
		// type: 'daterange', // form-item 类型
		type: 'datetimerange', // form-item 类型
		valueFormat: 'MM/DD/YYYY HH:mm:ss',
		itemType: 'datePicker',
		span: 8,
		// 多语言
		t_startPlaceholder: 'le.filter.startDate',
		t_endPlaceholder: 'le.filter.endDate',
		// startPlaceholder: 'dateRangeStart',
		// endPlaceholder: 'dateRangeEnd',
		placeholder: '请添加起止时间',
		rules: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' }]
	},

	{
		prop: 'projectManager',
		label: '时间 Date',
		itemType: 'datePicker',
		span: 8,
		// placeholder: '请输入时间 Date',
		rules: [{ required: true, message: '请输入时间 Date', trigger: 'blur' }]
		/*format: (value, key) => {
			// form表单提交时候 调用的....
			console.warn(value, key, 'value, key')
			return 'value:' + value
		}*/
	},
	{
		prop: 'switch',
		// label: 'switch',
		t_label: 'le.table.hasChecked',
		itemType: 'switch',
		slots: {
			/*label({ label }) {
				console.error(label, 'label...')
				return (
					<span style="background: var(--el-color-danger);display: flex">
						label custom: fn<span style="margin-left: auto; background: #0f0">{label}</span>
					</span>
				)
			},*/
			label: 'slot_label_test'
		},
		// itemStyle: 'background: var(--el-color-danger)',
		span: 8,
		// inlinePrompt: true,
		activeText: '是',
		inactiveText: '否',
		change(value, options, params) {
			console.warn('dataType change  value, options, params', value, options, params)
		}
	}
] as LeFormItem[]
const labelWidth = 120
const span = 23
const showResetBtn = true
const searchForm = ref(/*searchForm*/)
const isCreate = ref(true)
const visible = ref(false)
const activeData = ref({})
const forms = ref(
	_forms.map(v => {
		v.rules = []
		v.span = undefined
		return v
	})
)
const formOptions = ref({
	forms: _forms,
	labelWidth,
	span,
	showResetBtn,
	formConfig: {
		submitLoading: false
	}
})

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

// table列表数据请求
const queryList = () => {
	const { options } = tableOpts
	options.loading = true
	console.log('搜索参数： ', JSON.stringify(tableOpts.searchParams))
	getAdminList(tableOpts.searchParams)
		.then((data: any) => {
			const { total, data: list } = data
			tableOpts.total = total
			list.map(v => (v.chartOption_price = getChartOption_price(v.price_ary)))
			// list.push({})
			tableOpts.list = list
		})
		.finally(() => {
			options.loading = false // 更改加载中的 loading值
		})
}
// table 参数
const columns = [
	{
		prop: 'username',
		label: '角色',
		// resizable:false,
		slots: {
			header: 'testHeader'
			// default: 'testDefault'
		},
		minWidth: 100
		// formatter: (row, column) => {
		//   console.log(row, column, 'row, column   角色');
		//   return row.name || '- 66666 -'
		// },
		/*params: {
			ellipsis_line: '3'
		}*/
	},
	{
		// slots.default > formatter
		prop: 'add_time',
		label: '创建日期',
		sortable: true,
		minWidth: 100,
		titleHelp: {
			message: (
				<span style="background: var(--el-color-danger)">
					我是自定义 <br />
					提示提示
				</span>
			)
		},
		slots: {
			// header: 'testDefault',
			// default: 'testDefault'
		},
		formatter: (row: any, column: any) => {
			// console.log(row, column, 'row, column');
			/** 若在内部用到jsx写法 需要在 script 新增 lang 为 jsx || tsx */
			return <div style="background: #f0f;">${row.name || '- 66666 -'}</div>
		}
	},
	{
		prop: 'describe',
		label: '备注信息',
		minWidth: 100,
		slots: {
			header: '备注信息header'
			// default: '备注信息default',
			// default: ({ column, row, $index }) => {
			//   return `value: ${row[column.property]} index: ${$index} default function 自定义`
			//   // console.warn(...args, 'test....')
			// },
			// default: 'testDefault'
		}
	},
	{
		prop: 'email',
		label: '邮箱',
		minWidth: 200
	},
	{
		prop: 'price_ary',
		label: '趋势图',
		minWidth: 150,
		slots: {
			default: '图表'
		}
	},
	{
		prop: 'action',
		label: '操作',
		width: 100,
		fixed: 'right',
		slots: {
			default: '操作'
		}
	}
]
const { searchData, tableOpts, checkedColumns, activeColumns, updateParams } = useTablePage(
	{
		searchParams: {
			page: 1,
			size: 10
		},
		// 当前选中数据
		curRow: {
			id: `id_1`,
			google_key: Math.random() > 0.5 ? 1 : 0,
			username: `username_1`,
			add_time: '2020-09-09 05:20:50',
			describe: `describe_1`,
			status: 1,
			phone: 1,
			email: `demo1@com.cn`,
			// roles: [[1, 2], [0, 1, 2], [2]][i % 3],
			roles: []
		},
		// 需要展示的列
		columns,
		// 控制列配置
		columnsConfig: {
			columns,
			defaultCheckedOptions: columns.slice(0, 2)
		}
	},
	{
		searchData: {
			inputNumberRange: [1, 5]
		},
		queryList,
		fetchImmediate: false
	}
)
nextTick(() => {
	// 模拟特殊情况初始化搜索数据
	searchData.value = {
		inputNumberRange: [1, 5],
		projectType: '类型one'
	}
	// debugger
	searchForm.value?.forceUpdateInitParams(tableOpts.searchParams)
})
/*setTimeout(() => {
	// 模拟特殊情况初始化搜索数据
	searchData.value = {
		inputNumberRange: [1, 5],
		projectType: '类型one'
	}
	// debugger
	searchForm.value.forceUpdateInitParams(tableOpts.searchParams)
	window.searchForm = searchForm
})*/
// 模拟从api获取到选中的columns
checkedColumns.value = columns.slice(-3)
/*const tableOpts = reactive({
	searchParams: {
		page: 1,
		size: 10,
		inputNumberRange: [1, 5]
	},
	curRow: {
		id: `id_1`,
		google_key: Math.random() > 0.5 ? 1 : 0,
		username: `username_1`,
		add_time: '2020-09-09 05:20:50',
		describe: `describe_1`,
		status: 1,
		phone: 1,
		email: `demo1@com.cn`,
		// roles: [[1, 2], [0, 1, 2], [2]][i % 3],
		roles: []
	},
	total: 0, // table数据总条数
	list: [], // table数据
	// table 的参数
	options: {
		loading: false, // 是否添加表格loading加载动画
		showOverflowTooltip: false,
		multipleSelect: true, // 是否支持列表项选中功能
		// stripe: true, // 是否为斑马纹 table
		// highlightCurrentRow: true, // 是否支持当前行高亮显示
	},
	// 需要展示的列
	columns,
	// 控制列配置
	columnsConfig: {
		columns,
		defaultCheckedOptions: columns.slice(0, 2)
	}
})*/
// 选中的columns
// const checkedColumns = ref(JSON.parse(JSON.stringify(columns.slice(0, 2))))
/*const checkedColumns = ref(columns.slice(0, 2))*/
// 活跃的columns
/*const activeColumns = computed(() => {
	const _checkedColumns = unref(checkedColumns)
	if(!_checkedColumns.length) return columns
	return _checkedColumns.map(v => {
		const cur = columns.find(column => column.prop === v.prop)
		if (cur) {
			const fixedFlag = cur.fixed
			if (fixedFlag) {
				v.fixed = fixedFlag
			}
			return cur
		}
	}).filter(Boolean)
})*/
watch(
	() => tableOpts.curRow,
	(v, oldv) => {
		console.error(v, 'tableOpts.curRow')
	},
	{
		immediate: true
	}
)

const addHandler = () => {
	isCreate.value = true
	activeData.value = {}
	visible.value = true
}

const toggleForm = () => {
	const idx = forms.value.findIndex(v => v.prop === 'projectType')
	if (idx >= 0) {
		forms.value.splice(idx, 1)
	} else {
		forms.value.unshift({
			prop: 'projectType',
			label: '项目类型',
			itemType: 'select',
			// span: 8,
			placeholder: '请选择项目类型',
			options: [
				{ value: '类型one', label: '类型一' },
				{ value: '类型two', label: '类型二' }
			]
		})
	}
}
const submitHandler = params => {
	formOptions.value.formConfig.submitLoading = true
	// const submitParams = {
	//   ...params
	// }
	const addConfig = params =>
		new Promise(resolve => {
			console.warn(params, 'submit info')
			setTimeout(() => {
				resolve({ data: true, code: 200 })
			}, 1000)
		})
	const editConfig = addConfig
	;(isCreate.value ? addConfig : editConfig)(params)
		.then(data => {
			ElMessage.success(`${isCreate.value ? '新增' : '修改'}成功~`)
			visible.value = false
			updateParams()
			/*tableOpts.searchParams = {
			  ...tableOpts.searchParams as SearchParams,
			  page: 1
			}*/
		})
		.finally(() => {
			formOptions.value.formConfig.submitLoading = false
		})
}
</script>

<style scoped lang="scss">
.testTable {
	padding: 10px;
}
.btn-icon {
	margin-left: 6px;
}
</style>
