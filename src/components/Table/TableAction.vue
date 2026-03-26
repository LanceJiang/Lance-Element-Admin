<script lang="tsx">
import { defineComponent, PropType, computed } from 'vue'
import { LeActionItem } from './index.d'
import { isBoolean, isFunction, isString } from 'lodash-es'
import LeIcon from '@/components/Icon.vue'

const props = {
	actions: {
		type: Array as PropType<LeActionItem[]>,
		default: null
	},
	// 是否显示分割线
	divider: {
		type: Boolean,
		default: false
	}
	/*dropDownActions: {
    type: Array as PropType<LeActionItem[]>,
    default: null,
  },*/
}
const tooltipDefault = {
	placement: 'top'
}
export default defineComponent({
	name: 'LeTableAction',
	props,
	setup(props /*, { slots }*/) {
		function isIfShow(action: LeActionItem): boolean {
			const ifShow = action.ifShow
			let isIfShow = true
			if (isBoolean(ifShow)) isIfShow = ifShow

			if (isFunction(ifShow)) isIfShow = ifShow(action)

			return isIfShow
		}

		const getActions = computed(() => {
			return (props.actions || []).filter(isIfShow).map(action => {
				return action
			})
		})
		return () => {
			const { divider } = props
			const actions = getActions.value.map((action, idx) => {
				const key = `action-${idx}`
				let btn = (
					<el-button key={key} class="le-icon-button" onClick={action.onClick} disabled={action.disabled}>
						<LeIcon class={`btn-icon ${action.colorClass ?? 'primary-color'}`} color={action.color} icon={action.icon} />
					</el-button>
				)
				if (action.tooltip) {
					const tooltip = isString(action.tooltip) ? { content: action.tooltip } : action.tooltip
					const tooltipProps = { ...tooltipDefault, ...tooltip }
					btn = (
						<el-tooltip key={key} {...tooltipProps}>
							{btn}
						</el-tooltip>
					)
				}
				let comp = btn
				const _popconfirm = action.popconfirm
				if (_popconfirm) {
					const vSlots = {
						reference: () => <span class="tooltip-wrap">{btn}</span>
					}
					const popconfirm = {
						..._popconfirm,
						onConfirm: _popconfirm?.confirm,
						onCancel: _popconfirm?.cancel
					}
					comp = <el-popconfirm key={key} v-slots={vSlots} {...popconfirm}></el-popconfirm>
				}
				if (divider && idx < getActions.value.length - 1) {
					return [comp, <el-divider class="divider" direction="vertical" />]
				}
				return comp
			})
			return <div class="le-table-action le-icon-button-wrap">{actions}</div>
		}
	}
})
</script>
