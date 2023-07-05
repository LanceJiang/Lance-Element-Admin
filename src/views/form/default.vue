<template>
	<div class="flex-column-page-wrap pageWrap">
		Forms & SearchForm
		<div class="common_title">le-search-form</div>
		<div class="content">
			<LeSearchForm
				v-model:searchParams="searchParams" :forms="searchForms" :loading="queryLoading"
			/>
		</div>
		<div class="common_title">le-form-config</div>
		<div class="content">
			<LeFormConfig ref="formRef" class="local_formConfig" :formData="formData" :forms="forms" :form-config="formConfig" @submit="formSubmit">
				<template #leSelectSlot="{ item }">
					<div style="background: #a0aab7">{{ item.le_label }} {{item}}</div>
				</template>
				<template #selectSlot="{ option, label }">
					<div style="background: #a0aab7">{{ label }} + {{ option.value_1 }}</div>
				</template>
				<template #leSelect_label="{label}">
					<span style="background: #f00; display: flex">
						label custom: template
						<span style="margin-left: auto; background: #00f; color: #fff">{{ label }}</span>
					</span>
				</template>
			</LeFormConfig>
			<div style="padding: 10px 0;">
				通过实例操作：
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
import { defineComponent, ref, reactive, toRefs, watch } from 'vue'
import { ElMessage } from 'element-plus'
import i18n from '@/lang/index'
export default defineComponent({
	name: 'FormDefault',
	setup() {
		const formData = {
			test1_select: 'test1_2',
			input: 'ssssssss',
			inputNumber: 22222222,
			inputNumberRangeStart: 1,
			inputNumberRangeEnd: 2,
			render: 'render',
			others: 'others'
		}
		const forms = [
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
				slotLabel({ label }) {
					return <span style='background: #f00;display: flex'>label custom: fn<span style='margin-left: auto; background: #0f0'>{ label }</span></span>
				},
				// slotOption: 'leSelectSlot',
				// slotOption({ value, label, disabled }) { // select 类型处理
				slotOption({ item, index, disabled }){ // leSelect (基于el-select-v2 二开)
					const style = `color: #fff; background: #00f`
					return <div style={style}>{item.le_label} ttt</div>
				},
				// teleported: true
				// change: methods.serviceChange
			},
			// render { render:function 必传 }
			{
				prop: 'render',
				props: ['others'],
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
					return <div style="background: #f0f; display: flex; width: 100%;">
						<el-input modelValue={params[form.prop]} onInput={e => (params[form.prop] = e)} placeholder="placeholder render" />
						<span style="min-width: 130px;padding: 0 10px; text-align: center;"> -render, others -</span>
						<el-input modelValue={params.others} onInput={e => (params.others = e)} placeholder="placeholder others" />
					</div>
					// return <el-input onChange={form.onChange} v-model={params[form.prop]} placeholder="placeholder test... 666" />
				}
			},
			// select
			{
				prop: 'test1_select',
				// label: 'test1_select',
				// 多语言自动切换
				t_label: `${prefix}test1_select`,
				slotLabel: 'leSelect_label',
				// // render fn 支持
				/*slotLabel({ label }) {
					// console.log(label, '//// args slotLabel 带 {label} 参数')
					return (
						<span style="background: #f00;display: flex">
							label custom: fn<span style="margin-left: auto; background: #0f0">{label}</span>
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
				slotOption({ value, label, disabled }) {
					// console.warn(value, label, 'value, label, disabled', disabled)
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
				// change: methods.serviceChange
			},
			// radio
			{
				prop: 'radio',
				label: 'radio',
				itemClass: 'test_radio',
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
				slotOption({ value, label, disabled }) {
					// console.warn(value, label, 'value, label, disabled', disabled)
					const style = `color: red`
					return <div style={style}><le-icon iconClass="le-review"/>{label} <le-icon iconClass="icon-logo"/>	</div>
				},
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
					return <div style="color: #f0f;"><le-icon iconClass="icon-logo"/>{data.label}</div>
				},
				/*rules: [
					{
						required: true,
						// message: 'validate.validateEmptyTips',
						message: i18n.global.t('le.validate.validateEmptyTips', {
							name: 'cascader' // i18n.global.t(`${prefix}test4`)
						}),
						trigger: 'blur'
					}
				]*/
			},
			// inputNumber
			{
				// todo...
				prop: 'inputNumber',
				label: 'inputNumber',
				itemStyle: 'min-width: 200px',
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
				/*inputNumberRangeStart: 1,
				inputNumberRangeEnd: 2*/
				// // t_label: `${prefix}test5`,
				// prepend: 'Prepend',
				// append: 'Append',
				// prefixIcon: 'Http://',
				// suffixIcon: '.com',
				itemType: 'inputNumberRange',
				change(...args) {
					console.error(...args, 'change...inputNumberinputNumberinputNumberinputNumberinputNumber')
				},
				// inputNumberRange 仅支持 validator 自定义
				rules: [
					// validator value为[numberStart, numberEnd]
					{
						validator: (rule: any, value: any[], callback: any) => {
							const [start, end] = value
							if(start < 5 || !end) return callback('start 必须大于 5, end 必须有值')
							callback()
						},
						trigger: 'blur'
					}
				]
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
		]
		const state = reactive({
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
			formData,
			searchParams: JSON.parse(JSON.stringify(formData)),
			forms,
			searchForms: forms.map(v => {
				return {
					...v,
					rules: undefined
				}
			}),
			queryLoading: false,
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
		})
		/*window.change_formData = (opts = {
			test1_select: 'test1_2',
			input: 'ssssssss',
			inputNumber: 22222222,
			inputNumberRangeStart: 1,
			inputNumberRangeEnd: 2
		}) => {
			console.log('opts: ', JSON.stringify(opts))
			state.formData = opts
		}*/
		const updateParams = () => {
			state.queryLoading = true
			console.warn('模拟发送请求参数', JSON.stringify(state.searchParams))
			new Promise((r) => setTimeout(r, 1000)).then(() => {
				console.log('模拟数据请求成功')
				state.queryLoading = false
			})
		}
		// 边听searchParams变化 更新query
		watch(() => state.searchParams,
			updateParams
			// {
			// 	immediate: true
			// }
		)
		const methods = {
			getDataHandler() {
				const _form = formRef.value
				console.error(_form, '_form')
				// @ts-ignore
				_form.getParams((error: any, params: any) => {
					if (!error) {
						console.warn(params, ' form 参数获取 测试')
						// state.formData = params
						// methods.queryList()
					} else {
						console.log('error filterHandler', error)
					}
				})
			},
			resetDataHandler() {
				formRef.value!.resetHandler()
			},
			serviceChange(value, options, params) {
				console.error(value, options, params, 'value, options, params')
				// 重置账号
				params.account_alias = undefined
				// 更新账号 options
				// state.forms.find((v) => v.prop === 'account_alias').options = state.local_services.get(value)
			},
			formSubmit(params) {
				console.error('params', JSON.stringify(params))
				state.formConfig.submitLoading = true
				setTimeout(() => {
					state.formConfig.submitLoading = false
					state.dialogVisible = false
					state.dialogVisible2 = false
					ElMessage.error('提交 成功 ')
				}, 1000)
			},
			changeVisible(bool = false) {
				state.dialogVisible = bool
			}
		}
		const formRef = ref()
		return {
			...toRefs(state),
			formRef,
			...methods
		}
	}
})
</script>
<style scoped lang="scss">
.pageWrap {
	padding: 10px 12px;
	overflow: auto;
	background: #fafafa;
}
:deep(.test_radio) {
	.el-radio {
		border-radius: 4px;
		background: #d0d0d0;
		&.is-checked {
			background: yellow;
		}
	}
}
</style>
