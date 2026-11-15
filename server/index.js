const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH']
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Storage helper functions
const DATA_DIR = path.join(__dirname, 'data');
const readFile = (filename) => {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    return [];
  }
};

const writeFile = (filename, data) => {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// Configure Multer for File Uploads (ID Card & Ticket Attachments)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// ================= API ROUTES =================

// 1. Departments & Faculty List
app.get('/api/departments', (req, res) => {
  const departments = readFile('departments.json');
  const users = readFile('users.json');
  const staff = users.filter(u => u.role === 'staff').map(u => ({
    id: u.id,
    name: u.name,
    title: u.title,
    staffCategory: u.staffCategory,
    departmentId: u.departmentId,
    avatar: u.avatar
  }));
  res.json({ departments, staff });
});

// 2. Authentication
// Login for Students (by Email, Student ID, or Identifier) or Staff
app.post('/api/auth/login', (req, res) => {
  const { identifier, password, role } = req.body;
  const users = readFile('users.json');
  
  const idTrim = (identifier || '').trim().toLowerCase();

  const user = users.find(u => {
    if (role && u.role !== role) return false;
    const userEmail = (u.email || '').toLowerCase();
    const userIdent = (u.identifier || '').toLowerCase();
    const userStudentId = (u.studentIdNumber || '').toLowerCase();
    return (
      userIdent === idTrim ||
      userEmail === idTrim ||
      userStudentId === idTrim
    );
  });

  if (!user) {
    return res.status(401).json({ error: 'لم يتم العثور على الحساب. يرجى التأكد من البريد الإلكتروني أو رقم الهوية' });
  }

  if (user.password && user.password !== password) {
    return res.status(401).json({ error: 'كلمة المرور غير صحيحة' });
  }

  // Remove sensitive info
  const { password: _, ...userData } = user;
  res.json({ user: userData, token: `fake-jwt-${user.id}` });
});

// Student Registration with Gmail, Password, Phone, Name, and Mandatory ID Card Photo
app.post('/api/auth/register-student', upload.single('idCardImage'), (req, res) => {
  try {
    const { email, password, phone, name, studentIdNumber, departmentId, stage, studyType } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'الاسم الثلاثي الحقيقي إجباري' });
    }

    if (!email || !password || !phone) {
      return res.status(400).json({ error: 'يرجى إدخال الجيميل، كلمة المرور، ورقم الهاتف' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'صورة الهوية الجامعية إجبارية لإتمام عملية التسجيل والتوثيق' });
    }

    const users = readFile('users.json');
    const existingEmail = users.find(u => (u.email || '').toLowerCase() === email.trim().toLowerCase());
    if (existingEmail) {
      return res.status(400).json({ error: 'هذا البريد الإلكتروني (الجيميل) مسجل مسبقاً في النظام' });
    }

    const studentId = studentIdNumber ? studentIdNumber.trim() : `2024${Math.floor(10000 + Math.random() * 90000)}`;
    const studentName = name && name.trim() ? name.trim() : email.split('@')[0];

    const departments = readFile('departments.json');
    const dept = departments.find(d => d.id === departmentId);

    const idCardImageUrl = `/uploads/${req.file.filename}`;

    const newStudent = {
      id: `usr-student-${Date.now()}`,
      role: 'student',
      name: studentName,
      email: email.trim().toLowerCase(),
      identifier: email.trim().toLowerCase(),
      studentIdNumber: studentId,
      password: password,
      phone: phone.trim(),
      departmentId: departmentId || 'dep-cs',
      departmentName: dept ? dept.name : 'قسم هندسة تقنيات الحاسوب',
      stage: stage || 'المرحلة الثالثة',
      studyType: studyType || 'صباحي',
      verificationStatus: 'pending', // always pending until admin verifies ID card
      idCardImage: idCardImageUrl,
      registeredAt: new Date().toISOString(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(studentName)}`
    };

    users.push(newStudent);
    writeFile('users.json', users);

    const { password: _, ...userData } = newStudent;
    res.status(201).json({
      message: 'تم تسجيل الحساب بنجاح وتم إرسال الهوية للتدقيق',
      user: userData,
      token: `fake-jwt-${newStudent.id}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'حدث خطأ أثناء تسجيل الطالب' });
  }
});

// 3. Tickets (Discord Ticket Rooms)
// Get tickets based on user role
app.get('/api/tickets', (req, res) => {
  const { userId, role } = req.query;
  const tickets = readFile('tickets.json');
  
  if (role === 'admin' || role === 'staff') {
    // Both Admin and Staff can view all tickets
    return res.json(tickets);
  }

  // Student sees only their own tickets
  const studentTickets = tickets.filter(t => t.studentId === userId);
  res.json(studentTickets);
});

// Create a new Ticket (Open Room)
app.post('/api/tickets', upload.single('attachment'), (req, res) => {
  try {
    const { studentId, departmentId, assignedToId, category, title, description, priority } = req.body;
    
    const users = readFile('users.json');
    const student = users.find(u => u.id === studentId);
    if (!student) return res.status(404).json({ error: 'الطالب غير موجود' });

    const departments = readFile('departments.json');
    const dept = departments.find(d => d.id === departmentId);

    let assignedStaffName = 'غير محدد';
    if (assignedToId) {
      const staffMember = users.find(u => u.id === assignedToId);
      if (staffMember) assignedStaffName = `${staffMember.title} ${staffMember.name}`;
    } else if (dept) {
      assignedStaffName = dept.headOfDepartment || dept.name;
    }

    const tickets = readFile('tickets.json');
    const ticketSeq = tickets.length + 1001;
    const ticketId = `tkt-${Date.now()}`;

    const newTicket = {
      id: ticketId,
      ticketNumber: `TCK-${ticketSeq}`,
      studentId: student.id,
      studentName: student.name,
      studentNumber: student.studentIdNumber,
      departmentId: departmentId,
      departmentName: dept ? dept.name : 'عام',
      assignedToId: assignedToId || null,
      assignedToName: assignedStaffName,
      category: category || 'استفسار عام',
      title: title.trim(),
      description: description.trim(),
      status: 'open', // open, in_progress, resolved, closed
      priority: priority || 'normal', // normal, high, urgent
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    tickets.unshift(newTicket);
    writeFile('tickets.json', tickets);

    // Initial message
    const messages = readFile('messages.json');
    const initialMsg = {
      id: `msg-${Date.now()}`,
      ticketId: ticketId,
      senderId: student.id,
      senderName: student.name,
      senderRole: 'student',
      text: description.trim(),
      attachment: req.file ? `/uploads/${req.file.filename}` : null,
      createdAt: new Date().toISOString()
    };
    messages.push(initialMsg);
    writeFile('messages.json', messages);

    // Emit socket event to notify staff
    io.emit('new_ticket_created', newTicket);

    res.status(201).json({ ticket: newTicket, message: initialMsg });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'حدث خطأ أثناء فتح التذكرة' });
  }
});

// Get Ticket details and chat room history
app.get('/api/tickets/:id', (req, res) => {
  const tickets = readFile('tickets.json');
  const ticket = tickets.find(t => t.id === req.params.id);
  if (!ticket) return res.status(404).json({ error: 'التذكرة غير موجودة' });

  const messages = readFile('messages.json');
  const ticketMessages = messages.filter(m => m.ticketId === req.params.id);

  res.json({ ticket, messages: ticketMessages });
});

// Update Ticket Status (Resolve, Close, In Progress)
app.patch('/api/tickets/:id/status', (req, res) => {
  const { status, closedBy } = req.body;
  const tickets = readFile('tickets.json');
  const ticketIndex = tickets.findIndex(t => t.id === req.params.id);

  if (ticketIndex === -1) return res.status(404).json({ error: 'التذكرة غير موجودة' });

  tickets[ticketIndex].status = status;
  tickets[ticketIndex].updatedAt = new Date().toISOString();
  if (status === 'closed' || status === 'resolved') {
    tickets[ticketIndex].closedAt = new Date().toISOString();
    tickets[ticketIndex].closedBy = closedBy || 'الإدارة';
  }

  writeFile('tickets.json', tickets);

  // Notify socket room
  io.to(req.params.id).emit('ticket_status_updated', tickets[ticketIndex]);
  io.emit('ticket_updated_global', tickets[ticketIndex]);

  res.json(tickets[ticketIndex]);
});

// Delete a Ticket completely (for Student who owns it or Staff / Admin)
app.delete('/api/tickets/:id', (req, res) => {
  const ticketId = req.params.id;
  const tickets = readFile('tickets.json');
  const ticketIndex = tickets.findIndex(t => t.id === ticketId);

  if (ticketIndex === -1) {
    return res.status(404).json({ error: 'التذكرة غير موجودة' });
  }

  // Remove ticket from tickets list
  tickets.splice(ticketIndex, 1);
  writeFile('tickets.json', tickets);

  // Remove all messages associated with this ticket
  const messages = readFile('messages.json');
  const filteredMessages = messages.filter(m => m.ticketId !== ticketId);
  writeFile('messages.json', filteredMessages);

  // Broadcast deletion to all active clients
  io.emit('ticket_deleted', ticketId);

  res.json({ success: true, message: 'تم حذف التذكرة وجميع رسائلها بنجاح', ticketId });
});

// Send a message in a Ticket Room
app.post('/api/tickets/:id/messages', upload.single('attachment'), (req, res) => {
  try {
    const { senderId, senderName, senderRole, text } = req.body;
    const ticketId = req.params.id;

    const tickets = readFile('tickets.json');
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return res.status(404).json({ error: 'التذكرة غير موجودة' });

    const messages = readFile('messages.json');
    const newMsg = {
      id: `msg-${Date.now()}`,
      ticketId,
      senderId,
      senderName,
      senderRole,
      text: text || '',
      attachment: req.file ? `/uploads/${req.file.filename}` : null,
      createdAt: new Date().toISOString()
    };

    messages.push(newMsg);
    writeFile('messages.json', messages);

    // Update ticket updatedAt timestamp and if staff replied, change status to in_progress
    if (senderRole !== 'student' && ticket.status === 'open') {
      ticket.status = 'in_progress';
      ticket.updatedAt = new Date().toISOString();
      writeFile('tickets.json', tickets);
      io.to(ticketId).emit('ticket_status_updated', ticket);
    }

    // Broadcast to room
    io.to(ticketId).emit('new_message', newMsg);

    res.status(201).json(newMsg);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'فشل إرسال الرسالة' });
  }
});

// 4. Admin ID Verification
app.get('/api/admin/students', (req, res) => {
  const users = readFile('users.json');
  const students = users.filter(u => u.role === 'student');
  res.json(students);
});

app.patch('/api/admin/verify-student/:id', (req, res) => {
  const { status } = req.body; // 'verified' or 'rejected'
  const users = readFile('users.json');
  const user = users.find(u => u.id === req.params.id);

  if (!user) return res.status(404).json({ error: 'الطالب غير موجود' });

  user.verificationStatus = status;
  writeFile('users.json', users);

  res.json({ message: `تم تحديث حالة التوثيق إلى ${status}`, user });
});

// 5. System Stats
app.get('/api/stats', (req, res) => {
  const tickets = readFile('tickets.json');
  const users = readFile('users.json');
  
  const stats = {
    totalTickets: tickets.length,
    openTickets: tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length,
    resolvedTickets: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
    totalStudents: users.filter(u => u.role === 'student').length,
    pendingVerifications: users.filter(u => u.role === 'student' && u.verificationStatus === 'pending').length,
    totalStaff: users.filter(u => u.role === 'staff').length
  };
  
  res.json(stats);
});

// Serve frontend build if available
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads') && !req.path.startsWith('/socket.io')) {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    }
  });
}

// Socket.IO Room Management (Discord Ticket Room logic)
io.on('connection', (socket) => {
  // Join a ticket room
  socket.on('join_ticket', (ticketId) => {
    socket.join(ticketId);
  });

  // Leave a ticket room
  socket.on('leave_ticket', (ticketId) => {
    socket.leave(ticketId);
  });

  // Real-time typing status
  socket.on('typing', ({ ticketId, userName, isTyping }) => {
    socket.to(ticketId).emit('user_typing', { userName, isTyping });
  });

  socket.on('disconnect', () => {});
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
