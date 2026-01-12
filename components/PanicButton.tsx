
import React, { useState } from 'react';
import { ShieldAlert, Info, ListCheck, HeartHandshake } from 'lucide-react';
import { MonthData } from '../types';
import { formatCurrency } from '../utils/storage';

interface PanicButtonProps {
  currentMonth: MonthData;
}

const PanicButton: React.FC<PanicButtonProps> = ({ currentMonth }) => {
  const [active, setActive] = useState(false);

  const totalExpenses = currentMonth.expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = Math.max(0, currentMonth.totalIncome - totalExpenses);
  const daysLeft = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate();
  
  // Basic survival budget logic (minimum food + commute)
  const dailySurvival = 250; // estimated min daily survival in BDT
  const totalSurvivalNeeded = dailySurvival * daysLeft;
  const isDanger = remaining < totalSurvivalNeeded;

  return (
    <div className="space-y-6">
      {!active ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-6">
          <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
            <button 
              onClick={() => setActive(true)}
              className="w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl shadow-red-200 hover:scale-105 transition-transform"
            >
              <ShieldAlert size={40} />
            </button>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Financial Panic?</h2>
            <p className="text-sm text-gray-500 mt-2">Tap the button for an emergency survival plan.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in zoom-in duration-300">
          <header className="bg-red-600 text-white p-6 rounded-3xl space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Survival Mode</h2>
              <button onClick={() => setActive(false)} className="text-xs font-bold uppercase bg-white/20 px-3 py-1 rounded-full">Exit</button>
            </div>
            <p className="text-xs opacity-90">Bhai, don't worry. We'll handle this together.</p>
            <div className="pt-4 flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold opacity-80">Remaining Days</p>
                <p className="text-3xl font-bold">{daysLeft}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold opacity-80">Survival Budget</p>
                <p className="text-xl font-bold">{formatCurrency(remaining)}</p>
              </div>
            </div>
          </header>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <Info size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">The Reality Check</h3>
                <p className="text-sm text-gray-600 mt-1">
                  You have {formatCurrency(remaining / daysLeft)} per day. 
                  {isDanger ? ' This is tight. You need to cut all extra costs immediately.' : ' You can make it if you are careful!'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <ListCheck size={18} className="text-indigo-600" />
                Immediate Stop List
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-3 p-3 bg-red-50 rounded-xl text-red-700 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                  Smoking & Premium Tea Snacks
                </li>
                <li className="flex items-center gap-3 p-3 bg-red-50 rounded-xl text-red-700 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                  Online Shopping & Gadgets
                </li>
                <li className="flex items-center gap-3 p-3 bg-red-50 rounded-xl text-red-700 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                  Eating Out / Restaurants
                </li>
              </ul>
            </div>

            <div className="bg-indigo-50 p-4 rounded-2xl flex gap-3">
              <HeartHandshake size={24} className="text-indigo-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-indigo-800 uppercase">Supportive Tip</p>
                <p className="text-sm text-indigo-700 italic">"Gore khawa beshi koren (Eat at home more). A few days of sacrifice will save you from taking loans."</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanicButton;
