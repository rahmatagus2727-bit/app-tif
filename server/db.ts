import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { 
  Building, 
  HKItemDefinition, 
  HKSubmission, 
  HKOrder, 
  AppNotification, 
  UserAccount, 
  AuditLog, 
  RealtimeEvent, 
  RealtimeEventType 
} from '../src/types';
import {
  DEFAULT_BUILDINGS,
  DEFAULT_HK_ITEMS,
  INITIAL_SUBMISSIONS,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS,
  DEFAULT_USER
} from '../src/data/defaultData';

const DATA_DIR = path.join(process.cwd(), 'server', 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');
const JWT_SECRET = process.env.JWT_SECRET || 'my-birawa-telpro-secret-key-2026-tif';

export interface DatabaseSchema {
  version: string;
  lastUpdated: string;
  users: UserAccount[];
  buildings: Building[];
  items: HKItemDefinition[];
  submissions: HKSubmission[];
  orders: HKOrder[];
  notifications: AppNotification[];
  auditLogs: AuditLog[];
}

// SSE Clients registry
export interface SSEClient {
  id: string;
  res: any;
  userId?: string;
}

let sseClients: SSEClient[] = [];

export function addSSEClient(client: SSEClient) {
  sseClients.push(client);
}

export function removeSSEClient(clientId: string) {
  sseClients = sseClients.filter((c) => c.id !== clientId);
}

export function broadcastEvent<T>(type: RealtimeEventType, data: T) {
  const event: RealtimeEvent<T> = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    type,
    data,
    timestamp: new Date().toISOString()
  };

  const payload = `data: ${JSON.stringify(event)}\n\n`;
  for (const client of sseClients) {
    try {
      client.res.write(payload);
    } catch (err) {
      console.error(`Error sending SSE to client ${client.id}:`, err);
    }
  }
}

// Heartbeat interval for SSE
setInterval(() => {
  if (sseClients.length > 0) {
    const ping = `: ping\n\n`;
    for (const client of sseClients) {
      try {
        client.res.write(ping);
      } catch (e) {
        // will be cleaned on next request
      }
    }
  }
}, 15000);

// Default seed users with hashed passwords
function generateDefaultUsers(): UserAccount[] {
  const salt = bcrypt.genSaltSync(10);
  const defaultPasswordHash = bcrypt.hashSync('password123', salt);
  const rudikPasswordHash = bcrypt.hashSync('92001214', salt);

  return [
    {
      id: 'usr-1',
      nik: '92001214',
      name: 'Rudik Setiyawan',
      email: '92001214@telpro.co.id',
      role: 'Petugas Housekeeping (HK)',
      department: 'Telkom Property - Facility Management Witel Surabaya Selatan',
      phoneNumber: '0812-3456-7890',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      passwordHash: rudikPasswordHash,
      createdAt: '2026-08-01T08:00:00.000Z',
      status: 'active'
    },
    {
      id: 'usr-2',
      nik: '91004521',
      name: 'Budi Santoso',
      email: 'budi.santoso@telpro.co.id',
      role: 'HK Supervisor',
      department: 'Housekeeping Operation Witel Surabaya',
      phoneNumber: '0813-8899-7711',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      passwordHash: defaultPasswordHash,
      createdAt: '2026-08-01T08:00:00.000Z',
      status: 'active'
    },
    {
      id: 'usr-3',
      nik: '88001122',
      name: 'Administrator TIF',
      email: 'admin.tif@telpro.co.id',
      role: 'Telpro Area Manager',
      department: 'Facility Management Telkom Property',
      phoneNumber: '0811-2233-4455',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      passwordHash: defaultPasswordHash,
      createdAt: '2026-08-01T08:00:00.000Z',
      status: 'active'
    }
  ];
}

function getInitialDatabase(): DatabaseSchema {
  return {
    version: '2.5.0',
    lastUpdated: new Date().toISOString(),
    users: generateDefaultUsers(),
    buildings: DEFAULT_BUILDINGS,
    items: DEFAULT_HK_ITEMS,
    submissions: INITIAL_SUBMISSIONS,
    orders: INITIAL_ORDERS,
    notifications: INITIAL_NOTIFICATIONS,
    auditLogs: [
      {
        id: 'log-init',
        action: 'DATABASE_INITIALIZATION',
        details: 'Sistem database internal & sinkronisasi real-time berhasil diinisiasi.',
        performedBy: 'System Engine',
        role: 'System',
        timestamp: new Date().toISOString(),
        type: 'system'
      }
    ]
  };
}

let cachedDb: DatabaseSchema | null = null;

export function getDatabase(): DatabaseSchema {
  if (cachedDb) return cachedDb;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      cachedDb = JSON.parse(data);
      return cachedDb!;
    }
  } catch (error) {
    console.error('Error reading database file, resetting to initial state:', error);
  }

  const initial = getInitialDatabase();
  saveDatabase(initial);
  return initial;
}

export function saveDatabase(db: DatabaseSchema): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    db.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
    cachedDb = db;
    return true;
  } catch (error) {
    console.error('Error saving database to file:', error);
    return false;
  }
}

export function updateDatabase<T>(updater: (db: DatabaseSchema) => T): T {
  const db = getDatabase();
  const result = updater(db);
  saveDatabase(db);
  return result;
}

export function logAudit(
  action: string,
  details: string,
  performedBy: string,
  role: string,
  type: AuditLog['type'] = 'system'
) {
  const newLog: AuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    action,
    details,
    performedBy,
    role,
    timestamp: new Date().toISOString(),
    type
  };

  updateDatabase((db) => {
    db.auditLogs.unshift(newLog);
    // Keep last 300 logs
    if (db.auditLogs.length > 300) {
      db.auditLogs = db.auditLogs.slice(0, 300);
    }
  });

  return newLog;
}

// Authentication Helpers
export function hashPassword(plainText: string): string {
  return bcrypt.hashSync(plainText, 10);
}

export function verifyPassword(plainText: string, hash: string): boolean {
  return bcrypt.compareSync(plainText, hash);
}

export function generateToken(user: { id: string; nik: string; role: string; name: string }): string {
  return jwt.sign(
    { id: user.id, nik: user.nik, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}
