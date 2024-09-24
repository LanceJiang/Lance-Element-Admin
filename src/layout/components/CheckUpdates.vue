<template>
	<slot></slot>
</template>
<script setup lang="tsx">
import { onMounted, onUnmounted, ref } from 'vue'
import { ElNotification, ElButton } from 'element-plus'
import { t } from '@/utils'
const props = defineProps({
	checkUpdatesInterval: {
		type: Number,
		default: 5
	}
})
const lastVersionTag = ref('')
let isCheckingUpdates = false
let timer: ReturnType<typeof setInterval>
const entrance = import.meta.env.VITE_PUBLIC_PATH
async function getVersionTag() {
	try {
		if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
			return null
		}

		const response = await fetch(entrance, {
			cache: 'no-cache',
			method: 'HEAD'
		})

		return response.headers.get('etag') || response.headers.get('last-modified')
	} catch {
		console.error('Failed to fetch version tag')
		return null
	}
}

async function checkForUpdates() {
	const versionTag = await getVersionTag()
	if (!versionTag) {
		return
	}

	// 首次运行时不提示更新
	if (!lastVersionTag.value) {
		lastVersionTag.value = versionTag
		return
	}
	if (lastVersionTag.value !== versionTag && versionTag) {
		clearInterval(timer)
		handleNotice(versionTag)
	}
}

const handleNotice = versionTag => {
	const onOk = () => {
		lastVersionTag.value = versionTag
		window.location.reload()
	}
	const notify = ElNotification({
		title: t('le.layout.checkUpdatesTitle'),
		customClass: 'le-notification--check-app',
		message: (
			<div>
				{t('le.layout.checkUpdatesDescription')}
				<div class="text-right mt-[12px]">
					<ElButton onClick={() => notify.close()}>{t('le.btn.cancel')}</ElButton>
					<ElButton type="primary" onClick={onOk}>
						{t('le.refresh')}
					</ElButton>
				</div>
			</div>
		),
		position: 'bottom-right',
		duration: 0
	})
}

function start() {
	if (props.checkUpdatesInterval <= 0) {
		return
	}

	// 每 checkUpdatesInterval(默认值为5) 分钟检查一次
	timer = setInterval(checkForUpdates, props.checkUpdatesInterval * 60 * 1000)
}
function stop() {
	clearInterval(timer)
}
function handleVisibilitychange() {
	// console.error(isCheckingUpdates, 'isCheckingUpdates')
	if (document.hidden) {
		stop()
	} else {
		if (!isCheckingUpdates) {
			isCheckingUpdates = true
			checkForUpdates().finally(() => {
				isCheckingUpdates = false
				start()
			})
		}
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
