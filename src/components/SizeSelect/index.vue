<template>
	<el-dropdown class="menu--size-select-wrap" trigger="hover" @command="handleSetSize">
		<div class="menu--size-select menu-item le-hover-effect--bg">
			<LeIcon class-name="size-icon" icon-class="le-text-size" />
		</div>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item v-for="item of sizeOptions" :key="item.value" :disabled="(size || 'default') == item.value" :command="item.value">
					{{ t(item.label) }}
				</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

import useStore from '@/store'

const { app } = useStore()
const size = computed(() => app.size)

const sizeOptions = ref([
	{ label: 'default', value: 'default' },
	{ label: 'large', value: 'large' },
	{ label: 'small', value: 'small' }
])
const { t } = useI18n({
	messages: {
		en: {
			default: 'Default',
			large: 'Large',
			small: 'Small'
		},
		'zh-cn': {
			default: '默认',
			large: '大型',
			small: '小型'
		}
	}
})
function handleSetSize(size: string) {
	app.setSize(size) // todo 改成setting
	ElMessage.success('切换布局大小成功')
}
</script>

<style lang="scss" scoped>
.menu--size-select-wrap {
	height: 100%;
}
</style>
