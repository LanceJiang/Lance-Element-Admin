import {
	Method,
	AxiosRequestTransformer,
	AxiosResponseTransformer,
	AxiosRequestHeaders,
	AxiosAdapter,
	AxiosBasicCredentials,
	ResponseType,
	AxiosProxyConfig,
	TransitionalOptions,
	responseEncoding,
	CancelToken,
	Axios,
	AxiosPromise,
	AxiosResponseHeaders
} from 'axios'

// todo config
export interface ExtraConfig {
	// 是否返回所有接口数据
	responseAll?: boolean
	// 全屏单例loading 是否展示
	showFullscreenLoading?: boolean
	// todo...
}

export interface AxiosRequestConfig<D = any> {
	// 额外 配置Start
	extraConfig?: ExtraConfig
	// 额外 配置End
	url?: string
	method?: Method | string
	baseURL?: string
	transformRequest?: AxiosRequestTransformer | AxiosRequestTransformer[]
	transformResponse?: AxiosResponseTransformer | AxiosResponseTransformer[]
	headers?: AxiosRequestHeaders
	params?: any
	paramsSerializer?: (params: any) => string
	data?: D
	timeout?: number
	timeoutErrorMessage?: string
	withCredentials?: boolean
	adapter?: AxiosAdapter
	auth?: AxiosBasicCredentials
	responseType?: ResponseType
	responseEncoding?: responseEncoding | string
	xsrfCookieName?: string
	xsrfHeaderName?: string
	onUploadProgress?: (progressEvent: any) => void
	onDownloadProgress?: (progressEvent: any) => void
	maxContentLength?: number
	validateStatus?: ((status: number) => boolean) | null
	maxBodyLength?: number
	maxRedirects?: number
	beforeRedirect?: (options: Record<string, any>, responseDetails: { headers: Record<string, string> }) => void
	socketPath?: string | null
	httpAgent?: any
	httpsAgent?: any
	proxy?: AxiosProxyConfig | false
	cancelToken?: CancelToken
	decompress?: boolean
	transitional?: TransitionalOptions
	signal?: AbortSignal
	insecureHTTPParser?: boolean
	env?: {
		FormData?: new (...args: any[]) => object
	}
}
export interface AxiosResponse<T = any, D = any> {
	data: T
	status: number
	statusText: string
	headers: AxiosResponseHeaders
	config: AxiosRequestConfig<D>
	request?: any
}
export interface AxiosInstance extends Axios {
	(config: AxiosRequestConfig): AxiosPromise
	(url: string, config?: AxiosRequestConfig): AxiosPromise
}
