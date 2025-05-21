import { defineComponent, h, computed, ref } from 'vue'
// import XEUtils from 'xe-utils'
const XEUtils = {
	uniqueId() {
		return `__vxe_${Date.now()}_` + Math.random().toString(36).substring(2, 6)
	}
}
// import { getRowid } from '../../table/src/util'
export default defineComponent({
	name: 'VxeSimpleTable',
	props: {
		columns: { type: Array, default: () => [] },
		data: { type: Array, default: () => [] },
		border: Boolean,
		rowKey: { type: Boolean, default: true }
	},
	setup(props) {
		const scrollTop = ref(0)
		const containerHeight = ref(0)
		const rowHeight = 40 // 假设行高为40px

		const computeRowid = computed(() => {
			return XEUtils.uniqueId() // props.rowKey ? getRowid : () => XEUtils.uniqueId()
		})

		const renderHeader = () => {
			return h(
				'thead',
				{
					class: 'vxe-table-header'
				},
				[
					h(
						'tr',
						props.columns.map(column => h('th', { class: 'vxe-header--column' }, [column.label || column.prop]))
					)
				]
			)
		}

		const renderBody = () => {
			const startIndex = Math.floor(scrollTop.value / rowHeight)
			const endIndex = Math.min(startIndex + Math.ceil(containerHeight.value / rowHeight), props.data.length)
			const visibleData = props.data.slice(startIndex, endIndex)

			return [
				h('div', {
					class: 'vxe-body--y-space',
					style: { height: `${props.data.length * rowHeight}px` }
				}),
				h(
					'tbody',
					{
						class: 'vxe-table-body',
						style: { transform: `translateY(${startIndex * rowHeight}px)` }
					},
					visibleData.map(row => {
						const rowId = row.id // computeRowid.value(row)
						return h(
							'tr',
							{ key: rowId },
							props.columns.map(column => h('td', { class: 'vxe-body--cell' }, [column.formatter ? column.formatter(row) : row[column.prop]]))
						)
					})
				)
			]
		}

		return () =>
			h(
				'div',
				{
					class: 'vxe-table--wrapper',
					style: {
						maxHeight: containerHeight.value ? `${containerHeight.value}px` : '',
						overflowY: 'auto'
					},
					onScroll: e => {
						scrollTop.value = e.target.scrollTop
					},
					ref: el => {
						if (el) {
							containerHeight.value = el.clientHeight
						}
					}
				},
				[
					h(
						'table',
						{
							class: [
								'vxe-table',
								{
									'is--border': props.border
								}
							]
						},
						[renderHeader(), renderBody()]
					)
				]
			)
	}
})
