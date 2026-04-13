  <template>
    <div class="customer-app">
      <Navbar />
      <div class="container">
        <!-- Hero Section -->
        <div class="hero-section">
          <div class="hero-content">
            <div class="title-wrapper">
              <div class="icon-badge">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" fill="none"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" fill="none"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" stroke-width="2" fill="none"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
              </div>
              <div>
                <h1>Quản Lý Khách Hàng</h1>
                <p class="subtitle">Quản lý và theo dõi thông tin khách hàng</p>
              </div>
            </div>
            <button @click="showForm = true" class="btn-add">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Thêm khách hàng
            </button>
          </div>
        </div>
        
        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon total">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="stat-info">
              <h3>{{ customers.length }}</h3>
              <p>Tổng khách hàng</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon active">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="stat-info">
              <h3>{{ customers.filter(c => c.status === 'Active').length }}</h3>
              <p>Đang hoạt động</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon inactive">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="stat-info">
              <h3>{{ customers.filter(c => c.status === 'InActive').length }}</h3>
              <p>Không hoạt động</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon ban">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="16" r="1" fill="currentColor"/>
              </svg>
            </div>
            <div class="stat-info">
              <h3>{{ customers.filter(c => c.status === 'Ban').length }}</h3>
              <p>Bị cấm</p>
            </div>
          </div>
        </div>
        
        <!-- Filters Section -->
        <div class="filters-section">
          <div class="filters-wrapper">
            <div class="search-box">
              <svg class="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                <path d="M21 21L17 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <input 
                type="text" 
                v-model="searchTerm" 
                placeholder="Tìm kiếm khách hàng..."
                @input="filterCustomers"
              />
            </div>
            <div class="filter-group">
              <label>Trạng thái:</label>
              <div class="status-filters">
                <button 
                  v-for="status in statusOptions" 
                  :key="status.value"
                  :class="['status-filter-btn', { active: statusFilter === status.value }]"
                  @click="statusFilter = status.value; loadCustomers()"
                >
                  {{ status.label }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Table Container -->
        <div class="table-wrapper">
          <div class="table-header">
            <div class="table-title">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span>Danh sách khách hàng</span>
            </div>
            <div class="table-info">
              Hiển thị {{ filteredCustomers.length }} / {{ customers.length }} khách hàng
            </div>
          </div>
          
          <div class="table-container">
            <table class="modern-table">
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Số điện thoại</th>
                  <th>Nguồn</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="customer in filteredCustomers" :key="customer.id" class="table-row">
                  <td>
                    <div class="customer-info">
                      <div class="avatar" :style="{ background: getAvatarColor(customer.name) }">
                        {{ customer.name.charAt(0).toUpperCase() }}
                      </div>
                      <div class="customer-details">
                        <span class="customer-name">{{ customer.name }}</span>
                        <span class="customer-email">{{ customer.email || 'Chưa có email' }}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="phone-cell">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="2" fill="none"/>
                      </svg>
                      {{ customer.phone }}
                    </div>
                  </td>
                  <td>
                    <span class="source-badge" :class="'source-' + customer.source?.toLowerCase()">
                      {{ customer.source || 'Khác' }}
                    </span>
                  </td>
                  <td>
                    <span :class="['status-badge', getStatusClass(customer.status)]">
                      <span class="status-dot"></span>
                      {{ getStatusText(customer.status) }}
                    </span>
                  </td>
                  <td>
                    <div class="date-cell">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                        <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/>
                        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/>
                        <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
                      </svg>
                      {{ formatDate(customer.createdAt) }}
                    </div>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button @click="editCustomer(customer)" class="action-btn edit-btn" title="Sửa">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17 3L21 7L7 21H3V17L17 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                      </button>
                      <button @click="deleteCustomer(customer.id)" class="action-btn delete-btn" title="Xóa">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 7H20M10 11V16M14 11V16M5 7L6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19L19 7M9 7V4C9 3.4 9.4 3 10 3H14C14.6 3 15 3.4 15 4V7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredCustomers.length === 0">
                  <td colspan="6" class="empty-state">
                    <div class="empty-content">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
                        <circle cx="12" cy="16" r="1" fill="currentColor"/>
                      </svg>
                      <p>Không có dữ liệu khách hàng</p>
                      <button @click="showForm = true" class="empty-add-btn">Thêm khách hàng đầu tiên</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <CustomerForm 
        v-if="showForm" 
        :customer="editingCustomer"
        @close="closeForm"
        @save="loadCustomers"
      />
    </div>
  </template>

<script setup>
  import { ref, onMounted, computed } from 'vue';
  import api from '@/api/axios';
  import Navbar from './Navbar.vue';
  import CustomerForm from './CustomerForm.vue';
  import { useToast } from 'vue-toastification';

const toast = useToast();

const customers = ref([]); // Giữ nguyên
const statusFilter = ref('');
const searchTerm = ref('');
const showForm = ref(false);
const editingCustomer = ref(null);

const statusOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'Active', label: 'Hoạt động' },
  { value: 'InActive', label: 'Không hoạt động' },
  { value: 'Ban', label: 'Bị cấm' }
];

const filteredCustomers = computed(() => {
  // ĐẢM BẢO customers.value là array
  if (!Array.isArray(customers.value)) {
    return [];
  }
  
  let filtered = customers.value;
  if (searchTerm.value) {
    filtered = filtered.filter(c => 
      c.name?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      c.phone?.includes(searchTerm.value)
    );
  }
  return filtered;
});

const loadCustomers = async () => {
  try {
    const params = statusFilter.value ? { status: statusFilter.value } : {};
    const response = await api.get('/customers', { params });
    
    // KIỂM TRA response.data có phải array không
    console.log('API Response:', response.data);
    
    if (Array.isArray(response.data)) {
      customers.value = response.data;
    } else if (response.data && typeof response.data === 'object') {
      // Nếu response là object, kiểm tra xem có property nào chứa array không
      if (Array.isArray(response.data.items)) {
        customers.value = response.data.items;
      } else if (Array.isArray(response.data.data)) {
        customers.value = response.data.data;
      } else {
        // Nếu không phải array, gán array rỗng
        console.warn('Unexpected response format:', response.data);
        customers.value = [];
      }
    } else {
      customers.value = [];
    }
  } catch (error) {
    console.error('Error loading customers:', error);
    toast.error('Không thể tải danh sách khách hàng');
    customers.value = []; // Đảm bảo customers luôn là array
  }
};

const filterCustomers = () => {
  // Computed property handles filtering
};

const editCustomer = (customer) => {
  editingCustomer.value = customer;
  showForm.value = true;
};

const deleteCustomer = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
    try {
      await api.delete(`/customers/${id}`);
      await loadCustomers();
      toast.success('Xóa khách hàng thành công!');
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Không thể xóa khách hàng');
    }
  }
};

const closeForm = () => {
  showForm.value = false;
  editingCustomer.value = null;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hôm nay';
  if (diffDays === 1) return 'Hôm qua';
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return date.toLocaleDateString('vi-VN');
};

const getStatusClass = (status) => {
  const classes = {
    'Active': 'active',
    'InActive': 'inactive',
    'Ban': 'ban'
  };
  return classes[status] || 'active';
};

const getStatusText = (status) => {
  const texts = {
    'Active': 'Đang hoạt động',
    'InActive': 'Không hoạt động',
    'Ban': 'Bị cấm'
  };
  return texts[status] || status || 'Không xác định';
};

const getAvatarColor = (name) => {
  if (!name) return 'linear-gradient(135deg, #667eea, #764ba2)';
  const colors = [
    'linear-gradient(135deg, #667eea, #764ba2)',
    'linear-gradient(135deg, #f093fb, #f5576c)',
    'linear-gradient(135deg, #4facfe, #00f2fe)',
    'linear-gradient(135deg, #43e97b, #38f9d7)',
    'linear-gradient(135deg, #fa709a, #fee140)'
  ];
  const index = name.length % colors.length;
  return colors[index];
};

onMounted(() => {
  loadCustomers();
});
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.customer-app {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hero Section */
.hero-section {
  margin-bottom: 40px;
}

.hero-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 20px;
}

.icon-badge {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.icon-badge svg {
  width: 30px;
  height: 30px;
  color: white;
}

.hero-content h1 {
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  font-size: 14px;
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #48bb78, #38a169);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-add svg {
  width: 20px;
  height: 20px;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(72, 187, 120, 0.3);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.total {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.stat-icon.active {
  background: linear-gradient(135deg, #48bb78, #38a169);
}

.stat-icon.inactive {
  background: linear-gradient(135deg, #f56565, #e53e3e);
}

.stat-icon.ban {
  background: linear-gradient(135deg, #ed8936, #dd6b20);
}

.stat-icon svg {
  width: 25px;
  height: 25px;
  color: white;
}

.stat-info h3 {
  font-size: 28px;
  font-weight: 700;
  color: #333;
}

.stat-info p {
  color: #666;
  font-size: 14px;
}

/* Filters Section */
.filters-section {
  margin-bottom: 30px;
}

.filters-wrapper {
  background: white;
  padding: 20px;
  border-radius: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 300px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #999;
}

.search-box input {
  width: 100%;
  padding: 10px 12px 10px 38px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s;
}

.search-box input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 15px;
}

.filter-group label {
  font-weight: 600;
  color: #555;
}

.status-filters {
  display: flex;
  gap: 10px;
}

.status-filter-btn {
  padding: 6px 16px;
  background: #f5f5f5;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.status-filter-btn:hover {
  background: #e0e0e0;
}

.status-filter-btn.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

/* Table Wrapper */
.table-wrapper {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.table-header {
  padding: 20px 25px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #333;
}

.table-title svg {
  width: 20px;
  height: 20px;
  color: #667eea;
}

.table-info {
  font-size: 14px;
  color: #666;
}

.table-container {
  overflow-x: auto;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
}

.modern-table thead {
  background: #f8f9fa;
}

.modern-table th {
  padding: 15px 20px;
  text-align: left;
  font-weight: 600;
  color: #555;
  font-size: 14px;
  border-bottom: 2px solid #e0e0e0;
}

.table-row {
  transition: all 0.3s;
  border-bottom: 1px solid #f0f0f0;
}

.table-row:hover {
  background: #f8f9fa;
  transform: scale(1.01);
}

.modern-table td {
  padding: 15px 20px;
  vertical-align: middle;
}

/* Customer Info */
.customer-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 16px;
}

.customer-details {
  display: flex;
  flex-direction: column;
}

.customer-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.customer-email {
  font-size: 12px;
  color: #999;
}

/* Phone Cell */
.phone-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #555;
}

.phone-cell svg {
  width: 16px;
  height: 16px;
  color: #999;
}

/* Source Badge */
.source-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.source-facebook {
  background: #e7f3ff;
  color: #1877f2;
}

.source-zalo {
  background: #e8f5e9;
  color: #0066ff;
}

.source-website {
  background: #f3e5f5;
  color: #9c27b0;
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-badge.active {
  background: #e6f7e6;
  color: #2e7d32;
}

.status-badge.active .status-dot {
  background: #4caf50;
}

.status-badge.inactive {
  background: #ffebee;
  color: #c62828;
}

.status-badge.inactive .status-dot {
  background: #f44336;
}

.status-badge.ban {
  background: #fff3e0;
  color: #e65100;
}

.status-badge.ban .status-dot {
  background: #ff9800;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Date Cell */
.date-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 13px;
}

.date-cell svg {
  width: 14px;
  height: 14px;
  color: #999;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.edit-btn {
  background: #e3f2fd;
  color: #1976d2;
}

.edit-btn:hover {
  background: #1976d2;
  color: white;
  transform: translateY(-2px);
}

.delete-btn {
  background: #ffebee;
  color: #d32f2f;
}

.delete-btn:hover {
  background: #d32f2f;
  color: white;
  transform: translateY(-2px);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px !important;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.empty-content svg {
  width: 80px;
  height: 80px;
  color: #ccc;
}

.empty-content p {
  color: #999;
  font-size: 16px;
}

.empty-add-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.empty-add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 15px;
  }
  
  .hero-content {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .title-wrapper {
    flex-direction: column;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .filters-wrapper {
    flex-direction: column;
  }
  
  .search-box {
    max-width: 100%;
  }
  
  .filter-group {
    flex-direction: column;
    width: 100%;
  }
  
  .status-filters {
    width: 100%;
    justify-content: center;
  }
  
  .modern-table th, 
  .modern-table td {
    padding: 10px;
    font-size: 12px;
  }
  
  .customer-info {
    min-width: 150px;
  }
}
</style>