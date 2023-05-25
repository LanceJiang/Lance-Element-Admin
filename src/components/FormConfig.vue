<script lang="tsx">
import OnlyShowItem from './customizeFormItem/OnlyShowItem'
import {defineComponent, watch, computed, ref, reactive, unref} from 'vue'
import { useI18n } from 'vue-i18n'

const formConfigProps = {
	forms: {
		type: Array,
		required: true
		// [{
		//   label: String,
		//   prop: [String, Array],
		//   itemType: String,
		//   size: String,
		//   options: Array,
		//   valueKey: String,
		//   labelKey: String,
		//   format: Function, // 提交前的数据修改
		//   rules: Array
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
	/**ol自定义Config*/
	// 默认的formItem内容宽度(eg: input/select/radio...)
	itemWidth: undefined,
	// 默认的formItem 对应的 col 外壳 span 配置
	span: 24,
	// 默认的formItem 对应的 label 是否展示
	showLabel: true,
	// 是否展示 底部操作集合
	showFooter: true,
	// footer下的 提交按钮 描述
	submitBtnText: '提交',
	// footer下的 提交按钮loading
	submitLoading: false,
	// footer下的 取消按钮 是否显示
	showCancelBtn: false,
	// footer下的 取消按钮 text
	cancelBtnText: '取消',
	// footer下的 重置按钮 是否显示
	showResetBtn: false,
	// footer下的 重置按钮 text
	resetBtnText: '重置',

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
	name: 'FormConfig',
	components: {
		OnlyShowItem
	},
	emits: formConfigEmits,
	props: formConfigProps,
	setup(props, ctx) {
		const { t } = useI18n()
		const formRef = ref(/*formRef*/)
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
				if (propType === 'string') {
					params[_prop] = setItemData(formData[_prop]) // 数据初始化
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
					if (v.itemType === 'cascader') {
						// 级联数据为数组
						params[_prop] = params[_prop] || [] // 变成数组  // 若不是数组 怎么操作
					}
					// 若该formItem  包含forms列表中未定义的prop 需要从formData取值
					if (Array.isArray(props)) {
						bindProps.push(...props)
					}
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
				} else {
					console.warn(error, '错误rule数组.... 如果需要对该错误数组 操作 请在此处添加')
					// eg:
					/* var errObj = error;
                        // 提示弹窗的 示例代码
                        var keys = Object.keys(errObj);
                        console.log(errObj[keys[0]], 'errObj[keys[0]]');
                        var errTipObj = (errObj[keys[0]][0] || {});
                        debugger;
                        if (errTipObj.message) {
                            this.$message.error(errTipObj.message)
                        }*/
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
					// console.error(errObj, 'errObj..................')
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
			console.warn(JSON.stringify(newData), JSON.stringify(oldData), 'newFormData, oldFormData  formData 发生改变 ... 监听  formData... 触发此处...')
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
					t_placeholder,
					on: form_on, ...formOthers } = form
				const _options = options || []
				const _itemStyle = unref(itemStyle) + form_itemStyle + (itemWidth ? `width: ${itemWidth};` : '')
				const _placeholder = t_placeholder ? t(t_placeholder) : placeholder
				let disabled = form.disabled
				if (disabled === undefined) {
					disabled = isEdit === false
				}
				switch (itemType) {
					/* 自定义 render */
					/*case 'render' :
						return 'todo'*/
					/* 下拉框 */
					case 'select':
						return (
							<el-select
								v-model={params[prop]}
								{...formOthers}
								onChange={() => change && change(params[prop], _options, params)}
								style={_itemStyle}
								disabled={disabled}
								size={_size ?? size}
								placeholder={form.placeholder || `请选择${form.label}`}
							>
								{_options.map((option, optionIndex) => {
									const value = typeof option === 'object' ? option[form.valueKey || 'value'] : option
									const label = typeof option === 'object' ? option[form.labelKey || 'label'] : option
									return <el-option key={value} label={label} value={value} />
								})}
							</el-select>
						)
					/* 单选框 */
					case 'radio':
						return (
							<el-radio-group
								v-model={params[prop]}
								{...formOthers}
								disabled={disabled}
								size={_size ?? size}
								onChange={() => change && change(params[prop], _options, params)}
								style={_itemStyle}
							>
								{_options.map((option, optionIndex) => {
									const value = typeof option === 'object' ? option[form.valueKey || 'value'] : option
									const label = typeof option === 'object' ? option[form.labelKey || 'label'] : option
									return (
										<el-radio key={optionIndex + '_local'} label={value}>
											{label}
										</el-radio>
									)
								})}
							</el-radio-group>
						)
					/* 级联 */
					case 'cascader':
						return (
							<el-cascader
								v-model={params[prop]}
								{...formOthers}
								onChange={() => change && change(params[prop], _options, params)}
								style={_itemStyle}
								disabled={disabled}
								size={_size ?? size}
								clearable={form.clearable ?? true}
								filterable={form.filterable ?? true}
								options={_options}
								placeholder={form.placeholder || `请选择${form.label}`}
							/>
						)
					/* 数字 */
					case 'inputNumber':
						return (
							<el-input-number
								class="rate100"
								{...formOthers}
								v-model={params[prop]}
								onChange={() => change && change(params[prop], _options, params)}
								style={_itemStyle}
								disabled={disabled}
								placeholder={form.placeholder || `${form.label || ''}`}
								size={_size ?? size}
								precision={form.precision || 0}
							/>
						)
					/*return <InputNumber
						class="rate100 todo"
						{ ...formOthers }
						v-model:value={params[prop]}
						onChange={() => change && change(params[prop], _options, params)}
						style={_itemStyle}
						disabled={disabled}
						precision={form.precision || 0}
					/>*/
					/* 日期选择 */
					case 'datePicker':
						let dateOpts = {}
						dateOpts.valueFormat = form.valueFormat || 'MM/DD/YYYY'
						dateOpts.format = form.format || dateOpts.valueFormat
						// 区间类型
						if (/range$/.test(form.type || '')) {
							dateOpts = Object.assign(dateOpts, {
								// startPlaceholder: t(form.startPlaceholder || 'adb.filter.startDate'),
								// endPlaceholder: t(form.endPlaceholder || 'adb.filter.endDate'),
								unlinkPanels: form.unlinkPanels ?? true // 双面板联动
							})
						} else {
							dateOpts.placeholder = _placeholder || t('adb.filter.selectDate')
						}
						return (
							<el-date-picker
								v-model={params[prop]}
								{...formOthers}
								onChange={() => change && change(params[prop], _options, params)}
								style={_itemStyle}
								disabled={disabled}
								size={_size ?? size}
								placeholder={form.placeholder || `请选择${form.label}`}
								value-format={form.valueFormat || 'YYYY-MM-DD'}
							/>
						)
					/* switch */
					case 'switch':
						return (
							<el-switch
								v-model={params[prop]}
								{...formOthers}
								size={_size ?? size}
								onChange={() => change && change(params[prop], _options, params)}
								disabled={disabled}
							/>
						)
					/* 纯展示 */
					case 'onlyShow':
						return <OnlyShowItem form={form} params={params} formData={formData} />
					case 'input':
					default:
						return (
							<el-input
								v-model={params[prop]}
								{...formOthers}
								size={_size ?? size}
								onChange={() => change && change(params[prop], _options, params)}
								disabled={disabled}
								placeholder={form.placeholder || `请输入${form.label}`}
								style={_itemStyle}
							/>
						)
				}
			}
			const createFooter = () => {
				return (
					<div class="footer">
						{showResetBtn && (
							<el-button plain size={size} onClick={resetHandler.bind(null, undefined)}>
								{resetBtnText}
							</el-button>
						)}
						{showCancelBtn && (
							<el-button size={size} onClick={cancelHandler}>
								{cancelBtnText}
							</el-button>
						)}
						<el-button type="primary" size={size} loading={submitLoading} onClick={submitHandler}>
							{submitBtnText}
						</el-button>
					</div>
				)
			}

			return (
				<el-form ref={formRef} class="formConfig_wrap" model={params} {...form_config} size={size}>
					<el-row class={`form_wrap ${showLabel === false && 'hideLabel'}`}>
						{forms.map((form, idx) => {
							const { span: _span, ...others } = form
							return (
								<el-col key={idx} span={_span ?? span}>
									<el-form-item {...others}>{itemRender(form)}</el-form-item>
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

        :isEdit="formOptions.isEdit" // 是否以 纯展示方式 展示数据 //(不可编辑) // 需要传递的 参数也最少

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
    }*/
</script>

<style scoped lang="scss">
$themeColor: #ebeef5;
$themeBgColor: #f9f9f9;
.formConfig_wrap {
	.form_wrap {
		max-height: 70vh;
		overflow-y: auto;
	}
	/* 隐藏formItem label */
	.hideLabel {
		&::v-deep(.el-form-item__label) {
			display: none;
		}
	}
	.footer {
		padding-top: 10px;
		border-top: 1px solid #dcdfe6;
		text-align: right;
	}
	/*::v-deep {
    .text {
      margin-left: 10px;
    }
    .el-col {
      !*padding: 10px 10px 0 0 !important;*!
      border-bottom: 0;
    }
    .labelHidden {
      color: transparent;
    }
    .el-select,
    .el-input-number,
    .el-cascader,
    .el-date-editor.el-input {
      // date 样式
      width: 100%;
    }
    .el-date-editor--daterange.el-input__inner {
      // dateRange样式
      height: 29px;
      width: calc(100% - 20px);
      margin-left: 10px;
    }
    .el-date-editor .el-range-separator {
      // 拆分器 样式
      line-height: 29px;
    }
    .el-col-24 {
      .el-form-item__label {
        width: 16.67%;
      }
      .el-form-item__content {
        margin-left: 16.67%;
        background: #fff;
      }
    }
    !*.el-form-item {
            margin-bottom: 12px;
          }*!
    // 给inputNumber 添加的样式类名
    .textCenter .el-input__inner {
      text-align: center;
    }
  }*/
}
/*!* 如果表单有其他的 样式 可参照此处修改 来更改类名 在父级调用 写class 请用 父级类 包裹 *!
.defaultFormWrapClass {
	border: 1px solid $themeColor;
	border-bottom: 0;
	::v-deep {
		.el-row {
			display: flex;
			flex-wrap: wrap;
		}
		.el-form-item {
			background-color: $themeBgColor;
			margin-bottom: 0;
			border-bottom: 1px solid $themeColor;
			height: 100%;
			&:last-child {
				border-bottom: 0;
			}
		}
		.el-form-item__label {
			width: 33.33333%;
			color: #444;
			vertical-align: middle;
		}
		.el-form-item__content {
			margin-left: 33.33333%;
			border-left: 1px solid $themeColor;
			background: #fff;
			height: 100%; !* old End *!
			> div {
				box-sizing: border-box;
				width: 100%;
				padding: 0 10px;
				&:first-child {
					margin-top: 4px;
					margin-bottom: 12px;
				}
				.el-input__suffix {
					right: 15px;
				}
				.el-input__prefix {
					left: 15px;
				}
				!* inputNumber样式 *!
				&.el-input-number {
					.el-input__inner {
						text-align: left;
					}
					.el-input-number__decrease,
					.el-input-number__increase {
						right: 11px;
					}
				}
			}
			> .el-form-item__error {
				// 给错误提示更改位置
				!*transform: translate(0, -18px);*!
				transform: translate(0, -12px);
				top: auto;
			}
			.areaItem .showNum {
				// 兼容自定义 textArea组件的 数字展示
				!*bottom: -14px;
                    right: 5px;*!
				bottom: -18px;
				right: 10px;
			}
		}
		.el-col {
			border-bottom: 1px solid $themeColor !important;
			flex: 0 0 auto;
		}

		@media only screen and (max-width: 767px) {
			// 兼容手机端 样式
			.el-row {
				.el-col-12 {
					&:nth-last-child(2) {
						border-bottom: 1px solid $themeColor !important;
					}
				}
			}
		}
	}
}*/
</style>