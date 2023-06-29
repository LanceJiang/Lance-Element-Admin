<template>
	<div class="flex-column-page-wrap pageWrap">
		Home
		<div class="common_title">多语言 使用</div>
		<div class="content">
			<el-button @click="switchLang" size="small">
				lang: 切换
				<LeIcon iconClass="le-frozen" />
				<LeIcon iconClass="le-warning" />
				{{ $i18n.locale }}
			</el-button>
			<div>local文字: {{ $t('route.dashboard') }}</div>
			<div>src/locale 文字(携带 le前缀做区分): {{ $t('le.btn.add') }}</div>
		</div>
		<div class="common_title">LeSearchGroup 使用 示例(继承于LePopover)</div>
		<!--    <div class="content">
      <LeSearchGroup v-bind="formOptions" v-model="searchParams" :selectedSettingSubmit="selectedSettingSubmit"/>
    </div>-->
		<div class="common_title">LePopover 使用</div>
		<div class="content">
			<div>-------类LeSearchGroup 组件创建示例-------</div>
			<!-- button-group 类型 下拉弹窗选择 LeSearchGroup 生成模拟 -->
			<!--      <el-button-group>
        &lt;!&ndash; le-search-group_btn  &ndash;&gt;
        <LePopover :first-load='false' trigger="click" :popperClass="`le-popover&#45;&#45;select ${'popperClass'}`" placement="bottom">
          <el-button slot="reference" class="le-popover-box__btn">
          <span>
            <i class="el-icon-arrow-down le-popover-box__btn__prefix" slot="prefix" />
            <span class="le-popover-box__btn__label">{{ 'item.label  1' }}</span>
            <i class="el-icon-arrow-down le-popover-box__btn__suffix" slot="suffix" />
          </span>
          </el-button>

          <div class="le-popover&#45;&#45;select_content">
            <div
              class="more-item"
              v-for='num of Array.from({length: 10}).map((_, i) => i)'
              :key='num'
            >
              <span class="label"> 待调仓{{num}} </span>
              <span class="value"> 1{{num}} </span>
            </div>
          </div>

          <div class="le-popover&#45;&#45;select_footer">
            <el-tooltip
              placement="top"
              :content="$t('le.btn.reset')"
            >
              <el-button size='small' @click='$message.warning("触发 reset 方法")'>
                <le-icon icon-class="le-clear" />
              </el-button>
            </el-tooltip>
            <el-tooltip
              placement="top"
              :content="$t('le.btn.confirm')"
            >
              <el-button size='small' type="primary" @click='$message.warning("触发 confirm 方法")'>
                <le-icon icon-class="le-confirm" />
              </el-button>
            </el-tooltip>
          </div>
        </LePopover>
        <LePopover :first-load='false' trigger="click" :popperClass="`le-popover&#45;&#45;select ${'popperClass'}`" placement="top">
          <el-button slot="reference" class="le-popover-box__btn">
          <span>
            <i class="el-icon-arrow-down le-popover-box__btn__prefix" slot="prefix" />
            <span class="le-popover-box__btn__label">{{ 'item.label  2' }}</span>
            <i class="el-icon-arrow-down le-popover-box__btn__suffix" slot="suffix" />
          </span>
          </el-button>

          <div class="le-popover&#45;&#45;select_content">
            <div
              class="more-item"
              v-for='num of Array.from({length: 10}).map((_, i) => i)'
              :key='num'
            >
              <span class="label"> 待调仓{{num}} </span>
              <span class="value"> 1{{num}} </span>
            </div>
          </div>

          <div class="le-popover&#45;&#45;select_footer">
            <el-button size='small' @click='$message.warning("触发 reset 方法")'>
              <le-icon icon-class="le-clear" />
            </el-button>
            <el-button size='small' type="primary" @click='$message.warning("触发 confirm 方法")'>
              <le-icon icon-class="le-confirm" />
            </el-button>
          </div>
        </LePopover>
        <LePopover :first-load='false' trigger="click" :popperClass="`le-popover&#45;&#45;select ${'popperClass'}`" placement="top">
          <el-button slot="reference" class="le-popover-box__btn">
          <span>
            <i class="el-icon-arrow-down le-popover-box__btn__prefix" slot="prefix" />
            <span class="le-popover-box__btn__label">{{ 'item.label  3' }}</span>
            <i class="el-icon-arrow-down le-popover-box__btn__suffix" slot="suffix" />
          </span>
          </el-button>

          <div class="le-popover&#45;&#45;select_content">
            <div
              class="more-item"
              v-for='num of Array.from({length: 10}).map((_, i) => i)'
              :key='num'
            >
              <span class="label"> 待调仓{{num}} </span>
              <span class="value"> 1{{num}} </span>
            </div>
          </div>

          <div class="le-popover&#45;&#45;select_footer">
            <el-button size='small' @click='$message.warning("触发 reset 方法")'>
              <le-icon icon-class="le-clear" />
            </el-button>
            <el-button size='small' type="primary" @click='$message.warning("触发 confirm 方法")'>
              <le-icon icon-class="le-confirm" />
            </el-button>
          </div>
        </LePopover>
        <span class="le-popover-box">
          <span class="el-popover__reference-wrapper">
            <el-tooltip
              placement="top"
              :content="$t('le.filter.filterLabel')"
            >
              <el-button @click='triggerFilter'>
                <le-icon icon-class="le-filter"/>
              </el-button>
            </el-tooltip>
          </span>
        </span>
      </el-button-group>-->
			<!--   FilterDrawer抽屉示例   -->
			<!--      <LeSearchFilterDrawer :visible.sync="testDrawer">
        测试......
        <template #footer>
          1
        </template>
      </LeSearchFilterDrawer>-->
			<div>-------button 类型 下拉弹窗 示例--------</div>
			<!--   模拟 button 类型 下拉弹窗选择 le-popover--select   -->
			<!--      <LePopover :first-load='false' trigger="click" :popperClass="`le-popover&#45;&#45;select ${'popperClass'}`" placement="top">
        <el-button slot="reference" class="le-popover-box__btn">
          <span>
            <i class="el-icon-arrow-down le-popover-box__btn__prefix" slot="prefix" />
            <span class="le-popover-box__btn__label">{{ 'item.label' }}</span>
            <i class="el-icon-arrow-down le-popover-box__btn__suffix" slot="suffix" />
          </span>
        </el-button>

        <div class="le-popover&#45;&#45;select_content">
          <div
            class="more-item"
            v-for='num of Array.from({length: 10}).map((_, i) => i)'
            :key='num'
          >
            <span class="label"> 待调仓{{num}} </span>
            <span class="value"> 1{{num}} </span>
          </div>
        </div>

        <div class="le-popover&#45;&#45;select_footer">
          <el-tooltip
            placement="top"
            :content="$t('le.btn.reset')"
          >
            <el-button size='small' @click='$message.warning("触发 reset 方法")'>
              <le-icon icon-class="le-clear" />
            </el-button>
          </el-tooltip>
          <el-tooltip
            placement="top"
            :content="$t('le.btn.confirm')"
          >
            <el-button size='small' type="primary" @click='$message.warning("触发 confirm 方法")'>
              <le-icon icon-class="le-confirm" />
            </el-button>
          </el-tooltip>
        </div>
      </LePopover>-->
			<div>-------分割--------</div>
			<!--   模拟 查看更多下拉列表 类型 le-popover--list   -->
			<!--      <LePopover trigger="click" :popperClass="`le-popover&#45;&#45;list ${'popperClass'}`" placement="right">
        <div class="labelWrap" style="width: 400px;background: #f00;" slot="reference">
          可售：666（le-popover默认 click 触发le-popover-list展示）
        </div>
        <div class="more-item_title">
          <span class="label">类目</span>
          <span class="value" style='color: #BDC3C9;'>数量</span>
        </div>
        <el-main style='padding: 0;' class="le-popover&#45;&#45;list_content" @hook:created='$log("创建完成 触发(可能有接口请求) 。。。1111")'>
          <div class="more-item">
            <span class="label"> 可售 </span>
            <span class="value"> 666 </span>
          </div>
          <div
            class="more-item"
            v-for='num of Array.from({length: 10}).map((_, i) => i)'
            :key='num'
          >
            <span class="label"> 待调仓{{num}} </span>
            <span class="value"> 1{{num}} </span>
          </div>
        </el-main>
      </LePopover>-->
			<div>-------分割--------</div>
			<!--      <LePopover :first-load='true' trigger="click" :popperClass="`le-popover&#45;&#45;list ${'popperClass'}`" placement="right">
        <div class="labelWrap" style="width: 690px;background: #ff0;" slot="reference">
          可售：666（le-popover默认 click 触发le-popover-list展示【slot default 内容未展示 就触发生命周期示例】）
        </div>
        <el-main style='padding: 0;' @hook:created='$log("创建完成 触发(可能有接口请求) 。。。22222")' class="le-popover&#45;&#45;list_content">
          <div class="more-item">
            <span class="label"> 可售 </span>
            <span class="value"> 666 </span>
          </div>
          <div
            class="more-item"
            v-for='num of Array.from({length: 10}).map((_, i) => i)'
            :key='num'
          >
            <span class="label"> 待调仓{{num}} </span>
            <span class="value"> 1{{num}} </span>
          </div>
        </el-main>
      </LePopover>-->
		</div>

		<div class="common_title">LeSelect 使用</div>
		<div class="content">
			<div style="color: #f00">testValue:{{ testValue }}</div>
			el-select
			<ElSelect v-model="testValue" filterable multiple collapseTags isPopover>
				<!--				<template #prefix>
					<LeIcon icon-class="icon-logo"/>
				</template>-->
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
			</ElSelect>
			el-select-v2
			<el-select-v2 v-model="testValue" :options="options" style="width: 200px" filterable multiple isPopover collapseTags>
				<!--				<template #prefix>
									<LeIcon icon-class="icon-logo"/>
								</template>-->
			</el-select-v2>
			LeSelect(cust_label 多语言)
<!--			3labelKey="obj.label"-->
			<LeSelect
				v-model="testValue"
				:options="options"
				style="width: 200px"
				i18n
				collapseTagsTooltip
				labelKey="cust_label"
				filterable multiple isPopover>
<!--					<template #prefix>
						<LeIcon icon-class="icon-logo"/>
					</template>
					<template #default="{ item, index, disabled }">
						<LeIcon icon-class="icon-logo" />
						{{ item.le_label }}
					</template>-->
			</LeSelect>
			LeSelect单选(value)
<!--		options2	-->
			<LeSelect v-model="testValue" :options="options" style="width: 200px" filterable isPopover>
				<template #default="{ item, index, disabled }"> <LeIcon icon-class="icon-logo" /> {{ item.le_label }} </template>
			</LeSelect>
			valueKey(obj.value)
			<!-- 读取option 非value 的数据 作为value 储蓄 -->
			<!--			0_value_Key="cust_value"
				options3-->
			<LeSelect
				v-model="testValue"
				:options="options"
				labelKey="cust_label"
				:i18n="false"
				valueKey="obj.value"
				style="width: 200px"
				filterable
				multiple
				isPopover
				:collapseT2ags="false"
			>
				<!--				todo...-->
				<!--				<template #prefix>
									<LeIcon icon-class="icon-logo"/>
								</template>-->
				<template #default="{ item, index, disabled }">
					<LeIcon icon-class="icon-logo" /> {{ item.le_label }}
				</template>
			</LeSelect>
		<div>-------LeSelect 无弹窗(isPopover false)--------</div>
			<LeSelect
				style="width: 200px"
				v-model="testValue"
				:options="options3"
				filterable multiple :isPopover="false">
			</LeSelect>
		</div>

		<div class="common_title">LeInputNumber && LeInputNumberRange</div>
		<div class="content">
			{{ testNumber }}
			<LeInputNumber disabled v-model="testNumber" :min="0" prefixIcon="#" _controlsPosition=""></LeInputNumber>
			<LeInputNumber v-model="testNumber" :min="0" prefixIcon="#" suffixIcon="￥" size="small" _controlsPosition=""></LeInputNumber>
			<LeInputNumber v-model="testNumber" :min="0" prefixIcon="#" size="small" _controlsPosition=""></LeInputNumber>
			<LeInputNumber v-model="testNumber" :min="0" suffixIcon="￥" _controlsPosition=""></LeInputNumber>
			<LeInputNumber size="small" v-model="testNumber" :min="0" prefixIcon="#" suffixIcon="￥" _controlsPosition=""></LeInputNumber>
			<LeInputNumber v-model="testNumber" :min="0" style="width: 300px" controlsPosition="">
				<template slot="prefix"><span class="le-addon le-input-number__prefix" style="background: #0f0">prefix</span></template>
				<template slot="suffix"><span class="le-addon le-input-number__suffix" style="background: #f00">suffix</span></template>
			</LeInputNumber>
			<div>-------LeInputNumberRange--------</div>
			{{ numberRangeParams }}<br />
			<LeInputNumberRange v-model="numberRangeParams" v-bind="numberRangeForm" style="width: 500px">
				<!--        <template slot="prepend"><span class="le-input-number-range_addon local_prepend" style="background: #0f0;">prepend</span></template>-->
				<template slot="append"><span class="le-input-number-range_addon local_append" style="background: #f00">append</span></template>
			</LeInputNumberRange>
		</div>
		<div class="common_title">iconfont && LeIcon</div>
		<div class="content">
			<!--  单色样式类  -->
			<!--也可拼接 对应icon文件夹注入的icon 文件-->
			<SvgIcon icon-class="logo" />
			<LeIcon icon-class="icon-logo" />
			<span class="le-iconfont le-review"></span>
			<LeIcon iconClass="le-checkbox_checked"></LeIcon>
			<span class="le-iconfont le-checkbox_checked"></span>
			<LeIcon iconClass="le-checkbox"></LeIcon>
			<span class="le-iconfont le-checkbox"></span>
			<LeIcon iconClass="le-radio_checked"></LeIcon>
			<span class="le-iconfont le-radio_checked"></span>
			<LeIcon iconClass="le-radio"></LeIcon>
			<span class="le-iconfont le-radio"></span>
			<!--  svg  -->
			<LeIcon iconClass="le-frozen" @click="test"></LeIcon>
			<!--Table 操作 用： Icon按钮-->
			<el-tooltip placement="top" :content="$t('outboundOrder.btn.view')">
				<el-button class="le-icon-button" @click="test('row')">
					<LeIcon iconClass="le-view"></LeIcon>
				</el-button>
			</el-tooltip>
		</div>

		<!--    <div class="common_title">下拉Dropdown LeDropdown</div>
    <div class="content">
      <LeDropdown v-model="dropdownValue" :options="dropdownOptions" clearable modelValue>
&lt;!&ndash;        <template #btn="{ selectOption, showClear }">
          <span class="le-dropdown-link">
            {{$log(showClear, 'showClear')}}
            {{selectOption.label}}
             <i :class="['action el-icon-arrow-down']" />
          </span>
        </template>&ndash;&gt;
      </LeDropdown>

      <LeDropdown v-model="dropdownValue" :options="dropdownOptions" @command="$log($event, 'command 测试')">
        <template #btn="test">
          <span class="le-dropdown-link">
            {{test}}
             <i :class="['action el-icon-arrow-down']" />
          </span>
        </template>
        <template slot="options">
          <el-dropdown-item
            v-for="opt in dropdownOptions"
            :key="opt.value"
            :command="opt.value"
            :disabled="opt.disabled"
          >
            -&#45;&#45;{{ opt.label }}&#45;&#45;&#45;&#45; label
          </el-dropdown-item>
        </template>
      </LeDropdown>
    </div>-->
		<div class="common_title">暂无数据 LeNoData</div>
		<div class="content">
			<LeNoData @click="$log('test....')" :message="`<div style='background: #f00;'>test: lang: ${$i18n.locale}</div>`">
				<template v-slot:extraContent>no data</template>
			</LeNoData>
		</div>
		<!--    <div class="common_title">LeDraggableNest</div>
    <div class="content">
      <LeDraggableNest
        style="background: #fafafa;"
        v-model="checkedOptions"
        :move="onMove"
      />
    </div>-->
		<!--    <div class="common_title">ElCard Style</div>
    <div class="content">...</div>
    <div class="common_title">iconfont && LeIcon</div>
    <div class="content">
      <el-card shadow="never" class="le-card-bg picking-list" header="Picking List">
        <template slot="header">
          Picking List&#45;&#45;&#45;&#45;
          <el-button type="text">Clear</el-button>
        </template>
        123456
      </el-card>
    </div>-->
	</div>
</template>

<script lang="tsx">
import { defineComponent, ref, toRefs, reactive, computed, watch, onMounted } from 'vue'
import useStore from '@/store/index'
import i18n from '@/lang'
const iconOptions = [
	{ label: 'le-insurance_grey', value: 2, icon: 'le-insurance', color: '#C6CDD5' },
	{ label: 'le-sign_grey', value: 4, icon: 'le-sign', color: '#C6CDD5' },
	{ label: 'le-insurance_green', value: 1, icon: 'le-insurance', color: '#03B497' },
	{ label: 'le-sign_green', value: 3, icon: 'le-sign', color: '#03B497' }
]
const icon_configObj = iconOptions.reduce((res, v) => {
	res[v.value] = {
		icon: v.icon,
		color: v.color
	}
	return res
}, {})

export default defineComponent({
	name: 'home',
	data() {
		const options = ['add', 'restore', 'confirm', 'save', 'cancel', 'reset'].map((t, i) => {
			// return 'le.btn.' + t
			return {
				value: 'value_' + i,
				label: 'label_' + i,
				cust_value: 'cust_选项' + i,
				cust_label: 'le.btn.' + t,
				obj: {
					label: 'obj_label' + i,
					value: 'obj_value' + i
				}
			}
		})
		return {
			checkedOptions: [
				{
					label: 'Normal',
					prop: 'Normal'
				},
				{
					label: `test_children`,
					prop: 'test_children',
					children: [
						{
							label: 'child0_001',
							prop: 'child0_001'
						},
						{
							label: 'child0_002',
							prop: 'child0_002'
						}
					]
				},
				{
					label: `orderNo`,
					prop: 'orderNo'
				},
				{
					// 多语言
					t_label: `le.table.action`,
					prop: 'action',
					fixed: 'right'
				}
			],
			testNumber: 1,
			numberRangeParams: {
				numberRangeStart: 2,
				numberRangeEnd: 50
			},
			numberRangeForm: {
				prop: 'numberRange', // (numberRangeStart,  numberRangeEnd)
				// propStart: 'numberRange__min',
				// propEnd: 'numberRange__max'

				// todo...
				// addonAfterVisible: true,
				prefixIcon: '$',
				suffixIcon: '￥',
				prepend: 'Prepend',
				append: 'Append',
				min: 0,
				max: 999
				// controlsPosition: 'right' // 默认
			},
			testDrawer: false,
			searchParams: {
				radio: undefined,
				input: 'testInput',
				leSelectMultiple: ['选项1'],
				leSelectMultipleMore: ['选项2'],
				// numberInput 区间
				inputNumberRangeStart: undefined,
				inputNumberRangeEnd: undefined,
				leSelectMultipleMore_icon: [1, 3]
			},
			formOptions: {
				// 调整是否 isMore todo... 交互
				forms: [
					{
						visible: true, // 只要不为false 就是 展示
						isMore: false, // 只要不为true 就是 默认展示
						prop: 'input', // 提交的 params 的字段
						label: 'input', // label 标签
						itemType: 'input' // form-item 类型
						// prepend: 'Http://', // 额外form-item配置
						// append: '.com' // 额外form-item配置
						// placeholder: '请输入input..............' // 额外form-item配置
					},
					{
						visible: true, // 只要不为false 就是 展示
						isMore: true, // 只要不为true 就是 默认展示
						prop: 'inputMore', // 提交的 params 的字段
						label: 'inputMore', // label 标签
						itemType: 'input' // form-item 类型
						// prepend: 'Http://', // 额外form-item配置
						// append: '.com' // 额外form-item配置
					},
					{
						// visible: true, // 只要不为false 就是 展示
						// isMore: true, // 只要不为true 就是 默认展示
						prop: 'leSelect_icon', // 提交的 params 的字段
						label: 'leSelect_icon', // label 标签
						itemType: 'leSelect', // form-item 类型
						options: iconOptions,
						slotOption(h, { option, label }) {
							// console.error(option, label, 'option, label')
							const style = `color: ${option.color}`
							return <le-icon icon-class={option.icon} style={style}></le-icon>
						},
						// 渲染选中的特殊展示
						tagRender(h, { searchParams, transLabel, deleteFn, isMore }) {
							// console.error(searchParams, transLabel, deleteFn, isMore, 'searchParams, label, value')
							// 当前搜索的数据源  转译后的formLabel 删除tag的处理函数 当前渲染请求是否来自更多筛选的展示(true 可知不需要请求 tag, 可针对性优化)
							const iconValue = searchParams['leSelect_icon']
							let showValue = ''
							let tag = ''
							if (iconValue) {
								const option = icon_configObj[iconValue]
								const style = `color: ${option.color}`
								showValue = <le-icon icon-class={option.icon} style={style}></le-icon>
								// isMore请求 无需生成 tag
								if (isMore) return { showValue }
								tag = (
									<el-tag disable-transitions>
										{transLabel}：{showValue ? <span class="el-tag__label">{showValue}</span> : ''}
										<i class="icon-delete" onClick={deleteFn} />
									</el-tag>
								)
							}
							return {
								showValue,
								tag
							}
						}
					},
					{
						// visible: true, // 只要不为false 就是 展示
						isMore: true, // 只要不为true 就是 默认展示
						prop: 'leSelectMultipleMore_icon', // 提交的 params 的字段
						label: 'leSelectMultipleMore_icon', // label 标签
						itemType: 'leSelect', // form-item 类型
						multiple: true,
						options: iconOptions,
						slotOption(h, { option, label }) {
							const style = `color: ${option.color}`
							return <le-icon icon-class={option.icon} style={style}></le-icon>
						},
						// 渲染选中的特殊展示
						tagRender(h, { searchParams, transLabel, deleteFn, isMore }) {
							// console.error(searchParams, transLabel, deleteFn, isMore, 'searchParams, label, value')
							// 当前搜索的数据源  转译后的formLabel 删除tag的处理函数 当前渲染请求是否来自更多筛选的展示(true 可知不需要请求 tag, 可针对性优化)
							const iconValue = searchParams['leSelectMultipleMore_icon']
							let showValue = ''
							let tag = ''
							if (iconValue) {
								const options = Array.isArray(iconValue) ? iconValue.map(v => icon_configObj[v]) : [icon_configObj[iconValue]]
								showValue = options.map(option => {
									const style = `color: ${option.color}`
									return <le-icon icon-class={option.icon} style={style}></le-icon>
								})
								// isMore请求 无需生成 tag
								if (isMore) return { showValue }
								tag = (
									<el-tag disable-transitions>
										{transLabel}：{showValue ? <span class="el-tag__label">{showValue}</span> : ''}
										<i class="icon-delete" onClick={deleteFn} />
									</el-tag>
								)
							}
							return {
								showValue,
								tag
							}
						}
					},
					{
						// visible: true, // 只要不为false 就是 展示
						// isMore: true, // 只要不为true 就是 默认展示
						prop: 'leSelect', // 提交的 params 的字段
						label: 'leSelect', // label 标签
						itemType: 'leSelect', // form-item 类型
						labelKey: 'label_1',
						valueKey: 'value_1',
						options: Array.from({ length: 20 }).map((_, i) => {
							return {
								value_1: '选项' + i,
								label_1: '黄金糕' + i
							}
						})
					},
					{
						// visible: true, // 只要不为false 就是 展示
						isMore: true, // 只要不为true 就是 默认展示
						prop: 'leSelectMore', // 提交的 params 的字段
						label: 'leSelectMore', // label 标签
						itemType: 'leSelect', // form-item 类型
						labelKey: 'label_1',
						valueKey: 'value_1',
						options: Array.from({ length: 20 }).map((_, i) => {
							return {
								value_1: '选项' + i,
								label_1: '黄金糕' + i
							}
						})
					},
					{
						// visible: true, // 只要不为false 就是 展示
						// isMore: true, // 只要不为true 就是 默认展示
						prop: 'leSelectMultiple', // 提交的 params 的字段
						label: 'leSelectMultiple', // label 标签
						itemType: 'leSelect', // form-item 类型
						multiple: true,
						labelKey: 'label_1',
						valueKey: 'value_1',
						options: Array.from({ length: 20 }).map((_, i) => {
							return {
								value_1: '选项' + i,
								label_1: '黄金糕' + i
							}
						})
					},
					{
						// visible: true, // 只要不为false 就是 展示
						isMore: true, // 只要不为true 就是 默认展示
						prop: 'leSelectMultipleMore', // 提交的 params 的字段
						label: 'leSelectMultipleMore', // label 标签
						itemType: 'leSelect', // form-item 类型
						multiple: true,
						labelKey: 'label_1',
						valueKey: 'value_1',
						options: Array.from({ length: 20 }).map((_, i) => {
							return {
								value_1: '选项' + i,
								label_1: '黄金糕' + i
							}
						})
					},
					/* { // 可用于特殊场合中 但不支持 tagList   （支持 替代  iconTip itemType 类型）
            // showLabel: true,
            prop: 'render',
            label: '自定义Render',
            itemType: 'render',
            // change(...args) {
            //   console.error(...args, 'change...')
            // },
            // render: (h, extendsParams) => {
            //   const { form, params } = extendsParams
            //   return <a-input v-model={params[form.prop]} placeholder="placeholder test... 666"/>
            // } // todo....
            render: (h, extendsParams) => {
              // const { form, params } = extendsParams
              return <div class="icon-button-box">
                <a-tooltip>
                  <template slot="title">
                    <span domPropsInnerHTML={ '说明：<br/>' +
                      '1、分时统计：根据选择的日期范围统计每个小时的数据汇总。<br/>' +
                      '2、按周分时统计：根据选择的日期范围统计星期的数据汇总。<br/>' +
                      'eg：选择日期范围为30天，30天约等于4周。下拉选项选择“星期一”，1个月共4个星期一，系统将每个星期一的数据进行汇总统计。<br/>' +
                      '3、按日分时统计：根据选择的日期范围统计每个小时的数据。<br/>' +
                      '4、按周统计：周一到周日维度的统计<br/>' +
                      '5、按月统计：1月~12月维度的统计' }></span>
                  </template>
                  <i class='iconfont icon-question'/>
                </a-tooltip>
              </div>
            }
          }, */
					/* {
            // visible: true, // 只要不为false 就是 展示
            // isMore: true, // 只要不为true 就是 默认展示
            prop: 'select', // 提交的 params 的字段
            label: 'SELECT', // label 标签
            itemType: 'select', // form-item 类型
            options: [
              { value: 0, label: '小三' },
              { value: 1, label: '小四' }
            ]
          },
          {
            // visible: true, // 只要不为false 就是 展示
            isMore: true, // 只要不为true 就是 默认展示
            prop: 'select', // 提交的 params 的字段
            label: 'SELECT', // label 标签
            itemType: 'select', // form-item 类型
            options: [
              { value: 0, label: '小三' },
              { value: 1, label: '小四' }
            ]
          }, */
					// {
					//   prop: 'rangePicker', // 默认走bondCode 对应的  bondCodeStart, bondCodeEnd 两个字段取值 若有不同 请 使用 propStart, propEnd 作定义
					//   label: 'rangePicker(对应a-range-picker)',
					//   itemType: 'rangePicker',
					//   calendarChange: (dates) => {
					//     console.log(dates, 'test onCalendarChange')
					//   }
					// },
					/* {
            // showLabel: true,
            // isMore: true, // 只要不为true 就是 默认展示
            prop: 'dateRange', // 默认走bondCode 对应的  bondCodeStart, bondCodeEnd 两个字段取值 若有不同 请 使用 propStart, propEnd 作定义
            label: 'rangePicker(对应a-range-picker2)',
            itemType: 'rangePicker'
          },
          {
            prop: 'datePicker', // 默认走bondCode 对应的  bondCodeStart, bondCodeEnd 两个字段取值 若有不同 请 使用 propStart, propEnd 作定义
            label: 'datePicker',
            itemType: 'datePicker',
            change(params, options, isMore) {
              // // 模拟针对 change 事件 对 其他formItem 进行调整 (success) to do...
              // that.searchParams2.rangePicker = undefined // 测试only
              // console.log(params, options, isMore, 'value, options, isMore')
            }
          },
          {
            // isMore: true, // 只要不为true 就是 默认展示
            prop: 'datePicker2', // 默认走bondCode 对应的  bondCodeStart, bondCodeEnd 两个字段取值 若有不同 请 使用 propStart, propEnd 作定义
            label: 'datePicker2',
            itemType: 'datePicker'
          },

          {
            prop: 'monthPicker',
            label: 'monthPicker',
            itemType: 'monthPicker'
          },
           */
					{
						prop: 'inputNumber',
						label: 'inputNumber',
						itemType: 'inputNumber',
						change: val => {
							console.log('inputNumber   change.....', val)
						}
					},
					{
						isMore: true, // 只要不为true 就是 默认展示
						prop: 'inputNumber2',
						label: 'inputNumber2',
						itemType: 'inputNumber'
					},
					{
						prop: 'radio',
						label: 'radio',
						itemType: 'radio',
						showLabel: true,
						options: [
							{ value: 0, label: '未结算' },
							{ value: 1, label: '已结算' },
							{ value: 2, label: '全部' }
						],
						change: val => {
							console.log('radio   change.....', val)
						}
					},
					{
						isMore: true, // 只要不为true 就是 默认展示
						prop: 'radioMore',
						label: 'radioMore',
						itemType: 'radio',
						showLabel: true,
						options: [
							{ value: 10, label: '1未结算' },
							{ value: 11, label: '1已结算' },
							{ value: 12, label: '1全部' }
						],
						change: val => {
							console.log('radio   change.....', val)
						}
					},
					{
						// isMore: true, // 只要不为true 就是 默认展示
						// showLabel: true,
						prop: 'inputNumberRange', // 若不添加 propStart  propEnd 自动变为 `${prop}Start` `${prop}End`
						// propStart: 'inputNumberRange_start',
						// propEnd: 'inputNumberRange_end',
						label: 'inputNumberRange',
						itemType: 'inputNumberRange',
						prefix: '$',
						// suffix: '￥',
						// prepend: 'Prepend',
						// append: 'Append',
						min: 0,
						max: 999,
						// placeholderStart: 'xxxx最小值', // 直接支持多语言
						// placeholderEnd: 'xxxx最大值',
						change(params, _options, isMore, propKey) {
							// options 无用 其他有用
							console.log(params, _options, isMore, propKey, 'params, _options, isMore, propKey')
						}
					},
					{
						isMore: true, // 只要不为true 就是 默认展示
						// showLabel: true,
						prop: 'inputNumberRangeMore', // 若不添加 propStart  propEnd 自动变为 `${prop}Start` `${prop}End`
						// propStart: 'inputNumberRange_start',
						// propEnd: 'inputNumberRange_end',
						label: 'inputNumberRangeMore',
						itemType: 'inputNumberRange',
						prefix: '$',
						// suffix: '￥',
						// prepend: 'Prepend',
						// append: 'Append',
						min: 0,
						max: 999,
						// placeholderStart: 'xxxx最小值', // 直接支持多语言
						// placeholderEnd: 'xxxx最大值',
						change(params, _options, isMore, propKey) {
							// options 无用 其他有用
							console.log(params, _options, isMore, propKey, 'params, _options, isMore, propKey')
						}
					}
					// 复合类型_【下拉+rangePicker】 注：  【替代： SearchInfo timeSelect 类型】
					/* { // 复合类型 todo...
            // isMore: true, // 只要不为true 就是 默认展示 (暂无该类型)
            label: 'compact_label',
            // showLabel: true,
            itemType: 'compact',
            children: [
              {
                prop: 'compact_select&rangePicker_select',
                label: 'compact_select&rangePicker_select',
                itemType: 'select',
                options: [
                  { value: 0, label: '小三' },
                  { value: 1, label: '小四' }
                ],
                // showSearch: true,
                itemWidth: '90px'
                // placeholder: '请选择select'
              },
              {
                prop: 'compact_select&rangePicker_rangePicker',
                label: 'compact_select&rangePicker_rangePicker',
                itemType: 'rangePicker',
                calendarChange: (dates) => {
                  console.log(dates, 'test compact_select&rangePicker_ onCalendarChange')
                }
              }
            ]
          }, */
					/* // 复合类型_【下拉+input】 注：  【替代： SearchInfo textSelect 类型】
          {
            // isMore: true, // 只要不为true 就是 默认展示 (暂无该类型)
            label: 'compact_select&input',
            // showLabel: true,
            itemType: 'compact',
            children: [
              {
                prop: 'compact_select&input_select',
                label: 'compact_select&input_select',
                itemType: 'select',
                options: [
                  { value: 0, label: '小三' },
                  { value: 1, label: '小四' }
                ],
                // showSearch: true,
                allowClear: false,
                itemWidth: '90px'
              },
              {
                prop: 'compact_select&input_input', // 提交的 params 的字段
                label: 'compact_select&input_input', // label 标签
                itemType: 'input',
                itemWidth: '190px',
                placeholder: '支持模糊搜索'
              }
            ]
          }, */
				]
			},
			i18n: true,
			valueKey: 'value_1',
			options,
			// options: JSON.parse(JSON.stringify(options)),
			// options2: JSON.parse(JSON.stringify(options)),
			options3: Array.from({length: 50}).map((_, i) => {
				return {
					value: 'value_' + i,
					label: 'label_' + i,
					cust_value: 'cust_选项' + i,
					cust_label: 'le.btn.' + i,
					obj: {
						label: 'obj_label' + i,
						value: 'obj_value' + i
					}
				}
			}),

			testValue: undefined,
			testValue2: ['选项0', '选项1', '选项2'],
			dropdownValue: undefined,
			dropdownOptions: [
				{
					label: 'in',
					value: 0
				},
				{
					label: 'cm',
					value: 1
				}
			]
		}
	},
	watch: {
		searchParams(params) {
			console.error(params, 'searchParams 更新...')
		},
	},
	created() {
		window.components = this
	},
	methods: {
		triggerFilter() {
			this.testDrawer = true
			this.$message.warning('触发 filter 方法')
		},
		selectedSettingSubmit(group, dialog) {
			// group: searchGroup 组件实例
			// dialog: 配置快捷forms 弹窗实例
			dialog.submitLoading = true
			setTimeout(() => {
				console.warn('todo...... checkedOptions 提交 commit', dialog.checkedOptions)
				dialog.submitLoading = false
				// dialog.visibleChange(false)
				this.$message.success(this.$t('le.message.editSuccess'))
				// const forms = JSON.parse(JSON.stringify(this.formOptions.forms))
				const moreForms = this.formOptions.forms
				moreForms.forEach(v => {
					v.isMore = true
				})
				const defaultForms = dialog.checkedOptions.reduce((items, cur) => {
					const idx = moreForms.findIndex(v => v.prop === cur.prop)
					if (idx > -1) {
						// forms 内删除 确定的快捷方式
						const [item] = moreForms.splice(idx, 1)
						item.isMore = false
						// defaultForms 内添加 该item
						items.push(item)
					}
					return items
				}, [])
				// 重置 formOptions.forms
				this.formOptions.forms = defaultForms.concat(moreForms)

				// group.selectedSettingVisible = false
				group.selectedSettingVisibleChange(false)
			}, 500)
		},
		test() {
			console.error('test...')
		},
		switchLang() {
			let lang = this.$i18n.locale
			// let lang = i18n.global.locale.value
			if (lang === 'en') {
				lang = 'zh-cn'
			} else {
				lang = 'en'
			}
			// const { app } = useStore()
			// app.setLanguage(lang)
			this.$i18n.locale = lang
			// i18n.global.setLocaleMessage(lang)
			// this.$i18n.fallbackLocale = lang
		},
		onMove({ relatedContext, draggedContext }) {
			const relatedElement = relatedContext.element
			const draggedElement = draggedContext.element
			// fixed 表示 固定的项
			return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
		}
	}
})
</script>
<style lang="scss" scoped>
.pageWrap {
	padding: 10px 12px;
	overflow: auto;
}
</style>