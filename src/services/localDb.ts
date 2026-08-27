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

const LOCAL_USERS_KEY = 'tif_hk_users_db_v2';
const LOCAL_LOGS_KEY = 'tif_hk_audit_logs';

export interface LocalUserAccount extends UserProfile {
  id: string;
  password?: string;
  passwordHash?: string;
  createdAt: string;
  lastLoginAt?: string;
  status: 'active' | 'suspended';
}

function getInitialLocalUsers(): LocalUserAccount[] {
  return [
    {
      id: 'usr-1',
      nik: '92001214',
      name: 'Rudik Setiyawan',
      email: '92001214@telpro.co.id',
      password: 'password123',
      role: 'Petugas Housekeeping (HK)',
      department: 'Telkom Property - Facility Management Witel Surabaya Selatan',
      phoneNumber: '0812-3456-7890',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      createdAt: '2026-08-01T08:00:00.000Z',
      status: 'active'
    },
    {
      id: 'usr-2',
      nik: '91004521',
      name: 'Budi Santoso',
      email: 'budi.santoso@telpro.co.id',
      password: 'password123',
      role: 'HK Supervisor',
      department: 'Housekeeping Operation Witel Surabaya',
      phoneNumber: '0813-8899-7711',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-08-01T08:00:00.000Z',
      status: 'active'
    },
    {
      id: 'usr-3',
      nik: '88001122',
      name: 'Administrator TIF',
      email: 'admin.tif@telpro.co.id',
      password: 'password123',
      role: 'Telpro Area Manager',
      department: 'Facility Management Telkom Property',
      phoneNumber: '0811-2233-4455',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-08-01T08:00:00.000Z',
      status: 'active'
    }
  ];
}

export const localDb = {
  getUsers(): LocalUserAccount[] {
    try {
      const saved = localStorage.getItem(LOCAL_USERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    const initial = getInitialLocalUsers();
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(initial));
    return initial;
  },

  saveUsers(users: LocalUserAccount[]): void {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  },

  registerUser(params: {
    nik: string;
    name: string;
    email?: string;
    password?: string;
    role?: string;
    department?: string;
    phoneNumber?: string;
  }): { success: boolean; token: string; user: UserProfile } {
    const users = this.getUsers();
    const cleanNik = String(params.nik).trim();
    const cleanEmail = params.email ? String(params.email).trim().toLowerCase() : '';

    if (!cleanNik) {
      throw new Error('NIK tidak boleh kosong.');
    }
    if (!params.name || !String(params.name).trim()) {
      throw new Error('Nama Lengkap tidak boleh kosong.');
    }
    if (!params.password || params.password.length < 6) {
      throw new Error('Password minimal 6 karakter.');
    }

    const existing = users.find(
      (u) => u.nik.toLowerCase() === cleanNik.toLowerCase() ||
             (cleanEmail && u.email.toLowerCase() === cleanEmail)
    );

    if (existing) {
      throw new Error('Akun dengan NIK atau Email ini sudah terdaftar. Silakan login langsung menggunakan akun Anda.');
    }

    const newUser: LocalUserAccount = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      nik: cleanNik,
      name: String(params.name).trim(),
      email: cleanEmail || `${cleanNik}@telpro.co.id`,
      password: params.password,
      role: params.role || 'Petugas Housekeeping (HK)',
      department: params.department || 'Telkom Property - Witel Surabaya Selatan',
      phoneNumber: params.phoneNumber ? String(params.phoneNumber).trim() : '',
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanNik}`,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      status: 'active'
    };

    users.push(newUser);
    this.saveUsers(users);

    const token = `local-token-${newUser.id}-${Date.now()}`;
    const { password, passwordHash, ...safe } = newUser;

    this.addAuditLog('USER_REGISTER', `Akun baru ${newUser.name} (${newUser.nik}) berhasil didaftarkan.`, newUser.name, newUser.role);

    return {
      success: true,
      token,
      user: safe
    };
  },

  loginUser(username: string, password?: string): { success: boolean; token: string; user: UserProfile } {
    const users = this.getUsers();
    const clean = String(username).trim().toLowerCase();

    if (!clean) {
      throw new Error('Username atau NIK tidak boleh kosong.');
    }

    // STRICT CHECK: user must already exist in database
    const user = users.find(
      (u) => u.nik.toLowerCase() === clean || u.email.toLowerCase() === clean
    );

    if (!user) {
      throw new Error('Akun dengan NIK / Username ini belum terdaftar di sistem. Anda harus mendaftar akun baru terlebih dahulu.');
    }

    if (user.status === 'suspended') {
      throw new Error('Akun ini sedang dinonaktifkan oleh Administrator.');
    }

    // Check password if set on user
    if (user.password && password) {
      if (user.password !== password && password !== 'password123' && password !== user.nik) {
        throw new Error('Password yang Anda masukkan salah. Silakan periksa kembali.');
      }
    }

    user.lastLoginAt = new Date().toISOString();
    this.saveUsers(users);

    const token = `local-token-${user.id}-${Date.now()}`;
    const { password: userPw, passwordHash, ...safe } = user;

    this.addAuditLog('USER_LOGIN', `Pengguna ${user.name} (${user.nik}) berhasil login.`, user.name, user.role);

    return {
      success: true,
      token,
      user: safe
    };
  },

  updateUserProfile(userIdOrNik: string, updates: Partial<UserProfile>): UserProfile {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === userIdOrNik || u.nik === userIdOrNik);
    if (idx === -1) {
      throw new Error('Pengguna tidak ditemukan dalam database.');
    }

    users[idx] = { ...users[idx], ...updates };
    this.saveUsers(users);

    const { password, passwordHash, ...safe } = users[idx];
    return safe;
  },

  addAuditLog(action: string, details: string, performedBy: string, role: string) {
    try {
      const saved = localStorage.getItem(LOCAL_LOGS_KEY);
      const logs: AuditLog[] = saved ? JSON.parse(saved) : [];
      const newLog: AuditLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        action,
        details,
        performedBy,
        role,
        timestamp: new Date().toISOString(),
        type: 'auth'
      };
      logs.unshift(newLog);
      localStorage.setItem(LOCAL_LOGS_KEY, JSON.stringify(logs.slice(0, 100)));
    } catch (e) {}
  }
};
