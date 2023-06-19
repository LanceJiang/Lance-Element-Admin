import type { OptionProps, SelectProps } from './defaults'
import type { ExtractPropTypes, InjectionKey, Ref } from 'vue'
import type { Option } from './select.types'
// import type { TooltipInstance } from '@element-plus/components/tooltip'
import type { TooltipInstance } from 'element-plus/es/components/tooltip'

export interface SelectV2Context {
	props: ExtractPropTypes<typeof SelectProps>
	expanded: boolean
	popper: Ref<TooltipInstance>
	onSelect: (option: Option<any>, index: number, byClick?: boolean) => void
	onHover: (idx: number) => void
	onKeyboardNavigate: (direction: 'forward' | 'backward') => void
	onKeyboardSelect: () => void
}

export const selectV2InjectionKey: InjectionKey<SelectV2Context> = Symbol('ElSelectV2Injection')
export type IOptionProps = ExtractPropTypes<typeof OptionProps>
export type ISelectProps = ExtractPropTypes<typeof SelectProps>
