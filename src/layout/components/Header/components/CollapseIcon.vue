<template>
	<el-icon class="collapse-icon le-hover-effect--bg" @click="changeCollapse">
		<!--		<component :is="setting.isCollapse ? 'expand' : 'fold'"></component>-->
		<svg
			v-if="setting.isCollapse"
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			aria-hidden="true"
			role="img"
			class="iconify iconify--line-md"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
		>
			<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
				<path stroke-dasharray="16" stroke-dashoffset="16" d="M5 5h14">
					<animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="16;0"></animate>
				</path>
				<path stroke-dasharray="12" stroke-dashoffset="12" d="M5 12h9">
					<animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.2s" values="12;0"></animate>
				</path>
				<path stroke-dasharray="16" stroke-dashoffset="16" d="M5 19h14">
					<animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.2s" values="16;0"></animate>
				</path>
				<path stroke-dasharray="12" stroke-dashoffset="12" d="M17 9l3 3l-3 3">
					<animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="12;0"></animate>
				</path>
			</g>
		</svg>

		<svg
			v-else
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			aria-hidden="true"
			role="img"
			class="iconify iconify--line-md"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
		>
			<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
				<path stroke-dasharray="16" stroke-dashoffset="16" d="M19 5h-14">
					<animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="16;0"></animate>
				</path>
				<path stroke-dasharray="12" stroke-dashoffset="12" d="M19 12h-9">
					<animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.2s" values="12;0"></animate>
				</path>
				<path stroke-dasharray="16" stroke-dashoffset="16" d="M19 19h-14">
					<animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.2s" values="16;0"></animate>
				</path>
				<path stroke-dasharray="12" stroke-dashoffset="12" d="M7 9l-3 3l3 3">
					<animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="12;0"></animate>
				</path>
			</g>
		</svg>
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
