// import VPApp from './components/vp-app.vue'

import 'element-plus/theme-chalk/index.css'
// element dark css
import 'element-plus/theme-chalk/dark/css-vars.css'

import './styles/css-vars.scss'
import './styles/app.scss'
import type { Component } from 'vue'
// export default VPApp

import VPDemo from './components/vp-demo.vue'
export const globals: [string, Component][] = [
	['VPDemo', VPDemo],
]
