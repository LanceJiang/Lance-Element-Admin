// VxeTable.tsx
import { defineComponent, ref, computed, h } from 'vue'
import '../styles/vxeTable.scss'
type Column = {
	field: string
	title: string
	width?: number
	// td渲染
	render?: (row: Record<string, any>) => {}
	// 底部td渲染
	footerRender?: () => {}
}
export default defineComponent({
	name: 'VxeTable',
	props: {
		// 数据源
		data: {
			type: Array,
			default: () => []
		},
		// 列配置
		columns: {
			type: Array as () => Column[],
			default: () => []
		},
		// 是否显示表头
		showHeader: {
			type: Boolean,
			default: true
		},
		// 是否显示表尾
		showFooter: {
			type: Boolean,
			default: false
		},
		// 虚拟滚动相关配置
		virtualYConfig: {
			type: Object as () => {
				// 开启虚拟滚动
				enabled: boolean
				// td行高
				rowHeight: 40
				// 缓冲数量
				bufferSize: 10
			},
			default: () => ({
				enabled: true,
				rowHeight: 40,
				bufferSize: 10 // 同vxe-table的oSize
			})
		}
	},
	setup(props, { slots }) {
		// 响应式数据
		const reactData = ref({
			scrollYStore: {
				startIndex: 0,
				endIndex: 1000,
				visibleSize: 0,
				scrollTop: 0
			} /*,
			scrollXStore: {
				startIndex: 0,
				endIndex: 0,
				visibleSize: 0,
				scrollLeft: 0
			}*/
		})
		// 计算表格总高度
		const computeTotalHeight = computed(() => {
			return props.data.length * props.virtualYConfig.rowHeight
		})

		// 计算当前应该渲染的数据
		const computeVisibleData = computed(() => {
			if (props.virtualYConfig.enabled) {
				return props.data.slice(reactData.value.scrollYStore.startIndex, reactData.value.scrollYStore.endIndex)
			}
			return props.data
		})
		// 计算可视区域的样式
		const computeVisibleStyle = computed(() => {
			const { startIndex } = reactData.value.scrollYStore
			return {
				transform: `translateY(${startIndex * props.virtualYConfig.rowHeight}px)`
			}
		})
		// 滚动事件处理
		const handleScroll = (evnt: Event) => {
			const target = evnt.target as HTMLElement
			const { scrollTop, scrollLeft, clientHeight } = target
			// console.error(handleScroll, 'handleScroll', target.clientHeight)
			if (props.virtualYConfig.enabled) {
				// 计算新的 startIndex 和 endIndex
				const rowHeight = props.virtualYConfig.rowHeight
				const startIndex = Math.floor(scrollTop / rowHeight)
				const visibleSize = Math.ceil(clientHeight / rowHeight)
				const endIndex = Math.min(startIndex + visibleSize + (props.virtualYConfig.bufferSize || 0), props.data.length)
				reactData.value.scrollYStore = {
					startIndex,
					endIndex,
					visibleSize,
					scrollTop
				}
			}
		}

		// 渲染表头
		const renderHeader = () => {
			if (!props.showHeader) return null

			return (
				<div class="vxe-table--header-wrapper">
					<div class="vxe-table--header-inner-wrapper">
						<table class="vxe-table--header">
							<colgroup>
								{props.columns.map(column => {
									return <col key={column.field} style={`width: ${column.width || 100}px`}></col>
								})}
							</colgroup>
							<thead>
								<tr class="vxe-header--row">
									{props.columns.map(column => (
										<th class="vxe-header--column" key={column.field}>
											<div class="vxe-cell">{column.title}</div>
										</th>
									))}
								</tr>
							</thead>
						</table>
					</div>
				</div>
			)
		}

		// 渲染表体
		const renderBody = () => {
			return (
				// <div class="vxe-table--body-wrapper">
				<div class="vxe-table--body-inner-wrapper" ref="refBodyScroll" onScroll={handleScroll}>
					<div class="vxe-body--y-space" style={{ height: `${computeTotalHeight.value}px` }}></div>
					<table class="vxe-table--body" style={computeVisibleStyle.value}>
						<colgroup>
							{props.columns.map(column => {
								return <col key={column.field} style={`width: ${column.width || 100}px`}></col>
							})}
						</colgroup>
						<tbody>
							{computeVisibleData.value.map((row, index) => (
								<tr class="vxe-body--row" key={row.id || index}>
									{props.columns.map(column => (
										<td class="vxe-body--column" key={column.field}>
											<div class="vxe-cell">{column.render ? column.render(row) : row[column.field]}</div>
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
				// </div>
			)
		}

		// 渲染表尾
		const renderFooter = () => {
			if (!props.showFooter) return null

			return (
				<div class="vxe-table--footer-wrapper">
					<div class="vxe-table--footer-inner-wrapper">
						<table class="vxe-table--footer">
							<colgroup>
								{props.columns.map(column => {
									return <col key={column.field} style={`width: ${column.width || 100}px`}></col>
								})}
							</colgroup>
							<tfoot>
								<tr class="vxe-footer--row">
									{props.columns.map(column => (
										<td class="vxe-footer--column" key={column.field}>
											<div class="vxe-cell">{column.footerRender ? column.footerRender() : ''}</div>
										</td>
									))}
								</tr>
							</tfoot>
						</table>
					</div>
				</div>
			)
		}

		// 主渲染函数
		const renderVN = () => {
			return (
				<div class="vxe-table">
					<div class="vxe-table--main-wrapper">
						{renderHeader()}
						{renderBody()}
						{renderFooter()}
					</div>
				</div>
			)
		}

		return () => renderVN()
	}
})
