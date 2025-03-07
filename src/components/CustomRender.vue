<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { LeFormItem } from '@/components/FormConfig/formConfig.types.ts'
const CustomRenderProps = {
	form: {
		required: true,
		/**
		 * { render:function({ form, params }) { JSX || createElement }, ...form 配置 }
		 */
		type: Object as PropType<LeFormItem>
	},
	params: {
		required: true,
		type: Object as PropType<Recordable>
	}
}
// 自定义渲染
const Component = defineComponent({
	name: 'LeCustomRender',
	props: CustomRenderProps,
	setup(props, ctx) {
		// const { form, params } = props
		/*const extendsParams = {
			form,
			params
		}*/
		// eslint-disable-next-line vue/no-setup-props-destructure
		const render = props.form?.render
		return () => {
			if (typeof render === 'function') {
				return render(props)
				// return render(extendsParams)
			}
			return ''
		}
	}
})
export default Component
</script>
