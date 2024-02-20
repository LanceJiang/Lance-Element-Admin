import { computed } from 'vue'
import { get } from 'lodash-unified'
import { useI18n } from 'vue-i18n'

import type { ISelectV2Props } from './token'
import type { Option } from './select.types'

export interface Props {
  label?: string
  value?: string
  disabled?: string
  options?: string
}

export const defaultProps: Required<Props> = {
  label: 'label',
  value: 'value',
  disabled: 'disabled',
  options: 'options',
}

export function useProps(props: Pick<ISelectV2Props, 'props'>) {
  const aliasProps = computed(() => ({ ...defaultProps, ...props.props }))
	const { t } = useI18n()

  const getLabel = (option: Option) => {
		const label = get(option, aliasProps.value.label)
		return props.i18n ? t(label) : label
	}

	/*const getLabel = (item: unknown) => {
		if (isObject(item)) {
			const label = get(item, props.labelKey)
			return props.i18n ? t(label) : label
		}
		return item
	}*/


  const getValue = (option: Option) => get(option, aliasProps.value.value)
  const getDisabled = (option: Option) => get(option, aliasProps.value.disabled)
  const getOptions = (option: Option) => get(option, aliasProps.value.options)

  return {
    aliasProps,
    getLabel,
    getValue,
    getDisabled,
    getOptions,
  }
}
