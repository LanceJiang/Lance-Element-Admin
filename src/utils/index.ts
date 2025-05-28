// 工具函数集合
import { ElMessage } from 'element-plus'
// vue Storage 使用
export { ls } from './vueStorage'
import { get, set } from 'lodash-es'
import i18n from '@/lang/index'
import { useClipboard } from '@vueuse/core'
export type Arrayable<T> = T | T[]
// 多语言翻译
export const t = (key: string, ...args: any[]) => {
	if (!i18n) return key
	const hasKey = i18n.global.te(key)
	// eslint-disable-next-line
	// @ts-ignore
	return hasKey ? i18n.global.t(key, ...args) : key
}
export const getPropValue = <T = any>(
	obj: Record<string, any>,
	path: Arrayable<string>,
	defaultValue?: any
): { value: T } => {
	return {
		get value() {
			return get(obj, path, defaultValue)
		},
		set value(val: any) {
			set(obj, path, val)
		}
	}
}

/**
 * 提取深层数据的值 (防止中间项 不存在导致的报错)
 * @param obj 【检测对象】
 * @param keyArr 【需要获取该对象内部数据key数组】
 * @returns {*}
 */
export function getDeepValue(obj: object | string[] | any, keyArr: (string | number)[]) {
	return keyArr.reduce((acc, key) => acc && acc[key], obj)
}

/**
 * 针对本地开发 console.log 添加颜色打印
 */
export const $log = (function () {
	const isDEV = import.meta.env.DEV // 开发环境
	if (!isDEV) {
		// eslint-disable-next-line
		// @ts-ignore
		return (content: any = 'content', title = 'title', background = '#007bfc') => {}
	}
	return (content: any = 'content', title = 'title', background = '#007bfc') => {
		content = typeof content === 'object' ? JSON.stringify(content) : content
		console.log.apply(null, [
			`%c ${title}： %c ${content} `,
			'padding: 1px; border-radius: 10px; color: #fff; background: #9159B2;',
			`padding: 1px; border-radius: 10px; color: #fff; background: ${background};`
		])
	}
})()

/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟毫秒数
 * @param immediate boolean 立即执行
 */
export function debounce(func: () => any, wait: number, immediate?: boolean) {
	let timeout: any
	const _clear = () => {
		clearTimeout(timeout)
		timeout = null
	}
	return function () {
		/* eslint-disable */
		// @ts-ignore
		const context = this
		const args: any = arguments
		/* eslint-enable */
		const bool = !timeout
		if (immediate && bool) func.apply(context, args)
		if (timeout) _clear()
		timeout = setTimeout(function () {
			func.apply(context, args)
		}, wait)
		if (bool) _clear()
	}
}
/**
 * @desc 函数节流
 * @param func 函数
 * @param wait number 延迟毫秒数
 * @param immediate boolean 立即执行
 */
export function throttle(func: (e: any) => any, wait: number, immediate?: boolean) {
	let t_start = 0
	return function () {
		/* eslint-disable */
		// @ts-ignore
		const args: any = arguments
		/* eslint-enable */
		if (!t_start) {
			t_start = +new Date()
			if (immediate) func.apply(this, args)
		}
		const t_end = +new Date()
		if (t_end - t_start >= wait) {
			func.apply(this, args)
			t_start = t_end
		}
	}
}
/**
 * 深层数据的集合进行有机合并
 * @param objs 需要合并的 对象集合 （后面的覆盖前面的参数）
 * @returns {{}}
 */
export const objDeepMerge = (...objs: any[]) => {
	const res: any = {}
	const combine = (opt: any) => {
		for (const prop in opt) {
			// eslint-disable-next-line
			if (opt.hasOwnProperty(prop)) {
				if (Object.prototype.toString.call(opt[prop]) === '[object Object]') {
					res[prop] = objDeepMerge(res[prop], opt[prop])
				} else {
					res[prop] = opt[prop]
				}
			}
		}
	}
	objs.map(opts => {
		combine(opts)
	})
	return res
}

// /**
//  * 复制文字
//  * @param val
//  * @param sucTxt
//  * @returns {boolean}
//  */
/*export function copyText(val: string, sucTxt = '复制成功~') {
	const textarea: any = document.createElement('textarea')
	// 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
	textarea.readOnly = 'readonly'
	textarea.style.position = 'absolute'
	textarea.style.left = '-9999px'
	textarea.value = val
	document.body.appendChild(textarea)
	textarea.select()
	const res = document.execCommand('copy')
	document.body.removeChild(textarea)
	// console.log(res, 'res 测试............')
	if (res) {
		ElMessage.success(sucTxt)
	}
	return res
}*/

/**
 * 复制文字
 * @param text
 */
export async function copyText(text: string) {
	const { copy, copied, isSupported } = useClipboard({ legacy: true })
	if (!isSupported) {
		// 复制失败
		ElMessage.error(t('le.message.CopyFailure'))
	} else {
		await copy(text)
		if (copied.value) {
			// message.success('复制成功~')
			ElMessage.success(t('le.message.CopiedSuccessfully'))
		}
	}
}

/**
 * 异步操作避免重复触发加锁
 * @param syncFn
 * @returns {(function(...[*]): Promise<void>)|*}
 */
export function asyncHandlerLockWrap(syncFn: () => any) {
	let is_lock = false
	/* eslint-disable */
	// @ts-ignore
	return async function (...args) {
		// @ts-ignore
		const context = this
		if (!is_lock) {
			is_lock = true
			Promise.resolve()
				// @ts-ignore
				.then(syncFn.bind(context, ...args))
				.finally(() => {
					is_lock = false
				})
		}
	}
	/* eslint-enable */
}

/**
 * 转化成带逗号的number格式
 * @param num
 * @param minimumFractionDigits 保留小数位
 * @returns {string}
 */
export function formatNumber(num: number | string, minimumFractionDigits = 0) {
	// return xeUtils.commafy(+num, { digits: minimumFractionDigits }) || '-'
	return (+num || 0).toLocaleString('zh', { minimumFractionDigits })
}
/*
const sortColumnChildren = (localColumn: LeTableColumnProps[], targetColumn: LeTableColumnProps[], localField = 'prop', targetField = 'prop') => {
	const cur_children = localColumn.children
	if (Array.isArray(cur_children) && Array.isArray(targetColumn.children)) {
		// console.error(JSON.stringify(cur_children), 'cur_children   targetColumn_children', JSON.stringify(targetColumn.children))
		// children 排序
		localColumn.children = targetColumn.children
			.map(_column => {
				const findColumn = cur_children.find(l_column => l_column[localField] === _column[targetField])
				if (findColumn) {
					if (Array.isArray(findColumn.children)) {
						return sortColumnChildren(findColumn, _column, localField)
					}
					return findColumn
				}
				return false
			})
			.filter(Boolean)
	}
	return localColumn
}
export function updateNewColumns(localColumns: LeTableColumnProps[], targetColumn: LeTableColumnProps[], localField = 'prop', targetField = 'prop') {
	return localColumns
		.map(v => {
			const cur = targetColumn.find((column) => column[localField] === v[targetField])
			if (cur) {
				// children 内嵌处理
				return sortColumnChildren(cur, v)
			}
		})
		.filter(Boolean)
}
*/

// 判断是否为小屏 同 theme.screens.mobile
export const isMobile = () => {
	const userAgent = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
	const screenCheck = window.matchMedia('only screen and (max-width: 750px)').matches
	return userAgent || screenCheck // window.innerWidth <= 750
}
