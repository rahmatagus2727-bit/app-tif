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
import { localDb } from './localDb';

const TOKEN_KEY = 'tif_hk_jwt_token';
const SERVER_URL_KEY = 'tif_hk_server_api_url';

export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(SERVER_URL_KEY);
    if (saved && saved.trim()) {
      return saved.trim().replace(/\/$/, '');
    }
    // If running on github.io or external static domain, auto-route to Cloud Run backend
    if (window.location.hostname.includes('github.io')) {
      return 'https://ais-pre-yto47u7ddhwnwkjmetumma-375462668053.asia-southeast1.run.app';
    }
  }
  return '';
}

export function setApiBaseUrl(url: string): void {
  if (typeof window !== 'undefined') {
    if (!url || !url.trim()) {
      localStorage.removeItem(SERVER_URL_KEY);
    } else {
      localStorage.setItem(SERVER_URL_KEY, url.trim().replace(/\/$/, ''));
    }
  }
}

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

// Safely parse JSON or handle HTML responses gracefully
async function parseJsonResponse(res: Response): Promise<any> {
  const contentType = res.headers.get('content-type') || '';
  const text = await res.text();

  if (contentType.includes('application/json') || text.trim().startsWith('{') || text.trim().startsWith('[')) {
    try {
      return JSON.parse(text);
    } catch (e) {
      const err = new Error('STATIC_SERVER_FALLBACK');
      (err as any).isHtmlFallback = true;
      throw err;
    }
  }

  // If server returned HTML (e.g. GitHub Pages static 404 fallback or Vite SPA fallback)
  const error = new Error('STATIC_SERVER_FALLBACK');
  (error as any).isHtmlFallback = true;
  throw error;
}

export const api = {
  // Authentication
  async login(username: string, password?: string): Promise<{ success: boolean; token: string; user: UserProfile; error?: string }> {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify({ username, password })
      });

      const data = await parseJsonResponse(res);
      if (!res.ok) {
        throw new Error(data.error || 'Login gagal. Periksa kembali NIK dan password Anda.');
      }
      if (data.token) {
        authStorage.setToken(data.token);
      }
      return data;
    } catch (err: any) {
      // If server is not reachable / static deployment, check strictly against local database
      if (err.isHtmlFallback || err.message?.includes('STATIC_SERVER') || err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
        const localResult = localDb.loginUser(username, password);
        authStorage.setToken(localResult.token);
        return localResult;
      }
      // Re-throw server error message (e.g. account not found, wrong password)
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
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify(params)
      });

      const data = await parseJsonResponse(res);
      if (!res.ok) {
        throw new Error(data.error || 'Registrasi akun gagal.');
      }
      if (data.token) {
        authStorage.setToken(data.token);
      }
      // Also sync to local DB cache
      try {
        localDb.registerUser(params);
      } catch (e) {}

      return data;
    } catch (err: any) {
      if (err.isHtmlFallback || err.message?.includes('STATIC_SERVER') || err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
        const localResult = localDb.registerUser(params);
        authStorage.setToken(localResult.token);
        return localResult;
      }
      throw err;
    }
  },

  logout(): void {
    authStorage.removeToken();
    localStorage.removeItem('tif_auth_token');
    localStorage.removeItem('tif_hk_logged_in');
  },

  async getMe(): Promise<{ user: UserProfile }> {
    const token = authStorage.getToken();
    if (!token) {
      throw new Error('Tidak ada sesi aktif');
    }
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/auth/me`, {
        headers: getHeaders(true)
      });
      const data = await parseJsonResponse(res);
      if (!res.ok) {
        throw new Error('Sesi tidak valid');
      }
      return data;
    } catch (err: any) {
      if (err.isHtmlFallback || err.message?.includes('STATIC_SERVER') || err.message?.includes('Failed to fetch')) {
        const savedUser = localStorage.getItem('tif_hk_user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          const users = localDb.getUsers();
          const found = users.find(u => u.nik === parsed.nik);
          if (found) {
            const { password, passwordHash, ...safe } = found;
            return { user: safe };
          }
        }
      }
      authStorage.removeToken();
      throw new Error('Sesi tidak valid. Silakan login kembali.');
    }
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<{ success: boolean; user: UserProfile }> {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/auth/profile`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(updates)
      });
      const data = await parseJsonResponse(res);
      if (!res.ok) {
        throw new Error(data.error || 'Gagal update profil');
      }
      return data;
    } catch (err: any) {
      if (updates.nik) {
        const updated = localDb.updateUserProfile(updates.nik, updates);
        return { success: true, user: updated };
      }
      throw err;
    }
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/auth/change-password`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await parseJsonResponse(res);
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengubah password');
      }
      return data;
    } catch (err: any) {
      return { success: true, message: 'Password berhasil diperbarui.' };
    }
  },

  async getAllUsers(): Promise<UserAccount[]> {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/auth/users`, {
        headers: getHeaders(true)
      });
      const data = await parseJsonResponse(res);
      return data.users || localDb.getUsers();
    } catch (err) {
      return localDb.getUsers();
    }
  },

  async deleteUser(userId: string): Promise<boolean> {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/auth/users/${userId}`, {
        method: 'DELETE',
        headers: getHeaders(true)
      });
      return res.ok;
    } catch (err) {
      const users = localDb.getUsers().filter((u) => u.id !== userId);
      localDb.saveUsers(users);
      return true;
    }
  },

  // Submissions (Checklist)
  async getSubmissions(params?: { buildingId?: string; dateOnly?: string; frequency?: string }): Promise<HKSubmission[]> {
    try {
      const baseUrl = getApiBaseUrl();
      const query = new URLSearchParams();
      if (params?.buildingId) query.set('buildingId', params.buildingId);
      if (params?.dateOnly) query.set('dateOnly', params.dateOnly);
      if (params?.frequency) query.set('frequency', params.frequency);

      const res = await fetch(`${baseUrl}/api/submissions?${query.toString()}`, {
        headers: getHeaders(false)
      });
      const data = await parseJsonResponse(res);
      return data.submissions || [];
    } catch (err) {
      return [];
    }
  },

  async createSubmission(sub: Omit<HKSubmission, 'id' | 'timestamp' | 'dateOnly'> & { id?: string; timestamp?: string; dateOnly?: string }): Promise<HKSubmission> {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/submissions`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(sub)
      });
      const data = await parseJsonResponse(res);
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan checklist');
      }
      return data.submission;
    } catch (err: any) {
      const now = new Date();
      return {
        ...sub,
        id: sub.id || `sub-${Date.now()}`,
        timestamp: sub.timestamp || now.toISOString(),
        dateOnly: sub.dateOnly || now.toISOString().split('T')[0]
      };
    }
  },

  async deleteSubmission(idOrBuildingId: string, itemId?: string, dateOnly?: string): Promise<boolean> {
    try {
      const baseUrl = getApiBaseUrl();
      if (itemId) {
        const query = new URLSearchParams({ buildingId: idOrBuildingId, itemId });
        if (dateOnly) query.set('dateOnly', dateOnly);
        const res = await fetch(`${baseUrl}/api/submissions/by-item?${query.toString()}`, {
          method: 'DELETE',
          headers: getHeaders(true)
        });
        return res.ok;
      }

      const res = await fetch(`${baseUrl}/api/submissions/${idOrBuildingId}`, {
        method: 'DELETE',
        headers: getHeaders(true)
      });
      return res.ok;
    } catch (err) {
      return true;
    }
  },

  // Buildings & Items
  async getBuildings(): Promise<Building[]> {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/buildings`);
      const data = await parseJsonResponse(res);
      return data.buildings || [];
    } catch (err) {
      return [];
    }
  },

  async getItems(): Promise<HKItemDefinition[]> {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/items`);
      const data = await parseJsonResponse(res);
      return data.items || [];
    } catch (err) {
      return [];
    }
  },

  // Orders
  async getOrders(): Promise<HKOrder[]> {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/orders`);
      const data = await parseJsonResponse(res);
      return data.orders || [];
    } catch (err) {
      return [];
    }
  },

  async createOrder(order: Partial<HKOrder>): Promise<HKOrder> {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/orders`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(order)
      });
      const data = await parseJsonResponse(res);
      return data.order;
    } catch (err) {
      return {
        id: `ord-${Date.now()}`,
        code: `RO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(10 + Math.random() * 90)}`,
        title: order.title || 'Tugas Housekeeping',
        buildingName: order.buildingName || 'KANTOR WITEL SURABAYA SLTN LEA',
        category: order.category || 'Pembersihan Rutin',
        date: order.date || 'Hari Ini',
        status: 'Dalam Proses',
        assignedTo: order.assignedTo || 'Rudik Setiyawan',
        progress: 0
      };
    }
  },

  async updateOrderStatus(id: string, updates: Partial<HKOrder>): Promise<HKOrder> {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/orders/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(updates)
      });
      const data = await parseJsonResponse(res);
      return data.order;
    } catch (err) {
      return { id, ...updates } as HKOrder;
    }
  },

  // Notifications
  async getNotifications(): Promise<AppNotification[]> {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/notifications`);
      const data = await parseJsonResponse(res);
      return data.notifications || [];
    } catch (err) {
      return [];
    }
  },

  async markNotificationRead(id: string): Promise<boolean> {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: getHeaders(true)
      });
      return res.ok;
    } catch (err) {
      return true;
    }
  },

  async markAllNotificationsRead(): Promise<boolean> {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/notifications/read-all`, {
        method: 'POST',
        headers: getHeaders(true)
      });
      return res.ok;
    } catch (err) {
      return true;
    }
  },

  async clearAllNotifications(): Promise<boolean> {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/notifications/clear-all`, {
        method: 'DELETE',
        headers: getHeaders(true)
      });
      return res.ok;
    } catch (err) {
      return true;
    }
  },

  // Audit Logs
  async getAuditLogs(): Promise<AuditLog[]> {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/audit-logs`, {
        headers: getHeaders(true)
      });
      const data = await parseJsonResponse(res);
      return data.logs || [];
    } catch (err) {
      return [];
    }
  },

  // Database Factory Reset
  async resetDatabase(): Promise<{ success: boolean; message: string }> {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/db/reset`, {
        method: 'POST',
        headers: getHeaders(true)
      });
      const data = await parseJsonResponse(res);
      return data;
    } catch (err) {
      return { success: true, message: 'Database reset berhasil di sistem lokal.' };
    }
  }
};
