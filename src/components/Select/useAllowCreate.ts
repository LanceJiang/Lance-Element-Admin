// eslint-disable-next-line
// @ts-nocheck
import { computed, ref } from 'vue'
import type { ISelectProps } from './token'
import type { Option } from './select.types'

export function useAllowCreate(props: ISelectProps, states) {
	const createOptionCount = ref(0)
	const cachedSelectedOption = ref<Option>(null)

	const enableAllowCreateMode = computed(() => {
		return props.allowCreate && props.filterable
	})

	// const labelPaths = computed(() => {
	// 	return (props.labelKey || 'label').split('.')
	// })
	//
	// const valuePaths = computed(() => {
	// 	return (props.valueKey || 'value').split('.')
	// })

	function hasExistingOption(query: string) {
		const hasValue = option => option.value === query
		return (props.options && props.options.some(hasValue)) || states.createdOptions.some(hasValue)
	}

	function selectNewOption(option: Option) {
		if (!enableAllowCreateMode.value) {
			return
		}
		if (props.multiple && option.created) {
			createOptionCount.value++
		} else {
			cachedSelectedOption.value = option
		}
	}

	function createNewOption(query: string) {
		if (enableAllowCreateMode.value) {
			if (query && query.length > 0 && !hasExistingOption(query)) {
				// const [labelKey, ...labels] = labelPaths.value
				// const [valueKey, ...values] = valuePaths.value

				const newOption = {
					[props.valueKey]: query,
					[props.labelKey]: query,
					le_label: query,
					created: true,
					disabled: false
				}
				if (states.createdOptions.length >= createOptionCount.value) {
					states.createdOptions[createOptionCount.value] = newOption
				} else {
					states.createdOptions.push(newOption)
				}
			} else {
				if (props.multiple) {
					states.createdOptions.length = createOptionCount.value
				} else {
					const selectedOption = cachedSelectedOption.value
					states.createdOptions.length = 0
					if (selectedOption && selectedOption.created) {
						states.createdOptions.push(selectedOption)
					}
				}
			}
		}
	}

	function removeNewOption(option: Option) {
		if (
			!enableAllowCreateMode.value ||
			!option ||
			!option.created ||
			(option.created && props.reserveKeyword && states.inputValue === option.label)
		) {
			return
		}
		const idx = states.createdOptions.findIndex(it => it.value === option.value)
		if (~idx) {
			states.createdOptions.splice(idx, 1)
			createOptionCount.value--
		}
	}

	function clearAllNewOption() {
		if (enableAllowCreateMode.value) {
			states.createdOptions.length = 0
			createOptionCount.value = 0
		}
	}

	return {
		createNewOption,
		removeNewOption,
		selectNewOption,
		clearAllNewOption
	}
}
