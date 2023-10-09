<template>
	<el-input v-model="currentSelect" class="le-icon-picker" :disabled="disabled" clearable placeholder="请输入图标名称">
		<template #append>
			<el-popover v-model:visible="visible" popper-class="le-icon-picker_popover" placement="bottom-end" trigger="click">
				<template #reference>
					<PickerIcon class="icon-selected" :icon-class="currentSelect || 'Grid'" />
				</template>
				<el-input v-model="searchValue" placeholder="搜索图标" clearable @clear="searchIconsHandler" @input="searchIconsHandler">
					<template #prepend>
						<el-select v-model="curIconType" :teleported="false" placeholder="Select" style="width: 100px">
							<el-option v-for="item in iconTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</template>
				</el-input>
				<el-scrollbar class="local_scrollbar">
					<div class="icon-list">
						<template v-if="currentList.length">
							<div
								v-for="(item, index) in currentList"
								:key="index"
								:title="item"
								:class="`item ${item === currentSelect_name ? 'active' : ''}`"
								@click="updateIcon(item)"
							>
								<PickerIcon class="local_icon" :icon-class="`${curIconType}${item}`" />
								<span class="text text-overflow_ellipsis_line_2">{{ item }}</span>
							</div>
						</template>
						<LeNoData v-else size="small"></LeNoData>
					</div>
				</el-scrollbar>
			</el-popover>
		</template>
	</el-input>
</template>

<script setup lang="ts">
import PickerIcon from './PickerIcon.vue'
// import svgIcons from 'virtual:svg-icons-names'
import { iconTypeOptions } from './iconsData.ts'
import { useDebounceFn } from '@vueuse/core'
import { ref, watch, watchEffect, computed } from 'vue'
const props = defineProps({
	modelValue: {
		type: String,
		default: ''
	},
	disabled: {
		type: Boolean,
		default: false
	}
})

const curIconType = ref(iconTypeOptions[0].value)
const curIconType_icons = ref(iconTypeOptions[0].icons)
const currentList = ref(iconTypeOptions[0].icons)
watch(curIconType, value => {
	const option = iconTypeOptions.find(v => v.value === value)
	if (option) {
		curIconType_icons.value = option.icons
		currentList.value = option.icons
		// 更新当前filter
		update_currentList()
	}
})

const currentSelect = ref('')
const currentSelect_type = ref<string>()
// 去除前缀的 name
const currentSelect_name = computed(() => {
	let name = currentSelect.value
	if (name) {
		// icon, le-iconfont
		const bool = ['icon-', 'le-'].some(prefix => {
			if (name.startsWith(prefix)) {
				name = name.replace(prefix, '')
				currentSelect_type.value = prefix
				return true
			}
		})
		if (!bool) {
			// eslint-disable-next-line vue/no-side-effects-in-computed-properties
			currentSelect_type.value = ''
		}
	} else {
		// eslint-disable-next-line vue/no-side-effects-in-computed-properties
		currentSelect_type.value = undefined
	}
	return name
})
const visible = ref(false)
watch(visible, (bool: boolean) => {
	// 弹窗开启时 进行定位筛查
	if (bool) {
		searchValue.value = currentSelect_name.value
		// 更新当前 icon类型
		if (typeof currentSelect_type.value === 'string') {
			curIconType.value = currentSelect_type.value
		}
		// 更新当前filter
		update_currentList()
	}
})
watchEffect(() => {
	currentSelect.value = props.modelValue as string
})
const searchValue = ref('')
const update_currentList = () => {
	if (searchValue.value) {
		currentList.value = curIconType_icons.value.filter(item => item.indexOf(searchValue.value) !== -1)
	} else {
		currentList.value = curIconType_icons.value
	}
}
// 搜索
const searchIconsHandler = useDebounceFn(update_currentList, 80)
const emit = defineEmits(['update:modelValue', 'change'])

function updateIcon(name: string) {
	const realName = curIconType.value + name
	// const realName = name
	emit('update:modelValue', realName)
	currentSelect.value = realName
	document.body.click()
}

function reset() {
	currentSelect.value = ''
	currentList.value = curIconType_icons.value
}

defineExpose({
	reset
})
</script>

<style lang="scss">
.#{$prefix}icon-picker {
	.el-input-group__append {
		padding: 0;
	}
	// 选中的icon
	.icon-selected {
		font-size: 16px;
		margin: 0 0.5rem;
		cursor: pointer;
	}
	// 弹窗
	&_popover {
		&.el-popper {
			//width: 360px;
			min-width: 300px;
			line-height: 1;
			//padding: 12px 0 0;
		}
		//.el-scrollbar__view {
		.local_scrollbar {
			margin-top: 10px;
			box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
			border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
		}
		.el-scrollbar__wrap {
			overflow-y: scroll;
			overflow-x: hidden;
			max-height: 22vh;
		}
		.icon-list {
			margin-top: 8px;
			//height: 200px;
			//overflow-y: scroll;
			.item {
				//height: 30px;
				//line-height: 30px;
				padding-bottom: 5px;
				cursor: pointer;
				width: 20%;
				float: left;
				//color: #999;
				//color: var(--el-text-color-secondary);
				color: var(--el-text-color-placeholder);
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				&.active {
					color: var(--el-color-primary);
				}
			}
			.local_icon {
				height: 24px;
				width: 24px;
				font-size: 24px;
				//width: 16px;
				//margin-right: 5px;
			}
			.text {
				font-size: 12px;
				padding: 2px 2px 0;
				-webkit-line-clamp: 1;
				// flex: 1;
			}
		}
	}
}
</style>
