const ExpandDom = {
	functional: true,
	props: {
		row: Object,
		render: Function,
		index: Number,
		column: {
			type: Object,
			default: null
		}
	},
	render: ctx => {
		const params = {
			row: ctx.props.row,
			index: ctx.props.index
		}
		if (ctx.props.column) params.column = ctx.props.column
		return ctx.props.render(params)
	}
}
export const ColumnItem = {
	functional: true, // render 为其增加 context
	name: 'ColumnItem',
	components: { ExpandDom },
	render(context) {
		const props = context.props || {}
		const { column, computedOptions, index } = props
		const { children = [] } = column || {}
		// template 写法
		/* <el-table-column>
    <template scope-slot="props">
            <el-button
    type="primary"
    size="mini"
  @click="openDialog('edit',props.row)"
            >编辑
            </el-button>
            </template>
            </el-table-column>*/
		// jsx 写法
		/* <el-table-column
    key={index}
    label={item.name}
    width={item.width}
    {...{
      scopedSlots: {
      default: props => {
          return (
                  <el-button
          type="primary"
          size="mini"
          on-click={this.openDialog.bind(this,'edit',props.row)}
                  >编辑
        )
        }
      }
    }}
    />*/
		/* 插槽相关 */
		const renderScope = (scope, props) => {
			if (props.render) {
				return <ExpandDom column={props} row={scope.row} render={props.render} index={index.index} />
			}
			if (props.formatter) {
				// return <span v-html="props.formatter(scope.row, column)" />
				return <span domPropsInnerHTML={props.formatter(scope.row, column)} />
			}
			return (
				<span title={scope.row[props.prop]} style={props.style}>
					{(typeof scope.row[props.prop] !== 'number' && (scope.row[props.prop] || '- -')) || scope.row[props.prop]}{' '}
				</span>
			)
		}
		/* 渲染ColumnItem */
		const renderColumn = column => {
			return (
				<el-table-column
					prop={column.prop}
					label={column.label}
					align={column.align || 'left'}
					width={column.width}
					minWidth={column.minWidth}
					fixed={column.fixed}
					sortable={column.sortable}
					resizable={computedOptions.resizable}
					showOverflowTooltip={computedOptions.showOverflowTooltip}
					{...{
						scopedSlots: {
							header: scope => <span title={column.label}>{column.label}</span>,
							default: scope => renderScope(scope, column)
						}
					}}
				/>
			)
		}
		// 若存在子级children 遍历children column 配置 （目前仅支持一级）
		if (children.length) {
			const childNodes = children.map(item => {
				return renderColumn(item)
			})
			return <el-table-column label={column.label}>{childNodes}</el-table-column>
		} else {
			return renderColumn(column)
		}
	}
}
