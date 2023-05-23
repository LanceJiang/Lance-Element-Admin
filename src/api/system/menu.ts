import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { devAllRouters } from '@/router'

/**
 * 获取路由列表
 */
export function listRoutes(): AxiosPromise {
	const isRequestAsyncRoutes = true // import.meta.env.VITE_APP_USE_LOCAL_ROUTES === '1'
	// 请求本地路由配置
	if (isRequestAsyncRoutes) {
		// eslint-disable-next-line
		// @ts-ignore
		return Promise.resolve(devAllRouters)
	}
	return request({
		url: '/index/menu',
		method: 'get',
		extraConfig: { showFullscreenLoading: true }
	})
}
