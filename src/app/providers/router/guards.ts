import type { Router } from 'vue-router'
import { useSessionStore } from '@/entities/session'

export function setupGuards(router: Router): void {
  router.beforeEach((to) => {
    const session = useSessionStore()

    if (to.meta.requiresAuth && !session.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    if (to.name === 'login' && session.isAuthenticated) {
      return { name: 'users' }
    }
  })
}
