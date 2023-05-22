import request from '@/utils/request'
import { AxiosPromise } from 'axios'

/**
 * 获取管理员列表
 * @data
 */
export function getAdminList(data): AxiosPromise {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve({
				total: 90,
				data: Array.from({ length: 90 }).map((_, i) => {
					return {
						username: `username_${i}`,
						add_time: '2020-09-09 05:20:50',
						describe: `describe_${i}`
					}
				})
			})
		}, 1000)
	})
	// return request({
	// 	url: `/user/getlist`,
	// 	method: 'get',
	// 	params: data
	// })
}

/**
 * 获取获取角色列表
 * @data
 */
export function getRoleList(data): AxiosPromise {
	return request({
		url: `/user/getrolelist`,
		method: 'get',
		params: data
	})
}

/**
 * 增加角色
 * @data
 */
export function addUser(data): AxiosPromise {
	return request({
		url: `/user/add`,
		method: 'post',
		data
	})
}
/**
 * 删除角色
 * @data
 */
export function DeleteUser(data): AxiosPromise {
	return request({
		url: `/user/del`,
		method: 'post',
		data
	})
}
/**
 *  设置角色状态
 * @data
 */
export function setUserStatus(data): AxiosPromise {
	return request({
		url: `/user/setstatus`,
		method: 'post',
		data
	})
}
/**
 *  设置谷歌验证
 * @data
 */
export function setGoogleKey(data): AxiosPromise {
	return request({
		url: `/user/unbindgoogleKey`,
		method: 'post',
		data
	})
}
/**
 *  修改用户方法
 * @data
 */
export function setChangeUser(data): AxiosPromise {
	return request({
		url: `/user/edit`,
		method: 'post',
		data
	})
}
