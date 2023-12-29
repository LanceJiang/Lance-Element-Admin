<template>
	<div>
		<div class="m-2">
			<p>fetch 数据</p>
			<el-button @click="queryChartInfo(true)" type="primary">获取有数据</el-button>
			<el-button @click="queryChartInfo(false)" type="info">获取无数据</el-button>
		</div>
		<LeChart
			style="background-color: var(--el-color-error-light-7)"
			v-bind="chartFetchState"
		>
			<template #default> <div style="background: #0f0">default 嵌入</div> </template>
			<template #overlay="{noData}">
				<div class="overlayWrap" :class="noData ? 'noData' : ''">没有数据</div>
			</template>
			<template #top_left>
				<span style="background: var(--el-color-success)">top_left</span>
			</template>
			<template #top_right>
				<span style="background: var(--el-color-warning)">top_right</span>
			</template>
			<template #bottom_left>
				<div style="background: var(--el-color-primary)">bottom_left</div>
			</template>
			<template #bottom_right>
				<div style="background: var(--el-color-danger)">bottom_right</div>
			</template>
		</LeChart>
	</div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import * as echarts from 'echarts'
import { colorBase1 } from '@/components/Chart.vue'

const chartFetchState = reactive({
	width: '99%',
	height: '555px',
	loading: false,
	// 是否展示图表
	showChart: false,
	// echart 图表配置 (https://echarts.apache.org/zh/index.html)
	option: {},
})
const handleChartData = (data: { name: string; income: number;  }[]) => {
	chartFetchState.loading = false
	// 模拟没有数据的情况 设置图表为无数据
	if (!data.length) {
		chartFetchState.showChart = false
		return
	}
	chartFetchState.showChart = true
	const classes = [
		{ value: 'income', label: '收入' },
		{ value: 'growRate', label: '利润增长率' }
	].map(({value, label}) => {
		return {
			name: label,
			data: data.map(v => v[value])
		}
	})
	const classes_config = classes.reduce((res, cur) => {
		res[cur.name] = cur.data
		return res
	}, {})
	const xAxis_data = data.map(v => v.name)
	const options = {
		// backgroundColor: '#f69cd8',
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
			backgroundColor: 'rgba(255,255,255,0.2)',
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
			data: classes.map(v => v.name)
		},
		xAxis: [
			{
				type: 'category',
				// data: ['上海', '北京', '浙江', '广东', '深圳', '四川', '湖北', '安徽'],
				data: xAxis_data,
				axisPointer: {
					type: 'shadow'
				}
			}
		],
		yAxis: [
			{
				type: 'value',
				min: 0,
				// max: 10000,
				interval: 2000,
				axisLabel: {
					formatter: '{value}'
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
				// data: [8000, 8200, 7000, 6200, 6500, 5500, 4500, 4200, 3800],
				data: classes_config['收入'],
				barWidth: 20,
				itemStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{ offset: 0, color: colorBase1[0] },
						{ offset: 1, color: colorBase1[1] }
					])
				}
			},
			{
				name: '利润增长率',
				type: 'line',
				yAxisIndex: 1,
				// data: [80, 81, 78, 67, 65, 60, 56, 51, 45],
				data: classes_config['利润增长率'],
				itemStyle: {
					color: new echarts.graphic.LinearGradient(1, 1, 0, 0, [
						{
							offset: 0,
							color: colorBase1[3]
						},
						{
							offset: 1,
							color: colorBase1[4]
						}
					])
				}
			}
		]
	}
	chartFetchState.option = options
}
const queryChartInfo = (bool: boolean = true) => {
	chartFetchState.loading = true
	return new Promise(resolve => {
		const _data = bool ? [
			{
				name: '上海',
				income: 18000,
				growRate: 80,
			},
			{
				name: '北京',
				income: 18200,
				growRate: 81,
			},
			{
				name: '浙江',
				income: 17000,
				growRate: 78,
			},
			{
				name: '广东',
				income: 16200,
				growRate: 67,
			},
			{
				name: '深圳',
				income: 18000,
				growRate: 65,
			},
			{
				name: '四川',
				income: 15500,
				growRate: 60,
			},
			{
				name: '湖北',
				income: 14500,
				growRate: 56,
			},
			{
				name: '安徽',
				income: 14200,
				growRate: 51,
			}
		] : []
		setTimeout(() => {
			resolve(_data)
		}, 1000)
	}).then((data: any) => {
		handleChartData(data)
		// chartFetchState.option = res
		// chartFetchState.loading = false
	})
}
onMounted(() => {
	queryChartInfo()
})
</script>
<style lang="scss" scoped>
.overlayWrap {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	z-index: -1;
	&.noData {
		z-index: 1;
		background: #f00;
	}
}
</style>
