import { App } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
//全局引用icon图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import DialogForm from './FormConfigDialog.vue'
import InputNumber from './InputNumber.vue'
import InputNumberRange from './InputNumberRange.vue'
import FormConfig from './FormConfig/index.vue'
import SearchForm from './SearchForm.vue'
import LeTableColumnsPopover from '@/components/Table/components/TableColumnsPopover.vue'
import DraggableNest from '@/components/DraggableNest.vue'
import LeTable from '@/components/Table/index.vue'
import NoData from '@/components/NoData.vue'
import Icon from '@/components/Icon.vue'
import Select from '@/components/Select/index.vue'
import Chart from '@/components/Chart.vue'

// you want register components
const compList = [SvgIcon, InputNumber, InputNumberRange, DialogForm, FormConfig, SearchForm, LeTableColumnsPopover, DraggableNest, LeTable, NoData, Icon, Select, Chart]

export function registerGlobComp(app: App) {
	Object.entries(ElementPlusIconsVue).map(([key, component]) => {
		app.component(key, component)
	})
	compList.forEach(comp => {
		// eslint-disable-next-line
		// @ts-ignore
		app.component(comp.name || comp.displayName, comp)
	})
}
