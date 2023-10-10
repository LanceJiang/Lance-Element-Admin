<template>
	<el-dropdown class="menu--lang-select-wrap" trigger="hover" @command="handleSetLanguage">
		<div class="menu--lang-select menu-item le-hover-effect--bg">
			<LeIcon :icon-class="`le-lang_${language}`" />
		</div>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item v-for="item in languageList" :key="item.value" :command="item.value" :disabled="language === item.value">
					{{ item.label }}
				</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import useStore from '@/store'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
const { app } = useStore()
const language = computed(() => app.language)
// import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
const languageList = [
	{ label: '简体中文', value: 'zh-cn' },
	{ label: 'English', value: 'en' }
]
const { locale } = useI18n()

function handleSetLanguage(lang: string) {
	locale.value = lang
	app.setLanguage(lang)
	if (lang == 'en') {
		ElMessage.success('Switch Language Successful!')
	} else {
		ElMessage.success('切换语言成功！')
	}
}
onMounted(() => {
	locale.value = language.value
	app.setLanguage(language.value)
})
</script>

<style lang="scss" scoped>
.menu--lang-select-wrap {
	height: 100%;
}
</style>
