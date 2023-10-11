<template>
	<el-tooltip placement="top" :content="$t('le.menuDarkTheme')">
		<div class="menu--theme menu-item le-hover-effect--bg" @click="changeDark">
			<el-icon>
				<Moon v-if="setting.isDark" />
				<Sunny v-else />
			</el-icon>
		</div>
	</el-tooltip>
</template>

<script setup lang="ts">
import useStore from '@/store'
import { useTheme } from '@/hooks/useTheme'
const { switchDark } = useTheme()
const { setting } = useStore()
const changeDark = () => {
	setting.isDark = !setting.isDark
	switchDark()
}
</script>
