<script lang="tsx">
// import { t } from 'lance-element-vue/src/locale'
import { defineComponent, unref, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InputNumber from './InputNumber.vue'
import { useFormSize } from 'element-plus'
// import { getPropValue, /*$log*/ } from '@/utils'

export default defineComponent({
	name: 'LeInputNumberRange',
	emits: {
		'update:modelValue': (value: [] | {[prop: string]: any}) => true,
		'blur': (e: Event) => true,
		'change': (value: number|null|undefined, local_propEnd: string) => true
	},
	components: {
		InputNumber
	},
	props: {
		modelValue: {
			type: [Object, Array],
			required: true
		},
		// 是否为 数组类型
		isValueArray: {
			type: Boolean,
			default: false
		},
		// 数值精度
		precision: {
			type: Number,
			default: 0
		},
		// 前缀 min prop
		propStart: {
			type: String
		},
		// 后缀 max prop
		propEnd: {
			type: String
		},
		// 默认prop
		prop: {
			type: String,
			default: ''
			// 若不定义 propStart  propEnd 则为 最小值(`${prop}Start`)   最大值(`${prop}End`)
		},
		// 最小值多语言
		placeholderStart: {
			type: String,
			default: 'le.el.input.min'
		},
		// 最大值多语言
		placeholderEnd: {
			type: String,
			default: 'le.el.input.max'
		},
		// 自定义样式(最大值/最小值)
		itemStyle: {
			type: String,
			default: ''
		}
	},
	setup(props, { attrs, slots, emit }) {
		const { t, te } = useI18n()
		const { prepend, append, controlsPosition, min, max, size, ...others } = attrs
		const _controlsPosition = controlsPosition ?? 'right'
		const { prepend: slot_prepend, append: slot_append, ...childSlots } = slots
		const inputNumberSize = size || unref(useFormSize())
		const placeholderStart = te(props.placeholderStart) ? t(props.placeholderStart) : props.placeholderStart
		const placeholderEnd = te(props.placeholderEnd) ? t(props.placeholderEnd) : props.placeholderEnd

		const _prepend = prepend ? <span class="le-input-number-range_addon prepend">{prepend}</span> : ''
		const _append = append ? <span class="le-input-number-range_addon append">{append}</span> : ''
		const propStart = computed(() => {
			if (props.isValueArray) return 0
			return props.propStart || `${props.prop}Start`
		})
		const propEnd = computed(() => {
			if (props.isValueArray) return 1
			return props.propEnd || `${props.prop}End`
		})
		const localModelValue = computed({
			get() {
				if (props.isValueArray) {
					if (Array.isArray(props.modelValue)) {
						return props.modelValue
					}
					emit('update:modelValue', [])
					return []
				}
				const val = props.modelValue
				if(!val) {
					emit('update:modelValue', {})
					return {}
				}
				return props.modelValue || {}
			},
			set(val) {
				console.error('localModelValue set', val)
				emit('update:modelValue', val)
			}
		})
		const onChangeStart = (value, oldValue) => {
			emit('change', value, propStart.value)
		}
		const onChangeEnd = (value, oldValue) => {
			emit('change', value, propEnd.value)
		}

		return () => {
			const local_propStart = propStart.value as string
			const local_propEnd = propEnd.value as string
			return 	<div class={`le-input-number-range le-input-number-range--${inputNumberSize}`}>
				{slot_prepend ? slot_prepend() : _prepend}
				<InputNumber
					class="le-input-number-range_start"
					size={inputNumberSize}
					{...others}
					min={min}
					max={localModelValue.value[local_propEnd] ?? max}
					precision={props.precision}
					controlsPosition={_controlsPosition}
					placeholder={placeholderStart}
					style={props.itemStyle}
					modelValue={localModelValue.value[local_propStart]}
					v-model={localModelValue.value[local_propStart]}
					onChange={onChangeStart}
					onBlur={event => emit('blur', event, local_propStart)}
					v-slots={childSlots}
				/>
				<span class="le-input-number-range_line">-</span>
				<InputNumber
					class="le-input-number-range_end"
					size={inputNumberSize}
					{...others}
					min={localModelValue.value[local_propStart] ?? min}
					max={max}
					precision={props.precision}
					controlsPosition={_controlsPosition}
					placeholder={placeholderEnd}
					style={props.itemStyle}
					modelValue={localModelValue.value[local_propEnd]}
					v-model={localModelValue.value[local_propEnd]}
					// v-model={getPropValue(localModelValue.value, local_propEnd)}
					onChange={onChangeEnd}
					onBlur={event => emit('blur', event, local_propEnd)}
					v-slots={childSlots}
				/>
				{slot_append ? slot_append() : _append}
			</div>
		}
	}
})
</script>
