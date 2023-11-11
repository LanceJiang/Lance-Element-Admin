<template>
	<div ref="dashboardRef" class="dashboard-container column-page-wrap">
		<!-- Echarts 图表 -->
		<el-row :gutter="40" style="margin-top: 20px">
			<el-col :sm="24" :lg="8" class="card-panel__col">
				<BarChart style="background-color: var(--el-color-primary-light-9)" id="barChart" height="400px" width="100%" class="chart-container" />
			</el-col>
			<el-col :sm="24" :lg="8" class="card-panel__col">
				<LeChart
					ref="chartRef"
					style="background-color: var(--el-color-primary-light-9)"
					class="local_chartWrap"
					:loading="chartLoading"
					:show-chart="showChart"
					:option="chartOption"
					:height="height"
					label_topLeft="label_topLeft"
					label_topRight="label_topRight"
					label_bottomLeft="label_bottomLeft"
					label_bottomRight="label_bottomRight"
				/>
			</el-col>
			<el-col :sm="24" :lg="8" class="card-panel__col">
				<LeChart :loading="chartLoading2" is-init-option :option="chartOption2" height="400px" />
			</el-col>
		</el-row>
	</div>
</template>

<script setup name="dashboard" lang="ts">
// 组件引用
import BarChart from './components/Chart/BarChart.vue'
import { colorBase1 } from '@/components/Chart.vue'
import { reactive, ref, toRefs } from 'vue'
import * as echarts from 'echarts'
const dashboardRef = ref()
window.dashboardRef = dashboardRef
const getChartData = () => ({
	title: {
		show: true,
		text: '业绩总览',
		x: 'center',
		padding: 15,
		textStyle: {
			fontSize: 18,
			fontStyle: 'normal',
			fontWeight: 'bold',
			color: '#337ecc'
		}
	},
	grid: {
		left: '2%',
		right: '2%',
		bottom: '10%',
		containLabel: true
	},
	tooltip: {
		// show: true,
		trigger: 'axis',
		axisPointer: {
			type: 'cross',
			crossStyle: {
				color: '#999'
			}
		}
	},
	legend: {
		x: 'center',
		y: 'bottom',
		data: ['收入', '毛利润', '收入增长率', '利润增长率']
	},
	xAxis: [
		{
			type: 'category',
			data: ['上海', '北京', '浙江', '广东', '深圳', '四川', '湖北', '安徽'],
			axisPointer: {
				type: 'shadow'
			}
		}
	],
	yAxis: [
		{
			type: 'value',
			min: 0,
			max: 10000,
			interval: 2000,
			axisLabel: {
				formatter: '{value} '
			}
		},
		{
			type: 'value',
			min: 0,
			max: 100,
			interval: 20,
			axisLabel: {
				formatter: '{value}%'
			}
		}
	],
	series: [
		{
			name: '收入',
			type: 'bar',
			data: [8000, 8200, 7000, 6200, 6500, 5500, 4500, 4200, 3800],
			barWidth: 20,
			itemStyle: {
				color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
					{ offset: 0, color: colorBase1[0] },
					{ offset: 1, color: colorBase1[1] }
				])
			}
		},
		{
			name: '毛利润',
			type: 'bar',
			data: [6700, 6800, 6300, 5213, 4500, 4200, 4200, 3800],
			barWidth: 20,
			itemStyle: {
				color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
					{ offset: 0, color: colorBase1[2] },
					{ offset: 1, color: colorBase1[3] }
				])
			}
		},
		{
			name: '收入增长率',
			type: 'line',
			yAxisIndex: 1,
			data: [65, 67, 65, 53, 47, 45, 43, 42, 41],
			itemStyle: {
				color: new echarts.graphic.LinearGradient(1, 1, 0, 0, [
					{
						offset: 0,
						color: colorBase1[0]
					},
					{
						offset: 1,
						color: colorBase1[1]
					}
				])
			},
			//区域填充样式
			areaStyle: {
				normal: {
					//线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
					color: new echarts.graphic.LinearGradient(
						0,
						0,
						0,
						1,
						[
							{
								offset: 0,
								color: colorBase1[0]
							},
							// {
							// 	offset: 0.5,
							// 	color: colorBase1[2]
							// },
							{
								offset: 1,
								color: 'transparent'
							}
						],
						false
					)
					// shadowColor: 'rgba(53,142,215, 0.9)', //阴影颜色
					// shadowBlur: 20 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
				}
			}
		},
		{
			name: '利润增长率',
			type: 'line',
			yAxisIndex: 1,
			data: [80, 81, 78, 67, 65, 60, 56, 51, 45],
			itemStyle: {
				color: new echarts.graphic.LinearGradient(1, 1, 0, 0, [
					{
						offset: 0,
						color: colorBase1[2]
					},
					{
						offset: 1,
						color: colorBase1[3]
					}
				])
			}
		}
	]
})
const getChartData2 = () => {
	const data = [
		{ value: 26, name: '家用电器' },
		{ value: 27, name: '户外运动' },
		{ value: 24, name: '汽车用品' },
		{ value: 23, name: '手机数码' }
	]
	// const backgroundColor = dashboardRef.value
	const backgroundColor = dashboardRef.value && window.getComputedStyle(dashboardRef.value, null)?.getPropertyValue('background-color') || '#409eff'
	return {
		// backgroundColor: '#f69cd8',
		backgroundColor,
		title: {
			show: true,
			text: '产品分类总览',
			x: 'center',
			padding: 15,
			textStyle: {
				fontSize: 18,
				fontStyle: 'normal',
				fontWeight: 'bold',
				color: '#337ecc'
			}
		},
		grid: {
			left: '2%',
			right: '2%',
			bottom: '10%',
			containLabel: true
		},
		legend: {
			top: 'bottom',
			data: data.map(v => ({ name: v.name }))
		},
		series: [
			{
				// name: 'Nightingale Chart',
				type: 'pie',
				radius: [120, 130],
				hoverAnimation: false,
				center: ['50%', '50%'],
				// roseType: 'area',
				itemStyle: {
					borderRadius: 12,
					normal: {
						color: function (params: any) {
							// //自定义颜色
							// const colorList = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C']
							return colorBase1[params.dataIndex]
						}
					}
				},
				data: data
					.map((v, i) => {
						return [
							{
								...v,
								itemStyle: {
									normal: {
										borderWidth: 10,
										shadowBlur: 20,
										// borderColor:color[i],
										borderColor: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
											{
												offset: 0,
												color: colorBase1[i + 1]
											},
											{
												offset: 1,
												color: colorBase1[i]
											}
										]),
										shadowColor: colorBase1[i]
									}
								}
							},
							{
								value: 2,
								name: '',
								itemStyle: {
									normal: {
										label: {
											show: false
										},
										labelLine: {
											show: false
										},
										color: 'rgba(0, 0, 0, 0)',
										borderColor: 'rgba(0, 0, 0, 0)',
										borderWidth: 0
									}
								}
							}
						]
					})
					.flat(1)
			}
		]
	}
}
const chartRef = ref()
window.chartRef = chartRef
const state = reactive({
	chartLoading: false,
	chartOption: {},
	showChart: true,
	width: '100%',
	height: '600px',
	chartLoading2: false,
	chartOption2: getChartData2()
	/*chartOption: getChartData()*/
})
const { chartLoading, chartOption, width, height, showChart, chartLoading2, chartOption2 } = toRefs(state)
window.test_showChart = () => (showChart.value = !showChart.value)
window.test_localStyle = (width_ = '100%', height_ = '600px') => {
	width.value = width_
	height.value = height_
}
// lineChart
new Promise(resolve => {
	state.chartLoading = true
	setTimeout(() => {
		resolve(getChartData())
	}, 1000)
}).then((res: any) => {
	console.error(res, 'res////////')
	state.chartOption = res
	state.chartLoading = false
	// setTimeout(() => {
	//   state.chartLoading = false
	// }, 50)
})

// pieChart
new Promise(resolve => {
	state.chartLoading2 = true
	setTimeout(() => {
		resolve(getChartData2())
	}, 500)
}).then((res: any) => {
	console.error(res, 'pieChart res////////')
	state.chartOption2 = res
	state.chartLoading2 = false
})
</script>

<style lang="scss" scoped>
.dashboard-container {
	overflow-y: auto;
	padding: 24px;
	//background-color: rgb(240, 242, 245);
	//background: var(--el-bg-color);
	//background: #f1f1fd;
	background: var(--el-color-primary-light-9);
	position: relative;

	.card-panel__col {
		margin-bottom: 12px;
	}

	.chart-container {
		background: #ffffff;
	}
}
</style>
