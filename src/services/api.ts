import { 
  UserProfile, 
  UserAccount, 
  Building, 
  HKItemDefinition, 
  HKSubmission, 
  HKOrder, 
  AppNotification, 
  AuditLog 
} from '../types';

const TOKEN_KEY = 'tif_hk_jwt_token';

export const authStorage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  }
};

function getHeaders(includeAuth = true): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (includeAuth) {
    const token = authStorage.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}

export const api = {
  // Authentication
  async login(username: string, password?: string): Promise<{ success: boolean; token: string; user: UserProfile; error?: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login gagal');
      }
      if (data.token) {
        authStorage.setToken(data.token);
      }
      return data;
    } catch (err: any) {
      console.warn('API login request failed, falling back to local verification:', err);
      throw err;
    }
  },

  async register(params: {
    nik: string;
    name: string;
    email?: string;
    password: string;
    role?: string;
    department?: string;
    phoneNumber?: string;
  }): Promise<{ success: boolean; token: string; user: UserProfile }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(params)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registrasi akun gagal');
    }
    if (data.token) {
      authStorage.setToken(data.token);
    }
    return data;
  },

  logout(): void {
    authStorage.removeToken();
    localStorage.removeItem('tif_auth_token');
    localStorage.removeItem('tif_hk_logged_in');
  },

  async getMe(): Promise<{ user: UserProfile }> {
    const res = await fetch('/api/auth/me', {
      headers: getHeaders(true)
    });
    if (!res.ok) {
      throw new Error('Sesi tidak valid');
    }
    return res.json();
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<{ success: boolean; user: UserProfile }> {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal update profil');
    }
    return data;
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ oldPassword, newPassword })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal mengubah password');
    }
    return data;
  },

  async getAllUsers(): Promise<UserAccount[]> {
    const res = await fetch('/api/auth/users', {
      headers: getHeaders(true)
    });
    const data = await res.json();
    return data.users || [];
  },

  async deleteUser(userId: string): Promise<boolean> {
    const res = await fetch(`/api/auth/users/${userId}`, {
      method: 'DELETE',
      headers: getHeaders(true)
    });
    return res.ok;
  },

  // Submissions (Checklist)
  async getSubmissions(params?: { buildingId?: string; dateOnly?: string; frequency?: string }): Promise<HKSubmission[]> {
    try {
      const query = new URLSearchParams();
      if (params?.buildingId) query.set('buildingId', params.buildingId);
      if (params?.dateOnly) query.set('dateOnly', params.dateOnly);
      if (params?.frequency) query.set('frequency', params.frequency);

      const res = await fetch(`/api/submissions?${query.toString()}`, {
        headers: getHeaders(false)
      });
      const data = await res.json();
      return data.submissions || [];
    } catch (err) {
      console.warn('Could not fetch submissions from server:', err);
      return [];
    }
  },

  async createSubmission(sub: Omit<HKSubmission, 'id' | 'timestamp' | 'dateOnly'> & { id?: string; timestamp?: string; dateOnly?: string }): Promise<HKSubmission> {
    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(sub)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal menyimpan checklist');
    }
    return data.submission;
  },

  async deleteSubmission(idOrBuildingId: string, itemId?: string, dateOnly?: string): Promise<boolean> {
    if (itemId) {
      const query = new URLSearchParams({ buildingId: idOrBuildingId, itemId });
      if (dateOnly) query.set('dateOnly', dateOnly);
      const res = await fetch(`/api/submissions/by-item?${query.toString()}`, {
        method: 'DELETE',
        headers: getHeaders(true)
      });
      return res.ok;
    }

    const res = await fetch(`/api/submissions/${idOrBuildingId}`, {
      method: 'DELETE',
      headers: getHeaders(true)
    });
    return res.ok;
  },

  // Buildings & Items
  async getBuildings(): Promise<Building[]> {
    try {
      const res = await fetch('/api/buildings');
      const data = await res.json();
      return data.buildings || [];
    } catch (err) {
      return [];
    }
  },

  async getItems(): Promise<HKItemDefinition[]> {
    try {
      const res = await fetch('/api/items');
      const data = await res.json();
      return data.items || [];
    } catch (err) {
      return [];
    }
  },

  // Orders
  async getOrders(): Promise<HKOrder[]> {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      return data.orders || [];
    } catch (err) {
      return [];
    }
  },

  async createOrder(order: Partial<HKOrder>): Promise<HKOrder> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(order)
    });
    const data = await res.json();
    return data.order;
  },

  async updateOrderStatus(id: string, updates: Partial<HKOrder>): Promise<HKOrder> {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    return data.order;
  },

  // Notifications
  async getNotifications(): Promise<AppNotification[]> {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      return data.notifications || [];
    } catch (err) {
      return [];
    }
  },

  async markNotificationRead(id: string): Promise<boolean> {
    const res = await fetch(`/api/notifications/${id}/read`, {
      method: 'PUT',
      headers: getHeaders(true)
    });
    return res.ok;
  },

  async markAllNotificationsRead(): Promise<boolean> {
    const res = await fetch('/api/notifications/read-all', {
      method: 'POST',
      headers: getHeaders(true)
    });
    return res.ok;
  },

  async clearAllNotifications(): Promise<boolean> {
    const res = await fetch('/api/notifications/clear-all', {
      method: 'DELETE',
      headers: getHeaders(true)
    });
    return res.ok;
  },

  // Audit Logs
  async getAuditLogs(): Promise<AuditLog[]> {
    try {
      const res = await fetch('/api/audit-logs', {
        headers: getHeaders(true)
      });
      const data = await res.json();
      return data.logs || [];
    } catch (err) {
      return [];
    }
  },

  // Database Factory Reset
  async resetDatabase(): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/db/reset', {
      method: 'POST',
      headers: getHeaders(true)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal reset database');
    }
    return data;
  }
};
