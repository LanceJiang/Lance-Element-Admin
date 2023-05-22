<!--
 Created by lanceJiang
 -->
<script lang="tsx">
import { defineComponent, PropType, onMounted, ref } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
// import { ElMessage } from 'element-plus'
import { OlTableColumnProps, OlTableProps, SearchParams } from './index.d'
import { getDeepValue, $log } from '@/utils'
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
	 *     formatter: function(row, column){}, // 返回需要展示的数据
	 *     slots: { header: fn || slotName, default: fn || slotName } （slots.default > formatter）
	 * }]
	 */
	columns: {
		type: Array as PropType<OlTableColumnProps[]>,
		default: () => []
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
		type: Object as PropType<OlTableProps>,
		default: () => {
			return {}
		}
	}
}
/**针对默认的 header 展示添加slot*/
const slotHeader = function (titleHelp = {}, props) {
	// console.error(props, 'props.column...', titleHelp)
	// const { titleHelp, label } = props.column
	const { label } = props.column
	// 1.针对 column 配置有 titleHelp 对象的 进行默认提示处理
	const { message, icon } = titleHelp || {}
	let TitleHelp = ''
	if (message) {
		/* eslint-disable */
		// @ts-ignore
		TitleHelp = (
			<el-tooltip placement="top" content={message}>
				<el-icon>
					<QuestionFilled />
				</el-icon>
			</el-tooltip>
		)
		/* eslint-enable */
		// 若有 iconfont 样式
		// <i class={['iconfont', icon || 'icon-question']}/>
	}
	// 2.若有自定义筛选配置
	// todo...
	return (
		<div class="slot_title-wrap">
			<el-tooltip placement="top" content={label}>
				<span class="label">{label}</span>
			</el-tooltip>
			{TitleHelp}
		</div>
	)
}

/**针对默认的数据内容 default 展示添加slot*/
// const slotDefault = (originalColumn) => ({ row, column }) => {
const slotDefault = ({ row, column }) => {
	// if (Object.keys(column).length) console.error(row, column, '     row, column, slotDefault')
	const val = row[column.property]
	/*// 如果有多行省略号处理
  const ellipsis_line = getDeepValue(originalColumn, ['params', 'ellipsis_line'])
  if (ellipsis_line) {
    console.log(ellipsis_line, 'ellipsis_line')
    return <el-tooltip placement='top' v-slots={{content: <div v-html={val}/>}}>
      <div class='text-overflow_ellipsis_line_2'
           style={`width: fit-content;-webkit-line-clamp: ${ellipsis_line}`}>{val || '--'}</div>
    </el-tooltip>
  }*/
	if (typeof val !== 'number') {
		return val || '--'
	}
	return val
}
const setSlotFn = (() => {
	return import.meta.env.DEV
		? (ol_slots: object, type: string, fn: Function | any, _slotName: string) => {
				if (!fn) {
					$log(`当前定义的 slots:${type} [${_slotName}] 没有设置`, 'warning', 'orange')
				}
				ol_slots[type] = fn || null
		  }
		: (ol_slots: object, type: string, fn: Function | any, _slotName: string) => {
				ol_slots[type] = fn || null
		  }
})()
const columnSlots = (column, _this) => {
	const { $slots } = _this
	let local_slots: any = {}
	// 针对未设置 formatter 的添加默认 slotDefault
	if (!column.formatter) {
		local_slots = {
			// default: slotDefault(column)
			default: slotDefault
		}
	}
	// 新增默认header 超出隐藏&提示(?&问号提示)
	local_slots.header = slotHeader.bind(_this, column.titleHelp)
	const slots_key = Object.keys(column.slots || {})
	// let slots_headerName = ''
	if (slots_key.length) {
		slots_key.map(type => {
			let slotName = column.slots[type]
			// let _slotName = ''
			switch (typeof slotName) {
				case 'string':
					{
						/*if (type === 'header') {
          slots_headerName = slotName
        }*/
						setSlotFn(local_slots, type, $slots[slotName], slotName)
					}
					break
				case 'function': {
					local_slots[type] = slotName
				}
			}
		})
	}

	return local_slots
}
const render = function () {
	const { computedOptions, list, total, searchParams, isFullscreen } = this
	return (
		<div class={`tableWrap ${isFullscreen ? 'tableWrap-maximize' : ''}`}>
			<div class="tableBody">
				<div class="toolBarWrap">
					<div class="toolLeft">
						{/* 请添加 slot:toolLeft */}
						{this.$slots?.toolLeft?.()}
					</div>
					<div class="toolRight">
						<el-tooltip content="刷新">
							<el-icon class="icon-button" onClick={this.refreshHandler}>
								<Refresh />
							</el-icon>
						</el-tooltip>
						<el-tooltip content={isFullscreen ? '还原' : '全屏'}>
							<SvgIcon
								class="icon-button icon-screen"
								icon-class={isFullscreen ? 'exit-fullscreen' : 'fullscreen'}
								onClick={this.toggleFullscreen}
							></SvgIcon>
						</el-tooltip>
					</div>
				</div>
				<div class="tableParentEl">
					<el-table
						v-loading={computedOptions.loading}
						ref="refTable"
						border
						element-loading-text="加载中..."
						element-loading-background="rgba(0, 0, 0, 0.1)"
						{...computedOptions}
						data={list}
						{...{
							// 事件
							onSortChange: this.tableSortChange,
							onRowClick: this.handleCurrentChange
							// onSelectionChange: this.handleSelectionChange
						}}
					>
						{computedOptions.multipleSelect && <el-table-column type="selection" width="55px" fixed="left" />}
						{computedOptions.showIndex && (
							<el-table-column
								resizable={false}
								label={computedOptions.indexLabel}
								index={this.generateIndex}
								type="index"
								width="56"
								align="center"
								fixed="left"
							/>
						)}
						{this.localColumns.map((column, index) => {
							const { align, resizable, showOverflowTooltip, slots, ol_slots, ...opts } = column
							return (
								<el-table-column
									key={index}
									{...opts}
									v-slots={ol_slots}
									align={align ?? computedOptions.align}
									resizable={resizable ?? computedOptions.resizable}
									showOverflowTooltip={showOverflowTooltip ?? computedOptions.showOverflowTooltip}
								/>
							)
						})}
					</el-table>
				</div>
			</div>
			{/*--分页--*/}
			{total > 0 && computedOptions.showPagination && (
				<el-pagination
					total={total}
					currentPage={searchParams.page}
					pageSize={searchParams.size}
					pageSizes={computedOptions.pageSizes}
					layout={computedOptions.layout}
					background={computedOptions.background}
					onSizeChange={this.handleSizeChange}
					onCurrentChange={this.handleIndexChange}
				/>
			)}
		</div>
	)
}

const TableComponent = defineComponent({
	name: 'TableComponent',
	components: {
		SvgIcon
	},
	props: tableProps,
	render,
	data() {
		return {
			storageArr: [], // 临时存储的数组
			updatedColumns: true,
			isFullscreen: false
		}
	},
	computed: {
		computedOptions() {
			return {
				...{
					// el-table参数
					height: '100%', // 高度
					maxHeight: '100%', // 最大高度
					// stripe: false, // 是否为斑马纹 table
					// showSummary: false, // 是否展示合计
					// highlightCurrentRow: true, // 是否要高亮当前行

					// 分页器参数
					pageSizes: [10, 20, 50, 100],
					layout: 'total, sizes, prev, pager, next, jumper',
					background: true,

					// 额外table参数
					loading: false, // 是否展示 tableLoading
					multipleSelect: false, // 是否多选 table
					rowKey: 'id', // 根据 该值 查找当前页面数据是否包含当前数据 添加 多选被选中的状态
					// currentRowKey: 'id', // 根据 该值 查找当前页面数据是否包含当前数据 添加 高亮状态
					align: 'center', // columnItem 对齐方式
					resizable: true, // ColumnItem 是否允许拖动
					showOverflowTooltip: true, // columnItem 超出内容 省略号 同时添加 tiptool

					showIndex: true, // 是否展示序号
					indexLabel: '序号', // 自选的序号label标签
					showPagination: true // 是否加载table 分页栏
				},
				...this.options
			}
		},
		localColumns() {
			return this.columns.map(column => {
				return {
					...column,
					ol_slots: columnSlots(column, this)
				}
			})
		}
	},
	watch: {
		/*list: {
			// 监听 list发生变化  （用于 多选时 切换页面做触发...）
			handler: function (newList, oldList) {
				// console.log(newList, oldList);
				// 判断是否为多选
				const { multipleSelect, rowKey = 'id', currentRowKey = 'id' } = this.computedOptions
				if (multipleSelect) {
					// 判断是否为多选
					const {
						selected_list = [] // 获取是 原来被选中的值... (通过x_y 防止 fix xY --> x-y 通过$attr 无法读取)
					} = this.$attrs
					let indexs = [],
						storageArr = []
					selected_list.map(item => {
						var _index = newList.findIndex(_item => {
							return _item[rowKey] === item[rowKey]
						})
						if (_index !== -1) {
							indexs.push(_index)
						} else {
							// 当前页没有的 数据 作为临时存储 在更新数据之前  合并当前页被选中的数据 提交给父级组件
							storageArr.push(item)
						}
					})
					this.storageArr = storageArr
					this.$nextTick(() => {
						indexs.forEach(index => {
							// console.warn(this.list[index], 'this.list[index]')
							this.$refs.refTable.toggleRowSelection(this.list[index], true) // 遍历被选中的 多选
						})
					})
				}
				const {
					cur_row = {} // 获取 想要被高亮的数据...
				} = this.$attrs
				// 高亮数据判断
				if (Object.keys(cur_row).length) {
          // 目前情况可以直接使用 rowKey
					let curRowIndex = -1
					curRowIndex = newList.findIndex(_item => {
						// return _item[currentRowKey] === cur_row[currentRowKey]
						return _item[rowKey] === cur_row[rowKey]
					})
					this.$nextTick(() => {
						curRowIndex > -1 && this.$refs.refTable.setCurrentRow(this.list[curRowIndex]) // 高亮原本被选中的数据
					})
				}
			},
			deep: true
			// immediate: true
		}*/
		//  columns 动态支持
		// columns: {
		//   handler: function(newList, oldList) {
		//     this.updatedColumns = false
		//     setTimeout(() => {
		//       this.updatedColumns = true
		//     }, 10)
		//   },
		//   deep: true
		// }
	},
	/*setup(props, { attrs, slots }) {
    // const elTableRef = ref<ElTableType>();
    return () => {
      // @ts-ignore

      const localOptions = computed(() => ({
        ...{
          // el-table参数
          pageSizes: [10, 20, 50, 100],
          layout: 'total, sizes, prev, pager, next, jumper',
          background: true,
          // 额外table参数
          showOverflowTooltip: true, // 超出内容 省略号 同时添加 tiptool
          showPagination: true, // 是否展示 分页栏
          loading: false, // 是否展示 tableLoading
          multipleSelect: false, // 是否多选
          rowKey: 'id', // 根据 该值 查找当前页面数据是否包含当前数据 添加 多选被选中的状态
          currentRowKey: 'id', // 根据 该值 查找当前页面数据是否包含当前数据 添加 高亮状态(目前可以延用 rowKey)
          showIndex: true, // 是否展示序号
          indexLabel: '序号', // 自选的序号label标签
          stripe: false, // 是否为斑马纹 table
          highlightCurrentRow: true, // 是否要高亮当前行
          resizable: true, // 是否允许拖动
          maxHeight: '', // 最大高度
          showSummary: false // 是否展示合计
        },
        ...this.options
      }))

      const { data, column, align } = props;

      const renderColumn = (columnDict: Record<string, any>, index: number) => {
        const { render, slotName, headerSlot, children, ...restAtts } =
          columnDict;
        const vSlots: {
          default?: (scope: Record<string, any>) => any;
          header?: (scope: Record<string, any>) => any;
        } = {};
        if (typeof render === 'function') {
          vSlots.default = (scope) => {
            if (restAtts.prop) {
              return render(scope.row[restAtts.prop], scope);
            }
            return render(scope);
          };
        }

        if (slotName && typeof slots[slotName] === 'function') {
          vSlots.default = (scope) =>
            (slots[slotName] as (scope: any) => {})(scope)
        }

        if (headerSlot && slots[headerSlot]) {
          vSlots.header = (scope) =>
            (slots[headerSlot] as (scope: any) => {})(scope)
        }

        if (children?.length > 0) {
          vSlots.default = (scope) => {
            return children.map(renderColumn)
          }
        }
        return (
          <el-table-column
            key={index}
            align={align}
            {...restAtts}
            v-slots={vSlots}
          />
        )
      }
      const columnsSlots = column.map(renderColumn)
      return (
        <div>
          <el-table
            data={data}
            ref='elTableRef'
            {...attrs}
            v-slots={{
              append: () => {
                return slots.append && slots.append()
              },
              empty: () => {
                return slots.empty && slots.empty()
              },
            }}
          >
            {columnsSlots}
          </el-table>
        </div>
      )
    }
  },*/
	mounted() {
		// @ts-ignore
		// this.injectTableMethods()
	},
	methods: {
		// 排序
		tableSortChange({ column, prop, order }) {
			// console.error(column, prop, order, 'column, prop, order tableSortChange')
			// order: ascending 上升 descending 下降 null
			const searchParam = {
				sortField: prop,
				sortDirection: order
			}
			this.$emit('refreshList', searchParam)
		},
		handleCurrentChange(row) {
			// console.warn(row, 'handleCurrentChange row')
			// 选中当前列 触发
			this.$emit('handleCurrentChange', row)
		},
		// 获取列表的 index
		generateIndex(index) {
			const { size, page } = this.searchParams
			let _index = ++index
			if (size) {
				_index = size * (page - 1) + _index
			}
			return _index
		},
		// 切换每页显示的数量
		handleSizeChange(size) {
			// console.error(' handleSizeChange size', size)
			this.$emit('update:searchParams', {
				...this.searchParams,
				size
			})
			// todo
			// this.searchParams.size = size
		},
		// 切换页码
		handleIndexChange(index: number) {
			// console.error(' handleIndexChange index', index)
			this.$emit('update:searchParams', {
				...this.searchParams,
				page: index
			})
			// this.searchParams.page = index
		},
		// 支持多选时 行选中触发
		// handleSelectionChange(val) {
		// 	console.warn(val.concat(this.storageArr))
		// 	this.$emit('handleSelectionChange', val.concat(this.storageArr))
		// },
		// 切换全屏
		toggleFullscreen() {
			this.isFullscreen = !this.isFullscreen
		},
		// 设置自定义列 todo
		setColumnsHandler() {
			this.$message.warning('自定义列设置,敬请期待~')
			// ElMessage.warning('自定义列设置,敬请期待~')
		},
		// 刷新列表
		refreshHandler() {
			this.handleIndexChange(1)
			// 额外相关操作
			this.$emit('refreshHandler')
		}
		// injectTableMethods() {
		//   const _self = this as any
		//   const elTableRef = _self.$refs['refTable']
		//   const tableMethodNameList = [
		//     'clearSelection',
		//     'toggleRowSelection',
		//     'toggleAllSelection',
		//     'toggleRowExpansion',
		//     'setCurrentRow',
		//     'clearSort',
		//     'clearFilter',
		//     'doLayout',
		//     'sort',
		//   ]
		//   for (const methodName of tableMethodNameList) {
		//       _self[methodName] = elTableRef?.[methodName]
		//   }
		// }
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
    @handleSelectionChange="handleSelectionChange" // 若存在多选的情况 将目前被选中的数据 传递给父组件
    :selected_list="testList" // 多选情况下 接口返回的元贝备选中的 数组  【有多选数据必传】
    :curRow="testCurRow" // 当前高亮的 数据  【需要高亮上次数据必传】
    :checkSelectedKey="checkSelectedKey" // 查询当前页面数据是否被选中 筛选的唯一key值 【有多选数据不传默认 为 ‘id'】
  />*/
</script>
<style scoped lang="scss">
$border-c1: #e4e4e4; // 边框
%text_hide {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.tableWrap {
	position: relative;
	z-index: 0;
	padding: 0 12px;
	flex: 1;
	display: flex;
	flex-direction: column;
	height: 100%;
	min-height: 0;
	background: #fff;
	/* 放置大屏 */
	&-maximize {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		max-width: 100%;
		background-color: #fff !important;
		z-index: 2000;
	}
	@at-root {
		.el-pagination {
			padding: 10px 5px;
			justify-content: flex-end;
		}
		//.el-table thead.is-group th.el-table__cell {
		::v-deep(.el-table) {
			thead th.el-table__cell {
				background-color: #f5f7fa;
				& > .cell {
					//display: inline-flex;
					display: flex;
					align-items: center;
					text-align: center;
					justify-content: center;
					overflow: hidden;
				}
			}
		}
		::v-deep(.slot_title-wrap) {
			display: inline-flex;
			align-items: center;
			text-align: center;
			overflow: hidden;
			.label {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			/*.iconfont {
        margin-left: .2em;
        font-size: 14px;
        cursor: pointer;
        color: #888;
        font-weight: normal;
      }*/
		}
		/*::v-deep(.el-table) {
      border-right: 1px solid $border-c1;
      .el-table__header, .el-table__body {
        border-left: 1px solid $border-c1;
      }
    }*/
		/*.el-table__fixed-right {
      bottom: 0 !important;
      right: 6px !important;
      z-index: 1004;
    }*/
	}
	.tableLoading {
		position: absolute;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		z-index: 9999;
		background: rgba(0, 0, 0, 0.05);
	}

	.tableBody {
		flex: 1;
		min-height: 200px;
		height: 100%;
		display: flex;
		flex-direction: column;

		@at-root {
			.toolBarWrap {
				padding: 12px 0;
				height: auto;
				display: flex;
				align-items: center;
				justify-content: space-between;
				//align-items: flex-start;
				::v-deep(.toolLeft) {
					flex: 1;
				}
				.toolRight {
					//align-self: flex-end;
					// 兼容当搜索组件放置在 toolLeft 的时候
					//min-height: 32px;
					display: flex;
					align-items: center;
					// 仅带icon 的button 按钮样式
					.icon-button {
						margin-left: 12px;
						cursor: pointer;
						font-size: 18px;
						&:hover {
							color: var(--el-color-primary);
						}
						//padding: 0 5px;
					}
					.icon-screen {
						font-size: 14px;
						&:focus {
							outline: unset;
						}
					}
					/*.iconfont {
            font-size: 18px;
          }*/
				}
			}
		}

		.tableParentEl {
			flex: 1;
			overflow-y: hidden;
		}
	}
}
</style>
