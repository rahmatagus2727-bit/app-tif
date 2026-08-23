export type FrequencyType = 'harian' | '1x_seminggu' | '2x_seminggu' | '1x_sebulan';

export interface HKItemDefinition {
  id: string;
  name: string;
  frequency: FrequencyType;
  description?: string;
  areaDefault?: string;
}

export interface Building {
  id: string;
  name: string;
  code: string;
  address?: string;
  photoUrl?: string;
  buildingClass?: 'Kelas 2' | 'Kelas 3' | 'Kelas 5' | string;
  witel?: string;
}

export interface HKSubmission {
  id: string;
  buildingId: string;
  buildingName: string;
  frequency: FrequencyType;
  frequencyLabel: string;
  itemId: string;
  itemName: string;
  conditionGood: boolean; // true = Ya (Baik/Bersih), false = Tidak
  photoUrl: string; // Base64 or URL
  photoFileName?: string;
  notes?: string;
  officerName: string;
  timestamp: string; // ISO date string
  dateOnly: string; // YYYY-MM-DD
}

export type ViewStep = 1 | 2 | 3 | 4;

export type MainTab = 'home' | 'checklist' | 'profile';

export interface UserProfile {
  name: string;
  email: string;
  nik: string;
  role: string;
  department: string;
  avatarUrl?: string;
  phoneNumber?: string;
}

export interface HKOrder {
  id: string;
  code: string;
  title: string;
  buildingName: string;
  category: string;
  date: string;
  status: 'Dalam Proses' | 'Selesai' | 'Menunggu';
  assignedTo: string;
  progress: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'checklist' | 'system' | 'approval';
}
