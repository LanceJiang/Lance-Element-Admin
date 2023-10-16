import { defineStore } from 'pinia'
import { TagsViewState } from '@/types'

const useTagsViewStore = defineStore({
	id: 'tagsView',
	state: (): TagsViewState => ({
		visitedViews: [],
		cachedViews: []
	}),
	actions: {
		addVisitedView(view: any) {
			const idx = this.visitedViews.findIndex(v => v.path === view.path)
			if (idx !== -1) {
				return this.visitedViews.splice(
					idx,
					1,
					Object.assign({}, view, {
						title: view.meta?.title || 'no-name'
					})
				)
			}
			this.visitedViews.push(
				Object.assign({}, view, {
					title: view.meta?.title || 'no-name'
				})
			)
		},
		addCachedView(view: any) {
			if (this.cachedViews.includes(view.name)) return
			if (!view.meta.noCache) {
				this.cachedViews.push(view.name)
			}
		},

		delVisitedView(view: any) {
			return new Promise(resolve => {
				for (const [i, v] of this.visitedViews.entries()) {
					if (v.path === view.path) {
						this.visitedViews.splice(i, 1)
						break
					}
				}
				resolve([...this.visitedViews])
			})
		},
		delCachedView(view: any) {
			return new Promise(resolve => {
				const index = this.cachedViews.indexOf(view.name)
				index > -1 && this.cachedViews.splice(index, 1)
				resolve([...this.cachedViews])
			})
		},

		delOtherVisitedViews(view: any) {
			return new Promise(resolve => {
				this.visitedViews = this.visitedViews.filter(v => {
					return v.meta?.affix || v.path === view.path
				})
				resolve([...this.visitedViews])
			})
		},
		delOtherCachedViews(view: any) {
			return new Promise(resolve => {
				const index = this.cachedViews.indexOf(view.name)
				if (index > -1) {
					this.cachedViews = this.cachedViews.slice(index, index + 1)
				} else {
					// if index = -1, there is no cached tags
					this.cachedViews = []
				}
				resolve([...this.cachedViews])
			})
		},

		updateVisitedView(view: any) {
			for (let v of this.visitedViews) {
				if (v.path === view.path) {
					v = Object.assign(v, view)
					break
				}
			}
		},
		setViews(tabsList: any[]) {
			this.visitedViews = tabsList
			/*this.cachedViews = tabsList
				.filter(v => {
					return !v.meta.noCache
				})
				.map(v => v.name)*/
		},
		addView(view: any) {
			this.addVisitedView(view)
			this.addCachedView(view)
		},
		delView(view: any) {
			return new Promise(resolve => {
				this.delVisitedView(view)
				this.delCachedView(view)
				resolve({
					visitedViews: [...this.visitedViews],
					cachedViews: [...this.cachedViews]
				})
			})
		},
		delOtherViews(view: any) {
			return new Promise(resolve => {
				this.delOtherVisitedViews(view)
				this.delOtherCachedViews(view)
				resolve({
					visitedViews: [...this.visitedViews],
					cachedViews: [...this.cachedViews]
				})
			})
		},
		closeSideTags(view: any, side: 'left' | 'right' = 'left') {
			return new Promise(resolve => {
				const currIndex = this.visitedViews.findIndex(v => v.path === view.path)
				if (currIndex === -1) {
					return
				}
				const [leftI, rightI] = side === 'left' ? [0, currIndex] : [currIndex + 1, this.visitedViews.length]
				this.visitedViews = this.visitedViews.filter((item, index) => {
					// affix:true 固定tag，例如“首页”
					if (index < leftI || index >= rightI || (item.meta && item.meta.affix)) {
						return true
					}

					const cacheIndex = this.cachedViews.indexOf(item.name as string)
					if (cacheIndex > -1) {
						this.cachedViews.splice(cacheIndex, 1)
					}
					return false
				})
				resolve({
					visitedViews: [...this.visitedViews]
				})
			})
		},
		delLeftViews(view: any) {
			return new Promise(resolve => {
				const currIndex = this.visitedViews.findIndex(v => v.path === view.path)
				if (currIndex === -1) {
					return
				}
				this.visitedViews = this.visitedViews.filter((item, index) => {
					// affix:true 固定tag，例如“首页”
					if (index >= currIndex || (item.meta && item.meta.affix)) {
						return true
					}

					const cacheIndex = this.cachedViews.indexOf(item.name as string)
					if (cacheIndex > -1) {
						this.cachedViews.splice(cacheIndex, 1)
					}
					return false
				})
				resolve({
					visitedViews: [...this.visitedViews]
				})
			})
		},
		delRightViews(view: any) {
			return new Promise(resolve => {
				const currIndex = this.visitedViews.findIndex(v => v.path === view.path)
				if (currIndex === -1) {
					return
				}
				this.visitedViews = this.visitedViews.filter((item, index) => {
					// affix:true 固定tag，例如“首页”
					if (index <= currIndex || (item.meta && item.meta.affix)) {
						return true
					}

					const cacheIndex = this.cachedViews.indexOf(item.name as string)
					if (cacheIndex > -1) {
						this.cachedViews.splice(cacheIndex, 1)
					}
					return false
				})
				resolve({
					visitedViews: [...this.visitedViews]
				})
			})
		},
		delAllViews() {
			return new Promise(resolve => {
				const affixTags = this.visitedViews.filter(tag => tag.meta?.affix)
				this.visitedViews = affixTags
				this.cachedViews = []
				resolve({
					visitedViews: [...this.visitedViews],
					cachedViews: [...this.cachedViews]
				})
			})
		},
		delAllVisitedViews() {
			return new Promise(resolve => {
				const affixTags = this.visitedViews.filter(tag => tag.meta?.affix)
				this.visitedViews = affixTags
				resolve([...this.visitedViews])
			})
		},
		delAllCachedViews() {
			return new Promise(resolve => {
				this.cachedViews = []
				resolve([...this.cachedViews])
			})
		}
	}
})

export default useTagsViewStore
