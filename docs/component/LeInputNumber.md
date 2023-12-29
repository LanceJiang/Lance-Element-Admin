---
title: LeInputNumber 数字输入框
lang: zh-CN
---

# LeInputNumber 数字输入框

仅允许输入标准的数字值，可定义范围 基于el-input-number 扩展 支持 前后缀插槽

## 基础用法

:::demo 要使用它，只需要在 `<LeInputNumber>` 元素中使用 `v-model` 绑定变量即可，变量的初始值即为默认值。

LeInputNumber/basic

:::


## API ( lance-element 新增和调整的属性/插槽 做以下声明 其他参考element-plus 的 input-number)

## 属性

| 属性名               | 说明          | 类型                                       | 默认值                          |
|-------------------|-------------|------------------------------------------|------------------------------|
| prefix-icon       | 前缀 (前缀插槽 #prefix) | string                        | -                      |
| suffix-icon        | 后缀 (后缀插槽 #suffix)   | string                        | -                      |
| controls-position | 控制按钮位置	     | ^[enum]`'' \| 'right'`                   | right (`le-input-number 调整`) |

## 事件

| 事件名	   | 说明	                     | 类型                                                                                    |
| ------ | ------------------------------- | --------------------------------------------------------------------------------------- |


## LeInputNumber 插槽

| 插槽名		    | 详情     |
| ------- |--------|
| prefix | 自定义 前缀 |
| suffix   | 自定义 后缀 |
