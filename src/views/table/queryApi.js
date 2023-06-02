const orderTotal = 876543
// 列表数据
export const getOrders = input => {
	// 模拟参数
	const { page, size } = input
	return new Promise(resolve => {
		let length = size
		if (page * size > orderTotal) {
			length = orderTotal - (page - 1) * size
		}
		setTimeout(() => {
			// 模拟数据
			const res = {
				data: Array.from({ length }).map((_, i) => {
					return {
						priceValue: 10000 + i,
						currency: 'USD or CNY',
						orderNo: `orderNo_${i}`,
						local_user: `local_user_${i}`,
						test_2: `test_2_${i}`,
						testDeep: {
							deep2: {
								deep3: 'testDeep>2>3后的' + i
							}
						}
					}
				})
			}
			resolve(res.data)
		}, 1000 * Math.random())
	})
}
// 列表count 总数
export const getOrdersCount = input => {
	return new Promise(resolve => {
		setTimeout(() => {
			// 模拟数据
			const res = {
				total: orderTotal
			}
			resolve(res.total)
		}, 1000 * Math.random())
	})
}
export const get_multipleHeaderList = input => {
	// 模拟参数
	const { page, size } = input
	const total = 500
	return new Promise(resolve => {
		let length = size
		if (page * size > total) {
			length = total - (page - 1) * size
		}
		setTimeout(() => {
			// 模拟数据
			const res = {
				data: {
					list: Array.from({ length }).map((_, i) => {
						const caseTotal = Math.floor(Math.random() * 200)
						const invalidNum = Math.floor(Math.random() * caseTotal)
						const validNum = caseTotal - invalidNum
						return {
							projectName: `项目` + i,
							areaName: `所在区域 ${i - 1}`,
							caseTotal,
							invalidNum,
							validNum
						}
					}),
					total
				}
			}
			resolve(res.data)
		}, 1000 * Math.random())
	})
}

export const get_treeList = input => {
	// 模拟参数
	const { page, size } = input
	const total = 500
	return new Promise(resolve => {
		let length = size
		if (page * size > total) {
			length = total - (page - 1) * size
		}
		setTimeout(() => {
			// 模拟数据
			const res = {
				data: {
					list: Array.from({ length }).map((_, i) => {
						return {
							id: i,
							date: '2016-05-01',
							name: `葫芦娃_${i}`,
							address: `洛杉矶格罗夫街 189_${i} 号`,
							children:
								Math.random() > 0.5
									? Array.from({ length: i + 1 }).map((_, _i) => {
											return {
												id: `${i}_${_i}`,
												date: '2018-06-01',
												name: `猪妖__${_i}`,
												address: `浪浪山 666_${i} 号`,
												hasChildren: Math.random() > 0.5
											}
									  })
									: undefined
						}
					}),
					total
				}
			}
			resolve(res.data)
		}, 1000 * Math.random())
	})
}
export const get_priceList = input => {
	// 模拟参数
	const { page, size } = input
	const total = 500
	return new Promise(resolve => {
		let length = size
		if (page * size > total) {
			length = total - (page - 1) * size
		}
		// console.error('length', length)
		setTimeout(() => {
			// 模拟数据
			const res = {
				data: {
					list: Array.from({ length }).map((_, i) => {
						return {
							id: i,
							date: '2016-05-01',
							name: `牛爷爷_${i}`,
							address: `火焰山 189_${i} 号`,
							amount1: 1111 + i,
							amount2: 222 + i,
							amount3: 333 + i,
							amount4: `444${i}`
						}
					}),
					total
				}
			}
			resolve(res.data)
		}, 1000 * Math.random())
	})
}

// 当前类型列表配置获取
export const getTableConfig = (input = {}) => {
	// 请求参数拟定
	/* const params = {
    type: '表格类型唯一值标记',
    system: '系统标记'
  } */
	return new Promise(resolve => {
		setTimeout(() => {
			// 模拟数据
			const res = {
				search: '?selectedView=active&saved_search_id=2323836698791',
				tabs: [
					...Array.from({ length: 20 }).map((_, i) => {
						return {
							key: 'oms_test_001',
							id: `b8b778c${i}`,
							name: 'test-name_' + i, // tabName
							// searchParams
							filters: {
								pattern: `input 搜索_${i}`,
								input: `testInput_${i}`
							},
							/* t_label: String, // 多语言关键key
              label?: String, // 若不存在t_label 可使用 label
              [valueKey]: String, // valueKey 用于 作为唯一值鉴定用 todo delete
              checked: Boolean, // 是否选中 todo delete
              disabled?: Boolean, // disabled 的不允许删除 todo delete
              fixed?: Boolean || String, // disabled 的不允许删除 (disabled -> fixed)
              children?: Option[] // 同上配置 */
							columns: [
								{
									prop: 'action',
									t_label: 'le.table.action',
									fixed: 'right' // boolean string
								},
								{
									prop: 'priceValue',
									label: 'slotPrice'
									// fixed: true // boolean string
								},
								{
									prop: 'orderNo',
									t_label: 'outboundOrder.table.orderNo'
									// fixed: true // boolean string
								},
								{
									// 模拟 columns被调整后 label 被更改的字段 (校验 数据是否会转换为新值)
									prop: 'local_user',
									t_label: 'outboundOrder.table.userOld'
									// fixed: true // boolean string
								},
								{
									prop: 'orderNo2',
									t_label: 'outboundOrder.table.orderNo2'
									// fixed: true // boolean string
								}
							]
						}
					})
				]
			}
			resolve(res)
		}, 1000 * Math.random())
	})
}
