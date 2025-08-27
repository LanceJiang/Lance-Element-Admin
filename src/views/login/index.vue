<template>
	<div class="login-container">
		<div class="login-left">
			<div class="header">
				<img class="logo-img" src="@/assets/icons/logo.svg" alt="logo" />
				<span style="z-index: 1">{{ title }}</span>
			</div>
			<ServerLogin class="login-left_svg" style="color: var(--el-color-primary)" />
		</div>
		<div class="login-right">
			<el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
				<div class="title-container">
					<h3 class="title">{{ title }}</h3>
					<lang-select class="set-language" />
				</div>

				<el-form-item prop="username">
					<el-input
						ref="username"
						v-model="loginForm.username"
						class="login-input"
						:placeholder="$t('login.username')"
						name="username"
						type="text"
						tabindex="1"
						auto-complete="on"
					>
						<template #prefix>
							<span class="svg-container">
								<svg-icon icon="user" />
							</span>
						</template>
					</el-input>
				</el-form-item>

				<el-form-item prop="password">
					<el-input
						ref="passwordRef"
						v-model="loginForm.password"
						class="login-input"
						type="password"
						:placeholder="$t('login.password')"
						name="password"
						tabindex="2"
						auto-complete="on"
						:show-password="true"
						@keyup.enter="handleLogin"
					>
						<template #prefix>
							<span class="svg-container">
								<svg-icon icon="password" />
							</span>
						</template>
					</el-input>
				</el-form-item>

				<!-- 验证码 -->
				<!--			<el-form-item>
					<div id="captcha" class="captcha">
						<div v-show="captchaStatus === 'ready'" class="captcha_placeholder"> 行为验证™ 安全组件加载中 </div>
						<div v-show="captchaStatus === 'loading'" class="captcha_wait">
							<div class="loading">
								<div class="loading-dot"></div>
								<div class="loading-dot"></div>
								<div class="loading-dot"></div>
								<div class="loading-dot"></div>
							</div>
						</div>
					</div>
				</el-form-item>-->

				<el-button size="default" :loading="loading" type="primary" style="width: 100%; margin-bottom: 30px" @click.prevent="handleLogin"
					>{{ $t('login.login') }}
				</el-button>
			</el-form>
		</div>
		<!--		<GoogleVerifyDialog v-if="dialogOpts.dialogVisible" v-bind="dialogOpts" v-model:dialogVisible="dialogOpts.dialogVisible" />-->
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs, watch, nextTick } from 'vue'
import ServerLogin from './components/LoginMainSvg.vue'
// 组件依赖
import { ElMessage } from 'element-plus'
import LangSelect from '@/layout/components/Header/components/Language.vue'
// // 谷歌验证
// import GoogleVerifyDialog from './components/GoogleVerifyDialog.vue'
const title = import.meta.env.VITE_APP_TITLE
// 状态管理依赖
import useStore from '@/store'
// API依赖
// import { getGeetConfig } from '@/api/login'
import { useRoute } from 'vue-router'

const { user } = useStore()
const route = useRoute()

const loginFormRef = ref(/*ElForm*/)
const passwordRef = ref(/*ElInput*/)
const captchaStatus = ref('ready') // ready loading complete

const state = reactive({
	/*dialogOpts: {
		dialogVisible: false,
		formData: {
			is_bind_google_code: 1,
			ext: {}
		}
	},*/
	loginForm: {
		username: 'admin',
		password: '123456'
	},
	loginRules: {
		username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
		password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
	},
	loading: false,
	// passwordType: 'password',
	otherQuery: {},
	clientHeight: document.documentElement.clientHeight
})
let captcha_obj: any = null

const { /*dialogOpts,*/ loginForm, loginRules, loading /*, passwordType*/ } = toRefs(state)

/*function showPwd() {
	if (state.passwordType === 'password') {
		state.passwordType = ''
	} else {
		state.passwordType = 'password'
	}
	nextTick(() => {
		passwordRef.value.focus()
	})
}*/

function handleLogin() {
	// if (captcha_obj.getValidate) {
	// 	const result = captcha_obj.getValidate()
	// 	if (!result) {
	// 		return ElMessage.warning('请先完成机器验证')
	// 	}
	loginFormRef.value.validate((valid: boolean) => {
		if (valid) {
			state.loading = true
			// const challenge = result.geetest_challenge
			// const seccode = result.geetest_seccode
			user
				.login({
					...state.loginForm
					// challenge,
					// seccode
				})
				.then((formData: any) => {
					user.googleLogin()
					// state.dialogOpts = {
					// 	formData,
					// 	dialogVisible: true
					// }
				})
				.catch(() => {
					// 重置验证
					// captcha_obj.refresh() // 新的为reset
				})
				.finally(() => {
					state.loading = false
				})
		}
	})
	// }
}

watch(
	route,
	() => {
		const query = route.query
		user.$patch({
			loginQuery: query
		})
	},
	{
		immediate: true
	}
)

onMounted(() => {
	// 极验证初始化
	/*getGeetConfig().then(data => {
		// 极验证加载中
		captchaStatus.value = 'loading'
    // eslint-disable-next-line
		// @ts-ignore
		const initGeetest: any = window.initGeetest
		initGeetest(
			{
				...data,
				product: 'float', // 产品形式，包括：float，popup
				width: '100%' // 该配置已失效
			},
			(captchaObj: any) => {
				captchaObj.appendTo('#captcha')
				captchaObj.onReady(() => {
					// 极验证加载完成
					captchaStatus.value = 'complete'
				})
				captcha_obj = captchaObj
			}
		)
	})*/
})
</script>

<style lang="scss" scoped>
@use '@/styles/mixins.scss' as *;
//$light_gray: var(--el-input-icon-color);
//$light_gray: #fff;
$light_gray: var(--el-color-white);
.login-container {
	min-height: 100%;
	width: 100%;
	display: flex;
	height: 100%;
	overflow: hidden;
	.login-left {
		flex: 1;
		display: flex;
		flex-direction: column;
		background: var(--el-color-primary-light-5);
		.header {
			margin-top: 80px;
			display: flex;
			align-items: center;
			height: 78px;
			padding: 0 20px;
			color: #fff;
			font-size: 22px;
			@include hover-bg-opacity(0, #f00, 0.5);
			&::before {
				//background-color: var(--el-color-primary) !important;
				background: linear-gradient(270deg, var(--el-color-primary-light-5), var(--el-color-primary-light-7));
			}
			.logo-img {
				width: 50px;
				margin-right: 10px;
				z-index: 1;
			}
		}
		.login-left_svg {
			margin: 10% auto;
			max-height: 500px;
		}
	}
	.login-right {
		width: 660px;
		max-width: 100%;
		background: linear-gradient(145deg, var(--el-color-primary-light-5), var(--el-color-white));
	}
	.login-form {
		position: relative;
		width: 360px;
		max-width: 100%;
		padding: 12px 24px;
		margin: 0 auto;
		overflow: hidden;
		top: 30%;
		//left: 50%;
		//transform: translate(-50%, -50%);
		:deep(.el-form-item) {
			border: 1px solid rgba(255, 255, 255, 0.1);
			background: rgba(0, 0, 0, 0.1);
			border-radius: 5px;
			color: #454545;
			.el-input {
				height: 47px;
				.el-input__wrapper {
					padding: 0;
					background: transparent;
					box-shadow: none;
					.el-input__inner {
						background: transparent;
						border: 0;
						-webkit-appearance: none;
						border-radius: 0;
						padding: 12px 8px;
						//padding: 12px 0;
						//padding-right: 8px;
						color: $light_gray;
						height: 47px;
						caret-color: $light_gray;
						&:-webkit-autofill {
							box-shadow: 0 0 0px 1000px var(--el-color-primary-light-5) inset !important;
							-webkit-text-fill-color: $light_gray !important;
						}
					}
					.el-input__prefix-inner > :last-child {
						margin-right: 0;
					}
					/*.el-input__suffix-inner > :first-child {
						margin-left: 0;
					}*/
				}
			}
			.el-input__inner {
				&:hover {
					border-color: var(--el-input-hover-border, var(--el-border-color-hover));
					box-shadow: none;
				}

				box-shadow: none;
			}
		}
		.login-input {
			//--el-input-icon-color: #fff;
			--el-input-placeholder-color: #fafafa;
			:deep(.el-input__suffix) {
				padding-right: 10px;
			}
		}
	}

	.tips {
		font-size: 14px;
		color: #fff;
		margin-bottom: 10px;

		span {
			&:first-of-type {
				margin-right: 16px;
			}
		}
	}

	.svg-container {
		padding-left: 10px;
		color: $light_gray;
		display: inline-block;
	}

	.title-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 36px;
		.title {
			font-size: 24px;
			color: $light_gray;
			text-align: center;
			font-weight: bold;
		}
		.set-language {
			color: $light_gray;
			font-size: 18px;
			cursor: pointer;
		}
	}

	/*.captcha {
		width: 100%;
		&_placeholder {
			height: 42px;
			width: 100%;
			text-align: center;
			border-radius: 2px;
			background-color: #f3f3f3;
			color: #bbbbbb;
			font-size: 14px;
			letter-spacing: 0.1px;
			line-height: 42px;
		}
		&_wait {
			height: 42px;
			width: 100%;
			text-align: center;
			border-radius: 2px;
			background-color: #f3f3f3;
		}
	}*/

	.loading {
		margin: auto;
		width: 70px;
		height: 20px;
		&-dot {
			&:nth-child(1) {
				animation-delay: 0s;
			}
			&:nth-child(2) {
				animation-delay: 0.1s;
			}

			&:nth-child(3) {
				animation-delay: 0.2s;
			}

			&:nth-child(4) {
				animation-delay: 0.3s;
			}
			float: left;
			width: 8px;
			height: 8px;
			margin: 18px 4px;
			background: #ccc;
			border-radius: 50%;
			opacity: 0;
			box-shadow: 0 0 2px black;
			animation: loadingFade 1s infinite;
		}
	}

	@keyframes loadingFade {
		0% {
			opacity: 0;
		}
		50% {
			opacity: 0.8;
		}
		100% {
			opacity: 0;
		}
	}
}
@media screen and (max-width: 1200px) and (min-width: 576px) {
	.login-container .login-left .login-left_svg {
		position: absolute;
		top: 76% !important;
		left: 0 !important;
		height: 24% !important;
		margin: 0;
	}

	.login-container .login-right {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding-top: 20px;
		background: linear-gradient(145deg, var(--el-color-primary-light-5), var(--el-color-primary-light-7));
	}
}

@media screen and (max-width: 576px) {
	.login-container .login-left {
		display: none;
		/*.header {
			display: none;
		}*/
	}
	/*.login-container .login-left .login-left_svg {
		position: absolute;
		top: 82% !important;
		left: 0 !important;
		height: 18% !important;
		margin: 0;
	}*/
	.login-container .title-container .title {
		font-size: 20px;
	}
}
</style>
