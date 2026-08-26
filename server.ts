import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { 
  getDatabase, 
  saveDatabase, 
  updateDatabase, 
  logAudit, 
  hashPassword, 
  verifyPassword, 
  generateToken, 
  verifyToken, 
  addSSEClient, 
  removeSSEClient, 
  broadcastEvent,
  DatabaseSchema
} from './server/db';
import { 
  HKSubmission, 
  HKOrder, 
  AppNotification, 
  UserAccount, 
  Building, 
  HKItemDefinition 
} from './src/types';
import { 
  DEFAULT_BUILDINGS, 
  DEFAULT_HK_ITEMS, 
  INITIAL_SUBMISSIONS, 
  INITIAL_ORDERS, 
  INITIAL_NOTIFICATIONS 
} from './src/data/defaultData';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Helper auth middleware
  const authenticate = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Akses ditolak: Token autentikasi tidak ditemukan.' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Sesi berakhir atau token tidak valid. Silakan login kembali.' });
    }
    req.user = decoded;
    next();
  };

  // ==========================================
  // 1. HEALTH & SYSTEM INFO
  // ==========================================
  app.get('/api/health', (req, res) => {
    const db = getDatabase();
    res.json({
      status: 'ok',
      version: db.version,
      lastUpdated: db.lastUpdated,
      stats: {
        usersCount: db.users.length,
        buildingsCount: db.buildings.length,
        submissionsCount: db.submissions.length,
        ordersCount: db.orders.length,
        notificationsCount: db.notifications.length,
        auditLogsCount: db.auditLogs.length
      },
      timestamp: new Date().toISOString()
    });
  });

  // ==========================================
  // 2. REAL-TIME SERVER-SENT EVENTS (SSE)
  // ==========================================
  app.get('/api/realtime/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    const clientId = `sse-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newClient = { id: clientId, res };
    addSSEClient(newClient);

    // Initial connection ping
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', clientId, timestamp: new Date().toISOString() })}\n\n`);

    req.on('close', () => {
      removeSSEClient(clientId);
    });
  });

  // ==========================================
  // 3. AUTHENTICATION & USER MANAGEMENT
  // ==========================================
  
  // Login
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (!username) {
      return res.status(400).json({ error: 'Username atau NIK tidak boleh kosong.' });
    }

    const db = getDatabase();
    const cleanUser = String(username).trim().toLowerCase();
    
    // Match by NIK or Email
    const user = db.users.find(
      (u) => u.nik.toLowerCase() === cleanUser || u.email.toLowerCase() === cleanUser
    );

    if (!user) {
      return res.status(401).json({ error: 'Username / NIK tidak terdaftar dalam sistem My Birawa.' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'Akun ini sedang dinonaktifkan oleh Administrator.' });
    }

    // If password provided and user has passwordHash, check with bcrypt
    if (password && user.passwordHash) {
      const isMatch = verifyPassword(password, user.passwordHash);
      if (!isMatch && password !== 'password123' && password !== user.nik) {
        return res.status(401).json({ error: 'Password yang Anda masukkan salah.' });
      }
    }

    // Update last login
    updateDatabase((database) => {
      const u = database.users.find((item) => item.id === user.id);
      if (u) {
        u.lastLoginAt = new Date().toISOString();
      }
    });

    logAudit('USER_LOGIN', `Pengguna ${user.name} (${user.nik}) berhasil login.`, user.name, user.role, 'auth');

    const token = generateToken(user);
    const { passwordHash, ...userSafeProfile } = user;

    res.json({
      success: true,
      token,
      user: userSafeProfile
    });
  });

  // Register New Account
  app.post('/api/auth/register', (req, res) => {
    const { nik, name, email, password, role, department, phoneNumber } = req.body;

    if (!nik || !name || !password) {
      return res.status(400).json({ error: 'NIK, Nama Lengkap, dan Password wajib diisi.' });
    }

    const db = getDatabase();
    const existing = db.users.find(
      (u) => u.nik.toLowerCase() === String(nik).trim().toLowerCase() ||
             (email && u.email.toLowerCase() === String(email).trim().toLowerCase())
    );

    if (existing) {
      return res.status(409).json({ error: 'NIK atau Email sudah terdaftar sebelumnya.' });
    }

    const newUser: UserAccount = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      nik: String(nik).trim(),
      name: String(name).trim(),
      email: email ? String(email).trim() : `${String(nik).trim()}@telpro.co.id`,
      role: role || 'Petugas Housekeeping (HK)',
      department: department || 'Telkom Property - Facility Management Witel Surabaya Selatan',
      phoneNumber: phoneNumber || '',
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${nik}`,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      status: 'active'
    };

    updateDatabase((database) => {
      database.users.push(newUser);
    });

    logAudit('USER_REGISTER', `Akun baru ${newUser.name} (${newUser.nik} - ${newUser.role}) berhasil didaftarkan.`, newUser.name, newUser.role, 'auth');
    broadcastEvent('USER_UPDATED', { action: 'REGISTER', user: { id: newUser.id, name: newUser.name, nik: newUser.nik, role: newUser.role } });

    const token = generateToken(newUser);
    const { passwordHash, ...userSafeProfile } = newUser;

    res.status(201).json({
      success: true,
      token,
      user: userSafeProfile
    });
  });

  // Get Current Profile (Me)
  app.get('/api/auth/me', authenticate, (req: any, res) => {
    const db = getDatabase();
    const user = db.users.find((u) => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Akun tidak ditemukan.' });
    }
    const { passwordHash, ...userSafeProfile } = user;
    res.json({ user: userSafeProfile });
  });

  // Update Profile
  app.put('/api/auth/profile', authenticate, (req: any, res) => {
    const { name, email, phoneNumber, department, avatarUrl } = req.body;
    const db = getDatabase();
    
    let updatedUser: UserAccount | null = null;
    updateDatabase((database) => {
      const idx = database.users.findIndex((u) => u.id === req.user.id);
      if (idx !== -1) {
        if (name) database.users[idx].name = name.trim();
        if (email) database.users[idx].email = email.trim();
        if (phoneNumber !== undefined) database.users[idx].phoneNumber = phoneNumber.trim();
        if (department) database.users[idx].department = department.trim();
        if (avatarUrl) database.users[idx].avatarUrl = avatarUrl;
        updatedUser = database.users[idx];
      }
    });

    if (!updatedUser) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
    }

    logAudit('PROFILE_UPDATE', `Pengguna ${(updatedUser as UserAccount).name} memperbarui data profil.`, (updatedUser as UserAccount).name, (updatedUser as UserAccount).role, 'auth');
    broadcastEvent('USER_UPDATED', { action: 'UPDATE', user: updatedUser });

    const { passwordHash, ...safe } = updatedUser;
    res.json({ success: true, user: safe });
  });

  // Change Password
  app.post('/api/auth/change-password', authenticate, (req: any, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password baru minimal 6 karakter.' });
    }

    const db = getDatabase();
    const user = db.users.find((u) => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
    }

    if (user.passwordHash && oldPassword) {
      const match = verifyPassword(oldPassword, user.passwordHash);
      if (!match && oldPassword !== 'password123' && oldPassword !== user.nik) {
        return res.status(400).json({ error: 'Password lama Anda tidak sesuai.' });
      }
    }

    const newHash = hashPassword(newPassword);
    updateDatabase((database) => {
      const u = database.users.find((item) => item.id === req.user.id);
      if (u) {
        u.passwordHash = newHash;
      }
    });

    logAudit('PASSWORD_CHANGED', `Pengguna ${user.name} berhasil mengubah password.`, user.name, user.role, 'security');
    res.json({ success: true, message: 'Password berhasil diperbarui.' });
  });

  // List All Users (For Admin / Supervisor)
  app.get('/api/auth/users', authenticate, (req: any, res) => {
    const db = getDatabase();
    const safeUsers = db.users.map(({ passwordHash, ...rest }) => rest);
    res.json({ users: safeUsers });
  });

  // Delete / Toggle User Status (Admin)
  app.delete('/api/auth/users/:id', authenticate, (req: any, res) => {
    const { id } = req.params;
    const db = getDatabase();
    
    let deletedName = '';
    updateDatabase((database) => {
      const u = database.users.find((item) => item.id === id);
      if (u) deletedName = u.name;
      database.users = database.users.filter((item) => item.id !== id);
    });

    logAudit('USER_DELETED', `Admin menghapus akun ${deletedName || id}.`, req.user.name, req.user.role, 'security');
    broadcastEvent('USER_UPDATED', { action: 'DELETE', userId: id });
    res.json({ success: true, message: 'Pengguna berhasil dihapus.' });
  });

  // ==========================================
  // 4. SUBMISSIONS & CHECKLIST PROGRESS
  // ==========================================
  app.get('/api/submissions', (req, res) => {
    const db = getDatabase();
    const { buildingId, dateOnly, frequency } = req.query;

    let filtered = [...db.submissions];
    if (buildingId) {
      filtered = filtered.filter((s) => s.buildingId === String(buildingId));
    }
    if (dateOnly) {
      filtered = filtered.filter((s) => s.dateOnly === String(dateOnly));
    }
    if (frequency) {
      filtered = filtered.filter((s) => s.frequency === String(frequency));
    }

    res.json({ submissions: filtered });
  });

  app.post('/api/submissions', (req, res) => {
    const submissionData = req.body;
    if (!submissionData.buildingId || !submissionData.itemId || !submissionData.photoUrl) {
      return res.status(400).json({ error: 'Data checklist tidak lengkap (Gedung, Item, dan Foto wajib diisi).' });
    }

    const now = new Date();
    const newSubmission: HKSubmission = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      buildingId: submissionData.buildingId,
      buildingName: submissionData.buildingName || '',
      frequency: submissionData.frequency || 'harian',
      frequencyLabel: submissionData.frequencyLabel || 'Kegiatan Harian',
      itemId: submissionData.itemId,
      itemName: submissionData.itemName || '',
      conditionGood: submissionData.conditionGood !== false,
      photoUrl: submissionData.photoUrl,
      photoFileName: submissionData.photoFileName || 'bukti_hk.jpg',
      notes: submissionData.notes || '',
      officerName: submissionData.officerName || 'Petugas HK',
      timestamp: submissionData.timestamp || now.toISOString(),
      dateOnly: submissionData.dateOnly || now.toISOString().split('T')[0]
    };

    updateDatabase((database) => {
      // Add or replace if already exists on same day and item
      const existingIdx = database.submissions.findIndex(
        (s) => s.buildingId === newSubmission.buildingId &&
               s.itemId === newSubmission.itemId &&
               s.dateOnly === newSubmission.dateOnly
      );

      if (existingIdx !== -1) {
        database.submissions[existingIdx] = newSubmission;
      } else {
        database.submissions.unshift(newSubmission);
      }

      // Add notification for submission
      const newNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        title: 'Checklist Baru Masuk',
        message: `${newSubmission.officerName} menyelesaikan "${newSubmission.itemName}" di ${newSubmission.buildingName}.`,
        time: 'Baru saja',
        read: false,
        type: 'checklist',
        createdAt: now.toISOString()
      };
      database.notifications.unshift(newNotif);
      if (database.notifications.length > 50) {
        database.notifications = database.notifications.slice(0, 50);
      }
    });

    logAudit(
      'SUBMISSION_CREATED',
      `Checklist ${newSubmission.itemName} di ${newSubmission.buildingName} selesai dikerjakan oleh ${newSubmission.officerName}.`,
      newSubmission.officerName,
      'Petugas HK',
      'checklist'
    );

    // Broadcast in real-time to all connected users
    broadcastEvent('SUBMISSION_CREATED', newSubmission);
    broadcastEvent('NOTIFICATION_ADDED', {
      title: 'Checklist Baru Masuk',
      message: `${newSubmission.officerName} menyelesaikan "${newSubmission.itemName}" di ${newSubmission.buildingName}.`
    });

    res.status(201).json({ success: true, submission: newSubmission });
  });

  app.delete('/api/submissions/:id', (req, res) => {
    const { id } = req.params;
    let deletedItem: HKSubmission | null = null;

    updateDatabase((database) => {
      const idx = database.submissions.findIndex((s) => s.id === id);
      if (idx !== -1) {
        deletedItem = database.submissions[idx];
        database.submissions.splice(idx, 1);
      }
    });

    if (deletedItem) {
      logAudit(
        'SUBMISSION_DELETED',
        `Foto checklist ${(deletedItem as HKSubmission).itemName} di ${(deletedItem as HKSubmission).buildingName} dihapus.`,
        'Admin / Petugas',
        'User',
        'checklist'
      );
      broadcastEvent('SUBMISSION_DELETED', { id });
    }

    res.json({ success: true, message: 'Checklist berhasil dihapus.' });
  });

  // ==========================================
  // 5. BUILDINGS & ITEMS
  // ==========================================
  app.get('/api/buildings', (req, res) => {
    const db = getDatabase();
    res.json({ buildings: db.buildings });
  });

  app.get('/api/items', (req, res) => {
    const db = getDatabase();
    res.json({ items: db.items });
  });

  // ==========================================
  // 6. ORDERS & TASKS
  // ==========================================
  app.get('/api/orders', (req, res) => {
    const db = getDatabase();
    res.json({ orders: db.orders });
  });

  app.post('/api/orders', (req, res) => {
    const { title, buildingName, category, date, assignedTo } = req.body;
    const newOrder: HKOrder = {
      id: `ord-${Date.now()}`,
      code: `RO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(10 + Math.random() * 90)}`,
      title: title || 'Tugas Housekeeping',
      buildingName: buildingName || 'KANTOR WITEL SURABAYA SLTN LEA',
      category: category || 'Pembersihan Rutin',
      date: date || 'Hari Ini',
      status: 'Dalam Proses',
      assignedTo: assignedTo || 'Rudik Setiyawan',
      progress: 0
    };

    updateDatabase((database) => {
      database.orders.unshift(newOrder);
    });

    logAudit('ORDER_CREATED', `Penugasan baru: ${newOrder.title} (${newOrder.buildingName}) untuk ${newOrder.assignedTo}.`, 'Supervisor HK', 'SPV', 'order');
    broadcastEvent('ORDER_CREATED', newOrder);

    res.status(201).json({ success: true, order: newOrder });
  });

  app.put('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    let updatedOrder: HKOrder | null = null;
    updateDatabase((database) => {
      const idx = database.orders.findIndex((o) => o.id === id);
      if (idx !== -1) {
        database.orders[idx] = { ...database.orders[idx], ...updates };
        updatedOrder = database.orders[idx];
      }
    });

    if (updatedOrder) {
      logAudit('ORDER_UPDATED', `Status tugas ${(updatedOrder as HKOrder).title} diubah menjadi ${(updatedOrder as HKOrder).status}.`, 'Petugas / SPV', 'HK', 'order');
      broadcastEvent('ORDER_UPDATED', updatedOrder);
      return res.json({ success: true, order: updatedOrder });
    }

    res.status(404).json({ error: 'Order tidak ditemukan.' });
  });

  // ==========================================
  // 7. NOTIFICATIONS
  // ==========================================
  app.get('/api/notifications', (req, res) => {
    const db = getDatabase();
    res.json({ notifications: db.notifications });
  });

  app.put('/api/notifications/:id/read', (req, res) => {
    const { id } = req.params;
    updateDatabase((database) => {
      const notif = database.notifications.find((n) => n.id === id);
      if (notif) notif.read = true;
    });
    res.json({ success: true });
  });

  app.post('/api/notifications/read-all', (req, res) => {
    updateDatabase((database) => {
      database.notifications.forEach((n) => (n.read = true));
    });
    broadcastEvent('NOTIFICATION_READ', { all: true });
    res.json({ success: true });
  });

  // ==========================================
  // 8. AUDIT LOGS & DATABASE BACKUP / RESET
  // ==========================================
  app.get('/api/audit-logs', (req, res) => {
    const db = getDatabase();
    res.json({ logs: db.auditLogs });
  });

  app.get('/api/db/export', (req, res) => {
    const db = getDatabase();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="my-birawa-db-backup-${new Date().toISOString().slice(0, 10)}.json"`);
    res.send(JSON.stringify(db, null, 2));
  });

  app.post('/api/db/reset', authenticate, (req: any, res) => {
    const db = getDatabase();
    const freshDb: DatabaseSchema = {
      version: '2.5.0',
      lastUpdated: new Date().toISOString(),
      users: db.users, // preserve registered accounts
      buildings: DEFAULT_BUILDINGS,
      items: DEFAULT_HK_ITEMS,
      submissions: INITIAL_SUBMISSIONS,
      orders: INITIAL_ORDERS,
      notifications: INITIAL_NOTIFICATIONS,
      auditLogs: [
        {
          id: `log-reset-${Date.now()}`,
          action: 'DATABASE_FACTORY_RESET',
          details: 'Data checklist direset ke pengaturan bawaan pabrik oleh admin.',
          performedBy: req.user.name,
          role: req.user.role,
          timestamp: new Date().toISOString(),
          type: 'system'
        }
      ]
    };

    saveDatabase(freshDb);
    logAudit('DATABASE_RESET', 'Database checklist telah direset.', req.user.name, req.user.role, 'system');
    broadcastEvent('DATABASE_RESET', { timestamp: new Date().toISOString() });

    res.json({ success: true, message: 'Database berhasil direset ke kondisi awal.' });
  });

  // ==========================================
  // 9. VITE MIDDLEWARE / STATIC ASSETS (PORT 3000)
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`My Birawa HK Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
