// import type { Ref } from 'vue'
import type { LeTableProps, LeTableActions } from '../index.d'
import { provide, inject, ComputedRef } from 'vue'

const key = Symbol('le-table')

type Instance = LeTableActions

type RetInstance = Instance /*Omit<Instance, 'getProps'> & {
	getProps: ComputedRef<LeTableProps>
}*/

export function createTableContext(instance: Instance) {
	provide(key, instance)
}

export function useTableContext(): RetInstance {
	return inject(key) as RetInstance
}
