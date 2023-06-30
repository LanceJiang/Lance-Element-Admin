/**
 * select Option 自定义 渲染
 * @param slots
 * @param slotOption
 * @param option
 * @param label
 * @returns {*}
 */
export const renderSelectOption = function(slots, slotOption, option, label) {
	if (slotOption) {
		let scopedSlots_option = slotOption
		if (typeof slotOption === 'string') {
			scopedSlots_option = slots[slotOption]
		}
		if (typeof scopedSlots_option === 'function') {
			const args = [{
				option,
				label
			}]
			// scopedSlots
			return scopedSlots_option(...args)
		}
	}
	return label
}
// (级联/LeSelect)自定义渲染
export const optionSlot = (slots, slotOption) => {
	let scopedSlots_option = slotOption
	if (typeof slotOption === 'string') {
		scopedSlots_option = slots[slotOption]
	}
	if (typeof scopedSlots_option === 'function') {
		return scopedSlots_option
	}
}
//
export const get_formSlotLabel = (slots, slotOption) => {
	if (!slotOption) return
	let scopedSlots_option = slotOption
	if (typeof slotOption === 'string') {
		scopedSlots_option = slots[slotOption]
	}
	if (typeof scopedSlots_option === 'function') {
		/*const args = [{
			option,
			label
		}]*/
		// scopedSlots
		return scopedSlots_option
	}
}