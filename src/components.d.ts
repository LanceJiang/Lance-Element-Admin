// 全局组件类型声明
import LeTable from '@/components/Table/index.vue'
import LeFormConfig from '@/components/FormConfig/index.vue'
import LeFormConfigDialog from '@/components/FormConfigDialog.vue'
import LeSearchForm from '@/components/SearchForm.vue'
import LeEditPopover from '@/components/EditPopover.vue'

declare module '@vue/runtime-core' {
	export interface GlobalComponents {
		LeTable: typeof LeTable
		LeFormConfig: typeof LeFormConfig
		LeFormConfigDialog: typeof LeFormConfigDialog
		LeSearchForm: typeof LeSearchForm
		LeEditPopover: typeof LeEditPopover
	}
}
export {}
