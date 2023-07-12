<script lang="tsx">
import { defineComponent, PropType, computed, unref, watch, onMounted, ref, nextTick } from 'vue'
import { LeTableColumnProps, LeTableOptions, SearchParams, LeTableProps } from './index.d'
import NoData from '@/components/NoData.vue'
import Icon from '@/components/Icon.vue'
import TableColumnsPopover from './components/TableColumnsPopover.vue'
import { createTableContext } from './hooks/useTableContext'
import { useColumns, useColumnsOpts } from './hooks/useColumns'
import { useI18n } from 'vue-i18n'

export const tableProps = {
	// 数据列表
	list: {
		type: Array as PropType<Record<string, any>[]>,
		default: () => []
	},
	/**
	 * [{
	 *     prop, // 属性名
	 *     label, // 列名
	 *     align, // 对齐方式
	 *     width, // 列宽
	 *     minWidth, // 最小列宽
	 *     sortable, // 是否允许排列顺序
	 *     formatter: function(row, column, cellValue, index){}, // 返回需要展示的数据
	 *     slots: { header: fn || slotName, default: fn({row, column, $index...}) || slotName }（slots.default > formatter）
	 * }]
	 */
	columns: {
		type: Array as PropType<LeTableColumnProps[]>,
		default: () => []
	},
	// 选中column的配置参数
	checkedOptions: {
		type: Array as PropType<LeTableColumnProps[]>,
		default: () => []
	},
	// 自定义列配置相关
	columnsConfig: {
		type: Object as PropType<Pick<LeTableProps, 'columnsConfig'>>,
		default: () => ({
			// defaultCheckedOptions: [], // { t_label: string; label: string; prop: string; fixed: boolean|string }[]// Array 没有存储数据时 系统给予的默认配置
			columns: []
		})
	},
	// 列表搜索参数
	searchParams: {
		type: Object as PropType<SearchParams>,
		default: () => ({
			page: 1, // 页数
			size: 20 // 页面条目
		})
	},
	total: {
		type: Number,
		default: 0
	}, // 总数
	/**
	 * table 表格的控制参数
	 * 具体配置参考 computedOptions 默认参
	 */
	options: {
		type: Object as PropType<LeTableOptions>,
		default: () => {
			return {}
		}
	},
	// 当前行(高亮)
	curRow: {
		type: Object as PropType<{[key: string]: any}|null>,
		default: null
	}
}
const default_tableConfig = {
	// el-table参数
	height: '100%', // 高度
	maxHeight: '100%', // 最大高度
	size: 'default', // 尺寸类型 (弹窗建议使用 mini)
	// stripe: false, // 是否为斑马纹 table
	// showSummary: false, // 是否展示合计
	highlightCurrentRow: true, // 是否要高亮当前行

	// 分页器参数
	pageSizes: [10, 20, 50, 100],
	layout: 'total, sizes, prev, pager, next, jumper',
	background: true,

	// 额外table参数
	loading: false, // 是否展示 tableLoading
	multipleSelect: false, // 是否多选 table
	rowKey: 'id', // 根据 该值 查找当前页面数据是否包含当前数据 添加 多选被选中的状态
	// currentRowKey: 'id', // 根据 该值 查找当前页面数据是否包含当前数据 添加 高亮状态(不传 默认继承rowKey)
	// align: 'center', // columnItem 对齐方式
	resizable: true, // ColumnItem 是否允许拖动
	showOverflowTooltip: true, // columnItem 超出内容 省略号 同时添加 tooltip

	showIndex: true, // 是否展示序号
	indexLabel: 'No.', // 自选的序号label标签
	showPagination: true // 是否加载table 分页栏
}

const TableComponent = defineComponent({
	name: 'LeTable',
	props: tableProps,
	// 更新搜索条件, 更新列配置, table Sort 排序, table 刷新
	emits: ['update:searchParams', 'update:checkedOptions', 'sortChange', 'refresh', 'row-click'],
	setup(props, { attrs, slots, emit, expose }) {
		const { t } = useI18n()
		// const tableRef = ref<Table>(/*tableRef*/)
		const tableRef = ref(/*tableRef*/)
		const isFullscreen = ref(false)
		// 切换全屏
		const toggleFullscreen = () => {
			isFullscreen.value = !isFullscreen.value
		}

		// 切换页码
		const handleIndexChange = (page: number) => {
			// console.error(' handleIndexChange index', index)
			emit('update:searchParams', {
				...props.searchParams,
				page
			})
		}
		// 刷新列表
		const refreshHandler = () => {
			// const index = props.searchParams.page
			// handleIndexChange(1)
			handleIndexChange(props.searchParams.page)
			// 额外相关操作
			emit('refresh')
		}
		// 切换每页显示的数量
		const handleSizeChange = size => {
			// console.error(' handleSizeChange size', size)
			emit('update:searchParams', {
				...props.searchParams,
				size
			})
		}
		// 排序
		const tableSortChange = ({ column, prop, order }) => {
			// console.error(column, prop, order, 'column, prop, order tableSortChange')
			// order: ascending 上升 descending 下降 null
			const sortParams = {
				prop,
				order
				// order: order && order === 'ascending' ? 1 : -1,
				// order: order && order === 'ascending' ? 'ASC' : 'DESC',
			}
			emit('update:searchParams', {
				...props.searchParams,
				sortParams
			})
			emit('sortChange', sortParams)
		}
		// table 相关配置
		const computedOptions = computed(() => {
			const res = {
				...default_tableConfig,
				...props.options
			} as LeTableOptions
			// 高亮当前
			res.currentRowKey = res.currentRowKey ?? res.rowKey
			return res
		})
		/*const getProps = computed(() => {
			return {
				...props,
			} as LeTableProps
		})*/
		// 更新选中列配置
		const checkedOptionsChange = checkedOptions => {
			// console.error(checkedOptions, 'checkedOptions checkedOptionsChange')
			emit('update:checkedOptions', checkedOptions)
		}
		// 点击当前行
		const onRowClick = (row, column) => {
			emit('row-click', row, column)
			emit('update:curRow', row)
		}
		// 设置当前行
		const setCurrentRow = (rowOrIndex: ({[key: string]: any}|number|null) = null, update = true) => {
			let curRowIndex = -1
			const list = props.list
			if(typeof rowOrIndex === 'number') {
				curRowIndex = rowOrIndex
			} else if (Object.keys(rowOrIndex || {}).length) {
				const currentRowKey = computedOptions.value.currentRowKey
				curRowIndex = list.findIndex(_item => {
					return _item[currentRowKey] === props.curRow?.[currentRowKey]
				})
			}
			update && emit('update:curRow', list[curRowIndex] ?? null)
			// console.error(curRowIndex, 'curRowIndex')
			nextTick(() => {
				tableRef.value.setCurrentRow(list[curRowIndex]) // 高亮原本被选中的数据
			})
		}
		watch(() => props.list, (list) => {
			// 高亮数据判断
			if (Object.keys(props.curRow || {}).length) {
				setCurrentRow(props.curRow, false)
			}
		}/*, {
			immediate: true
		}*/)

		const table_slots = {
			empty: () => <NoData size={unref(computedOptions).size}></NoData>
		}
		createTableContext({ tableRef })
		const { localColumns, renderColumn } = useColumns({
			propsRef: props,
			computedOptions,
			slots,
			tableRef
		} as useColumnsOpts)
		expose({
			tableRef,
			setCurrentRow
		})
		return () => {
			const { list, total, searchParams, columnsConfig, checkedOptions } = props
			return (
				<div class={`le-table-warp ${unref(isFullscreen) ? 'le-table-warp-maximize' : ''}`}>
					<div class="tableBody">
						{/* 工具栏 */}
						<div class="toolBarWrap">
							<div class="toolLeft">
								{/* 工具栏左边插槽 */}
								{slots.toolLeft?.()}
							</div>
							<div class="toolRight">
								{/* 工具栏右边插槽 */}
								{slots.toolRight?.()}
								{/* 刷新 */}
								<el-tooltip placement="top" content={t('le.refresh')}>
									<el-button class="icon-button button-refresh" onClick={refreshHandler}>
										<Icon iconClass="le-refresh" />
									</el-button>
								</el-tooltip>
								{/* 全屏 */}
								<el-tooltip placement="top" content={t(isFullscreen.value ? 'le.exitFullscreen' : 'le.fullscreen')}>
									<el-button class="icon-button button-screen" onClick={toggleFullscreen}>
										<Icon iconClass={isFullscreen.value ? 'le-suoxiao' : 'le-fangda'} />
									</el-button>
								</el-tooltip>
								{/* columns过滤 */}
								{columnsConfig?.columns?.length ? (
									<TableColumnsPopover value={checkedOptions} onChange={checkedOptionsChange} {...columnsConfig} />
								) : (
									''
								)}
							</div>
						</div>
						{/* 顶部插槽 */}
						{slots.top?.()}
						{/* ElTable组件 */}
						<div class="tableParentEl">
							<el-table
								class="le-table"
								ref={tableRef}
								v-loading={unref(computedOptions).loading}
								border
								element-loading-text="加载中..."
								element-loading-background="rgba(0, 0, 0, 0.1)"
								{...unref(computedOptions)}
								data={list}
								// 组件内单独封装 事件
								onSortChange={tableSortChange}
								onRowClick={onRowClick}
								// onSelectionChange={this.handleSelectionChange}
								v-slots={table_slots}
							>
								{localColumns.value.map(renderColumn)}
							</el-table>
						</div>
					</div>
					{/*--分页--*/}
					{unref(computedOptions).showPagination && (
						<el-pagination
							total={total}
							currentPage={searchParams.page}
							pageSize={searchParams.size}
							pageSizes={unref(computedOptions).pageSizes}
							layout={unref(computedOptions).layout}
							background={unref(computedOptions).background}
							onSizeChange={handleSizeChange}
							onCurrentChange={handleIndexChange}
						/>
					)}
				</div>
			)
		}
	}
})
export default TableComponent
/**
 TableComponent的 组件配置
 // 需要展示的列配置
 columns = [{
        prop: 'principalName',
        label: '项目负责人',
        align: 'center',
        width: 100
    }]
 */

/* <TableComponent
    :list="list" // 后台请求的列表数据
    :total="total" // 该列表总共有多少数据
    :options="options" // table相关的 配置对象 // 配置参考 defaultOptions
    :columns="columns" // 需要展示的列配置 // 参考上面的 columns
    :searchParams="searchParams"
    v-model:curRow="testCurRow" // 当前高亮的 数据  【需要高亮上次数据必传】
  />*/
</script>
