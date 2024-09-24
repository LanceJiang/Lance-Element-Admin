<!-- 左侧菜单模式:left -->
<template>
	<el-container class="le-layout-wrap--left">
		<el-aside class="le-layout-aside transition-all-300 aside-m" :class="isCollapse ? 'aside-m--hidden' : ''">
			<div class="aside-box transition-all-300" :style="{ width: isCollapse ? '65px' : '210px' }">
				<div class="logo">
					<!--          <SvgIcon class="logo-img sidebar-logo" icon-class="logo" />-->
					<img class="logo-img" src="@/assets/icons/logo.svg" alt="logo" />
					<span v-show="!isCollapse" class="text-overflow_ellipsis logo-text" :title="title">{{ title }}</span>
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
						<SubMenu :menu-list="menuList" />
					</el-menu>
				</el-scrollbar>
			</div>
		</el-aside>
		<div
			class="pc:hidden absolute left-0 top-0 h-full w-full bg-[rgba(0,0,0,0.2)] layout-mobile-sider-mask transition-all-300"
			:class="isCollapse ? 'hidden' : ''"
			@click.stop="setting.changeCollapse(true)"
		/>
		<el-container>
			<el-header class="le-layout-header">
				<ToolBarLeft />
				<ToolBarRight />
			</el-header>
			<AppMain />
		</el-container>
	</el-container>
</template>

<script setup lang="ts" name="layoutLeft">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ToolBarLeft from '@/layout/components/Header/ToolBarLeft.vue'
import ToolBarRight from '@/layout/components/Header/ToolBarRight.vue'
import SubMenu from '@/layout/components/Menu/SubMenu.vue'
import AppMain from '@/layout/components/AppMain.vue'
import useStore from '@/store'

const title = import.meta.env.VITE_APP_TITLE

const route = useRoute()
const { permission, setting } = useStore()
const accordion = computed(() => setting.accordion)
const isCollapse = computed(() => setting.isCollapse)

const menuList = computed(() => permission.showMenuList)
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string)
</script>

<style lang="scss">
@import './index.scss';
</style>
