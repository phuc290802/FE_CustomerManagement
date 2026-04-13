<template>
  <Transition name="toast">
    <div v-if="visible" :class="['toast', type]" @click="close">
      <div class="toast-icon">
        <span v-if="type === 'success'">✓</span>
        <span v-else-if="type === 'error'">✗</span>
        <span v-else-if="type === 'warning'">⚠</span>
        <span v-else>ℹ</span>
      </div>
      <div class="toast-content">
        <div class="toast-title">{{ title }}</div>
        <div class="toast-message">{{ message }}</div>
      </div>
      <button class="toast-close">&times;</button>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'success' // success, error, warning, info
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 3000
  }
});

const visible = ref(true);
let timer = null;

const close = () => {
  visible.value = false;
  setTimeout(() => {
    // Emit event để parent xóa component
    const event = new CustomEvent('close-toast');
    window.dispatchEvent(event);
  }, 300);
};

onMounted(() => {
  timer = setTimeout(() => {
    close();
  }, props.duration);
});

onUnmounted(() => {
  if (timer) clearTimeout(timer);
});
</script>

<style scoped>
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  min-width: 300px;
  max-width: 400px;
  background: white;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  cursor: pointer;
  animation: slideIn 0.3s ease;
}

.toast.success {
  border-left: 4px solid #48bb78;
}

.toast.error {
  border-left: 4px solid #f56565;
}

.toast.warning {
  border-left: 4px solid #ed8936;
}

.toast.info {
  border-left: 4px solid #4299e1;
}

.toast-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.toast.success .toast-icon {
  background: #48bb78;
  color: white;
}

.toast.error .toast-icon {
  background: #f56565;
  color: white;
}

.toast.warning .toast-icon {
  background: #ed8936;
  color: white;
}

.toast.info .toast-icon {
  background: #4299e1;
  color: white;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-weight: 600;
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.toast-message {
  font-size: 13px;
  color: #666;
}

.toast-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-close:hover {
  color: #333;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@media (max-width: 768px) {
  .toast {
    left: 20px;
    right: 20px;
    min-width: auto;
  }
}
</style>