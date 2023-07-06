<script lang="tsx">
import { defineComponent, unref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFormSize } from 'element-plus'
const Props = {
	modelValue: {},
	params: {
		type: Object
	}
	// 扩展
	// 1. prefix -> prefixIcon (prefix 已被vue 拦截)
	// prefixIcon: String, // eg: '测试Prefix'
	// 2. suffix -> suffixIcon (prefix 已被vue 拦截 与 suffix 对应做处理)
	// suffixIcon: String, // eg: '测试suffix'
	// 3. v-slot: { prefix, suffix } or slots: { prefix: render, suffix: render, }
}
const Component = defineComponent({
	name: 'LeInputNumber',
	props: Props,
	emits: [
		'change',
		// "update:modelValue"
	],
	setup(props, ctx) {
		const { t } = useI18n()
		return () => {
			const { prefixIcon, suffixIcon, prop, controlsPosition, t_placeholder, size, placeholder, max = 999999999999999, ...local_props } = ctx.attrs
			const inputNumberSize = size || unref(useFormSize())
			const _prefix = prefixIcon ? <span class="le-addon le-input-number__prefix">{prefixIcon}</span> : ''
			const _suffix = suffixIcon ? <span class="le-addon le-input-number__suffix">{suffixIcon}</span> : ''
			const _placeholder = (t_placeholder ? t(t_placeholder) : placeholder) ?? t('le.el.input.placeholder')
			const slots = Object.keys(ctx.slots).length ? ctx.slots : local_props.slots || {}
			const onChange = (...v) => {
				ctx.emit('change', ...v)
			}
			return (
				<div
					class={`le-input-number le-input-number--${inputNumberSize} el-input el-input-group
					 ${_prefix || slots.prefix ? 'el-input-group--prepend le-input-number--prefix' : ''}
					 ${_suffix || slots.suffix ? 'el-input-group--append le-input-number--suffix' : ''}
				 `}
				>
					{slots.prefix ? slots.prefix() : _prefix}
					<el-input-number
						max={max}
						{...local_props}
						onChange={onChange}
						size={inputNumberSize}
						controlsPosition={controlsPosition ?? 'right'}
						placeholder={_placeholder}
						model-value={props.modelValue}
					/>
					{slots.suffix ? slots.suffix() : _suffix}
				</div>
			)
		}
	}
	/*render() {
		const { t } = useI18n()
		const { prefix, suffix, prop, controlsPosition, placeholder, max = 999999999999999, ...props } = this.$attrs
		const { inputNumberSize, value } = this
		const $slots = this.$slots
		// const onEvents = this.$listeners

		const _prefix = prefix ? <span class="le-addon le-input-number__prefix">{prefix}</span> : ''
		const _suffix = suffix ? <span class="le-addon le-input-number__suffix">{suffix}</span> : ''
		return (
			<div
				class={`le-input-number le-input-number--${inputNumberSize} el-input el-input-group
     ${_prefix || $slots.prefix ? 'le-input-number--prefix' : ''}
     ${_suffix || $slots.suffix ? 'le-input-number--suffix' : ''}
     `}
			>
				{$slots.prefix || _prefix}
				<el-input-number
					max={max}
					{...props}
					size={inputNumberSize}
					controlsPosition={controlsPosition || 'right'}
					placeholder={placeholder || t('le.el.input.placeholder')}
					// value={this.localValue}
					value={value}
				/>
				{$slots.suffix || _suffix}
			</div>
		)
	},*/
})
export default Component
</script>