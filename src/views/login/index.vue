<template>
	<div class="login-container">
		<el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
			<div class="title-container">
				<h3 class="title">{{ $t('login.title') }}</h3>
				<lang-select class="set-language" />
			</div>

			<el-form-item prop="username">
				<span class="svg-container">
					<svg-icon icon-class="user" />
				</span>
				<el-input
					ref="username"
					v-model="loginForm.username"
					:placeholder="$t('login.username')"
					name="username"
					type="text"
					tabindex="1"
					auto-complete="on"
				/>
			</el-form-item>

			<el-form-item prop="password">
				<span class="svg-container">
					<svg-icon icon-class="password" />
				</span>
				<el-input
					ref="passwordRef"
					:key="passwordType"
					v-model="loginForm.password"
					:type="passwordType"
					:placeholder="$t('login.password')"
					name="password"
					tabindex="2"
					auto-complete="on"
					@keyup.enter="handleLogin"
				/>
				<span class="show-pwd" @click="showPwd">
					<svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
				</span>
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
		<GoogleVerifyDialog v-if="dialogOpts.dialogVisible" v-bind="dialogOpts" v-model:dialogVisible="dialogOpts.dialogVisible" />
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs, watch, nextTick } from 'vue'

// 组件依赖
import { /*ElForm, ElInput,*/ ElMessage } from 'element-plus'
import LangSelect from '@/components/LangSelect/index.vue'
// 谷歌验证
import GoogleVerifyDialog from './components/GoogleVerifyDialog.vue'

// 状态管理依赖
import useStore from '@/store'
// API依赖
// import { getGeetConfig } from '@/api/login'
import { useRoute } from 'vue-router'
import { LoginFormData } from '@/types'

const { user } = useStore()
const route = useRoute()

const loginFormRef = ref(/*ElForm*/)
const passwordRef = ref(/*ElInput*/)
const captchaStatus = ref('ready') // ready loading complete

const state = reactive({
	dialogOpts: {
		dialogVisible: false,
		formData: {
			is_bind_google_code: 1,
			ext: {}
		}
	},
	loginForm: {
		username: 'admin',
		password: '123456'
	},
	loginRules: {
		username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
		password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
	},
	loading: false,
	passwordType: 'password',
	otherQuery: {},
	clientHeight: document.documentElement.clientHeight
})
let captcha_obj: any = null

const { dialogOpts, loginForm, loginRules, loading, passwordType } = toRefs(state)

function showPwd() {
	if (state.passwordType === 'password') {
		state.passwordType = ''
	} else {
		state.passwordType = 'password'
	}
	nextTick(() => {
		passwordRef.value.focus()
	})
}

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
				} as LoginFormData)
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

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

/* reset element-plus css */
.login-container {
	.title-container {
		position: relative;

		.title {
			font-size: 26px;
			color: $light_gray;
			margin: 0px auto 40px auto;
			text-align: center;
			font-weight: bold;
		}

		.set-language {
			color: #fff;
			position: absolute;
			top: 3px;
			font-size: 18px;
			right: 0px;
			cursor: pointer;
		}
	}

	//.localFormItem {
	//}
	//.el-form-item.localFormItem {
	.el-form-item:nth-child(2),
	.el-form-item:nth-child(3) {
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(0, 0, 0, 0.1);
		border-radius: 5px;
		color: #454545;
		.el-input {
			display: inline-block;
			height: 47px;
			width: 85%;
			.el-input__wrapper {
				padding: 0;
				background: transparent;
				box-shadow: none;
				.el-input__inner {
					background: transparent;
					border: 0px;
					-webkit-appearance: none;
					border-radius: 0px;
					padding: 12px 5px 12px 15px;
					color: $light_gray;
					height: 47px;
					caret-color: $cursor;

					&:-webkit-autofill {
						box-shadow: 0 0 0px 1000px $bg inset !important;
						-webkit-text-fill-color: $cursor !important;
					}
				}
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
	.gt_float {
		padding: 8px 0;
	}
	.copyright {
		width: 100%;
		position: absolute;
		bottom: 0;
		font-size: 12px;
		text-align: center;
		color: #cccccc;
	}
}
//// 极验证样式
//#captcha .gt_holder {
//  &.gt_float {
//    width: 100%;
//  }
//  .gt_slider {
//    //width: 100%;
//    width: calc(100% - 42px);
//  }
//  .gt_guide_tip {
//    width: calc(100% - 42px);
//  }
//}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
	min-height: 100%;
	width: 100%;
	background-color: $bg;
	overflow: hidden;
	.login-form {
		position: relative;
		//width: 520px;
		width: 374px;
		max-width: 100%;
		padding: 160px 35px 0;
		margin: 0 auto;
		overflow: hidden;
		position: absolute;
		top: 40%;
		left: 50%;
		transform: translate(-50%, -50%);
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
		padding: 6px 5px 6px 15px;
		color: $dark_gray;
		vertical-align: middle;
		width: 30px;
		display: inline-block;
	}

	.title-container {
		position: relative;

		.title {
			font-size: 26px;
			color: $light_gray;
			margin: 0px auto 40px auto;
			text-align: center;
			font-weight: bold;
		}
	}

	.show-pwd {
		position: absolute;
		right: 10px;
		top: 12px;
		font-size: 16px;
		color: $dark_gray;
		cursor: pointer;
		user-select: none;
	}
	// todo
	.captcha {
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
	}

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
</style>
