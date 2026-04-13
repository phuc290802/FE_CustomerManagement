import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/components/Login.vue';
import CustomerList from '@/components/CustomerList.vue';
import { useAuthStore } from '@/stores/auth';

const routes = [
  { path: '/login', component: Login, meta: { requiresAuth: false } },
  { path: '/', component: CustomerList, meta: { requiresAuth: true } },
  { path: '/customers', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;