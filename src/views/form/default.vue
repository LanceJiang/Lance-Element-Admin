<template>
	<div class="flex-column-page-wrap pageWrap">
		Forms
		<div class="common_title">ad-form-config</div>
		<el-input-number size="default" controlsPosition="right" v-model="formData.inputNumber"></el-input-number>
		<AdInputNumber size="default" controlsPosition="right" v-model="formData.inputNumber">
			<template #prefix>
				<span class="ad-addon ad-input-number__prefix" style="background: #0f0;">prefix</span>
			</template>
		</AdInputNumber>
		<div class="content">
			<AdFormConfig ref="local_form" class="local_formConfig" :forms="forms" :form-config="formConfig" @submit="formSubmit">
				<template #adSelectSlot="{ option, label }">
					<div style="background: #a0aab7">{{ label }} + {{ option.value_1 }}</div>
				</template>
				<template #adSelect_label>
					<span style="background: #f00; display: flex"
						>label custom: template<span style="margin-left: auto; background: #00f; color: #fff">{{ 'custom: template' }}</span></span
					>
				</template>
			</AdFormConfig>
		</div>

		<!--		<div class="common_title">ad-form-config 表单 嵌入 dialog</div>
		<div class="content">
			<el-button @click="dialogVisible = true">打开 弹窗</el-button>
&lt;!&ndash;			todo&ndash;&gt;
&lt;!&ndash;			<el-dialog
				:title="'表单 嵌入 dialog'"
				:visible="dialogVisible"
				@update:visible="changeVisible"
				:closeOnClickModal="false"
				class="local_dialog ad-dialog-wrap"
				customClass="ad-dialog ad-form-config-dialog"
				@close="changeVisible(false)"
			>
				<FormConfig
					v-if="dialogVisible"
					ref="configForm"
					:forms="forms"
					:formConfig="formConfig"
					:form-data="formData"
					@submit="formSubmit"
					@cancel="changeVisible"
				>
					<template #adSelectSlot="{ option, label }">
						<div style="background: #00f">{{ label }} + {{ option.value_1 }}</div>
					</template>
				</FormConfig>
			</el-dialog>&ndash;&gt;
		</div>
		<div class="common_title">ad-form-config-dialog 表单弹窗</div>
		<div class="content">
			<el-button @click="dialogVisible2 = true">打开 弹窗</el-button>
&lt;!&ndash;			todo...&ndash;&gt;
&lt;!&ndash;			<FormConfigDialog
				v-if="dialogVisible2"
				title="ad-form-config-dialog 表单弹窗"
				:visible.sync="dialogVisible2"
				:formOptions="{
					forms,
					formConfig
				}"
				:formData="formData"
				@submit="formSubmit"
			>
				<template #adSelectSlot="{ option, label }">
					<div style="background: #a0aab7">{{ label }} + {{ option.value_1 }}</div>
				</template>
			</FormConfigDialog>&ndash;&gt;
		</div>-->
	</div>
</template>
<script lang="tsx">
import AdInputNumber from '@/components/customizeFormItem/InputNumber.vue'
const prefix = 'example.forms.'
import { ref } from 'vue'
export default {
	name: 'Form',
	components: {
		AdInputNumber
	},
	data() {
		// const _this = this
		return {
			formData: {
				test1_select: 'test1_2',
				input: 'ssssssss',
				inputNumber: 22222222
			},
			forms: [
				// todo
				/*// select
				{
					prop: 'adSelect', // 提交的 params 的字段
					// label: 'adSelect', // label 标签
					itemType: 'adSelect', // form-item 类型
					labelKey: 'label_1',
					valueKey: 'value_1',
					// isPopover: false,
					options: Array.from({ length: 20 }).map((_, i) => {
						return {
							value_1: '选项' + i,
							label_1: '黄金糕' + i
						}
					}),
					// template 支持
					// slotLabel: 'adSelect_label',
					// render 支持
					slotLabel(h) {
						return <span style='background: #f00;display: flex'>label custom: fn<span style='margin-left: auto; background: #0f0'>{ 'custom: fn' }</span></span>
					},
					slotOption: 'adSelectSlot',
					popperAppendToBody: true
					// change: _this.serviceChange
				},
				*/
				// render { render:function 必传 }
				{
					prop: 'render',
					label: '自定义Render',
					// t_label: `${prefix}test2`,
					itemType: 'render',
					// span: 12,
					rules: [
						{
							required: true,
							message: 'validate.validateEmptyTips',
							trigger: 'blur'
						}
					],
					onInput: (e) => {
						console.error('onInput....', e)
					},
					render: (h, extendsParams) => {
						const { form, params } = extendsParams
						console.error(form, params, '///////////')
						return <el-input onChange={form.onChange} v-model={params[form.prop]} placeholder="placeholder test... 666"/>
					}
				},
				// select
				{
					prop: 'test1_select',
					// label: 'test1_select',
					t_label: `${prefix}test1_select`,
					slotLabel: 'adSelect_label',
					// // render fn 支持
					// slotLabel() {
					// 	return <span style='background: #f00;display: flex'>label custom: fn<span style='margin-left: auto; background: #0f0'>{ 'custom: fn' }</span></span>
					// },
					itemType: 'select',
					disabled: false,
					// valueKey: 'value', // 默认
					// labelKey: 'label', // 默认
					// clearable: true,
					filterable: true,
					// placeholder: '请选择项目阶段',
					options: Array.from({ length: 6 }).map((_, i) => ({
						label: `test1_LABEL_${i}`,
						value: `test1_${i}`
					})),
					slotOption: 'adSelectSlot',
					rules: [
						{
							required: true,
							message: 'validate.validateEmptyTips',
							trigger: ['change', 'blur']
						}
					]
					// change: _this.serviceChange
				},
				// radio
				{
					prop: 'radio',
					label: 'radio',
					// t_label: `${prefix}test3`,
					itemType: 'radio',
					// span: 12,
					labelKey: 'labelX',
					valueKey: 'valueX',
					options: [
						// 'radio1',
						// 'radio2'
						{ valueX: 'Y', labelX: 'radio1' },
						{ valueX: 'N', labelX: 'radio2' }
					],
					rules: [
						{
							required: true,
							message: 'validate.validateEmptyTips',
							trigger: 'blur'
						}
					]
				},
				// cascader
				{
					prop: 'cascader',
					label: 'cascader',
					// t_label: `${prefix}test4`,
					itemType: 'cascader',
					// placeholder: '请选择cascader____',
					options: [
						{
							value: 'zhejiang',
							label: 'Zhejiang',
							children: [
								{
									value: 'hangzhou',
									label: 'Hangzhou',
									children: [
										{
											value: 'xihu',
											label: 'West Lake'
										}
									]
								}
							]
						},
						{
							value: 'jiangsu',
							label: 'Jiangsu',
							children: [
								{
									value: 'nanjing',
									label: 'Nanjing',
									children: [
										{
											value: 'zhonghuamen',
											label: 'Zhong Hua Men'
										}
									]
								}
							]
						}
					],
					rules: [
						{
							required: true,
							message: 'validate.validateEmptyTips',
							// message: i18n.t('validate.validateEmptyTips', {
							// 	name: i18n.t(`${prefix}test4`)
							// }),
							trigger: 'blur'
						}
					]
				},
				// inputNumber
				{ // todo...
					prop: 'inputNumber',
					label: 'inputNumber',
/*					slots: {
						prefix: () => <span class="ad-addon ad-input-number__prefix" style="background: #0f0;">prefix</span>,
						suffix: () => <span class="ad-addon ad-input-number__suffix" style="background: #0f0; height: 45px;">suffix</span>
					},*/
					// t_label: `${prefix}test5`,
					// prefix: 'Http://',
					prefixIcon: 'Http',
					// prefix: ref('Http://'),
					suffix: '.com',
					itemType: 'inputNumber',
					change(...args) {
						console.error(...args, 'change...inputNumberinputNumberinputNumberinputNumberinputNumber')
					}
				},
				/* // inputNumberRange // todo 是否添加
				{
					prop: 'inputNumberRange',
					label: 'inputNumberRange',
					// t_label: `${prefix}test5`,
					prepend: 'Prepend',
					append: 'Append',
					prefix: 'Http://',
					suffix: '.com',
					itemType: 'inputNumberRange',
					change(...args) {
						console.error(...args, 'change...inputNumberinputNumberinputNumberinputNumberinputNumber')
					}
				}, */
				// date
				{
					prop: 'date',
					label: 'date(date-picker)',
					// t_label: `${prefix}test6`,
					itemType: 'datePicker',
					placeholder: '请输入date',
					valueFormat: 'YYYY-MM-DD',
					format: 'MM/DD/YYYY'
				},
				// dateRange
				{
					prop: 'dateRange',
					label: 'dateRange(date-picker [type:daterange])',
					// propStart: 'dateRangeStart', // 已被删除(暂不考虑开启)
					// propEnd: 'dateRangeEnd',
					// t_label: `${prefix}test7`,
					itemType: 'datePicker',
					type: 'daterange',
					valueFormat: 'YYYY-MM-DD',
					format: 'MM/DD/YYYY'
				},
				{
					prop: 'switch',
					label: 'switch',
					itemType: 'switch'
					// checkedChildren: '开',
					// unCheckedChildren: '关'
				},
				{
					prop: 'input',
					label: 'input',
					itemType: 'input',
					// 都会被加载
					onChange: e => {
						console.error(e, 'onChange  onChange')
					},
					change(value, options, params) {
						console.warn(value, options, params, 'value, options, params')
					}
					// onFocus: e => {
					// 	console.error(e, 'onFocus  onFocus')
					// },
					// onInput: e => {
					// 	console.error(e, 'onInput')
					// },
				}
			],
			formConfig: {
				labelPosition: 'left', // right // top
				// labelPosition: 'top',
				labelWidth: '270px',
				itemWidth: '100%',
				// labelSuffix: '',
				submitLoading: false,
				showCancelBtn: true,
				showResetBtn: true,
				size: 'small'
				// showFooter: false
			},
			dialogVisible: false,
			dialogVisible2: false
		}
	},
	created() {
		console.log('created')
		window.form = this
	},
	methods: {
		serviceChange(value, options, params) {
			console.error(value, options, params, 'value, options, params')
			// 重置账号
			params.account_alias = undefined
			// 更新账号 options
			// this.forms.find((v) => v.prop === 'account_alias').options = this.local_services.get(value)
		},
		formSubmit(params) {
			debugger
			console.error('params', params)
			this.formConfig.submitLoading = true
			setTimeout(() => {
				this.formConfig.submitLoading = false
				this.dialogVisible = false
				this.dialogVisible2 = false
				this.$message.error('提交 成功 ')
			}, 1000)
		},
		changeVisible(bool = false) {
			this.dialogVisible = bool
		}
	}
}
</script>
<style scoped lang="scss">
.pageWrap {
	padding: 10px 12px;
	overflow: auto;
	background: #fafafa;
}
</style>
