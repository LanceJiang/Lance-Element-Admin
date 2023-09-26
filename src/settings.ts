import { SettingState } from '@/types'

const defaultSettingState: SettingState = {
	showSettings: true,
	// 展示底部
	footer: true,
	// 折叠菜单
	isCollapse: false,
	// 布局模式 (纵向：vertical | 经典：classic | 横向：transverse | 分栏：columns)
	layout: 'classic',
	// 主题颜色
	themeColor: '#409eff',
	// 暗黑主题
	isDark: false,
	// 侧边栏主题切换
	asideInverted: false,
	// 头部主题切换
	headerInverted: false,
	// 底部主题切换
	footerInverted: false,
	// 标签展示
	tagsView: true,
	// todo???
	fixedHeader: true,
	// 是否显示Logo
	sidebarLogo: true,
	// 手风琴
	accordion: true
}
const defaultSettings = {
	title: 'vue3_admin',

	...defaultSettingState
}

export default defaultSettings
