import { App } from 'vue'
//全局引用icon图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import DialogForm from './DialogForm.vue'
import FormConfig from './FormConfig.vue'
import SearchForm from './SearchForm.vue'
import TableComponent from '@/components/Table/index'
import SvgIcon from '@/components/SvgIcon/index.vue'

// you want register components
const compList = [SvgIcon, DialogForm, FormConfig, SearchForm, TableComponent]

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
