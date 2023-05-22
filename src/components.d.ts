// 全局组件类型声明
import TableComponent from '@/components/TableComponent/index.vue'
import FormConfig from '@/components/FormConfig.vue'
import DialogForm from '@/components/DialogForm.vue'
import SearchForm from '@/components/SearchForm.vue'

declare module '@vue/runtime-core' {
	export interface GlobalComponents {
		TableComponent: typeof TableComponent
		FormConfig: typeof FormConfig
		DialogForm: typeof DialogForm
		SearchForm: typeof SearchForm
	}
}
export {}
