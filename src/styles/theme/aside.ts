import { Theme } from '@/hooks/interface'

export const asideTheme: Record<Theme.ThemeType, { [key: string]: string }> = {
	light: {
		'--el-aside-border-color': '#e4e7ed'
	},
	inverted: {
		'--el-aside-border-color': '#414243'
	},
	dark: {
		'--el-aside-border-color': '#414243'
	}
}
