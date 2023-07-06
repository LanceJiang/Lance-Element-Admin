<script lang="tsx">
import { defineComponent, reactive, watch, PropType, computed, unref, onMounted, ref } from 'vue'
import Icon from '@/components/Icon'
import NoData from '@/components/NoData'
import DraggableNest from '@/components/DraggableNest'
import { useI18n } from 'vue-i18n'
import { LeTableColumnProps } from '@/components/Table'

const TableColumnsPopover = defineComponent(
	(props, { emit, slots }) => {
		const { t } = useI18n()
		const state = reactive({
			// 选择全部
			checkAll: false,
			indeterminate: false,
			visible: false,
			loading: false,
			checkedList: [],
			checkedOptions: []
		})
		watch(props.value, () => {
				if (state.visible) {
					initCheckedOptions()
				}
			},
		{
			immediate: true
		})
		// watch(() => state.visible, bool => {
		watch(() => state.visible, bool => {
			if (bool) {
				initCheckedOptions()
			}
		})
		const initCheckedOptions = () => {
			// 本地留存
			const checkedOptions = (state.checkedOptions = JSON.parse(JSON.stringify(props.value || [])))
			getCheckedOptions(checkedOptions)
			getCheckedSelectAll()
		}
		const onCheckAllChange = checked => {
			;(checked ? onCheckAllSelect : onCheckAllClear)()
		}
		const onCheckAllSelect = () => {
			const columns = props.columns
			// 标记fixed的项目 表示始终保留
			const checkedOptions = JSON.parse(JSON.stringify(columns.filter(v => v.fixed)))
			// 将原来不存在的配置项按照默认的排序进行添加
			columns.map(v => {
				if (checkedOptions.every(_v => _v.prop !== v.prop)) {
					checkedOptions.push(v)
				}
			})
			getCheckedOptions(checkedOptions)
			// 总控制器状态更新
			state.indeterminate = false
			state.checkAll = true
		}
		const onCheckAllClear = () => {
			const columns = props.columns
			// 标记fixed的项目 表示始终保留
			const checkedOptions = JSON.parse(JSON.stringify(columns.filter(v => v.fixed)))
			state.checkedList = checkedOptions.map(v => v.prop)
			state.checkedOptions = checkedOptions
			getCheckedSelectAll()
		}

		const onChange = list => {
			const columns = props.columns
			const checkedOptions = state.checkedOptions
			// 删除 已被取消的项目
			for (let i = 0; i < checkedOptions.length; i++) {
				const option = checkedOptions[i]
				const _index = list.findIndex(value => option.prop === value)
				// 如果当前项目在 新的 checkedOptions 找不到 进行删除
				if (_index === -1) {
					checkedOptions.splice(i, 1)
					i--
				} else {
					// 找的到相同的 就把该项目删除 减少下次遍历的次数
					list.splice(_index, 1)
				}
			}
			checkedOptions.push(...list.map(value => columns.find(v => v.prop === value)))
			getCheckedOptions(checkedOptions)
			getCheckedSelectAll()
		}
		const getCheckedOptions = (options = state.checkedOptions) => {
			// const topFixed = []
			// const bottomFixed = []
			const fixed = []
			const checkedOptions = JSON.parse(JSON.stringify(options))
			for (let i = 0; i < checkedOptions.length; i++) {
				const v = checkedOptions[i]
				if (v.fixed) {
					// left: 置顶, right: 置底
					// (v.fixed === 'left' ? topFixed : fixed).push(v)
					fixed.push(v)
					checkedOptions.splice(i, 1)
					i--
				}
			}
			const res = checkedOptions.concat(fixed)
			// console.log(res.map(v => v.prop), 'checkedList ............. checkedOptions', checkedOptions)
			state.checkedList = res.map(v => v.prop)
			state.checkedOptions = res
			return res
		}
		const getCheckedSelectAll = () => {
			const columns = props.columns
			const checkedOptions = state.checkedOptions
			const listLen = checkedOptions.length
			// 总控制器状态更新
			state.indeterminate = !!listLen && listLen < columns.length
			state.checkAll = listLen === columns.length
		}
		// 提交最新的列配置
		const handleSubmit = () => {
			// todo 提交接口处理
			emit('change', state.checkedOptions)
			state.visible = false
			/* const { checkedOptions } = state
      const query = {
        filterColumn: JSON.stringify(checkedOptions)
      }
      state.loading = true
      try {
        await YourFetchApi(query)
        this.$message.success('message.saveSuccess')
      } catch (error) {
        console.log(error)
      } finally {
        state.loading = false
        state.visible = false
      } */
			// emit('change', this.columnProps)
		}

		// 重置列默认
		const handleReset = () => {
			const columns = props.columns
			const defaultCheckedOptions = props.defaultCheckedOptions
			let checkedOptions = JSON.parse(JSON.stringify(columns))
			if (Array.isArray(defaultCheckedOptions)) {
				checkedOptions = JSON.parse(JSON.stringify(defaultCheckedOptions))
			}
			getCheckedOptions(checkedOptions)
			getCheckedSelectAll()
		}
		const deleteCheckedOptions = (item, idx, local_list) => {
			// console.error(item, idx, local_list, 'prop, idx, local_list deleteCheckedOptions ')
			if (!item.fixed) {
				local_list.splice(idx, 1)
				getCheckedOptions(local_list)
				getCheckedSelectAll()
			}
		}
		const onMove = ({ relatedContext, draggedContext }) => {
			const relatedElement = relatedContext.element
			const draggedElement = draggedContext.element
			// fixed 表示 固定的项
			return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
		}

		const vSlots = {
			reference: () => <span>
				<el-tooltip placement="top" content={t('le.column')}>
				<el-button type="default" class="icon-button button-column">
					<Icon icon-class="le-hide_column"/>
				</el-button>
			</el-tooltip>
			</span>
		}
		return () => {
			return <el-popover
				v-model:visible={state.visible}
				class="le-column-wrap"
				popper-class="le-column-popover"
				placement="bottom-end"
				trigger="click"
				v-slots={vSlots}>
				<div v-loading={state.loading} class="columns-contents">
					<div class="title">{t('le.columnsPop.title')}</div>
					<div class="label">{t('le.columnsPop.selected')}</div>
					<el-checkbox v-model={state.checkAll} size="default" class="el-select-dropdown__item title" indeterminate={state.indeterminate} onChange={onCheckAllChange}>
						{t('le.selectAll')}
					</el-checkbox>
					<div class="divider"/>
					<el-scrollbar>
						<ul class="el-scrollbar__view el-select-dropdown__list">
							{/*暂时没有嵌套的需求 若有 后续再做调整优化 todo...*/}
							<DraggableNest v-model={state.checkedOptions} class="draggableWrap" move={onMove} remove={deleteCheckedOptions} />
							<NoData v-show={!state.checkedOptions.length}/>
						</ul>
					</el-scrollbar>
					<div class="divider"/>
					<div class="label">{t('le.columnsPop.options')}</div>
					<el-scrollbar>
						<ul class="el-scrollbar__view el-select-dropdown__list">
							<el-checkbox-group size="default" modelValue={state.checkedList} onChange={onChange}>
								{
									props.columns.map(item => {
										const label = item.t_label ? t(item.t_label) : item.label
										return <el-checkbox
											key={item.prop}
											class="el-select-dropdown__item"
											v-show={!state.checkedList.includes(item.prop)}
											title={label}
											label={item.prop}
											disabled={!!item.fixed}
										>
											{label}
										</el-checkbox>
									})
								}
							</el-checkbox-group>
						</ul>
					</el-scrollbar>
					<div class="footer">
						<el-button size="small" onClick={handleReset}>
							{t('le.btn.restore')}
						</el-button>
						<el-button type="primary" size="small" onClick={handleSubmit}>
							{t('le.btn.save')}
						</el-button>
					</div>
				</div>
		</el-popover>
		}
	},
	{
		name: 'LeTableColumnsPopover',
		props: {
			columns: {
				// required: true, // 即 tableColumns的 配置
				type: Array as PropType<LeTableColumnProps[]>,
				default: () => []
			},
			/* // 选中的 columns
    /!**
     * 为支持更高的扩展，
     * eg:可能一个页面多个tabs 有多个table 会同时请求 那接口请求将直接放置外部父级组件
     * 页面初始化 获取相关配置的请求， 然后等接口获取成功 做赋值，
     *     若 不成功 使用默认的 defaultCheckedOptions 或者 columns 进行转换一
     *!/
    checkedOptions */
			value: {
				type: Array as PropType<LeTableColumnProps[]>,
				default: () => []
				// todo dynamic: 标记column是否根据本地的column进行label替换【Boolean】
				/* type Options = { t_label: string; label: string; prop: string; fixed: boolean|string }[]
				 */
			},
			// 默认的展示列配置
			defaultCheckedOptions: {
				// 同value 配置
				type: Array as PropType<LeTableColumnProps[]>,
				default: null
			},
		},
		emits: {
			change: ((checkedOptions: LeTableColumnProps[]) => true)
		}
	}
)
export default TableColumnsPopover
</script>
