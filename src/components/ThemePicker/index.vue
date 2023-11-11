<template>
	<el-color-picker
		:model-value="themeColor"
		:predefine="predefineColors"
		class="theme-picker"
		popper-class="theme-picker-dropdown"
		@update:modelValue="changeThemeColor"
	/>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import useStore from '@/store'
import { useTheme } from '@/hooks/useTheme'
const predefineColors = ['#409eff', '#1890ff', '#304156', '#212121', '#11a983', '#13c2c2', '#6959CD', '#f5222d', '#ff9d00']
// 参考连接:https://juejin.cn/post/7024025899813044232#heading-1
// import { ls } from '@/utils'
/*
const mix = (color1: string, color2: string, weight: number) => {
	weight = Math.max(Math.min(Number(weight), 1), 0)
	const r1 = parseInt(color1.substring(1, 3), 16)
	const g1 = parseInt(color1.substring(3, 5), 16)
	const b1 = parseInt(color1.substring(5, 7), 16)
	const r2 = parseInt(color2.substring(1, 3), 16)
	const g2 = parseInt(color2.substring(3, 5), 16)
	const b2 = parseInt(color2.substring(5, 7), 16)
	const r = Math.round(r1 * (1 - weight) + r2 * weight)
	const g = Math.round(g1 * (1 - weight) + g2 * weight)
	const b = Math.round(b1 * (1 - weight) + b2 * weight)
	const rStr = ('0' + (r || 0).toString(16)).slice(-2)
	const gStr = ('0' + (g || 0).toString(16)).slice(-2)
	const bStr = ('0' + (b || 0).toString(16)).slice(-2)
	return '#' + rStr + gStr + bStr
}
// 白色混合色
const mixWhite = '#ffffff'
// 黑色混合色
const mixBlack = '#000000'

const node = document.documentElement

watch(themeColor, (color: string) => {
	// node.style.setProperty('--el-color-primary', color)
	// // 颜色加深 :active 触发
	// node.style.setProperty('--el-color-primary-dark-2', mix(color, mixBlack, 0.1))
	// // ls.set('themeColor', color)
	//
	// for (let i = 1; i < 10; i += 1) {
	// 	node.style.setProperty(`--el-color-primary-light-${i}`, mix(color, mixWhite, i * 0.1))
	// }
	// ls.set('style', node.style.cssText)
})
*/
const { setting } = useStore()
const themeColor = computed(() => setting.themeColor)
const { changeThemeColor } = useTheme()
</script>

<style>
.theme-picker-dropdown {
	z-index: 99999 !important;
}

.theme-picker .el-color-picker__trigger {
	height: 26px !important;
	width: 26px !important;
	padding: 2px;
}

.theme-picker-dropdown .el-color-dropdown__link-btn {
	display: none;
}
</style>
