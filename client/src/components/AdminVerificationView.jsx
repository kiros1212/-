import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  UserCheck, 
  ShieldCheck, 
  Image as ImageIcon, 
  ExternalLink,
  GraduationCap
} from 'lucide-react';

export default function AdminVerificationView() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, verified, rejected
  const [search, setSearch] = useState('');

  const fetchStudents = () => {
    setLoading(true);
    fetch('/api/admin/students')
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        if (data.length > 0 && !selectedStudent) {
          setSelectedStudent(data[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleUpdateStatus = async (studentId, status) => {
    try {
      const res = await fetch(`/api/admin/verify-student/${studentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      // Update local state
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, verificationStatus: status } : s));
      if (selectedStudent?.id === studentId) {
        setSelectedStudent(prev => ({ ...prev, verificationStatus: status }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredStudents = students.filter(s => {
    if (filter !== 'all' && s.verificationStatus !== filter) return false;
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      (s.studentIdNumber && s.studentIdNumber.includes(q)) ||
      (s.departmentName && s.departmentName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-4rem)] bg-slate-950 overflow-hidden">
      
      {/* List Sidebar */}
      <div className="w-full md:w-96 bg-slate-900 border-l border-slate-800 flex flex-col h-full">
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <UserCheck size={18} className="text-emerald-400" />
              <span>مراجعة وتدقيق هويات الطلبة</span>
            </h3>
            <span className="text-xs bg-slate-800 text-amber-400 px-2 py-0.5 rounded-full font-bold">
              {students.filter(s => s.verificationStatus === 'pending').length} بانتظار الاعتماد
            </span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute right-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث بالاسم أو رقم الهوية..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 text-[11px] font-bold">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filter === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              الكل ({students.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filter === 'pending' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              قيد التدقيق ({students.filter(s => s.verificationStatus === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('verified')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filter === 'verified' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              المعتمدة ({students.filter(s => s.verificationStatus === 'verified').length})
            </button>
          </div>
        </div>

        {/* Students List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {loading ? (
            <div className="text-center text-xs text-slate-500 py-6">جاري التحميل...</div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center text-xs text-slate-500 py-6">لا يوجد طلبة مطابقين للبحث</div>
          ) : (
            filteredStudents.map(student => (
              <button
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                className={`w-full text-right p-3 rounded-2xl transition-all border ${
                  selectedStudent?.id === student.id
                    ? 'bg-slate-800 border-emerald-500/50 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/40 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white truncate">{student.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    student.verificationStatus === 'verified'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                      : student.verificationStatus === 'pending'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800/40 animate-pulse'
                        : 'bg-rose-950 text-rose-400 border border-rose-800/40'
                  }`}>
                    {student.verificationStatus === 'verified' ? 'معتمدة ✓' : student.verificationStatus === 'pending' ? 'تدقيق' : 'مرفوضة'}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
                  <span>هوية: {student.studentIdNumber}</span>
                  <span className="text-[10px] text-emerald-400 font-sans">{student.stage}</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1 truncate">
                  {student.departmentName}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Detail & ID Card Inspection View */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col justify-between">
        {selectedStudent ? (
          <div className="max-w-2xl mx-auto w-full space-y-6">
            
            {/* Header info */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <img
                src={selectedStudent.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedStudent.name}`}
                alt={selectedStudent.name}
                className="w-20 h-20 rounded-2xl border-2 border-emerald-500/40 bg-slate-800 object-cover shadow-lg"
              />
              <div className="flex-1 text-center sm:text-right space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-xl font-black text-white">{selectedStudent.name}</h2>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    selectedStudent.verificationStatus === 'verified'
                      ? 'bg-emerald-900/60 text-emerald-300'
                      : 'bg-amber-900/60 text-amber-300'
                  }`}>
                    {selectedStudent.verificationStatus === 'verified' ? 'حساب موثق رسمياً' : 'بانتظار تدقيق الهوية'}
                  </span>
                </div>
                
                <p className="text-xs text-slate-400">
                  {selectedStudent.departmentName} - {selectedStudent.stage} ({selectedStudent.studyType})
                </p>

                <div className="pt-2 flex items-center justify-center sm:justify-start gap-4 text-xs font-mono text-slate-300">
                  <span>رقم الهوية: <strong className="text-amber-400">{selectedStudent.studentIdNumber}</strong></span>
                  <span>الهاتف: {selectedStudent.phone || 'غير مسجل'}</span>
                </div>
              </div>
            </div>

            {/* ID Card Display */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <ImageIcon size={16} className="text-emerald-400" />
                  <span>صورة هوية الطالب المرفوعة للتوثيق</span>
                </h4>
                {selectedStudent.idCardImage && (
                  <a
                    href={selectedStudent.idCardImage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    <ExternalLink size={13} />
                    فتح في نافذة جديدة
                  </a>
                )}
              </div>

              {selectedStudent.idCardImage ? (
                <div className="border border-slate-700 rounded-2xl overflow-hidden bg-slate-950 p-2 flex items-center justify-center">
                  <img
                    src={selectedStudent.idCardImage}
                    alt="هوية الطالب"
                    className="max-h-80 w-auto rounded-xl object-contain shadow-2xl"
                  />
                </div>
              ) : (
                <div className="bg-slate-800/40 border border-dashed border-slate-700 rounded-2xl p-8 text-center text-slate-500 text-xs">
                  لم يقم الطالب برفع صورة الهوية بعد (تسجيل مباشر أو قيد الانتظار).
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  onClick={() => handleUpdateStatus(selectedStudent.id, 'rejected')}
                  className="bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/60 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-colors"
                >
                  <XCircle size={16} />
                  <span>رفض الهوية وإشعار الطالب</span>
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedStudent.id, 'verified')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-colors"
                >
                  <CheckCircle size={16} />
                  <span>اعتماد وتوثيق الحساب رسمياً</span>
                </button>
              </div>

            </div>

          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500 text-xs">
            اختر طالباً من القائمة لمراجعة هويته
          </div>
        )}
      </div>

    </div>
  );
}
