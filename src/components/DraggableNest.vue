<script lang="tsx">
import { defineComponent, PropType, ExtractPropTypes, computed, unref, onMounted, ref } from 'vue'
import { LeTableColumnProps } from '@/components/Table/index.d'
import { useI18n } from 'vue-i18n'
import Draggable from 'vuedraggable'
import Icon from '@/components/Icon'
/*export type DraggableProps = {
	level: number
	value: any[]
	list: any[]
	options: any
	setFixed: () => void
	remove: (item, index, inputs) => void
	move: () => void
}
// 接受父组件参数，配置默认值
const props = withDefaults(defineProps<DraggableProps>(), {
	level: 0,
	value: undefined,
	/!** default: {
        t_label: String, // 多语言关键key
        label?: String, // 若不存在t_label 可使用 label
        prop: String, // 用于 作为唯一值鉴定用
        // checked: Boolean, // 当前配置 是否选中(主要用于 后期有children 的情况)
        fixed?: Boolean||String, // fixed 的不允许删除 disabled
        children?: Option[] // 同上配置
      }[] *!/
	// list: undefined,
	options: {},
	setFixed: () => {},
	remove: (item, index, inputs) => {
		console.error(item, index, inputs, 'remove')
		// if (!item.fixed) {
		//   inputs.splice(index, 1)
		//   this.$emit('input', inputs)
		// }
	},
	move: (...args) => console.error(args, 'move')
})
export type DraggableEmits = {
	(e: 'input', value: any): void
	(e: 'start', value: any): void
	(e: 'end', value: any): void
}
const emits = defineEmits<DraggableEmits>()*/
const draggableProps = {
	level: {
		type: Number,
		default: 0
	},
	modelValue: {
		required: false,
		/** default: {
        t_label: String, // 多语言关键key
        label?: String, // 若不存在t_label 可使用 label
        prop: String, // 用于 作为唯一值鉴定用
        // checked: Boolean, // 当前配置 是否选中(主要用于 后期有children 的情况)
        fixed?: Boolean||String, // fixed 的不允许删除 disabled
        children?: Option[] // 同上配置
      }[] */
		type: Array as PropType<LeTableColumnProps[]>,
		default: null
	},
	list: {
		required: false,
		type: Array as PropType<LeTableColumnProps[]>,
		default: null
	},
	options: {
		type: Object,
		default: () => ({})
	},
	// todo: 扩展预设 设置定位(置顶/底)
	// setFixed: {
	// 	type: Function,
	// 	default: (...args) => {}
	// },
	remove: {
		type: Function,
		default: (item, index, inputs) => {
			console.error(item, index, inputs, 'removeHandler')
			// if (!item.fixed) {
			//   inputs.splice(index, 1)
			//   this.$emit('input', inputs)
			// }
		}
	},
	move: {
		type: Function,
		default: (...args) => {
			console.error(args, 'move')
		}
	}
}
export type DraggableProps = ExtractPropTypes<typeof draggableProps>
const draggableEmits = {
	['update:modelValue']: ((value: LeTableColumnProps[]) => value),
	// start: (value: any) => void 0,
	// end: (value: any) => void 0
}
export type DraggableEmits = typeof draggableEmits
const DraggableNest = defineComponent({
	name: 'LeDraggableNest',
	props: draggableProps,
	emits: draggableEmits,
	setup(props, { emit, slots }) {
		const { t } = useI18n()
		const realValue = computed(() => {
			return props.modelValue ? props.modelValue : props.list
		})
		const dragOptions = computed(() => {
			return {
				animation: 280,
				group: 'description',
				disabled: false,
				ghostClass: 'ghost',
				chosenClass: 'chosen',
				itemKey: 'prop',
				...props.options
			}
		})
		const emitter = values => {
			// console.error(values, 'emit(\'update:modelValue\', values)')
			emit('update:modelValue', values)
		}
		const slots_item = {
			item: ({ element: v, index }) => {
				const _label = v.t_label ? t(v.t_label) : v.label
				return <div class="le-draggable-nest-item" key={v.prop}>
					<div
						class={['itemWrap', `${(v.fixed) ? 'disabled' : ''}`]}
						// onClick={() => this.removeHandler(v, index, this.realValue)}
					>
						<el-checkbox size="default" class={props.level !== 0 ? 'checkbox-hide' : ''} disabled={!!v.fixed || props.level !== 0} modelValue={true} onChange={props.remove.bind(null, v, index, realValue.value)} />
						<span class="label_txt" title={_label}>{ _label }</span>
						<Icon class="dragEl" iconClass="le-drag"/>
					</div>
					{
						(v.children || []).length ? <LeDraggableNest
							group={v.prop}
							move={props.move}
							// remove={props.remove}
							level={props.level + 1}
							list={v.children}
						/> : ''
					}
				</div>
			}
		}
		return () => {
			return (
				<Draggable
					class="le-draggable-nest"
					{...dragOptions.value}
					list={props.list}
					modelValue={props.modelValue}
					onUpdate:modelValue={emitter}
					move={props.move}
					v-slots={slots_item}
				/>
			)
		}
	}
})
export default DraggableNest
</script>