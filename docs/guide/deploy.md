# 构建 & 部署

:::tip 前置环境
- [Git](https://git-scm.com)
- [NodeJs 16.x +](https://nodejs.org/en)
:::

## 环境准备

### 安装

如果已经安装了 NodeJs，那么大概率 npm 包管理器也会随之安装。

```bash
# npm 设置淘宝镜像源（若有必要）
npm config set registry https://registry.npmmirror.com
# 全局安装 pnpm
npm i
```


## 部署

```bash
# clone 仓库
git clone https://github.com/LanceJiang/Lance-Element-Admin.git
# 安装依赖
pnpm i
# 以开发模式启动项目
pnpm dev
// pnpm start
// pnpm serve
```
