import { Component, h } from "vue";
import ElementPlus from 'element-plus'
import DefaultTheme from 'vitepress/theme'
// 国际化
import i18n from '@/lang/index'
import /*VPApp, */{ /*NotFound,*/ globals, local_components } from '../vitepress'
import { define } from '../utils/types'
// import 'uno.css'
import type { Theme } from 'vitepress'
import './vitepress.scss'
// 引入svg注册脚本
import 'virtual:svg-icons-register'
// 加载admin-svg icon
	;(function () {
	const d = document
	// const existIconVersion = [...d.querySelectorAll('.le-icon_svg')].map(v => v.getAttribute('version')).includes(version)
	const existIconVersion = false
	if (!existIconVersion) {
		/** update 最新 le-iconfont(.css && .js) */
		const origin_prefix = '//at.alicdn.com/t/c/font_4091949_h5ex5dw89e'
		const link = d.createElement('link')
		link.rel = 'stylesheet'
		link.type = 'text/css'
		link.className = 'le-icon_iconfont'
		// link.setAttribute('version', version)
		// link.setAttribute('origin', location.origin)
		link.href = `${origin_prefix}.css`
		d.getElementsByTagName('head')[0].appendChild(link)
		const s = d.createElement('script')
		s.className = 'le-icon_svg'
		s.src = `${origin_prefix}.js`
		// s.setAttribute('version', version)
		// s.setAttribute('origin', location.origin)
		d.getElementsByTagName('head')[0].appendChild(s)
	}
})()
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
    app.use(ElementPlus).use(i18n)

    globals.forEach(([name, Comp]) => {
      app.component(name, Comp)
    })
		// 注册 Lance-Element-Admin src 全局组件
		// eslint-disable-next-line
		// @ts-ignore
		local_components.forEach((comp) => {
      app.component(comp.name || comp.displayName, comp)
    })
  },
})
