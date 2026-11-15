import React from 'react';
import { X, Check, Palette, Sparkles, RotateCcw } from 'lucide-react';

export const THEMES = [
  {
    id: 'space-night',
    name: 'ليلي بنفسجي',
    description: 'الداكن البنفسجي الأصلي',
    baseBg: 'bg-[#120e29]',
    baseBorder: 'border-[#2d2358]',
    dotColor: 'bg-purple-600',
    dotShadow: 'shadow-[0_0_10px_rgba(147,51,234,0.6)]',
  },
  {
    id: 'pure-light',
    name: 'نور صافي',
    description: 'أبيض هادئ وواضح',
    baseBg: 'bg-white',
    baseBorder: 'border-slate-300',
    dotColor: 'bg-purple-600',
    dotShadow: 'shadow-[0_0_8px_rgba(147,51,234,0.4)]',
  },
  {
    id: 'velvet-black',
    name: 'أسود مخملي',
    description: 'أسود أخف وأقل زرقة',
    baseBg: 'bg-[#0e0e11]',
    baseBorder: 'border-[#27272a]',
    dotColor: 'bg-purple-400',
    dotShadow: 'shadow-[0_0_8px_rgba(192,132,252,0.5)]',
  },
  {
    id: 'warm-paper',
    name: 'رملي',
    description: 'بيج مريح للعين',
    baseBg: 'bg-[#f4ece1]',
    baseBorder: 'border-[#ded4c3]',
    dotColor: 'bg-[#96562c]',
    dotShadow: 'shadow-[0_0_8px_rgba(150,86,44,0.4)]',
  },
];

export default function ThemeModal({ isOpen, onClose, currentTheme, onSelectTheme }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl bg-[#131127] border border-[#2e265c] rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] text-right select-none"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Top Header: Title & Close Button */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="text-purple-400 font-bold text-xs sm:text-sm tracking-wide">
              تخصيص سريع
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              مظهر الموقع
            </h2>
            <p className="text-xs sm:text-sm text-[#9f9abf] mt-1.5 leading-relaxed">
              اختر المظهر الأنسب لك. سيُحفظ اختيارك على هذا الجهاز تلقائيًا.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-[#1d1938] hover:bg-[#28224c] border border-[#382f64] text-slate-300 hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-inner"
            title="إغلاق"
          >
            <X size={18} />
          </button>
        </div>

        {/* 2x2 Grid of Main Visual Themes matching the reference exactly */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {THEMES.map((theme) => {
            const isSelected = currentTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => onSelectTheme(theme.id)}
                className={`relative flex items-center justify-between p-4 rounded-2xl transition-all text-right border ${
                  isSelected
                    ? 'bg-[#1d173d] border-purple-500 shadow-[0_0_22px_rgba(168,85,247,0.25)] ring-1 ring-purple-500/50'
                    : 'bg-[#161230] border-[#2a2354] hover:bg-[#1c173b] hover:border-purple-400/40'
                }`}
              >
                {/* Right side: Radio check & Text */}
                <div className="flex items-center gap-3">
                  <div 
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isSelected 
                        ? 'bg-purple-600 text-white shadow-sm' 
                        : 'border-2 border-[#453c7a] bg-transparent'
                    }`}
                  >
                    {isSelected && <Check size={14} className="stroke-[3]" />}
                  </div>

                  <div>
                    <div className="font-bold text-sm sm:text-base text-white">
                      {theme.name}
                    </div>
                    <div className="text-[11px] sm:text-xs text-[#9d97bf] mt-0.5">
                      {theme.description}
                    </div>
                  </div>
                </div>

                {/* Left side: Visual Palette Pill */}
                <div 
                  className={`w-14 h-9 sm:w-16 sm:h-10 rounded-2xl flex items-center justify-center border shadow-inner shrink-0 ${theme.baseBg} ${theme.baseBorder}`}
                >
                  <span className={`w-5 h-4 sm:w-6 sm:h-4.5 rounded-lg ${theme.dotColor} ${theme.dotShadow}`}></span>
                </div>
              </button>
            );
          })}
        </div>

        {/* University Default Theme Option */}
        <div className="mt-4 pt-4 border-t border-[#251e4a] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => onSelectTheme('default')}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all border text-right ${
              currentTheme === 'default'
                ? 'bg-[#0f2420] border-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/50'
                : 'bg-[#15122e] border-[#292252] hover:bg-[#1a1638] hover:border-emerald-500/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  currentTheme === 'default' 
                    ? 'bg-emerald-600 text-white' 
                    : 'border-2 border-[#453c7a] bg-transparent'
                }`}
              >
                {currentTheme === 'default' && <Check size={14} className="stroke-[3]" />}
              </div>
              <div>
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <span>الافتراضي الأكاديمي</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded-full font-medium">
                    الأصلي للجامعة
                  </span>
                </div>
                <div className="text-[11px] text-[#9d97bf] mt-0.5">
                  الوضع الكحلي والزمردي الكلاسيكي
                </div>
              </div>
            </div>

            <div className="w-14 h-9 sm:w-16 sm:h-10 rounded-2xl flex items-center justify-center border border-slate-700 bg-slate-900 shrink-0">
              <span className="w-5 h-4 sm:w-6 sm:h-4.5 rounded-lg bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            </div>
          </button>
        </div>

        {/* Footer info & instant reset */}
        {currentTheme !== 'default' && (
          <div className="mt-3 text-center">
            <button
              onClick={() => onSelectTheme('default')}
              className="inline-flex items-center gap-1.5 text-xs text-purple-300 hover:text-white transition-colors"
            >
              <RotateCcw size={13} />
              <span>إعادة ضبط المظهر إلى الافتراضي الطبيعي</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
