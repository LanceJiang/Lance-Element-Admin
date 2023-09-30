import { storeToRefs } from 'pinia'
import { Theme } from './interface'
// import { ElMessage } from 'element-plus'
import useStore from '@/store'
import { getLightColor, getDarkColor } from '@/utils/color'
import { menuTheme } from '@/styles/theme/menu'
import { asideTheme } from '@/styles/theme/aside'
import { headerTheme } from '@/styles/theme/header'
import { footerTheme } from '@/styles/theme/footer'

/**
 * @description 全局主题 hooks
 * */
export const useTheme = () => {
	const { setting } = useStore()
	const { themeColor, layout, isDark, isGrey, isWeak, asideInverted, headerInverted, footerInverted } = storeToRefs(setting)

	// 切换暗黑主题 ==> 同时修改主题颜色、侧边栏、头部颜色
	const switchDark = () => {
		const html = document.documentElement as HTMLElement
		if (isDark.value) html.setAttribute('class', 'dark')
		else html.setAttribute('class', '')
		changeThemeColor(themeColor.value)
		setAsideTheme()
		setHeaderTheme()
		setFooterTheme()
	}

	// 修改主题颜色
	const changeThemeColor = (val: string) => {
		// 计算主题颜色变化
		document.documentElement.style.setProperty('--el-color-primary', val)
		// todo...
		// document.documentElement.style.setProperty('--el-color-primary-dark-2', isDark.value ? `${getLightColor(val, 0.2)}` : `${getDarkColor(val, 0.3)}`)
		for (let i = 1; i < 10; i++) {
			const primaryColor = isDark.value ? `${getDarkColor(val, i / 10)}` : `${getLightColor(val, i / 10)}`
			document.documentElement.style.setProperty(`--el-color-primary-light-${i}`, primaryColor)
		}
		setting.changeSetting('themeColor', val)
	}

	// 灰色和弱色切换
	const changeGreyOrWeak = (type: Theme.GreyOrWeakType, value: boolean) => {
		const body = document.body as HTMLElement
		if (!value) return body.removeAttribute('style')
		const styles: Record<Theme.GreyOrWeakType, string> = {
			grey: 'filter: grayscale(1)',
			weak: 'filter: invert(80%)'
		}
		body.setAttribute('style', styles[type])
		setting.changeSetting(type === 'grey' ? 'isWeak' : 'isGrey', false)
	}

	// 设置菜单样式
	const setMenuTheme = () => {
		let type: Theme.ThemeType = 'light'
		if (layout.value === 'top' && headerInverted.value) type = 'inverted'
		if (layout.value !== 'top' && asideInverted.value) type = 'inverted'
		if (isDark.value) type = 'dark'
		const theme = menuTheme[type!]
		// console.error(type, 'type theme', theme)
		for (const [key, value] of Object.entries(theme)) {
			document.documentElement.style.setProperty(key, value)
		}
	}

	// 设置侧边栏样式
	const setAsideTheme = () => {
		let type: Theme.ThemeType = 'light'
		if (asideInverted.value) type = 'inverted'
		if (isDark.value) type = 'dark'
		const theme = asideTheme[type!]
		for (const [key, value] of Object.entries(theme)) {
			document.documentElement.style.setProperty(key, value)
		}
		setMenuTheme()
	}

	// 设置头部样式
	const setHeaderTheme = () => {
		let type: Theme.ThemeType = 'light'
		if (headerInverted.value) type = 'inverted'
		if (isDark.value) type = 'dark'
		const theme = headerTheme[type!]
		for (const [key, value] of Object.entries(theme)) {
			document.documentElement.style.setProperty(key, value)
		}
		setMenuTheme()
	}
	// 设置底部样式
	const setFooterTheme = () => {
		let type: Theme.ThemeType = 'light'
		if (footerInverted.value) type = 'inverted'
		if (isDark.value) type = 'dark'
		const theme = footerTheme[type!]
		for (const [key, value] of Object.entries(theme)) {
			document.documentElement.style.setProperty(key, value)
		}
		setMenuTheme()
	}

	// init theme
	const initTheme = () => {
		switchDark()
		if (isGrey.value) changeGreyOrWeak('grey', true)
		if (isWeak.value) changeGreyOrWeak('weak', true)
	}

	return {
		initTheme,
		switchDark,
		changeThemeColor,
		changeGreyOrWeak,
		setAsideTheme,
		setHeaderTheme,
		setFooterTheme
	}
}
