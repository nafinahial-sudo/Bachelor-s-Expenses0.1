
import React, { useState, useEffect } from 'react';
import { Home, History, PlusCircle, ShieldAlert, Heart, Settings, Code, Sun, Moon, Cloud, CloudOff, RefreshCcw } from 'lucide-react';
import { getLastSync } from '../utils/storage';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, isDarkMode, toggleDarkMode }) => {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'offline'>('idle');
  const [lastSyncText, setLastSyncText] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const last = getLastSync();
      if (!last) {
        setLastSyncText('Never synced');
        return;
      }
      const diff = Math.floor((new Date().getTime() - new Date(last).getTime()) / 1000);
      if (diff < 60) setLastSyncText('Just now');
      else if (diff < 3600) setLastSyncText(`${Math.floor(diff / 60)}m ago`);
      else setLastSyncText('Synced');
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, [children]); // Re-run when content changes (potential sync)

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'add', label: 'Add', icon: PlusCircle },
    { id: 'history', label: 'History', icon: History },
    { id: 'ai', label: 'AI Coach', icon: Heart },
    { id: 'panic', label: 'Panic', icon: ShieldAlert },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 dark:bg-gray-900 overflow-hidden relative border-x border-gray-200 dark:border-gray-800 shadow-xl transition-colors duration-300">
      <header className="bg-white dark:bg-gray-800 px-6 py-4 flex justify-between items-center border-b border-gray-100 dark:border-gray-700 z-10 shrink-0">
        <div>
          <h1 className="text-xl font-black text-gray-800 dark:text-gray-100 flex items-center gap-2 leading-none">
            Bachelor's
            <div className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-md">
               <Cloud size={10} className="text-indigo-500" />
               <span className="text-[8px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-tighter">{lastSyncText}</span>
            </div>
          </h1>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold tracking-widest mt-0.5">SURVIVE THE MONTH SMARTER</p>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={toggleDarkMode} 
            className="text-gray-400 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Toggle Night Mode"
          >
            {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
          </button>
          <button 
            onClick={() => setActiveTab('settings')} 
            className={`p-2 rounded-full transition-colors ${activeTab === 'settings' ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-32 px-4 pt-4 scroll-smooth">
        {children}
      </main>

      {/* Developer Credit */}
      <div className="fixed bottom-[72px] left-0 right-0 flex justify-center z-20 pointer-events-none">
        <a 
          href="https://www.linkedin.com/in/sadman-nahial-nafi" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-indigo-50 dark:border-indigo-900/30 rounded-full shadow-sm flex items-center gap-1.5 ring-1 ring-black/5 dark:ring-white/5 transition-all hover:scale-105 hover:bg-white dark:hover:bg-gray-700 pointer-events-auto cursor-pointer"
        >
          <Code size={10} className="text-indigo-500" />
          <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter">Developed by</span>
          <span className="text-[9px] font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 uppercase tracking-tight">
            SADMAN NAHIAL NAFI
          </span>
        </a>
      </div>

      <nav className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 fixed bottom-0 left-0 right-0 max-w-md mx-auto px-6 py-3 flex justify-between items-center z-30 shadow-[0_-8px_20px_rgba(0,0,0,0.05)] transition-colors">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === item.id ? 'text-indigo-600 dark:text-indigo-400 scale-105' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            <span className="text-[10px] font-semibold">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
