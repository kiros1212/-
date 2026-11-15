import React, { useState } from 'react';
import { 
  Hash, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare,
  ChevronDown,
  ChevronRight,
  User,
  Shield,
  GraduationCap
} from 'lucide-react';

export default function TicketSidebar({
  tickets,
  selectedTicket,
  onSelectTicket,
  onOpenNewTicket,
  currentUser,
  isOpenMobile,
  onCloseMobile
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openSections, setOpenSections] = useState({
    open: true,
    in_progress: true,
    resolved: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Filter tickets
  const filteredTickets = (tickets || []).filter(t => {
    const query = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(query) ||
      t.ticketNumber.toLowerCase().includes(query) ||
      t.studentName.toLowerCase().includes(query) ||
      (t.departmentName && t.departmentName.toLowerCase().includes(query)) ||
      (t.assignedToName && t.assignedToName.toLowerCase().includes(query))
    );
  });

  const openList = filteredTickets.filter(t => t.status === 'open');
  const inProgressList = filteredTickets.filter(t => t.status === 'in_progress');
  const resolvedList = filteredTickets.filter(t => t.status === 'resolved' || t.status === 'closed');

  const getPriorityBadge = (priority) => {
    if (priority === 'urgent') return <span className="w-2 h-2 rounded-full bg-rose-500" title="عاجل" />;
    if (priority === 'high') return <span className="w-2 h-2 rounded-full bg-amber-400" title="هام" />;
    return <span className="w-2 h-2 rounded-full bg-emerald-400" title="عادي" />;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 right-0 z-40
        w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-[calc(100vh-4rem)]
        transition-transform duration-300 ease-in-out
        ${isOpenMobile ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        {/* Top Header & Search */}
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <MessageSquare size={16} className="text-emerald-400" />
              <span>قوائم التذاكر والمحادثات</span>
            </div>
            <span className="text-[11px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-semibold border border-slate-700">
              {filteredTickets.length} تذكرة
            </span>
          </div>

          {/* New Ticket Button for Students */}
          {currentUser?.role === 'student' && (
            <button
              onClick={() => {
                onOpenNewTicket();
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-semibold py-2 px-3 rounded-xl shadow-sm text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Plus size={15} />
              <span>فتح تذكرة استفسار جديدة</span>
            </button>
          )}

          {/* Search Bar */}
          <div className="relative">
            <Search size={14} className="absolute right-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث بالموضوع أو رقم التذكرة..."
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Tickets Channel List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          
          {/* Section: Open Tickets */}
          <div>
            <button
              onClick={() => toggleSection('open')}
              className="w-full flex items-center justify-between text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 tracking-wide"
            >
              <span className="flex items-center gap-2">
                {openSections.open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                <span>تذاكر بانتظار الرد</span>
              </span>
              <span className="text-[10px] bg-slate-800 text-amber-300 px-1.5 py-0.2 rounded font-mono font-bold">
                {openList.length}
              </span>
            </button>

            {openSections.open && (
              <div className="mt-1 space-y-1">
                {openList.length === 0 ? (
                  <p className="text-[11px] text-slate-600 px-6 py-2">لا توجد تذاكر جديدة</p>
                ) : (
                  openList.map(ticket => (
                    <TicketItem
                      key={ticket.id}
                      ticket={ticket}
                      isSelected={selectedTicket?.id === ticket.id}
                      currentUser={currentUser}
                      onSelect={() => {
                        onSelectTicket(ticket);
                        if (onCloseMobile) onCloseMobile();
                      }}
                      getPriorityBadge={getPriorityBadge}
                    />
                  ))
                )}
              </div>
            )}
          </div>

          {/* Section: In Progress */}
          <div>
            <button
              onClick={() => toggleSection('in_progress')}
              className="w-full flex items-center justify-between text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 tracking-wide"
            >
              <span className="flex items-center gap-2">
                {openSections.in_progress ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                <span>قيد المتابعة والمعالجة</span>
              </span>
              <span className="text-[10px] bg-slate-800 text-blue-300 px-1.5 py-0.2 rounded font-mono font-bold">
                {inProgressList.length}
              </span>
            </button>

            {openSections.in_progress && (
              <div className="mt-1 space-y-1">
                {inProgressList.length === 0 ? (
                  <p className="text-[11px] text-slate-600 px-6 py-2">لا توجد تذاكر قيد المعالجة</p>
                ) : (
                  inProgressList.map(ticket => (
                    <TicketItem
                      key={ticket.id}
                      ticket={ticket}
                      isSelected={selectedTicket?.id === ticket.id}
                      currentUser={currentUser}
                      onSelect={() => {
                        onSelectTicket(ticket);
                        if (onCloseMobile) onCloseMobile();
                      }}
                      getPriorityBadge={getPriorityBadge}
                    />
                  ))
                )}
              </div>
            )}
          </div>

          {/* Section: Resolved / Closed */}
          <div>
            <button
              onClick={() => toggleSection('resolved')}
              className="w-full flex items-center justify-between text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 tracking-wide"
            >
              <span className="flex items-center gap-2">
                {openSections.resolved ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                <span>التذاكر المكتملة والمغلقة</span>
              </span>
              <span className="text-[10px] bg-slate-800 text-emerald-300 px-1.5 py-0.2 rounded font-mono font-bold">
                {resolvedList.length}
              </span>
            </button>

            {openSections.resolved && (
              <div className="mt-1 space-y-1">
                {resolvedList.length === 0 ? (
                  <p className="text-[11px] text-slate-600 px-6 py-2">لا توجد تذاكر مغلقة</p>
                ) : (
                  resolvedList.map(ticket => (
                    <TicketItem
                      key={ticket.id}
                      ticket={ticket}
                      isSelected={selectedTicket?.id === ticket.id}
                      currentUser={currentUser}
                      onSelect={() => {
                        onSelectTicket(ticket);
                        if (onCloseMobile) onCloseMobile();
                      }}
                      getPriorityBadge={getPriorityBadge}
                    />
                  ))
                )}
              </div>
            )}
          </div>

        </div>
      </aside>
    </>
  );
}

function TicketItem({ ticket, isSelected, currentUser, onSelect, getPriorityBadge }) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-right p-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
        isSelected
          ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
          : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
      }`}
    >
      <div className="shrink-0 mt-0.5">
        <Hash size={15} className={isSelected ? 'text-emerald-400' : 'text-slate-500'} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <span className="text-[11px] font-mono font-semibold text-slate-400 truncate">
            {ticket.ticketNumber}
          </span>
          <div className="flex items-center gap-1.5">
            {getPriorityBadge(ticket.priority)}
          </div>
        </div>

        <div className="text-xs font-semibold text-white truncate leading-snug">
          {ticket.title}
        </div>

        <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
          <span className="truncate max-w-[120px]">
            {currentUser?.role === 'student' ? ticket.assignedToName : ticket.studentName}
          </span>
          <span className="text-[9px] text-slate-500">
            {new Date(ticket.createdAt).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>
    </button>
  );
}
