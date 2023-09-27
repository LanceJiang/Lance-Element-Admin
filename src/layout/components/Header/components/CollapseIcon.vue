<template>
	<el-icon class="collapse-icon le-hover-effect--bg" @click="changeCollapse">
		<component :is="setting.isCollapse ? 'expand' : 'fold'"></component>
	</el-icon>
</template>

<script setup lang="ts">
// import { useGlobalStore } from '@/stores/modules/global'
import useStore from '@/store'
const { setting, app } = useStore()
// const globalStore = useGlobalStore()		setting.changeSetting('themeColor', val)
const changeCollapse = () => setting.changeSetting('isCollapse', !setting.isCollapse)
</script>

<style scoped lang="scss">
.collapse-icon {
	//margin-right: 20px;
	height: 100%;
	width: unset;
	padding: 0 15px;
	font-size: 16px;
	color: var(--el-header-text-color);
}
</style>
