import { h } from 'vue'
import ElementPlus from 'element-plus'
import DefaultTheme from 'vitepress/theme'
import /*VPApp, */{ /*NotFound,*/ globals } from '../vitepress'
import { define } from '../utils/types'
// import 'uno.css'
import type { Theme } from 'vitepress'
import './vitepress.scss'
export default define<Theme>({
	extends: DefaultTheme,
  // NotFound,
  // Layout: VPApp,
	Layout: () => {
	  return h(DefaultTheme.Layout, null, {
	    // https://vitepress.dev/guide/extending-default-theme#layout-slots
	  })
	},
  enhanceApp: ({ app }) => {
    app.use(ElementPlus)

    globals.forEach(([name, Comp]) => {
      app.component(name, Comp)
    })
  },
})
