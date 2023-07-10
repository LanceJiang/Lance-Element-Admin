import { ComputedRef, Slots, computed, Ref, unref, watch, nextTick } from 'vue'
import LeSelect from '@/components/Select'
// import LeSelect from 'lance-element-vue/packages/Select'
import InputNumber from '@/components/InputNumber'
// import InputNumber from 'lance-element-vue/packages/InputNumber'
import InputNumberRange from '@/components/InputNumberRange'
// import InputNumberRange from 'lance-element-vue/packages/InputNumberRange'
import CustomRender from '@/components/CustomRender'
// import CustomRender from 'lance-element-vue/packages/CustomRender'
import { LeFormItem, ObjectOpts, SlotOption } from '@/components/FormConfig/formConfig.types.ts'
import { get_formSlots, getOptions, renderOption } from '@/components/FormConfig/utils.ts'
// import { LeTableOptions, LeTableProps } from '@/components/Table'
// import { SearchFormProps } from '@/components/SearchForm'
// import { FormConfigProps } from '../index.vue'
import { useI18n } from 'vue-i18n'
import { OptionItemProps } from '@/components/Select/select.types.ts'
export type FormType = 'FormConfig' | 'SearchForm'
export type SearchFormItem = LeFormItem
export type useFormItemsOpts = {
	// props: SearchFormProps | FormConfigProps
	// props: { forms: LeFormItem[] }
	props: any
	params: ObjectOpts
	slots: Slots
	// tableRef: Ref
}
export type RenderFormItem = LeFormItem & { le_slots: ObjectOpts }
export type RenderFormItemOpts = {
	form: LeFormItem & { le_slots: ObjectOpts }
	params: ObjectOpts
	isEdit?: boolean
	size?: 'large' | 'default' | 'small'
	t?: any
	itemStyle?: string
}

export const renderFormItem = (opts: RenderFormItemOpts) => {
	const { form, params, itemStyle, isEdit = true, size = 'default', t } = opts
	const {
		prop,
		itemType,
		itemWidth,
		options,
		change,
		// 申明: onChange 会导致(类input) change后触发两次(组件定义一次,原生change一次) 对组件定义进行过滤,仅留原生触发,组件触发onChange 用change 替代
		onChange,
		itemStyle: form_itemStyle = '',
		size: _size,
		placeholder,
		t_placeholder,
		le_slots,
		...formOthers
	} = form
	const _options = options || []
	const _itemStyle = unref(itemStyle) + form_itemStyle + (itemWidth ? `;width: ${itemWidth}` : '')
	const _placeholder = t_placeholder ? t(t_placeholder) : placeholder
	let disabled = form.disabled
	if (disabled === undefined) {
		disabled = isEdit === false
	}
	// 优化后的 change事件
	const formatterChange = async () => {
		// console.log(params[prop], `value, params.${prop}, options`, _options)
		if (change) {
			return change(params[prop], _options, params)
		}
	}
	switch (itemType) {
		/* 自定义 le 自定义Select */
		case 'leSelect':
			// leSelect: 基于 element-plus el-select-v2扩展
			const slots_leSelect = {
				default: le_slots.option as SlotOption<OptionItemProps>
			}
			const leStyle = _itemStyle + (/width\:/g.test(_itemStyle) ? '' : ';width: 200px')
			return (
				<LeSelect
					{...formOthers}
					options={_options}
					v-model={params[prop]}
					isPopover={formOthers.isPopover ?? true}
					// 通过teleport插入到body (popper-append-to-body popperAppendToBody已弃用)
					teleported={formOthers.teleported ?? true}
					onChange={formatterChange}
					size={_size ?? size}
					placeholder={_placeholder}
					style={leStyle}
					v-slots={slots_leSelect}
				/>
			)
		/* 自定义 render */
		case 'render':
			return <CustomRender form={form} params={params} />
		/* 下拉框 */
		case 'select':
			return (
				<el-select
					{...formOthers}
					v-model={params[prop]}
					onChange={formatterChange}
					style={_itemStyle}
					disabled={disabled}
					size={_size ?? size}
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
		/* 单选框 */
		case 'radio':
			return (
				<el-radio-group {...formOthers} v-model={params[prop]} disabled={disabled} size={_size ?? size} onChange={formatterChange} style={_itemStyle}>
					{getOptions(_options, form).map((option, i) => {
						const { label, value, disabled } = option
						return (
							<el-radio key={`${value}_${i}`} label={value} disabled={disabled} title={label}>
								{renderOption(le_slots.option, option)}
							</el-radio>
						)
					})}
				</el-radio-group>
			)
		/* 级联 */
		case 'cascader':
			const slots_cascader = {
				default: le_slots.option as SlotOption<{ data: any; node: any }>
			}
			return (
				<el-cascader
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
					v-slots={slots_cascader}
				/>
			)
		/* 数字 */
		case 'inputNumber':
			return (
				<InputNumber
					class="rate100"
					{...formOthers}
					slots={le_slots}
					v-model={params[prop]}
					onChange={formatterChange}
					style={_itemStyle}
					disabled={disabled}
					placeholder={_placeholder}
					size={_size ?? size}
					precision={form.precision || 0}
					v-slots={le_slots}
				/>
			)
		/* 数字区间 */
		case 'inputNumberRange':
			const numberChange = (value: number, propKey: string) => {
				change && change(params[prop], _options, params, propKey)
			}
			return (
				<InputNumberRange
					prop={prop}
					{...formOthers}
					v-model={params[prop]}
					isValueArray
					onChange={numberChange}
					style={_itemStyle}
					disabled={disabled}
					placeholder={_placeholder}
					size={_size ?? size}
					precision={form.precision || 0}
					v-slots={formOthers?.slots}
				/>
			)
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
				<el-switch {...formOthers} v-model={params[prop]} size={_size ?? size} onChange={formatterChange} style={_itemStyle} disabled={disabled} />
			)
		case 'input':
		default:
			return (
				<el-input
					{...formOthers}
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

export function useFormItems(type: FormType, opts: useFormItemsOpts) {
	const { t } = useI18n()
	// const testType = type === 'SearchForm' ? SearchFormItem : LeFormItem
	const { /*props, computedOptions, */ params, props, slots /*, tableRef*/ } = opts

	const realForms = computed(() => {
		const forms = (props.forms || []) as LeFormItem[]
		// if (type === 'SearchForm') {
		// 	forms = (forms || []) as SearchFormItem[]
		// }
		return forms.map(form => {
			return {
				...form,
				le_slots: get_formSlots(slots, form.slots)
			}
		})
	})

	const renderForms = (opts: { forms: RenderFormItem[]; gutter?: number; span?: any } = { forms: [] }) => {
		const { forms, gutter = 0, span } = opts
		return (
			<el-row class="form_wrap" gutter={gutter}>
				{(forms as RenderFormItem[]).map((form, idx) => {
					const { span: _span, t_label, label, ...others } = form
					const _label = t_label ? t(t_label) : label
					const formItemSlots = {
						label: form.le_slots.label // get_formSlotLabel(ctx.slots, form.slots?.label)
					}
					return (
						<el-col key={idx} span={_span ?? span}>
							<el-form-item {...others} label={_label} v-slots={formItemSlots}>
								{renderFormItem({
									form,
									params,
									isEdit: props.isEdit,
									size: props.size,
									itemStyle: props.itemStyle,
									t
								})}
							</el-form-item>
						</el-col>
					)
				})}
			</el-row>
		)
	}
	return {
		realForms,
		renderForms
	}
}
