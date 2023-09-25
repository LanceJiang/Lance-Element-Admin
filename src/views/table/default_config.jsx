import { getOrders, getOrdersCount } from '@/views/table/queryApi'
import { cellSlot_price } from '@/sys_cellSlots/index.jsx'
// import tabsMixin from './tabsMixin'
// import { cellSlot_price } from '@/../src/utils/cellSlots.vue'

const tPrefix = 'example.table.'

/**
 *  不同组件下配置的区别
 *  leTable slots.default: ({row, column, (index...)}){ return <element> } 为方便 le(Vxe)Table 之间 slots共用 建议使用 return [<element>] 兼容table间的公用
 *  leVxeTable slots.default: ({row, column, (rowIndex, $rowIndex, columnIndex, $columnIndex, _columnIndex)}){ return [<element>]}
 */
const slot_user = (scope) => {
	// console.error('slot_user', scope)
	// $rowIndex 指 vxeTable Cell  $index 指 elTable Cell
	// if (scope.$rowIndex === 0 || scope.$index === 0) console.error(scope, 'slot_user scope 第一条数据') // todo
	const { row, column } = scope
	return [
		<div style={'background: #0ff;'}>
			slot:default <br />
			<div style={'color: var(--el-color-primary)'}>{row[column.property]}</div>
		</div>
	]
}

const userConfig = {
	t_label: `${tPrefix}user`,
	prop: 'local_user',
	/** 渲染自定义 可以使用 slots  && formatter */
	slots: {
		default: slot_user,
		header: 'slotName_title'
	},
	minWidth: '185px',
	showOverflowTooltip: false
	// // 暂时没有该功能（column 配置 column children） 配置仅做参考
	// children: [
	//   {
	//     label: 'child0_001',
	//     prop: 'child0_001'
	//   },
	//   {
	//     label: 'child0_002',
	//     prop: 'child0_002'
	//   }
	// ]
}
const testColumns = Array.from({ length: 20 }).map((_, i) => ({
	label: `${tPrefix}test_${i}`,
	// title: `${tPrefix}test_${i}`,
	prop: `test_${i}`,
	// field: `test_${i}`,
	minWidth: '130px'
}))
export const columns = [
	userConfig,
	{
		t_label: `${tPrefix}orderNo`,
		// title: `${tPrefix}orderNo`,
		// prop: 'orderNo',
		prop: 'testDeep.deep2.deep3',
		// field: 'orderNo',
		minWidth: '220px',
		// 用户提示配置
		titleHelp: {
			icon: 'le-iconfont le-check_1', // todo 自定义icon
			message: `<span style='background: var(--el-color-danger)'>wo的 <br/>sssssssssss</span>`
		},
		slots: {
			/**
			 *  不同组件下配置的区别
			 *  leTable slots.default: ({row, column, (index...)}){ return [<element>] || <element> } 为方便 le(Vxe)Table 之间 slots共用 建议使用 return [<element>] 兼容table间的公用
			 *  leVxeTable slots.default: ({row, column, (rowIndex, $rowIndex, columnIndex, $columnIndex, _columnIndex)}){ return [<element>]}
			 */
			// default: ''
		},
		sortable: true,
		showOverflow: 'tooltip',
		formatter(maybeRow, ...others) {
			/**
			 * 不同组件下配置的区别
			 *  leTable formatter: (row, column, cellValue, index){}
			 *  leVxeTable formatter: ( {row, column, cellValue, rowIndex} ){}
			 */
			// console.error(maybeRow, 'maybeRow ', others, 'others')
			// const row = maybeRow.row || maybeRow
			// return <span style="background: var(--el-color-danger);">{'orderNo: formatter: ' + row.orderNo}</span>
			return others[1]// cellValue
		}
	},
	{
		label: 'slotPrice',
		// title: `${tPrefix}orderNo`,
		prop: 'priceValue',
		align: 'right',
		minWidth: '240px',
		slots: {
			// default: cellSlot_price() // 默认 金额单位 currency, 再是 非 prop 的数据渲染
			default: cellSlot_price('currency', 'priceValue')
		}
	},
	...testColumns,
	{
		t_label: 'le.table.action',
		// align: 'right',
		// title: 'le.table.action',
		label: '测试的 action label 非 t_label',
		prop: 'action',
		// field: 'action',
		slots: {
			default: 'action'
		},
		fixed: 'right',
		minWidth: '150px'
	}
]

// 初始化 tabs_checkedColumns (用于 接口还没获取到 之前保存的columns 配置)
export const tabs_checkedColumns = columns.map(v => v)

const iconOptions = [
	{ label: 'le-insurance_grey', value: 2, icon: 'le-insurance', color: '#C6CDD5' },
	{ label: 'le-sign_grey', value: 4, icon: 'le-sign', color: '#C6CDD5' },
	{ label: 'le-insurance_green', value: 1, icon: 'le-insurance', color: '#03B497' },
	{ label: 'le-sign_green', value: 3, icon: 'le-sign', color: '#03B497' }
]
const icon_configObj = iconOptions.reduce((res, v) => {
	res[v.value] = {
		icon: v.icon,
		color: v.color
	}
	return res
}, {})

// 若有特殊的 默认配置 (产品特殊要求 含: column 展示配置  和 展示 顺序)
export const defaultCheckedOptions = [userConfig] // columns.map((v) => v).reverse()

// 搜索的表单配置 示例
// 表单对象值
export const tabs_filterParams = {
	// render: 'testXXX',
	// others: '',
	// pattern: 'input 搜索',
	// input: 'testInput',
	// leSelect: '选项1',
	// leSelectMore: '选项2',
	// leSelectMultiple: ['选项3'],
	// leSelectMultipleMore: ['选项4'],
	// radio: 0,
	// inputMore: 'inputMore_init',
	// dateRange: ['11/10/2022', '11/25/2022'],
	// dateRangeMore: [],
	// datePickerMore: '11/25/2022',
	// leSelect_icon: 3
	// // datePickerMore: '2022-11-25'
	// // inputNumber: undefined
}
// 筛选表单配置类目
export const get_tabs_filterForms = () => [
	{
		visible: true, // 只要不为false 就是 展示
		isMore: false, // 只要不为true 就是 默认展示
		prop: 'input', // 提交的 params 的字段
		label: 'input', // label 标签
		itemType: 'input' // form-item 类型
		// prepend: 'Http://', // 额外form-item配置
		// append: '.com' // 额外form-item配置
		// placeholder: '请输入input..............' // 额外form-item配置
	},
	{
		visible: true, // 只要不为false 就是 展示
		isMore: false, // 只要不为true 就是 默认展示
		prop: 'inputNumberRange', // 提交的 params 的字段
		label: 'inputNumberRange', // label 标签
		itemType: 'inputNumberRange' // form-item 类型
		// prepend: 'Http://', // 额外form-item配置
		// append: '.com' // 额外form-item配置
		// placeholder: '请输入input..............' // 额外form-item配置
	},
	{
		// visible: true, // 只要不为false 就是 展示
		// isMore: true, // 只要不为true 就是 默认展示
		prop: 'leSelect_icon', // 提交的 params 的字段
		label: 'leSelect_icon', // label 标签
		itemType: 'leSelect', // form-item 类型
		options: iconOptions,
		slots: {
			option({ option, label }) {
				// console.error(option, label, 'option, label')
				const style = `color: ${option.color}`
				return <le-icon icon-class={option.icon} style={style}></le-icon>
			}
		},
		// 渲染选中的特殊展示
		tagRender({ searchParams, transLabel, deleteFn, isMore }) {
			// console.error(searchParams, transLabel, deleteFn, isMore, 'searchParams, label, value')
			// 当前搜索的数据源  转译后的formLabel 删除tag的处理函数 当前渲染请求是否来自更多筛选的展示(true 可知不需要请求 tag, 可针对性优化)
			const iconValue = searchParams['leSelect_icon']
			let showValue = ''
			let tag = ''
			if (iconValue) {
				const option = icon_configObj[iconValue]
				const style = `color: ${option.color}`
				showValue = <le-icon icon-class={option.icon} style={style}></le-icon>
				// isMore请求 无需生成 tag
				if (isMore) return { showValue }
				tag = (
					<el-tag disable-transitions>
						{transLabel}：{showValue ? <span class="el-tag__label">{showValue}</span> : ''}
						<i class="icon-delete" onClick={deleteFn} />
					</el-tag>
				)
			}
			return {
				showValue,
				tag
			}
		}
	},
	{
		visible: true, // 只要不为false 就是 展示
		isMore: true, // 只要不为true 就是 默认展示
		prop: 'inputMore', // 提交的 params 的字段
		label: 'inputMore', // label 标签
		itemType: 'input' // form-item 类型
		// prepend: 'Http://', // 额外form-item配置
		// append: '.com' // 额外form-item配置
	},
	{
		// visible: true, // 只要不为false 就是 展示
		// isMore: true, // 只要不为true 就是 默认展示
		prop: 'leSelect', // 提交的 params 的字段
		label: 'leSelect', // label 标签
		itemType: 'leSelect', // form-item 类型
		labelKey: 'label_1',
		valueKey: 'value_1',
		options: Array.from({ length: 20 }).map((_, i) => {
			return {
				value_1: '选项' + i,
				label_1: 'leSelect单选' + i
			}
		}),
		slots: {
			// slot template（$scopedSlots）  方式1
			option: 'leSelectSlot'
			// slot function 方式2
			// option({ option, label }) {
			//   return label + '_____'
			// }
		}
	},
	{
		// visible: true, // 只要不为false 就是 展示
		isMore: true, // 只要不为true 就是 默认展示
		prop: 'leSelectMore', // 提交的 params 的字段
		label: 'leSelectMore', // label 标签
		itemType: 'leSelect', // form-item 类型
		labelKey: 'label_1',
		valueKey: 'value_1',
		options: Array.from({ length: 20 }).map((_, i) => {
			return {
				value_1: '选项' + i,
				label_1: 'leSelectMore单选' + i
			}
		})
	},
	{
		// visible: true, // 只要不为false 就是 展示
		// isMore: true, // 只要不为true 就是 默认展示
		prop: 'leSelectMultiple', // 提交的 params 的字段
		label: 'leSelectMultiple', // label 标签
		itemType: 'leSelect', // form-item 类型
		multiple: true,
		labelKey: 'label_1',
		valueKey: 'value_1',
		options: Array.from({ length: 20 }).map((_, i) => {
			return {
				value_1: '选项' + i,
				label_1: 'leSelect多选' + i
			}
		})
	},
	{
		// visible: true, // 只要不为false 就是 展示
		isMore: true, // 只要不为true 就是 默认展示
		prop: 'leSelectMultipleMore', // 提交的 params 的字段
		label: 'leSelectMultipleMore', // label 标签
		itemType: 'leSelect', // form-item 类型
		multiple: true,
		labelKey: 'label_1',
		valueKey: 'value_1',
		options: Array.from({ length: 20 }).map((_, i) => {
			return {
				value_1: '选项' + i,
				label_1: 'leSelectMore多选' + i
			}
		})
	},
	{
		visible: true, // 只要不为false 就是 展示
		isMore: false, // 只要不为true 就是 默认展示
		prop: 'dateRange', // 提交的 params 的字段
		label: 'dateRange', // label 标签
		itemType: 'datePicker', // form-item 类型
		type: 'daterange', // form-item 类型
		change(params, options, isMore) {
			// // 模拟针对 change 事件 对 其他formItem 进行调整 (success) to do...
			// that.searchParams2.rangePicker = undefined // 测试only
			console.log(params, options, isMore, 'value, options, isMore')
		}
	},
	{
		visible: true, // 只要不为false 就是 展示
		isMore: true, // 只要不为true 就是 默认展示
		prop: 'dateRangeMore', // 提交的 params 的字段
		label: 'dateRangeMore', // label 标签
		itemType: 'datePicker', // form-item 类型
		// type: 'daterange', // form-item 类型
		type: 'datetimerange',
		valueFormat: 'yyyy-MM-dd HH:mm:ss', // 提交 数据
		format: 'MM/dd/yyyy HH:mm:ss' // label 展示
	},
	{
		visible: true, // 只要不为false 就是 展示
		isMore: false, // 只要不为true 就是 默认展示
		prop: 'datePicker', // 提交的 params 的字段
		label: 'datePicker', // label 标签
		itemType: 'datePicker' // form-item 类型
	},
	{
		visible: true, // 只要不为false 就是 展示
		isMore: true, // 只要不为true 就是 默认展示
		prop: 'datePickerMore', // 提交的 params 的字段
		label: 'datePickerMore', // label 标签
		// valueFormat: 'yyyy-MM-dd', // 提交 数据
		// format: 'MM/dd/yyyy', // label 展示
		itemType: 'datePicker' // form-item 类型
	},
	{
		visible: true, // 只要不为false 就是 展示
		isMore: false, // 只要不为true 就是 默认展示
		prop: 'inputNumber', // 提交的 params 的字段
		label: 'inputNumber', // label 标签
		itemType: 'inputNumber', // form-item 类型
		prefixIcon: '展示前缀',
		suffixIcon: '展示后缀',
		change: val => {
			console.log('inputNumber   change.....', val)
		}
	},
	{
		visible: true, // 只要不为false 就是 展示
		isMore: true, // 只要不为true 就是 默认展示
		prop: 'inputNumberMore', // 提交的 params 的字段
		label: 'inputNumberMore', // label 标签
		itemType: 'inputNumber' // form-item 类型
	},
	/* {
      // visible: true, // 只要不为false 就是 展示
      // isMore: true, // 只要不为true 就是 默认展示
      prop: 'select', // 提交的 params 的字段
      label: 'select', // label 标签
      itemType: 'select', // form-item 类型
      options: [
        { value: 0, label: '小三' },
        { value: 1, label: '小四' }
      ]
    }, */
	{
		prop: 'radio',
		label: 'radio',
		itemType: 'radio',
		// itemType: 'leSelect', // form-item 类型
		// filterable: true,
		// multiple: true,
		options: [
			{ value: 0, label: '未结算' },
			{ value: 1, label: '已结算' },
			{ value: 2, label: '全部' }
		],
		change: val => {
			console.log('radio   change.....', val)
		}
	},
	{
		isMore: true, // 只要不为true 就是 默认展示
		prop: 'radioMore',
		label: 'radioMore',
		itemType: 'radio',
		options: [
			{ value: 10, label: '1未结算' },
			{ value: 11, label: '1已结算' },
			{ value: 12, label: '1全部' }
		],
		change: val => {
			console.log('radio   change.....', val)
		}
	},
	{
		// 可用于特殊场合中 tagList 需要结合tagRender 做支持
		prop: 'render',
		label: '自定义Render',
		itemType: 'render',
		render: (extendsParams) => {
			console.error(extendsParams, 'extendsParams')
			const { form, params } = extendsParams
			// console.error(params, 'params')
			return (
				<div style="background: #f0f;">
					<el-input value={params[form.prop]} on-input={e => (params[form.prop] = e)} placeholder="placeholder render" />
					<el-input value={params.others} on-input={e => (params.others = e)} placeholder="placeholder others" />
				</div>
			)
		},
		tagRender({ searchParams, transLabel, deleteFn, isMore }) {
			// 当前搜索的数据源  转译后的formLabel 删除tag的处理函数 当前渲染请求是否来自更多筛选的展示(true 可知不需要请求 tag, 可针对性优化)
			// console.error(searchParams, transLabel, deleteFn, isMore, 'searchParams, label, value')
			const render = searchParams['render'] || ''
			const others = searchParams['others']
			let showValue = render ? `render: ${render}` : ''
			if (others) {
				showValue += (showValue ? ' -and- ' : '') + `others: ${others}`
			}
			let tag = ''
			if (showValue) {
				tag = (
					<el-tag disable-transitions>
						{transLabel}：
						{showValue ? (
							<span class="el-tag__label" title={showValue}>
								{showValue}
							</span>
						) : (
							''
						)}
						{/* {others ? [' others：', <span class="el-tag__label">{showValue}</span>] : ''} */}
						<i class="icon-delete" onClick={deleteFn} />
					</el-tag>
				)
			}
			return {
				showValue,
				tag
			}
		}
	}
	/* {
      // isMore: true, // 只要不为true 就是 默认展示
      prop: 'inputNumberRange', // 若不添加 propStart  propEnd 自动变为 `${prop}Start` `${prop}End`
      // propStart: 'inputNumberRange_start',
      // propEnd: 'inputNumberRange_end',
      label: 'inputNumberRange',
      itemType: 'inputNumberRange',
      placeholderStart: 'xxxx最小值',
      placeholderEnd: 'xxxx最大值',
      change(params, _options, isMore, propKey) {
        console.log(params, _options, isMore, propKey, 'params, _options, isMore, propKey')
      }
    } */
]

export const tableBaseMixin = {
	// mixins: [tabsMixin], // todo...
	data() {
		const tabs_filterForms = get_tabs_filterForms()
		// 默认存储的快捷搜索prop 对标:querySettings
		const tabs_defaultSettings = tabs_filterForms.filter(v => !v.isMore).map(v => v.prop)
		return {
			tabs_filterParams,
			tabs_filterForms,
			tabs_defaultSettings,
			searchParams: {
				page: 1,
				size: 20
			},
			list: [],
			total: 0,
			options: {
				// rowKey: 'value',
				loading: false,
				// showIndex: true,
				multipleSelect: true
			},
			dropdownList: ['save', 'others'],
			// 列配置对象
			tabs_columnsConfig: {
				// 所有的 columns 配置
				columns,
				// 默认展示配置
				defaultCheckedOptions
			},
			tabs_checkedColumns: JSON.parse(JSON.stringify(tabs_checkedColumns)),
			tabs_extraFilterProps: ['pattern'],
			// todo  后续 对于新增的搜索类型可能有需要参照用到 (后续去 delete)
			filterOptions: [
				{
					label: 'Test',
					key: 'test',
					type: 'radio',
					// slot: 'checkbox',
					options: [
						{ label: 'test', value: 'test' },
						{ label: 'UPS', value: 'abc' },
						{ label: 'Pitnet Bowers', value: 'PB' }
					],
					is_hide: true
				},
				// 不需要 可以通过leSelect 进行 平替
				{
					label: 'Checkbox',
					key: 'Checkbox',
					type: 'checkbox',
					// is_hidden_selectAll: true,
					// slot: 'checkbox',
					options: [
						{ label: 'Fedex', value: 'FEDEX' },
						{ label: 'UPS', value: 'UPS' },
						{ label: 'Pitnet Bowers', value: 'PB' },
						{ label: 'STAMPS', value: '1' }
					]
				},
				// todo...
				{
					label: 'Amount Range',
					key: 'Amount',
					type: 'amount-range',
					date_options: {
						min: 0,
						max: 1
					}
				},
				{
					label: 'Number Range',
					key: 'Number',
					type: 'number-range',
					date_options: {
						min: -1,
						max: 0
					}
				},
				{
					// todo delete
					label: 'Picker',
					key: 'Picker',
					type: 'date-picker',
					date_options: {
						type: 'daterange'
					}
				},
				{
					label: 'Select',
					key: 'Select',
					type: 'select',
					options: [
						{ label: 'Fedex', value: 'FEDEX' },
						{ label: 'UPS', value: 'UPS' },
						{ label: 'Pitnet Bowers', value: 'PB' },
						{ label: 'STAMPS', value: 'STAMPS' }
					],
					is_button: true
				},
				{
					label: 'Radio',
					key: 'Radio',
					type: 'radio',
					options: [
						{ label: 'Fedex', value: 'FEDEX' },
						{ label: 'UPS', value: 'UPS' },
						{ label: 'Pitnet Bowers', value: 'PB' },
						{ label: 'STAMPS', value: 'STAMPS' },
						{ label: 'Fedex', value: 'FEDEX1' },
						{ label: 'UPS', value: 'UPS1' },
						{ label: 'Pitnet Bowers', value: 'PB1' },
						{ label: 'STAMPS', value: 'STAMPS1' },
						{
							label: 'Range',
							value: 'Range',
							date_options: {
								min: -99999,
								max: 99999
							},
							range_data: this.radio_data, // 范围的数据
							range: true
						}
					],
					is_button: true
				},
				{
					label: '1234',
					key: '1234567',
					type: 'radio',
					options: [
						{ label: 'Fedex', value: 'FEDEX' },
						{ label: 'UPS', value: 'UPS' },
						{ label: 'Pitnet Bowers', value: 'PB' },
						{ label: 'STAMPS', value: 'STAMPS' },
						{ label: 'Fedex', value: 'FEDEX1' },
						{ label: 'UPS', value: 'UPS1' },
						{ label: 'Pitnet Bowers', value: 'PB1' },
						{ label: 'STAMPS', value: 'STAMPS1' },
						{
							label: 'Range',
							value: 'Range',
							date_options: {
								min: -99999,
								max: 99999
							},
							range_data: this.radio_data, // 范围的数据
							range: true
						}
					],
					is_button: true
				}
			]
		}
	},
	computed: {
		localList() {
			// 相关数据组装处理
			return this.list
		},
		localColumns() {
			// 为保险起见 拿到接口的配置数据 需要过滤 已失效的配置项 [tabs_checkedColumns]
			const { tabs_checkedColumns } = this
			const columns = this.tabs_columnsConfig.columns
			if (!tabs_checkedColumns.length) return columns
			return tabs_checkedColumns
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
		}
	},
	watch: {
		// 监听数据对象变更 重新做请求
		searchParams() {
			// searchParams 变更 重新做请求
			this.queryList()
		},
		// 更新tabs_filterParams
		tabs_filterParams: 'updateParams'
	},
	created() {
		window.test = this
		this.tabs_key = 'ui_tableDefault_0'
		// this.tabs_queryTableConfig()
		// 是否请求接口根据相关业务确定 todo...
		this.updateParams()
		// this.queryList()
	},
	methods: {
		get_tabs_filterForms,
		testSortChange(sortParams) {
			// 默认会更新 searchParams 有额外处理 在此添加
			console.error(sortParams, 'testSortChange sortParams')
		},
		updateParams() {
			console.error(JSON.stringify(this.tabs_filterParams), 'updateParams  去请求接口 todo....')
			this.searchParams = {
				...this.searchParams,
				...this.tabs_filterParams,
				page: 1
			}
		},
		// 获取请求参数方法
		getRequestParams(e) {
			// console.error('getRequestParams', e)
			return {
				...this.searchParams,
				...this.tabs_filterParams
			}
		},
		// 列表请求
		queryList() {
			this.options.loading = true
			const input = this.getRequestParams()
			console.warn('input', JSON.stringify(input))
			const p1 = getOrders(input).then(list => {
				this.list = list
			})
			const p2 = getOrdersCount(input.filter).then(total => {
				this.total = total
			})
			Promise.all([p1, p2])
				.catch(e => {
					this.$message.error(e.response?.errors?.[0].message)
				})
				.finally(() => {
					this.options.loading = false
				})
		},
		// 目前删除只针对 标签删除(未兼容 popoverItem 和 moreItem 的 clear)
		deleteTag(form, searchParams) {
			console.log('deleteTag ', form, searchParams)
			// 针对性删除特殊内容
			if (form.prop === 'render') {
				// 额外处理逻辑
				searchParams.others = ''
				// searchParams.render = 'render reset.........'
			}
		}
	}
}
