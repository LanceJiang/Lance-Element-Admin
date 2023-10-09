import svgIcons from 'virtual:svg-icons-names'
import * as ElIcons from '@element-plus/icons-vue'
import leIconData from './json_leIconData.ts'
// 来自于 src/assets/icons 的svg: 'icon-[dir]-[name]'

// const icons = [] as string[]
// const modules = import.meta.glob('../../assets/icons/*.svg')
// for (const path in modules) {
// 	const p = path.split('assets/icons/')[1].split('.svg')[0]
// 	icons.push(p)
// }
export const svgIconData = {
	label: 'SvgIcon',
	prefix: 'icon-',
	icons: svgIcons.map((icon: string) => icon.replace('icon-', ''))
}
// 来自于 element svg 链接
export const elIconData = {
	label: 'ElIcon',
	prefix: '',
	icons: Object.keys(ElIcons)
}
export {
	// 来自于 le-iconfont svg 链接: 'le-[name]'
	leIconData
}

export const iconTypeOptions = [
	// svg
	{
		label: svgIconData.label,
		value: svgIconData.prefix,
		icons: svgIconData.icons
	},
	// le-icon
	{
		label: leIconData.label,
		value: leIconData.prefix,
		icons: leIconData.icons
	},
	// el-icon
	{
		label: elIconData.label,
		value: elIconData.prefix,
		icons: elIconData.icons
	}
]
