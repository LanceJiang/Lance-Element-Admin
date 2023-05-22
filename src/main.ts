import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
// element plus
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
// 注册全局组件
import { registerGlobComp } from '@/components/registerGlobComp'
// 注册全局directive
import { setupGlobDirectives } from '@/directive'
import '@/permission'

// 引入svg注册脚本
import 'virtual:svg-icons-register'

// 国际化
import i18n from '@/lang/index'
// pinia store
import pinia from '@/store/createPinia'
// 自定义样式
import '@/styles/index.scss'
import { $log } from '@/utils'

const app = createApp(App)
// 注册全局组件
registerGlobComp(app)
// 注册全局自定义指令
setupGlobDirectives(app)
// 全局方法
app.config.globalProperties.$log = $log
// 注册全局组件
app.use(router).use(ElementPlus).use(i18n).use(pinia).mount('#app')
