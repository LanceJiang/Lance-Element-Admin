import path from 'path'

export function isDev(mode: string): boolean {
	return mode === 'development'
}

export function isProd(mode: string): boolean {
	return mode === 'production'
}

export function isTest(mode: string): boolean {
	return mode === 'test'
}

/**
 * Whether to generate package preview
 */
export function isReportMode(): boolean {
	return process.env.VITE_REPORT === 'true'
}

// 读取环境变量配置文件到process.env
export function wrapperEnv(envConf: Recordable): ViteEnv {
	const ret: any = {}

	for (const envName of Object.keys(envConf)) {
		let realName = envConf[envName].replace(/\\n/g, '\n')
		realName = realName === 'true' ? true : realName === 'false' ? false : realName
		if (envName === 'VITE_PORT') realName = Number(realName)
		ret[envName] = realName
	}
	return ret
}

/**
 * 获取根目录
 * @param dir 文件路径
 */
export function getRootPath(...dir: string[]) {
	return path.resolve(process.cwd(), ...dir)
}
