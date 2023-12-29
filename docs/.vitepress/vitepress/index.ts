// import VPApp from './components/vp-app.vue'

import 'element-plus/theme-chalk/index.css'
// element dark css
import 'element-plus/theme-chalk/dark/css-vars.css'

import './styles/css-vars.scss'
import './styles/app.scss'
import type { Component } from 'vue'
// export default VPApp

import VPDemo from './components/vp-demo.vue'
import VPApiTyping from './components/globals/vp-api-typing.vue'

// Lance-Element-Admin src 全局组件 Start
import LeSelect from '@/components/Select/index.vue'
import LeInputNumber from '@/components/InputNumber.vue'
import LeInputNumberRange from '@/components/InputNumberRange.vue'
import LeChart from '@/components/Chart.vue'
import LeNoData from '@/components/NoData.vue'
// Lance-Element-Admin src 全局组件 End
export const globals: [string, Component][] = [
	['VPDemo', VPDemo],
	['VPApiTyping', VPApiTyping],
]

// Lance-Element-Admin src 全局组件

export const local_components: Component[] = [
	LeSelect,
	LeInputNumber,
	LeInputNumberRange,
	LeChart,
	LeNoData
]
