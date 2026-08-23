import React, { useState, useEffect } from 'react';
import {
  Building,
  FrequencyType,
  HKItemDefinition,
  HKSubmission,
  ViewStep,
  UserProfile,
  MainTab,
  HKOrder,
  AppNotification
} from './types';
import {
  DEFAULT_BUILDINGS,
  DEFAULT_HK_ITEMS,
  INITIAL_SUBMISSIONS,
  FREQUENCY_CATEGORIES,
  DEFAULT_USER,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS
} from './data/defaultData';
import { LoginScreen } from './components/LoginScreen';
import { HomeScreen } from './components/HomeScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { BottomNavBar } from './components/BottomNavBar';
import { NotificationModal } from './components/NotificationModal';
import { Tampilan1Gedung } from './components/Tampilan1Gedung';
import { Tampilan2Kategori } from './components/Tampilan2Kategori';
import { Tampilan3Items } from './components/Tampilan3Items';
import { Tampilan4Form } from './components/Tampilan4Form';
import { PhotoModal } from './components/PhotoModal';
import { exportBuildingToChecklistExcel } from './utils/excelHelper';
import {
  Layers,
  ChevronRight,
  Home,
  Building2,
  Calendar,
  CheckSquare,
  FileSpreadsheet,
  Download,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Bell,
  User,
  ArrowLeft,
  LogOut
} from 'lucide-react';

export default function App() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('tif_hk_logged_in');
    return saved !== null ? saved === 'true' : true;
  });

  const [showGlobalLogoutConfirm, setShowGlobalLogoutConfirm] = useState(false);

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('tif_hk_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_USER;
  });

  // Main Tab Navigation ('home' | 'checklist' | 'profile')
  const [mainTab, setMainTab] = useState<MainTab>('home');

  // Checklist 4-Step Workflow State (1 | 2 | 3 | 4)
  const [currentStep, setCurrentStep] = useState<ViewStep>(1);

  // Core Data State (persisted to LocalStorage)
  const [buildings, setBuildings] = useState<Building[]>(() => {
    const saved = localStorage.getItem('tif_hk_buildings_v2');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 15) return parsed;
      } catch (e) { console.error(e); }
    }
    return DEFAULT_BUILDINGS;
  });

  const [items, setItems] = useState<HKItemDefinition[]>(() => {
    const saved = localStorage.getItem('tif_hk_items_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_HK_ITEMS;
  });

  const [submissions, setSubmissions] = useState<HKSubmission[]>(() => {
    const saved = localStorage.getItem('tif_hk_submissions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_SUBMISSIONS;
  });

  const [orders, setOrders] = useState<HKOrder[]>(() => {
    const saved = localStorage.getItem('tif_hk_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_ORDERS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('tif_hk_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Selected entities along the 4-step workflow
  const [selectedBuilding, setSelectedBuilding] = useState<Building>(buildings[0] || DEFAULT_BUILDINGS[0]);
  const [selectedFrequency, setSelectedFrequency] = useState<FrequencyType>('harian');
  const [selectedItem, setSelectedItem] = useState<HKItemDefinition>(DEFAULT_HK_ITEMS[0]);

  // Modal State
  const [viewingPhoto, setViewingPhoto] = useState<HKSubmission | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('tif_hk_logged_in', String(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('tif_hk_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('tif_hk_buildings_v2', JSON.stringify(buildings));
  }, [buildings]);

  useEffect(() => {
    localStorage.setItem('tif_hk_items_v2', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('tif_hk_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('tif_hk_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('tif_hk_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Authentication Handlers
  const handleLogin = (newUser: UserProfile) => {
    setUser(newUser);
    setIsLoggedIn(true);
    setMainTab('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Navigation handlers
  const handleSelectBuilding = (building: Building) => {
    setSelectedBuilding(building);
    setCurrentStep(2);
    setMainTab('checklist');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectFrequency = (freq: FrequencyType) => {
    setSelectedFrequency(freq);
    setCurrentStep(3);
    setMainTab('checklist');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectItem = (item: HKItemDefinition) => {
    setSelectedItem(item);
    setCurrentStep(4);
    setMainTab('checklist');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDirectFormNavigation = (building: Building, item: HKItemDefinition) => {
    setSelectedBuilding(building);
    setSelectedFrequency(item.frequency);
    setSelectedItem(item);
    setCurrentStep(4);
    setMainTab('checklist');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submission handler from Step 4
  const handleSubmitForm = (newSubData: Omit<HKSubmission, 'id' | 'timestamp' | 'dateOnly'>) => {
    const now = new Date();
    const newSubmission: HKSubmission = {
      ...newSubData,
      id: `sub-${Date.now()}`,
      timestamp: now.toISOString(),
      dateOnly: now.toISOString().split('T')[0],
    };

    // Replace if exists for same building & item, else add
    setSubmissions((prev) => {
      const filtered = prev.filter(
        (s) => !(s.buildingId === newSubData.buildingId && s.itemId === newSubData.itemId)
      );
      return [newSubmission, ...filtered];
    });

    // Add a notification for successful submission
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Checklist Berhasil Disimpan',
      message: `Foto bukti ${newSubData.itemName} di ${newSubData.buildingName} telah tersinkron ke Excel.`,
      time: 'Baru saja',
      type: 'order',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Add Custom Building Handler
  const handleAddBuilding = (name: string, code: string) => {
    const newB: Building = {
      id: `bld-${Date.now()}`,
      name: name,
      code: code,
      address: 'Lokasi Operasional TIF',
    };
    setBuildings([...buildings, newB]);
  };

  const handleDeleteBuilding = (id: string) => {
    setBuildings(buildings.filter((b) => b.id !== id));
    setSubmissions(submissions.filter((s) => s.buildingId !== id));
  };

  // Add Custom Item Handler
  const handleAddItem = (name: string, description: string, frequency: FrequencyType) => {
    const newItem: HKItemDefinition = {
      id: `item-${Date.now()}`,
      name: name,
      description: description,
      frequency: frequency,
    };
    setItems([...items, newItem]);
  };

  // Reset sample data
  const handleResetData = () => {
    if (confirm('Kembalikan data checklist ke contoh awal (reset)?')) {
      setBuildings(DEFAULT_BUILDINGS);
      setItems(DEFAULT_HK_ITEMS);
      setSubmissions(INITIAL_SUBMISSIONS);
      setOrders(INITIAL_ORDERS);
      setNotifications(INITIAL_NOTIFICATIONS);
      setSelectedBuilding(DEFAULT_BUILDINGS[0]);
      setSelectedFrequency('harian');
      setSelectedItem(DEFAULT_HK_ITEMS[0]);
      setCurrentStep(1);
    }
  };

  // If not logged in, show Login Screen (Exact design matching Image 18.58.45)
  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} defaultUser={user} />;
  }

  // Find active submission for current form item
  const currentItemSubmission = submissions.find(
    (s) => s.buildingId === selectedBuilding.id && s.itemId === selectedItem.id
  );

  const currentCategoryObj = FREQUENCY_CATEGORIES.find((c) => c.id === selectedFrequency);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-rose-500/20 selection:text-rose-600">
      {/* 1. TOP GLOBAL NAVBAR */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-red-900 via-rose-900 to-red-950 text-white border-b border-rose-950 shadow-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => {
                setMainTab('home');
                setCurrentStep(1);
              }}
              className="w-10 h-10 rounded-2xl bg-white text-rose-600 flex items-center justify-center shadow-lg shadow-black/20 cursor-pointer font-black text-sm tracking-tight border border-rose-200"
              id="app-global-logo"
            >
              HK
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-extrabold text-white text-base tracking-tight hover:text-rose-200 transition cursor-pointer font-sans"
                  onClick={() => {
                    setMainTab('home');
                    setCurrentStep(1);
                  }}
                >
                  My Birawa HK
                </span>
                <span className="text-[10px] bg-white/20 text-rose-100 border border-white/30 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
                  Proyek HK TIF
                </span>
              </div>
              <p className="text-[11px] text-rose-200 font-medium hidden sm:block">
                Telkom Property by Telkom Indonesia • Checklist Real-Time Excel
              </p>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Quick Export Excel Button */}
            <button
              onClick={() => exportBuildingToChecklistExcel(selectedBuilding, submissions, items)}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-sm"
              title="Download File Spreadsheet Excel (.xlsx)"
              id="global-btn-export-excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Excel</span>
            </button>

            {/* Notification Icon */}
            <button
              onClick={() => setIsNotificationOpen(true)}
              className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
              title="Notifikasi"
              id="global-btn-notif"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Reset Data Button */}
            <button
              onClick={handleResetData}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-rose-200 hover:text-white transition text-xs"
              title="Reset ke Data Awal"
              id="global-btn-reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Global Logout Button */}
            <button
              onClick={() => setShowGlobalLogoutConfirm(true)}
              className="inline-flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-rose-800/80 hover:bg-rose-700 text-rose-100 hover:text-white border border-rose-600/60 transition text-xs font-bold shadow-sm"
              title="Keluar ke Halaman Login"
              id="global-btn-logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* BREADCRUMB 4 TAMPILAN (Shown when inside Checklist tab) */}
        {mainTab === 'checklist' && (
          <div className="bg-red-950/80 border-t border-rose-900/60 py-2">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar text-xs">
              {/* Back to Home Shortcut */}
              <button
                onClick={() => setMainTab('home')}
                className="flex items-center gap-1 text-rose-200 hover:text-white px-2 py-1 rounded hover:bg-rose-900/40 text-xs font-semibold mr-1 shrink-0"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>

              <ChevronRight className="w-3.5 h-3.5 text-rose-400 shrink-0" />

              {/* Step 1 Tab */}
              <button
                onClick={() => setCurrentStep(1)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                  currentStep === 1
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-950/50'
                    : 'text-rose-200 hover:text-white hover:bg-rose-900/40'
                }`}
                id="nav-step-1"
              >
                <span className="w-4 h-4 rounded-full bg-black/30 flex items-center justify-center text-[10px] font-mono">1</span>
                <span>Tampilan 1 (Gedung & Excel)</span>
              </button>

              <ChevronRight className="w-3.5 h-3.5 text-rose-400 shrink-0" />

              {/* Step 2 Tab */}
              <button
                onClick={() => {
                  if (currentStep >= 2) setCurrentStep(2);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                  currentStep === 2
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-950/50'
                    : currentStep > 2
                    ? 'text-rose-100 hover:text-white hover:bg-rose-900/40'
                    : 'text-rose-300/60 opacity-60 cursor-not-allowed'
                }`}
                id="nav-step-2"
              >
                <span className="w-4 h-4 rounded-full bg-black/30 flex items-center justify-center text-[10px] font-mono">2</span>
                <span>Tampilan 2 ({selectedBuilding.name})</span>
              </button>

              <ChevronRight className="w-3.5 h-3.5 text-rose-400 shrink-0" />

              {/* Step 3 Tab */}
              <button
                onClick={() => {
                  if (currentStep >= 3) setCurrentStep(3);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                  currentStep === 3
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-950/50'
                    : currentStep > 3
                    ? 'text-rose-100 hover:text-white hover:bg-rose-900/40'
                    : 'text-rose-300/60 opacity-60 cursor-not-allowed'
                }`}
                id="nav-step-3"
              >
                <span className="w-4 h-4 rounded-full bg-black/30 flex items-center justify-center text-[10px] font-mono">3</span>
                <span>Tampilan 3 ({currentCategoryObj?.label})</span>
              </button>

              <ChevronRight className="w-3.5 h-3.5 text-rose-400 shrink-0" />

              {/* Step 4 Tab */}
              <button
                onClick={() => {
                  if (currentStep >= 4) setCurrentStep(4);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                  currentStep === 4
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-950/50'
                    : 'text-rose-300/60 opacity-60 cursor-not-allowed'
                }`}
                id="nav-step-4"
              >
                <span className="w-4 h-4 rounded-full bg-black/30 flex items-center justify-center text-[10px] font-mono">4</span>
                <span>Tampilan 4 (Form Foto)</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. MAIN APPLICATION WORKSPACE (Max-width container centered) */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full pb-24">
        {/* VIEW 1: HOME TAB */}
        {mainTab === 'home' && (
          <HomeScreen
            user={user}
            unreadNotificationCount={unreadCount}
            onOpenNotifications={() => setIsNotificationOpen(true)}
            onOpenChecklist={() => {
              setMainTab('checklist');
              setCurrentStep(1);
            }}
            onSelectBuilding={handleSelectBuilding}
            buildings={buildings}
            submissions={submissions}
            items={items}
            onLogout={handleLogout}
          />
        )}

        {/* VIEW 2: CHECKLIST 4-STEP WORKFLOW */}
        {mainTab === 'checklist' && (
          <div>
            {currentStep === 1 && (
              <Tampilan1Gedung
                buildings={buildings}
                onSelectBuilding={handleSelectBuilding}
                onAddBuilding={handleAddBuilding}
                onDeleteBuilding={handleDeleteBuilding}
                submissions={submissions}
                items={items}
                onViewPhoto={(sub) => setViewingPhoto(sub)}
                onNavigateToForm={handleDirectFormNavigation}
              />
            )}

            {currentStep === 2 && (
              <Tampilan2Kategori
                building={selectedBuilding}
                onSelectFrequency={handleSelectFrequency}
                onBackToStep1={() => setCurrentStep(1)}
                submissions={submissions}
                items={items}
              />
            )}

            {currentStep === 3 && (
              <Tampilan3Items
                building={selectedBuilding}
                frequency={selectedFrequency}
                items={items}
                submissions={submissions}
                onSelectItem={handleSelectItem}
                onBackToStep2={() => setCurrentStep(2)}
                onViewPhoto={(sub) => setViewingPhoto(sub)}
                onAddItem={handleAddItem}
              />
            )}

            {currentStep === 4 && (
              <Tampilan4Form
                building={selectedBuilding}
                frequency={selectedFrequency}
                item={selectedItem}
                existingSubmission={currentItemSubmission}
                onSubmit={handleSubmitForm}
                onBackToStep3={() => setCurrentStep(3)}
                onBackToStep1Excel={() => setCurrentStep(1)}
              />
            )}
          </div>
        )}

        {/* VIEW 3: PROFILE TAB (Matching Image 18.50.13) */}
        {mainTab === 'profile' && (
          <ProfileScreen
            user={user}
            onUpdateUser={(updated) => setUser(updated)}
            onLogout={handleLogout}
            onOpenExcel={() => {
              setMainTab('checklist');
              setCurrentStep(1);
            }}
          />
        )}
      </main>

      {/* 3. BOTTOM NAVIGATION BAR (Fixed at bottom with Home, Checklist, Profile tabs) */}
      <BottomNavBar
        currentTab={mainTab}
        onChangeTab={(t) => {
          setMainTab(t);
          if (t === 'checklist') setCurrentStep(1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenChecklist={() => {
          setMainTab('checklist');
          setCurrentStep(1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenExcel={() => {
          setMainTab('checklist');
          setCurrentStep(1);
        }}
      />

      {/* MODAL 1: NOTIFICATION DRAWER / MODAL */}
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => {
          setNotifications(notifications.map((n) => ({ ...n, read: true })));
        }}
        onClearNotifications={() => {
          setNotifications([]);
        }}
      />

      {/* MODAL 2: PHOTO FULLSCREEN VIEWER */}
      <PhotoModal
        submission={viewingPhoto}
        onClose={() => setViewingPhoto(null)}
      />

      {/* MODAL 3: GLOBAL LOGOUT CONFIRMATION */}
      {showGlobalLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-slate-200 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mx-auto">
              <LogOut className="w-7 h-7 stroke-[2.2]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Keluar dari Akun?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Anda akan keluar dan kembali ke halaman Login Dashboard My Birawa HK.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowGlobalLogoutConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowGlobalLogoutConfirm(false);
                  handleLogout();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs transition shadow-md shadow-rose-600/30 cursor-pointer"
                id="modal-btn-confirm-global-logout"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
