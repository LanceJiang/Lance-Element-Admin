import type { ElTable, ElTableColumn, TableColumnCtx } from 'element-plus/lib/components/table'
// import type { ElTable, ElTableColumn, TableColumnCtx } from 'element-plus/es/components/table'

export type LeColumnSlots = {
	// default?: ((scope: Record<string, any>) => any) | string
	// header?: ((scope: Record<string, any>) => any) | string
	default?: ((scope: { row; column; $index }) => HTMLDivElement | string) | string
	header?: ((scope: { column; $index }) => HTMLDivElement | string) | string
}
export type LeColumnProps = {
	// 多语言label转义字符
	t_label?: string
	// 插槽
	slots?: LeColumnSlots
	// 多级表头
	children?: LeTableColumnProps[]
}
/* Column */
export type LeTableColumnProps = InstanceType<typeof ElTableColumn>['$props'] & LeColumnProps

// Options 配置
export type Options = {
	// el-table参数
	height?: string
	maxHeight?: string
	size?: string

	// 表格分页器 pageSizes (默认:[10, 20, 50, 100])
	pageSizes?: number[]
	// 表格分页器 layout (默认:'total, sizes, prev, pager, next, jumper')
	layout?: string
	// 表格分页器 背景 (默认:true)
	background?: boolean

	// 额外table参数
	// 表格loading (默认:false)
	loading?: boolean
	// 是否多选类型 (默认:false)
	multipleSelect?: boolean
	// 多选类型|(currentRowKey当前行选中key)选中标记唯一key (默认:'id') 【table $prop属性之一】
	rowKey?: (row) => any | string
	// 根据 该值 查找当前页面数据是否包含当前数据 添加 高亮状态 (默认:'id')
	currentRowKey?: string
	// table 默认 column 对齐方式 (默认:'center')
	align?: string
	// table 默认 column 是否允许拖动 (默认:true)
	resizable?: boolean
	// table 默认 column 是否允许拖动 (默认:true)
	showOverflowTooltip?: boolean
	// 是否展示数据序列号 (默认:true)
	showIndex?: boolean
	// 展示数据序列号_label (默认:'序号')
	indexLabel?: string
	// table 默认 column 是否允许拖动 (默认:true)
	showPagination?: boolean

	// 其他
	[key: string]: any
}
/* TableOptions */
export type LeTableOptions = InstanceType<typeof ElTable>['$props'] & Options
// TableProps
export type LeTableProps = {
	// 数据列表
	list?: Record<string, any>[]
	// columns列表
	columns: LeTableColumnProps[]
	// 选中column的配置参数
	checkedOptions?: LeTableColumnProps[]
	// 自定义列配置相关
	columnsConfig?: {
		defaultCheckedOptions?: LeTableColumnProps[]
		columns?: LeTableColumnProps[]
	}
	// 搜索条件
	searchParams?: SearchParams
	// 数组总数
	total?: number
	// 表格的控制参数
	options?: LeTableOptions
	curRow?: { [key: string]: any } | null
}
/* TableActions */
export type LeTableActions = {
	// reload: (opt?: FetchParams) => Promise<void>
}

export type SearchParams = {
	page: number
	size: number
	[key: string]: any
}

export type RenderScope<T> = {
	row: T
	$index: number
	column: TableColumnCtx<T>
	[key: string]: any
}
