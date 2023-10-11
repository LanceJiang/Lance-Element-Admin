import type { RouteRecordRaw, RouteMeta } from 'vue-router'
// import { RoleEnum } from '@/enums/roleEnum'
import { defineComponent } from 'vue'

export type Component<T = any> = ReturnType<typeof defineComponent> | (() => Promise<typeof import('*.vue')>) | (() => Promise<T>)

export interface MetaProps {
	// 标题
	title?: string
	// 图标
	/**
	 * 关于icon 描述：
	 * 	// 1.来自本地src/assets/icons 的svg: 'icon-[dir]-[name]'
	 * 	// 2.le-iconfont svg 链接: 'le-[name]'
	 * 	// 3. 匹配不到icon- & le- 默认element
	 */
	icon?: string
	// 隐藏菜单
	hidden?: boolean
	// 是否固定
	affix?: boolean
	// 不缓存路由
	noCache?: boolean
	// 当前路由配置添加到 哪个父级: router.addRoute([parentName], route)
	parentName?: string

	// todo???
	activeMenu?: string
	// // todo???
	// roles?: string[]
}
// eslint-disable-next-line
// @ts-ignore
export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
	name?: string
	meta?: MetaProps
	component?: Component | string
	components?: Component
	children?: AppRouteRecordRaw[]
	// props?: Recordable
	fullPath?: string
}

export interface MenuTag {
	type?: 'primary' | 'error' | 'warn' | 'success'
	content?: string
	dot?: boolean
}

export interface Menu {
	name: string

	icon?: string

	path: string

	// path contains param, auto assignment.
	paramPath?: string

	disabled?: boolean

	children?: Menu[]

	orderNo?: number

	// roles?: RoleEnum[]

	meta?: Partial<RouteMeta>

	tag?: MenuTag

	hideMenu?: boolean
}

export interface MenuModule {
	orderNo?: number
	menu: Menu
}

// export type AppRouteModule = RouteModule | AppRouteRecordRaw;
export type AppRouteModule = AppRouteRecordRaw
