import { reactive, ref, computed, /*getCurrentInstance,*/ unref, watch, nextTick } from 'vue'
import { $log } from '@/utils'
// import { ObjectOpts } from '@/components/FormConfig/formConfig.types.ts'
import { LeTableColumnProps, LeTableProps } from '@/components/Table'

export type UseTableConfig = {
	fetchImmediate?: boolean
	queryList: () => void
}

export const useTablePage = (tableProps: Partial<LeTableProps> = {}, config: Partial<UseTableConfig> = {}) => {
	const localConfig: UseTableConfig = Object.assign(
		{
			fetchImmediate: true,
			queryList: () => $log('请添加queryList', JSON.stringify(tableOpts.searchParams))
		},
		config
	)
	const tableOpts = reactive<LeTableProps>({
		total: 0,
		list: [],
		columns: [],
		/*columnsConfig: {
			columns: [],
			defaultCheckedOptions: []
		}*/
		...tableProps,
		searchParams: {
			page: 1,
			size: 20,
			...(tableProps.searchParams || {})
		},
		options: {
			loading: false,
			showOverflowTooltip: false,
			multipleSelect: true, // 是否支持列表项选中功能
			// stripe: true, // 是否为斑马纹 table
			// highlightCurrentRow: true, // 是否支持当前行高亮显示
			...(tableProps.options || {})
		}
	})
	const checkedColumns = ref([])
	const activeColumns = computed(() => {
		const _checkedColumns = unref(checkedColumns) as LeTableColumnProps[]
		if (!_checkedColumns.length) return tableOpts.columns
		return _checkedColumns
			.map(v => {
				const cur = tableOpts.columns.find(column => column.prop === v.prop)
				if (cur) {
					const fixedFlag = cur.fixed
					if (fixedFlag) {
						// eslint-disable-next-line
						// @ts-ignore
						v.fixed = fixedFlag
					}
					return cur
				}
			})
			.filter(Boolean)
	})
	/*const instance = getCurrentInstance()
	console.error(instance, 'instance.proxy')*/

	// watch(() => tableOpts.searchParams.custName, (v, oldv) => {
	// watch(tableOpts.searchParams, (v, oldv) => {
	watch(
		() => tableOpts.searchParams,
		// (v, oldV) => {
		() => {
			nextTick(() => {
				localConfig.queryList?.()
			})
		},
		// localConfig.queryList,
		{
			immediate: localConfig.fetchImmediate
		}
	)
	return {
		tableOpts,
		checkedColumns,
		activeColumns
	}
}
