import React from 'react';
import { 
  GraduationCap, 
  Plus, 
  MessageSquare, 
  Building2, 
  ShieldCheck, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  ArrowLeft,
  Users,
  FileText,
  CreditCard,
  HelpCircle,
  AlertCircle,
  CheckCircle,
  Calendar
} from 'lucide-react';

export default function StudentHomeView({ 
  currentUser, 
  onOpenNewTicket, 
  tickets, 
  onSelectTicket, 
  onGoToTickets 
}) {
  const studentTickets = tickets || [];
  const openCount = studentTickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;
  const resolvedCount = studentTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* ================= 1. Official Academic Student Card ================= */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-emerald-800 border border-emerald-700/60 flex items-center justify-center shrink-0 shadow-inner">
                <GraduationCap className="text-white" size={32} />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2.5 py-0.5 rounded-md">
                    بوابة خدمة الطلبة الرسمية
                  </span>
                  <span className="text-xs text-slate-400">
                    جامعة الإمام الكاظم (ع) للعلوم الإسلامية الجامعة
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-normal">
                  أهلاً بك، {currentUser?.name || 'عزيزي الطالب'}
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  منصتك الرسمية للتواصل المباشر والآمن مع عمادة الكلية، معاونية شؤون الطلبة، ورؤساء الأقسام الأكاديمية لحل معاملاتك واستفساراتك بنظام التذاكر المباشرة.
                </p>
              </div>
            </div>

            {/* Quick Student Academic Badges */}
            <div className="w-full md:w-auto flex md:flex-col gap-2 pt-3 md:pt-0 border-t md:border-t-0 md:border-r border-slate-800 md:pr-6 shrink-0 text-xs">
              <div className="bg-slate-800/70 border border-slate-700/60 rounded-lg px-3 py-1.5 text-right">
                <span className="text-[10px] text-slate-400 block font-medium">رقم الهوية الجامعية:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {currentUser?.studentIdNumber || '202410123'}
                </span>
              </div>

              <div className="bg-slate-800/70 border border-slate-700/60 rounded-lg px-3 py-1.5 text-right">
                <span className="text-[10px] text-slate-400 block font-medium">القسم الأكاديمي:</span>
                <span className="font-semibold text-slate-200 truncate block max-w-[170px]">
                  {currentUser?.departmentName || 'قسم هندسة تقنيات الحاسوب'}
                </span>
              </div>

              <div className="bg-slate-800/70 border border-slate-700/60 rounded-lg px-3 py-1.5 text-right">
                <span className="text-[10px] text-slate-400 block font-medium">حالة الحساب:</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  {currentUser?.verificationStatus === 'verified' ? 'موثق رسمياً' : 'قيد التدقيق'}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* ================= 2. Action Card: فتح تذكرة جديدة ================= */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1 text-center sm:text-right">
            <h3 className="text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <MessageSquare className="text-emerald-400" size={18} />
              <span>هل لديك استفسار أو معاملة أكاديمية؟</span>
            </h3>
            <p className="text-xs text-slate-300">
              افتح تذكرة جديدة لتوجيه طلبك إلى الجهة المعنية ومتابعة الردود مع الكادر في غرفة خاصة.
            </p>
          </div>

          <button
            onClick={onOpenNewTicket}
            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>فتح تذكرة جديدة</span>
          </button>
        </div>

        {/* ================= 3. Academic Service Categories (Replaced AI fluff with Real Student Services) ================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Building2 className="text-emerald-400" size={17} />
              <span>الخدمات والمعاملات الطلابية المتاحة</span>
            </h2>
            <span className="text-xs text-slate-400">
              اختر الخدمة لتقديم استفسار مباشر
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Service 1: Student Affairs */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-slate-700 transition-all shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
                  <Users size={20} />
                </div>
                <h3 className="font-bold text-sm text-white">شؤون الطلبة والتسجيل</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  معاملات الاستضافة والنقل بين الكليات، طلبات إصدار وثائق التخرج وتأييدات الاستمرار، وتدقيق ملفات القبول.
                </p>
              </div>

              <button
                onClick={onOpenNewTicket}
                className="w-full text-center text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-slate-800/80 hover:bg-slate-800 py-2 rounded-lg border border-slate-700/60 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>تقديم طلب لشؤون الطلبة</span>
                <ArrowLeft size={13} />
              </button>
            </div>

            {/* Service 2: Academic Affairs & Faculty */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-slate-700 transition-all shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400">
                  <BookOpen size={20} />
                </div>
                <h3 className="font-bold text-sm text-white">القسم العلمي والمناهج</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  متابعة الجداول الأسبوعية، استفسارات المقررات والمشاريع، التنسيق مع الأساتذة، ومراجعة نتائج الامتحانات.
                </p>
              </div>

              <button
                onClick={onOpenNewTicket}
                className="w-full text-center text-xs font-semibold text-blue-400 hover:text-blue-300 bg-slate-800/80 hover:bg-slate-800 py-2 rounded-lg border border-slate-700/60 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>تواصل مع رئاسة القسم</span>
                <ArrowLeft size={13} />
              </button>
            </div>

            {/* Service 3: Finance & Accounts */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-slate-700 transition-all shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
                  <CreditCard size={20} />
                </div>
                <h3 className="font-bold text-sm text-white">الشعبة المالية والأقساط</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  الاستفسار عن دفعات الأقساط الدراسية المسائية، براءات الذمة المالية، استلام وصولات القبض، وتسهيلات السداد.
                </p>
              </div>

              <button
                onClick={onOpenNewTicket}
                className="w-full text-center text-xs font-semibold text-amber-400 hover:text-amber-300 bg-slate-800/80 hover:bg-slate-800 py-2 rounded-lg border border-slate-700/60 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>استفسار مالي أو قسط</span>
                <ArrowLeft size={13} />
              </button>
            </div>

          </div>
        </div>

        {/* ================= 4. Student's Recent Tickets ================= */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Clock className="text-emerald-400" size={17} />
              <span>تذاكري واستفساراتي السابقة ({studentTickets.length})</span>
            </h2>
            {studentTickets.length > 0 && (
              <button
                onClick={onGoToTickets}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition-colors"
              >
                <span>عرض جميع المحادثات</span>
                <ArrowLeft size={13} />
              </button>
            )}
          </div>

          {studentTickets.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 mx-auto">
                <MessageSquare size={22} />
              </div>
              <h3 className="text-sm font-bold text-white">لا توجد لديك تذاكر استفسار سابقة</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                إذا كان لديك أي سؤال حول الجداول، الوثائق، أو الاستضافات، اضغط على زر "فتح تذكرة جديدة" أعلاه وسيتم الرد عليك من قبل الكادر الأكاديمي.
              </p>
              <button
                onClick={onOpenNewTicket}
                className="mt-2 inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors shadow-sm"
              >
                <Plus size={14} />
                <span>فتح أول تذكرة الآن</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {studentTickets.slice(0, 4).map(ticket => (
                <div
                  key={ticket.id}
                  onClick={() => onSelectTicket(ticket)}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-xl cursor-pointer transition-all shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                        #{ticket.ticketNumber}
                      </span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                        ticket.status === 'open'
                          ? 'bg-amber-950/70 text-amber-300 border-amber-800/60'
                          : ticket.status === 'in_progress'
                            ? 'bg-blue-950/70 text-blue-300 border-blue-800/60'
                            : 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60'
                      }`}>
                        {ticket.status === 'open' ? 'بانتظار الرد' : ticket.status === 'in_progress' ? 'قيد المتابعة' : 'تم الحل والإغلاق'}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white line-clamp-1">
                      {ticket.title}
                    </h4>

                    <div className="text-xs text-slate-400 flex items-center justify-between">
                      <span className="truncate">
                        الجهة: {ticket.departmentName}
                      </span>
                      <span className="text-slate-400 shrink-0">
                        المسؤول: {ticket.assignedToName}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar size={12} />
                      {new Date(ticket.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      متابعة المحادثة <ArrowLeft size={12} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= 5. Official College Notice Box ================= */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-400">
          <AlertCircle size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5 leading-relaxed">
            <span className="font-bold text-slate-300 block">إرشادات وضوابط الاستخدام الرسمية:</span>
            <p>
              يتم استلام والرد على تذاكر واستفسارات الطلبة من قبل المعاونين ورؤساء الأقسام خلال أوقات الدوام الرسمي الأكاديمي. يرجى إرفاق الوثائق الداعمة للطلب لضمان سرعة الإنجاز.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
