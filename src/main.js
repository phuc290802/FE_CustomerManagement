import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

// 👇 QUAN TRỌNG
app.use(Toast, {
  timeout: 3000,
  position: 'top-right'
});

app.mount('#app');