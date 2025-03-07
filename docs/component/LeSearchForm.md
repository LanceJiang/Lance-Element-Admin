---
title: LeSearchForm 搜索表单
lang: zh-CN
---

# LeSearchForm 搜索表单

基于 element-plus & le-element-admin内部组件 创建的 LeSearchForm 配置型 搜索表单

## 基础用法

:::demo

LeSearchForm/basic

:::

## 综合示例

:::demo

LeSearchForm/comprehensive

:::


## API

## 属性

| 属性名            | 说明                            | 类型                                                                     | 默认值   |
|----------------|-------------------------------|------------------------------------------------------------------------|-------|
| width          | 搜索表单宽度                        | string                                                                 | 100%  |
| height         | 搜索表单高度                        | string                                                                 | 400px |
| option         | 图表配置对象                        | ^[object]`参考echarts配置: https://echarts.apache.org/zh/cheat-sheet.html` | -     |
| is-init-option | 是否初始化图表	                      | boolean                                                                | false |
| show-chart     | 是否展示数据图表(false: 将展示无数据)	      | boolean                                                                | true  |
| label_topLeft  | `左上角`描述 (对应插槽 #top_left)	     | string                                                                 | -     |
| label_topRight | `右上角`描述 (对应插槽 #top_right)	    | string                                                                 | -     |
| label_bottomLeft  | `左下角`描述 (对应插槽 #bottom_left)	  | string                                                                 | -     |
| label_bottomRight  | `右下角`描述 (对应插槽 #bottom_right)	 | string                                                                 | -     |

## 事件

| 事件名	   | 说明	        | 类型                                                                                      |
| ------ |------------|-----------------------------------------------------------------------------------------|
| legendselectchanged | 选中案例更改触发   | Event: (params) => any                                                                  |
| click | 选中的图表item项 | Event: (params) => any |


## LeSearchForm 插槽

| 插槽名		     | 详情                      |
|-----------|-------------------------|
| default   | 图表下方默认插槽内容                  |
| overlay   | 覆盖图表插槽 {noData:boolean} |
| top_left  | `左上角`描述                 |
| top_right | `右上角`描述                 |
| bottom_left  | `左下角`描述                 |
| bottom_right | `右下角`描述                 |

## LeSearchForm Exposes

| 名称	   | 说明	     | 类型         |
| ------ |---------|------------|
| chartRef  | 图表实例	   | shallowRef |
| updateResize  | 更新图表尺寸	 | Function   |
| updateOption  | 更新图表配置	 | Function |
