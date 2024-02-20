import { placements } from '@popperjs/core'
// import { useSizeProp } from '@element-plus/hooks'
import { useSizeProp } from 'element-plus/es/hooks/index.mjs'
// import { buildProps, definePropType, iconPropType } from '@element-plus/utils'
import { buildProps, definePropType, iconPropType } from 'element-plus/es/utils/index.mjs'
// import { useTooltipContentProps } from '@element-plus/components/tooltip'
import { useTooltipContentProps } from 'element-plus/es/components/tooltip/index.mjs'
import { CircleClose } from '@element-plus/icons-vue'
// import { tagProps } from '../../tag'
import { defaultProps } from './useProps'

import type { Option, OptionType } from './select.types'
import type { Props } from './useProps'
import type { Options, Placement } from '@element-plus/components/popper'

export const SelectProps = buildProps({
	/**
	 * @description whether creating new items is allowed. To use this, `filterable` must be true
	 */
	allowCreate: Boolean,
	/**
	 * @description autocomplete of select input
	 */
	autocomplete: {
		type: definePropType<'none' | 'both' | 'list' | 'inline'>(String),
		default: 'none'
	},
	/**
	 * @description for non-filterable Select, this prop decides if the option menu pops up when the input is focused
	 */
	automaticDropdown: Boolean,
	/**
	 * @description whether select can be cleared
	 */
	clearable: {
		type: Boolean,
		default: true
	},
	/**
	 * @description custom clear icon
	 */
	clearIcon: {
		type: iconPropType,
		default: CircleClose
	},
	/**
	 * @description tooltip theme, built-in theme: `dark` / `light`
	 */
	effect: {
		type: definePropType<'light' | 'dark' | string>(String),
		default: 'light'
	},
	/**
	 * @description whether to collapse tags to a text when multiple selecting
	 */
	collapseTags: {
		type: Boolean,
		default: true
	},
	/**
	 * @description whether show all selected tags when mouse hover text of collapse-tags. To use this, `collapse-tags` must be true
	 */
	// 折叠的标签是否toolTip提示
	collapseTagsTooltip: {
		type: Boolean,
		default: false
	},
	/**
	 * @description The max tags number to be shown. To use this, `collapse-tags` must be true
	 */
	maxCollapseTags: {
		type: Number,
		default: 1
	},
	/**
	 * @description
	 */
	defaultFirstOption: Boolean,
	/**
	 * @description is disabled
	 */
	disabled: Boolean,
	/**
	 * @description
	 */
	estimatedOptionHeight: {
		type: Number,
		default: undefined
	},
	/**
	 * @description is filterable
	 */
	filterable: {
		type: Boolean,
		default: true
	},
	/**
	 * @description
	 */
	filterMethod: Function,
	/**
	 * @description The height of the dropdown panel, 34px for each item
	 */
	height: {
		type: Number,
		// default: 170 // 5 items by default todo...
		default: 274 // same as select dropdown menu
	},
	/**
	 * @description The height of the dropdown item
	 */
	itemHeight: {
		type: Number,
		default: 34
	},
	/**
	 * @description
	 */
	id: String,
	/**
	 * @description whether Select is loading data from server
	 */
	loading: Boolean,
	/**
	 * @description displayed text while loading data from server, default is 'Loading'
	 */
	loadingText: String,
	/**
	 * @description biding value
	 */
	modelValue: {
		type: definePropType<any[] | string | number | boolean | Record<string, any> | any>([Array, String, Number, Boolean, Object])
	},
	/**
	 * @description is multiple
	 */
	multiple: Boolean,
	/**
	 * @description maximum number of options user can select when multiple is true. No limit when set to 0
	 */
	multipleLimit: {
		type: Number,
		default: 0
	},
	/**
	 * @description the name attribute of select input
	 */
	name: String,
	/**
	 * @description displayed text when there is no options, you can also use slot empty, the default is 'No Data'
	 */
	noDataText: String,
	/**
	 * @description displayed text when no data matches the filtering query, you can also use slot `empty`, default is 'No matching data'
	 */
	noMatchText: String,
	/**
	 * @description function that gets called when the input value changes. Its parameter is the current input value. To use this, `filterable` must be true
	 */
	remoteMethod: Function,
	/**
	 * @description whether reserve the keyword after select filtered option.
	 */
	reserveKeyword: {
		type: Boolean,
		default: true
	},
	/**
	 * @description data of the options, the key of `value` and `label` can be customize by `props`
	 */
	options: {
		type: definePropType<OptionType[]>(Array),
		required: true
	},
	/**
	 * @description placeholder, the default is 'Please select'
	 */
	placeholder: {
		type: String
	},
	/**
	 * @description whether select dropdown is teleported to the body
	 */
	teleported: useTooltipContentProps.teleported,
	/**
	 * @description when select dropdown is inactive and `persistent` is `false`, select dropdown will be destroyed
	 */
	persistent: {
		type: Boolean,
		default: true
	},
	/**
	 * @description custom class name for Select's dropdown
	 */
	popperClass: {
		type: String,
		default: ''
	},
	/**
	 * @description [popper.js](https://popper.js.org/docs/v2/) parameters
	 */
	popperOptions: {
		type: definePropType<Partial<Options>>(Object),
		default: () => ({} as Partial<Options>)
	},
	/**
	 * @description whether search data from server
	 */
	remote: Boolean,
	/**
	 * @description size of component
	 */
	size: useSizeProp,
	/*// option 是否多语言切换 todo...
	i18n: {
		type: Boolean,
		default: false
	},
	// todo labelKey
	labelKey: {
		type: String,
		default: 'label'
	},*/
	/**
	 * @description configuration options, see the following table
	 */
	props: {
		type: definePropType<Props>(Object),
		default: () => defaultProps
	},
	/**
	 * @description unique identity key name for value, required when value is an object
	 */
	valueKey: {
		type: String,
		default: 'value'
	},
	/**
	 * @description Controls whether the scrollbar is always displayed
	 */
	scrollbarAlwaysOn: Boolean,
	/**
	 * @description whether to trigger form validation
	 */
	validateEvent: {
		type: Boolean,
		default: true
	},
	/**
	 * @description position of dropdown
	 */
	placement: {
		type: definePropType<Placement>(String),
		values: placements,
		default: 'bottom-start'
	},
	/**
	 * @description list of possible positions for dropdown
	 */
	fallbackPlacements: {
		type: definePropType<Placement[]>(Array),
		default: ['bottom-start', 'top-start', 'right', 'left']
	},
	/**
	 * @description tag type
	 */
	// tagType: { ...tagProps.type, default: 'info' },
	tagType: { type: String, values: ['primary', 'success', 'info', 'warning', 'danger'], default: 'info' },
	/**
	 * @description same as `aria-label` in native input
	 */
	ariaLabel: {
		type: String,
		default: undefined
	}/*,
	// le-select 新增 todo...
	isPopover: {
		type: Boolean,
		default: true
	}*/
} as const)

export const OptionProps = buildProps({
	data: Array,
	disabled: Boolean,
	hovering: Boolean,
	item: {
		type: definePropType<Option>(Object),
		required: true
	},
	index: Number,
	style: Object,
	selected: Boolean,
	created: Boolean
} as const)
