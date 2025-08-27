<template>
	<SvgIcon v-if="isSvgIcon" prefix="" :icon-class="iconClass" :color="color" :spin="spin" />
	<span v-else ref="elRef" :class="`le-icon ${spin ? 'action-spin' : ''}`" :style="getWrapStyle"></span>
</template>

<script lang="ts" setup name="LeIcon">
import { computed, nextTick, ref, watch, onMounted, CSSProperties } from 'vue'
import Iconify from '@purge-icons/generated'
import SvgIcon from './SvgIcon/index.vue'
const props = defineProps({
	iconClass: {
		type: String,
		require: true
	},
	color: {
		type: String,
		default: ''
	},
	// 是否旋转
	spin: {
		type: Boolean,
		default: false
	},
	size: {
		type: [String, Number],
		default: ''
	}
})

const isSvgIcon = computed(() => {
	// 判断是否是svg图标
	const _class = props.iconClass
	// 1. `icon-${xxx}` 本地svg-icon
	// 2. `le-${xxx}` iconfont 定义的 svg
	return ['icon-', 'le-'].some(prefix => _class.startsWith(prefix))
	// return !props.iconClass.includes(':')
})
const elRef = ref(null)
const getWrapStyle = computed((): CSSProperties => {
	const { size, color } = props
	let fs = size
	if (+size) fs = `${size}px`
	return {
		fontSize: fs,
		color
		// display: 'inline-flex'
	}
})
const update = async () => {
	if (isSvgIcon.value) {
		return
	}
	const el = elRef.value
	if (!el) return
	await nextTick()
	const icon = props.iconClass
	const svg = Iconify.renderSVG(icon, {})
	if (svg) {
		el.textContent = ''
		el.appendChild(svg)
	} else {
		const span = document.createElement('span')
		span.className = 'iconify'
		span.dataset.icon = icon
		el.textContent = ''
		el.appendChild(span)
	}
}
watch(() => props.iconClass, update, {
	flush: 'post'
})
onMounted(update)
</script>
