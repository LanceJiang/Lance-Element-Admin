import { ComponentCustomProperties } from 'vue'
// 全局组件类型声明
import LeTable from '@/components/Table/index.vue'
import TableAction from '@/components/Table/TableAction.vue'
import LeFormConfig from '@/components/FormConfig/index.vue'
import LeFormConfigDialog from '@/components/FormConfigDialog.vue'
import LeSearchForm from '@/components/SearchForm.vue'
import LeEditPopover from '@/components/EditPopover.vue'
import MonacoEditor from '@/components/MonacoEditor'
import LeChart from '@/components/Chart.vue'
import LeIcon from '@/components/Icon.vue'
import LeText from '@/components/Text.vue'
import { $log } from '@/utils'
import { VueI18n } from 'vue-i18n'

export declare module '@vue/runtime-core' {
	export interface GlobalComponents {
		LeTable: typeof LeTable
		TableAction: typeof TableAction
		LeFormConfig: typeof LeFormConfig
		LeFormConfigDialog: typeof LeFormConfigDialog
		LeSearchForm: typeof LeSearchForm
		LeEditPopover: typeof LeEditPopover
		MonacoEditor: typeof MonacoEditor
		LeChart: typeof LeChart
		LeIcon: typeof LeIcon
		LeText: typeof LeText
	}

	// 为 `this.$i18n...` 提供类型声明
	interface ComponentCustomProperties {
		$i18n: VueI18n
		$t: typeof VueI18n.prototype.t
		$tc: typeof VueI18n.prototype.tc
		$te: typeof VueI18n.prototype.te
		$d: typeof VueI18n.prototype.d
		$log: typeof $log
	}
}
export {}
