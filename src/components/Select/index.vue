<template>
	<div
		ref="selectRef"
		v-click-outside:[popperRef]="handleClickOutside"
		:class="[nsSelectV2.b(), nsSelectV2.m(selectSize), 'le-select']"
		@click.stop="toggleMenu"
		@mouseenter="states.comboBoxHovering = true"
		@mouseleave="states.comboBoxHovering = false"
	>
		<component
			:is="isPopover ? 'ElTooltip' : 'EmptyComponent'"
			ref="popper"
			:visible="dropdownMenuVisible"
			:teleported="teleported"
			:popper-class="[nsSelectV2.e('popper'), popperClass, 'le-select__popper']"
			:gpu-acceleration="false"
			:stop-popper-mouse-event="false"
			:popper-options="popperOptions"
			:fallback-placements="['bottom-start', 'top-start', 'right', 'left']"
			:effect="effect"
			:placement="placement"
			pure
			:transition="`${nsSelectV2.namespace.value}-zoom-in-top`"
			trigger="click"
			:persistent="persistent"
			@before-show="handleMenuEnter"
			@hide="states.inputValue = states.displayInputValue"
		>
			<template #default>
				<div
					ref="selectionRef"
					:class="[
						nsSelectV2.e('wrapper'),
						nsSelectV2.is('focused', states.isComposing || expanded),
						nsSelectV2.is('hovering', states.comboBoxHovering),
						nsSelectV2.is('filterable', filterable),
						nsSelectV2.is('disabled', selectDisabled)
					]"
				>
					<div v-if="$slots.prefix">
						<slot name="prefix" />
					</div>
					<div v-if="multiple" :class="nsSelectV2.e('selection')">
						<template v-if="collapseTags && modelValue.length > 0">
							<!-- 折叠类型>展示标签 -->
							<div v-for="item in showTagList" :key="getValueKey(item)" :class="nsSelectV2.e('selected-item')">
								<el-tag
									:closable="!selectDisabled && !item?.disable"
									:size="collapseTagSize"
									type="info"
									disable-transitions
									@close="deleteTag($event, item)"
								>
									<span
										:class="nsSelectV2.e('tags-text')"
										:style="{
											maxWidth: `${tagMaxWidth}px`
										}"
										>{{ i18n ? getLabel(item) : item?.le_label }}</span
									>
								</el-tag>
							</div>
							<!-- 折叠类型>(被折叠的)更多标签 -->
							<div :class="nsSelectV2.e('selected-item')">
								<el-tag v-if="modelValue.length > maxCollapseTags" :closable="false" :size="collapseTagSize" type="info" disable-transitions>
									<el-tooltip
										v-if="collapseTagsTooltip"
										:disabled="dropdownMenuVisible"
										:fallback-placements="['bottom', 'top', 'right', 'left']"
										:effect="effect"
										placement="bottom"
										:teleported="false"
									>
										<template #default>
											<span
												:class="nsSelectV2.e('tags-text')"
												:style="{
													maxWidth: `${tagMaxWidth}px`
												}"
												>+ {{ modelValue.length - maxCollapseTags }}</span
											>
										</template>
										<template #content>
											<div :class="nsSelectV2.e('selection')">
												<div v-for="selected in collapseTagList" :key="getValueKey(selected)" :class="nsSelectV2.e('selected-item')">
													<el-tag
														:closable="!selectDisabled && !selected.disabled"
														:size="collapseTagSize"
														class="in-tooltip"
														type="info"
														disable-transitions
														@close="deleteTag($event, selected)"
													>
														<span
															:class="nsSelectV2.e('tags-text')"
															:style="{
																maxWidth: `${tagMaxWidth}px`
															}"
															>{{ i18n ? getLabel(selected) : selected?.le_label }}</span
														>
													</el-tag>
												</div>
											</div>
										</template>
									</el-tooltip>
									<span
										v-else
										:class="nsSelectV2.e('tags-text')"
										:style="{
											maxWidth: `${tagMaxWidth}px`
										}"
										>+ {{ modelValue.length - maxCollapseTags }}</span
									>
								</el-tag>
							</div>
						</template>

						<template v-else>
							<div v-for="selected in states.cachedOptions" :key="getValueKey(selected)" :class="nsSelectV2.e('selected-item')">
								<el-tag
									:closable="!selectDisabled && !selected.disabled"
									:size="collapseTagSize"
									type="info"
									disable-transitions
									@close="deleteTag($event, selected)"
								>
									<span
										:class="nsSelectV2.e('tags-text')"
										:style="{
											maxWidth: `${tagMaxWidth}px`
										}"
										>{{ /*getLabel(selected)*/selected?.le_label }}</span
									>
								</el-tag>
							</div>
						</template>
						<div
							:class="[
                nsSelectV2.e('selected-item'),
                nsSelectV2.e('input-wrapper'),
              ]"
							:style="inputWrapperStyle"
						>
							<input
								:id="id"
								ref="inputRef"
								v-model-text="states.displayInputValue"
								:onUpdate:modelValue="onUpdateInputValue"
								:autocomplete="autocomplete"
								aria-autocomplete="list"
								aria-haspopup="listbox"
								autocapitalize="off"
								:aria-expanded="expanded"
								:aria-labelledby="label"
								:class="[
                  nsSelectV2.is(selectSize),
                  nsSelectV2.e('combobox-input'),
                ]"
								:disabled="disabled"
								role="combobox"
								:readonly="!filterable"
								spellcheck="false"
								type="text"
								:name="name"
								:unselectable="expanded ? 'on' : undefined"
								@focus="handleFocus"
								@blur="handleBlur"
								@input="onInput"
								@compositionstart="handleCompositionStart"
								@compositionupdate="handleCompositionUpdate"
								@compositionend="handleCompositionEnd"
								@keydown.up.stop.prevent="onKeyboardNavigate('backward')"
								@keydown.down.stop.prevent="onKeyboardNavigate('forward')"
								@keydown.enter.stop.prevent="onKeyboardSelect"
								@keydown.esc.stop.prevent="handleEsc"
								@keydown.delete.stop="handleDel"
							/>
							<span
								v-if="filterable"
								ref="calculatorRef"
								aria-hidden="true"
								:class="nsSelectV2.e('input-calculator')"
								v-text="states.displayInputValue"
							/>
						</div>
					</div>
					<template v-else>
						<div
							:class="[
                nsSelectV2.e('selected-item'),
                nsSelectV2.e('input-wrapper')
              ]"
						>
							<input
								:id="id"
								ref="inputRef"
								v-model-text="states.displayInputValue"
								:onUpdate:modelValue="onUpdateInputValue"
								aria-autocomplete="list"
								aria-haspopup="listbox"
								:aria-labelledby="label"
								:aria-expanded="expanded"
								autocapitalize="off"
								:autocomplete="autocomplete"
								:class="nsSelectV2.e('combobox-input')"
								:disabled="disabled"
								:name="name"
								role="combobox"
								:readonly="!filterable"
								spellcheck="false"
								type="text"
								:unselectable="expanded ? 'on' : undefined"
								@compositionstart="handleCompositionStart"
								@compositionupdate="handleCompositionUpdate"
								@compositionend="handleCompositionEnd"
								@focus="handleFocus"
								@blur="handleBlur"
								@input="onInput"
								@keydown.up.stop.prevent="onKeyboardNavigate('backward')"
								@keydown.down.stop.prevent="onKeyboardNavigate('forward')"
								@keydown.enter.stop.prevent="onKeyboardSelect"
								@keydown.esc.stop.prevent="handleEsc"
							/>
						</div>
						<span
							v-if="filterable"
							ref="calculatorRef"
							aria-hidden="true"
							:class="[
                nsSelectV2.e('selected-item'),
                nsSelectV2.e('input-calculator')
              ]"
							v-text="states.displayInputValue"
						/>
					</template>
					<span
						v-if="shouldShowPlaceholder"
						:class="[
              nsSelectV2.e('placeholder'),
              nsSelectV2.is(
                'transparent',
                multiple ? modelValue.length === 0 : !hasModelValue
              ),
            ]"
					>
            {{ currentPlaceholder }}
          </span>
					<span :class="nsSelectV2.e('suffix')">
            <el-icon
							v-if="iconComponent"
							v-show="!showClearBtn"
							:class="[nsSelectV2.e('caret'), nsInput.e('icon'), iconReverse]"
						>
              <component :is="iconComponent" />
            </el-icon>
            <el-icon
							v-if="showClearBtn && clearIcon"
							:class="[nsSelectV2.e('caret'), nsInput.e('icon')]"
							@click.prevent.stop="handleClear"
						>
              <component :is="clearIcon" />
            </el-icon>
            <el-icon
							v-if="validateState && validateIcon"
							:class="[nsInput.e('icon'), nsInput.e('validateIcon')]"
						>
              <component :is="validateIcon" />
            </el-icon>
          </span>
				</div>
			</template>
			<template #content>
				<div
					v-if="multiple"
					v-show="filteredOptions.length"
					:class="['el-select-dropdown__item checkAll', isCheckAll ? 'selected' : indeterminateClass]"
					@click="checkAllHandler"
				>
					{{ $t('le.selectAll') }}
				</div>
				<el-select-menu
					ref="menuRef"
					:data="filteredOptions"
					:width="popperSize"
					:hovering-index="states.hoveringIndex"
					:scrollbar-always-on="scrollbarAlwaysOn"
				>
					<template #default="scope">
						<slot v-bind="scope">
							{{scope.item.le_label}}
						</slot>
					</template>
					<template #empty>
						<slot name="empty">
							<NoData :message="emptyText" />
							<!--							<p :class="nsSelectV2.e('empty')">
								{{ emptyText ? emptyText : '' }}
							</p>-->
						</slot>
					</template>
				</el-select-menu>
			</template>
		</component>
	</div>
</template>

<script lang="tsx">
import {
	computed,
	defineComponent,
	provide,
	reactive,
	toRefs,
	vModelText,
} from 'vue'
// import { isArray } from '@element-plus/utils'
import { isArray } from 'element-plus/es/utils/index.mjs'
// import { ClickOutside } from '@element-plus/directives'
import { ClickOutside } from 'element-plus/es/directives/index.mjs'
// import ElTooltip from '@element-plus/components/tooltip'
// import ElTag from '@element-plus/components/tag'
// import ElIcon from '@element-plus/components/icon'
import NoData from '@/components/NoData'
// import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '@element-plus/constants'
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from 'element-plus/es/constants/index.mjs'
import ElSelectMenu from './select-dropdown'
import useSelect from './useSelect'
import { selectV2InjectionKey } from './token'
import { SelectProps } from './defaults'
// const isArray = Array.isArray
const EmptyComponent = defineComponent({
	name: 'EmptyComponent',
	// props: {
	// 	visible: Boolean,
	// },
	// emits: ['before-show', 'hide'],
	setup(props, { emit, slots, expose }) {
		// const popperRef = ref()
		// const updatePopper = () => {
		// 	console.error('test updatePopper', popperRef.value)
		// }
		// expose({ updatePopper })
		// ref={popperRef}
		return () => {
			return <div>
				{slots.default?.()}
				<div class="le-empty-popper">
					{slots.content?.()}
				</div>
			</div>
		}
	}
})
export default defineComponent({
	// name: 'ElSelectV2',
	name: 'LeSelect',
	components: {
		ElSelectMenu,
		NoData,
		EmptyComponent
		// ElTag,
		// ElTooltip,
		// ElIcon
	},
	directives: { ClickOutside, ModelText: vModelText },
	props: SelectProps,
	emits: [
		UPDATE_MODEL_EVENT,
		CHANGE_EVENT,
		'remove-tag',
		'clear',
		'visible-change',
		'focus',
		'blur',
		'update:selected_label',
	],

	setup(props, { emit }) {
		const modelValue = computed(() => {
			const { modelValue: rawModelValue, multiple } = props
			const fallback = multiple ? [] : undefined
			// When it is array, we check if this is multi-select.
			// Based on the result we get
			if (isArray(rawModelValue)) {
				return multiple ? rawModelValue : fallback
			}
			return multiple ? fallback : rawModelValue
		})

		// eslint-disable-next-line
		// @ts-ignore
		const API = useSelect(
			reactive({
				...toRefs(props),
				modelValue
			}),
			emit
		)
		// TODO, remove the any cast to align the actual API.
		provide(selectV2InjectionKey, {
			props: reactive({
				...toRefs(props),
				height: API.popupHeight,
				modelValue
			}),
			popper: API.popper,
			onSelect: API.onSelect,
			onHover: API.onHover,
			onKeyboardNavigate: API.onKeyboardNavigate,
			onKeyboardSelect: API.onKeyboardSelect
		} as any)

		return {
			...API,
			modelValue
		}
	}
})
</script>
