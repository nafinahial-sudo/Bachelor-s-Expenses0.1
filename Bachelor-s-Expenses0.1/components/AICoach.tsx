
import React, { useState, useEffect } from 'react';
import { MonthData, UserProfile } from '../types';
import { analyzeFinances, getGiftSuggestions, analyzeSavingsGoal } from '../services/geminiService';
import { Sparkles, Gift, BrainCircuit, RefreshCw, AlertCircle, ShoppingBag, Banknote, UserPlus, PiggyBank, Lightbulb, Target, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../utils/storage';

interface AICoachProps {
  currentMonth: MonthData;
  profile: UserProfile;
}

const AICoach: React.FC<AICoachProps> = ({ currentMonth, profile }) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [savingsAnalysis, setSavingsAnalysis] = useState<any>(null);
  const [gifts, setGifts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingsLoading, setSavingsLoading] = useState(false);
  const [giftLoading, setGiftLoading] = useState(false);
  const [error, setError] = useState('');

  // Gift Assistant States
  const [giftBudget, setGiftBudget] = useState('2000');
  const [giftRecipient, setGiftRecipient] = useState('');
  const [giftOccasion, setGiftOccasion] = useState('');

  const runAnalysis = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await analyzeFinances(profile, currentMonth);
      setAnalysis(data);
      
      if (currentMonth.savingsGoal) {
        setSavingsLoading(true);
        const sData = await analyzeSavingsGoal(
          profile, 
          currentMonth, 
          currentMonth.savingsGoal.amount, 
          currentMonth.savingsGoal.purpose, 
          currentMonth.savingsGoal.flexibility
        );
        setSavingsAnalysis(sData);
        setSavingsLoading(false);
      }
    } catch (err) {
      setError('Could not get AI advice. Try again?');
    } finally {
      setLoading(false);
    }
  };

  const handleGiftSuggestions = async () => {
    const budgetNum = parseInt(giftBudget);
    if (isNaN(budgetNum) || budgetNum <= 0 || !giftRecipient || !giftOccasion) return;
    
    setGiftLoading(true);
    try {
      const suggestions = await getGiftSuggestions(budgetNum, giftOccasion, giftRecipient, profile);
      setGifts(suggestions);
    } catch (err) {
      console.error(err);
      setError('Failed to get gift ideas. Please try again.');
    } finally {
      setGiftLoading(false);
    }
  };

  useEffect(() => {
    if (currentMonth.expenses.length > 0 && !analysis) {
      runAnalysis();
    }
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
          <BrainCircuit size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">AI Finance Coach</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Intelligent & Non-judgmental advice</p>
        </div>
      </header>

      {/* Main AI Report */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <Sparkles size={18} className="text-yellow-500" />
            Monthly AI Insights
          </h3>
          <button 
            onClick={runAnalysis} 
            disabled={loading}
            className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full transition-colors"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center text-gray-400 gap-3">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-sm">Bhai/Apu, wait... analysis cholche!</p>
          </div>
        ) : analysis ? (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">"{analysis.summary}"</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-2xl border border-blue-100 dark:border-blue-800">
                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase">Personality</p>
                <p className="text-sm font-bold text-blue-800 dark:text-blue-300">{analysis.spenderPersonality}</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-2xl border border-orange-100 dark:border-orange-800">
                <p className="text-[10px] text-orange-600 dark:text-orange-400 font-bold uppercase">Survival</p>
                <p className="text-sm font-bold text-orange-800 dark:text-orange-300">{analysis.predictionDays} Days left</p>
              </div>
            </div>

            <div className={`p-4 rounded-2xl flex gap-3 ${analysis.status === 'Risk' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-900/30' : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-100 dark:border-green-900/30'}`}>
              <AlertCircle size={20} className="shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide">Coach's Advice</p>
                <p className="text-sm leading-relaxed">{analysis.advice}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-400">
            <p className="text-sm">Bhai, log your expenses to get insights!</p>
          </div>
        )}
      </div>

      {/* 1️⃣ Micro-Savings Engine UI */}
      {currentMonth.savingsGoal && (
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-[32px] p-6 border border-purple-100 dark:border-purple-800 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-purple-800 dark:text-purple-300 flex items-center gap-2 uppercase text-xs tracking-widest">
              <Target size={20} />
              Micro-Savings Plan
            </h3>
            <span className="bg-purple-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">{currentMonth.savingsGoal.flexibility}</span>
          </div>

          {savingsLoading ? (
             <div className="py-8 flex justify-center">
               <RefreshCw size={32} className="text-purple-400 animate-spin" />
             </div>
          ) : savingsAnalysis ? (
            <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
               <div className={`p-5 rounded-3xl border ${savingsAnalysis.isRealistic ? 'bg-green-100/30 border-green-200 text-green-800' : 'bg-orange-100/30 border-orange-200 text-orange-800'} dark:bg-gray-800/50 dark:text-gray-200 shadow-sm`}>
                 <p className="text-sm font-black mb-1 uppercase tracking-tight">{savingsAnalysis.isRealistic ? 'Goal is Realistic! ✅' : 'Bit Tight for you... ⚠️'}</p>
                 <p className="text-xs italic leading-relaxed opacity-80">{savingsAnalysis.explanation}</p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl border border-purple-100 dark:border-purple-800/50 shadow-sm">
                    <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-1">Daily Target</p>
                    <p className="text-lg font-black text-purple-600">{formatCurrency(savingsAnalysis.dailyTarget)}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl border border-purple-100 dark:border-purple-800/50 shadow-sm">
                    <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-1">Weekly Target</p>
                    <p className="text-lg font-black text-purple-600">{formatCurrency(savingsAnalysis.weeklyTarget)}</p>
                  </div>
               </div>

               <div className="space-y-3">
                  <p className="text-[10px] text-purple-500 uppercase font-black tracking-widest flex items-center gap-2">
                    <Sparkles size={14} /> Invisible Savings Habits
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {savingsAnalysis.microSavingsTips.map((tip: string, i: number) => (
                      <div key={i} className="flex gap-3 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 shadow-sm">
                        <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                        {tip}
                      </div>
                    ))}
                  </div>
               </div>

               <div className="p-5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[24px] text-white shadow-lg shadow-indigo-100 dark:shadow-none">
                  <p className="text-[10px] uppercase font-black opacity-80 mb-4 tracking-widest flex items-center gap-2">
                    <BrainCircuit size={14} /> Future Impact Analysis
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold opacity-70 uppercase">Survival Bonus</p>
                      <p className="text-2xl font-black">+{savingsAnalysis.extraDays} Days</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-[10px] font-bold opacity-70 uppercase">Mental Relief</p>
                      <p className="text-2xl font-black">{savingsAnalysis.stressReduction}%</p>
                    </div>
                  </div>
               </div>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-400 italic space-y-4">
               <PiggyBank size={40} className="mx-auto opacity-20" />
               <p className="text-sm px-4">Tap refresh to let Apu generate your micro-savings engine strategy!</p>
            </div>
          )}
        </div>
      )}

      {/* Gift Assistant */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-[32px] p-6 border border-indigo-100 dark:border-indigo-800 space-y-6">
        <h3 className="font-black text-indigo-800 dark:text-indigo-300 flex items-center gap-2 uppercase text-xs tracking-widest">
          <Gift size={20} />
          Smart Gift Assistant
        </h3>
        
        {gifts.length === 0 ? (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-indigo-400 dark:text-indigo-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Banknote size={14} /> Budget (৳)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-indigo-300">৳</span>
                <input 
                  type="number"
                  value={giftBudget}
                  onChange={(e) => setGiftBudget(e.target.value)}
                  className="w-full bg-white dark:bg-gray-800 dark:text-white border-none rounded-2xl py-5 pl-10 pr-4 text-2xl font-black focus:ring-4 focus:ring-indigo-500/10 outline-none shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-indigo-400 dark:text-indigo-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <UserPlus size={14} /> For Whom?
              </label>
              <input 
                type="text"
                value={giftRecipient}
                onChange={(e) => setGiftRecipient(e.target.value)}
                placeholder="e.g. My Crush, Best Friend"
                className="w-full bg-white dark:bg-gray-800 dark:text-white border-none rounded-2xl py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-indigo-400 dark:text-indigo-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <ShoppingBag size={14} /> Occasion?
              </label>
              <input 
                type="text"
                value={giftOccasion}
                onChange={(e) => setGiftOccasion(e.target.value)}
                placeholder="e.g. Birthday, Graduation"
                className="w-full bg-white dark:bg-gray-800 dark:text-white border-none rounded-2xl py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none shadow-sm"
              />
            </div>

            <button 
              onClick={handleGiftSuggestions}
              disabled={giftLoading || !giftBudget || !giftRecipient || !giftOccasion}
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 dark:shadow-none transition-transform active:scale-95 disabled:opacity-50"
            >
              {giftLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw size={18} className="animate-spin" /> Suggesting Gifts...
                </span>
              ) : `Find Perfect Gifts`}
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-black text-indigo-400 dark:text-indigo-500 uppercase tracking-widest">Suggestions for {giftRecipient}</p>
              <button 
                onClick={() => setGifts([])} 
                className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline"
              >
                Reset
              </button>
            </div>
            
            <div className="space-y-3">
              {gifts.map((gift, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-indigo-100 dark:border-indigo-800/50 flex flex-col gap-2 shadow-sm">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-black text-gray-800 dark:text-white tracking-tight">{gift.name}</p>
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{formatCurrency(gift.price)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-gray-400">Available at {gift.shop}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic leading-relaxed">"{gift.reason}"</p>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => setGifts([])} 
              className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 transition-colors"
            >
              Try another budget?
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle size={18} />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default AICoach;
