<!-- 顶部菜单模式:top -->
<template>
	<el-container class="le-layout-wrap--top">
		<el-header class="le-layout-header">
			<div class="logo">
				<!--          <SvgIcon class="logo-img sidebar-logo" icon="logo" />-->
				<img class="logo-img" src="@/assets/icons/logo.svg" alt="logo" />
				<span class="logo-text text-overflow_ellipsis" :title="title">{{ title }}</span>
			</div>
			<el-menu class="layout-menu-wrap" mode="horizontal" :router="false" :default-active="activeMenu">
				<!-- 不能直接使用 SubMenu 组件，无法触发 el-menu 隐藏省略功能 -->
				<template v-for="subItem in menuList" :key="subItem.path">
					<el-sub-menu
						v-if="subItem.children?.length"
						:key="subItem.path"
						popper-class="layout-menu-popper-wrap"
						:index="subItem.path + 'el-sub-menu'"
					>
						<template #title>
							<PickerIcon v-if="subItem.meta.icon" :icon="subItem.meta.icon" />
							<span>{{ generateTitle(subItem.meta?.title) }}</span>
						</template>
						<SubMenu :menu-list="subItem.children" />
					</el-sub-menu>
					<el-menu-item
						v-else
						:key="subItem.path + 'el-menu-item'"
						popper-class="layout-menu-popper-wrap"
						:index="subItem.path"
						@click="handleClickMenu(subItem)"
					>
						<PickerIcon v-if="subItem.meta.icon" :icon="subItem.meta.icon" />
						<template #title>
							<span>{{ generateTitle(subItem.meta?.title) }}</span>
						</template>
					</el-menu-item>
				</template>
			</el-menu>
			<ToolBarRight />
		</el-header>
		<AppMain />
	</el-container>
</template>

<script setup lang="ts" name="layoutTop">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppMain from '@/layout/components/AppMain.vue'
import ToolBarRight from '@/layout/components/Header/ToolBarRight.vue'
import SubMenu from '@/layout/components/Menu/SubMenu.vue'
import PickerIcon from '@/components/IconPicker/PickerIcon.vue'
import useStore from '@/store'
import { generateTitle } from '@/utils/i18n'
import { isExternal } from '@/utils/validate.ts'
// import { AppRouteRecordRaw } from '@/router/types'

const title = import.meta.env.VITE_APP_TITLE
const { permission, setting, app } = useStore()
const route = useRoute()
const router = useRouter()
const menuList = computed(() => permission.showMenuList)
const activeMenu = computed(() => (route.meta?.activeMenu ? route.meta.activeMenu : route.path) as string)

const handleClickMenu = (subItem: RouteMenu.Item) => {
	if (isExternal(subItem.path)) return window.open(subItem.path, '_blank')
	router.push(subItem.path)
}
</script>

<style lang="scss">
@use './index.scss';
</style>
