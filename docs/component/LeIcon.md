---
title: LeIcon SvgIcon
lang: zh-CN
---

# LeIcon SvgIcon

LeIcon 选择组件是 基于  
1. [vite-plugin-svg-icons](https://github.com/anncwb/vite-plugin-svg-icons) 插件 `icon-[dir]-[name]` 定义 src/assets/icons 的 svg 文件  
2. iconfont 载入的 svg `le-xxx`

当选项过多时，使用下拉菜单展示并选择内容。


## 基础用法

:::demo

LeIcon/basic

:::

## LeIcon API

## LeIcon 属性

| Name                                | Description                             | Type    | 可选值                                                                                          | Default       |
|-------------------------------------|-----------------------------------------|---------| -------------------------------------------------------------------------------------------------------- |---------------|
| icon                          | svg定义名称 (`icon-[name]`  or `le-[name]`) | string       | —                                                                                              | —          |
| color                               | fill颜色 (一般情况 建议使用class 样式继承)            | string | —                                                                                                        | —         |
