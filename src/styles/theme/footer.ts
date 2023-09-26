import { Theme } from '@/hooks/interface'

export const footerTheme: Record<Theme.ThemeType, { [key: string]: string }> = {
	light: {
		// '--el-footer-logo-text-color': '#303133',
		'--el-footer-bg-color': '#ffffff',
		'--el-footer-text-color': '#303133',
		'--el-footer-text-color-regular': '#606266',
		'--el-footer-border-color': '#e4e7ed'
	},
	inverted: {
		// '--el-footer-logo-text-color': '#dadada',
		'--el-footer-bg-color': '#191a20',
		'--el-footer-text-color': '#e5eaf3',
		'--el-footer-text-color-regular': '#cfd3dc',
		'--el-footer-border-color': '#414243'
	},
	dark: {
		// '--el-footer-logo-text-color': '#dadada',
		'--el-footer-bg-color': '#141414',
		'--el-footer-text-color': '#e5eaf3',
		'--el-footer-text-color-regular': '#cfd3dc',
		'--el-footer-border-color': '#414243'
	}
}
