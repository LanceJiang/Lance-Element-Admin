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
						id: `id_${i}`,
						google_key: Math.random() > 0.5 ? 1 : 0,
						username: `username_${i}`,
						add_time: '2020-09-09 05:20:50',
						describe: `describe_${i}`,
						roles: [{
							id: `roles_${i}_1`,
							name: `roleName_${i}_1`
						}]
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
