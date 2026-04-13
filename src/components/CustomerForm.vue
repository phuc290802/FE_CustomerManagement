<template>
  <div class="modal" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ isEditMode ? 'Sửa Khách Hàng' : 'Thêm Khách Hàng Mới' }}</h3>
        <button @click="close" class="close-btn">&times;</button>
      </div>
      
      <form @submit.prevent="saveCustomer">
        <div class="form-group">
          <label>Tên khách hàng <span class="required">*</span></label>
          <input 
            type="text" 
            v-model="formData.name" 
            required
            :class="{ 'error': errors.name }"
            placeholder="Nhập tên khách hàng"
            @blur="validateField('name')"
          />
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>
        
        <div class="form-group">
          <label>Số điện thoại <span class="required">*</span></label>
          <input 
            type="tel" 
            v-model="formData.phone" 
            required
            :class="{ 'error': errors.phone }"
            placeholder="Nhập số điện thoại"
            @blur="validateField('phone')"
          />
          <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
        </div>
        
        <div class="form-group">
          <label>Nguồn <span class="required">*</span></label>
          <select v-model="formData.source" required :class="{ 'error': errors.source }">
            <option value="">Chọn nguồn</option>
            <option value="Facebook">Facebook</option>
            <option value="Google">Google</option>
            <option value="Website">Website</option>
            <option value="Giới thiệu">Giới thiệu</option>
            <option value="Zalo">Zalo</option>
            <option value="TikTok">TikTok</option>
            <option value="Khác">Khác</option>
          </select>
          <span v-if="errors.source" class="error-message">{{ errors.source }}</span>
        </div>
        
        <div class="form-group">
          <label>Trạng thái</label>
          <select v-model="formData.status">
            <option value="Active">Active</option>
            <option value="InActive">InActive</option>
            <option value="Ban">Bị Ban</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Ghi chú (tùy chọn)</label>
          <textarea 
            v-model="formData.note" 
            rows="3"
            placeholder="Nhập ghi chú về khách hàng..."
          ></textarea>
        </div>
        
        <div class="modal-footer">
          <button type="button" @click="close" class="btn-cancel">Hủy</button>
          <button type="submit" :disabled="saving || !isFormValid" class="btn-save">
            <span v-if="saving" class="spinner"></span>
            {{ saving ? 'Đang xử lý...' : (isEditMode ? 'Cập nhật' : 'Thêm mới') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import api from '@/api/axios';
import { useToast } from 'vue-toastification';

const props = defineProps({
  customer: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'save']);

// Form data
const toast = useToast();
const formData = reactive({
  name: '',
  phone: '',
  source: '',
  status: 'Active',
  note: ''
});

// Validation errors
const errors = reactive({
  name: '',
  phone: '',
  source: ''
});

const saving = ref(false);
const isEditMode = computed(() => !!props.customer);

// Validate từng field
const validateField = (field) => {
  switch(field) {
    case 'name':
      if (!formData.name.trim()) {
        errors.name = 'Tên khách hàng không được để trống';
      } else if (formData.name.length < 2) {
        errors.name = 'Tên phải có ít nhất 2 ký tự';
      } else if (formData.name.length > 100) {
        errors.name = 'Tên không được vượt quá 100 ký tự';
      } else {
        errors.name = '';
      }
      break;
      
    case 'phone':
      const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
      if (!formData.phone.trim()) {
        errors.phone = 'Số điện thoại không được để trống';
      } else if (!phoneRegex.test(formData.phone)) {
        errors.phone = 'Số điện thoại không hợp lệ';
      } else {
        errors.phone = '';
      }
      break;
      
    case 'source':
      if (!formData.source) {
        errors.source = 'Vui lòng chọn nguồn khách hàng';
      } else {
        errors.source = '';
      }
      break;
  }
};

// Validate toàn bộ form
const isFormValid = computed(() => {
  return formData.name.trim() && 
         formData.phone.trim() && 
         formData.source &&
         !errors.name && 
         !errors.phone && 
         !errors.source;
});

// Reset form
const resetForm = () => {
  formData.name = '';
  formData.phone = '';
  formData.source = '';
  formData.status = 'Active';
  formData.note = '';
  
  errors.name = '';
  errors.phone = '';
  errors.source = '';
};

// Load data khi sửa
watch(() => props.customer, (newVal) => {
  if (newVal) {
    formData.name = newVal.name || '';
    formData.phone = newVal.phone || '';
    formData.source = newVal.source || '';
    formData.status = newVal.status || 'Active';
    formData.note = newVal.note || '';
  } else {
    resetForm();
  }
}, { immediate: true });

// Save customer
const saveCustomer = async () => {
  saving.value = true;
  
  try {
    if (isEditMode.value) {
      const response = await api.put(`/customers/${props.customer.id}`, {
        name: formData.name,
        phone: formData.phone,
        source: formData.source,
        status: formData.status,
        note: formData.note
      });
      
      if (response.status === 200) {
        toast.success('Cập nhật khách hàng thành công!');
        emit('save');
        close();
      }
    } else {
      const response = await api.post('/customers', {
        name: formData.name,
        phone: formData.phone,
        source: formData.source,
        status: formData.status,
        note: formData.note
      });
      
      if (response.status === 201) {
        toast.success('Thêm khách hàng mới thành công!');
        emit('save');
        close();
      }
    }
  } catch (err) {
    console.error('Error saving customer:', err);
    
    if (err.response) {
      if (err.response.status === 400) {
        error('Dữ liệu không hợp lệ, vui lòng kiểm tra lại', 'Lỗi');
      } else if (err.response.status === 409) {
        error('Số điện thoại đã tồn tại trong hệ thống', 'Lỗi');
      } else {
        error(err.response.data?.message || 'Có lỗi xảy ra, vui lòng thử lại', 'Lỗi');
      }
    } else {
      error('Không thể kết nối đến server, vui lòng thử lại', 'Lỗi');
    }
  } finally {
    saving.value = false;
  }
};

const close = () => {
  emit('close');
};
</script>

<style scoped>
/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 550px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 2px solid #f0f0f0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px 12px 0 0;
}

.modal-header h3 {
  margin: 0;
  color: white;
  font-size: 1.3rem;
  font-weight: 600;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

form {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.required {
  color: #e53e3e;
  margin-left: 4px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input.error,
.form-group select.error {
  border-color: #e53e3e;
}

.error-message {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #e53e3e;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.btn-cancel,
.btn-save {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-cancel {
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
}

.btn-cancel:hover {
  background: #edf2f7;
  transform: translateY(-1px);
}

.btn-save {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Spinner animation */
.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Scrollbar styling */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Responsive */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    max-height: 95vh;
  }
  
  .modal-header {
    padding: 16px 20px;
  }
  
  form {
    padding: 20px;
  }
  
  .btn-cancel,
  .btn-save {
    padding: 8px 20px;
  }
}

</style>