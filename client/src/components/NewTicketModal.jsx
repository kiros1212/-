import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Paperclip, 
  AlertCircle, 
  Building2, 
  UserCheck, 
  Tag, 
  CheckCircle2,
  FileText
} from 'lucide-react';

export default function NewTicketModal({ 
  onClose, 
  onSubmitSuccess, 
  currentUser, 
  departments, 
  staffList 
}) {
  const [departmentId, setDepartmentId] = useState('admin-student-affairs');
  const [assignedToId, setAssignedToId] = useState('');
  const [category, setCategory] = useState('طلب استضافة ونقل');
  const [priority, setPriority] = useState('normal');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Pre-filter staff based on selected department or list all
  const filteredStaff = (staffList || []).filter(s => !departmentId || s.departmentId === departmentId);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachment(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim()) {
      setError('يرجى كتابة عنوان المشكلة وتفاصيل الاستفسار');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('studentId', currentUser.id);
      formData.append('departmentId', departmentId);
      if (assignedToId) formData.append('assignedToId', assignedToId);
      formData.append('category', category);
      formData.append('priority', priority);
      formData.append('title', title);
      formData.append('description', description);
      if (attachment) {
        formData.append('attachment', attachment);
      }

      const res = await fetch('/api/tickets', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشل فتح التذكرة');

      onSubmitSuccess(data.ticket);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl p-6 text-slate-100 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              فتح تذكرة استفسار جديدة
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              سيتم إنشاء غرفة تواصل رسمية ومباشرة بينك وبين الكادر المسؤول لمتابعة طلبك
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Choose Destination: Department / Dean Assistant */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Building2 size={13} className="text-emerald-400" />
                الجهة المعنية / القسم
              </label>
              <select
                value={departmentId}
                onChange={(e) => {
                  setDepartmentId(e.target.value);
                  setAssignedToId('');
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {departments?.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <UserCheck size={13} className="text-amber-400" />
                توجيه إلى شخص محدد
              </label>
              <select
                value={assignedToId}
                onChange={(e) => setAssignedToId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="">تلقائي (رئيس القسم / المعاون المسؤول)</option>
                {filteredStaff?.map(st => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.title})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Tag size={13} className="text-emerald-400" />
              تصنيف الاستفسار
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="طلب استضافة ونقل">طلب استضافة ونقل</option>
              <option value="استفسار أكاديمي وامتحانات">استفسار أكاديمي وامتحانات</option>
              <option value="شعبة التسجيل والوثائق">شعبة التسجيل والوثائق</option>
              <option value="الحسابات والأقساط الدراسية">الحسابات والأقساط الدراسية</option>
              <option value="شكوى أو مقترح رسمي">شكوى أو مقترح رسمي</option>
              <option value="أخرى">أخرى</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              عنوان التذكرة / الموضوع باختصار
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: استفسار بخصوص تأكيد صحة صدور وثيقة الإعدادية"
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              تفاصيل الرسالة والاستفسار
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب تفاصيل طلبك بدقة لمساعدة الكادر في الرد الوافي والسرعة بالإنجاز..."
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
            />
          </div>

          {/* Attachment upload */}
          <div className="flex items-center gap-3">
            <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 transition-colors flex items-center gap-2">
              <Paperclip size={14} className="text-emerald-400" />
              <span>إرفاق ملف / صورة (اختياري)</span>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {fileName && (
              <span className="text-xs text-emerald-400 font-mono truncate max-w-[200px] flex items-center gap-1">
                <FileText size={12} />
                {fileName}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? 'جاري إنشاء التذكرة...' : 'إنشاء التذكرة الآن'}
              <Send size={14} />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
