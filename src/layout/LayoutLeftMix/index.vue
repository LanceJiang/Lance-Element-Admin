<!-- 左侧菜单混合模式:leftMix -->
<template>
	<el-container class="le-layout-wrap--leftMix">
		<div class="le-layout-aside-split">
			<div class="logo">
				<!--          <SvgIcon class="logo-img sidebar-logo" icon-class="logo" />-->
				<img class="logo-img" src="@/assets/icons/logo.svg" alt="logo" />
			</div>
			<el-scrollbar>
				<div class="split-list">
					<div
						v-for="item in menuList"
						:key="item.path"
						class="el-menu-item split-item"
						:class="{ 'split-active': splitActive === item.path || `/${splitActive.split('/')[1]}` === item.path }"
						@click="changeSubMenu(item)"
					>
						<PickerIcon v-if="item.meta?.icon" :icon-class="item.meta.icon"></PickerIcon>
						<span class="text-overflow_ellipsis_line_1 title">{{ generateTitle(item.meta.title) }}</span>
					</div>
				</div>
			</el-scrollbar>
		</div>
		<el-aside class="le-layout-aside" :class="{ 'not-aside': !subMenuList.length }" :style="{ width: isCollapse ? '65px' : '210px' }">
			<div class="logo">
				<span v-show="subMenuList.length" class="text-overflow_ellipsis logo-text" :title="title">{{ title }}</span>
			</div>
			<el-scrollbar>
				<el-menu
					class="layout-menu-wrap"
					:router="false"
					:default-active="activeMenu"
					:collapse="isCollapse"
					:unique-opened="accordion"
					:collapse-transition="false"
				>
					<SubMenu :menu-list="subMenuList" />
				</el-menu>
			</el-scrollbar>
		</el-aside>
		<el-container>
			<el-header class="le-layout-header">
				<ToolBarLeft />
				<ToolBarRight />
			</el-header>
			<AppMain />
		</el-container>
	</el-container>
</template>

<script setup lang="ts" name="layoutTopMix">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppMain from '@/layout/components/AppMain.vue'
import ToolBarLeft from '@/layout/components/Header/ToolBarLeft.vue'
import ToolBarRight from '@/layout/components/Header/ToolBarRight.vue'
import SubMenu from '@/layout/components/Menu/SubMenu.vue'
import PickerIcon from '@/components/IconPicker/PickerIcon.vue'
import useStore from '@/store'
import { generateTitle } from '@/utils/i18n'
import { isExternal } from '@/utils/validate'
// import { AppRouteRecordRaw } from '@/router/types'
const title = import.meta.env.VITE_APP_TITLE

const route = useRoute()
const router = useRouter()
const { permission, setting, app } = useStore()
const accordion = computed(() => setting.accordion)
const isCollapse = computed(() => setting.isCollapse)
const menuList = computed(() => permission.showMenuList)
const activeMenu = computed(() => (route.meta?.activeMenu ? route.meta.activeMenu : route.path) as string)

const subMenuList = ref<RouteMenu.Item[]>([])
const splitActive = ref('')
watch(
	() => [menuList, route],
	() => {
		// 当前菜单没有数据直接 return
		if (!menuList.value.length) return
		splitActive.value = route.path
		const menuItem = menuList.value.filter((item: RouteMenu.Item) => {
			return route.path === item.path || `/${route.path.split('/')[1]}` === item.path
			// const pathArr = route.path.split('/')
			// const childPath = pathArr.length > 1 ? `/${pathArr[1]}` : pathArr[0]
			// return route.path === item.path || childPath === item.path
		})
		if (menuItem[0]?.children?.length) return (subMenuList.value = menuItem[0].children)
		subMenuList.value = []
	},
	{
		deep: true,
		immediate: true
	}
)

// change SubMenu
const changeSubMenu = (item: RouteMenu.Item) => {
	splitActive.value = item.path
	if (item.children?.length) return (subMenuList.value = item.children)
	subMenuList.value = []
	if (isExternal(item.path)) return window.open(item.path, '_blank')
	router.push(item.path)
}
</script>

<style lang="scss">
@use './index.scss';
</style>
