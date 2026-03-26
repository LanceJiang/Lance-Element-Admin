<template>
	<section ref="textTooltipRef" class="le-text-wrap">
		<el-tooltip v-if="value" popper-class="le-text-popper" v-bind="$attrs" :visible="isShowTooltip" :placement="placement">
			<template #content>
				<slot name="content">
					<span>{{ value }}</span>
				</slot>
			</template>
			<div class="le-text" @mouseover="handleElTooltip" @mouseleave="isShowTooltip = false">
				<slot>
					<el-text v-bind="textProps" class="text-overflow_ellipsis_line_2" :style="textStyle">{{ value }}</el-text>
				</slot>
				<!-- 复制按钮 -->
				<el-icon v-if="copy" class="action-icon">
					<DocumentCopy @click.stop="copyText(value)" />
				</el-icon>
			</div>
		</el-tooltip>
		<span v-else>-</span>
	</section>
</template>

<script lang="ts" setup name="LeText">
import { computed, ref } from 'vue'
import type { Component, PropType } from 'vue'
import { copyText } from '@/utils'

defineOptions({ name: 'LeText' })
const props = defineProps({
	value: {
		type: String,
		default: ''
	},
	copy: {
		type: Boolean,
		default: false
	},
	// tooltip 配置
	placement: {
		type: String,
		default: 'top'
	},
	// text 配置
	lineClamp: {
		type: [String, Number],
		default: 1
	},
	type: {
		type: String as PropType<'primary' | 'success' | 'warning' | 'danger' | 'info'>
	},
	tag: {
		type: String,
		default: 'span'
	}
	/*truncated: {
		type: Boolean,
	}*/
})
const textProps = computed(() => {
	const { lineClamp, type, tag } = props
	return {
		lineClamp,
		type,
		tag
	}
})
const textStyle = computed((): string => {
	const lineClamp = +props.lineClamp || 1
	return `line-clamp: ${lineClamp}; -webkit-line-clamp: ${lineClamp}`
})
const textTooltipRef = ref<HTMLElement>()
const visible = ref(false)
const isShowTooltip = ref(false)
function handleElTooltip(e: any): void {
	const base: number = textTooltipRef.value?.clientHeight
	isShowTooltip.value = e.target.scrollHeight > base
}
</script>
