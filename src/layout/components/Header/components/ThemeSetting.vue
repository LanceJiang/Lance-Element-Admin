<template>
	<el-tooltip v-if="setting.showSettings" placement="top" :content="$t('le.layout.setting.title')">
		<div class="menu--theme-setting menu-item le-hover-effect--bg" @click="changeVisible">
			<el-icon>
				<Setting />
			</el-icon>
		</div>
	</el-tooltip>
</template>

<script setup lang="ts">
import useStore from '@/store'
const { setting } = useStore()
const changeVisible = () => {
	setting.settingsVisible = !setting.settingsVisible
}
</script>
<style scoped lang="scss">
.menu--theme-setting {
	width: 40px;
	justify-content: center;
}
</style>
