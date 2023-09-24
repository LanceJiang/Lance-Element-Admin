import { AppState } from '@/types'
// import { ls } from '@/utils'
import { defineStore } from 'pinia'
import { getLanguage } from '@/lang'

const useAppStore = defineStore({
	id: 'app',
	state: (): AppState => ({
		device: 'desktop',
		// sidebar: {
		// 	opened: true,
		// 	withoutAnimation: false
		// },
		language: getLanguage(),
		size: 'default'
		// size: 'small'
	}),
	actions: {
		// toggleSidebar() {
		// 	this.sidebar.opened = !this.sidebar.opened
		// 	this.sidebar.withoutAnimation = false
		// 	// if (this.sidebar.opened) {
		// 	// 	ls.set('sidebarStatus', 1)
		// 	// } else {
		// 	// 	ls.set('sidebarStatus', 0)
		// 	// }
		// },
		// closeSideBar(withoutAnimation: any) {
		// 	// ls.set('sidebarStatus', 0)
		// 	this.sidebar.opened = false
		// 	this.sidebar.withoutAnimation = withoutAnimation
		// },
		toggleDevice(device: string) {
			this.device = device
		},
		setSize(size: string) {
			this.size = size
			// ls.set('size', size)
		},
		setLanguage(language: string) {
			this.language = language
			// ls.set('language', language)
		}
	},
	persist: true
	// persist: {
	// 	paths: ['language', 'sidebar.opened']
	// }
})

export default useAppStore
