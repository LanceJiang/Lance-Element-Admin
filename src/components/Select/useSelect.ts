/* eslint-disable */
// @ts-nocheck
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { isArray, isFunction, isObject } from '@vue/shared'
import { get, isEqual, isNil, debounce as lodashDebounce } from 'lodash-unified'
import { useResizeObserver } from '@vueuse/core'
// import { useLocale, useNamespace } from '@element-plus/hooks'
import { useLocale, useNamespace } from 'element-plus/es/hooks/index.mjs'
// import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '@element-plus/constants'
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from 'element-plus/es/constants/index.mjs'
// import { ValidateComponentsMap, debugWarn, escapeStringRegexp } from '@element-plus/utils'
import { ValidateComponentsMap, debugWarn, escapeStringRegexp } from 'element-plus/es/utils/index.mjs'
// import { useFormItem, useFormSize } from '@element-plus/components/form'
import { useFormItem, useFormSize } from 'element-plus/es/components/form/index.mjs'

import { ArrowUp, Search } from '@element-plus/icons-vue'
import { useAllowCreate } from './useAllowCreate'

import { flattenOptions } from './util'

import { useInput } from './useInput'
import type ElTooltip from '@element-plus/components/tooltip'
import type { SelectProps } from './defaults'
import type { CSSProperties, ExtractPropTypes } from 'vue'
import type { Option, OptionType } from './select.types'
import { useI18n } from 'vue-i18n'

const DEFAULT_INPUT_PLACEHOLDER = ''
const MINIMUM_INPUT_WIDTH = 11
const TAG_BASE_WIDTH = {
	// larget: 51,
	// default: 42,
	// small: 33
	larget: 61,
	default: 52,
	small: 43
}

const useSelect = (props: ExtractPropTypes<typeof SelectProps>, emit) => {
	// inject
	// const { t } = useLocale()
	const { t } = useI18n()
	const nsSelectV2 = useNamespace('select-v2')
	const nsInput = useNamespace('input')
	const { form: elForm, formItem: elFormItem } = useFormItem()

	const states = reactive({
		inputValue: DEFAULT_INPUT_PLACEHOLDER,
		displayInputValue: DEFAULT_INPUT_PLACEHOLDER,
		calculatedWidth: 0,
		cachedPlaceholder: '',
		cachedOptions: [] as Option[],
		createdOptions: [] as Option[],
		createdLabel: '',
		createdSelected: false,
		currentPlaceholder: '',
		hoveringIndex: -1,
		comboBoxHovering: false,
		isOnComposition: false,
		isSilentBlur: false,
		isComposing: false,
		inputLength: 20,
		selectWidth: 200,
		initialInputHeight: 0,
		previousQuery: null,
		previousValue: undefined,
		query: '',
		selectedLabel: '',
		selectedItem: null,
		softFocus: false,
		tagInMultiLine: false
	})

	// data refs
	const selectedIndex = ref(-1)
	const popperSize = ref(-1)

	// DOM & Component refs
	const controlRef = ref(null)
	const inputRef = ref(null) // el-input ref
	const menuRef = ref(null)
	const popper = ref<InstanceType<typeof ElTooltip> | null>(null)
	const selectRef = ref(null)
	const selectionRef = ref(null) // tags ref
	const calculatorRef = ref<HTMLElement>(null)

	// the controller of the expanded popup
	const expanded = ref(false)

	const selectDisabled = computed(() => props.disabled || elForm?.disabled)

	const popupHeight = computed(() => {
		const totalHeight = filteredOptions.value.length * 34
		return totalHeight > props.height ? props.height : totalHeight
	})

	const hasModelValue = computed(() => {
		return !isNil(props.modelValue)
	})

	const showClearBtn = computed(() => {
		const hasValue = props.multiple ? Array.isArray(props.modelValue) && props.modelValue.length > 0 : hasModelValue.value

		const criteria = props.clearable && !selectDisabled.value && states.comboBoxHovering && hasValue
		return criteria
	})

	const iconComponent = computed(() => (props.remote && props.filterable ? '' : props.isPopover ? ArrowUp : Search))

	const iconReverse = computed(() => iconComponent.value && nsSelectV2.is('reverse', props.isPopover ? expanded.value : true))

	const validateState = computed(() => elFormItem?.validateState || '')
	const validateIcon = computed(() => ValidateComponentsMap[validateState.value])

	const debounce = computed(() => (props.remote ? 300 : 0))

	// filteredOptions includes flatten the data into one dimensional array.
	const emptyText = computed(() => {
		const options = filteredOptions.value
		if (props.loading) {
			return props.loadingText || t('el.select.loading')
		} else {
			if (props.remote && states.inputValue === '' && options.length === 0) return false
			if (props.filterable && states.inputValue && options.length > 0) {
				return props.noMatchText || t('el.select.noMatch')
			}
			if (options.length === 0) {
				return props.noDataText || t('el.select.noData')
			}
		}
		return null
	})

	const getValueKey = (item: unknown) => {
		return isObject(item) ? get(item, props.valueKey) : item
	}

	// if the selected item is item then we get label via indexing
	// otherwise it should be string we simply return the item itself.
	const getLabel = (item: unknown) => {
		if (isObject(item)) {
			const label = get(item, props.labelKey)
			return props.i18n ? t(label) : label
		}
		return item
	}

	const getLocalOption = option => {
		return { ...option, le_label: getLabel(option) }
	}
	const local_options = computed(() => {
		const options = props.options || []
		/*props.options?.flat(Number.MAX_SAFE_INTEGER).map(v => {
		// props.options?.map(v => {
			v.le_label = getLabel(v)
		})
		return options*/
		return options.map((v, i) => {
			if (isArray(v.options)) {
				return {
					...v,
					options: v.options.map(getLocalOption)
				}
			}
			return getLocalOption(v)
		})
	})

	const filteredOptions = computed(() => {
		// return []
		const isValidOption = (o: Option): boolean => {
			// fill the conditions here.
			const query = states.inputValue
			// when query was given, we should test on the label see whether the label contains the given query
			const regexp = new RegExp(escapeStringRegexp(query), 'i')
			// const containsQueryString = query ? regexp.test(getLabel(o)) : true
			const containsQueryString = query ? regexp.test(o.le_label) : true
			return containsQueryString
		}
		if (props.loading) {
			return []
		}
		return flattenOptions(
			(local_options.value as OptionType[])
				.concat(states.createdOptions)
				.map(v => {
					if (isArray(v.options)) {
						const filtered = v.options.filter(isValidOption)
						if (filtered.length > 0) {
							return {
								...v,
								options: filtered
							}
						}
					} else {
						if (props.remote || isValidOption(v as Option)) {
							return v
						}
					}
					return null
				})
				.filter(v => v !== null)
		)
	})

	const indeterminateClass = ref('')
	// 是否全选
	const isCheckAll = computed(() => {
		// const { options, computedOptions, value } = this
		// const { options, filteredOptions, modelValue } = TheCtx
		const showVals = filteredOptions.value.map(v => getValueKey(v))
		indeterminateClass.value = ''
		const modelValue = props.modelValue
		if (!Array.isArray(modelValue)) return false
		if (props.options.length > 0 && modelValue.length > 0) {
			if (showVals.some(v => modelValue.includes(v))) indeterminateClass.value = 'indeterminate'
			return showVals.every(v => modelValue.includes(v))
		}
	})
	// le-select 新增
	// 全选与反选
	const checkAllHandler = () => {
		if (props.multiple) {
			const localOptions = filteredOptions.value
			const localValues = localOptions.map(v => getValueKey(v))
			const selectedOptions = props.modelValue as any[]
			let value = []
			if (isCheckAll.value) {
				// 取消全选
				value = selectedOptions.filter(v => !localValues.includes(v))
				localValues.forEach(optionValue => {
					const itemIndex = states.cachedOptions.findIndex(option => getValueKey(option) === optionValue)
					if (itemIndex > -1) {
						states.cachedOptions.splice(itemIndex, 1)
					}
				})
			} else {
				// 全选
				/*value = [...new Set((selectedOptions || []).concat(localValues))]
				localOptions.forEach(v => {
					const i = getValueIndex(selectedOptions, getValueKey(v))
					if (i === -1) {
						states.cachedOptions.push(v)
					}
				})*/
				localOptions.forEach(v => {
					const l_value = getValueKey(v)
					const i = getValueIndex(selectedOptions, l_value)
					if (i === -1) {
						states.cachedOptions.push(v)
						value.push(l_value)
					}
				})
				value = selectedOptions.concat(value)
			}
			update(value)
			if (states.displayInputValue.length > 0) {
				onUpdateInputValue('')
			}
			resetInputHeight()
			setSoftFocus()
		}
	}

	const optionsAllDisabled = computed(() => filteredOptions.value.every(option => option.disabled))

	const selectSize = useFormSize()

	const collapseTagSize = computed(() => ('small' === selectSize.value ? 'small' : 'default'))

	const tagMaxWidth = computed(() => {
		// const select = selectionRef.value
		const size = collapseTagSize.value || 'default'
		// const paddingLeft = select ? Number.parseInt(getComputedStyle(select).paddingLeft) : 0
		// const paddingRight = select ? Number.parseInt(getComputedStyle(select).paddingRight) : 0
		// return states.selectWidth - paddingRight - paddingLeft - TAG_BASE_WIDTH[size]
		return TAG_BASE_WIDTH[size]
	})

	const calculatePopperSize = () => {
		popperSize.value = selectRef.value?.offsetWidth || 200
	}

	const inputWrapperStyle = computed(() => {
		return {
			width: `${states.calculatedWidth === 0 ? MINIMUM_INPUT_WIDTH : Math.ceil(states.calculatedWidth) + MINIMUM_INPUT_WIDTH}px`
		} as CSSProperties
	})

	const shouldShowPlaceholder = computed(() => {
		if (isArray(props.modelValue)) {
			return props.modelValue.length === 0 && !states.displayInputValue
		}

		// when it's not multiple mode, we only determine this flag based on filterable and expanded
		// when filterable flag is true, which means we have input box on the screen
		return props.filterable ? states.displayInputValue.length === 0 : true
	})
	const currentPlaceholder = computed(() => {
		const _placeholder = props.placeholder || t('el.select.placeholder')
		return props.multiple || isNil(props.modelValue) ? _placeholder : props.i18n ? getLabel(states.selectedItem) : states.selectedItem?.le_label
		// return props.multiple || isNil(props.modelValue) ? _placeholder : states.selectedLabel
	})

	// this obtains the actual popper DOM element.
	const popperRef = computed(() => popper.value?.popperRef?.contentRef)

	// the index with current value in options
	const indexRef = computed<number>(() => {
		const valueKey = props.valueKey
		const localOptions = filteredOptions.value
		if (props.multiple) {
			const len = (props.modelValue as []).length
			if ((props.modelValue as Array<any>).length > 0) {
				return localOptions.findIndex(o => o[valueKey] === props.modelValue[len - 1])
			}
		} else {
			if (props.modelValue) {
				return localOptions.findIndex(o => o[valueKey] === props.modelValue)
			}
		}
		return -1
	})

	const dropdownMenuVisible = computed({
		get() {
			return expanded.value && emptyText.value !== false
		},
		set(val: boolean) {
			expanded.value = val
		}
	})

	const showTagList = computed(() => states.cachedOptions.slice(0, props.maxCollapseTags))

	const collapseTagList = computed(() => states.cachedOptions.slice(props.maxCollapseTags))

	// hooks
	const { createNewOption, removeNewOption, selectNewOption, clearAllNewOption } = useAllowCreate(props, states)
	const { handleCompositionStart, handleCompositionUpdate, handleCompositionEnd } = useInput(e => onInput(e))

	// methods
	const focusAndUpdatePopup = () => {
		inputRef.value?.focus?.()
		popper.value?.updatePopper?.()
	}

	const toggleMenu = () => {
		if (props.automaticDropdown) return
		if (!selectDisabled.value) {
			if (states.isComposing) states.softFocus = true
			return nextTick(() => {
				expanded.value = !expanded.value
				inputRef.value?.focus?.()
			})
		}
	}

	const onInputChange = () => {
		if (props.filterable && states.inputValue !== states.selectedLabel) {
			states.query = states.selectedLabel
		}
		handleQueryChange(states.inputValue)
		return nextTick(() => {
			createNewOption(states.inputValue)
		})
	}

	const debouncedOnInputChange = lodashDebounce(onInputChange, debounce.value)

	const handleQueryChange = (val: string) => {
		if (states.previousQuery === val) {
			return
		}
		states.previousQuery = val
		if (props.filterable && isFunction(props.filterMethod)) {
			props.filterMethod(val)
		} else if (props.filterable && props.remote && isFunction(props.remoteMethod)) {
			props.remoteMethod(val)
		}
	}

	const emitChange = (val: any | any[]) => {
		if (!isEqual(props.modelValue, val)) {
			emit(CHANGE_EVENT, val)
		}
	}

	const update = (val: any) => {
		// console.error(states.cachedOptions, 'states.cachedOptions, new modelValue', val)
		emit(UPDATE_MODEL_EVENT, val)
		emitChange(val)
		states.previousValue = val?.toString()
	}

	const getValueIndex = (arr = [], value: unknown) => {
		if (!isObject(value)) {
			return arr.indexOf(value)
		}
		const valueKey = props.valueKey
		let index = -1
		arr.some((item, i) => {
			if (get(item, valueKey) === get(value, valueKey)) {
				index = i
				return true
			}
			return false
		})
		return index
	}

	const resetInputHeight = () => {
		return nextTick(() => {
			if (!inputRef.value) return
			const selection = selectionRef.value

			selectRef.value.height = selection.offsetHeight
			if (expanded.value && emptyText.value !== false) {
				popper.value?.updatePopper?.()
			}
		})
	}

	const handleResize = () => {
		resetInputWidth()
		calculatePopperSize()
		popper.value?.updatePopper?.()
		if (props.multiple) {
			return resetInputHeight()
		}
	}

	const resetInputWidth = () => {
		const select = selectionRef.value
		if (select) {
			states.selectWidth = select.getBoundingClientRect().width
		}
	}

	const onSelect = (option: Option, idx: number, byClick = true) => {
		if (props.multiple) {
			let selectedOptions = (props.modelValue as any[]).slice()

			const index = getValueIndex(selectedOptions, getValueKey(option))
			if (index > -1) {
				selectedOptions = [...selectedOptions.slice(0, index), ...selectedOptions.slice(index + 1)]
				states.cachedOptions.splice(index, 1)
				removeNewOption(option)
			} else if (props.multipleLimit <= 0 || selectedOptions.length < props.multipleLimit) {
				selectedOptions = [...selectedOptions, getValueKey(option)]
				states.cachedOptions.push(option)
				selectNewOption(option)
				updateHoveringIndex(idx)
			}
			update(selectedOptions)
			if (option.created) {
				states.query = ''
				handleQueryChange('')
				states.inputLength = 20
			}
			if (props.filterable && !props.reserveKeyword) {
				inputRef.value.focus?.()
				onUpdateInputValue('')
			}
			if (props.filterable) {
				states.calculatedWidth = calculatorRef.value.getBoundingClientRect().width
			}
			resetInputHeight()
			setSoftFocus()
		} else {
			selectedIndex.value = idx
			states.selectedItem = option
			// states.selectedLabel = option.le_label
			update(getValueKey(option))
			expanded.value = false
			states.isComposing = false
			states.isSilentBlur = byClick
			selectNewOption(option)
			if (!option.created) {
				clearAllNewOption()
			}
			updateHoveringIndex(idx)
		}
	}

	const deleteTag = (event: MouseEvent, tag: Option) => {
		const { valueKey } = props
		const index = (props.modelValue as Array<any>).indexOf(get(tag, valueKey))

		if (index > -1 && !selectDisabled.value) {
			const value = [...(props.modelValue as Array<unknown>).slice(0, index), ...(props.modelValue as Array<unknown>).slice(index + 1)]
			states.cachedOptions.splice(index, 1)
			update(value)
			emit('remove-tag', get(tag, valueKey))
			states.softFocus = true
			removeNewOption(tag)
			return nextTick(focusAndUpdatePopup)
		}
		event.stopPropagation()
	}

	const handleFocus = (event: FocusEvent) => {
		const focused = states.isComposing
		states.isComposing = true
		if (!states.softFocus) {
			// If already in the focus state, shouldn't trigger event
			if (!focused) emit('focus', event)
		} else {
			states.softFocus = false
		}
	}

	const handleBlur = (event: FocusEvent) => {
		states.softFocus = false

		// reset input value when blurred
		// https://github.com/ElemeFE/element/pull/10822
		return nextTick(() => {
			inputRef.value?.blur?.()
			if (calculatorRef.value) {
				states.calculatedWidth = calculatorRef.value.getBoundingClientRect().width
			}
			if (states.isSilentBlur) {
				states.isSilentBlur = false
			} else {
				if (states.isComposing) {
					emit('blur', event)
				}
			}
			states.isComposing = false
		})
	}

	// keyboard handlers
	const handleEsc = () => {
		if (states.displayInputValue.length > 0) {
			onUpdateInputValue('')
		} else {
			expanded.value = false
		}
	}

	const handleDel = (e: KeyboardEvent) => {
		if (states.displayInputValue.length === 0) {
			e.preventDefault()
			const selected = (props.modelValue as Array<any>).slice()
			selected.pop()
			removeNewOption(states.cachedOptions.pop())
			update(selected)
		}
	}

	const handleClear = () => {
		let emptyValue: string | any[]
		if (isArray(props.modelValue)) {
			emptyValue = []
		} else {
			emptyValue = undefined
		}

		states.softFocus = true
		if (props.multiple) {
			states.cachedOptions = []
		} else {
			states.selectedItem = null
			// states.selectedLabel = ''
		}
		expanded.value = false
		update(emptyValue)
		emit('clear')
		clearAllNewOption()
		return nextTick(focusAndUpdatePopup)
	}

	const onUpdateInputValue = (val: string) => {
		states.displayInputValue = val
		states.inputValue = val
	}

	const onKeyboardNavigate = (direction: 'forward' | 'backward', hoveringIndex: number = undefined) => {
		const options = filteredOptions.value
		if (!['forward', 'backward'].includes(direction) || selectDisabled.value || options.length <= 0 || optionsAllDisabled.value) {
			return
		}
		if (!expanded.value) {
			return toggleMenu()
		}
		if (hoveringIndex === undefined) {
			hoveringIndex = states.hoveringIndex
		}
		let newIndex = -1
		if (direction === 'forward') {
			newIndex = hoveringIndex + 1
			if (newIndex >= options.length) {
				// return to the first option
				newIndex = 0
			}
		} else if (direction === 'backward') {
			newIndex = hoveringIndex - 1
			if (newIndex < 0 || newIndex >= options.length) {
				// navigate to the last one
				newIndex = options.length - 1
			}
		}
		const option = options[newIndex]
		if (option.disabled || option.type === 'Group') {
			// prevent dispatching multiple nextTick callbacks.
			return onKeyboardNavigate(direction, newIndex)
		} else {
			updateHoveringIndex(newIndex)
			scrollToItem(newIndex)
		}
	}

	const onKeyboardSelect = () => {
		if (!expanded.value) {
			return toggleMenu()
		} else if (~states.hoveringIndex && filteredOptions.value[states.hoveringIndex]) {
			onSelect(filteredOptions.value[states.hoveringIndex], states.hoveringIndex, false)
		}
	}

	const updateHoveringIndex = (idx: number) => {
		states.hoveringIndex = idx
	}

	const resetHoveringIndex = () => {
		states.hoveringIndex = -1
	}

	const setSoftFocus = () => {
		const _input = inputRef.value
		if (_input) {
			_input.focus?.()
		}
	}

	const onInput = event => {
		const value = event.target.value
		onUpdateInputValue(value)
		if (states.displayInputValue.length > 0 && !expanded.value) {
			expanded.value = true
		}

		states.calculatedWidth = calculatorRef.value.getBoundingClientRect().width
		if (props.multiple) {
			resetInputHeight()
		}
		if (props.remote) {
			debouncedOnInputChange()
		} else {
			return onInputChange()
		}
	}

	const handleClickOutside = () => {
		expanded.value = false
		return handleBlur()
	}

	const handleMenuEnter = () => {
		states.inputValue = states.displayInputValue
		return nextTick(() => {
			if (~indexRef.value) {
				updateHoveringIndex(indexRef.value)
				scrollToItem(states.hoveringIndex)
			}
		})
	}

	const scrollToItem = (index: number) => {
		menuRef.value.scrollToItem(index)
	}

	const initStates = () => {
		resetHoveringIndex()
		if (props.multiple) {
			if ((props.modelValue as Array<any>).length > 0) {
				let initHovering = false
				states.cachedOptions.length = 0
				states.previousValue = props.modelValue.toString()
				;(props.modelValue as Array<any>).forEach(selected => {
					const itemIndex = filteredOptions.value.findIndex(option => getValueKey(option) === selected)
					if (~itemIndex) {
						states.cachedOptions.push(filteredOptions.value[itemIndex] as Option)
						if (!initHovering) {
							updateHoveringIndex(itemIndex)
						}
						initHovering = true
					}
				})
			} else {
				states.cachedOptions = []
				states.previousValue = undefined
			}
		} else {
			if (hasModelValue.value) {
				states.previousValue = props.modelValue
				const options = filteredOptions.value
				const selectedItemIndex = options.findIndex(option => getValueKey(option) === getValueKey(props.modelValue))
				if (~selectedItemIndex) {
					states.selectedItem = options[selectedItemIndex]
					// states.selectedLabel = options[selectedItemIndex].le_label
					updateHoveringIndex(selectedItemIndex)
				} else {
					states.selectedItem = { le_label: props.modelValue, [props.labelKey]: props.modelValue }
					// states.selectedLabel = `${props.modelValue}`
				}
			} else {
				states.selectedItem = null
				// states.selectedLabel = ''
				states.previousValue = undefined
			}
		}
		clearAllNewOption()
		calculatePopperSize()
	}

	// in order to track these individually, we need to turn them into refs instead of watching the entire
	// reactive object which could cause perf penalty when unnecessary field gets changed the watch method will
	// be invoked.

	watch(expanded, val => {
		emit('visible-change', val)
		if (val) {
			popper.value.update?.()
			// the purpose of this function is to differ the blur event trigger mechanism
		} else {
			states.displayInputValue = ''
			states.previousQuery = null
			// 非弹窗 重置筛选列表
			if (!props.isPopover) {
				states.inputValue = ''
			}
			createNewOption('')
		}
	})

	watch(
		() => props.modelValue,
		(val, oldVal) => {
			if (!val || val.toString() !== states.previousValue) {
				initStates()
			}
			if (!isEqual(val, oldVal) && props.validateEvent) {
				elFormItem?.validate?.('change').catch(err => debugWarn(err))
			}
		},
		{
			deep: true
			// immediate: true
		}
	)

	if (props.multiple) {
		watch(
			() => states.cachedOptions,
			() => {
				const labels = props.i18n ? states.cachedOptions.map(getLabel) : states.cachedOptions.map(v => v.le_label)
				emit('update:selected_label', labels)
			},
			{
				immediate: true
			}
		)
	} else {
		watch(
			() => states.selectedItem,
			() => {
				const label = props.i18n ? getLabel(states.selectedItem) : states.selectedItem?.le_label
				states.selectedLabel = label
				emit('update:selected_label', label)
			},
			{
				immediate: true,
				deep: true
			}
		)
	}

	watch(
		() => props.options,
		() => {
			const input = inputRef.value
			// filter or remote-search scenarios are not initialized
			if (!input || (input && document.activeElement !== input)) {
				initStates()
			}
		},
		{
			deep: true
		}
	)

	// fix the problem that scrollTop is not reset in filterable mode
	watch(filteredOptions, () => {
		return nextTick(menuRef.value.resetScrollTop)
	})

	watch(
		() => dropdownMenuVisible.value,
		val => {
			if (!val) {
				resetHoveringIndex()
			}
		}
	)

	onMounted(() => {
		initStates()
	})
	useResizeObserver(selectRef, handleResize)

	return {
		// data exports
		collapseTagSize,
		currentPlaceholder,
		expanded,
		emptyText,
		popupHeight,
		debounce,
		filteredOptions,
		iconComponent,
		iconReverse,
		inputWrapperStyle,
		popperSize,
		dropdownMenuVisible,
		hasModelValue,
		// readonly,
		shouldShowPlaceholder,
		selectDisabled,
		selectSize,
		showClearBtn,
		states,
		tagMaxWidth,
		nsSelectV2,
		nsInput,
		isCheckAll,
		indeterminateClass,

		// refs items exports
		calculatorRef,
		controlRef,
		inputRef,
		menuRef,
		popper,
		selectRef,
		selectionRef,

		popperRef,

		validateState,
		validateIcon,
		showTagList,
		collapseTagList,

		// methods exports
		t,
		checkAllHandler,
		debouncedOnInputChange,
		deleteTag,
		getLabel,
		getValueKey,
		handleBlur,
		handleClear,
		handleClickOutside,
		handleDel,
		handleEsc,
		handleFocus,
		handleMenuEnter,
		handleResize,
		toggleMenu,
		scrollTo: scrollToItem,
		onInput,
		onKeyboardNavigate,
		onKeyboardSelect,
		onSelect,
		onHover: updateHoveringIndex,
		onUpdateInputValue,
		handleCompositionStart,
		handleCompositionEnd,
		handleCompositionUpdate
	}
}

export default useSelect
