// import request from '@/utils/request'
import { AxiosPromise } from 'axios'
const getRandomNum = (max = 0, min = 0): number => {
	return Math.floor(Math.random() * max + 1) + min
}
/**
 * 获取管理员列表
 * @data
 */
export function getAdminList(data: any): AxiosPromise {
	const orderTotal = 6999
	const { page, size } = data
	let length = size
	const base = (page - 1) * size
	if (page * size > orderTotal) {
		length = orderTotal - base
	}
	return new Promise(resolve => {
		const res = {
			total: orderTotal,
			data: Array.from({ length: length }).map((_, _i) => {
				const i = base + _i
				const rolesId = [0, 1, 2]
				const roles = [...new Set(Array.from({ length: getRandomNum(3) }).map(_ => rolesId[getRandomNum(2)]))]
				const num = getRandomNum(500)
				return {
					id: `id_${i}`,
					google_key: Math.random() > 0.5 ? 1 : 0,
					username: `lanceJiang_${i}`,
					add_time: '2020-09-09 05:20:50',
					describe: `${'我是描述我是描述我是描述内容内容内容内容内容内容内容内容-'.repeat(getRandomNum(5))}_${i}`,
					status: [0, 1, 2][i % 3],
					phone: [15012341203, 18958586868, ''][getRandomNum(2)],
					email: `lanceJiang${i}@gmail.com`,
					roles,
					price_ary: [
						{
							date: '2024-12-01',
							min: 100 + num,
							max: 100 + num
						},
						{
							date: '2025-01-01',
							min: 40 + num,
							max: 80 + num
						},
						{
							date: '2025-02-01',
							min: 90 + num,
							max: 160 + num
						},
						{
							date: '2025-03-01',
							min: 60 + num,
							max: 90 + num
						}
					]
				}
			})
		}
		setTimeout(() => {
			console.log('res', res)
			resolve(res as any)
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
