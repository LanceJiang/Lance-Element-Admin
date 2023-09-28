import { PermissionState } from '@/types'
import { AppRouteRecordRaw } from '@/router/types'
// import { RouteRecordRaw } from 'vue-router'
import { defineStore } from 'pinia'
import { constantRoutes, noFoundRouters, constantMenuList } from '@/router'
import { getMenuList } from '@/api/system/menu'

const modules = import.meta.glob('@/views/**/*.vue')
export const Layout = () => import('@/layout/index.vue') // todo...
// export const Layout = () => import('@/layout/index_old.vue.vue')
export const Test = () => import('@/layout/test.vue')
// export const Layout = () => import('@/layouts/index.vue')

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

export const filterAsyncRoutes = (routes: AppRouteRecordRaw[], roles: string[]) => {
	const res: AppRouteRecordRaw[] = []
	routes.forEach(route => {
		const tmp = { ...route } as any
		// if (hasPermission(roles, tmp)) {
		// todo be delete
		// }
		// console.warn(tmp.component, 'tmp.component')
		// 特殊Layout 配置 标识
		if (!tmp.component) {
			tmp.component = Test
		} else if (/*!tmp.component || */ tmp.component == 'Layout') {
			tmp.component = Layout
		} else {
			const component = modules[`/src/views/${tmp.component}.vue`] as any
			console.error(component, 'component')
			if (component) {
				tmp.component = component
			} else {
				tmp.component = modules[`/src/views/error-page/404.vue`]
			}
		}
		res.push(tmp)

		// 递归
		if (tmp.children) {
			tmp.children = filterAsyncRoutes(tmp.children, roles)
		}
	})
	return res
}

// 过滤隐藏
const getShowMenuList = (menuList: AppRouteRecordRaw[], parentPath = '') => {
	return menuList.filter(item => {
		// console.error(item, 'item')
		item.meta = item.meta ? item.meta : {}
		// 默认icon
		item.meta.icon = item.meta.icon || 'menu'
		// path全链 重组
		item.path = /\/.*/.test(item.path) ? item.path : `${parentPath}/${item.path}`
		if (!item.meta.hidden) {
			item.children?.length && (item.children = getShowMenuList(item.children, item.path))
			return true
		}
		return false
	})
}

const usePermissionStore = defineStore({
	id: 'permission',
	state: (): PermissionState => ({
		routes: [],
		// 动态菜单
		menuList: []
	}),
	getters: {
		// 有效的 菜单列表
		showMenuList: state => getShowMenuList(JSON.parse(JSON.stringify([...constantMenuList, ...state.menuList])))
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
	},
	actions: {
		setRoutes(menuList: AppRouteRecordRaw[]) {
			// 授权后的菜单列表
			this.menuList = menuList
			this.routes = constantRoutes.concat(
				menuList,
				noFoundRouters /*, {
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
			}*/
			)
		},
		queryMenuList(roles: string[]) {
			return getMenuList().then((data: any) => {
				console.error(data, 'menuList')
				const menuList = filterAsyncRoutes(data, roles)
				console.warn(menuList, data, 'xxxxxxxxxxx')
				this.setRoutes(menuList)
				return menuList
			})
		}
	}
})

export default usePermissionStore
