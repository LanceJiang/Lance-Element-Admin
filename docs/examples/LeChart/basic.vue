<template>
  <div>
		<p>基础</p>
		<LeChart
			is-init-option
			:option="chartOptionBasic"
		/>
		<p>边角描述 label_topLeft， label_topRight， label_bottomLeft， label_bottomRight</p>
		<LeChart
			is-init-option
			label_topLeft="topLeft"
			label_topRight="topRight"
			label_bottomLeft="bottomLeft"
			label_bottomRight="bottomRight"
			:option="chartOptionBasic"
		/>
		<p>边角描述 插槽 #top_left， top_right， bottom_left， bottom_right</p>
		<LeChart
			is-init-option
			label_topLeft="topLeft"
			label_topRight="topRight"
			label_bottomLeft="bottomLeft"
			label_bottomRight="bottomRight"
			:option="chartOptionBasic"
		>
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
		<p>异步请求</p>
		<LeChart
			v-bind="chartFetchState"
		/>
	</div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue'

const getBasicData = () => {
	return {
		backgroundColor: '#f69cd8',
		title: {
			text: 'ECharts 入门示例'
		},
		// tooltip: {},
		// legend: {
		// 	data: ['销量']
		// },
		xAxis: {
			data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
		},
		yAxis: {},
		series: [
			{
				name: '销量',
				type: 'bar',
				data: [5, 20, 36, 10, 10, 20]
			}
		]
	}
}
const chartOptionBasic = getBasicData()
const chartFetchState = reactive({ loading: false, option: {} })
const queryCharInfo = () => {
	chartFetchState.loading = true
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(getBasicData())
		}, 1000)
	}).then((res: any) => {
		chartFetchState.option = res
		chartFetchState.loading = false
	})
}
onMounted(() => {
	queryCharInfo()
})
</script>
