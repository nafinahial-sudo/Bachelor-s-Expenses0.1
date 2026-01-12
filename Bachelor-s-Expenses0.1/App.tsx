
import React, { useState, useEffect } from 'react';
import { UserProfile, MonthData, Gender, RelationshipStatus, PartnerType, IncomeSource, Expense, SavingsGoal, UserAccount, LifeMode, LifeEvent, BorrowLendEntry } from './types';
import { getProfile, saveProfile, getHistory, saveHistory, getAccount, saveAccount, clearAllData, formatCurrency } from './utils/storage';
import { analyzeFinances } from './services/geminiService';
import Layout from './components/Layout';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import AddExpense from './components/AddExpense';
import AICoach from './components/AICoach';
import PanicButton from './components/PanicButton';
import { User, Smartphone, CreditCard, Heart, Banknote, ChevronRight, UserCircle2, Wallet, ChevronDown, ChevronUp, LogOut, CloudDownload, ShieldCheck, Mail, Phone, Sparkles, Briefcase, GraduationCap, Users2, ShieldPlus, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [account, setAccount] = useState<UserAccount | null>(getAccount());
  const [profile, setProfile] = useState<UserProfile | null>(getProfile());
  const [history, setHistory] = useState<MonthData[]>(getHistory());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('be_theme') === 'dark');

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('be_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const currentMonthId = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  
  useEffect(() => {
    if (!account?.isLoggedIn) return;
    const today = new Date();
    const monthId = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    const monthName = today.toLocaleString('default', { month: 'long', year: 'numeric' });

    if (!history.find(h => h.id === monthId)) {
      const newMonth: MonthData = {
        id: monthId,
        monthName,
        totalIncome: 0,
        incomes: [],
        expenses: [],
        borrowLend: [],
        targetBudget: 0
      };
      const updatedHistory = [...history, newMonth];
      setHistory(updatedHistory);
      saveHistory(updatedHistory);
    }
  }, [account]);

  const currentMonth = history.find(h => h.id === currentMonthId) || (history.length > 0 ? history[history.length - 1] : { id: '', monthName: '', totalIncome: 0, incomes: [], expenses: [], borrowLend: [], targetBudget: 0 });

  useEffect(() => {
    if (profile && currentMonth.expenses.length > 0) {
       const timer = setTimeout(async () => {
          try {
             const analysis = await analyzeFinances(profile, currentMonth);
             setAiAnalysis(analysis);
          } catch (e) { console.error(e); }
       }, 2000);
       return () => clearTimeout(timer);
    }
  }, [currentMonth.expenses.length, profile?.lifeMode, profile?.lifeEvent]);

  const handleAddBorrowLend = (entry: Omit<BorrowLendEntry, 'id' | 'resolved'>) => {
    const newEntry: BorrowLendEntry = { ...entry, id: Math.random().toString(36).substr(2, 9), resolved: false };
    const updatedHistory = history.map(m => m.id === currentMonthId ? { ...m, borrowLend: [...(m.borrowLend || []), newEntry] } : m);
    setHistory(updatedHistory);
    saveHistory(updatedHistory);
  };

  const handleAddExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = { ...expenseData, id: Math.random().toString(36).substr(2, 9) };
    const updatedHistory = history.map(m => m.id === currentMonthId ? { ...m, expenses: [...m.expenses, newExpense] } : m);
    setHistory(updatedHistory);
    saveHistory(updatedHistory);
    setActiveTab('dashboard');
  };

  if (!account?.isLoggedIn) return <Auth onLogin={(acc) => { setAccount(acc); saveAccount(acc); setHistory(getHistory()); }} />;
  if (!profile) return <Onboarding onComplete={(p) => { setProfile(p); saveProfile(p); }} />;

  return (
    <Layout activeTab={activeTab} setActiveTab={(tab) => tab === 'add' ? setShowAddModal(true) : setActiveTab(tab)} isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)}>
      {activeTab === 'dashboard' && <Dashboard currentMonth={currentMonth} profile={profile} aiAnalysis={aiAnalysis} />}
      {activeTab === 'ai' && <AICoach currentMonth={currentMonth} profile={profile} />}
      {activeTab === 'panic' && <PanicButton currentMonth={currentMonth} />}
      {activeTab === 'history' && <HistoryView history={history} />}
      {activeTab === 'settings' && <SettingsView profile={profile} setProfile={(p) => { setProfile(p); saveProfile(p); }} account={account} onLogout={() => { clearAllData(); setAccount(null); setProfile(null); setHistory([]); }} currentIncome={currentMonth.totalIncome} />}
      
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md h-[90vh]">
            <AddExpense 
              onAddExpense={handleAddExpense}
              onAddMoney={(amt) => {
                 const updatedHistory = history.map(m => m.id === currentMonthId ? { ...m, totalIncome: m.totalIncome + amt } : m);
                 setHistory(updatedHistory); saveHistory(updatedHistory);
              }}
              onAddBorrowLend={handleAddBorrowLend}
              onSetSavingsGoal={(goal) => {
                 const updatedHistory = history.map(m => m.id === currentMonthId ? { ...m, savingsGoal: goal } : m);
                 setHistory(updatedHistory); saveHistory(updatedHistory);
              }}
              onClose={() => setShowAddModal(false)} 
            />
          </div>
        </div>
      )}
    </Layout>
  );
};

const Onboarding: React.FC<{ onComplete: (p: UserProfile) => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserProfile>({
    name: '', gender: Gender.OTHER, status: RelationshipStatus.SINGLE, partnerType: PartnerType.NONE,
    incomeSource: IncomeSource.GUARDIAN, lifeMode: LifeMode.STUDENT, lifeEvent: LifeEvent.NORMAL
  });

  const next = () => setStep(s => s + 1);
  const prev = () => setStep(s => s - 1);

  return (
    <div className="h-screen max-w-md mx-auto bg-white dark:bg-gray-900 p-8 flex flex-col justify-center transition-colors overflow-y-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-indigo-600 tracking-tight">Let's</h1>
        <h2 className="text-4xl font-black text-gray-800 dark:text-gray-100 tracking-tight">Start</h2>
        <div className="w-12 h-2 bg-indigo-600 mt-3 rounded-full"></div>
      </div>

      <div className="space-y-8 flex-1">
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest">What's your name?</label>
              <input 
                type="text" 
                placeholder="Nafi / Jhumu" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                className="w-full p-5 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-2xl border-none font-bold text-2xl outline-none ring-2 ring-indigo-500/10 focus:ring-indigo-500 transition-all" 
                autoFocus 
              />
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest">Select Gender</label>
              <div className="grid grid-cols-1 gap-2">
                {Object.values(Gender).map(g => (
                  <button
                    key={g}
                    onClick={() => setFormData({...formData, gender: g})}
                    className={`p-4 rounded-xl border-2 flex items-center justify-between font-bold transition-all ${
                      formData.gender === g 
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                      : 'border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-400'
                    }`}
                  >
                    {g}
                    {formData.gender === g && <div className="w-2 h-2 rounded-full bg-indigo-600"></div>}
                  </button>
                ))}
              </div>
            </div>

            <button 
              disabled={!formData.name} 
              onClick={next} 
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-indigo-100 dark:shadow-none disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              Next Step <ChevronRight size={20} strokeWidth={3} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="flex items-center gap-2 mb-2">
               <button onClick={prev} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500"><ArrowLeft size={16} /></button>
               <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest">Choose your Current Identity</label>
            </div>
            <div className="grid grid-cols-1 gap-3">
               {Object.values(LifeMode).map(mode => (
                  <button 
                    key={mode} 
                    onClick={() => setFormData({...formData, lifeMode: mode})} 
                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${
                      formData.lifeMode === mode 
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                      : 'border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-400'
                    }`}
                  >
                     <div className={`p-3 rounded-xl transition-colors ${formData.lifeMode === mode ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-400'}`}>
                        {mode === LifeMode.STUDENT ? <GraduationCap size={20} /> : mode === LifeMode.JOB_HOLDER ? <Briefcase size={20} /> : mode === LifeMode.MARRIED ? <ShieldPlus size={20} /> : <Users2 size={20} />}
                     </div>
                     <span className="font-black uppercase text-[10px] tracking-widest">{mode}</span>
                  </button>
               ))}
            </div>

            <button 
              onClick={next} 
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              Continue <ChevronRight size={20} strokeWidth={3} />
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="flex items-center gap-2 mb-2">
               <button onClick={prev} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500"><ArrowLeft size={16} /></button>
               <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest">Final Details</label>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Relationship Status</p>
                <div className="grid grid-cols-1 gap-2">
                  {Object.values(RelationshipStatus).map(s => (
                    <button
                      key={s}
                      onClick={() => setFormData({...formData, status: s})}
                      className={`p-4 rounded-xl border-2 text-left font-bold transition-all ${
                        formData.status === s 
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                        : 'border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Expense Source</p>
                <div className="grid grid-cols-1 gap-2">
                  {Object.values(IncomeSource).map(i => (
                    <button
                      key={i}
                      onClick={() => setFormData({...formData, incomeSource: i})}
                      className={`p-4 rounded-xl border-2 text-left font-bold transition-all ${
                        formData.incomeSource === i 
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                        : 'border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-400'
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => onComplete(formData)} 
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              Start My Journey
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-center gap-2 pb-4">
        {[1, 2, 3].map(s => (
          <div key={s} className={`h-1.5 rounded-full transition-all ${step === s ? 'w-8 bg-indigo-600' : 'w-2 bg-gray-200 dark:bg-gray-700'}`}></div>
        ))}
      </div>
    </div>
  );
};

const HistoryView: React.FC<{ history: MonthData[] }> = ({ history }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 px-1">Archives</h2>
      <div className="space-y-4">
        {history.slice().reverse().map((month) => (
          <div key={month.id} className="bg-white dark:bg-gray-800 rounded-3xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-black text-gray-800 dark:text-white uppercase tracking-tight">{month.monthName}</h3>
               <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase">Archived</span>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl">
                   <p className="text-[9px] text-gray-400 uppercase font-black">Total Spent</p>
                   <p className="text-sm font-black text-red-500">{formatCurrency(month.expenses.reduce((s,e) => s+e.amount, 0))}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl">
                   <p className="text-[9px] text-gray-400 uppercase font-black">Net Balance</p>
                   <p className="text-sm font-black text-green-500">{formatCurrency(month.totalIncome - month.expenses.reduce((s,e) => s+e.amount, 0))}</p>
                </div>
             </div>
          </div>
        ))}
        {history.length === 0 && <p className="text-center text-gray-400 py-10">No archived history yet.</p>}
      </div>
    </div>
  );
};

const SettingsView: React.FC<{ profile: UserProfile, account: UserAccount, onLogout: () => void, setProfile: (p: UserProfile) => void, currentIncome: number }> = ({ profile, account, onLogout, setProfile, currentIncome }) => {
  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <ShieldCheck size={20} className="text-gray-600 dark:text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Profile & Modes</h2>
      </header>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
         <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Life Management</h3>
         <div className="space-y-3">
            <div>
               <label className="block text-[9px] font-black uppercase text-gray-400 mb-2 tracking-tighter">Life Mode (AI Influence)</label>
               <select value={profile.lifeMode} onChange={(e) => setProfile({...profile, lifeMode: e.target.value as LifeMode})} className="w-full bg-gray-50 dark:bg-gray-700 p-4 rounded-2xl border-none outline-none font-bold text-sm dark:text-white">
                  {Object.values(LifeMode).map(m => <option key={m} value={m}>{m}</option>)}
               </select>
            </div>
            <div>
               <label className="block text-[9px] font-black uppercase text-gray-400 mb-2 tracking-tighter">Life Event (Temporary Rules)</label>
               <select value={profile.lifeEvent} onChange={(e) => setProfile({...profile, lifeEvent: e.target.value as LifeEvent})} className="w-full bg-gray-50 dark:bg-gray-700 p-4 rounded-2xl border-none outline-none font-bold text-sm dark:text-white">
                  {Object.values(LifeEvent).map(e => <option key={e} value={e}>{e}</option>)}
               </select>
            </div>
         </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
         <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Identity Info</h3>
         <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-700">
              <span className="text-xs font-bold text-gray-400 uppercase">Name</span>
              <span className="text-sm font-black text-gray-800 dark:text-white">{profile.name}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-xs font-bold text-gray-400 uppercase">Gender</span>
              <span className="text-sm font-black text-gray-800 dark:text-white">{profile.gender}</span>
            </div>
         </div>
      </div>

      <button onClick={onLogout} className="w-full p-5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-3xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-sm hover:bg-red-100 transition-all active:scale-95">
         <LogOut size={18} /> Logout Device
      </button>
    </div>
  );
};

export default App;
