import type { LeTableColumnProps, LeTableOptions, LeTableProps, LeColumnSlots } from '../index.d'
import { ComputedRef, Slots, computed, Ref, unref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { getPropValue, $log } from '@/utils'
// import { cloneDeep, isEqual } from 'lodash-es'

/**针对 header 展示添加默认的slot*/
const slotHeaderDefault = function (titleHelp: any = {}, props: any) {
	// console.error(props, 'props.column...', titleHelp)
	const { t } = useI18n()
	const { t_label, label } = props.column || {}
	const label_ = t_label ? t(t_label) : label
	// const { titleHelp, label } = props.column
	// 1.针对 column 配置有 titleHelp 对象的 进行默认提示处理
	const { message, icon } = titleHelp || {}
	let TitleHelp: string | JSX.Element = ''
	if (message) {
		TitleHelp = (
			<el-tooltip placement="top" raw-content content={message}>
				<i class={['le-iconfont', icon || 'le-question']} />
			</el-tooltip>
		)
	}
	// 2.若有自定义筛选配置
	// todo...
	return (
		<div class="slot_title-wrap">
			<el-tooltip placement="top" content={label_}>
				<span class="label">{label_}</span>
			</el-tooltip>
			{TitleHelp}
		</div>
	)
}
/**针对默认的数据内容 default 展示添加slot*/
// const slotDefault = (originalColumn) => ({ row, column }) => {
const slotDefault = ({ row, column, $index }: any) => {
	// if (Object.keys(column).length) console.error(row, column, '     row, column, slotDefault')
	const val = getPropValue(row, column.property).value
	// 重载 formatter
	if (column && column.formatter) {
		return column.formatter(row, column, val, $index)
	}
	// const val = row[column.property]
	/*// 如果有多行省略号处理
  const ellipsis_line = getPropValue(originalColumn, ['params', 'ellipsis_line']).value
  if (ellipsis_line) {
    console.log(ellipsis_line, 'ellipsis_line')
    return <el-tooltip placement='top' v-slots={{content: <div v-html={val}/>}}>
      <div class='text-overflow_ellipsis_line_2'
           style={`width: fit-content;-webkit-line-clamp: ${ellipsis_line}`}>{val || '--'}</div>
    </el-tooltip>
  }*/
	if (typeof val !== 'number') {
		return val || '-'
	}
	return val
}
// console.error(import.meta.env, 'import.meta.env')
const setSlotFn = (() => {
	return import.meta.env.DEV
		? (le_slots: LeColumnSlots, type: string, fn: () => void | any, _slotName: string) => {
				if (!fn) {
					$log(`当前定义的 slots:${type} [${_slotName}] 没有设置`, 'warning', 'orange')
				}
				le_slots[type] = fn || null
		  }
		: (le_slots: object, type: string, fn: () => void | any, _slotName: string) => {
				le_slots[type] = fn || null
		  }
})()
const columnSlots = (column: LeTableColumnProps & { titleHelp: any; slots: any }, $slots: Slots) => {
	const local_slots: LeColumnSlots = {
		// default: slotDefault(column)
		default: slotDefault
	}
	// 新增默认header 超出隐藏&提示(?&问号提示)
	local_slots.header = slotHeaderDefault.bind(null, column.titleHelp)
	const slots_key = Object.keys(column.slots || {})
	if (slots_key.length) {
		slots_key.map(type => {
			const slotName = column.slots[type]
			switch (typeof slotName) {
				case 'string':
					{
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
type local_columnProps = LeTableColumnProps & { le_children: any[]; le_slots: LeSlots }
export type useColumnsOpts = {
	propsRef: LeTableProps
	computedOptions: ComputedRef<LeTableOptions>
	slots: Slots
	tableRef: Ref
}
export function useColumns(opts: useColumnsOpts) {
	const { t } = useI18n()
	const { propsRef, computedOptions, slots, tableRef } = opts
	// const columnsRef = ref(unref(propsRef).columns) as unknown as Ref<LeTableColumnProps[]>
	// console.error(propsRef, 'propsRef')
	// 获取列表的 index
	const generateIndex = (index: number) => {
		const { size, page = 1 } = unref(propsRef).searchParams || {}
		let _index = ++index
		if (size) {
			_index = size * (page - 1) + _index
		}
		return _index
	}

	const getColumn = (column: local_columnProps) => {
		return {
			...column,
			le_children: (column.children || []).filter(Boolean).map(getColumn),
			le_slots: columnSlots(column, slots)
		}
	}
	// 用户真实columns配置列表
	const realColumns = computed(() => {
		return unref(propsRef).columns.filter(Boolean).map(getColumn)
		// return columnsRef.value.filter(Boolean).map(getColumn)
	})

	const sortColumnChildren = (localColumn: LeTableColumnProps, targetColumn: LeTableColumnProps, localField = 'prop', targetField = 'prop') => {
		const cur_children = localColumn.children
		if (Array.isArray(cur_children) && Array.isArray(targetColumn.children)) {
			// console.error(JSON.stringify(cur_children), 'cur_children   targetColumn_children', JSON.stringify(targetColumn.children))
			// children 排序
			localColumn.children = targetColumn.children
				.map(_column => {
					const findColumn = cur_children.find(l_column => l_column[localField] === _column[targetField])
					if (findColumn) {
						if (Array.isArray(findColumn.children)) {
							return sortColumnChildren(findColumn, _column, localField, targetField)
						}
						return findColumn
					}
					return false
				})
				.filter(Boolean)
		}
		return localColumn
	}
	watch(realColumns, () => {
		nextTick(() => {
			// console.error(tableRef, 'tableRef  尝试 对columns 重新排序')
			const ELTable: any = tableRef.value
			if (ELTable) {
				// 修复 element-plus columns仅调换顺序不更新问题 store
				try {
					const table_states = ELTable.store.states
					const lastColumns = table_states._columns.value
					const newColumns = localColumns.value
						.map(v => {
							// 深度克隆
							const cur = lastColumns.find(column => column.property === v.prop)
							if (cur) {
								// children 内嵌处理
								return sortColumnChildren(cur, v, 'property')
							}
							return false
						})
						.filter(Boolean)
					table_states._columns.value = newColumns
					ELTable.store.updateColumns()
					ELTable.doLayout?.()
				} catch (e) {}
			}
		})
	})
	// 本地渲染列
	const localColumns = computed(() => {
		const _columns = []
		// 序号
		unref(computedOptions).showIndex &&
			_columns.push({
				prop: 'leTable_index',
				type: 'index',
				label: unref(computedOptions).indexLabel,
				showOverflowTooltip: true,
				resizable: true,
				index: generateIndex,
				width: '50px',
				fixed: 'left'
			})
		// 多选
		unref(computedOptions).multipleSelect &&
			_columns.push({
				prop: 'leTable_selection',
				type: 'selection',
				showOverflowTooltip: false,
				resizable: false,
				// align: 'center',
				width: '40px',
				fixed: 'left'
			})
		// 常规Columns列表(用户设置)
		const _realColumns = realColumns.value
		// 空白填充
		let fillSpaceColumns: any[] = [{ minWidth: 0, prop: 'leTable_fillSpace' }]
		if (_realColumns.some(v => !v.fixed)) {
			fillSpaceColumns = []
		}
		return _columns.concat(_realColumns, fillSpaceColumns)
	})
	const renderColumn = (column: local_columnProps, index: number) => {
		const { label, t_label, align, resizable, showOverflowTooltip, slots, le_slots, children, le_children, ...opts } = column
		const label_ = t_label ? t(t_label) : label
		let local_slots = le_slots
		// le_children 处理
		if (le_children?.length > 0) {
			local_slots = {
				...le_slots,
				default: scope => {
					return le_children.map(renderColumn)
				}
			}
		}
		return (
			<el-table-column
				{...opts}
				key={column.prop ?? index}
				label={label_}
				v-slots={local_slots}
				align={align ?? unref(computedOptions).align}
				resizable={resizable ?? unref(computedOptions).resizable}
				showOverflowTooltip={showOverflowTooltip ?? unref(computedOptions).showOverflowTooltip}
			/>
		)
	}

	return {
		localColumns,
		renderColumn
	}
}
