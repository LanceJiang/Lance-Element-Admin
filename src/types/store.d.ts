import { /*RouteRecordRaw,*/ RouteLocationNormalized } from 'vue-router'
import { AppRouteRecordRaw } from '@/router/types'

/**
 * 用户状态类型声明
 */
export interface AppState {
	device: string
	sidebar: {
		opened: boolean
		withoutAnimation: boolean
	}
	language: string
	size: string
}

/**
 * 权限类型声明
 */
export interface PermissionState {
	routes: AppRouteRecordRaw[]
	menuList: AppRouteRecordRaw[]
}

/**
 * 设置状态类型声明
 */
export interface SettingState {
	// 展示设置
	showSettings: boolean
	// 展示底部
	footer: boolean
	// 折叠菜单
	isCollapse: boolean
	// 布局模式
	layout: string
	// 主题颜色
	themeColor: string
	// 暗黑主题
	isDark: boolean
	// 侧边栏深色
	asideInverted: boolean
	// 头部深色
	headerInverted: boolean
	// 底部深色
	footerInverted: boolean
	// 开启 Tags-View
	tagsView: boolean
	// 固定 Header
	fixedHeader: boolean
	// 侧边栏 Logo
	sidebarLogo: boolean
	// 手风琴
	accordion: boolean
}

/**
 * 标签状态类型声明
 */
export interface TagView extends Partial<RouteLocationNormalized> {
	title?: string
}

export interface TagsViewState {
	visitedViews: TagView[]
	cachedViews: string[]
}

/**
 * 用户状态类型声明
 */
export interface UserState {
	token: string
	nickname: string
	avatar: string
	roles: string[]
	perms: string[]
	loginQuery: object
	isLogin: boolean
}
