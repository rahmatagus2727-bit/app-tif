import React from 'react';
import { Home, User, ClipboardCheck, FileSpreadsheet } from 'lucide-react';
import { MainTab } from '../types';

interface BottomNavBarProps {
  currentTab: MainTab;
  onChangeTab: (tab: MainTab) => void;
  onOpenChecklist: () => void;
  onOpenExcel: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onChangeTab,
  onOpenChecklist,
  onOpenExcel,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-red-950 via-rose-950 to-red-950 border-t border-rose-900/60 shadow-2xl backdrop-blur-lg">
      <div className="max-w-md mx-auto px-6 py-2 flex items-center justify-around">
        {/* 1. Home Tab (with Red Active Pill state matching screenshot) */}
        <button
          onClick={() => onChangeTab('home')}
          className={`flex items-center gap-2 py-2 px-5 rounded-full transition-all duration-300 font-bold text-xs ${
            currentTab === 'home'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/50 scale-105'
              : 'text-rose-200/70 hover:text-white hover:bg-rose-900/40'
          }`}
          id="nav-tab-home"
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        {/* Center Quick Shortcut to Checklist */}
        <button
          onClick={() => onChangeTab('checklist')}
          className={`flex items-center gap-1.5 py-2 px-4 rounded-full transition-all duration-300 font-bold text-xs ${
            currentTab === 'checklist'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/50 scale-105'
              : 'text-rose-200/70 hover:text-white hover:bg-rose-900/40'
          }`}
          title="Buka Checklist 4 Tampilan"
          id="nav-tab-checklist"
        >
          <ClipboardCheck className="w-4 h-4" />
          <span>Checklist</span>
        </button>

        {/* 2. Profile Tab (Matching screenshot) */}
        <button
          onClick={() => onChangeTab('profile')}
          className={`flex items-center gap-2 py-2 px-5 rounded-full transition-all duration-300 font-bold text-xs ${
            currentTab === 'profile'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/50 scale-105'
              : 'text-rose-200/70 hover:text-white hover:bg-rose-900/40'
          }`}
          id="nav-tab-profile"
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </button>
      </div>
    </div>
  );
};
