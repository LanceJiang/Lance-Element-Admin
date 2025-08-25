<template>
	<svg aria-hidden="true" class="svg-icon">
		<use :xlink:href="symbolId" :fill="color" />
	</svg>
</template>

<script setup lang="ts" name="SvgIcon">
import { computed } from 'vue'

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
	}
})

const symbolId = computed(() => {
	const prefix = props.prefix
	if (prefix) return `#${prefix}-${props.iconClass}`
	return `#${props.iconClass}`
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
