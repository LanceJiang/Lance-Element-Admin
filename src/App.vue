<template>
	<el-config-provider :locale="locale" :size="size">
		<router-view />
	</el-config-provider>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { ElConfigProvider } from 'element-plus'
import { ls } from '@/utils'
import useAppStore from '@/store/modules/app'
import { useTheme } from '@/hooks/useTheme'
// 导入 Element Plus 语言包
import { messages } from '@/lang'
const app = useAppStore()

const language = computed(() => app.language)
const size = computed(() => app.size)

const locale = ref()
// 初始化 主题
const { initTheme } = useTheme()
initTheme()
/*nextTick(() => {
	// 尝试获取原主题样式 并做设置
	const node: HTMLElement = document.documentElement
	const styles = ls.get('style')
	if (styles) {
		node.style = styles
	}
})*/
watch(
	language,
	value => {
		locale.value = value == 'en' ? messages.en : messages['zh-cn']
	},
	{
		// 初始化立即执行
		immediate: true
	}
)
</script>
