import { defineConfig, loadEnv, ConfigEnv, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// import eslintPlugin from 'vite-plugin-eslint'
import { createHtmlPlugin } from 'vite-plugin-html'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import vueSetupExtend from 'unplugin-vue-setup-extend-plus/vite'
import path from 'path'
import pkg from './package.json'
import dayjs from 'dayjs'
import { wrapperEnv } from './build/getEnv'

const { dependencies, devDependencies, name, version } = pkg
const __APP_INFO__ = {
	pkg: { dependencies, devDependencies, name, version },
	lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
}

// https://vitejs.dev/config/
export default defineConfig(({ mode /*command,*/ }: ConfigEnv): UserConfig => {
	// if (command === 'serve') {
	//   return {
	//     // serve 独有配置
	//   }
	// } else {
	//   return {
	//     // build 独有配置
	//   }
	// }
	const process_cwd = process.cwd()
	// 获取 .env 环境配置文件
	const env = loadEnv(mode, process_cwd)
	const viteEnv = wrapperEnv(env)

	return {
		base: viteEnv.VITE_PUBLIC_PATH,
		resolve: {
			// Vite路径别名配置
			alias: {
				'@': path.resolve(__dirname, './src'),
				'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
			},
			extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.vue', '.json'] // 默认 ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
		},
		define: {
			__APP_INFO__: JSON.stringify(__APP_INFO__)
		},
		css: {
			devSourcemap: true,
			preprocessorOptions: {
				scss: {
					additionalData: `@import "@/styles/variables.scss";`
				}
			}
		},
		server: {
			host: '0.0.0.0',
			port: viteEnv.VITE_PORT,
			open: viteEnv.VITE_OPEN,
			cors: true,
			// Load proxy configuration from .env.development
			proxy: {}
		},
		plugins: [
			// vue支持
			vue(),
			// JSX支持
			vueJsx({
				// 默认支持  .[jt]sx  .vue 和 .js 需要支持 jsx 写法 需要 配置
				include: /\.[jt]sx$/ // |\.vue$
			}),
			// // esLint 报错信息显示在浏览器界面上
			// eslintPlugin(),
			// name 可以写在 script 标签上
			vueSetupExtend({}),
			// 注入变量到 html 文件
			createHtmlPlugin({
				inject: {
					data: { title: viteEnv.VITE_APP_TITLE }
				}
			}),
			// 使用 svg 图标
			createSvgIconsPlugin({
				// 指定需要缓存的图标文件夹
				iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
				// 指定symbolId格式
				symbolId: 'icon-[dir]-[name]'
			})
		]
	}
})
