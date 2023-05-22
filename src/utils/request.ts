import axios, { AxiosError } from 'axios'
import { AxiosInstance, AxiosRequestConfig, AxiosResponse, ExtraConfig } from './request.d'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { ls, debounce } from '@/utils'
import router from '@/router'
import useStore from '@/store'
// ElLoading service 创建的单例
let loading: any = null
// 创建axios实例
const axiosInstance: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_APP_BASE_API, // api 的 base_url
	timeout: 50000 // 请求超时时间
})

// token 过期
const tokenLoseHandler = debounce(
	function () {
		// const { user } = useStore()
		ls.clear() // 清除浏览器全部缓存
		router.push('/login')
		ElMessageBox.alert('当前页面已失效，请重新登录', '提示', {})
	},
	3000,
	true
)
// 判断是否配置加载 页面级别Loading 执行相关操作
const showFullPageLoadingHandler = (config: AxiosRequestConfig, cb: () => any) => {
	const extraConfig: ExtraConfig = config.extraConfig || {}
	const bool = extraConfig.showFullscreenLoading || false
	bool && cb && cb()
}
// request 拦截器
axiosInstance.interceptors.request.use(
	(config: AxiosRequestConfig) => {
		if (!config.headers) {
			throw new Error(`Expected 'config' and 'config.headers' not to be undefined`)
		}
		const token = ls.get('token')
		// const { token } = useStore().user
		// 让每个请求携带自定义token 请根据实际情况自行修改
		if (!config.headers['Authorization'] && token) {
			config.headers['Authorization'] = `Bearer ${token}`
		}
		showFullPageLoadingHandler(config, () => {
			// 目前只有两种语言 若有新增 请另外处理 todo...
			const text = useStore().app.language === 'zh-cn' ? '加载中...' : 'Loading...'
			loading = ElLoading.service({
				// lock: true,
				text,
				background: 'rgba(0, 0, 0, 0.3)'
			})
		})
		return config
	},
	(error: any) => {
		return Promise.reject({ from: 'request_error', response: error })
	}
)
// let testTimeOut = null
// response 拦截器
axiosInstance.interceptors.response.use(
	async (response: AxiosResponse) => {
		const { extraConfig = {} } = response.config
		showFullPageLoadingHandler(response.config, () => {
			loading.close()
		})
		/* eslint-disable */
		// @ts-ignore
		let { code, msg, data } = response.data || {}
		/* eslint-enable */
		if (code === 200) {
			/**配置有 responseAll 将会返回 接口整体数据 默认返回 接口返回 对象.data*/
			return extraConfig.responseAll ? response.data : data
		} else {
			if (code === 4100) {
				tokenLoseHandler()
			} else {
				ElMessage({
					message: msg || '系统出错',
					type: 'error'
				})
			}
			return Promise.reject({ from: 'response_success:code!=200', response })
		}
	},
	(error: AxiosError) => {
		// eslint-disable-next-line
		// @ts-ignore
		const response: AxiosResponse = error.response || {}
		const { data } = response
		showFullPageLoadingHandler(error.config || {}, () => {
			loading.close()
		})
		if (!error.response || !data) {
			let msg = '未知错误,请联系管理员'
			// 请求超时状态
			if (error.message.includes('timeout')) {
				msg = '请求超时,请检查网络是否连接正常'
			}
			ElMessage.error(msg)
			return Promise.reject({ from: 'response_error:no_res||no_res.data', response })
		}
		const { code, msg } = data
		// /** 如果是通过 transformResponse 对 data 自定义 */
		// if (data.isCustomize === true) {
		//   return Promise.reject(error.response)
		// }
		if (code === 4100) {
			tokenLoseHandler()
		} else {
			const _statusText: any = {
				4000: '业务相关错误代码',
				4100: '授权token已过期,请重新登录',
				4101: '谷歌验证失败'
			}
			ElMessage({
				message: msg || data.message || _statusText[code] || '系统出错!',
				type: 'error'
			})
			return Promise.reject({ from: 'response_error:code!=200', response })
		}
	}
)

// 导出 axios 实例
export default axiosInstance
// 用于 数据 取消上次请求绑定 使用
export const CancelToken = axios.CancelToken

// import request from '@/utils/request'
//
// //列表
// export function getList(params) {
//   return request({
//     url: '/api/getList',
//     method: 'get',
//     params: params
//   })
// }
