import { defineConfig } from "vitepress";
import { mdPlugin } from './_config'
// https://vitepress.dev/reference/site-config
// 导航
const nav = [
	{
		text: "指南",
		items: [
			{ text: "介绍", link: "/guide/introduction" },
			{ text: "项目结构", link: "/guide/directory" },
			{ text: "路由", link: "/guide/router" },
			{ text: "配置", link: "/guide/config" },
		],
	},
	{
		text: "组件",
		link: "/component/LeSelect",
		activeMatch: '/component/'
	}
]

// 侧边栏导航
const sidebar = {
	// 组件
	'/component/': [
		{
			text: '组件',
			items: [
				{
					text: 'LeSelect 选择器',
					link: '/component/LeSelect',
				},
				{
					text: 'LeInputNumber 数字输入框',
					link: '/component/LeInputNumber',
				},
				{
					text: 'LeInputNumberRange 数字区间',
					link: '/component/LeInputNumberRange',
				},
				{
					text: 'LeChart 图表组件',
					link: '/component/LeChart',
				},
				{
					text: 'LeSearchForm 搜索表单',
					link: '/component/LeSearchForm',
				},
				{
					text: 'LeIcon SvgIcon',
					link: '/component/LeIcon',
				},
			],
		},
	],
	// 指南
	'/guide/': [
		{
			text: "指南",
			items: [
				{ text: "介绍", link: "/guide/introduction" },
				{ text: "快速了解", link: "/guide/quick-understanding" },
				{ text: "项目结构", link: "/guide/directory" },
				{ text: "构建 & 部署", link: "/guide/deploy" },
				{ text: "配置", link: "/guide/config" },
				{ text: "路由", link: "/guide/router" },
				{ text: "更新日志", link: "/guide/uplog" },
			],
		},
		{
			text: "其它",
			items: [
				{ text: "常见问题", link: "/other/faq" },
				{ text: "加入我们", link: "/other/follow" },
			],
		},
	]
}
export default defineConfig({
	base: process.env.NODE_ENV === "production" ? "/Lance-Element-Admin-Docs/" : "/",
	// lang: "zh-CN",
	title: "Lance-Element-Admin",
	description: "Vue3、TS、Element-Plus、Pinia 和 Vite",
	lastUpdated: true,
	cleanUrls: true,
	/*locales: {
		root: {
			label: '中文',
			lang: 'zh-CN'
			// link: '/zh-CN'
		},
		'zh-CN': {
			label: '中文',
			lang: 'zh-CN',
			link: '/zh-CN'
		}
	},*/
	themeConfig: {
		// siteTitle: false,
		logo: "/favicon.ico",
		// logo: "/logo.jpg",
		// 主导航
		nav,
		// 侧边栏导航
		sidebar,
		socialLinks: [
			{ icon: "github", link: "https://github.com/LanceJiang" }
		],
		// 搜索
		search: {
			provider: "local"
		},
		darkModeSwitchLabel: "切换主题",
		sidebarMenuLabel: "菜单",
		returnToTopLabel: "回到顶部",
		docFooter: {
			prev: "上一页",
			next: "下一页"
		}
	},
	markdown: {
		config: (md) => mdPlugin(md),
	},
	vue: {
		// template: {
		// 	ssr: true,
		// 	compilerOptions: {
		// 		directiveTransforms: buildTransformers(),
		// 	},
		// },
	},
	vite: {
		/*// @vitejs/plugin-vue options
		server: {
			port: 5656
		}*/
		build: {
			ssr: false
		}
	}
});
