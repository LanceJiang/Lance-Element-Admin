interface DefaultSettings {
	title: string
	showSettings: boolean
	tagsView: boolean
	fixedHeader: boolean
	sidebarLogo: boolean
}

const defaultSettings: DefaultSettings = {
	title: 'vue3_admin',
	showSettings: true,
	tagsView: true, // 标签展示
	fixedHeader: true,
	// 是否显示Logo
	sidebarLogo: true
}

export default defaultSettings
