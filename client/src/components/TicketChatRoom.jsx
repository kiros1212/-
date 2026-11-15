import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Paperclip, 
  CheckCircle, 
  CheckCircle2, 
  RotateCcw, 
  User, 
  Clock, 
  ShieldCheck, 
  Building2, 
  Tag, 
  Hash, 
  FileText, 
  ExternalLink,
  GraduationCap,
  ArrowRight,
  ChevronDown,
  MessageSquare,
  Plus,
  Trash2
} from 'lucide-react';

export default function TicketChatRoom({
  ticket,
  currentUser,
  socket,
  onStatusChange,
  onBackToHome,
  onDeleteTicket,
  studentTickets,
  onSelectTicket,
  onOpenNewTicket
}) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [ticketDropdownOpen, setTicketDropdownOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fetch ticket messages on load
  useEffect(() => {
    if (!ticket) return;

    setLoading(true);
    fetch(`/api/tickets/${ticket.id}`)
      .then(res => res.json())
      .then(data => {
        setMessages(data.messages || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    // Socket: Join ticket room
    if (socket) {
      socket.emit('join_ticket', ticket.id);

      const handleNewMessage = (msg) => {
        if (msg.ticketId === ticket.id) {
          setMessages(prev => [...prev, msg]);
        }
      };

      const handleUserTyping = ({ userName, isTyping: typingStatus }) => {
        if (typingStatus) {
          setTypingUser(userName);
        } else {
          setTypingUser('');
        }
      };

      const handleStatusUpdated = (updatedTicket) => {
        if (updatedTicket.id === ticket.id && onStatusChange) {
          onStatusChange(updatedTicket);
        }
      };

      socket.on('new_message', handleNewMessage);
      socket.on('user_typing', handleUserTyping);
      socket.on('ticket_status_updated', handleStatusUpdated);

      return () => {
        socket.emit('leave_ticket', ticket.id);
        socket.off('new_message', handleNewMessage);
        socket.off('user_typing', handleUserTyping);
        socket.off('ticket_status_updated', handleStatusUpdated);
      };
    }
  }, [ticket?.id, socket]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);

    if (socket && ticket) {
      socket.emit('typing', {
        ticketId: ticket.id,
        userName: currentUser.name,
        isTyping: true
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing', {
          ticketId: ticket.id,
          userName: currentUser.name,
          isTyping: false
        });
      }, 1500);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachment(file);
      setFileName(file.name);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() && !attachment) return;

    try {
      const formData = new FormData();
      formData.append('senderId', currentUser.id);
      formData.append('senderName', currentUser.name);
      formData.append('senderRole', currentUser.role);
      formData.append('text', inputText.trim());
      if (attachment) {
        formData.append('attachment', attachment);
      }

      setInputText('');
      setAttachment(null);
      setFileName('');
      if (fileInputRef.current) fileInputRef.current.value = '';

      await fetch(`/api/tickets/${ticket.id}/messages`, {
        method: 'POST',
        body: formData
      });
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      const res = await fetch(`/api/tickets/${ticket.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          closedBy: `${currentUser.title || ''} ${currentUser.name}`.trim()
        })
      });
      const data = await res.json();
      if (onStatusChange) onStatusChange(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTicket = async () => {
    if (!ticket) return;
    const confirmMsg = `هل أنت متأكد من حذف التذكرة #${ticket.ticketNumber} نهائياً؟ سيتم مسح التذكرة وكافة الرسائل المتعلقة بها.`;
    if (!window.confirm(confirmMsg)) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/tickets/${ticket.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        if (onDeleteTicket) {
          onDeleteTicket(ticket.id);
        }
        if (currentUser?.role === 'student' && onBackToHome) {
          onBackToHome();
        }
      } else {
        const data = await res.json();
        alert(data.error || 'فشل حذف التذكرة');
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء محاولة حذف التذكرة');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return (
          <span className="bg-amber-950/70 text-amber-300 border border-amber-800/60 text-xs px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5">
            <Clock size={12} /> مفتوحة (بانتظار الرد)
          </span>
        );
      case 'in_progress':
        return (
          <span className="bg-blue-950/70 text-blue-300 border border-blue-800/60 text-xs px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5">
            <Clock size={12} /> قيد المتابعة والمعالجة
          </span>
        );
      case 'resolved':
      case 'closed':
        return (
          <span className="bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 text-xs px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5">
            <CheckCircle2 size={12} /> تم الحل والإغلاق
          </span>
        );
      default:
        return null;
    }
  };

  if (!ticket) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-slate-400 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 mb-4 shadow-sm">
          <MessageSquare size={26} />
        </div>
        <h3 className="text-base font-bold text-white mb-1">
          {currentUser?.role === 'student' ? 'لا توجد محادثة محددة حالياً' : 'اختر تذكرة للبدء في المحادثة'}
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mb-5 leading-relaxed">
          {currentUser?.role === 'student' 
            ? 'يمكنك الرجوع للصفحة الرئيسية لمتابعة إحدى تذاكرك السابقة، أو فتح تذكرة استفسار جديدة مع الكادر الأكاديمي.'
            : 'يمكنك اختيار إحدى التذاكر من القائمة الجانبية لمتابعة الردود.'}
        </p>
        {currentUser?.role === 'student' && (
          <div className="flex items-center gap-3">
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
              >
                العودة للرئيسية
              </button>
            )}
            {onOpenNewTicket && (
              <button
                onClick={onOpenNewTicket}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Plus size={14} />
                <span>فتح تذكرة جديدة</span>
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  const isClosed = ticket.status === 'resolved' || ticket.status === 'closed';

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-slate-950 overflow-hidden">
      
      {/* Ticket Room Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm z-10">
        <div className="flex items-center gap-3">
          {currentUser?.role === 'student' && onBackToHome && (
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl border border-slate-700 transition-all shrink-0"
              title="العودة للصفحة الرئيسية"
            >
              <ArrowRight size={15} />
              <span className="hidden sm:inline">الرئيسية</span>
            </button>
          )}

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono font-bold text-xs bg-slate-800 text-emerald-400 px-2 py-0.5 rounded-md border border-slate-700">
                #{ticket.ticketNumber}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white">
                {ticket.title}
              </h2>
              {getStatusBadge(ticket.status)}
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
              <span className="flex items-center gap-1 text-slate-300">
                <GraduationCap size={13} className="text-emerald-400" />
                الطالب: <strong className="text-white font-medium">{ticket.studentName}</strong> (هوية: {ticket.studentNumber})
              </span>
              <span className="flex items-center gap-1">
                <Building2 size={13} className="text-slate-400" />
                الجهة: <span className="text-slate-300">{ticket.departmentName}</span>
              </span>
              <span className="flex items-center gap-1">
                <User size={13} className="text-blue-400" />
                المسؤول: <span className="text-slate-300">{ticket.assignedToName}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Action Items: Student Ticket Switcher OR Staff Resolve Controls */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Ticket Switcher for Student with Multiple Tickets */}
          {currentUser?.role === 'student' && studentTickets && studentTickets.length > 1 && (
            <div className="relative">
              <button
                onClick={() => setTicketDropdownOpen(!ticketDropdownOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 transition-all"
              >
                <span>تبديل التذكرة ({studentTickets.length})</span>
                <ChevronDown size={13} />
              </button>
              {ticketDropdownOpen && (
                <div className="absolute left-0 sm:right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-xl p-2 z-50 text-right">
                  <div className="text-[11px] font-bold text-slate-400 px-2 py-1 border-b border-slate-800 mb-1">
                    تذاكري واستفساراتي الخاصة:
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {studentTickets.map(t => (
                      <button
                        key={t.id}
                        onClick={() => {
                          onSelectTicket(t);
                          setTicketDropdownOpen(false);
                        }}
                        className={`w-full text-right p-2 rounded-lg text-xs transition-colors flex flex-col gap-0.5 ${
                          t.id === ticket.id ? 'bg-slate-800 text-emerald-400 font-bold border border-slate-700' : 'text-slate-300 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-mono text-slate-400">#{t.ticketNumber}</span>
                          <span className="text-slate-400">
                            {t.status === 'open' ? 'بانتظار الرد' : t.status === 'in_progress' ? 'قيد المعالجة' : 'مكتملة'}
                          </span>
                        </div>
                        <span className="truncate text-white font-medium">{t.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons for Staff / Admin */}
          {(currentUser?.role === 'staff' || currentUser?.role === 'admin') && (
            <>
              {!isClosed ? (
                <button
                  onClick={() => handleUpdateStatus('resolved')}
                  className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle size={14} />
                  <span>حل وإغلاق التذكرة</span>
                </button>
              ) : (
                <button
                  onClick={() => handleUpdateStatus('open')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw size={14} />
                  <span>إعادة فتح التذكرة</span>
                </button>
              )}
            </>
          )}

          {/* Delete Ticket Button (Available for the student who owns the ticket OR staff / admin) */}
          {(currentUser?.id === ticket.studentId || currentUser?.role === 'staff' || currentUser?.role === 'admin') && (
            <button
              onClick={handleDeleteTicket}
              disabled={isDeleting}
              className="bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800/60 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
              title="حذف هذه التذكرة نهائياً"
            >
              <Trash2 size={13} className="text-rose-400" />
              <span>{isDeleting ? 'جاري الحذف...' : 'حذف التذكرة'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages Timeline (Chat Room) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-40 text-slate-500 text-xs">
            جاري تحميل الرسائل...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-slate-500 text-xs py-8">
            لا توجد رسائل سابقة في هذه التذكرة
          </div>
        ) : (
          messages.map(msg => {
            const isMe = msg.senderId === currentUser.id;
            const isStaff = msg.senderRole === 'staff' || msg.senderRole === 'admin';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isMe ? 'mr-auto flex-row-reverse' : 'ml-auto'}`}
              >
                {/* Avatar */}
                <div className="shrink-0 mt-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm border ${
                    isStaff 
                      ? 'bg-amber-950/80 text-amber-300 border-amber-800/60' 
                      : 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
                  }`}>
                    {isStaff ? <ShieldCheck size={16} /> : <GraduationCap size={16} />}
                  </div>
                </div>

                {/* Bubble */}
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%]`}>
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-xs font-bold text-white">
                      {msg.senderName}
                    </span>
                    {isStaff && (
                      <span className="bg-amber-950/80 text-amber-300 text-[10px] px-2 py-0.2 rounded-md font-semibold border border-amber-800/60">
                        كادر الكلية
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400">
                      {new Date(msg.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                    isMe
                      ? 'bg-emerald-800 text-white rounded-tr-none'
                      : isStaff
                        ? 'bg-slate-800 text-slate-100 border border-slate-700 rounded-tl-none'
                        : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Attachment preview */}
                    {msg.attachment && (
                      <div className="mt-3 pt-2.5 border-t border-white/10">
                        {msg.attachment.match(/\.(jpeg|jpg|gif|png|svg)$/i) ? (
                          <a 
                            href={msg.attachment} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block group"
                          >
                            <img
                              src={msg.attachment}
                              alt="مرفق"
                              className="max-h-56 rounded-xl border border-white/10 object-contain bg-slate-900"
                            />
                            <span className="text-[10px] text-emerald-300 mt-1 flex items-center gap-1 group-hover:underline">
                              <ExternalLink size={11} /> عرض الصورة المرفقة
                            </span>
                          </a>
                        ) : (
                          <a
                            href={msg.attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs font-semibold text-emerald-300 hover:underline bg-slate-900/60 p-2 rounded-xl border border-white/10"
                          >
                            <FileText size={15} />
                            <span>تحميل الملف المرفق</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Live Typing Indicator */}
        {typingUser && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800 w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{typingUser} يكتب الآن...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Message Composer */}
      {isClosed ? (
        <div className="p-4 bg-slate-900 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5 font-medium">
            <CheckCircle2 size={16} className="text-emerald-400" />
            تم إغلاق هذه التذكرة من قِبل {ticket.closedBy || 'الإدارة'} لحل الاستفسار بنجاح.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800">
          {fileName && (
            <div className="mb-2 px-3 py-1.5 bg-slate-800 rounded-xl text-xs text-emerald-400 flex items-center justify-between border border-slate-700">
              <span className="truncate flex items-center gap-1">
                <FileText size={13} />
                {fileName}
              </span>
              <button
                type="button"
                onClick={() => {
                  setAttachment(null);
                  setFileName('');
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="text-rose-400 hover:text-rose-300 text-xs font-semibold"
              >
                إزالة
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              title="إرفاق ملف أو صورة"
            >
              <Paperclip size={18} />
            </button>

            <textarea
              rows={1}
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder={`الرد في تذكرة #${ticket.ticketNumber}... (اضغط Enter للإرسال)`}
              className="flex-1 bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none max-h-32"
            />

            <button
              type="submit"
              disabled={!inputText.trim() && !attachment}
              className="bg-emerald-700 hover:bg-emerald-600 text-white p-2.5 rounded-xl transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              title="إرسال الرسالة"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
