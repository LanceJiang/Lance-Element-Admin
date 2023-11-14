import router from '@/router'
import useStore from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { ls, $log } from '@/utils'
NProgress.configure({ showSpinner: false }) // 进度环显示/隐藏
// const modules = import.meta.glob('@/views/**/*.vue')

// 白名单路由
const whiteList = ['/recordPoint'] // todo 白名单过滤列表
// eslint-disable-next-line
// @ts-ignore
router.beforeEach(async (to, from, next) => {
	NProgress.start()
	// 白名单不做拦截
	if (whiteList.indexOf(to.path) !== -1) {
		next()
		return NProgress.done()
	}
	const { user, permission } = useStore()
	// const hasToken = user.token
	const hasToken = ls.get('token')
	// 登录页特殊处理
	if (to.path === '/login') {
		// 登录成功，跳转到首页(特)
		hasToken ? next({ path: '/' }) : next()
		return NProgress.done()
	}
	// 业务路由跳转
	if (hasToken) {
		const isLogin = user.isLogin
		if (isLogin) {
			next()
		} else {
			try {
				await user.getUserInfo()
				// const roles = user.roles
				// const accessRoutes: any = await permission.queryMenuList(roles)
				const accessRoutes: any = await permission.queryMenuList([])
				// 单独处理 菜单实体路径
				accessRoutes.forEach((route: any) => {
					// console.error(route, 'route....', route.meta?.parentName)
					if (route.meta?.parentName) {
						router.addRoute(route.meta.parentName, route)
					} else {
						router.addRoute(route)
					}
				})
				/*router.addRoute('testLayout', {
					// 管理员管理
					path: 'adminManage1',
					name: 'adminManage1',
					// component: 'demo/adminManage/index',
					// component: 'demo/adminManage/index',
					component: modules[`/src/views/${'demo/adminManage/index'}.vue`],
					// const  = modules[`/src/views/${tmp.component}.vue`] as any
					// if (component) {
					// 	tmp.component = component
					meta: { title: 'demo_adminManage' }
				})*/
				/*router.addRoute('testLayout', {
					// demo演示
					path: '/demo2',
					// component: 'Layout',
					component: () => import('@/layout/index.vue'),
					redirect: '/demo/adminManage',
					meta: { title: 'demo', icon: 'peoples' },
					children: [
						{
							path: 'pageConfig2',
							component: () => import('@/views/demo/pageConfig/index'),
							// component: 'demo/pageConfig/index',
							name: 'pageConfig2',
							meta: { title: 'demo_pageConfig' }
						},
						{
							// 管理员管理
							path: 'adminManage2',
							name: 'adminManage2',
							// component: 'demo/adminManage/index',
							component: () => import('@/views/demo/adminManage/index'),
							meta: { title: 'demo_adminManage' }
						}
					]
				})*/
				next({ ...to, replace: true })
			} catch (error) {
				// 移除 token 并跳转登录页
				await user.resetToken()
				$log(error, 'getUserInfo&queryMenuList: error')
				next(`/login?redirect=${to.path}`)
			}
			NProgress.done()
		}
	} else {
		// 跳转登录页添加登录完成重定向path
		next(`/login?redirect=${to.path}`)
		NProgress.done()
	}
})

/**
 * @description 路由跳转错误
 * */
router.onError(error => {
	NProgress.done()
	console.error('路由错误:', error)
})

/**
 * @description 路由跳转结束
 * */
router.afterEach(() => {
	NProgress.done()
})
