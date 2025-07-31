<script setup lang="ts">
import type { PropType } from 'vue'
import { onUnmounted, ref, watch } from 'vue'
import { cancelRaf, rafTimeout } from '@/utils/raf'
import { getRemainingSecondsInfo } from '@/utils'

defineOptions({ name: 'TimeCountDown' })

// 定义props
const props = defineProps({
	record: {
		type: Object as PropType<DateInfo>,
		default: () => ({ local_leftSeconds: 0, local_isExpired: true })
	},
	update: {
		type: Boolean,
		default: false
	}
})
interface DateInfo extends Recordable {
	local_leftSeconds: number
	local_isExpired: boolean
	local_leftDay?: number
	local_leftHMS?: string
}
/* // 定义事件发射
const emit = defineEmits<{
  (e: 'update:record', value: DateInfo): void
}>() */

// 定时器引用
let countdownTimer: { id?: number } | null = null
let cur_timestamp = 0
const isExpired = ref(false)
// 当前秒数状态
const leftSeconds = ref(0)
const leftDay = ref(0)
const leftHMS = ref('00:00:00')
const doubleNumStr = (num: number) => `0${num || 0}`.slice(-2)

/**
 * 更新倒计时状态
 */
function updateCountdown(minusSeconds = 0) {
	// stopCountdown()
	const next_leftSeconds = leftSeconds.value - minusSeconds
	if (next_leftSeconds > 0) {
		const { d, h, m, s } = getRemainingSecondsInfo(next_leftSeconds)
		const hms = `${doubleNumStr(h || 0)}:${doubleNumStr(m || 0)}:${doubleNumStr(s || 0)}`

		isExpired.value = false
		leftSeconds.value = next_leftSeconds
		leftDay.value = d
		leftHMS.value = hms
		if (props.update) {
			Object.assign(props.record, {
				local_isExpired: false,
				local_leftSeconds: next_leftSeconds,
				local_leftDay: d,
				local_leftHMS: hms
			})
			/* emit('update:record', {
        ...props.record,
        local_isExpired: false,
        local_leftSeconds: next_leftSeconds,
        local_leftDay: d,
        local_leftHMS: hms,
      }) */
		}

		countdownTimer = rafTimeout(() => {
			const now = +new Date()
			// 实际时间消耗
			const diffTime = Math.floor((now - cur_timestamp) / 1000)
			cur_timestamp = now
			// 页面退到后台的时候不会计时，对比时间差，大于1s的重置倒计时
			updateCountdown(Math.max(diffTime, 1))
		}, 1000)
	} else {
		isExpired.value = true

		if (props.update) {
			Object.assign(props.record, {
				local_isExpired: true,
				local_leftSeconds: next_leftSeconds
			})
			/* emit('update:record', {
        ...props.record,
        local_isExpired: true,
        local_leftSeconds: next_leftSeconds,
      }) */
		}
	}
}

/**
 * 启动倒计时
 */
function startCountdown() {
	stopCountdown() // 清除现有定时器
	if (leftSeconds.value > 0) {
		cur_timestamp = +new Date()
		updateCountdown(0)
	}
}

/**
 * 停止倒计时
 */
function stopCountdown() {
	if (countdownTimer) {
		cancelRaf(countdownTimer)
		countdownTimer = null
	}
}

/**
 * 监听props变化
 */
watch(
	() => props.record.local_leftSeconds,
	newSeconds => {
		if (newSeconds !== leftSeconds.value) {
			leftSeconds.value = newSeconds
			if (newSeconds > 0) startCountdown()
			else stopCountdown()
		}
	},
	{ immediate: true }
)

/**
 * 组件卸载时清除定时器
 */
onUnmounted(() => {
	stopCountdown()
})
</script>

<template>
	<div class="countdown-container">
		<slot v-bind="{ leftDay, leftHMS, isExpired, leftSeconds }">
			<div v-if="leftSeconds" class="expired-text">已过期</div>
			<div v-else class="countdown-content">
				<span v-if="leftDay" class="countdown-item">{{ leftDay }}天</span>
				<span class="countdown-item">{{ leftHMS }}</span>
			</div>
		</slot>
	</div>
</template>

<style scoped lang="less">
.countdown-container {
	.expired-text {
		color: #faad14;
		background: rgba(250, 173, 20, 0.1);
		padding: 2px 8px;
		border-radius: 4px;
	}

	.countdown-content {
		.countdown-item {
			padding: 0 2px;
			min-width: 24px;
			text-align: center;
		}
	}
}
</style>
