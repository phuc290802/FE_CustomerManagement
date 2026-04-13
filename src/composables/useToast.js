import { ref } from 'vue';

const toasts = ref([]);

export const useToast = () => {
  const showToast = ({ type = 'success', title = '', message = '', duration = 3000 }) => {
    const id = Date.now();
    const toast = {
      id,
      type,
      title,
      message,
      duration
    };
    
    toasts.value.push(toast);
    
    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
    
    return id;
  };
  
  const removeToast = (id) => {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  };
  
  const success = (message, title = 'Thành công') => {
    showToast({ type: 'success', title, message });
  };
  
  const error = (message, title = 'Lỗi') => {
    showToast({ type: 'error', title, message });
  };
  
  const warning = (message, title = 'Cảnh báo') => {
    showToast({ type: 'warning', title, message });
  };
  
  const info = (message, title = 'Thông báo') => {
    showToast({ type: 'info', title, message });
  };
  
  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info
  };
};