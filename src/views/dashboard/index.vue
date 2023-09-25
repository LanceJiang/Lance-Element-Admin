<template>
	<div class="dashboard-container column-page-wrap">
		<!-- Echarts 图表 -->
		<el-row :gutter="40" style="margin-top: 20px">
			<el-col :sm="24" :lg="8" class="card-panel__col">
				<BarChart id="barChart" height="400px" width="100%" class="chart-container" />
			</el-col>
			<el-col :sm="24" :lg="8" class="card-panel__col">
				<LeChart
					class="local_chartWrap"
					ref="chartRef"
					:loading="chartLoading"
					:showChart="showChart"
					:option="chartOption"
					:height="height"
					label_topLeft="label_topLeft"
					label_topRight="label_topRight"
					label_bottomLeft="label_bottomLeft"
					label_bottomRight="label_bottomRight"
				/>
			</el-col>
			<el-col :sm="24" :lg="8" class="card-panel__col">
				<LeChart :loading="chartLoading2" isInitOption :option="chartOption2" height="400px" />
			</el-col>
		</el-row>
	</div>
</template>

<script setup name="dashboard" lang="ts">
// 组件引用
import BarChart from './components/Chart/BarChart.vue'
// import LeChart from '@/components/Chart.vue'
import { reactive, ref, toRefs } from 'vue'
import * as echarts from 'echarts'

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
					{ offset: 0, color: '#83bff6' },
					{ offset: 0.5, color: '#188df0' },
					{ offset: 1, color: '#188df0' }
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
					{ offset: 0, color: '#25d73c' },
					{ offset: 0.5, color: '#1bc23d' },
					{ offset: 1, color: '#179e61' }
				])
			}
		},
		{
			name: '收入增长率',
			type: 'line',
			yAxisIndex: 1,
			data: [65, 67, 65, 53, 47, 45, 43, 42, 41],
			itemStyle: {
				color: '#67C23A'
			}
		},
		{
			name: '利润增长率',
			type: 'line',
			yAxisIndex: 1,
			data: [80, 81, 78, 67, 65, 60, 56, 51, 45],
			itemStyle: {
				color: '#409EFF'
			}
		}
	]
})
const getChartData2 = () => ({
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
		top: 'bottom'
	},
	series: [
		{
			name: 'Nightingale Chart',
			type: 'pie',
			radius: [50, 130],
			center: ['50%', '50%'],
			roseType: 'area',
			itemStyle: {
				borderRadius: 6,
				normal: {
					color: function (params: any) {
						//自定义颜色
						const colorList = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C']
						return colorList[params.dataIndex]
					}
				}
			},
			data: [
				{ value: 26, name: '家用电器' },
				{ value: 27, name: '户外运动' },
				{ value: 24, name: '汽车用品' },
				{ value: 23, name: '手机数码' }
			]
		}
	]
})
const chartRef = ref()
window.chartRef = chartRef
const state = reactive({
	chartLoading: false,
	chartOption: {},
	showChart: true,
	width: '100%',
	height: '600px',
	chartLoading2: false,
	chartOption2: getChartData2(),
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
	background: var(--el-bg-color);
	position: relative;

	.card-panel__col {
		margin-bottom: 12px;
	}

	.chart-container {
		background: #ffffff;
	}
}
</style>