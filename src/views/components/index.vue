<template>
	<div class="flex-column-page-wrap pageWrap">
		Home
		<div class="common_title">多语言 使用</div>
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
		<SearchGroup2Popover v-if="false" />
		<LeSelectDemo v-if="true" />
		<InputNumberDemo v-if="true" />
		<LeDraggableNestDemo v-if="true" />

		<div class="common_title">iconfont && LeIcon</div>
		<div class="content">
			<!--  单色样式类  -->
			<!--也可拼接 对应icon文件夹注入的icon 文件-->
			<SvgIcon icon-class="logo" />
			<LeIcon icon-class="icon-logo" />
			<span class="le-iconfont le-review"></span>
			<LeIcon icon-class="le-checkbox_checked"></LeIcon>
			<span class="le-iconfont le-checkbox_checked"></span>
			<LeIcon icon-class="le-checkbox"></LeIcon>
			<span class="le-iconfont le-checkbox"></span>
			<LeIcon icon-class="le-radio_checked"></LeIcon>
			<span class="le-iconfont le-radio_checked"></span>
			<LeIcon icon-class="le-radio"></LeIcon>
			<span class="le-iconfont le-radio"></span>
			<!--  svg  -->
			<LeIcon icon-class="le-frozen" @click="testHandler"></LeIcon>
			<!--Table 操作 用： Icon按钮-->
			<el-tooltip placement="top" :content="$t('le.btn.search')">
				<el-button class="le-icon-button" @click="testHandler('row')">
					<LeIcon icon-class="le-view"></LeIcon>
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
		<div class="common_title">暂无数据 LeNoData</div>
		<div class="content">
			<LeNoData :message="`<div style='background: #f00;'>test: lang: ${$i18n.locale}</div>`" @click="$log('test....')">
				<template #extraContent>no data</template>
			</LeNoData>
		</div>

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

<script setup name="home" lang="tsx">
import { ref } from 'vue'
import SearchGroup2Popover from './components/SearchGroup2Popover'
import LeSelectDemo from './components/LeSelectDemo'
import InputNumberDemo from './components/InputNumberDemo'
import LeDraggableNestDemo from './components/LeDraggableNestDemo'
import useStore from '@/store/index'
import { useI18n } from 'vue-i18n'
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
const testHandler = () => {
	console.error('testHandler...')
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
