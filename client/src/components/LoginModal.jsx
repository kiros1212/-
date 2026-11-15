import React, { useState } from 'react';
import { 
  GraduationCap, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Mail, 
  Lock, 
  Phone, 
  Eye, 
  EyeOff, 
  FileBadge, 
  ArrowLeft,
  User
} from 'lucide-react';

export default function LoginModal({ onLogin, onRegister }) {
  // Tabs: 'register' (إنشاء حساب), 'student_login' (تسجيل الدخول), 'staff_login' (الكادر والإدارة)
  const [activeMode, setActiveMode] = useState('student_login');
  
  // Login State
  const [identifier, setIdentifier] = useState('kirossan12@gmail.com');
  const [password, setPassword] = useState('s123@123#123');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Registration State - Exact requested mandatory fields
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regName, setRegName] = useState(''); // الاسم الثلاثي الحقيقي (إجباري)
  const [regDept, setRegDept] = useState('dep-cs');
  const [idCardFile, setIdCardFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [regError, setRegError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIdCardFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setRegError('');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier,
          password,
          role: activeMode === 'student_login' ? 'student' : undefined
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشل تسجيل الدخول');
      onLogin(data.user);
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError('');

    // 1. الاسم الثلاثي الحقيقي (إجباري)
    if (!regName.trim()) {
      setRegError('يرجى إدخال الاسم الثلاثي الحقيقي للطالب');
      return;
    }
    // 2. الجيميل
    if (!regEmail.trim()) {
      setRegError('يرجى إدخال الجيميل (البريد الإلكتروني)');
      return;
    }
    // 3. كلمة المرور
    if (!regPassword.trim()) {
      setRegError('يرجى إدخال كلمة المرور');
      return;
    }
    // 4. رقم الهاتف
    if (!regPhone.trim()) {
      setRegError('يرجى إدخال رقم الهاتف');
      return;
    }
    // 5. صورة الهوية الجامعية (إجبارية)
    if (!idCardFile) {
      setRegError('⚠️ صورة الهوية الجامعية إجبارية لإتمام عملية التسجيل والتوثيق');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', regName.trim());
      formData.append('email', regEmail.trim());
      formData.append('password', regPassword);
      formData.append('phone', regPhone.trim());
      formData.append('departmentId', regDept);
      formData.append('idCardImage', idCardFile);

      const res = await fetch('/api/auth/register-student', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشل تسجيل الحساب');
      onRegister(data.user);
    } catch (err) {
      setRegError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-[#080b11] text-slate-100 overflow-hidden font-cairo">
      
      {/* ================= LEFT SIDE: Form Container ================= */}
      <div className="w-full lg:w-[48%] xl:w-[44%] h-full flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-y-auto bg-[#090d16] border-r border-slate-800/80 z-20">
        
        {/* Top Brand Area (Clean, authentic institutional styling - no generic AI gradients) */}
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 border border-emerald-600/40 flex items-center justify-center shadow-sm shrink-0">
              <GraduationCap className="text-white" size={22} />
            </div>
            <h1 className="text-base sm:text-lg font-black text-white tracking-normal">
              جامعة الإمام الكاظم (ع)
            </h1>
          </div>
        </div>

        {/* Center Main Form */}
        <div className="my-auto py-6 max-w-md w-full mx-auto">
          
          {/* Headline */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {activeMode === 'register' 
                ? 'إنشاء حساب جديد' 
                : activeMode === 'staff_login' 
                  ? 'دخول الكادر الأكاديمي' 
                  : 'تسجيل الدخول'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
              {activeMode === 'register' 
                ? 'أدخل بياناتك الجامعية وصورة الهوية لإنشاء الحساب' 
                : 'أهلاً بك مجدداً في المنصة الرسمية.'}
            </p>
          </div>

          {/* Mode Switcher Tabs (Exact requested order: 1. إنشاء حساب | 2. تسجيل الدخول | 3. الكادر والإدارة) */}
          <div className="grid grid-cols-3 gap-1 bg-[#121826] p-1 rounded-xl border border-slate-800 mb-6 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveMode('register')}
              className={`py-2 rounded-lg transition-all ${
                activeMode === 'register'
                  ? 'bg-white text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              إنشاء حساب
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveMode('student_login');
                setIdentifier('kirossan12@gmail.com');
                setPassword('s123@123#123');
              }}
              className={`py-2 rounded-lg transition-all ${
                activeMode === 'student_login'
                  ? 'bg-white text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              تسجيل الدخول
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveMode('staff_login');
                setIdentifier('kiros6503@gmail.com');
                setPassword('s123@123#123');
              }}
              className={`py-2 rounded-lg transition-all ${
                activeMode === 'staff_login'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              الكادر والإدارة
            </button>
          </div>

          {/* ============= Tab 1: إنشاء حساب (Register) ============= */}
          {activeMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {regError && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0 text-rose-400" />
                  <span>{regError}</span>
                </div>
              )}

              {/* اسمك الثلاثي */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                  <User size={13} className="text-amber-400" />
                  اسمك الثلاثي <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="اسمك الثلاثي"
                  className="w-full bg-[#121826] border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* 1. الجيميل */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                  <Mail size={13} className="text-emerald-400" />
                  الجيميل (البريد الإلكتروني) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="student@gmail.com"
                  className="w-full bg-[#121826] border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              {/* 2. كلمة المرور */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                  <Lock size={13} className="text-amber-400" />
                  كلمة المرور <span className="text-rose-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#121826] border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* 3. رقم الهاتف */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                  <Phone size={13} className="text-emerald-400" />
                  رقم الهاتف <span className="text-rose-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder=""
                  className="w-full bg-[#121826] border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              {/* القسم العلمي */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">القسم العلمي</label>
                <select
                  value={regDept}
                  onChange={(e) => setRegDept(e.target.value)}
                  className="w-full bg-[#121826] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="dep-cs">قسم هندسة تقنيات الحاسوب</option>
                  <option value="dep-law">قسم القانون</option>
                  <option value="dep-finance">قسم العلوم المالية والمصرفية</option>
                  <option value="dep-english">قسم اللغة الإنجليزية وآدابها</option>
                  <option value="dep-media">قسم الإعلام والصحافة</option>
                </select>
              </div>

              {/* 4. صورة الهوية الجامعية (إجبارية) */}
              <div className="p-3 bg-[#121826] rounded-xl border border-dashed border-amber-500/50">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <FileBadge size={14} className="text-amber-400" />
                    صورة الهوية الجامعية (إجبارية) <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[10px] text-amber-400 font-bold">مطلوبة للتوثيق</span>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-2 text-center text-xs font-bold text-white transition-colors flex items-center justify-center gap-2">
                    <Upload size={14} className="text-amber-400" />
                    <span>{idCardFile ? 'تغيير صورة الهوية' : 'رفع صورة الهوية'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="معاينة"
                      className="w-12 h-12 rounded-lg object-cover border border-amber-400 shadow"
                    />
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white hover:bg-slate-100 text-slate-950 font-black py-3 rounded-xl shadow-lg transition-all text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {isSubmitting ? 'جاري إرسال البيانات...' : 'إنشاء الحساب وتوثيق الهوية'}
                <CheckCircle size={15} />
              </button>
            </form>
          )}

          {/* ============= Tab 2: تسجيل الدخول (Student Login) ============= */}
          {activeMode === 'student_login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0 text-rose-400" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  الجيميل (أو رقم الهوية الجامعية)
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="student@gmail.com أو 202410123"
                  className="w-full bg-[#121826] border border-slate-700/80 hover:border-slate-600 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-all font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    كلمة المرور
                  </label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('يرجى مراجعة شعبة التسجيل وشؤون الطلبة لإعادة تعيين كلمة المرور'); }} className="text-[11px] text-slate-400 hover:text-amber-400 transition-colors">
                    نسيت كلمة المرور؟
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#121826] border border-slate-700/80 hover:border-slate-600 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-3 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white hover:bg-slate-100 text-slate-950 font-black py-3 rounded-xl shadow-lg transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {isSubmitting ? 'جاري التحقق...' : 'تسجيل الدخول'}
                <ArrowLeft size={16} />
              </button>

              <div className="text-center text-xs text-slate-400 pt-2">
                ليس لديك حساب بعد؟{' '}
                <button
                  type="button"
                  onClick={() => setActiveMode('register')}
                  className="text-amber-400 hover:underline font-bold"
                >
                  إنشاء حساب جديد
                </button>
              </div>
            </form>
          )}

          {/* ============= Tab 3: الكادر والإدارة (Staff Login) ============= */}
          {activeMode === 'staff_login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0 text-rose-400" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  البريد الأكاديمي أو الجيميل المعتمد
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="kiros6503@gmail.com"
                  className="w-full bg-[#121826] border border-slate-700/80 hover:border-slate-600 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#121826] border border-slate-700/80 hover:border-slate-600 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-3 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black py-3 rounded-xl shadow-lg transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {isSubmitting ? 'جاري التحقق...' : 'دخول لوحة الكادر الأكاديمي'}
                <ArrowLeft size={16} />
              </button>
            </form>
          )}

        </div>

        {/* Bottom Footer */}
        <div className="text-[11px] text-slate-500 flex items-center justify-between pt-4 border-t border-slate-800/60">
          <span>جامعة الإمام الكاظم (ع) © 2026</span>
          <span className="text-slate-400">بوابة تواصل الطلبة والكادر</span>
        </div>

      </div>

      {/* ================= RIGHT SIDE: Hanging Gardens of Babylon Hero (Clean & Unobstructed) ================= */}
      <div className="hidden lg:flex flex-1 relative h-full flex-col justify-end p-12 xl:p-16 overflow-hidden">
        
        {/* Background Image: Pure Hanging Gardens of Babylon without distracting floating icons */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-95 contrast-105 scale-100"
          style={{
            backgroundImage: `url('/images/babylon_hanging_gardens.png')`,
          }}
        />

        {/* Elegant Subtle Dark Gradient Overlays for bottom readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080b11] via-[#080b11]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090d16] via-transparent to-transparent" />

        {/* Bottom Headline & Quote */}
        <div className="relative z-10 space-y-2.5 max-w-xl text-right">
          <div className="inline-block bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full text-[11px] font-bold text-amber-300 mb-1 backdrop-blur-md">
            منارة العلم وأصالة التاريخ
          </div>
          <h2 className="text-3xl xl:text-4xl font-black text-white leading-tight tracking-tight drop-shadow-lg">
            من مهد أول حرف في التاريخ... نبني مستقبل التعليم الجامعي.
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium drop-shadow-md">
            كلية الإمام الكاظم (ع) للعلوم الإسلامية الجامعة — منظومة متكاملة لخدمة الطلبة وتسهيل تواصلهم المباشر مع الهيئة التدريسية وإدارة الكلية.
          </p>
        </div>

      </div>

    </div>
  );
}
