import router from '@/router'
import useStore from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { ls, $log } from '@/utils'
NProgress.configure({ showSpinner: false }) // 进度环显示/隐藏

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
				// const accessRoutes: any = await permission.generateRoutes(roles)
				const accessRoutes: any = await permission.generateRoutes([])
				accessRoutes.forEach((route: any) => {
					router.addRoute(route)
				})
				next({ ...to, replace: true })
			} catch (error) {
				// 移除 token 并跳转登录页
				await user.resetToken()
				$log(error, 'getUserInfo&generateRoutes: error')
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
