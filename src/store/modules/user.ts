import { defineStore } from 'pinia'
import { UserState } from '@/types'
import { ls } from '@/utils'
import { login, googleLogin, logout } from '@/api/login'
import router, { resetRouter } from '@/router'
import md5 from 'js-md5'

import avatarUrl from '@/assets/favicon.ico'

const useUserStore = defineStore({
	id: 'user',
	state: (): UserState => ({
		token: ls.get('token') || '',
		nickname: '',
		// avatar: '',
		avatar: avatarUrl,
		roles: [],
		perms: [],
		loginQuery: {},
		isLogin: false
	}),
	actions: {
		async RESET_STATE() {
			this.$reset()
		},
		/**
		 * 用户登录请求
		 * @param params 登录用户信息
		 *  username: 用户名
		 *  password: 密码 -> md5加密
		 *  challenge: 验证码
		 */
		login(params: any) {
			const userInfo = {
				...params,
				password: md5(params.password)
			}
			return login(userInfo).then(data => {
				// 登录账号 设置为 nickname
				this.nickname = params.username
				return data
			})
			// .then((data) => {})
			//   debugger
			//   const tmp_token = (data || {}).tmp_token
			//   ls.set('token', tmp_token)
			//   this.token = tmp_token
			// })
		},
		/**
		 * Google验证登录
		 */
		googleLogin(params: any) {
			return googleLogin(params).then((data: any) => {
				// console.error(data, 'data')
				const token = (data || {}).token
				ls.set('token', token)
				this.token = token

				/*// eslint-disable-next-line
				// @ts-ignore*/
				const { redirect, ...query } = this.loginQuery || {}
				// debugger
				const path = redirect || '/'
				// console.error(path, 'path query', query)
				router.push({ path, query })
				return data
			})
		},
		/**
		 *  获取用户信息（昵称、头像、角色集合、权限集合）
		 */
		getUserInfo() {
			return new Promise(resolve => {
				this.isLogin = true
				console.log('获取用户信息')
				this.nickname = 'admin'
				resolve(true)
			})
			// return getUserInfo()
			//   .then(({ data }) => {
			//     if (!data) {
			//       return console.error('Verification failed, please Login again.')
			//     }
			//     const { nickname, avatar, roles, perms } = data
			//     if (!roles || roles.length <= 0) {
			//       console.error('getUserInfo: roles must be a non-null array!')
			//     }
			//     this.nickname = nickname
			//     this.avatar = avatar
			//     this.roles = roles
			//     this.perms = perms
			//   })
		},

		/**
		 *  注销
		 */
		logout() {
			return new Promise(resolve => {
				ls.remove('token')
				this.RESET_STATE()
				resetRouter()
				return resolve(true)
			})
			// return logout()
			//   .then(() => {
			//     ls.remove('token')
			//     this.RESET_STATE()
			//     resetRouter()
			//   })
		},

		/**
		 * 清除 Token
		 */
		resetToken() {
			return new Promise(resolve => {
				ls.remove('token')
				this.RESET_STATE()
				resolve(null)
			})
		}
	}
})

export default useUserStore
