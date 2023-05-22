/**
 * 配置和注册全局指令 directives
 */
import { App, Directive } from 'vue'
import { hasPerm, hasRole } from './permission'

const directives = {
	hasPerm,
	hasRole
}

export function setupGlobDirectives(app: App) {
	Object.keys(directives).forEach(key => {
		app.directive(key, (directives as { [key: string]: Directive })[key])
	})
}
