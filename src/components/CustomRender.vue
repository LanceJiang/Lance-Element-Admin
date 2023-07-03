<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { LeFormItem, ObjectOpts } from '@/components/FormConfig/formConfig.types.ts'
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
		type: Object as PropType<ObjectOpts>
	}
}
// 自定义渲染
const Component = defineComponent({
	name: 'LeCustomRender',
	props: CustomRenderProps,
	setup(props, ctx) {
		const { form, params } = props
		/*const extendsParams = {
			form,
			params
		}*/
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
