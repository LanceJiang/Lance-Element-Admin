# 路由
路由配置存放于 src/router 下面。   

## 路由模块


```ts
const Layout = () => import('@/layout/index.vue')

const demo: RouteRecordItem = {
	// demo演示
	path: '/demo',
	component: 'Layout',
	redirect: '/demo/adminManage',
	meta: { title: 'demo', icon: 'icon-peoples' },
  children: [
    {
			// path: '/demo/pageConfig',
			path: 'pageConfig',
			// component: () => import('@/views/demo/pageConfig/index'),
			component: 'demo/pageConfig/index', // 相对于 views/下的 相对路径
			name: 'pageConfig',
			meta: { title: 'demo_pageConfig', icon: 'le-fangda1' }
    }
  ],
}

export default demo

```

## meta定义
```ts
export interface MetaProps {
	// 标题
	title?: string
	// 图标
	/**
	 * 关于icon 描述：
	 * 	// 1.来自本地src/assets/icons 的svg: 'icon-[dir]-[name]'
	 * 	// 2.le-iconfont svg 链接: 'le-[name]'
	 * 	// 3. 匹配不到icon- & le- 默认element
	 */
	icon?: string
	// 隐藏菜单
	hidden?: boolean
	// 是否固定
	affix?: boolean
	// 不缓存路由
	noCache?: boolean
	// 当前路由配置添加到 哪个父级: router.addRoute([parentName], route)
	parentName?: string

}
```
