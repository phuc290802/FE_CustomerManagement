<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-brand">
        <h2>CRM System</h2>
      </div>
      <div class="nav-user">
        <span>Xin chào, {{ username }}</span>
        <button @click="logout" class="logout-btn">Đăng xuất</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const username = authStore.username;

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.navbar {
  background: #2d3748;
  color: white;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.nav-brand h2 {
  margin: 0;
  font-size: 20px;
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logout-btn {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 5px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.logout-btn:hover {
  background: #c53030;
}
</style>