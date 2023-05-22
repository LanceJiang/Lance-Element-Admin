import { GeetConfig, LoginFormData, GoogleLoginData, LoginResponseData } from '@/types'
import request from '@/utils/request'
import { AxiosPromise } from 'axios'

/**
 * 登录
 * @param data
 */
export function login(data: LoginFormData): AxiosPromise<LoginResponseData> {
	return Promise.resolve({
		username: 'admin'
	})
	// return request({
	// 	url: '/login',
	// 	method: 'post',
	// 	data
	// })
}

/**
 * 谷歌验证
 * @param data
 */
export function googleLogin(data: GoogleLoginData): AxiosPromise {
	return Promise.resolve({
		token: 'admin_token'
	})
	// return request({
	// 	url: '/google',
	// 	method: 'post',
	// 	data,
	//   extraConfig: { showFullscreenLoading: true }
	// })
}

/**
 * 注销
 */
export function logout() {
	return request({
		url: '/登出todo',
		method: 'delete'
	})
}

/**
 * Geetest配置参数
 */
export function getGeetConfig(): AxiosPromise<GeetConfig> {
	return request({
		url: `/passport/getgeetestconfig?t=${+new Date()}`,
		method: 'get'
	})
}
