import { SettingState } from '@/types'
import { name } from '@/../package.json'
export const defaultSettingState: SettingState = {
	// 开启主题设置
	showSettings: true,
	// 主题配置Visible
	settingsVisible: false,
	/** 主题模式 */
	// 主题颜色
	themeColor: '#409eff',
	// 暗黑主题
	isDark: false,
	// 灰色模式
	isGrey: false,
	// 色弱模式
	isWeak: false,
	// 侧边栏深色
	asideInverted: false,
	// 头部深色
	headerInverted: false,
	// 底部深色
	footerInverted: false,
	// 展示底部
	footer: true,
	/** 布局模式 */
	// 布局模式 (左侧菜单模式：left | 左侧菜单混合模式：leftMix | 顶部菜单模式：top | 顶部菜单混合模式：topMix)
	layout: 'left',
	/** 界面功能 */
	// 面包屑
	breadcrumb: true,
	// 面包屑图标
	breadcrumbIcon: true,
	// 面包屑图标
	animate: true,
	// 面包屑图标
	animateMode: 'fade-slide',
	// 折叠菜单
	isCollapse: false,
	// 多页签展示
	tabsVisible: true,
	// 多页签Icon
	tabsIcon: true,
	// 多页签风格
	tabsMode: 'rectangle',
	// 页面内容全屏
	contentMaximize: false,
	// 手风琴
	accordion: true
}
const defaultSettings = {
	title: name,

	...defaultSettingState
}

export default defaultSettings
