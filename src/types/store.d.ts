import { /*RouteRecordRaw,*/ RouteLocationNormalized } from 'vue-router'
// import { AppRouteRecordRaw } from '@/router/types'

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
	menuList: RouteMenu.Item[]
}

/**
 * 设置状态类型声明
 */
export interface SettingState {
	// 开启主题设置
	showSettings: boolean
	// 主题配置Visible
	settingsVisible: boolean
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
	// 灰色模式
	isGrey: boolean
	// 色弱模式
	isWeak: boolean
	// 开启水印
	isWatermark: boolean
	// 水印文案
	watermarkText: string
	// 侧边栏深色
	asideInverted: boolean
	// 头部深色
	headerInverted: boolean
	// 底部深色
	footerInverted: boolean
	// 多页签
	tabsVisible: boolean
	// 多页签Icon
	tabsIcon: boolean
	// 多页签风格
	tabsMode: string
	// 页面内容全屏
	contentMaximize: boolean
	// 手风琴
	accordion: boolean
	// 面包屑
	breadcrumb: boolean
	// 面包屑图标
	breadcrumbIcon: boolean
	// 页面切换动画
	animate: boolean
	// 页面切换动画类型
	/**
	 * 过渡动画类型
	 * - fade: 消退
	 * - fade-slide: 滑动
	 * - fade-bottom: 底部消退
	 * - fade-scale: 缩放消退
	 * - zoom-fade: 渐变
	 * - zoom-out: 闪现
	 */
	animateMode: 'fade' | 'fade-slide' | 'fade-bottom' | 'fade-scale' | 'zoom-fade' | 'zoom-out'
}
/**
 * 多页签状态类型声明
 */
export interface TagView extends Partial<RouteLocationNormalized> {
	title?: string
	meta?: {
		[key: string]: any
	}
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
