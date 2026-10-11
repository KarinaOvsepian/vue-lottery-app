import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { layout: 'DefaultLayout', title: 'Home' }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
      meta: { layout: 'DefaultLayout', title: 'About Author' }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { layout: 'AuthLayout', title: 'Login' }
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/views/UsersView.vue'),
      meta: { layout: 'DefaultLayout', requiresAuth: true, title: 'Users List' }
    },
    {
      path: '/users/:id',
      name: 'user-detail',
      component: () => import('@/views/UserDetailView.vue'),
      props: true,
      meta: { layout: 'DefaultLayout', requiresAuth: true, title: 'User Details' }
    },
    {
      path: '/users/:id/edit',
      name: 'user-edit',
      component: () => import('@/views/UserEditView.vue'),
      props: true,
      meta: { layout: 'DefaultLayout', requiresAuth: true, title: 'Edit User' }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { layout: 'DefaultLayout', title: '404 - Not Found' }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else if (to.name === 'login' && isAuthenticated) {
    next({ name: 'users' });
  } else {
    next();
  }
});

router.afterEach((to) => {
  const baseTitle = 'Vue Lottery App';
  document.title = to.meta.title ? `${to.meta.title} | ${baseTitle}` : baseTitle;
});

export default router;
