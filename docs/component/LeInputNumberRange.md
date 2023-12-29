---
title: LeInputNumberRange 数字区间
lang: zh-CN
---

# LeInputNumberRange 数字区间

基于`LeInputNumber` 扩展的 数字区间 组件

## 基础用法

:::demo

LeInputNumberRange/basic

:::


## API ( LeInputNumberRange 基于LeInputNumber扩展 其他参数参考element-plus 的 input-number)

## 属性

| 属性名                   | 说明                                                                                | 类型             | 默认值      |
|-----------------------|-----------------------------------------------------------------------------------|----------------|----------|
| model-value / v-model | 数字区间项绑定值	                                                                         | object / array | -        |
| is-value-array        | modelValue / v-model 绑定的数据为数组类型                                                   | boolean        | false    |
| prop                  | 区间值prop(公用前缀)没有设置`prop-start` 为 `${prop}Start`  没有设置 `prop-end` 为 `${prop}End`    | string         | ''       |
| prop-start            | 区间(开始值)start-prop 设置了之后 且 `is-value-array` 不为 true，开始值为 modelValue.`${prop-start}` | string         | -        |
| prop-end              | 区间(结束值)end-prop  设置了之后 且 `is-value-array` 不为 true，开始值为 modelValue.`${prop-end}`   | string         | -        |
| placeholder-start     | 最小值placeholder	                                                                   | string         | '最小值'多语言 |
| placeholder-end       | 最大值placeholder	                                                                   | string         | '最大值'多语言 |
| item-style            | 针对start/end `LeInputNumber` 做自定义样式	                                               | string         | ''       |
| precision             | 数值精度	                                                                             | number         | 0        |
| prepend               | 前置描述	                                                                             | string         | -        |
| append                | 后置描述	                                                                             | string         | -        |

## 事件

| 事件名	   | 说明	                  | 类型                                                                               |
| ------ | ---------------------------- |----------------------------------------------------------------------------------|
| change | 绑定值被改变时触发	| ^[Function]`(currentValue: number \| undefined, prop: number \| string) => void` |
| blur   | 在组件 Input 失去焦点时触发	| ^[Function]`(event: FocusEvent, prop: number \| string) => void`                                         |
| focus  | 使 input 组件获得焦点	| ^[Function]`(event: FocusEvent, prop: number \| string) => void`                                         |

## LeInputNumberRange 插槽

| 插槽名		    | 详情                              |
| ------- |---------------------------------|
| prefix | 自定义 前缀(子 LeInputNumber)都有       |
| suffix   | 自定义 后缀(子 LeInputNumber)都有    |
| prepend   | 自定义 前置 (LeInputNumberRange 壳前置) |
| append   | 自定义 后置 (LeInputNumberRange 壳后置) |
