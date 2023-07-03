<script lang="tsx">
import {
	defineComponent,
	watch,
	ref,
	PropType
} from 'vue'
import {LeFormItem, ObjectOpts, FormConfigOpts} from "@/components/FormConfig/formConfig.types";
import InputNumber from './InputNumber'
import InputNumberRange from './InputNumberRange'
import CustomRender from './CustomRender'
import { useI18n } from 'vue-i18n'
import {optionSlot, get_formSlotLabel} from "@/components/FormConfig/utils.ts";

const emits = ['update:searchParams']
const props = {
	forms: {
		type: Array as PropType<LeFormItem[]>,
		required: true
	},
	// 后台传递的初始值 以及 双向绑定 对象
	searchParams: {
		required: true,
		type: Object as PropType<ObjectOpts>
	},
	// item 修改后 自动触发搜索
	triggerSearchAuto: {
		type: Boolean,
		default: false
		// default: true
	},
	// 自动触发 Automatic trigger
	// formModal的配置项对象
	formConfig: {
		type: Object as PropType<FormConfigOpts>,
		default: () => ({
			// labelSuffix: ':',
			// labelWidth: '130px'
		})
	},
	loading: {
		type: Boolean,
		default: false
	},
	reset: {
		type: Function as PropType<((initSearchParams: Record<string, any>) => any)>,
	}
}
export const SearchForm = defineComponent({
	name: 'LeSearchForm',
	emits,
	props,
	setup(props, ctx) {
		const { t } = useI18n()
		const formRef = ref(/*formRef*/)
		let initSearchParams = undefined
		watch(
			() => props.searchParams,
			(newValue, oldValue) => {
				if (!initSearchParams && newValue) {
					initSearchParams = { ...newValue }
				}
			},
			{
				immediate: true
			}
		)

		// 重置搜索
		const local_resetHandler = () => {
			// 若有reset 将不会触发默认重置的操作
			const emitReset = props.reset
			const _initSearchParams = { ...(initSearchParams || {}) }
			if (emitReset) {
				emitReset(_initSearchParams)
			} else {
				// formRef.value!.resetFields()
				// 撤回为初始化状态
				ctx.emit('update:searchParams', _initSearchParams)
			}
		}
		// 搜索
		const searchHandler = () => {
			ctx.emit('update:searchParams', { ...props.searchParams })
		}
		// 强行修改初始化数据(用于 重置方法进行数据重置)
		const forceUpdateInitParams = (searchParams = props.searchParams) => {
			initSearchParams = { ...searchParams }
		}
		ctx.expose({
			formRef,
			forceUpdateInitParams
		})
		// render渲染
		return () => {
			const { forms, searchParams, formConfig = {}, triggerSearchAuto } = props
			let warpClass = 'le-search-form-container labelStyle'
			const getItemStyle = (itemStyle, defaultWidth) => {
				return itemStyle + ((/width\:/g).test(itemStyle) ? '' : `;width:${defaultWidth}`)
			}
			const itemRender = (form, _label) => {
				const { prop, itemType, itemWidth, options, change, itemStyle = '', placeholder,
					t_placeholder, ...formOthers } = form
				const _options = options || []
				const _itemStyle = itemStyle + (itemWidth ? `;width: ${itemWidth}` : '')
				let disabled = form.disabled
				if (disabled === undefined) {
					disabled = false
				}
				const _placeholder = (t_placeholder ? t(t_placeholder) : placeholder) || _label
				// 优化后的 change事件
				let formatterChange = async () => {
					if (typeof change === 'function') {
						return change(searchParams, _options)
					}
				}
				let bindInputEvents = {}
				let changeAndSearch = formatterChange
				if(triggerSearchAuto) {
					changeAndSearch = () => formatterChange().then(searchHandler)
					bindInputEvents = {
						onBlur: searchHandler,
						// 回车触发搜索
						onKeydown: (e: KeyboardEvent) => {
							// console.error(e, 'onKeyDown', e.key)
							if(e.key === 'Enter') {
								searchHandler()
							}
						}
					}
				}
				switch (itemType) {
					case 'leSelect' :
						// 由于leSelect 基于 element-plus el-select-v2 仅支持 option: 为对象{[labelKey: 'label'], [valueKey: 'value']}
						// optionSlot
						return <LeSelect
							v-model={searchParams[prop]}
							options={_options}
							{...formOthers}
							// '@update:selected_label' todo
							onChange={changeAndSearch}
							disabled={disabled}
							placeholder={_placeholder}
							style={getItemStyle(_itemStyle, '200px')}
						/>

					// 自定义render
					case 'render' :
						return <CustomRender
							form={form}
							params={searchParams}
						/>
					// 下拉框
					case 'select':
						return (
							<el-select
								{...formOthers}
								v-model={searchParams[prop]}
								onChange={changeAndSearch}
								style={getItemStyle(_itemStyle, '200px')}
								disabled={disabled}
								clearable={form.clearable ?? true}
								placeholder={_placeholder}
							>
								{_options.map((option, optionIndex) => {
									const value = typeof option === 'object' ? option[form.valueKey || 'value'] : option
									const label = typeof option === 'object' ? option[form.labelKey || 'label'] : option
									return <el-option key={value} label={label} value={value} />
								})}
							</el-select>
						)
					// 单选框
					case 'radio':
						return (
							<el-radio-group
								{...formOthers}
								v-model={searchParams[prop]}
								disabled={disabled}
								onChange={changeAndSearch}
								style={getItemStyle(_itemStyle, 'auto')}
							>
								{_options.map((option, optionIndex) => {
									const value = typeof option === 'object' ? option[form.valueKey || 'value'] : option
									const label = typeof option === 'object' ? option[form.labelKey || 'label'] : option
									return (
										<el-radio-button key={optionIndex + '_local'} label={value}>
											{label}
										</el-radio-button>
									)
								})}
							</el-radio-group>
						)
					// 级联
					case 'cascader':
						const slots_cascader = {
							default: optionSlot(ctx.slots, form.slotOption)
						}
						return (
							<el-cascader
								{...formOthers}
								v-model={searchParams[prop]}
								onChange={changeAndSearch}
								style={getItemStyle(_itemStyle, '200px')}
								disabled={disabled}
								clearable={form.clearable ?? true}
								filterable={form.filterable ?? true}
								options={_options}
								placeholder={_placeholder}
								v-slots={slots_cascader}
							/>
						)
					// 数字
					case 'inputNumber':
						return (
							// <el-input-number
							<InputNumber
								class="rate100"
								{...bindInputEvents}
								{...formOthers}
								v-model={searchParams[prop]}
								onChange={formatterChange}
								style={getItemStyle(_itemStyle, '130px')}
								disabled={disabled}
								placeholder={_placeholder}
								precision={form.precision || 0}
							/>
						)
					// 数字区间
					case 'inputNumberRange':
						const numberChange = (e, propKey) => {
							change && change(params, _options, params, propKey)
						}
						return (
							<InputNumberRange
								{...bindInputEvents}
								prop={prop}
								{...formOthers}
								modelValue={searchParams}
								onChange={numberChange}
								style={getItemStyle(_itemStyle, '230px')}
								disabled={disabled}
								placeholder={_placeholder}
								precision={form.precision || 0}
							/>
						)
					// 日期选择 (单日期 || 日期区间 ...) year/month/date/datetime/ week/datetimerange/daterange
					case 'datePicker':
						let dateWidthDefault = '160px'
						let dateOpts: any = {}
						dateOpts.valueFormat = form.valueFormat || 'MM/DD/YYYY'
						dateOpts.format = form.format || dateOpts.valueFormat
						// 区间类型
						if (/range$/.test(form.type || '')) {
							dateWidthDefault = '220px'
							const startPlaceholder = form.t_startPlaceholder ? t(form.t_startPlaceholder) : form.startPlaceholder
							const endPlaceholder = form.t_endPlaceholder ? t(form.t_endPlaceholder) : form.endPlaceholder
							dateOpts = Object.assign(dateOpts, {
								startPlaceholder: startPlaceholder ?? t('le.filter.startDate'),
								endPlaceholder: endPlaceholder ?? t('le.filter.endDate'),
								unlinkPanels: form.unlinkPanels ?? true // 解除联动
							})
						} else {
							dateOpts.placeholder = _placeholder || t('le.filter.selectDate')
						}
						return (
							<el-date-picker
								{...formOthers}
								{...dateOpts}
								v-model={searchParams[prop]}
								onChange={changeAndSearch}
								style={getItemStyle(_itemStyle, dateWidthDefault)}
								disabled={disabled}
							/>
						)
					// switch
					case 'switch':
						return <el-switch
							{...formOthers}
							v-model={searchParams[prop]}
							onChange={changeAndSearch}
							style={_itemStyle}
							disabled={disabled}
						/>
					case 'input':
					default:
						return (
							<el-input
								{...bindInputEvents}
								{...formOthers}
								v-model={searchParams[prop]}
								onChange={formatterChange}
								disabled={disabled}
								placeholder={_placeholder}
								style={getItemStyle(_itemStyle, '160px')}
							/>
						)
				}
			}
			return (
				<div class={warpClass}>
					<div class="le-search-form-flex">
						<el-form ref={formRef} inline={true} size="default" class="le-search-form-flex-wrap" model={searchParams} {...formConfig}>
							{forms.map((form, idx) => {
								// 通过 form.visible 控制 是否展示
								const _label = form.t_label ? t(form.t_label) : form.label
								const slots = {
									label: get_formSlotLabel(ctx.slots, form.slotLabel)
								}
								return (
									<el-form-item
										class={form.showLabel === false ? 'hideLabel' : ''}
										v-show={form.visible !== false}
										key={idx}
										{...form}
										label={_label}
										v-slots={slots}
									>
										{itemRender(form, _label)}
									</el-form-item>
								)
							})}
						</el-form>
						<div class="action-wrap">
							<el-button size="default" plain onClick={local_resetHandler}>
								<el-icon>
									<Refresh />
								</el-icon>
								{ t('le.btn.reset') }
							</el-button>
							<el-button size="default" type="primary" loading={props.loading} onClick={searchHandler}>
								<el-icon>
									<Search />
								</el-icon>
								{ t('le.btn.search') }
							</el-button>
						</div>
					</div>
				</div>
			)
		}
	}
})
export default SearchForm
</script>

<style lang="scss">
.#{$prefix}search-form {
	&-container {
		background-color: #fff;
		margin-bottom: 12px;
		padding: 10px 12px;
		padding-top: 0;
		&.labelStyle {
			.#{$prefix}search-form-flex-wrap {
				.el-form-item {
					//margin: 10px 8px 0 0;
					&:not(.hideLabel) {
						.el-form-item__label {
							border: 1px solid var(--el-input-border-color,var(--el-border-color));
							border-right: 0;
							/* box-shadow: 0 0 0 1px var(--el-input-border-color,var(--el-border-color)) inset; */
							border-radius: var(--el-input-border-radius,var(--el-border-radius-base)) 0 0 var(--el-input-border-radius,var(--el-border-radius-base));
							/* border-right: 0; */
							padding-left: 10px;
							//background: #fafafa;
							background: #fcfcfc;
						}
						.el-input__wrapper {
							border-radius: 0 var(--el-input-border-radius,var(--el-border-radius-base)) var(--el-input-border-radius,var(--el-border-radius-base)) 0;
						}
						// 修复 InputNumber 于labelStyle 样式问题
						.le-input-number--prefix {
							.le-input-number__prefix {
								border-top-left-radius: 0;
								border-bottom-left-radius: 0;
							}
							/*.el-input-number {
								.el-input__wrapper {
									border-top-left-radius: 0;
									border-bottom-left-radius: 0;
									//border: 1px solid $le-border-color_1;
									//border-left-width: 0;
								}
							}*/
						}
						.le-input-number--suffix {
							.el-input-number .el-input__wrapper {
								border-top-right-radius: 0;
								border-bottom-right-radius: 0;
							}
						}
						//修复 InputNumberRange 于labelStyle 样式问题
						.le-input-number-range {
							/*.le-input-number-range_line {
								box-shadow: 0px 0 0 1px var(--el-input-border-color,var(--el-border-color)) inset;
								margin: 0 -1px 0 -1px;
							}
							.le-input-number-range_start {
								.el-input__wrapper {
									border-top-right-radius: 0;
									border-bottom-right-radius: 0;
								}
							}*/
							.le-input-number-range_end {}
						}
						// radio
						.el-radio-button:first-child .el-radio-button__inner {
							//border-radius: var(--el-border-radius-base) 0 0 var(--el-border-radius-base);
							border-radius: 0;
						}
						// switch
						.el-switch {
							padding: 0 12px;
							box-shadow: 0 0 0 1px var(--el-input-border-color,var(--el-border-color)) inset;
							border-radius: 0 var(--el-input-border-radius,var(--el-border-radius-base)) var(--el-input-border-radius,var(--el-border-radius-base)) 0;
						}
					}
				}
			}
		}
	}
	&-flex {
		display: flex;
		.action-wrap {
			//padding-left: 12px;
			margin-top: 10px;
			/*display: inline-flex;
			//margin-top: 10px;
			vertical-align: middle;*/
		}
	}
	&-flex-wrap {
		flex: 1;
		flex-wrap: wrap;
		// 新增label border 包裹
		.el-form-item {
			margin: 10px 8px 0 0;
			/* 隐藏formItem label */
			&.hideLabel {
				.el-form-item__label {
					display: none;
				}
			}
			.le-input-number-range {
				.le-input-number-range_line {
					box-shadow: 0px 0 0 1px var(--el-input-border-color,var(--el-border-color)) inset;
					margin: 0 -1px 0 -1px;
				}
				.le-input-number-range_start {
					.el-input__wrapper {
						border-top-right-radius: 0;
						border-bottom-right-radius: 0;
					}
				}
			}
		}
	}
}
</style>
