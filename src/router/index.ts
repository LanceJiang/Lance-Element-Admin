import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { AppRouteRecordRaw } from './types'
import useStore from '@/store'

export const Layout = () => import('@/layout/index.vue')

// 参数说明: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
// 静态路由
export const constantRoutes: Array<AppRouteRecordRaw> = [
	{
		path: '/redirect',
		component: Layout,
		meta: { hidden: true },
		children: [
			{
				path: '/redirect/:path(.*)',
				component: () => import('@/views/redirect/index.vue')
			}
		]
	},
	{
		path: '/login',
		component: () => import('@/views/login/index.vue'),
		meta: { hidden: true }
	},
	{
		path: '/404',
		component: () => import('@/views/error-page/404.vue'),
		meta: { hidden: true }
	},
	{
		path: '/401',
		component: () => import('@/views/error-page/401.vue'),
		meta: { hidden: true }
	},
	{
		path: '/',
		component: Layout,
		redirect: '/dashboard',
		children: [
			{
				path: 'dashboard',
				component: () => import('@/views/dashboard/index.vue'),
				name: 'Dashboard',
				meta: { title: 'dashboard', icon: 'homepage', affix: true }
			}
		]
	},
	{
		path: '/components',
		component: Layout,
		redirect: '/index',
		children: [
			{
				path: 'index',
				component: () => import('@/views/components/index.vue'),
				name: 'Comps',
				meta: { title: 'Comps', icon: 'excel' }
			}
		]
	},
	{
		path: '/form',
		component: Layout,
		redirect: '/default',
		children: [
			{
				path: 'default',
				component: () => import('@/views/form/default.vue'),
				name: 'Form',
				meta: { title: 'Form', icon: 'guide' }
			}
		]
	},
	// 仅用于研发测试 START
	{
		path: '/test',
		component: Layout,
		// meta: {hidden: true, title: 'test', icon: 'system'},
		meta: { title: 'test', icon: 'system' },
		redirect: '/test/testTable',
		children: [
			{
				path: 'testTable',
				component: () => import('@/views/test/testTable.vue'),
				name: 'testTable',
				meta: { title: 'testTable', icon: 'homepage' }
			},
			{
				path: 'testSetup',
				component: () => import('@/views/test/testSetup.vue'),
				name: 'testSetup',
				meta: { title: 'testSetup' }
			},
			{
				path: 'componentCommunication',
				component: () => import('@/views/test/componentCommunication/index.vue'),
				name: 'componentCommunication',
				meta: { title: '组件通信方式' }
			}
		]
	},
	// 仅用于研发测试 END
	// 外部链接
	{
		path: '/external-link',
		component: Layout,
		children: [
			{
				path: 'https://github.com/LanceJiang/vue3_element_admin',
				meta: { title: '外部链接', icon: 'link' }
			}
		]
	}
]

export const noFoundRouters = [
	{
		// redirect: '/404',
		path: '/:pathMatch(.*)',
		component: () => import('@/views/error-page/404.vue'),
		meta: { hidden: true }
	}
]

/**
 * devAllRouters: 每次有新的路由配置 请做好标注!!!
 * 本地 dev 调试 默认使用本地路由数据
 * (若想要调试 接口数据 请在 env.development.local 修改 VITE_APP_USE_LOCAL_ROUTES 不为 1即可)
 */
export const devAllRouters: Array<AppRouteRecordRaw> = [
	{
		// 人员管理
		// "value": 1,
		path: '/personManage',
		component: 'Layout',
		redirect: '/personManage/adminManage',
		meta: { title: 'personManage', icon: 'peoples' },
		children: [
			{
				// 管理员管理
				// value: 2,
				path: 'adminManage',
				name: 'adminManage',
				component: 'personManage/adminManage/index',
				meta: { title: 'person_adminManage' },
				children: []
			}
		]
	}

	// todo 请添加相关新路由描述
]

// 创建路由
const router = createRouter({
	history: createWebHashHistory(),
	routes: constantRoutes.concat(noFoundRouters) as RouteRecordRaw[],
	// 刷新时，滚动条位置还原
	scrollBehavior: () => ({ left: 0, top: 0 })
})

// 重置路由
export function resetRouter() {
	const { permission } = useStore()
	permission.routes.forEach(route => {
		const name = route.name
		if (name && router.hasRoute(name)) {
			router.removeRoute(name)
		}
	})
}

export default router
