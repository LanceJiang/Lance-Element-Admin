// import request from '@/utils/request'
import { AxiosPromise } from 'axios'

/**
 * 获取管理员列表
 * @data
 */
export function getAdminList(data: any): AxiosPromise {
	const orderTotal = 99
	const { page, size } = data
	let length = size
	if (page * size > orderTotal) {
		length = orderTotal - (page - 1) * size
	}
	return new Promise(resolve => {
		const res = {
			total: orderTotal,
			data: Array.from({ length: length }).map((_, i) => {
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
		}
		setTimeout(() => {
			resolve(res)
		}, 1000)
	})
	// return request({
	// 	url: `/user/getlist`,
	// 	method: 'get',
	// 	params: data
	// })
}
