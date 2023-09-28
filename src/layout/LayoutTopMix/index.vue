<!-- 顶部菜单混合模式:topMix -->
<template>
	<el-container class="layout-wrap--topMix">
		<el-header>
			<div class="header-lf mask-image">
				<div class="logo">
					<!--          <SvgIcon class="logo-img sidebar-logo" icon-class="logo" />-->
					<img class="logo-img" src="@/assets/icons/logo.svg" alt="logo" />
					<span :title="title" class="logo-text text-overflow_ellipsis">{{ title }}</span>
				</div>
				<ToolBarLeft />
			</div>
			<ToolBarRight class="header-ri" />
		</el-header>
		<el-container class="topMix-content">
			<el-aside class="aside-box" :style="{ width: isCollapse ? '65px' : '210px' }">
				<el-scrollbar>
					<el-menu class="layout-menu-wrap" :router="false" :default-active="activeMenu" :collapse="isCollapse" :unique-opened="accordion" :collapse-transition="false">
						<SubMenu :menu-list="menuList" />
					</el-menu>
				</el-scrollbar>
			</el-aside>
			<el-container class="topMix-main">
				<AppMain />
			</el-container>
		</el-container>
	</el-container>
</template>

<script setup lang="ts" name="layoutTopMix">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppMain from '@/layout/components/AppMain.vue'
import SubMenu from '@/layout/components/Menu/SubMenu.vue'
import ToolBarLeft from '@/layout/components/Header/ToolBarLeft.vue'
import ToolBarRight from '@/layout/components/Header/ToolBarRight.vue'
import useStore from '@/store'

const title = import.meta.env.VITE_APP_TITLE
const { permission, setting } = useStore()

const route = useRoute()
const accordion = computed(() => setting.accordion)
const isCollapse = computed(() => setting.isCollapse)
const menuList = computed(() => permission.showMenuList)
const activeMenu = computed(() => (route.meta?.activeMenu ? route.meta.activeMenu : route.path) as string)
</script>

<style lang="scss">
@import './index.scss';
</style>
