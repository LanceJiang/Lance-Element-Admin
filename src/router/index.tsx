import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { AppRouteRecordRaw } from './types'
import useStore from '@/store'

export const Layout = () => import('@/layout/index.vue')

const HOME_URL = '/dashboard'

// 参数说明: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
// 静态路由
export const sysStaticRouter: Array<AppRouteRecordRaw> = [
	{
		path: '/login',
		component: () => import('@/views/login/index.vue'),
		meta: { hidden: true }
	},
	// 主入口
	{
		path: '/',
		name: 'mainLayout',
		component: Layout,
		redirect: HOME_URL,
		// redirect: '/dashboard',
		children: [
			// 重定向
			{
				path: '/redirect/:path(.*)',
				meta: { hidden: true },
				component: () => import('@/views/redirect/index.vue')
			}
		]
	}
]

export const sysErrorRoutes = [
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
		// redirect: '/404',
		path: '/:pathMatch(.*)',
		component: () => import('@/views/error-page/404.vue'),
		meta: { hidden: true }
	}
]

export const constantRoutes: AppRouteRecordRaw[] = [
	// 首页
	{
		// path: '/dashboard',
		path: HOME_URL,
		component: () => import('@/views/dashboard/index.vue'),
		name: 'dashboard',
		meta: { title: 'dashboard', icon: 'icon-homepage', affix: true, parentName: 'mainLayout' }
	},
	// 用户中心
	{
		path: '/personal',
		component: () => import('@/views/personal/index.vue'),
		name: 'personal',
		meta: { title: 'personal', hidden: true, icon: 'le-account', parentName: 'mainLayout' } // 塞入 Layout route
	},
	// 外部链接
	{
		path: '/external-link',
		component: Layout,
		children: [
			{
				path: 'https://github.com/LanceJiang/Lance-Element-Admin',
				meta: { title: '外部链接', icon: 'icon-link' }
			}
		]
	},
	// 其他示例
	{
		path: '/components',
		component: Layout,
		redirect: '/index',
		children: [
			{
				path: 'index',
				component: () => import('@/views/components/index.vue'),
				name: 'comps',
				meta: { title: 'comps', icon: 'icon-excel' }
			}
		]
	},
	{
		path: '/form',
		component: Layout,
		// meta: { title: 'Form', icon: 'guide' },
		redirect: '/default',
		children: [
			{
				path: 'default',
				component: () => import('@/views/form/default.vue'),
				name: 'FormDefault',
				meta: { title: 'form', icon: 'icon-guide' }
			}
		]
	},
	{
		path: '/table',
		component: Layout,
		redirect: 'default',
		meta: { title: 'table', icon: 'icon-table' },
		children: [
			{
				path: 'default',
				component: () => import('@/views/table/default.vue'),
				name: 'TableDefault',
				meta: { title: 'table' /*, icon: 'table'*/ }
			},
			{
				path: 'multipleHeader',
				component: () => import('@/views/table/multipleHeader.vue'),
				name: 'multipleHeader',
				meta: { title: 'multipleHeader' }
			},
			{
				path: 'treeTable',
				component: () => import('@/views/table/treeTable.vue'),
				name: 'treeTable',
				meta: { title: 'treeTable' }
			},
			{
				path: 'mergeCells',
				component: () => import('@/views/table/mergeCells.vue'),
				name: 'mergeCells',
				meta: { title: 'mergeCells' }
			},
			{
				path: 'footerSummary',
				component: () => import('@/views/table/footerSummary.vue'),
				name: 'footerSummary',
				meta: { title: 'footerSummary' }
			},
			{
				path: 'expandTable',
				component: () => import('@/views/table/expandTable.vue'),
				name: 'expandTable',
				meta: { title: 'expandTable' }
			},
			{
				path: 'resizeParentHeightTable',
				component: () => import('@/views/table/resizeParentHeightTable.vue'),
				name: 'resizeParentHeightTable',
				meta: { title: 'resizeParentHeightTable' }
			}
		]
	}
	/*// 仅用于研发测试 START
	{
		path: '/test',
		component: Layout,
		// meta: {hidden: true, title: 'test', icon: 'system'},
		meta: { title: 'test', icon: 'system' },
		redirect: '/test/testSetup',
		children: [
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
	}
	// 仅用于研发测试 END*/
]

/**
 * local_permissionsMenuList: 每次有新的路由配置 请做好标注!!!
 * 本地 dev 调试 默认使用本地路由数据
 * (若想要调试 接口数据 请在 env.development.local 修改 VITE_APP_USE_LOCAL_ROUTES 不为 1即可)
 */
export const local_permissionsMenuList: Array<AppRouteRecordRaw> = [
	...constantRoutes,
	{
		// demo演示
		path: '/demo',
		component: 'Layout',
		redirect: '/demo/adminManage',
		meta: { title: 'demo', icon: 'icon-peoples' },
		children: [
			{
				// path: '/demo/pageConfig',
				path: 'pageConfig',
				// component: () => import('@/views/demo/pageConfig/index'),
				component: 'demo/pageConfig/index',
				name: 'pageConfig',
				meta: { title: 'demo_pageConfig', icon: 'le-fangda1' }
			},
			{
				// 管理员管理
				// path: '/demo/adminManage',
				path: 'adminManage',
				name: 'adminManage',
				component: 'demo/adminManage/index',
				meta: { title: 'demo_adminManage', icon: 'Setting' }
			}
		]
	},
	// 设置 权限
	{
		path: '/setting',
		component: 'Layout',
		meta: { title: '设置', icon: 'icon-swagger' },
		redirect: '/setting/user',
		children: [
			{
				path: 'user',
				// component: () => import('@/views/setting/user/index.vue'),
				component: 'setting/user/index',
				name: 'user',
				meta: { title: '用户管理', icon: 'icon-logo' } // 本地icon
			},
			{
				path: 'role',
				// component: () => import('@/views/setting/role/index.vue'),
				component: 'setting/role/index',
				name: 'role',
				meta: { title: '角色管理', icon: 'le-amazon' } // le-iconfont
			},
			{
				path: 'menu',
				// component: () => import('@/views/setting/menu/index.vue'),
				component: 'setting/menu/index',
				name: 'menu',
				meta: { title: '菜单管理', icon: 'PriceTag' } // element icons
			}
		]
	},
	{
		path: '/menuNested',
		name: 'menuNested',
		component: 'Layout',
		redirect: '/menuNested/menu1',
		meta: {
			icon: 'List',
			title: '菜单嵌套'
		},
		children: [
			{
				path: '/menuNested/menu1',
				name: 'menu1',
				component: 'menuNested/menu1/index',
				meta: {
					icon: 'Menu',
					title: '菜单1'
				}
			},
			{
				path: '/menuNested/menu2',
				name: 'menu2',
				redirect: '/menuNested/menu2/menu21',
				component: '',
				meta: {
					icon: 'Menu',
					title: '菜单2'
					// parentName: 'mainLayout'
				},
				children: [
					{
						path: '/menuNested/menu2/menu21',
						// path: 'menu21',
						name: 'menu21',
						component: 'menuNested/menu2/menu21/index',
						meta: {
							icon: 'Menu',
							title: '菜单2-1'
						}
					},
					...Array.from({ length: 50 }).map((_, i) => {
						return {
							path: '/menuNested/menu2/menu23' + i,
							name: 'menu23_' + i,
							component: 'menuNested/menu2/menu23/index',
							meta: {
								icon: 'Menu',
								title: '菜单2-3_' + i
							}
						}
					}),
					{
						path: '/menuNested/menu2/menu22',
						// path: 'menu22',
						name: 'menu22',
						redirect: '/menuNested/menu2/menu22/menu221',
						meta: {
							icon: 'Menu',
							title: '菜单2-2'
						},
						children: [
							{
								path: '/menuNested/menu2/menu22/menu221',
								// path: 'menu221',
								name: 'menu221',
								component: 'menuNested/menu2/menu22/menu221/index',
								meta: {
									icon: 'Menu',
									title: '菜单2-2-1'
								}
							},
							{
								path: '/menuNested/menu2/menu22/menu222',
								// path: 'menu222',
								name: 'menu222',
								component: 'menuNested/menu2/menu22/menu222/index',
								meta: {
									icon: 'Menu',
									title: '菜单2-2-2'
								}
							},
							...Array.from({ length: 50 }).map((_, i) => {
								return {
									path: '/menuNested/menu2/menu22/menu222' + i,
									// path: 'menu222',
									name: 'menu222_' + i,
									component: 'menuNested/menu2/menu22/menu222/index',
									meta: {
										icon: 'Menu',
										title: '菜单2-2-2' + i
									}
								}
							})
						]
					},
					{
						path: '/menuNested/menu2/menu23',
						// path: 'menu23',
						name: 'menu23',
						component: 'menuNested/menu2/menu23/index',
						meta: {
							icon: 'Menu',
							title: '菜单2-3'
						}
					} /*,
					...Array.from({length: 50}).map((_, i) => {
						return {
							path: '/menuNested/menu2/menu23' + i,
							name: 'menu23' + i,
							component: 'menuNested/menu2/menu23/index',
							meta: {
								icon: 'Menu',
								title: '菜单2-3' + i
							}
						}
					})*/
				]
			},
			{
				path: '/menuNested/menu3',
				name: 'menu3',
				component: 'menuNested/menu3/index',
				meta: {
					icon: 'Menu',
					title: '菜单3'
				}
			}
		]
	}
	// todo 请添加相关新路由描述
]

// 创建路由
const router = createRouter({
	history: createWebHashHistory(),
	routes: sysStaticRouter.concat(sysErrorRoutes) as RouteRecordRaw[],
	// 刷新时，滚动条位置还原
	scrollBehavior: () => ({ left: 0, top: 0 })
})

// 重置路由
export function resetRouter() {
	const { permission } = useStore()
	permission.showMenuListFlat.forEach(route => {
		const name = route.name
		if (name && router.hasRoute(name)) {
			router.removeRoute(name)
		}
	})
}

export default router
