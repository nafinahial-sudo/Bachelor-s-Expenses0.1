
import React, { useState } from 'react';
import { UserAccount } from '../types';
import { Mail, Phone, Lock, ChevronRight, Smartphone, ShieldCheck, AlertCircle, UserPlus, LogIn, ShieldHalf, Eye, EyeOff } from 'lucide-react';

interface AuthProps {
  onLogin: (account: UserAccount) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [isRegistering, setIsRegistering] = useState(true); // Default to registration for first-time feel
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) return;
    if (isRegistering && password !== confirmPassword) {
      setError('Passwords do not match, Bhai.');
      return;
    }

    setLoading(true);
    // Simulate API call for login/register
    setTimeout(() => {
      onLogin({
        uid: Math.random().toString(36).substr(2, 9),
        email,
        isLoggedIn: true,
        lastSynced: new Date().toISOString()
      });
      setLoading(false);
    }, 1500);
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 11) return;
    setLoading(true);
    // Simulate OTP sending
    setTimeout(() => {
      setStep(2);
      setLoading(false);
    }, 1200);
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) return;
    setLoading(true);
    // Simulate verification
    setTimeout(() => {
      onLogin({
        uid: Math.random().toString(36).substr(2, 9),
        phone,
        isLoggedIn: true,
        lastSynced: new Date().toISOString()
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="h-screen max-w-md mx-auto bg-white dark:bg-gray-900 flex flex-col p-8 transition-colors overflow-y-auto">
      <div className="mt-8 mb-8">
        <div className="flex items-center gap-2 mb-2">
           <ShieldHalf className="text-indigo-600" size={24} strokeWidth={3} />
           <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Safe & Encrypted</span>
        </div>
        <h1 className="text-4xl font-black text-indigo-600 tracking-tight">Bachelor's</h1>
        <h2 className="text-4xl font-black text-gray-800 dark:text-gray-100 tracking-tight">Expenses</h2>
        <div className="w-12 h-2 bg-indigo-600 mt-3 rounded-full"></div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 font-medium leading-relaxed">
          {isRegistering 
            ? "Create an account to protect your data forever. We respect your privacy."
            : "Welcome back! Your history and survival plans are waiting."}
        </p>
      </div>

      <div className="flex-1 space-y-6">
        {step === 1 ? (
          <>
            <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
              <button 
                onClick={() => setMethod('email')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${method === 'email' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-400'}`}
              >
                Email
              </button>
              <button 
                onClick={() => setMethod('phone')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${method === 'phone' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-400'}`}
              >
                Phone
              </button>
            </div>

            {method === 'email' ? (
              <form onSubmit={handleEmailAuth} className="space-y-4 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nafi@example.com"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold transition-all text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {isRegistering && (
                  <div className="space-y-2 animate-in slide-in-from-top duration-300">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Confirm Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold transition-all text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                )}

                {error && <p className="text-xs text-red-500 font-bold flex items-center gap-1"><AlertCircle size={12} /> {error}</p>}

                <div className="pt-2">
                  <button 
                    disabled={loading || !email || !password || (isRegistering && !confirmPassword)}
                    className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : (isRegistering ? 'Create Account' : 'Access Account')} 
                    {isRegistering ? <UserPlus size={20} strokeWidth={3} /> : <LogIn size={20} strokeWidth={3} />}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePhoneSubmit} className="space-y-4 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mobile Number</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01711223344"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold transition-all text-sm"
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <button 
                    disabled={loading || phone.length < 11}
                    className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP'} <Smartphone size={20} strokeWidth={3} />
                  </button>
                </div>
              </form>
            )}

            <div className="text-center pt-2">
              <button 
                onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
                className="text-xs font-bold text-gray-500 hover:text-indigo-600 transition-colors"
              >
                {isRegistering ? "Already have an account? Log in" : "New here? Create an account"}
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleOtpVerify} className="space-y-8 animate-in slide-in-from-right duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-black text-gray-800 dark:text-white">Verify Phone</h3>
              <p className="text-xs text-gray-400 mt-2">Enter the 4-digit code sent to {phone}</p>
            </div>
            
            <div className="space-y-2">
              <input 
                type="text"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="0000"
                className="w-full text-center text-4xl font-black py-6 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-3xl outline-none focus:ring-4 focus:ring-indigo-500/20 tracking-[1em]"
                autoFocus
              />
            </div>

            <div className="space-y-4">
              <button 
                disabled={loading || otp.length < 4}
                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>
              <button 
                type="button"
                onClick={() => { setStep(1); setOtp(''); }}
                className="w-full py-2 text-xs font-bold text-gray-400 hover:text-indigo-600 transition-colors"
              >
                Change Phone Number?
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="mt-auto py-6">
        <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl flex items-start gap-3 border border-indigo-100/50 dark:border-indigo-800/30">
          <ShieldCheck size={18} className="text-indigo-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed uppercase tracking-tight">
            <span className="font-black text-indigo-600 dark:text-indigo-400 block mb-1">Your Privacy Promise</span>
            Your data is private, encrypted, and never sold. Even if you logout or delete the app, your history is safe in the cloud.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
