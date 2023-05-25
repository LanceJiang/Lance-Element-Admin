<script lang="ts">
import { defineComponent } from 'vue'
// 自定义渲染
const Component = defineComponent({
	name: 'AdCustomRender',
	props: {
		form: {
			required: true,
			/**
			 * { render:function(h, { form, params }) { JSX || createElement }, ...form 配置 }
			 */
			type: Object
		},
		params: {
			required: true,
			type: Object
		}
	},
	// setup(props, ctx) {
	// 	const { form, params } = props as any
	// 	const extendsParams = {
	// 		form,
	// 		params
	// 	}
	// 	return () => {
	// 		const render = form.render
	// 		if (typeof render === 'function') {
	// 			return render(null, extendsParams)
	// 		}
	// 		return ''
	// 	}
	// },
	render(h) {
		const { form, params } = this
		const extendsParams = {
			form,
			params
		}
		const render = form.render
		if (typeof render === 'function') {
			return render(h, extendsParams)
		}
		return ''
	}
})
export default Component
</script>