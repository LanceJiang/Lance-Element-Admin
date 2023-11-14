import { PermissionState } from '@/types'
import { AppRouteRecordRaw } from '@/router/types'
// import { RouteRecordRaw } from 'vue-router'
import { defineStore } from 'pinia'
// import { sysStaticRouter, noFoundRouters, constantMenuList } from '@/router'
import { getMenuList } from '@/api/system/menu'

const modules = import.meta.glob('@/views/**/*.vue')
export const Layout = () => import('@/layout/index.vue') // todo...
// export const Layout = () => import('@/layout/index_old.vue.vue')
export const RouteView = () => import('@/layout/RouteView.vue')

// const hasPermission = (roles: string[], route: AppRouteRecordRaw) => {
// 	if (route.meta && route.meta.roles) {
// 		if (roles.includes('ROOT')) {
// 			return true
// 		}
// 		return roles.some(role => {
// 			if (route.meta?.roles !== undefined) {
// 				return (route.meta.roles as string[]).includes(role)
// 			}
// 		})
// 	}
// 	return false
// }

export const filterAsyncRoutes = (routes: AppRouteRecordRaw[], roles: string[], parentPath = '') => {
	const res: AppRouteRecordRaw[] = []
	routes.forEach(route => {
		const tmp = { ...route } as AppRouteRecordRaw
		tmp.meta = tmp.meta ? tmp.meta : {}
		// 默认icon
		tmp.meta.icon = tmp.meta.icon || 'menu'
		// path全链 重组
		// tmp.path = /\/.*/.test(tmp.path) ? tmp.path : `${parentPath}/${tmp.path}`
		tmp.path = /\/.+/.test(tmp.path) ? tmp.path : `${parentPath}/${tmp.path}`
		// if (hasPermission(roles, tmp)) {
		// todo be delete
		// }
		// console.warn(tmp.component, 'tmp.component')
		// 特殊Layout 配置 标识
		if (!tmp.component) {
			tmp.component = RouteView
		} else if (typeof tmp.component === 'string') {
			if (/*!tmp.component || */ tmp.component == 'Layout') {
				tmp.component = Layout
			} else {
				const component = modules[`/src/views/${tmp.component}.vue`] as any
				// console.error(component, 'component')
				if (component) {
					tmp.component = component
				} else {
					tmp.component = modules[`/src/views/error-page/404.vue`]
				}
			}
		}
		res.push(tmp)

		// 递归
		if (tmp.children) {
			tmp.children = filterAsyncRoutes(tmp.children, roles, tmp.path)
		}
	})
	return res
}

/**
 * getFlatMenuList_1children 单child 菜单扁平优化
 * 针对：children 只有一个child 的 进行菜单优化
 */
const getFlatMenuList_1children = (menuList: AppRouteRecordRaw[]) => {
	return menuList.reduce((res, v) => {
		// 过滤掉隐藏
		if (v.meta?.hidden) return res
		const children = v.children
		if (Array.isArray(children) && children.length) {
			if (children.length === 1) {
				const child0 = children[0]
				// delete v.children
				res.push({
					...child0,
					path: /\/.*/.test(child0.path) ? child0.path : v.name !== 'mainLayout' ? `${v.path}/${child0.path}` : `/${child0.path}`
				})
			} else {
				res.push({
					...v,
					children: getFlatMenuList_1children(v.children as AppRouteRecordRaw[])
				})
			}
		} else {
			res.push(v)
		}
		return res
	}, [] as AppRouteRecordRaw[])
}

// 过滤隐藏
// const getShowMenuList = (menuList: AppRouteRecordRaw[], parentPath = '') => {
const getShowMenuList = (menuList: AppRouteRecordRaw[]) => {
	return menuList.filter(item => {
		// console.error(item, 'item')
		if (!item.meta.hidden) {
			// item.children?.length && (item.children = getShowMenuList(item.children, item.path))
			item.children?.length && (item.children = getShowMenuList(item.children))
			return true
		}
		return false
	})
}
// 可展示的路由平铺
const getMenuListFlat = (menuList: AppRouteRecordRaw[]) => {
	const _menuList = JSON.parse(JSON.stringify(menuList))
	return _menuList.flatMap((v: AppRouteRecordRaw) => {
		const _children = v.children || []
		return [v, ...getMenuListFlat(_children)]
	})
}

const usePermissionStore = defineStore({
	id: 'permission',
	state: (): PermissionState => ({
		// routes: [],
		// 动态菜单
		menuList: []
	}),
	getters: {
		// 有效的 菜单列表
		// showMenuList: state => getShowMenuList(JSON.parse(JSON.stringify([...constantMenuList, ...state.menuList]))),
		showMenuList: state => getShowMenuList(JSON.parse(JSON.stringify(state.menuList))),
		/*getShowMenuList([
				...JSON.parse(JSON.stringify(state.menuList)),
				// 测试
				{
					path: 'dashboard',
					// path: HOME_URL,
					component: () => import('@/views/dashboard/index.vue'),
					name: 'dashboard',
					meta: { title: 'dashboard', icon: 'icon-homepage', affix: true }
				}
			])*/
		// showMenuList: state => getShowMenuList(JSON.parse(JSON.stringify(state.routes)))
		// 菜单权限列表 ==> 扁平化之后的一维数组菜单，主要用来添加动态路由
		showMenuListFlat() {
			// console.error(state, 'test...', this)
			return getMenuListFlat(this.showMenuList)
		}
	},
	actions: {
		setRoutes(menuList: AppRouteRecordRaw[]) {
			// 授权后的菜单列表 对单个的 children 菜单减级优化
			this.menuList = getFlatMenuList_1children(menuList)
			// menuList
			/*this.routes = menuList
			sysStaticRouter.concat(
				menuList,
				noFoundRouters /!*, {
				// 管理员管理
				path: '/adminManage1',
				name: 'adminManage1',
				// component: 'demo/adminManage/index',
				// component: 'demo/adminManage/index',
				component: modules[`/src/views/${'demo/adminManage/index'}.vue`],
				// const  = modules[`/src/views/${tmp.component}.vue`] as any
				// if (component) {
				// 	tmp.component = component
				meta: { title: 'demo_adminManage' }
			}*!/
			)*/
		},
		queryMenuList(roles: string[]) {
			return getMenuList().then((data: any) => {
				console.error(data, 'get api menuList')
				const menuList = filterAsyncRoutes(data, roles)
				// console.warn(menuList, data, 'xxxxxxxxxxx')
				this.setRoutes(menuList)
				return menuList
			})
		}
	}
})

export default usePermissionStore
