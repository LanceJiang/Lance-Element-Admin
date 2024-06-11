import path from 'path'
import Inspect from 'vite-plugin-inspect'
import { defineConfig, loadEnv } from 'vite'
// import VueMacros from 'unplugin-vue-macros/vite'
// import UnoCSS from 'unocss/vite'
// import mkcert from 'vite-plugin-mkcert'
import glob from 'fast-glob'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import vueSetupExtend from 'unplugin-vue-setup-extend-plus/vite'
// import {
//   docPackage,
//   epPackage,
//   getPackageDependencies,
//   projRoot,
// } from '@element-plus/build-utils'
import { MarkdownTransform } from './.vitepress/plugins/markdown-transform'

import type { Alias } from 'vite'

const alias: Alias[] = [
  {
    find: '~/',
    replacement: `${path.resolve(__dirname, './.vitepress/vitepress')}/`,
  },
	{
		find: '@/',
		replacement: `${path.resolve(__dirname, './../src')}/`,
	}
]
/*if (process.env.DOC_ENV !== 'production') {
  alias.push(
    {
      find: /^element-plus(\/(es|lib))?$/,
      replacement: path.resolve(projRoot, 'packages/element-plus/index.ts'),
    },
    {
      find: /^element-plus\/(es|lib)\/(.*)$/,
      replacement: `${path.resolve(projRoot, 'packages')}/$2`,
    }
  )
}*/

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // const { dependencies: epDeps } = getPackageDependencies(epPackage)
  // const { dependencies: docsDeps } = getPackageDependencies(docPackage)

  // const optimizeDeps = [...new Set([...epDeps, ...docsDeps])].filter(
  //   (dep) =>
  //     !dep.startsWith('@types/') &&
  //     !['@element-plus/metadata', 'element-plus'].includes(dep)
  // )

  // optimizeDeps.push(
  //   ...(await glob(['dayjs/plugin/*.js'], {
  //     cwd: path.resolve(projRoot, 'node_modules'),
  //     onlyFiles: true,
  //   }))
  // )

  return {
    server: {
      host: true,
			port: 5656,
      https: !!env.HTTPS
      // fs: {
      //   // allow: [projRoot],
      //   allow: [path.resolve(__dirname, '..', '..')],
      // },
    },
    resolve: {
      alias,
			extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.vue', '.json'] // 默认 ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
    },
    plugins: [
			vueJsx(),
			vueSetupExtend({}),
      // VueMacros({
      //   setupComponent: false,
      //   setupSFC: false,
      //   plugins: {
      //     vueJsx: vueJsx(),
      //   },
      // }),

      // https://github.com/antfu/unplugin-vue-components
      Components({
        dirs: ['.vitepress/vitepress/components'],

        allowOverrides: true,

        // custom resolvers
        resolvers: [
          // auto import icons
          // https://github.com/antfu/unplugin-icons
          IconsResolver(),
        ],

        // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      }),

      // https://github.com/antfu/unplugin-icons
      Icons({
        autoInstall: true,
      }),
			// 使用 svg 图标
			createSvgIconsPlugin({
				// 指定需要缓存的图标文件夹
				iconDirs: [path.resolve(process.cwd(), '../src/assets/icons')],
				// 指定symbolId格式
				symbolId: 'icon-[dir]-[name]'
			}),
      MarkdownTransform(),
      Inspect(),
      // mkcert(),
    ],
    optimizeDeps: {
      // include: optimizeDeps,
    },
  }
})
