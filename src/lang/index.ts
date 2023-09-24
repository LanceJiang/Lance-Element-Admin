// 自定义国际化配置
import { createI18n } from 'vue-i18n'
// import { ls } from '@/utils'

// 导入 Element Plus 语言包
import ElementCnLocale from 'element-plus/es/locale/lang/zh-cn'
import ElementEnLocale from 'element-plus/es/locale/lang/en'

// 本地语言包
import enLocale from './en'
import zhCnLocale from './zh-cn'
import LeEnLocale from '@/lang/lance-element/en'
import LeCNLocale from '@/lang/lance-element/zh-cn'
export const messages = {
	'zh-cn': {
		...ElementCnLocale,
		...LeCNLocale,
		...zhCnLocale
	},
	en: {
		...ElementEnLocale,
		...LeEnLocale,
		...enLocale
	}
}

/**
 * 获取当前系统使用语言字符串
 *
 * @returns zh-cn|en ...
 */
export const getLanguage = () => {
	/*// 本地缓存获取
	let language = ls.get('language')
	if (language) {
		return language
	}*/
	// 浏览器使用语言
	const language = navigator.language.toLowerCase()
	const locales = Object.keys(messages)
	for (const locale of locales) {
		if (language.indexOf(locale) > -1) {
			return locale
		}
	}
	return 'zh-cn'
}

const i18n = createI18n({
	legacy: false,
	locale: getLanguage(),
	messages: messages
})

export default i18n
