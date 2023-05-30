// import { formatNumber } from '@lancegroup/admin-ui/src/utils/index'
/**
 * 转化成带逗号的number格式
 * @param num
 * @param minimumFractionDigits 保留小数位
 * @returns {string}
 */
export function formatNumber(num, minimumFractionDigits = 0) {
	// return xeUtils.commafy(+num, { digits: minimumFractionDigits }) || '-'
	return (+num || 0).toLocaleString('zh', { minimumFractionDigits })
}
// import { UnitTranslate, weightUnitCodes } from '@lancegroup/admin-ui/src/utils/unit-translate'
// /* formatDateString, */ /* , formatRate */ console.error(formatDateString, formatRate, 'formatDateString, formatRate')

/**
 * 涉及的样式 可以 在 style/cellSlots.scss 新增 || 在 renderFunction 设置style
 *
 * 默认公用渲染cell render 申明： 现针对slots 已做slotFn传参兼容 建议使用 column,row 其他的参数名称不一样 无特殊情况 一个slot渲染即可
 * 命名方式： {prefix: 'vxe_' || ''}cellSlot_{todo}
 *
 * 由于vxe-table 和 el(ad)-table(admin 自定义slot)的渲染申明有差异 在使用不同的 table类型需要做以区别
 * yourSlot  Table(le-table) 只用 row, column 两个参数 可兼容 vxe-table 方式
 * vxe_yourSlot VxeTable(le-vxe-table)专用
 */

// 金额美化渲染
export const cellSlot_price =
	(field_currency = 'currency', field_value = '') =>
	({ row, column }, h) => {
		const price = row[field_value || column.property]
		let fragment = ''
		if (!price && price !== 0) {
			fragment = <span class="le-cell-label">-</span>
		} else {
			fragment = (
				<div class="le-cell_price">
					{formatNumber(price, 2)}
					<span class="price_label">{row[field_currency] || 'USD'}</span>
				</div>
			)
		}
		return [fragment]
	}

/*// 重量展示转换 渲染
export const cellSlot_weight =
	(field_weightCode = 'weightCode', field_value = '') =>
	({ row, column }, h) => {
		const weight = row[field_value || column.property]
		const weightCode = row[field_weightCode]
		if (!weightCode || !weight) return '-'
		const codes = weightUnitCodes[weightCode]
		return UnitTranslate.translateWeightArrOfWeight(weight, weightCode).map((value, i) => {
			return [`${value ?? '-'}  `, <span style="color: #A0AAB7;padding-right: 4px;">{codes[i] ?? '-'}</span>]
		})
	}*/
