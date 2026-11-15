import React from 'react';
import { 
  Building2, 
  UserCheck, 
  ShieldCheck, 
  MessageSquare, 
  GraduationCap, 
  ExternalLink,
  Phone,
  Mail
} from 'lucide-react';

export default function DepartmentsView({ departments, staffList, onOpenTicketForStaff }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center sm:text-right space-y-1">
          <h2 className="text-2xl font-black text-white flex items-center justify-center sm:justify-start gap-2.5">
            <Building2 className="text-emerald-400" size={26} />
            <span>أقسام كلية الإمام الكاظم (ع) والكادر المسؤول</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            يمكنك الاطلاع على الأقسام والجهات الإدارية والتواصل المباشر مع رئيس القسم أو معاون العميد
          </p>
        </div>

        {/* Administration Section */}
        <div>
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <ShieldCheck size={16} />
            <span>العمادة والمعاونيات والشعب الإدارية</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.filter(d => d.type === 'administration').map(dept => {
              const headStaff = staffList.find(s => s.departmentId === dept.id);
              return (
                <div
                  key={dept.id}
                  className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 p-5 rounded-3xl transition-all shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded-2xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <ShieldCheck size={20} />
                      </div>
                      <span className="text-[10px] bg-slate-800 text-amber-400 font-bold px-2 py-0.5 rounded-full">
                        جهة إدارية
                      </span>
                    </div>

                    <div>
                      <h4 className="font-black text-sm text-white">{dept.name}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {dept.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 text-xs">
                      <span className="text-slate-500 block text-[10px]">المسؤول المباشر:</span>
                      <span className="font-bold text-amber-300">{dept.headOfDepartment}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-2">
                    <button
                      onClick={() => onOpenTicketForStaff(dept.id, headStaff?.id)}
                      className="w-full bg-slate-800 hover:bg-emerald-600 hover:text-white text-emerald-400 text-xs font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 border border-slate-700"
                    >
                      <MessageSquare size={13} />
                      <span>فتح تذكرة مباشرة مع المعاون</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Academic Departments Section */}
        <div>
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <GraduationCap size={16} />
            <span>الأقسام العلمية والأكاديمية</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.filter(d => d.type === 'academic').map(dept => {
              const headStaff = staffList.find(s => s.departmentId === dept.id);
              return (
                <div
                  key={dept.id}
                  className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 p-5 rounded-3xl transition-all shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <GraduationCap size={20} />
                      </div>
                      <span className="text-[10px] bg-slate-800 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                        قسم أكاديمي
                      </span>
                    </div>

                    <div>
                      <h4 className="font-black text-sm text-white">{dept.name}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {dept.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 text-xs">
                      <span className="text-slate-500 block text-[10px]">رئيس القسم:</span>
                      <span className="font-bold text-emerald-300">{dept.headOfDepartment}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-2">
                    <button
                      onClick={() => onOpenTicketForStaff(dept.id, headStaff?.id)}
                      className="w-full bg-slate-800 hover:bg-emerald-600 hover:text-white text-emerald-400 text-xs font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 border border-slate-700"
                    >
                      <MessageSquare size={13} />
                      <span>تذكرة استفسار مع رئيس القسم</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
