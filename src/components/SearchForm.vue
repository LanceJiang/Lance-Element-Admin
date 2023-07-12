<script lang="tsx">
import { defineComponent, watch, ref, computed, PropType, CSSProperties } from 'vue'
import { Refresh, Search } from '@element-plus/icons-vue'
import { LeFormItem, ObjectOpts, FormConfigOpts, FormItemSlots, SlotOption } from '@/components/FormConfig/formConfig.types'
import InputNumber from './InputNumber'
import InputNumberRange from './InputNumberRange'
import CustomRender from './CustomRender'
import { useI18n } from 'vue-i18n'
import { getOptions, renderOption, get_formSlots } from '@/components/FormConfig/utils.ts'
import { OptionItemProps } from '@/components/Select/select.types.ts'

const emits = ['update:searchData']
export type SearchFormItem = LeFormItem
export const SearchFormProps = {
	forms: {
		// SearchForm: 与FormConfig不同的是 change的第一个参数的params, 去掉了原来的value 选项
		type: Array as PropType<SearchFormItem[]>,
		required: true
	},
	// 后台传递的初始值 以及 双向绑定 对象
	searchData: {
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
		default: () => ({})
	},
	loading: {
		type: Boolean,
		default: false
	},
	reset: {
		type: Function as PropType<((initSearchData: Record<string, any>) => any)>
	}
}
export const SearchForm = defineComponent({
	name: 'LeSearchForm',
	emits,
	props: SearchFormProps,
	setup(props, ctx) {
		const { t } = useI18n()
		const formRef = ref(/*formRef*/)
		let initSearchData = undefined
		watch(
			() => props.searchData,
			(newValue, oldValue) => {
				if (!initSearchData && newValue) {
					initSearchData = { ...newValue }
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
			const _initSearchData = { ...(initSearchData || {}) }
			if (emitReset) {
				emitReset(_initSearchData)
			} else {
				// formRef.value!.resetFields()
				// 撤回为初始化状态
				ctx.emit('update:searchData', _initSearchData)
			}
		}
		// 搜索
		const searchHandler = () => {
			ctx.emit('update:searchData', { ...props.searchData })
		}
		// 强行修改初始化数据(用于 重置方法进行数据重置)
		const forceUpdateInitParams = (searchData = props.searchData) => {
			initSearchData = { ...searchData }
		}
		ctx.expose({
			formRef,
			forceUpdateInitParams
		})
		const vSlots = ctx.slots
		const realForms = computed(() => {
			return (props.forms || []).map((form) => {
				return {
					...form,
					le_slots: get_formSlots(vSlots, form.slots)
				}
			})
		})
		// const gutter = 8
		// const colStyle = computed(() => {
		// 	const styles: CSSProperties = {}
		// 	if (gutter) {
		// 		styles.paddingLeft = styles.paddingRight = `${gutter / 2}px`
		// 	}
		// 	return styles
		// })
		// render渲染
		return () => {
			const { searchData, formConfig = {}, triggerSearchAuto } = props
			let warpClass = 'le-search-form-container labelStyle'
			const getItemStyle = (itemStyle, defaultWidth) => {
				return itemStyle + ((/width\:/g).test(itemStyle) ? '' : `;width:${defaultWidth}`)
			}
			const itemRender = (form, _label) => {
				// 申明: onChange 会导致(类input) change后触发两次(组件定义一次,原生change一次) 对组件定义进行过滤,仅留原生触发,组件触发onChange 用change 替代
				const { prop, itemType, itemWidth, options, change, onChange, itemStyle = '', placeholder, t_placeholder, le_slots, ...formOthers } = form
				const _options = options || []
				const _itemStyle = itemStyle + (itemWidth ? `;width: ${itemWidth}` : '')
				let disabled = form.disabled
				const _placeholder: string = (t_placeholder ? t(t_placeholder) : placeholder) || _label
				// 优化后的 change事件
				let formatterChange = async () => {
					if (typeof change === 'function') {
						return change(searchData[prop], _options, searchData)
					}
				}
				let bindInputEvents = {}
				let changeAndSearch = formatterChange
				if (triggerSearchAuto) {
					changeAndSearch = () => formatterChange().then(searchHandler)
					bindInputEvents = {
						onBlur: searchHandler,
						// 回车触发搜索
						onKeydown: (e: KeyboardEvent) => {
							// console.error(e, 'onKeyDown', e.key)
							if (e.key === 'Enter') {
								searchHandler()
							}
						}
					}
				}
				switch (itemType) {
					case 'leSelect':
						// leSelect: 基于 element-plus el-select-v2扩展
						const slots_leSelect = {
							default: le_slots.option as SlotOption<OptionItemProps>
						}
						return (
							<LeSelect
								{...formOthers}
								options={_options}
								v-model={searchData[prop]}
								// 通过teleport插入到body (popper-append-to-body popperAppendToBody已弃用)
								teleported={formOthers.teleported ?? true}
								// '@update:selected_label' todo
								onChange={changeAndSearch}
								disabled={disabled}
								placeholder={_placeholder}
								style={getItemStyle(_itemStyle, '200px')}
								v-slots={slots_leSelect}
							/>
						)

					// 自定义render
					case 'render':
						return <CustomRender
							form={form}
							params={searchData}
						/>
					// 下拉框
					case 'select':
						return (
							<el-select
								{...formOthers}
								v-model={searchData[prop]}
								onChange={changeAndSearch}
								style={getItemStyle(_itemStyle, '200px')}
								disabled={disabled}
								clearable={form.clearable ?? true}
								placeholder={_placeholder}
							>
								{getOptions(_options, form).map((option, i) => {
									const { label, value, disabled } = option
									return (
										<el-option key={`${value}_${i}`} value={value} label={label} disabled={disabled} title={label}>
											{/*renderOption(ctx.slots, form.slots?.option, option)*/}
											{renderOption(le_slots.option, option)}
										</el-option>
									)
								})}
							</el-select>
						)
					// 单选框
					case 'radio':
						return (
							<el-radio-group
								{...formOthers}
								v-model={searchData[prop]}
								disabled={disabled}
								onChange={changeAndSearch}
								style={getItemStyle(_itemStyle, 'auto')}
							>
								{getOptions(_options, form).map((option, i) => {
									const { label, value, disabled } = option
									return (
										<el-radio-button key={`${value}_${i}`} label={value} disabled={disabled} title={label}>
											{/*renderOption(ctx.slots, form.slots?.option, option)*/}
											{renderOption(le_slots.option, option)}
										</el-radio-button>
									)
								})}
							</el-radio-group>
						)
					// 级联
					case 'cascader':
						const slots_cascader = {
							default: le_slots.option as SlotOption<{ data: any; node: any }>
						}
						return (
							<el-cascader
								{...formOthers}
								v-model={searchData[prop]}
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
							<InputNumber
								class="rate100"
								{...bindInputEvents}
								{...formOthers}
								slots={le_slots}
								v-model={searchData[prop]}
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
							change && change(searchData[propKey], _options, searchData, propKey)
						}
						return (
							<InputNumberRange
								{...bindInputEvents}
								prop={prop}
								{...formOthers}
								v-model={searchData[prop]}
								isValueArray
								// modelValue={searchData}
								onChange={numberChange}
								itemStyle={getItemStyle(_itemStyle, '230px')}
								disabled={disabled}
								placeholder={_placeholder}
								precision={form.precision || 0}
								v-slots={le_slots}
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
								v-model={searchData[prop]}
								onChange={changeAndSearch}
								style={getItemStyle(_itemStyle, dateWidthDefault)}
								disabled={disabled}
							/>
						)
					// switch
					case 'switch':
						return <el-switch
							{...formOthers}
							v-model={searchData[prop]}
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
								v-model={searchData[prop]}
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
						<el-form ref={formRef} inline={true} size="default" class="le-search-form-flex-wrap" model={searchData} {...formConfig}>
							<el-row class="form_wrap" gutter={8}>
								{realForms.value.map((form: SearchFormItem & { le_slots: ObjectOpts }, idx) => {
									// 通过 form.visible 控制 是否展示
									const _label = form.t_label ? t(form.t_label) : form.label
									const slots = {
										label: form.le_slots.label
									}
									return (
										<el-col v-show={form.visible !== false} key={idx} span={form.span ?? 1024}>
											<el-form-item
												// class={`${form.showLabel === false ? 'hideLabel' : ''} el-col el-col-${form.span}`}
												// v-show={form.visible !== false}
												// style={colStyle.value}
												// key={idx}
												class={form.showLabel === false ? 'hideLabel' : ''}
												{...form}
												label={_label}
												v-slots={slots}
											>
												{itemRender(form, _label)}
											</el-form-item>
										</el-col>
									)
								})}
							</el-row>
						</el-form>
						<div class="action-wrap">
							<el-button
								size="default"
								plain
								icon={Refresh}
								disabled={props.loading}
								onClick={local_resetHandler}>
								{ t('le.btn.reset') }
							</el-button>
							<el-button
								size="default"
								type="primary"
								loading={props.loading}
								icon={Search}
								onClick={searchHandler}>
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