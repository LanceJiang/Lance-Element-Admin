<template>
	<div class="flex-column-page-wrap pageWrap">
		<LeTable
			v-model:search-params="searchParams"
			v-model:checked-options="tabs_checkedColumns"
			class="local_table tabs_content-wrap"
			:list="localList"
			:total="total"
			:options="options"
			:columns="localColumns"
			:columns-config="tabs_columnsConfig"
			@sortChange="testSortChange"
		>
			<!--			@update:checkedOptions="tabs_updateCheckedColumns"-->
			<template #toolLeft>
				<h3 style="line-height: 36px">Table表格示例</h3>
				<!--        <LeSearchGroup/>-->
				<!--<le-search-group
					class="local_search-group-wrap"
					:forms="tabs_filterForms"
					v-model="tabs_filterParams"
					:loading='tabs_loading'
					:selectedSettingSubmit="tabs_selectedSettingSubmit"
					:tabCreateSubmit="tabs_tabCreate"
					:deleteTag="deleteTag">
					<template #prepend>
						<el-input
							class="le-input-search"
							v-model="tabs_filterParams.pattern"
							size="medium"
							:placeholder="$t('outboundOrder.filter.pattern.placeholder')"
							clearable
							@keyup.enter.native="updateParams"
						>
							<i slot="suffix" class="el-input__icon el-icon-search" @click="updateParams"/>
						</el-input>
					</template>
					<template #leSelectSlot="{option, label}">
						<div style="background: #A0AAB7;">{{label}} + {{ option.value_1 }}</div>
					</template>
				</le-search-group>-->
			</template>
			<template #top>
				<!-- 按钮集合 -->
				<div class="le-button-wrap">
					<template v-if="true">
						<el-tooltip placement="top" content="CreateBatchTip">
							<el-button type="primary" :class="{ 'is-disabled_test': true }">
								{{ $t('example.btn.createBatch') }}
							</el-button>
						</el-tooltip>
						<el-button style="margin-right: 10px">
							{{ $t('example.btn.bulkPicking') }}
						</el-button>
					</template>
					<!-- :disabled="!selectList.length"-->
					<el-dropdown>
						<el-button>
							{{ $t('example.btn.print') }}
						</el-button>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item v-for="v of dropdownList" :key="v" :command="v">
									{{ $t(`example.btn.${v}`) }}
								</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</div>
			</template>
			<!-- 自定义slot title -->
			<template #slotName_title>
				<div class="slot_title-wrap">
					<el-tooltip placement="top" content="slotName_title by localUser">
						<span class="label">slotName_title by localUser</span>
					</el-tooltip>
				</div>
			</template>
			<!-- 操作 -->
			<template #action="{ row }">
				<el-tooltip placement="top" :content="$t('example.table.user')">
					<el-button class="le-icon-button">
						<LeIcon icon-class="le-view"></LeIcon>
					</el-button>
				</el-tooltip>
				<el-button class="le-icon-button">
					<LeIcon icon-class="le-hide_column"></LeIcon>
				</el-button>
				<el-button class="le-icon-button" disabled>
					<LeIcon icon-class="le-hide_column"></LeIcon>
				</el-button>
			</template>
		</LeTable>
	</div>
</template>
<script lang="jsx">
import {
	// columns,
	tableBaseMixin
} from './default_config'

const prefix = 'example.forms.'
// import { ref } from 'vue'
import i18n from '@/lang/index'

export default {
	name: 'TableDefault',
	mixins: [tableBaseMixin],
	data() {
		// const _this = this
		return {}
	},
	created() {
		console.log('created')
		window.form = this
	}
}
</script>
<style scoped lang="scss">
.pageWrap {
	//padding-top: 12px;
	padding: 12px 12px 0 12px;
	overflow: auto;
	background-color: $le-bg-color_1;
}

// 其他样式
.local_table {
	//padding: 0 12px;
	box-shadow: 0 0 6px 4px rgb(145 159 175 / 6%);
	border-top: 1px solid $le-border-color_3;
	border-radius: 6px 6px 0 0;
	//padding: 12px 12px 0 12px;
	&.tabs_content-wrap {
		border-top: 0;
		border-radius: 0;
	}

	/*// 若因调整 toolRight 导致宽度 不为96px 时 需要做调整 调整1 eg:
	:deep(.icon-button.button-column) {
		display: none;
	}*/
}

/*:deep(.local_search-group-wrap) {
	// 若因调整 toolRight 导致宽度 不为96px 时 需要做调整 调整2 eg:
	.tags-wrap {
		margin-right: 48px;
	}
	.le-search-group-tags .tags-action {
		right: -48px;
	}
}*/
</style>
