<template>
	<slot></slot>
</template>
<script setup lang="tsx">
import { onMounted, onUnmounted, ref } from 'vue'
import { ElNotification, ElButton } from 'element-plus'
import { t } from '@/utils'
import { createWorker, createWorkFn } from './utils'
const lastVersionTag = ref('')
const entrance = location.origin + import.meta.env.VITE_PUBLIC_PATH
let last_notify = null
const opts = {
	intervalTime: 5000, // 0.5 * 60 * 1000, todo...
	fetchUrl: entrance
	// immediate: false
}
const worker = createWorker(createWorkFn, [])
worker.onmessage = e => {
	console.error(e, 'e.... 外部接收message 进行处理')
	handleNotice('versionTag todo...')
}
const start = (immediate = false) => {
	worker.postMessage({ type: 'start', data: { ...opts, immediate } })
}
const stop = () => {
	console.error('启动 stop')
	worker.postMessage({ type: 'stop' })
}
console.log(import.meta.env, 'import.meta.env')

const handleNotice = versionTag => {
	const onOk = () => {
		lastVersionTag.value = versionTag
		window.location.reload()
	}
	if (last_notify) return

	const notify = ElNotification({
		title: t('le.layout.checkUpdatesTitle'),
		customClass: 'le-notification--check-app',
		message: (
			<div>
				{t('le.layout.checkUpdatesDescription')}
				<div class="text-right mt-[12px]">
					<ElButton onClick={onClose}>{t('le.btn.cancel')}</ElButton>
					<ElButton type="primary" onClick={onOk}>
						{t('le.refresh')}
					</ElButton>
				</div>
			</div>
		),
		position: 'bottom-right',
		duration: 0,
		onClose
	})
	last_notify = notify
	function onClose() {
		notify.close()
		last_notify = null
	}
}

function handleVisibilitychange() {
	if (document.hidden) {
		stop()
	} else {
		start(true)
	}
}
onMounted(() => {
	start()
	document.addEventListener('visibilitychange', handleVisibilitychange)
})

onUnmounted(() => {
	stop()
	document.removeEventListener('visibilitychange', handleVisibilitychange)
})
</script>

<style lang="scss">
//.le-notification--check-app {
.#{$prefix}notification--check-app {
	.el-notification {
		&__group {
			margin: 0;
			width: 100%;
		}
		&__content {
			margin-right: -12px;
		}
	}
}
</style>
