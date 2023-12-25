# 项目结构

```
|-- docs
|   |-- vitepress 相关
|-- public                      # 公共资源

|-- src
|   |-- api                     # 请求api配置
|   |-- assets                  # 静态资源
|   |-- components              # 全局公用组件
|   |   |-- registerGlobComp    # 全局组件注册
|   |-- directive               # 指令集
|   |-- hooks                   # 公用hooks
|   |-- lang                    # 多语言
|   |-- layout                  # 框架布局
|   |-- router                  # 路由定义
|   |-- store                   # 状态管理
|   |-- styles                  # 样式
|   |-- sys_cellSlots           # 系统jsx渲染公用配置集
|   |-- types                   # 类型定义
|   |-- utils                   # 工具函数集
|   |   |--request              # 请求封装
|   |-- pages                   # 页面存储
|   |-- App.vue                 # 根元素渲染
|   |-- main.ts                 # 主入口
|   |-- permission.ts           # 路由权限
|   |-- setting                 # 项目配置

|-- .editorconfig               # .editorconfig
|-- .env                        # 环境配置
|-- .env.development            # 开发环境配置
|-- .env.production             # 生产环境配置
|-- .env.staging                # 预发布环境
|-- .env.test                   # 测试环境
|-- vite.config.ts              # vite配置

```
