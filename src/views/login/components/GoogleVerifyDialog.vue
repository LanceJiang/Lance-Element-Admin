<template>
	<el-dialog
		modalClass="googleVerifyDialog"
		:title="`${is_bind_google_code ? '验证' : '设置'}身份证验证器应用`"
		:showClose="false"
		:closeOnClickModal="false"
		:modelValue="dialogVisible"
		@update:modelValue="changeVisible"
		width="400px"
	>
		<div key="1" v-if="!is_bind_google_code" v-show="step === 1" class="contentWrap">
			<ul style="margin: 0">
				<li>在Google身份验证器应用中，点按+</li>
				<li>选择扫描二维码</li>
			</ul>
			<div class="imgWrap">
				<img :src="formData.ext.qr_link" />
				<el-tooltip effect="light" placement="bottom">
					<template #content>
						1.更改身份验证器应用<br />
						2.在 Google 身份验证器应用中，依次点按 + 和 输入设置密钥<br />
						3.输入您的电子邮件地址和以下密钥（空格没有影响）： {{ formData.ext.key }}<br />
						4.确保已选择基于时间<br />
						5.点按 添加 完成设置
					</template>
					<div class="desc">无法扫描？</div>
				</el-tooltip>
			</div>
		</div>
		<div key="2" v-show="step === 2" class="contentWrap">
			<div style="padding-bottom: 10px">请输入您在该应用中看到的 6 位数验证码</div>
			<el-input
				ref="verifyInput"
				size="default"
				v-model="google_code"
				@keyup.enter="input_nextSetupHandler"
				maxlength="6"
				clearable
				placeholder="请输入验证码"
			/>
		</div>
		<template #footer>
			<div class="dialog-footer">
				<el-button v-if="!is_bind_google_code" v-show="step > 1" @click="step--">上一步</el-button>
				<div class="right">
					<el-button @click="changeVisible(false)">取消</el-button>
					<el-button type="primary" :loading="loading" @click="nextSetupHandler">下一步</el-button>
				</div>
			</div>
		</template>
	</el-dialog>
</template>

<script setup name="GoogleVerify" lang="ts">
import { reactive, computed, toRefs, ref, watch, nextTick } from 'vue'
import useStore from '@/store'
import { ls, debounce } from '@/utils'
const { user } = useStore()
const emits = defineEmits(['update:dialogVisible'])
const props = defineProps({
	dialogVisible: {
		type: Boolean,
		default: false
	},
	formData: {
		type: Object,
		default: () => ({
			is_bind_google_code: 1 // 是否绑定
		})
	}
})
const state = reactive({
	step: props.formData.is_bind_google_code === 1 ? 2 : 1,
	google_code: '',
	loading: false
})
const { step, google_code, loading } = toRefs(state)
const is_bind_google_code = computed(() => props.formData.is_bind_google_code === 1)
const verifyInput = ref()
watch(
	step,
	value => {
		if (value === 2) {
			nextTick(() => {
				verifyInput.value?.focus()
			})
		}
	},
	{
		// 初始化立即执行
		immediate: true
	}
)
const nextSetupHandler = () => {
	if (state.step >= 2) {
		if (state.loading) return
		// 提交登录阶段
		const { tmp_token, ext } = props.formData
		state.loading = true
		user
			.googleLogin({
				tmp_token,
				google_key: ext.key,
				google_code: state.google_code
			})
			.then(res => {
				const username = res.username
				ls.set('username', username)
			})
			.finally(() => {
				state.loading = false
			}) /*.then(res => {
        }).catch(err => {
        })*/
	} else {
		state.step++
	}
}
const input_nextSetupHandler = debounce(nextSetupHandler, 500, true)
const changeVisible = (bool: boolean) => emits('update:dialogVisible', bool)
</script>

<style scoped lang="scss">
.contentWrap {
	min-height: 194px;
}
.imgWrap {
	display: flex;
	flex-direction: column;
	align-items: center;
	img {
		margin-top: 16px;
		margin-bottom: 10px;
		width: 100px;
		height: 100px;
	}
	.desc {
		color: #0075ff;
		cursor: pointer;
	}
}
.dialog-footer {
	display: flex;
	.right {
		flex: 1;
	}
}
</style>
