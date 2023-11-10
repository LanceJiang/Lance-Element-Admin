<!--
* @description 通用图表组件 LeChart
!-->
<template>
	<div class="le-chart-wrap" :style="{ width, height }">
		<div
			v-show="localLoading"
			v-loading="true"
			element-loading-text="加载中..."
			element-loading-background="rgba(0, 0, 0, 0.1)"
			class="tableLoading"
		></div>
		<div class="chart-head">
			<div class="axis-name top_left">
				<slot name="top_left">{{ label_topLeft }}</slot>
			</div>
			<div class="axis-name top_right">
				<slot name="top_right">{{ label_topRight }}</slot>
			</div>
		</div>
		<div class="chart-wrap">
			<div ref="elRef" class="chart-container" />
			<div class="overlay" :class="{ overlayTopLevel: noData }">
				<slot name="overlay">
					<NoData class="chart_noData" :class="{ chart_noData_show: noData }" size="small" message="暂无数据" />
				</slot>
			</div>
		</div>
		<div class="chart-footer">
			<div class="axis-name bottom_left">
				<slot name="bottom_left">{{ label_bottomLeft }}</slot>
			</div>
			<div class="axis-name bottom_left">
				<slot name="bottom_right">{{ label_bottomRight }}</slot>
			</div>
		</div>
		<slot />
	</div>
</template>

<script lang="ts">
import { debounce, objDeepMerge } from '@/utils'
import { init, EChartsOption } from 'echarts'
import NoData from '@/components/NoData'
import { defineComponent, PropType, ref, shallowRef, watch, computed, onMounted, onUnmounted, getCurrentInstance, nextTick } from 'vue'
const showLoading = chart =>
	chart &&
	chart.showLoading({
		text: '',
		textColor: '#1890ff',
		color: '#1890ff',
		maskColor: 'rgba(0,0,0,.05)'
	})
// chart 内部的事件触发
const emits = ['legendselectchanged', 'click']
const chartProps = {
	// id: {
	//   type: String as PropType<string>,
	//   default: `chart_${Math.random().toString().slice(-10)}_${+new Date()}`
	// },
	width: {
		type: String,
		default: '100%'
	},
	height: {
		type: String,
		default: '400px'
	},
	label_topLeft: {
		type: String,
		default: ''
	},
	label_topRight: {
		type: String,
		default: ''
	},
	label_bottomLeft: {
		type: String,
		default: ''
	},
	label_bottomRight: {
		type: String,
		default: ''
	},
	// 图表loading
	loading: {
		type: Boolean as PropType<boolean | undefined>,
		default: undefined
	},
	// 图表配置参数对象
	option: {
		type: Object as PropType<EChartsOption>,
		default: () => ({})
	},
	// 是否初始化就更新 options
	isInitOption: {
		type: Boolean,
		default: false
	},
	// 是否展示数据图表
	showChart: {
		type: Boolean,
		default: true
	}
}
export const ChartComponent = defineComponent({
	name: 'LeChart',
	components: {
		NoData
	},
	props: chartProps,
	emits,
	setup(props, { expose, emit }) {
		const chartRef = shallowRef(null)
		// const chartRef = ref(null)
		const elRef = ref(null)
		const localLoading = ref(true)
		// const { width, height, option } = props
		const noData = computed(() => {
			if (props.loading) return true
			return !props.showChart
		})
		const methods = {
			updateResize() {
				nextTick(() => {
					chartRef.value?.resize()
				})
			},
			updateOption() {
				let xAxis = [
					{
						axisLine: {
							show: false
						}
					}
				]
				let yAxis = [
					{
						axisLine: {
							show: false
						}
					}
				]
				let grid = {}
				const axisLabelColor = 'rgba(0, 0, 0, 0.45)'
				const axisLabelColor_x = 'rgba(0, 0, 0, 0.65)'

				const defaultAxis_common = {
					nameTextStyle: {
						color: axisLabelColor
					},
					axisLine: {
						lineStyle: {
							color: axisLabelColor,
							width: 1
						}
					},
					axisLabel: {
						color: axisLabelColor
					},
					// axisTick: {
					//   show: false
					// },
					splitLine: {
						lineStyle: {
							type: 'dashed',
							color: '#e9e9e9'
						}
					}
				}
				const defaultAxis_x = {
					nameTextStyle: {
						color: axisLabelColor_x
					},
					axisLabel: {
						color: axisLabelColor_x
					}
				}

				const defaultGrid = {
					// top: 10,
					// left: 10,
					// right: 10,
					// bottom: 5,
					containLabel: true
				}

				const { xAxis: _xAxis, yAxis: _yAxis, series: _series, grid: _grid, legend: _legend, tooltip, ...othersOpts } = props.option as EChartsOption
				// 图表内部不通过鼠标放大缩小
				if (Array.isArray(othersOpts.dataZoom)) {
					const dataZoomInside: any = othersOpts.dataZoom.find(v => {
						return v.type === 'inside'
					})
					if (dataZoomInside && dataZoomInside.zoomOnMouseWheel === undefined) {
						dataZoomInside.zoomOnMouseWheel = false
					}
				}
				if (Array.isArray(_grid)) {
					grid = _grid.map(v => Object.assign({}, defaultGrid, v || {}))
				} else {
					grid = Object.assign({}, defaultGrid, _grid || {})
				}
				if (_xAxis) {
					const xAxisDefault = objDeepMerge(defaultAxis_common, defaultAxis_x)
					if (Array.isArray(_xAxis)) {
						xAxis = _xAxis.map(item => {
							return {
								type: 'category',
								...objDeepMerge(xAxisDefault, item)
							}
						})
					} else {
						xAxis = [
							{
								type: 'value',
								...objDeepMerge(xAxisDefault, _xAxis)
							}
						]
					}
				}
				if (_yAxis) {
					const yAxisDefault = defaultAxis_common // objDeepMerge(defaultAxis_common, {axisLine: {show: false}})
					if (Array.isArray(_yAxis)) {
						yAxis = _yAxis.map(item => {
							return objDeepMerge(yAxisDefault, item)
						})
					} else {
						yAxis = [objDeepMerge(yAxisDefault, _yAxis)]
					}
				}
				const series = ((_series || []) as []).map(item => {
					return objDeepMerge(
						{
							lineStyle: {
								width: 2
							}
						},
						item
					)
				})
				const option = {
					legend: {
						icon: 'rect',
						itemHeight: 4,
						itemWidth: 10,
						textStyle: {
							color: 'rgba(0, 0, 0, 0.65)',
							lineHeight: 14
							// fontSize: 10
						},
						type: 'scroll',
						pageIconSize: 10,
						pageTextStyle: {
							lineHeight: 10,
							fontSize: 12
						},
						...(_legend || {})
					},
					tooltip: {
						trigger: 'item',
						// formatter: '{c}',
						position: 'top',
						axisPointer: {
							type: 'cross',
							label: {
								show: true
							}
						},
						...(tooltip || {})
					},
					grid,
					textStyle: {
						fontSize: 12
					},
					// ...{},
					xAxis,
					yAxis,
					series,
					...(othersOpts || {})
				} as EChartsOption
				// if (loading === undefined) {
				//   // chartRef.value && showLoading(chartRef.value)
				//   localLoading.value = true
				// }
				// await new Promise((resolve, reject) => setTimeout(resolve, loading === undefined ? 100 : 0)).then(_ => {})
				this.updateResize()
				if (chartRef.value) {
					localLoading.value = false
					// chartRef.value.hideLoading()
					console.log(option, 'option .................')
					chartRef.value.setOption(option)
				}
			}
		}
		watch(
			() => props.height,
			val => {
				methods.updateResize()
			}
		)
		watch(
			() => props.option,
			val => {
				if (val) {
					chartRef.value?.clear()
					methods.updateOption()
				}
			},
			{
				deep: true
				// immediate: true,
			}
		)
		watch(
			() => props.loading,
			bool => {
				if (bool !== undefined) {
					// 修复部分组件(通过 v-show 展示,样式未同步问题)
					if (bool) methods.updateResize()
					// console.error('loading', bool)
					localLoading.value = bool
				}
				// if (bool) {
				//   showLoading(chartRef.value)
				// } else {
				//   chartRef.value?.hideLoading()
				// }
			}
		)
		const debounceUpdateResize = debounce(methods.updateResize, 50, true)
		window.addEventListener('resize', debounceUpdateResize)
		onUnmounted(() => {
			window.removeEventListener('resize', debounceUpdateResize)
		})
		onMounted(() => {
			const el = elRef.value
			chartRef.value = init(el)
			// chartRef.value = init(document.getElementById(props.id))
			// showLoading(chartRef.value)
			// 事件组触发
			emits.map(eventName => {
				chartRef.value.on(eventName, params => {
					console.log(eventName, 'params', params)
					emit(eventName, params)
				})
			})
			props.isInitOption && methods.updateOption()
		})
		expose({
			chartRef,
			...methods
		})
		return {
			// chartRef,
			elRef,
			localLoading,
			noData,
			...methods
		}
	}
})
export default ChartComponent

// 10项 基本颜色配置
export const colorBase1 = ['#5B8FF9', '#5AD8A6', '#5D7092', '#F6BD16', '#E86452', '#6DC8EC', '#945FB9', '#FF9845', '#1E9493', '#FF99C3']
// 20项 基本颜色配置
export const colorBase2 = [
	'#5B8FF9',
	'#CDDDFD',
	'#5AD8A6',
	'#CDF3E4',
	'#5D7092',
	'#CED4DE',
	'#F6BD16',
	'#FCEBB9',
	'#E86452',
	'#F8D0CB',
	'#6DC8EC',
	'#D3EEF9',
	'#945FB9',
	'#DECFEA',
	'#FF9845',
	'#FFE0C7',
	'#1E9493',
	'#BBDEDE',
	'#FF99C3',
	'#FFE0ED'
]
</script>

<style lang="scss" scoped>
.le-chart-wrap {
	//padding: 2px 0;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	position: relative;
	background: #fff;

	.tableLoading {
		position: absolute;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		z-index: 999;
		background: rgba(0, 0, 0, 0.05);
	}

	.chart-head,
	.chart-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.axis-name {
			font-size: 12px;
		}
	}

	.chart-wrap {
		flex: 1;
		position: relative;
		// 图表壳样式
		.chart-container {
			width: 100%;
			height: 100%;
		}

		.overlay {
			&.overlayTopLevel {
				pointer-events: unset;
			}

			.chart_noData {
				position: absolute;
				top: 0;
				left: 0;
				bottom: 0;
				right: 0;
				z-index: -1;

				&.chart_noData_show {
					z-index: 1;
					background: #fff;
				}
			}

			position: absolute;
			left: 0;
			top: 0;
			bottom: 0;
			right: 0;
			pointer-events: none;
		}
	}
}
</style>
