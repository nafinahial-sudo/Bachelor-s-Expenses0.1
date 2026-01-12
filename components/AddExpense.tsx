
import React, { useState } from 'react';
import { CATEGORIES, MOOD_EMOJI } from '../constants';
import { ExpenseType, PaymentMethod, Mood, Expense, SavingsGoal, SavingsFlexibility, BorrowLendEntry } from '../types';
import { Plus, X, ChevronRight, Check, Banknote, ShoppingCart, ArrowLeft, PiggyBank, Target, Users, AlertCircle, Heart, Wallet, Sparkles, ShieldAlert } from 'lucide-react';

interface AddExpenseProps {
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onAddMoney: (amount: number) => void;
  onAddBorrowLend: (entry: Omit<BorrowLendEntry, 'id' | 'resolved'>) => void;
  onSetSavingsGoal: (goal: SavingsGoal) => void;
  onClose: () => void;
}

const AddExpense: React.FC<AddExpenseProps> = ({ onAddExpense, onAddMoney, onAddBorrowLend, onSetSavingsGoal, onClose }) => {
  const [mode, setMode] = useState<'expense' | 'money' | 'savings' | 'debt'>('expense');
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  
  // Expense fields
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [type, setType] = useState<ExpenseType>(ExpenseType.NEED);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [mood, setMood] = useState<Mood>(Mood.NEUTRAL);
  const [description, setDescription] = useState('');

  // Income fields
  const [incomeSource, setIncomeSource] = useState('Salary');

  // Debt fields
  const [debtType, setDebtType] = useState<'borrow' | 'lend'>('borrow');
  const [debtPerson, setDebtPerson] = useState('');

  // Savings fields
  const [savingsPurpose, setSavingsPurpose] = useState('Emergency Fund');
  const [savingsFlexibility, setSavingsFlexibility] = useState<SavingsFlexibility>(SavingsFlexibility.FLEXIBLE);

  const isOther = subCategory === 'Other';

  const handleExpenseSubmit = () => {
    if (!amount || !category) return;
    
    // 2️⃣ REAL-TIME EMOTIONAL EXPENSE ALERT
    // If it's emotional or a "Want" spending in Shopping/Entertainment categories, trigger alert
    const isImpulseCategory = category === 'SHOPPING' || category === 'DAILY';
    if ((type === ExpenseType.EMOTIONAL || (type === ExpenseType.WANT && isImpulseCategory)) && step !== 99) {
       setStep(99); // Show Emotional Alert Interstitial
       return;
    }

    onAddExpense({
      amount: parseFloat(amount),
      category,
      subCategory: subCategory || category,
      type,
      paymentMethod,
      mood,
      date: new Date().toLocaleDateString(),
      description: description.trim() || subCategory || category
    });
    onClose();
  };

  const handleIncomeSubmit = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return;
    onAddMoney(amt);
    onClose();
  };

  const handleDebtSubmit = () => {
    if (!amount || !debtPerson) return;
    onAddBorrowLend({
      amount: parseFloat(amount),
      type: debtType,
      person: debtPerson,
      date: new Date().toLocaleDateString()
    });
    onClose();
  };

  const handleSavingsSubmit = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return;
    onSetSavingsGoal({
      amount: amt,
      purpose: savingsPurpose,
      flexibility: savingsFlexibility
    });
    onClose();
  };

  const renderExpenseSteps = () => {
    if (step === 99) {
       return (
         <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in zoom-in px-4">
            <div className="w-20 h-20 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center text-pink-600 dark:text-pink-400">
               <Heart size={40} className="animate-pulse" />
            </div>
            <div>
               <h3 className="text-xl font-black text-gray-800 dark:text-white">Emotional Spend Alert!</h3>
               <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic leading-relaxed">
                  "Bhai, this looks like an emotional/impulse expense. Will this make you happy next week, or just for this hour?"
               </p>
               <p className="text-[10px] text-indigo-500 font-bold mt-4 uppercase tracking-widest">Apu's Advice: Think for 10 seconds.</p>
            </div>
            <div className="flex gap-4 w-full">
               <button onClick={onClose} className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl font-bold text-gray-600 dark:text-gray-300 active:scale-95 transition-all">Rethink</button>
               <button onClick={() => { setStep(3); handleExpenseSubmit(); }} className="flex-2 py-4 bg-indigo-600 rounded-2xl font-black text-white px-8 shadow-lg shadow-indigo-100 dark:shadow-none active:scale-95 transition-all">I really want it</button>
            </div>
         </div>
       );
    }

    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Select Category</label>
              <div className="grid grid-cols-1 gap-3">
                {Object.keys(CATEGORIES).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      setStep(2);
                    }}
                    className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all text-left group ${
                      category === cat ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'border-gray-50 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <span className="font-bold uppercase text-xs tracking-widest">{cat}</span>
                    <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setStep(1)} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-400">
                  <ArrowLeft size={16} />
                </button>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">What exactly?</label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(CATEGORIES[category as keyof typeof CATEGORIES] || []).map((sub) => (
                  <button
                    key={sub}
                    onClick={() => {
                      setSubCategory(sub);
                      setStep(3);
                    }}
                    className={`p-4 rounded-xl border-2 transition-all text-[11px] font-black uppercase tracking-tight text-center ${
                      subCategory === sub ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'border-gray-50 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-400'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
                <button onClick={() => { setSubCategory('Other'); setStep(3); }} className="p-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-400 text-[11px] font-black uppercase tracking-tight text-center">Other...</button>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="flex items-center gap-3 mb-2">
                <button onClick={() => setStep(2)} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-400">
                  <ArrowLeft size={16} />
                </button>
                <div>
                   <span className="text-[9px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">{category}</span>
                   <p className="text-xl font-black text-gray-800 dark:text-white leading-none tracking-tight">{subCategory}</p>
                </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Amount Spent</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-300">৳</span>
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className="w-full bg-gray-50 dark:bg-gray-800 dark:text-white border-none rounded-2xl py-6 pl-12 pr-4 text-4xl font-black focus:ring-4 focus:ring-indigo-500/10 outline-none" autoFocus />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nature</label>
                  <select value={type} onChange={(e) => setType(e.target.value as ExpenseType)} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none font-bold text-sm dark:text-white">
                    {Object.values(ExpenseType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Payment</label>
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none font-bold text-sm dark:text-white">
                    {Object.values(PaymentMethod).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Mood at the time</label>
                <div className="flex gap-2">
                  {Object.entries(MOOD_EMOJI).map(([m, emoji]) => (
                    <button key={m} onClick={() => setMood(m as Mood)} className={`flex-1 py-4 rounded-2xl transition-all text-2xl border-2 ${mood === m ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'border-gray-50 dark:border-gray-800 bg-white dark:bg-gray-800 grayscale opacity-50'}`}>{emoji}</button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={handleExpenseSubmit} disabled={!amount} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 dark:shadow-none transition-transform active:scale-95 disabled:opacity-50 mt-4">
              <Check size={24} strokeWidth={3} /> Save Khoroch
            </button>
          </div>
        );
      default: return null;
    }
  };

  const renderSavings = () => {
    return (
      <div className="space-y-6 animate-in slide-in-from-bottom duration-300">
         <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-2xl border border-purple-100 dark:border-purple-800/30 flex items-start gap-3">
            <Sparkles className="text-purple-600 shrink-0" size={18} />
            <p className="text-[10px] text-purple-700 dark:text-purple-300 font-bold leading-relaxed uppercase tracking-tight">
               Setting a goal helps our AI create your <span className="font-black">Micro-Savings Plan</span>. Small cuts, big survival.
            </p>
         </div>

         <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Target Savings Amount</label>
            <div className="relative">
               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-300">৳</span>
               <input 
                 type="number" 
                 value={amount} 
                 onChange={(e) => setAmount(e.target.value)} 
                 placeholder="0" 
                 className="w-full bg-gray-50 dark:bg-gray-800 dark:text-white border-none rounded-2xl py-6 pl-12 pr-4 text-4xl font-black focus:ring-4 focus:ring-purple-500/10 outline-none" 
                 autoFocus 
               />
            </div>
         </div>

         <div className="space-y-4">
            <div>
               <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Purpose of Saving</label>
               <select value={savingsPurpose} onChange={(e) => setSavingsPurpose(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none font-bold text-sm dark:text-white">
                  {['Emergency Fund', 'Future Marriage', 'Travel/Tour', 'New Gadget', 'Parents Support', 'Education', 'Festival/Eid', 'Other'].map(p => <option key={p} value={p}>{p}</option>)}
               </select>
            </div>

            <div>
               <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Discipline Level</label>
               <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                  {Object.values(SavingsFlexibility).map(f => (
                    <button 
                      key={f} 
                      onClick={() => setSavingsFlexibility(f)} 
                      className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${savingsFlexibility === f ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-sm' : 'text-gray-400'}`}
                    >
                      {f}
                    </button>
                  ))}
               </div>
            </div>
         </div>

         <button 
           onClick={handleSavingsSubmit} 
           disabled={!amount || parseFloat(amount) <= 0} 
           className="w-full bg-purple-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-purple-100 dark:shadow-none flex items-center justify-center gap-3 transition-transform active:scale-95 disabled:opacity-50"
         >
            <Target size={24} strokeWidth={3} /> Start AI Plan
         </button>

         <p className="text-center text-[9px] text-gray-400 uppercase font-black tracking-widest">Apu will suggest realistic daily/weekly targets</p>
      </div>
    );
  };

  const renderIncome = () => {
    return (
      <div className="space-y-6 animate-in slide-in-from-bottom duration-300">
         <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Add Monthly Taka</label>
            <div className="relative">
               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-300">৳</span>
               <input 
                 type="number" 
                 value={amount} 
                 onChange={(e) => setAmount(e.target.value)} 
                 placeholder="0" 
                 className="w-full bg-gray-50 dark:bg-gray-800 dark:text-white border-none rounded-2xl py-6 pl-12 pr-4 text-4xl font-black focus:ring-4 focus:ring-green-500/10 outline-none" 
                 autoFocus 
               />
            </div>
         </div>
         <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Income Source</label>
            <div className="grid grid-cols-2 gap-2">
              {['Salary', 'Side Hustle', 'Gift', 'Family', 'Refund', 'Other'].map(src => (
                <button
                  key={src}
                  onClick={() => setIncomeSource(src)}
                  className={`p-4 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest transition-all ${
                    incomeSource === src 
                    ? 'border-green-600 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                    : 'border-gray-50 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-400'
                  }`}
                >
                  {src}
                </button>
              ))}
            </div>
         </div>
         <button 
           onClick={handleIncomeSubmit} 
           disabled={!amount || parseFloat(amount) <= 0} 
           className="w-full bg-green-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-green-100 dark:shadow-none flex items-center justify-center gap-3 transition-transform active:scale-95 disabled:opacity-50"
         >
            <Check size={24} strokeWidth={3} /> Update My Budget
         </button>
      </div>
    );
  };

  const renderDebt = () => {
    return (
      <div className="space-y-6 animate-in slide-in-from-bottom duration-300">
         <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4">
            <button onClick={() => setDebtType('borrow')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest ${debtType === 'borrow' ? 'bg-white dark:bg-gray-700 text-red-600 shadow-sm' : 'text-gray-400'}`}>Borrowing</button>
            <button onClick={() => setDebtType('lend')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest ${debtType === 'lend' ? 'bg-white dark:bg-gray-700 text-green-600 shadow-sm' : 'text-gray-400'}`}>Lending</button>
         </div>
         <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Amount</label>
            <div className="relative">
               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-300">৳</span>
               <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className="w-full bg-gray-50 dark:bg-gray-800 dark:text-white border-none rounded-2xl py-6 pl-12 pr-4 text-4xl font-black focus:ring-4 focus:ring-red-500/10 outline-none" autoFocus />
            </div>
         </div>
         <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Who is the person?</label>
            <input type="text" value={debtPerson} onChange={(e) => setDebtPerson(e.target.value)} placeholder="e.g. Sifat Bhai / Ammu" className="w-full bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border-none outline-none font-bold text-gray-800 dark:text-white" />
         </div>
         <button onClick={handleDebtSubmit} disabled={!amount || !debtPerson} className="w-full bg-gray-800 text-white py-5 rounded-2xl font-black shadow-xl flex items-center justify-center gap-3 transition-transform active:scale-95">
            <Check size={24} strokeWidth={3} /> Log Transaction
         </button>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-t-[40px] p-8 shadow-2xl h-full flex flex-col overflow-hidden transition-colors border-t border-gray-100 dark:border-gray-800">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 tracking-tight">
            {mode === 'expense' ? 'Record Khoroch' : mode === 'money' ? 'Add Taka' : mode === 'debt' ? 'Borrow/Lend' : 'Savings Goal'}
          </h2>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Judgment-Free AI Tracking</p>
        </div>
        <button onClick={onClose} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-400 hover:text-indigo-600 transition-all"><X size={20} /></button>
      </div>

      <div className="flex p-1.5 bg-gray-100 dark:bg-gray-800/50 rounded-2xl mb-8 overflow-x-auto gap-1 hide-scrollbar">
        <button onClick={() => { setMode('expense'); setStep(1); }} className={`flex-1 shrink-0 py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'expense' ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-sm' : 'text-gray-400'}`}>
          <Wallet size={14} strokeWidth={3} /> Khoroch
        </button>
        <button onClick={() => setMode('money')} className={`flex-1 shrink-0 py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'money' ? 'bg-white dark:bg-gray-700 text-green-600 shadow-sm' : 'text-gray-400'}`}>
          <Banknote size={14} strokeWidth={3} /> Taka
        </button>
        <button onClick={() => setMode('debt')} className={`flex-1 shrink-0 py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'debt' ? 'bg-white dark:bg-gray-700 text-red-600 shadow-sm' : 'text-gray-400'}`}>
          <ShieldAlert size={14} strokeWidth={3} /> Debt
        </button>
        <button onClick={() => setMode('savings')} className={`flex-1 shrink-0 py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'savings' ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-sm' : 'text-gray-400'}`}>
          <Target size={14} strokeWidth={3} /> Save
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 pb-10 scroll-smooth">
        {mode === 'expense' ? renderExpenseSteps() : mode === 'debt' ? renderDebt() : mode === 'money' ? renderIncome() : renderSavings()}
      </div>
    </div>
  );
};

export default AddExpense;
