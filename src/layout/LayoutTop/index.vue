<!-- 顶部菜单模式:top -->
<template>
	<el-container class="layout-wrap--top">
		<el-header>
			<div class="logo">
				<!--          <SvgIcon class="logo-img sidebar-logo" icon-class="logo" />-->
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
							<!--							<el-icon>
								<component :is="subItem.meta.icon"></component>
							</el-icon>-->
							<MenuIcon v-if="subItem.meta.icon" :icon-class="subItem.meta.icon" />
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
						<MenuIcon v-if="subItem.meta.icon" :icon-class="subItem.meta.icon" />
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
// import { useAuthStore } from '@/stores/modules/auth'
import { useRoute, useRouter } from 'vue-router'
// import Main from '@/layouts/components/Main/index.vue'
import AppMain from '@/layout/components/AppMain.vue'
import ToolBarRight from '@/layout/components/Header/ToolBarRight.vue'
import SubMenu from '@/layout/components/Menu/SubMenu.vue'
import MenuIcon from '@/layout/components/Menu/MenuIcon.vue'
import useStore from '@/store'
import { generateTitle } from '@/utils/i18n'

const title = import.meta.env.VITE_APP_TITLE
const { permission, setting, app } = useStore()
const route = useRoute()
const router = useRouter()
// const authStore = useAuthStore()
// const menuList = computed(() => authStore.showMenuListGet)
const menuList = computed(() => permission.showMenuList)
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string)

const handleClickMenu = (subItem: Menu.MenuOptions) => {
	if (subItem.meta.isLink) return window.open(subItem.meta.isLink, '_blank')
	router.push(subItem.path)
}
</script>

<style lang="scss">
@import './index.scss';
</style>
