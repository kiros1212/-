import React, { useState } from 'react';
import { 
  GraduationCap, 
  UserCheck, 
  LogOut, 
  ShieldCheck, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  Menu,
  ChevronDown,
  Building2,
  Calendar,
  IdCard,
  BookOpen,
  Palette,
  Plus
} from 'lucide-react';

export default function Navbar({ 
  currentUser, 
  onLogout, 
  onSwitchUser, 
  allUsers, 
  activeTab, 
  setActiveTab, 
  onOpenNewTicket,
  pendingVerificationsCount,
  onToggleMobileSidebar,
  onOpenThemeModal,
  currentTheme
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getRoleBadge = (role, category) => {
    if (role === 'admin') {
      return (
        <span className="bg-purple-950/80 text-purple-300 border border-purple-800/60 text-[11px] px-2.5 py-0.5 rounded-md font-semibold flex items-center gap-1">
          <ShieldCheck size={12} /> مدير النظام
        </span>
      );
    }
    if (role === 'staff') {
      if (category === 'assistant_dean') {
        return (
          <span className="bg-amber-950/80 text-amber-300 border border-amber-800/60 text-[11px] px-2.5 py-0.5 rounded-md font-semibold flex items-center gap-1">
            معاون العميد
          </span>
        );
      }
      return (
        <span className="bg-blue-950/80 text-blue-300 border border-blue-800/60 text-[11px] px-2.5 py-0.5 rounded-md font-semibold flex items-center gap-1">
          كادر تدريسي
        </span>
      );
    }
    return (
      <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 text-[11px] px-2.5 py-0.5 rounded-md font-semibold flex items-center gap-1">
        <GraduationCap size={12} /> طالب
      </span>
    );
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & University Identity */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {currentUser?.role !== 'student' && activeTab === 'tickets' && (
              <button 
                onClick={onToggleMobileSidebar}
                className="md:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors shrink-0"
                title="قائمة التذاكر"
              >
                <Menu size={18} />
              </button>
            )}

            <div 
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none shrink-0" 
              onClick={() => setActiveTab(currentUser?.role === 'student' ? 'home' : 'tickets')}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-800 border border-emerald-700/60 flex items-center justify-center shadow-inner shrink-0">
                <GraduationCap className="text-white" size={20} />
              </div>
              <div className="leading-tight">
                <h1 className="text-xs sm:text-base font-bold text-white tracking-normal whitespace-nowrap">
                  جامعة الإمام الكاظم (ع)
                </h1>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-normal hidden sm:block">
                  منصة خدمة وتذاكر الطلبة
                </p>
              </div>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-800/70 p-1 rounded-xl border border-slate-700/60">
            {currentUser?.role === 'student' && (
              <button
                onClick={() => setActiveTab('home')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'home' 
                    ? 'bg-emerald-700 text-white shadow-sm' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Building2 size={14} />
                الرئيسية
              </button>
            )}

            <button
              onClick={() => setActiveTab('tickets')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'tickets' 
                  ? 'bg-emerald-700 text-white shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <MessageSquare size={14} />
              {currentUser?.role === 'student' ? 'تذاكري واستفساراتي' : 'غرف التذاكر'}
            </button>

            {(currentUser?.role === 'admin' || currentUser?.role === 'staff') && (
              <button
                onClick={() => setActiveTab('admin_verifications')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                  activeTab === 'admin_verifications' 
                    ? 'bg-emerald-700 text-white shadow-sm' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <UserCheck size={14} />
                توثيق هويات الطلبة
                {pendingVerificationsCount > 0 && (
                  <span className="bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {pendingVerificationsCount}
                  </span>
                )}
              </button>
            )}
          </nav>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Theme Switcher Button */}
            <button
              onClick={onOpenThemeModal}
              className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm group shrink-0"
              title="تخصيص مظهر الموقع"
            >
              <Palette size={15} className="text-purple-400 group-hover:rotate-12 transition-transform" />
              <span className="hidden md:inline">المظهر</span>
              <span className={`w-2 h-2 rounded-full ${
                currentTheme === 'space-night' ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]' :
                currentTheme === 'pure-light' ? 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]' :
                currentTheme === 'velvet-black' ? 'bg-zinc-400' :
                currentTheme === 'warm-paper' ? 'bg-amber-600 shadow-[0_0_8px_rgba(217,119,6,0.8)]' :
                'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
              }`} />
            </button>

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 p-1.5 sm:px-3 sm:py-1.5 rounded-xl transition-all"
                >
                  <img 
                    src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`} 
                    alt={currentUser.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-600 bg-slate-700 object-cover shrink-0"
                  />
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-semibold text-white leading-tight">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      {currentUser.role === 'student' 
                        ? `هوية: ${currentUser.studentIdNumber || '—'}` 
                        : (currentUser.title || 'كادر الكلية')}
                    </div>
                  </div>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute left-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-xl p-3 z-50 text-right">
                    <div className="p-3 bg-slate-800/50 rounded-xl mb-2 border border-slate-700/60">
                      <div className="font-bold text-sm text-white">{currentUser.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5 font-mono truncate">
                        {currentUser.email || currentUser.identifier}
                      </div>
                      
                      <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                        {getRoleBadge(currentUser.role, currentUser.staffCategory)}
                        {currentUser.role === 'student' && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${
                            currentUser.verificationStatus === 'verified'
                              ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60'
                              : 'bg-amber-950/70 text-amber-300 border-amber-800/60'
                          }`}>
                            {currentUser.verificationStatus === 'verified' ? 'هوية موثقة رسمياً ✓' : 'قيد التدقيق والاعتماد'}
                          </span>
                        )}
                      </div>

                      {/* Registration Date */}
                      <div className="mt-3 pt-2.5 border-t border-slate-700 text-[11px] text-slate-300 flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Calendar size={12} /> تاريخ التسجيل:
                        </span>
                        <span className="font-medium text-slate-200">
                          {currentUser.registeredAt 
                            ? new Date(currentUser.registeredAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' }) 
                            : '١٤ نوفمبر ٢٠٢٦'}
                        </span>
                      </div>
                    </div>

                    {/* Theme Option in Dropdown */}
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenThemeModal();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 rounded-xl transition-all border border-slate-700/60 mb-2"
                    >
                      <div className="flex items-center gap-2">
                        <Palette size={14} className="text-purple-400" />
                        <span>تخصيص مظهر الموقع</span>
                      </div>
                      <span className="text-[10px] text-purple-300 bg-purple-950/80 border border-purple-800/60 px-1.5 py-0.5 rounded-md">
                        ثيمات
                      </span>
                    </button>

                    {/* Logout Button */}
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-900/40 rounded-xl transition-all border border-rose-900/40"
                    >
                      <LogOut size={14} />
                      <span>تسجيل الخروج من الحساب</span>
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </div>

        </div>
      </div>

      {/* Mobile Bottom Navigation Bar for Smart Phones */}
      {currentUser && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-3 py-2 flex items-center justify-around shadow-2xl select-none">
          {currentUser.role === 'student' && (
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                activeTab === 'home'
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 size={18} />
              <span className="text-[10px]">الرئيسية</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('tickets')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              activeTab === 'tickets'
                ? 'text-emerald-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare size={18} />
            <span className="text-[10px]">{currentUser.role === 'student' ? 'تذاكري' : 'التذاكر'}</span>
          </button>

          {/* Quick Action Center: فتح تذكرة جديدة */}
          {currentUser.role === 'student' && (
            <button
              onClick={onOpenNewTicket}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white rounded-xl shadow-md text-xs font-bold transition-all -translate-y-1"
            >
              <Plus size={16} />
              <span>تذكرة جديدة</span>
            </button>
          )}

          {(currentUser.role === 'admin' || currentUser.role === 'staff') && (
            <button
              onClick={() => setActiveTab('admin_verifications')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all relative ${
                activeTab === 'admin_verifications'
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck size={18} />
              <span className="text-[10px]">توثيق الهويات</span>
              {pendingVerificationsCount > 0 && (
                <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-amber-500"></span>
              )}
            </button>
          )}

          <button
            onClick={onOpenThemeModal}
            className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-slate-400 hover:text-slate-200 transition-all"
          >
            <Palette size={18} className="text-purple-400" />
            <span className="text-[10px]">المظهر</span>
          </button>
        </div>
      )}
    </header>
  );
}
