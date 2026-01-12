
import React from 'react';
import { MonthData, UserProfile, LifeMode, LifeEvent } from '../types';
import { formatCurrency } from '../utils/storage';
import { TrendingUp, TrendingDown, Wallet, Calendar, ArrowDownRight, ArrowUpRight, PiggyBank, Target, CheckCircle2, BrainCircuit, Activity, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DashboardProps {
  currentMonth: MonthData;
  profile: UserProfile;
  aiAnalysis: any;
}

const Dashboard: React.FC<DashboardProps> = ({ currentMonth, profile, aiAnalysis }) => {
  const totalExpenses = currentMonth.expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalBorrowed = currentMonth.borrowLend?.filter(e => e.type === 'borrow' && !e.resolved).reduce((sum, e) => sum + e.amount, 0) || 0;
  const totalLent = currentMonth.borrowLend?.filter(e => e.type === 'lend' && !e.resolved).reduce((sum, e) => sum + e.amount, 0) || 0;
  
  const remaining = currentMonth.totalIncome - totalExpenses;
  const today = new Date().getDate();
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  
  // Payday Phase Logic
  const currentPhase = today <= 7 ? 'First-Week (Flexible)' : today <= 21 ? 'Mid-Month (Stability)' : 'Last-Week (Survival)';
  const phaseProgress = today <= 7 ? (today/7)*100 : today <= 21 ? ((today-7)/14)*100 : ((today-21)/9)*100;

  const mentalHealthCategory = aiAnalysis?.mentalHealthCategory || 'Calm';
  const scoreColor = mentalHealthCategory === 'Calm' ? 'bg-green-500' : mentalHealthCategory === 'Pressured' ? 'bg-yellow-500' : 'bg-red-500';

  const categoryData = Object.entries(
    currentMonth.expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Main Wallet & Mode Card */}
      <div className="bg-indigo-600 dark:bg-indigo-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden transition-all duration-500">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
             <div>
               <p className="text-indigo-100 text-[10px] font-black uppercase tracking-widest">Life Mode: {profile.lifeMode}</p>
               <h2 className="text-4xl font-black mt-1 tracking-tight">{formatCurrency(remaining)}</h2>
             </div>
             <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/10">
                <Zap size={14} className="text-yellow-300" />
                <span className="text-[10px] font-black uppercase">{profile.lifeEvent}</span>
             </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white/10 rounded-2xl p-3 flex-1 backdrop-blur-sm border border-white/5">
              <p className="text-[9px] text-indigo-100 uppercase font-black">Incoming</p>
              <p className="text-xs font-bold">{formatCurrency(currentMonth.totalIncome)}</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 flex-1 backdrop-blur-sm border border-white/5">
              <p className="text-[9px] text-indigo-100 uppercase font-black">Lent Taka</p>
              <p className="text-xs font-bold">{formatCurrency(totalLent)}</p>
            </div>
          </div>
        </div>
        <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Mental Health Score */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
         <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
               <Activity size={18} className="text-indigo-500" />
               Financial Mental Health
            </h3>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase text-white ${scoreColor}`}>
               {mentalHealthCategory}
            </span>
         </div>
         <div className="space-y-2">
            <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
               <div className={`h-full transition-all duration-1000 ${scoreColor}`} style={{ width: `${aiAnalysis?.mentalHealthScore || 50}%` }}></div>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 italic">
               {mentalHealthCategory === 'Overloaded' ? "Bhai, relax. Don't let money stress your mind." : "Your mental load is balanced. Good job!"}
            </p>
         </div>
      </div>

      {/* Payday Phase Planner */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl p-5 border border-indigo-100 dark:border-indigo-800 space-y-4">
         <div className="flex justify-between items-end">
            <div>
               <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-1">Current Phase</p>
               <h4 className="font-black text-indigo-800 dark:text-indigo-200">{currentPhase}</h4>
            </div>
            <Calendar size={20} className="text-indigo-400" />
         </div>
         <div className="h-1.5 bg-indigo-100 dark:bg-indigo-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${phaseProgress}%` }}></div>
         </div>
         <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold leading-tight">
            {aiAnalysis?.paydayStrategy || "Strategy loading..."}
         </p>
      </div>

      {/* Cash Gap Detector Insight */}
      {aiAnalysis?.cashGapInsight && (
        <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded-3xl border border-orange-100 dark:border-orange-800 flex gap-4">
           <AlertTriangle size={24} className="text-orange-500 shrink-0" />
           <div>
              <p className="text-[10px] text-orange-600 font-black uppercase tracking-widest mb-1">Cash Gap Detector</p>
              <p className="text-xs text-orange-800 dark:text-orange-200 leading-relaxed font-medium">
                 {aiAnalysis.cashGapInsight}
              </p>
           </div>
        </div>
      )}

      {/* Borrow/Lend Brief */}
      {(totalBorrowed > 0 || totalLent > 0) && (
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-red-50 dark:border-red-900/30">
              <p className="text-[9px] text-red-400 font-black uppercase">Borrowed</p>
              <p className="text-lg font-black text-red-600">{formatCurrency(totalBorrowed)}</p>
           </div>
           <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-green-50 dark:border-green-900/30">
              <p className="text-[9px] text-green-400 font-black uppercase">Lent Out</p>
              <p className="text-lg font-black text-green-600">{formatCurrency(totalLent)}</p>
           </div>
        </div>
      )}

      {/* Data Trust Badge */}
      <div className="flex items-center justify-center gap-2 py-4 text-gray-400 dark:text-gray-500">
         <ShieldCheck size={14} />
         <span className="text-[10px] font-black uppercase tracking-widest">Your data is safe forever.</span>
      </div>
    </div>
  );
};

export default Dashboard;
