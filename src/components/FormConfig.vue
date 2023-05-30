<script lang="tsx">
import {defineComponent, watch, computed, ref, reactive, unref } from 'vue'
import { useI18n } from 'vue-i18n'
// import { t } from 'lance-element-vue/src/locale'
// import InputNumber from 'lance-element-vue/packages/InputNumber'
import InputNumber from './InputNumber'
// import InputNumberRange from 'lance-element-vue/packages/InputNumberRange'
import InputNumberRange from './InputNumberRange'
// import CustomRender from 'lance-element-vue/packages/CustomRender'
import CustomRender from './CustomRender'
// import LeSelect from 'lance-element-vue/packages/Select' // todo...
/**
 * select Option 自定义 渲染
 * @param slots
 * @param slotOption
 * @param option
 * @param label
 * @returns {*}
 */
export const renderSelectOption = function(slots, slotOption, option, label) {
	if (slotOption) {
		let scopedSlots_option = slotOption
		if (typeof slotOption === 'string') {
			scopedSlots_option = slots[slotOption]
		}
		if (typeof scopedSlots_option === 'function') {
			const args = [{
				option,
				label
			}]
			// scopedSlots
			return scopedSlots_option(...args)
		}
	}
	return label
}
const cascaderSlot = (slots, slotOption) => {
	let scopedSlots_option = slotOption
	if (typeof slotOption === 'string') {
		scopedSlots_option = slots[slotOption]
	}
	if (typeof scopedSlots_option === 'function') {
		return scopedSlots_option
	}
}
const formConfigProps = {
	forms: {
		type: Array,
		required: true
		// [{
		//   t_label: String, // 多语言转义
		//   label: String,
		//   slotLabel: [String[定义的slotLabel插槽名称], function[slotLabel插槽jsx渲染函数]], // slotLabel: ({label}) => DOM
		//   t_placeholder: String, // 多语言转义
		//   placeholder: String,
		//   prop: String,
		//   props: Array, // 当前Item额外数据
		//   itemType: String,
		//   size: String,
		//   options: Array,
		//   slotOption: [String[定义的options Item 渲染插槽名称], function[options Item 插槽jsx渲染函数]], // slotOption: ({option, label}) => DOM, !cascader 类型返回数据(且不可使用默认i18n) slotOption: ({data, node}) => DOM
		//   valueKey: String,
		//   labelKey: String,
		//   formValueFormat: Function, // 提交前的数据修改
		//   rules: Array
		//   render?: function(h, { form, params }) { JSX || createElement } // itemType === 'render' 专用
		//   i18n: Boolean (option label展示)多语言转义
		// }]
	},
	formData: {
		// 后台传递的初始值 对象 【后期拿操作的表单数据  请使用 submit 的params】
		type: Object,
		default: () => ({})
	}, // 后台传递过来的 数据
	// form的配置项对象 参考 default_formConfig
	formConfig: {
		type: Object,
		default: () => ({})
	},
	// 是否可以编辑
	isEdit: {
		type: Boolean,
		default: true
	}
}
const formConfigEmits = ['cancel', 'submit']
const default_formConfig = {
	/**自定义Config*/
	// 默认的formItem内容宽度(eg: input/select/radio...)
	itemWidth: undefined,
	// 默认的formItem 对应的 col 外壳 span 配置
	span: 24,
	// 默认的formItem 对应的 label 是否展示
	showLabel: true,
	// 是否展示 底部操作集合
	showFooter: true,
	// footer下的 提交按钮 描述
	submitBtnText: 'le.btn.confirm',
	// footer下的 提交按钮loading
	submitLoading: false,
	// footer下的 取消按钮 是否显示
	showCancelBtn: false,
	// footer下的 取消按钮 text
	cancelBtnText: 'le.btn.cancel',
	// footer下的 重置按钮 是否显示
	showResetBtn: false,
	// footer下的 重置按钮 text
	resetBtnText: 'le.btn.reset',

	/**
	 * element中的配置
	 * 更多请参考 [https://element-plus.gitee.io/zh-CN/component/form.html]
	 */
	labelPosition: 'right',
	// 表单域标签的后缀
	labelSuffix: ':',
	// 表单内组件的尺寸
	size: 'default'
}
const FormConfig = defineComponent({
	name: 'LeFormConfig',
	components: {
		CustomRender,
		InputNumber,
		InputNumberRange,
		// LeSelect
	},
	emits: formConfigEmits,
	props: formConfigProps,
	setup(props, ctx) {
		const { t } = useI18n()
		const formRef = ref(/*formRef*/)
		const queryItemTypeKeys = (form) => {
			const { prop, itemType } = form
			switch (itemType) {
				case 'render':
					/** !!! 暂不对render类型 进行更多标签处理 */
					return []
				// 对Number区间进行特殊处理
				case 'inputNumberRange':
					const propStart = form.propStart || `${prop}Start`
					const propEnd = form.propEnd || `${prop}End`
					return [propStart, propEnd]
				case 'adSelect':
				case 'select':
				case 'radio':
				case 'datePicker':
				case 'inputNumber':
				case 'input':
				default:
					return [prop]
			}
		}
		const setItemData = (value, defaultValue?) => {
			if (typeof value !== 'boolean' && typeof value !== 'number') {
				return value || defaultValue
			}
			return value
		}
		const changeFormData = (formData, isInit?) => {
			const { forms } = props,
				params = {},
				bindProps = []
			forms.forEach((v, i) => {
				const _prop = v.prop,
					propType = typeof _prop,
					props = v.props // 绑定的其他数据
					queryItemTypeKeys(v).map(prop => {
						params[prop] = setItemData(formData[prop]) // 数据初始化
					})
					// todo...
					/* if (v.itemType === 'dateRange') {
            const propStart = v.propStart || `${_prop}Start`
            const propEnd = v.propEnd || `${_prop}End`
            const hasDate = formData[propStart] && formData[propEnd]
            // 仅当 初始日期 和 结束日期 都有的情况下 才赋值 prop值
            // （只有一个值时，存在 rangeDate不展示对应数据，点选日期 也被置回1970年 的问题）
            params[_prop] = hasDate
              ? [formData[propStart], formData[propEnd]]
              : formData[_prop] || undefined
          } else */
					// 若该formItem  包含forms列表中未定义的prop 需要从formData取值
					if (Array.isArray(props)) {
						bindProps.push(...props)
					}
			})
			// 赋值其他被绑的的值
			bindProps.map(prop => {
				params[prop] = formData[prop] // 被绑定的其他数据初始化
			})
			if (isInit) {
				return params
			} else {
				state.params = params
			}
		}
		const get_formSlotLabel = (slotOption) => {
			if (!slotOption) return
			if (typeof slotOption === 'string') {
				return ctx.slots[slotOption]
			}
			// fn
			return slotOption
		}
		const cancelHandler = () => {
			ctx.emit('cancel')
		}
		const submitHandler = submitCallback => {
			getParams((error, params) => {
				if (!error) {
					// debugger;
					// 若在父级组件使用 自定义的操作按钮， 可调用callback函数 作为提交操作
					if (typeof submitCallback === 'function') {
						return submitCallback(params)
					}
					ctx.emit('submit', params)
				}
			})
		}
		const getParams = (callback, unValidate = false) => {
			const _getParams = () => {
				const { forms } = props
				const { params, formValueFormats } = state
				const formattedForm = {} // 最后提交后台使用的params对象
				forms.forEach(form => {
					const key = form.prop
					if (key) {
						// 对应的form 内部设置有 formValueFormats 函数的值做提交前的最后操作 fn(value, key)
						/* if (form.itemType === 'dateRange' && form.propStart) {
							// 含有propStart 表示拆分出来
							const { propStart } = form // || key + 'Start'
							const { propEnd } = form // || key + 'End'
							const [startDate, endDate] = params[key] || []
							formattedForm[propStart] = startDate
							formattedForm[propEnd] = endDate
						} else { */
						formattedForm[key] = formValueFormats[key] ? formValueFormats[key](params, key) : params[key]
						// }
					}
					// 对含有 其他prop的数据 赋值
					if (Array.isArray(form.props)) {
						form.props.map(_key => {
							formattedForm[_key] = params[_key]
						})
					}
				})
				if (callback) callback(null, formattedForm)
			}
			if (unValidate) return _getParams()
			formRef.value.validate((valid, errObj) => {
				if (valid) {
					_getParams()
				} else {
					if (callback) callback(errObj)
				}
			})
		}
		const resetHandler = isAsync => {
			// 是否异步 传入的 formData 重置
			if (isAsync) {
				// 由于 formData 从父级传入后 内部并没有直接使用 固可用做 重置功能
				changeFormData(props.formData)
			} else {
				formRef.value.resetFields()
			}
		}
		watch(() => props.formData, (newData, oldData) => {
			// console.warn(JSON.stringify(newData), JSON.stringify(oldData), 'newFormData, oldFormData... 监听  formData')
			changeFormData(newData)
		})
		// 本地数据
		const state = reactive({
			params: changeFormData(props.formData, true),
			formValueFormats: props.forms.reduce((res, v) => {
				const { prop, formValueFormat } = v
				if (formValueFormat) {
					// 遍历 集成formValueFormat对象
					res[prop] = formValueFormat
				}
				return res
			}, {})
		})
		const local_formConfig = computed(() => {
			return {
				...default_formConfig,
				...props.formConfig
			}
		})
		const itemStyle = computed(() => {
			const { itemWidth } = props.formConfig
			if (itemWidth) {
				return `width: ${itemWidth};`
			}
			return ''
		})
		ctx.expose({
			formRef,
			getParams,
			resetHandler,
			submitHandler,
			cancelHandler,
		})
		// render
		return () => {
			const { params } = state
			const { isEdit, formData, forms } = props
			const {
				showLabel,
				size,
				gutter,
				span,
				showFooter,
				submitBtnText,
				cancelBtnText,
				resetBtnText,
				submitLoading,
				showCancelBtn,
				showResetBtn,
				...form_config
			} = unref(local_formConfig)

			const itemRender = form => {
				// const propKey = form.prop
				const { prop, itemType, itemWidth, options, change, itemStyle: form_itemStyle = '', itemClass, size: _size, placeholder,
					t_placeholder, ...formOthers } = form
				const _options = options || []
				const _itemStyle = unref(itemStyle) + form_itemStyle + (itemWidth ? `width: ${itemWidth};` : '')
				const _placeholder = t_placeholder ? t(t_placeholder) : placeholder
				let disabled = form.disabled
				if (disabled === undefined) {
					disabled = isEdit === false
				}
				// 优化后的 change事件
				const formatterChange = async () => {
					console.log(params[prop], 'params[prop]', _options)
					if (change) {
						// onChange={() => change && change(params[prop], _options, params)}
						return change(params[prop], _options, params)
					}
				}
				const render_selectOptions = () => {
					return _options.map((option) => {
						let value = option
						let label = option
						let disabled = false
						if (typeof option === 'object') {
							value = option[form.valueKey || 'value']
							label = option[form.labelKey || 'label']
							if (form.i18n) label = t(label)
							disabled = option.disabled
						}
						return <el-option
							key={value}
							value={value}
							label={label}
							disabled={disabled}
							title={label}>
							{renderSelectOption.call(null, ctx.slots, form.slotOption, option, label)}
						</el-option>
					})
				}
				switch (itemType) {
					/* 自定义 le 自定义Select */
					/*case 'adSelect' :
						return <LeSelect
							class={itemClass}
							v-model={params[prop]}
							{...formOthers}
							isPopover={formOthers.isPopover ?? true}
							popperAppendToBody={formOthers.popperAppendToBody ?? true}
							onChange={formatterChange}
							size={_size ?? size}
							placeholder={_placeholder}
							style={_itemStyle}
						>
							{render_selectOptions()}
						</LeSelect>*/
					/* 自定义 render */
					case 'render' :
						return <CustomRender
							form={form}
							params={params}
						/>
					/* 下拉框 */
					case 'select':
						return (
							<el-select
								class={itemClass}
								{...formOthers}
								v-model={params[prop]}
								onChange={formatterChange}
								style={_itemStyle}
								disabled={disabled}
								size={_size ?? size}
								placeholder={_placeholder}
							>
								{render_selectOptions()}
							</el-select>
						)
					/* 单选框 */
					case 'radio':
						return (
							<el-radio-group
								class={itemClass}
								{...formOthers}
								v-model={params[prop]}
								disabled={disabled}
								size={_size ?? size}
								onChange={formatterChange}
								style={_itemStyle}
							>
								{_options.map((option, optionIndex) => {
									let value = option
									let label = option
									let disabled = false
									if (typeof option === 'object') {
										value = option[form.valueKey || 'value']
										label = option[form.labelKey || 'label']
										if (form.i18n) label = t(label)
										disabled = option.disabled
									}
									return (
										<el-radio
											key={`${optionIndex}_local`}
											label={value}
											disabled={disabled}
											title={label}>
											{label}
										</el-radio>
									)
								})}
							</el-radio-group>
						)
					/* 级联 */
					case 'cascader':
						const slots = {
							default: cascaderSlot(ctx.slots, form.slotOption)
						}
						return (
							<el-cascader
								class={itemClass}
								{...formOthers}
								v-model={params[prop]}
								onChange={formatterChange}
								style={_itemStyle}
								disabled={disabled}
								size={_size ?? size}
								clearable={form.clearable ?? true}
								filterable={form.filterable ?? true}
								options={_options}
								placeholder={_placeholder}
								v-slots={slots}
							/>
						)
					/* 数字 */
					case 'inputNumber':
						return (
							// <el-input-number
							<InputNumber
								class={`rate100 ${itemClass}`}
								{...formOthers}
								v-model={params[prop]}
								onChange={formatterChange}
								style={_itemStyle}
								disabled={disabled}
								placeholder={_placeholder}
								size={_size ?? size}
								precision={form.precision || 0}
							/>
						)
					 /* 数字区间 todo */
					/*case 'inputNumberRange':
						const numberChange = (e, propKey) => {
							change && change(params, _options, params, propKey)
						}
						return (
							<InputNumberRange
								class={itemClass}
								{...formOthers}
								modelValue={params}
								// onChange={numberChange}
								style={_itemStyle}
								disabled={disabled}
								placeholder={_placeholder}
								size={_size ?? size}
								precision={form.precision || 0}
							/>
						)*/
					/* 日期选择(单日期 || 日期区间) */
					case 'datePicker':
						let dateOpts: any = {}
						dateOpts.valueFormat = form.valueFormat || 'MM/DD/YYYY'
						dateOpts.format = form.format || dateOpts.valueFormat
						// 区间类型
						if (/range$/.test(form.type || '')) {
							dateOpts = Object.assign(dateOpts, {
								startPlaceholder: t(form.startPlaceholder || 'le.filter.startDate'),
								endPlaceholder: t(form.endPlaceholder || 'le.filter.endDate'),
								unlinkPanels: form.unlinkPanels ?? true // 解除联动
							})
						} else {
							dateOpts.placeholder = _placeholder || t('le.filter.selectDate')
						}
						return (
							<el-date-picker
								class={itemClass}
								{...formOthers}
								{...dateOpts}
								v-model={params[prop]}
								onChange={formatterChange}
								style={_itemStyle}
								disabled={disabled}
								size={_size ?? size}
							/>
						)
					/* switch */
					case 'switch':
						return (
							<el-switch
								{...formOthers}
								v-model={params[prop]}
								size={_size ?? size}
								onChange={formatterChange}
								disabled={disabled}
							/>
						)
					case 'input':
					default:
						return (
							<el-input
								class={itemClass}
								{...formOthers}
								maxlength={formOthers.maxlength}
								v-model={params[prop]}
								size={_size ?? size}
								onChange={formatterChange}
								disabled={disabled}
								placeholder={_placeholder}
								style={_itemStyle}
							/>
						)
				}
			}
			const createFooter = () => {
				return (
					<div class="footer">
						{showCancelBtn && (
							<el-button class="cancel-button" size={size} onClick={cancelHandler}>
								{t(cancelBtnText)}
							</el-button>
						)}
						<div class="right-actions">
							{showResetBtn && (
								<el-button class="reset-button" plain size={size} onClick={resetHandler.bind(null, undefined)}>
									{t(resetBtnText)}
								</el-button>
							)}
							<el-button class="submit-button" type="primary" size={size} loading={submitLoading} onClick={submitHandler}>
								{t(submitBtnText)}
							</el-button>
						</div>
					</div>
				)
			}
			return (
				<el-form
					ref={formRef}
					class={`le-form-config le-form-config--${size}`}
					{ ...form_config }
					size={size}
					model={params}
				>
					<el-row class={`form_wrap ${showLabel === false && 'hideLabel'}`} gutter={gutter}>
						{forms.map((form, idx) => {
							const { span: _span, t_label, label, ...others } = form
							const slot_label = get_formSlotLabel(form.slotLabel)
							const formItemSlots: any = {}
							if(slot_label) formItemSlots.label = slot_label
							const _label = t_label ? t(t_label) : label
							return (
								<el-col key={idx} span={_span ?? span}>
									<el-form-item
										{...others}
										label={_label}
										v-slots={formItemSlots}
									>
										{itemRender(form)}
									</el-form-item>
								</el-col>
							)
						})}
						{/** 额外的插入内容 */}
						{ctx.slots.extraContent?.()}
					</el-row>
					{showFooter && createFooter()}
				</el-form>
			)
		}
	}
})
export default FormConfig

/**
 * eg:  示例  实例参考 TestForm.vue
 */
/* <FormConfig
        ref="configForm"
        :forms="formOptions.forms" // 遍历formItem 的数组
        :formData="formOptions.formData" // 初始化 form数据
        @submit="submit" // form 表单提交使用： 会传递 form 对应的值
        @cancel="close" // 取消按钮点击操作
        :isEdit="formOptions.isEdit"
        />

        var formOptions = {
            forms: [
            {
                prop: '邮件标题',
                label: '邮件标题',
                itemType: 'input',
                // span: 11,
                // xs: {span: 20}
            },
            { // 选人
                prop: '传阅人员',
                label: '传阅人员',
                itemType: 'select',
                options: [
                    // '小三', '请选择传阅人员'
                    {value: '', label: '请选择传阅人员'},
                    {value: 0, label: '小三'},
                    {value: 1, label: '小四'}
                ]
            }
        ]
    } */
</script>
