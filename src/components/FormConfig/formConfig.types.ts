// import type { FormItemInstance, FormInstance } from 'element-plus/lib/components/form'
import type { FormItemInstance, FormInstance } from 'element-plus/es/components/form'
import { OptionItemProps } from '@/components/Select/select.types.ts'
// 组件类型
export type FormConfigOpts = Partial<FormInstance['props']> & {
	itemWidth?: string // 默认的formItem类型宽度(eg: input/select/radio...)
	itemStyle?: string // 额外的的formItem类型样式[注:width 会被 itemWidth 覆盖](eg: input/select/radio...)
	span?: number // 默认的formItem 对应的 col 外壳 span 配置
	showFooter: boolean // 是否展示 底部操作集
	submitBtnText: string // footer下的 提交按钮 text
	submitLoading: boolean // footer下的 提交按钮 loading
	showCancelBtn: boolean // footer下的 取消按钮 是否显示
	cancelBtnText: string // footer下的 取消按钮 text
	showResetBtn: boolean // footer下的 重置按钮 是否显示
	resetBtnText: string // footer下的 重置按钮 text
}
// 组件类型
export type ComponentType =
	| 'leSelect'
	| 'render'
	| 'select'
	| 'radio'
	| 'cascader'
	| 'inputNumber'
	| 'inputNumberRange'
	| 'datePicker'
	| 'switch'
	| 'input'
export type SlotOption<T = ObjectOpts | OptionItemProps | { data: any; node: any }> = ((T) => HTMLDivElement | string) | string | undefined
export type FormItemSlots = {
	// label 自定义插槽
	label?: (({ label: string }) => HTMLDivElement) | string
	/***
	 * [option] 用于 adSelect|select|radio|cascader 类型的 下拉option 自定义扩展
	 * adSelect: (OptionItemProps) => HTMLDivElement
	 * select|radio: ({ label, value, disabled }) => HTMLDivElement
	 * cascader: ({data, node}) => HTMLDivElement   !!!!不可使用i18n进行转义
	 */
	option?: SlotOption

	// 由于inputNumber && inputNumberRange定义的slots 很少用到 目前只给出 render方法进行slot处理
	/**inputNumber && inputNumberRange*/
	prefix?: (scope: Record<string, any>) => any // | string
	suffix?: (scope: Record<string, any>) => any // | string
	/**inputNumberRange*/
	prepend?: (scope: Record<string, any>) => any // | string
	append?: (scope: Record<string, any>) => any // | string

	[prop: string]: any
}
// formItem 配置
// T额外申明 // FormConfig: inputNumberRange 类型的item change 会加上propKey 标注是前|后触发的change   options: 是 有options Item类型时会有具体的数组数据
// export type LeFormItem<Change = (value: any, options: any[], params: ObjectOpts, propKey?: string) => any> = Partial<FormItemInstance['props']> & {
export type LeFormItem = Partial<FormItemInstance['props']> & {
	t_label?: string // 多语言转义 (() => Promise<unknown>)
	t_placeholder?: string // 多语言转义
	// 当前Item渲染额外数据字段集
	props?: string[]
	itemType: ComponentType
	itemWidth?: string // 默认的formItem类型宽度(eg: input/select/radio...)
	itemStyle?: string // 额外的的formItem类型样式[注:width 会被 itemWidth 覆盖](eg: input/select/radio...)
	class?: string // 额外的的formItem类型样式类(eg: input/select/radio...)
	span?: number // 默认的formItem 对应的 col 外壳 span 配置
	showLabel?: boolean // 默认的formItem 对应的 label 是否展示
	visible?: boolean // 默认的formItem 是否显示
	// 插槽
	slots?: FormItemSlots
	/*** select || radio || cascader 使用 Start*/
	valueKey?: string
	labelKey?: string
	i18n?: boolean // (option label展示)是否进行多语言转义
	options?: any[] // [{label,value}]
	/*** select || radio || cascader 使用 End*/
	/*** render 使用 Start*/
	render?: ({ form: LeFormItem, params: ObjectOpts }) => HTMLDivElement
	/*** render 使用 End*/
	// formValueFormat?: (params: any, key: string) => any // 数据提交前 转换
	change?: (value: any, options: any[], params: ObjectOpts, propKey?: string) => any
	[prop: string]: any
}

export type ObjectOpts = {
	[prop: string]: any
}
