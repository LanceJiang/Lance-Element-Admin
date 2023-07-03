<template>
	<div class="flex-column-page-wrap pageWrap">
		Forms
		<div class="common_title">le-form-config</div>
		<div class="content">
			<LeFormConfig ref="local_form" class="local_formConfig" :formData="formData" :forms="forms" :form-config="formConfig" @submit="formSubmit">
				<template #leSelectSlot="{ item }">
					<div style="background: #a0aab7">{{ item.le_label }} {{item}}</div>
				</template>
				<template #selectSlot="{ option, label }">
					<div style="background: #a0aab7">{{ label }} + {{ option.value_1 }}</div>
				</template>
				<template #leSelect_label>
					<span style="background: #f00; display: flex"
						>label custom: template<span style="margin-left: auto; background: #00f; color: #fff">{{ 'custom: template' }}</span></span
					>
				</template>
			</LeFormConfig>
			<div>
				<el-button type="primary" size="small" @click="getDataHandler">校验并获取</el-button>
				<el-button type="primary" size="small" @click="resetDataHandler">重置</el-button>
			</div>
		</div>

		<div class="common_title">le-form-config 表单 嵌入 dialog</div>
		<div class="content">
			<el-button @click="dialogVisible = true">打开 弹窗</el-button>
			<el-dialog
				:title="'表单 嵌入 dialog'"
				v-model="dialogVisible"
				:closeOnClickModal="false"
				class="local_dialog le-dialog le-form-config-dialog"
				@close="changeVisible(false)"
			>
				<LeFormConfig
					v-if="dialogVisible"
					ref="configForm"
					:forms="forms"
					:formConfig="formConfig"
					:form-data="formData"
					@submit="formSubmit"
					@cancel="changeVisible"
				>
					<template #leSelectSlot="{ option, label }">
						<div style="background: #00f">{{ label }} + {{ option.value_1 }}</div>
					</template>
					<template #extraContent>
<!--						若有需要可以塞入额外内容-->
						<el-col key='extraContent' :span='24'>
							额外内容
						</el-col>
					</template>
				</LeFormConfig>
			</el-dialog>
		</div>
		<div class="common_title">le-form-config-dialog 表单弹窗</div>
		<div class="content">
			<el-button @click="dialogVisible2 = true">打开 弹窗</el-button>
			<LeFormConfigDialog
				v-if="dialogVisible2"
				title="le-form-config-dialog 表单弹窗"
				v-model="dialogVisible2"
				:formOptions="{
					forms,
					formConfig
				}"
				:formData="formData"
				@submit="formSubmit"
			>
				<template #leSelectSlot="{ option, label }">
					<div style="background: #f00">{{ label }} + {{ option.value_1 }}</div>
				</template>
			</LeFormConfigDialog>
		</div>
	</div>
</template>
<script lang="tsx">
const prefix = 'example.forms.'
// import { ref } from 'vue'
import i18n from '@/lang/index'
export default {
	name: 'FormDefault',
	data() {
		// const _this = this
		return {
			numberRangeForm: {
				prop: 'inputNumberRange',
				label: 'inputNumberRange',
				// // t_label: `${prefix}test5`,
				// prepend: 'Prepend',
				// append: 'Append',
				prefixIcon: 'Http://',
				suffixIcon: '.com',
				itemType: 'inputNumberRange',
				change(...args) {
					console.error(...args, 'change...inputNumberinputNumberinputNumberinputNumberinputNumber')
				}
			},
			formData: {
				test1_select: 'test1_2',
				input: 'ssssssss',
				inputNumber: 22222222,
				inputNumberRangeStart: 1,
				inputNumberRangeEnd: 2
			},
			forms: [
				{
					prop: 'leSelect', // 提交的 params 的字段
					// label: 'leSelect', // label 标签
					itemType: 'leSelect', // form-item 类型
					// labelKey: 'label_1',
					// valueKey: 'value_1',
					// isPopover: false,
					options: Array.from({ length: 20 }).map((_, i) => {
						return {
							// value_1: '选项' + i,
							// label_1: '黄金糕' + i
							value: '选项' + i,
							label: '黄金糕' + i
						}
					}),
					// label template 支持
					// slotLabel: 'leSelect_label',
					// label render 支持
					slotLabel() {
						return <span style='background: #f00;display: flex'>label custom: fn<span style='margin-left: auto; background: #0f0'>{ 'custom: fn' }</span></span>
					},
					// slotOption: 'leSelectSlot',
					// slotOption({ option, label }) { // select 类型处理
					slotOption({ item }){ // leSelect (基于el-select-v2 二开)
						const style = `color: #fff; background: #00f`
						return <div style={style}>{item.le_label} ttt</div>
					},
					// teleported: true
					// change: _this.serviceChange
				},
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
							message: i18n.global.t('le.validate.validateEmptyTips', {
								name: 'test2'// i18n.global.t(`${prefix}test2`)
							}),
							// message: 'validate.validateEmptyTips',
							trigger: 'blur'
						}
					],
					onInput: e => {
						console.error('onInput....', e)
					},
					render: (extendsParams) => {
						const { form, params } = extendsParams
						console.error(form, params, '///////////')
						return <el-input onChange={form.onChange} v-model={params[form.prop]} placeholder="placeholder test... 666" />
					}
				},
				// select
				{
					prop: 'test1_select',
					label: 'test1_select',
					// t_label: `${prefix}test1_select`,
					slotLabel: 'leSelect_label',
					// // render fn 支持
					/*slotLabel({ label }) {
						// console.log(label, '//// args slotLabel 带 {label} 参数')
						return (
							<span style="background: #f00;display: flex">
								label custom: fn<span style="margin-left: auto; background: #0f0">{'custom: fn'}</span>
							</span>
						)
					},*/
					itemType: 'select',
					disabled: false,
					// valueKey: 'value', // 默认
					// labelKey: 'label', // 默认
					// clearable: true,
					filterable: true,
					// i18n: true,
					// placeholder: '请选择项目阶段',
					options: Array.from({ length: 6 }).map((_, i) => ({
						// label: 'le.validate.validateEmptyTips',
						label: `test1_LABEL_${i}`,
						value: `test1_${i}`
					})),
					slotOption({ option, label }) {
						// console.error(option, label, 'option, label')
						const style = `color: red`
						return <div style={style}>{label}</div>
					},
					// slotOption: 'selectSlot',
					rules: [
						{
							required: true,
							// message: 'validate.validateEmptyTips',
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
							// message: 'validate.validateEmptyTips',
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
					// // slotOption: 'cascaderSelectSlot',
					slotOption: ({node, data}) => {
						return <div style="color: #f0c;">{data.label}</div>
					},
					rules: [
						{
							required: true,
							// message: 'validate.validateEmptyTips',
							message: i18n.global.t('le.validate.validateEmptyTips', {
								name: 'cascader' // i18n.global.t(`${prefix}test4`)
							}),
							trigger: 'blur'
						}
					]
				},
				// inputNumber
				{
					// todo...
					prop: 'inputNumber',
					label: 'inputNumber',
					/* slots: {
						prefix: () => <span class="le-addon le-input-number__prefix" style="background: #0f0;">prefix</span>,
						suffix: () => <span class="le-addon le-input-number__suffix" style="background: #0f0; height: 45px;">suffix</span>
					},*/
					// t_label: `${prefix}test5`,
					prefixIcon: 'Http',
					suffixIcon: '.com',
					itemType: 'inputNumber',
					change(...args) {
						console.error(...args, 'change...inputNumberinputNumberinputNumberinputNumberinputNumber')
					}
				},
				// inputNumberRange // todo 是否添加
				{
					prop: 'inputNumberRange',
					label: 'inputNumberRange',
					// // t_label: `${prefix}test5`,
					// prepend: 'Prepend',
					// append: 'Append',
					// prefixIcon: 'Http://',
					// suffixIcon: '.com',
					itemType: 'inputNumberRange',
					change(...args) {
						console.error(...args, 'change...inputNumberinputNumberinputNumberinputNumberinputNumber')
					}
				},
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
				showResetBtn: true
				// size: 'small'
				// size: 'large'
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
		getDataHandler() {
			const _form = this.$refs['local_form']
			console.error(_form, '_form')
			// @ts-ignore
			_form.getParams((error: any, params: any) => {
				if (!error) {
					console.warn(params, ' form 参数获取 测试')
					// this.formData = params
					// this.queryList()
				} else {
					console.log('error filterHandler', error)
				}
			})
		},
		resetDataHandler() {
			// @ts-ignore
			// window.local_form = this.$refs['local_form']
			this.$refs['local_form']!.resetHandler()
		},
		serviceChange(value, options, params) {
			console.error(value, options, params, 'value, options, params')
			// 重置账号
			params.account_alias = undefined
			// 更新账号 options
			// this.forms.find((v) => v.prop === 'account_alias').options = this.local_services.get(value)
		},
		formSubmit(params) {
			debugger
			console.error('params', JSON.stringify(params))
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
