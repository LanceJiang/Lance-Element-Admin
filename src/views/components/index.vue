<template>
	<div class="flex-column-page-wrap pageWrap">
		Home
		<div class="common_title">多语言 使用</div>
		<div>
			<span
				class="le-link"
				@click="
					commonDownload('https://gooles.oss-cn-hongkong.aliyuncs.com/%E9%87%87%E8%B4%AD%E8%AE%A2%E5%8D%95%E5%90%88%E5%90%8C-CG2025079710003.pdf')
				"
			>
				模拟链接下载
			</span>
		</div>
		<div class="content">
			<el-button size="small" @click="switchLang">
				lang: 切换
				<LeIcon icon-class="le-frozen" />
				<LeIcon icon-class="le-warning" />
				{{ $i18n.locale }}
			</el-button>
			<div>local文字: {{ $t('route.dashboard') }}</div>
			<div>src/locale 文字(携带 le前缀做区分): {{ $t('le.btn.add') }}</div>
		</div>
		<LeText class="w-[100px]" value="我是文字我是文字我是文字我是文字我是文字我是文字" copy> </LeText>
		<LeText
			class="w-[150px]"
			line-clamp="2"
			value="我是文字我是文字我是文字我是文字我是文字我是文字我是文字我是文字我是文字我是文字我是文字我是文字我是文字我是文字我是文字我是文字我是文字我是文字"
			copy
		>
		</LeText>
		<SearchGroup2Popover v-if="false" />
		<InputNumberDemo v-if="true" />
		<LeDraggableNestDemo v-if="true" />
		<WatermarkDemo v-if="true" />

		<div class="common_title">le-iconfont && SvgIcon(iconfont/icons) && LeIcon</div>
		<div class="content">
			<!--  单色样式类  -->
			<!--也可拼接 对应icon文件夹注入的icon 文件-->
			<div class="bg-[red]">
				<LeIcon class="mx-1" icon-class="le-view"></LeIcon>
				<SvgIcon class="mx-1" icon-class="le-view" prefix=""></SvgIcon>
				<SvgIcon class="mx-1" icon-class="log"></SvgIcon>
				---
				<LeIcon class="localCls" icon-class="ep:view" />
				<LeIcon class="localCls" icon-class="le-view" />
			</div>
			<span class="bg-[yellow]">
				le-iconfont
				<span class="le-iconfont le-review mx-1"></span>
				<span class="le-iconfont le-checkbox_checked mx-1"></span>
				<span class="le-iconfont le-checkbox mx-1"></span>
				<span class="le-iconfont le-radio_checked mx-1"></span>
				<span class="le-iconfont le-radio mx-1"></span>
			</span>
			<span class="bg-[pink] text-[16px]">
				SvgIcon
				<SvgIcon class="mx-1" icon-class="logo" />
				<SvgIcon class="mx-1" icon-class="404" />
				<!-- iconfont 定义的 svg -->
				<SvgIcon class="text-error mx-1" prefix="" icon-class="le-loading" spin />
			</span>
			<span class="bg-[green] text-[16px]">
				LeIcon
				<!--icons-->
				<LeIcon class="mx-1" icon-class="icon-logo" />
				<LeIcon class="mx-1" icon-class="icon-404" />
				<!-- iconfont 定义的 svg -->
				<LeIcon class="text-error mx-1" icon-class="le-loading" spin />
				<LeIcon class="mx-1" icon-class="le-checkbox"></LeIcon>
				<!-- iconfont 定义的 svg icon-name: 参考 https://icon-sets.iconify.design/ -->
				<LeIcon class="mx-1" icon-class="svg-spinners:wind-toy"></LeIcon>
			</span>

			<!--  svg  -->
			<LeIcon class="mx-1" icon-class="le-frozen" @click="testHandler"></LeIcon>
			<!--Table 操作 用： Icon按钮-->
			<el-tooltip placement="top" :content="$t('le.btn.search')">
				<el-button class="le-icon-button" @click="testHandler('row')">
					<LeIcon class="mx-1" icon-class="le-view"></LeIcon>
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
        <template #btn="testHandler">
          <span class="le-dropdown-link">
            {{testHandler}}
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
		<div class="common_title">IconPicker</div>
		<div class="content">
			<IconPicker v-model="curIcon" />
			<div style="margin: 6px 0">
				当前选中的 PickerIcon 为：
				<PickerIcon style="color: var(--el-color-danger); font-size: 24px" :icon-class="curIcon || 'Grid'" />
			</div>
		</div>
		<div class="common_title">暂无数据 LeNoData</div>
		<div class="content">
			<LeNoData :message="`<div style='background: var(--el-color-danger);'>test: lang: ${$i18n.locale}</div>`" @click="$log('test....')">
				<template #extraContent>no data</template>
			</LeNoData>
		</div>

		<div class="common_title">ElCard Style</div>
		<div class="content">
			<el-card shadow="never" class="le-card-bg" header="清单">
				<template #header>
					清单----
					<span class="le-link">Clear</span>
				</template>
				<div>内容区....</div>
			</el-card>
		</div>

		<div class="common_title">LeEditPopover</div>
		<div class="content">
			<LeEditPopover />
			<LeEditPopover v-model:visible="local_visible">
				<template #reference>
					<el-button icon="Filter" />
				</template>
				<div class="title">控制title</div>
				<el-scrollbar max-height="400px">
					<div class="content">相关业务... <el-button type="danger" @click="local_visible = false">关闭</el-button></div>
				</el-scrollbar>
			</LeEditPopover>
		</div>

		<div class="common_title">To Do List</div>
		<div class="content">to do...</div>
	</div>
</template>

<script setup name="home" lang="tsx">
import { ref } from 'vue'
import SearchGroup2Popover from './components/SearchGroup2Popover.vue'
import InputNumberDemo from './components/InputNumberDemo.vue'
import LeDraggableNestDemo from './components/LeDraggableNestDemo.vue'
import WatermarkDemo from './components/WatermarkDemo.vue'
import IconPicker from '@/components/IconPicker/index.vue'
import PickerIcon from '@/components/IconPicker/PickerIcon.vue'
import useStore from '@/store/index'
import { useI18n } from 'vue-i18n'
import { commonDownload } from '@/utils'
// import i18n from '@/lang'
const dropdownValue = ref()
const dropdownOptions = ref([
	{
		label: 'in',
		value: 0
	},
	{
		label: 'cm',
		value: 1
	}
])
const curIcon = ref('icon-404')
const local_visible = ref(false)
const testHandler = (test: any) => {
	console.error('testHandler...', test)
}
const { locale } = useI18n()
const switchLang = () => {
	// let lang = this.$i18n.locale
	// let lang = i18n.global.locale.value
	let lang = locale.value
	if (lang === 'en') {
		lang = 'zh-cn'
	} else {
		lang = 'en'
	}
	// console.error(lang, 'lang')
	locale.value = lang
	const { app } = useStore()
	app.setLanguage(lang)
	// i18n.global.setLocaleMessage(lang)
	// this.$i18n.locale = lang
	// this.$i18n.fallbackLocale = lang
}
</script>
<style lang="scss" scoped>
.pageWrap {
	padding: 10px 12px;
	overflow: auto;
}
.le-iconfont {
	color: #0d84ff;
}
</style>
