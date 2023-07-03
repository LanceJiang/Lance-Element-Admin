// import type { FormItemInstance, FormInstance } from 'element-plus/lib/components/form'
import type { FormItemInstance, FormInstance } from 'element-plus/es/components/form'
import { OptionItemProps } from '@/components/Select/select.types.ts'
// 组件类型
export type FormConfigOpts = Partial<FormInstance['props']> & {
	itemWidth?: string // 默认的formItem类型宽度(eg: input/select/radio...)
	itemStyle?: string // 额外的的formItem类型样式[注:width 会被 itemWidth 覆盖](eg: input/select/radio...)
	itemClass?: string // 额外的的formItem类型样式类(eg: input/select/radio...)
	span?: number // 默认的formItem 对应的 col 外壳 span 配置
	showLabel?: boolean // 默认的formItem 对应的 label 是否展示
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
// formItem 配置
export type LeFormItem = Partial<FormItemInstance['props']> & {
	t_label?: string // 多语言转义 (() => Promise<unknown>)
	t_placeholder?: string // 多语言转义
	// 当前Item渲染额外数据字段集
	props?: string[]
	itemType: ComponentType
	// label 自定义插槽
	slotLabel?: string | (({ label: string }) => HTMLDivElement) // [[定义的slotLabel插槽名称], function[slotLabel插槽jsx渲染函数]] // slotLabel: ({label}) => DOM
	/*** select || radio || cascader 使用 Start*/
	slotOption?: string | ((opts: { option: ObjectOpts, label: string } | OptionItemProps) => HTMLDivElement) // [String[定义的options Item 渲染插槽名称], function[options Item 插槽jsx渲染函数]], // slotOption: ({option, label}) => DOM, !cascader 类型返回数据(且不可使用默认i18n) slotOption: ({data, node}) => DOM
	valueKey?: string
	labelKey?: string
	i18n?: boolean // (option label展示)是否进行多语言转义
	options?: any[] // [{label,value}]
	/*** select || radio || cascader 使用 End*/
	/*** render 使用 Start*/
	render?: ({ form: LeFormItem, params: ObjectOpts }) => HTMLDivElement
	/*** render 使用 End*/
	formValueFormat?: (params: any, key: string) => any // 数据提交前 转换
}

export type ObjectOpts = {
	[prop: string]: any
}
