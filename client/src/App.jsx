import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Navbar from './components/Navbar';
import TicketSidebar from './components/TicketSidebar';
import TicketChatRoom from './components/TicketChatRoom';
import NewTicketModal from './components/NewTicketModal';
import LoginModal from './components/LoginModal';
import AdminVerificationView from './components/AdminVerificationView';
import StudentHomeView from './components/StudentHomeView';
import ThemeModal from './components/ThemeModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [socket, setSocket] = useState(null);
  
  // UI Tabs & Modals ('home', 'tickets', 'admin_verifications')
  const [activeTab, setActiveTab] = useState('home');
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [pendingVerificationsCount, setPendingVerificationsCount] = useState(0);

  // Appearance Theme state (saved in localStorage)
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('alkadhim_theme') || 'default';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('alkadhim_theme', currentTheme);
  }, [currentTheme]);

  // Initialize Socket.io
  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  // Fetch departments & initial users
  useEffect(() => {
    fetch('/api/departments')
      .then(res => res.json())
      .then(data => {
        setDepartments(data.departments || []);
        setStaffList(data.staff || []);
      })
      .catch(console.error);

    fetch('/api/admin/students')
      .then(res => res.json())
      .then(students => {
        fetch('/api/departments')
          .then(r => r.json())
          .then(d => {
            const combined = [
              {
                id: "usr-admin-1",
                role: "admin",
                name: "إدارة النظام الرئيسية",
                identifier: "admin@alkadhim.edu.iq",
                title: "مدير النظام والتوثيق"
              },
              ...(d.staff || []),
              ...students
            ];
            setAllUsers(combined);
            const pending = students.filter(s => s.verificationStatus === 'pending').length;
            setPendingVerificationsCount(pending);

            // Default user if none logged in, sync with server data
            const saved = localStorage.getItem('alkadhim_user');
            if (saved) {
              try {
                const parsed = JSON.parse(saved);
                const matched = combined.find(u => u.id === parsed.id || (parsed.email && u.email === parsed.email));
                if (matched) {
                  setCurrentUser(matched);
                  localStorage.setItem('alkadhim_user', JSON.stringify(matched));
                } else {
                  setCurrentUser(parsed);
                }
              } catch (e) {
                setCurrentUser(students[0] || combined[0]);
              }
            } else {
              setCurrentUser(students[0] || combined[0]);
            }
          });
      })
      .catch(console.error);
  }, []);

  // Fetch tickets whenever currentUser changes
  const fetchTickets = (user) => {
    const u = user || currentUser;
    if (!u) return;

    fetch(`/api/tickets?userId=${u.id}&role=${u.role}`)
      .then(res => res.json())
      .then(data => {
        setTickets(data);
        if (data.length > 0) {
          setSelectedTicket(prev => {
            if (prev) {
              const found = data.find(t => t.id === prev.id);
              return found || data[0];
            }
            return data[0];
          });
        } else {
          setSelectedTicket(null);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('alkadhim_user', JSON.stringify(currentUser));
      fetchTickets(currentUser);
    }
  }, [currentUser]);

  // Listen for socket events
  useEffect(() => {
    if (!socket) return;

    const handleNewTicket = (newTicket) => {
      if (
        currentUser?.role === 'admin' ||
        currentUser?.role === 'staff' ||
        newTicket.studentId === currentUser?.id
      ) {
        setTickets(prev => [newTicket, ...prev.filter(t => t.id !== newTicket.id)]);
      }
    };

    const handleGlobalTicketUpdate = (updatedTicket) => {
      setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
      if (selectedTicket?.id === updatedTicket.id) {
        setSelectedTicket(updatedTicket);
      }
    };

    const handleTicketDeleted = (deletedTicketId) => {
      setTickets(prev => prev.filter(t => t.id !== deletedTicketId));
      setSelectedTicket(prev => {
        if (prev?.id === deletedTicketId) {
          return null;
        }
        return prev;
      });
    };

    socket.on('new_ticket_created', handleNewTicket);
    socket.on('ticket_updated_global', handleGlobalTicketUpdate);
    socket.on('ticket_deleted', handleTicketDeleted);

    return () => {
      socket.off('new_ticket_created', handleNewTicket);
      socket.off('ticket_updated_global', handleGlobalTicketUpdate);
      socket.off('ticket_deleted', handleTicketDeleted);
    };
  }, [socket, currentUser, selectedTicket]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsLoginOpen(false);
    if (user.role === 'student') {
      setActiveTab('home');
    } else {
      setActiveTab('tickets');
    }
  };

  const handleRegister = (user) => {
    setCurrentUser(user);
    setIsLoginOpen(false);
    setActiveTab('home');
    fetch('/api/admin/students')
      .then(res => res.json())
      .then(students => {
        const pending = students.filter(s => s.verificationStatus === 'pending').length;
        setPendingVerificationsCount(pending);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('alkadhim_user');
    setCurrentUser(null);
    setIsLoginOpen(true);
  };

  const handleSwitchUser = (user) => {
    setCurrentUser(user);
    if (user.role === 'student') {
      setActiveTab('home');
    } else {
      setActiveTab('tickets');
    }
  };

  const handleOpenTicketSuccess = (newTicket) => {
    setTickets(prev => [newTicket, ...prev.filter(t => t.id !== newTicket.id)]);
    setSelectedTicket(newTicket);
    setActiveTab('tickets');
  };

  const handleDeleteTicketSuccess = (deletedTicketId) => {
    setTickets(prev => prev.filter(t => t.id !== deletedTicketId));
    setSelectedTicket(prev => {
      if (prev?.id === deletedTicketId) {
        const remaining = tickets.filter(t => t.id !== deletedTicketId);
        return remaining.length > 0 ? remaining[0] : null;
      }
      return prev;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-cairo antialiased">
      
      {/* Official University Header */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onSwitchUser={handleSwitchUser}
        allUsers={allUsers}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewTicket={() => setIsNewTicketOpen(true)}
        pendingVerificationsCount={pendingVerificationsCount}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        currentTheme={currentTheme}
      />

      {/* Main Content Body */}
      <main className="flex-1 flex overflow-hidden relative">
        {activeTab === 'home' && currentUser?.role === 'student' && (
          <StudentHomeView
            currentUser={currentUser}
            onOpenNewTicket={() => setIsNewTicketOpen(true)}
            tickets={tickets}
            onSelectTicket={(ticket) => {
              setSelectedTicket(ticket);
              setActiveTab('tickets');
            }}
            onGoToTickets={() => setActiveTab('tickets')}
          />
        )}

        {activeTab === 'tickets' && (
          <>
            {/* Ticket Sidebar for Staff & Admin Only */}
            {currentUser?.role !== 'student' && (
              <TicketSidebar
                tickets={tickets}
                selectedTicket={selectedTicket}
                onSelectTicket={(ticket) => setSelectedTicket(ticket)}
                onOpenNewTicket={() => setIsNewTicketOpen(true)}
                currentUser={currentUser}
                isOpenMobile={isMobileSidebarOpen}
                onCloseMobile={() => setIsMobileSidebarOpen(false)}
              />
            )}

            {/* Clean Full-Width Chat Room for Student */}
            <TicketChatRoom
              ticket={selectedTicket}
              currentUser={currentUser}
              socket={socket}
              onBackToHome={() => setActiveTab('home')}
              onStatusChange={(updated) => {
                setTickets(prev => prev.map(t => t.id === updated.id ? updated : t));
                setSelectedTicket(updated);
              }}
              onDeleteTicket={handleDeleteTicketSuccess}
              studentTickets={currentUser?.role === 'student' ? tickets : []}
              onSelectTicket={(ticket) => setSelectedTicket(ticket)}
              onOpenNewTicket={() => setIsNewTicketOpen(true)}
            />
          </>
        )}

        {activeTab === 'admin_verifications' && (
          <AdminVerificationView />
        )}
      </main>

      {/* New Ticket Modal */}
      {isNewTicketOpen && currentUser && (
        <NewTicketModal
          onClose={() => setIsNewTicketOpen(false)}
          onSubmitSuccess={handleOpenTicketSuccess}
          currentUser={currentUser}
          departments={departments}
          staffList={staffList}
        />
      )}

      {/* Login / Register Modal */}
      {(!currentUser || isLoginOpen) && (
        <LoginModal
          onLogin={handleLogin}
          onRegister={handleRegister}
          demoUsers={allUsers}
        />
      )}

      {/* Quick Theme Customization Modal */}
      <ThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={currentTheme}
        onSelectTheme={(newTheme) => setCurrentTheme(newTheme)}
      />

    </div>
  );
}
