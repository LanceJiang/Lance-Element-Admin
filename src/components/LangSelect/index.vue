<template>
	<el-dropdown class="lang-select" trigger="click" @command="handleSetLanguage">
		<div class="lang-select__icon">
			<LeIcon :icon-class="`le-lang_${language}`" style="transform: scale(1.2)" />
		</div>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item :disabled="language === 'zh-cn'" command="zh-cn"> 中文 </el-dropdown-item>
				<el-dropdown-item :disabled="language === 'en'" command="en"> English </el-dropdown-item>
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
.lang-select__icon {
	line-height: 50px;
}
</style>
