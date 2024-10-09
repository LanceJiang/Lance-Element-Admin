<template>
	<div class="wrap flex items-center flex-wrap">
		<!--	通过 : fill 设置 color	-->
		<LeIcon
			icon-class="icon-404"
			class="m-2"
			color="var(--el-color-primary)"
		/>
		<!--	通过 style: color 继承	-->
		<LeIcon
			icon-class="icon-refresh"
			class="m-2 text-orange-500"
		/>
		<!--	class 和 color 都用 (若支持color) color 权限会更高	-->
		<LeIcon class="m-2 text-green-500" color="red" icon-class="le-frozen"></LeIcon>
		<el-tooltip placement="top" content="查看">
			<el-button class="le-icon-button">
				<LeIcon class="mx-1" icon-class="le-view"></LeIcon>
			</el-button>
		</el-tooltip>
		<div class="w-full text-blue-500">
			更多le-iconfont(le-[icon])：
		</div>
		<div class="w-full flex items-center flex-wrap">
			<LeIcon v-for="icon in leIconData.icons" :key="icon" :icon-class="`${leIconData.prefix}${icon}`" class="le-pick-icon m-1" color="var(--el-color-primary)"/>
		</div>
		<div class="w-full text-orange-500">
			更多svgIcon(icon-[dir]-[icon])：
		</div>
		<div class="w-full flex items-center flex-wrap">
			<LeIcon v-for="icon in svgIconData.icons" :key="icon" :icon-class="`${svgIconData.prefix}${icon}`" class="le-pick-icon m-1 text-orange-500" />
		</div>
	</div>
</template>
<script setup lang="ts">
import { leIconData, svgIconData } from '@/components/IconPicker/iconsData.ts'
console.log(leIconData, 'leIconData')
</script>
<style scoped>
.wrap {
	//flex-wrap: wrap;
}
.le-pick-icon {
	 /*width: 1em;
	 height: 1em;
	 vertical-align: -0.15em;
	 fill: currentColor;
	 overflow: hidden;
	 &:focus {
		 outline: unset;
	 }*/
 }
</style>
