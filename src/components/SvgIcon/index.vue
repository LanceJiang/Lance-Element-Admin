<template>
	<svg aria-hidden="true" :class="`svg-icon ${spin ? 'action-spin' : ''}`" :style="getStyle">
		<use :xlink:href="symbolId" :fill="color" />
	</svg>
</template>

<script setup lang="ts" name="SvgIcon">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'

const props = defineProps({
	/**
	 * 设置的前缀:
	 * 默认本地: icon => `icon-${xxx}`
	 * 用到 iconfont的字体: le => `le-${xxx}`
	 */
	prefix: {
		type: String,
		default: 'icon'
	},
	iconClass: {
		type: String,
		required: false
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

const symbolId = computed(() => {
	const prefix = props.prefix
	if (prefix) return `#${prefix}-${props.iconClass}`
	return `#${props.iconClass}`
})

const getStyle = computed((): CSSProperties => {
	const { size } = props
	let fontSize = `${size}`
	if (+size) fontSize = `${size}px`
	return {
		fontSize
	}
})
</script>

<style scoped lang="scss">
.svg-icon {
	width: 1em;
	height: 1em;
	vertical-align: -0.15em;
	overflow: hidden;
	fill: currentColor;

	&:focus {
		outline: unset;
	}
}
</style>
