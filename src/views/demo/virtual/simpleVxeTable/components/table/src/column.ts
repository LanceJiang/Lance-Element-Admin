import { defineComponent } from 'vue'

export default defineComponent({
	name: 'VxeTableColumn',
	props: {
		prop: String,
		label: String,
		width: [String, Number],
		formatter: Function,
		align: {
			type: String,
			default: 'center'
		}
	},
	render() {
		return null
	}
})
