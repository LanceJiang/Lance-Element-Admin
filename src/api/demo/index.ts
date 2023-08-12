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
	const base = (page - 1) * size
	if (page * size > orderTotal) {
		length = orderTotal - base
	}
	const roles = [
		{
			name: '超级管理员',
			id: 0
		},
		{
			name: '管理员',
			id: 1
		},
		{
			name: '成员',
			id: 2
		}
	]
	return new Promise(resolve => {
		const res = {
			total: orderTotal,
			data: Array.from({ length: length }).map((_, _i) => {
				const i = base + _i
				return {
					id: `id_${i}`,
					google_key: Math.random() > 0.5 ? 1 : 0,
					username: `username_${i}`,
					add_time: '2020-09-09 05:20:50',
					describe: `describe_${i}`,
					status: [0, 1, 2][i % 3],
					phone: [15012341203, 18958586868, ''][i % 3],
					email: `demo${i}@com.cn`,
					// roles: [[1, 2], [0, 1, 2], [2]][i % 3],
					roles: [[roles[1], roles[2]], [roles[0], roles[1], roles[2]], [roles[2]]][i % 3]
				}
			})
		}
		setTimeout(() => {
			console.log('res', res)
			resolve(res)
		}, 1000)
	})
	// return request({
	// 	url: `/user/getlist`,
	// 	method: 'get',
	// 	params: data
	// })
}
export function queryEdit(data: any) {
	return new Promise(resolve => {
		// console.warn(data, 'data')
		setTimeout(() => {
			resolve({ data: true, code: 200 })
		}, 1000)
	})
}
