import type { Component, PropType } from 'vue'
import { CircleClose } from '@element-plus/icons-vue'
import { placements } from '@popperjs/core'
// import { definePropType, isValidComponentSize } from '@element-plus/utils'
import { definePropType, isValidComponentSize } from 'element-plus/es/utils/index.mjs'
// import { useTooltipContentProps } from '@element-plus/components/tooltip'
import { useTooltipContentProps } from 'element-plus/es/components/tooltip/index.mjs'
// import type { ComponentSize } from '@element-plus/constants'
import type { ComponentSize } from 'element-plus/es/constants/index.mjs'
import type { OptionType } from './select.types'
// import type { Options, Placement } from '@element-plus/components/popper'
import type { Options, Placement } from 'element-plus/es/components/popper/index.mjs'

export const SelectProps = {
	allowCreate: Boolean,
	autocomplete: {
		type: String as PropType<'none' | 'both' | 'list' | 'inline'>,
		default: 'none'
	},
	automaticDropdown: Boolean,
	clearable: {
		type: Boolean,
		default: true
	},
	clearIcon: {
		type: [String, Object] as PropType<string | Component>,
		default: CircleClose
	},
	effect: {
		type: String as PropType<'light' | 'dark' | string>,
		default: 'light'
	},
	collapseTags: {
		type: Boolean,
		default: true
	},
	// 折叠的标签是否toolTip提示
	collapseTagsTooltip: {
		type: Boolean,
		default: false
	},
	maxCollapseTags: {
		type: Number,
		default: 1
	},
	defaultFirstOption: Boolean,
	disabled: Boolean,
	estimatedOptionHeight: {
		type: Number,
		default: undefined
	},
	filterable: {
		type: Boolean,
		default: true
	},
	filterMethod: Function,
	height: {
		type: Number,
		default: 170 // 5 items by default
	},
	itemHeight: {
		type: Number,
		default: 34
	},
	id: String,
	loading: Boolean,
	loadingText: String,
	label: String,
	modelValue: [Array, String, Number, Boolean, Object] as PropType<any[] | string | number | boolean | Record<string, any> | any>,
	multiple: Boolean,
	multipleLimit: {
		type: Number,
		default: 0
	},
	name: String,
	noDataText: String,
	noMatchText: String,
	remoteMethod: Function,
	reserveKeyword: {
		type: Boolean,
		default: true
	},
	options: {
		type: Array as PropType<OptionType[]>,
		// type: Array,
		required: true
	},
	placeholder: {
		type: String
	},
	teleported: useTooltipContentProps.teleported,
	// teleported: {},
	persistent: {
		type: Boolean,
		default: true
	},
	popperClass: {
		type: String,
		default: ''
	},
	popperOptions: {
		type: Object as PropType<Partial<Options>>,
		default: () => ({} as Partial<Options>)
	},
	remote: Boolean,
	size: {
		type: String as PropType<ComponentSize>,
		validator: isValidComponentSize
	},
	// option 是否多语言切换
	i18n: {
		type: Boolean,
		default: false
	},
	labelKey: {
		type: String,
		default: 'label'
	},
	valueKey: {
		type: String,
		default: 'value'
	},
	scrollbarAlwaysOn: {
		type: Boolean,
		default: false
	},
	validateEvent: {
		type: Boolean,
		default: true
	},
	placement: {
		type: definePropType<Placement>(String),
		values: placements,
		default: 'bottom-start'
	},
	// le-select 新增
	isPopover: {
		type: Boolean,
		default: true
	}
}

export const OptionProps = {
	data: Array,
	disabled: Boolean,
	hovering: Boolean,
	item: Object,
	index: Number,
	style: Object,
	selected: Boolean,
	created: Boolean
}
