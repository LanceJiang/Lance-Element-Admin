# 配置说明

## 关于环境配置

对于系统的使用者来说，一般首先修改配置文件，进行定制化修改以符合自己业务/学习使用。环境配置推荐查看 Vite 官网的 [Env Variables and Modes](https://vitejs.dev/guide/env-and-mode.html) 说明，对于理解很有帮助。

:::tip
只有以 VITE_ 开头的变量会被嵌入到客户端侧的包中， 访问方法：
```
console.log(import.meta.env.VITE_PROT);
```
:::

### 通用配置 .env

该配置文件位于 `项目` 路径下，`.env` 无论在什么环境下都会被加载，因此公共的配置可以放在这里面。

```bash .env
# 网站标题
VITE_APP_TITLE = Lance-Element-Admin
```

### 开发环境配置 .env.development

项目以开发环境启动的时候加载该配置文件，该配置文件位于 `项目` 路径下。

```
# 资源公共路径,需要以 /开头和结尾
VITE_PUBLIC_PATH=/
# 是否删除Console.log
VITE_DROP_CONSOLE=false
```

### 生产环境配置 .env.production

项目以生产环境启动的时候加载该配置文件，该配置文件位于 `项目` 路径下。

```

# 接口地址 可以由nginx做转发或者直接写实际地址
VITE_APP_BASE_API=/api

# 资源公共路径,需要以 / 开头和结尾
VITE_PUBLIC_PATH=/

# 是否删除Console.log
VITE_DROP_CONSOLE=true

```
