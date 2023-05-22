import { PermissionState } from '@/types'
import { RouteRecordRaw } from 'vue-router'
import { defineStore } from 'pinia'
import { constantRoutes, noFoundRouters } from '@/router'
import { listRoutes } from '@/api/system/menu'
import { RouteItem } from '@/types'

const modules = import.meta.glob('../../views/**/**.vue')
export const Layout = () => import('@/layout/index.vue')

// const hasPermission = (roles: string[], route: RouteRecordRaw) => {
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

export const filterAsyncRoutes = (routes: RouteItem[], roles: string[]) => {
	const res: RouteRecordRaw[] = []
	routes.forEach(route => {
		const tmp = { ...route } as any
		// if (hasPermission(roles, tmp)) {
		// todo be delete
		// }
		// 特殊Layout 配置 标识
		if (tmp.component == 'Layout') {
			tmp.component = Layout
		} else {
			const component = modules[`../../views/${tmp.component}.vue`] as any
			if (component) {
				tmp.component = component
			} else {
				tmp.component = modules[`../../views/error-page/404.vue`]
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

const usePermissionStore = defineStore({
	id: 'permission',
	state: (): PermissionState => ({
		routes: [],
		addRoutes: []
	}),
	actions: {
		setRoutes(routes: RouteRecordRaw[]) {
			this.addRoutes = routes
			this.routes = constantRoutes.concat(routes, noFoundRouters)
		},
		generateRoutes(roles: string[]) {
			return listRoutes().then((data: any) => {
				const accessedRoutes = filterAsyncRoutes(data, roles)
				this.setRoutes(accessedRoutes)
				return accessedRoutes
			})
		}
	}
})

export default usePermissionStore
