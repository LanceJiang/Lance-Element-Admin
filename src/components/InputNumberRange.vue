<script lang="jsx">
// import { t } from 'lance-element-vue/src/locale'
import {defineComponent, unref} from 'vue'
import { useI18n } from 'vue-i18n'
import InputNumber from './InputNumber.vue'
import {useFormSize} from "element-plus";
export default defineComponent({
	name: 'LeInputNumberRange',
	emits: ['update:modelValue', 'blur', 'change'],
	components: {
		InputNumber
	},
	props: {
		modelValue: {
			type: Object,
			required: true
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
		},
		// 自定义 宽(最大值/最小值)
		itemWidth: {
			type: String,
			default: '100px'
		}
		/*
		// 前置展示
		prependVisible: {
			type: Boolean,
			default: true
		},
		// 后置展示
		appendVisible: {
			type: Boolean,
			default: true
		} */
	},
	render() {
		const { t } = useI18n()
		const { prepend, append, controlsPosition, min, max, size, ...props } = this.$attrs
		const { modelValue, placeholderStart, placeholderEnd, precision, local_propStart, local_propEnd, localStyle } = this
		const _controlsPosition = controlsPosition ?? 'right'
		const { prepend: slot_prepend, append: slot_append, ...childSlots } = this.$slots
		const inputNumberSize = size || unref(useFormSize())

		const _prepend = prepend ? <span class="le-input-number-range_addon prepend">{prepend}</span> : ''
		const _append = append ? <span class="le-input-number-range_addon append">{append}</span> : ''
		return (
			<div class={`le-input-number-range le-input-number-range--${inputNumberSize}`}>
				{slot_prepend ? slot_prepend() : _prepend}
				<InputNumber
					class="le-input-number-range_start"
					size={inputNumberSize}
					{...props}
					min={min}
					max={modelValue[local_propEnd] ?? max}
					precision={precision}
					controlsPosition={_controlsPosition}
					placeholder={t(placeholderStart)}
					style={localStyle}
					modelValue={modelValue[local_propStart]}
					v-model={modelValue[local_propStart]}
					onChange={this.onChangeStart}
					onBlur={event => this.$emit('blur', event, local_propStart)}
					v-slots={childSlots}
				/>
				<span class="le-input-number-range_line">-</span>
				<InputNumber
					class="le-input-number-range_end"
					size={inputNumberSize}
					{...props}
					min={modelValue[local_propStart] ?? min}
					max={max}
					precision={precision}
					controlsPosition={_controlsPosition}
					placeholder={t(placeholderEnd)}
					style={localStyle}
					modelValue={modelValue[local_propEnd]}
					v-model={modelValue[local_propEnd]}
					onChange={this.onChangeEnd}
					onBlur={event => this.$emit('blur', event, local_propEnd)}
					v-slots={childSlots}
				/>
				{slot_append ? slot_append() : _append}
			</div>
		)
	},
	data() {
		return {}
	},
	computed: {
		local_propStart() {
			return this.propStart || `${this.prop}Start`
		},
		local_propEnd() {
			return this.propEnd || `${this.prop}End`
		},
		localStyle() {
			let _styles = this.itemStyle
			if (this.itemWidth) _styles += `;width: ${this.itemWidth};`
			return _styles
		}
		/* has_prepend () {
			// if (this.prepend || this.$scopedSlots.prepend) return true
			if ((this.prepend || this.$scopedSlots.prepend) && this.prependVisible !== false) return true
			return false
		},
		has_append () {
			// if (this.append || this.$scopedSlots.append) return true
			if ((this.append || this.$scopedSlots.append) && this.appendVisible !== false) return true
			return false
		}, */
	},
	methods: {
		getValidValue(value, isStart) {
			const { modelValue, local_propStart, local_propEnd } = this
			if (isStart) {
				// 校验 start （start > end 改为 end）
				const endV = modelValue[local_propEnd]
				if (isNaN(endV) || endV === null) return value
				if (value > endV) return endV
				return value
			} else {
				// 校验 end （end < start 改为 start）
				const startV = modelValue[local_propStart]
				if (isNaN(startV) || value === null) return value
				if (value < startV) return startV
				return value
			}
		},
		onChangeStart(value, oldValue) {
			const { modelValue, local_propStart } = this
			// console.error(local_propStart, 'local_propStart')
			// value = this.getValidValue(value, true)
			// this.$set(modelValue, local_propStart, value)
			// modelValue[local_propStart] = value
			// this.$emit('update:modelValue', { ...modelValue, [local_propStart]: value })
			this.$emit('change', value, local_propStart)
		},
		onChangeEnd(value, oldValue) {
			const { modelValue, local_propEnd } = this
			console.error(local_propEnd, 'local_propEnd')
			// value = this.getValidValue(value, false)
			// this.$set(modelValue, local_propEnd, value)
			// modelValue[local_propEnd] = value
			// this.$emit('update:modelValue', { ...modelValue, [local_propEnd]: value })
			this.$emit('change', value, local_propEnd)
		}
	}
})
</script>