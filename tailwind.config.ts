/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss'
export default {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	corePlugins: {
		preflight: false
	},
	theme: {
		screens: {
			mobile: { max: '750px' }, // 最大宽 750
			pc: '751px', // 最小宽 751
			sm: '640px',
			// => @media (min-width: 640px) { ... }

			md: '768px',
			// => @media (min-width: 768px) { ... }

			lg: '1024px',
			// => @media (min-width: 1024px) { ... }

			xl: '1440px',
			// => @media (min-width: 1440px) { ... }

			'2xl': '1536px'
			// => @media (min-width: 1536px) { ... }
		},
		colors: ({ colors }) => {
			return {
				...colors,
				/*inherit: colors.inherit,
				current: colors.current,
				transparent: colors.transparent,
				black: colors.black,
				white: colors.white,
				slate: colors.slate,
				gray: colors.gray,
				zinc: colors.zinc,
				neutral: colors.neutral,
				stone: colors.stone,
				red: colors.red,
				orange: colors.orange,
				amber: colors.amber,
				yellow: colors.yellow,
				lime: colors.lime,
				green: colors.green,
				emerald: colors.emerald,
				teal: colors.teal,
				cyan: colors.cyan,
				sky: colors.sky,
				blue: colors.blue,
				indigo: colors.indigo,
				violet: colors.violet,
				purple: colors.purple,
				fuchsia: colors.fuchsia,
				pink: colors.pink,
				rose: colors.rose*/
				// /*primary: 'var(--el-color-primary)',*/
				error: '#f56c6c', // 'var(--el-color-error)',
				warning: '#e6a23c', // 'var(--el-color-warning)',
				success: '#67c23a', // 'var(--el-color-success)',
				blue: '#1fb6ff'
			}
		},
		extend: {}
	},
	plugins: []
	/*// 这部分 css 需要通过比较复杂的计算得出，所以要用 `safelist` 保证它们出现在最终 css 里
	safelist: [
		{
			pattern: /w-\d+\/\d+/
		},
		{
			pattern: /grid-cols-[5-9]/
		}
	]*/
} satisfies Config
