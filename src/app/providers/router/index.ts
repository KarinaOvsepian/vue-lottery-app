import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/entities/session/model/auth.ts';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/home/HomeView.vue'),
      meta: { layout: 'DefaultLayout', title: 'Home' }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/pages/about/AboutView.vue'),
      meta: { layout: 'DefaultLayout', title: 'About Author' }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/login/LoginView.vue'),
      meta: { layout: 'AuthLayout', title: 'Login' }
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/pages/users/UsersView.vue'),
      meta: { layout: 'DefaultLayout', requiresAuth: true, title: 'Users List' }
    },
    {
      path: '/users/add',
      name: 'user-add',
      component: () => import('@/pages/user-create/UserCreateView.vue'),
      meta: { layout: 'DefaultLayout', requiresAuth: true, title: 'Create User' }
    },
    {
      path: '/users/:id',
      name: 'user-detail',
      component: () => import('@/pages/user-detail/UserDetailView.vue'),
      props: true,
      meta: { layout: 'DefaultLayout', requiresAuth: true, title: 'User Details' }
    },
    {
      path: '/users/:id/edit',
      name: 'user-edit',
      component: () => import('@/pages/user-edit/UserEditView.vue'),
      props: true,
      meta: { layout: 'DefaultLayout', requiresAuth: true, title: 'Edit User' }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/not-found/NotFoundView.vue'),
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
