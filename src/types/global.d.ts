import { AppRouteRecordRaw, MetaProps } from '@/router/types'

/* RouteMenu */
export declare namespace RouteMenu {
	export interface Item extends AppRouteRecordRaw {
		component?: string | (() => Promise<unknown>)
		// [key: string]: any
	}
	export interface Meta extends MetaProps {
		test?: any
		local_title?: string
		[key: string]: any
	}
}

/* FileType */
declare namespace File {
	type ImageMimeType =
		| 'image/apng'
		| 'image/bmp'
		| 'image/gif'
		| 'image/jpeg'
		| 'image/pjpeg'
		| 'image/png'
		| 'image/svg+xml'
		| 'image/tiff'
		| 'image/webp'
		| 'image/x-icon'

	type ExcelMimeType = 'application/vnd.ms-excel' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
}

/* Generic Tools */
type ObjToKeyValUnion<T> = {
	[K in keyof T]: { key: K; value: T[K] }
}[keyof T]

type ObjToKeyValArray<T> = {
	[K in keyof T]: [K, T[K]]
}[keyof T]

// declare module 'vue' {
// 	export type JSXComponent<Props = any> =
// 		| { new (): ComponentPublicInstance<Props> }
// 		| FunctionalComponent<Props>;
// }
declare module '*.vue' {
	import { DefineComponent } from 'vue'

	const Component: DefineComponent<object, object, any>
	export default Component
}

declare module 'virtual:*' {
	const result: any
	export default result
}

interface Window {
	// requestIdleCallback?: Function;
	[key: string]: any
}

declare global {
	/* __APP_INFO__ */
	const __APP_INFO__: {
		pkg: {
			name: string
			version: string
			dependencies: Recordable<string>
			devDependencies: Recordable<string>
		}
		lastBuildTime: string
	}

	/* Vite */
	declare type Recordable<T = any> = Record<string, T>

	interface ImportMetaEnv extends ViteEnv {
		__: unknown
	}

	declare interface ViteEnv {
		VITE_USER_NODE_ENV: 'development' | 'production' | 'test'
		VITE_APP_TITLE: string
		VITE_PORT: number
		VITE_OPEN: boolean
		VITE_REPORT: boolean
		VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'gzip,brotli' | 'none'
		VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean
		VITE_DROP_CONSOLE: boolean
		VITE_PUBLIC_PATH: string
		VITE_API_URL: string
		VITE_PROXY: [string, string][]
	}
}
