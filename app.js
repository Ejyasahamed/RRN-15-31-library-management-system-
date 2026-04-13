// ============================
// EASY LIBRARY - app.js
// Shared data store & utilities
// ============================

// ---- DEFAULT DATA ----
const DEFAULT_BOOKS = [
  { id: 1, title: "Astrophysics for People in a Hurry", author: "Neil deGrasse Tyson", category: "science", rack: "R-14", copies: 3, available: 3, rating: 4.8, lang: "English", publisher: "W.W. Norton · 1st Edition", desc: "An exploration of the universe at large—from the Big Bang to black holes—for those too busy to read a longer book on the cosmos.", cover: "🔭", color: "#1E3A5F" },
  { id: 2, title: "A Brief History of Time", author: "Stephen Hawking", category: "science", rack: "R-09", copies: 5, available: 2, rating: 4.9, lang: "English", publisher: "Bantam Books", desc: "A landmark volume in science writing, covering the nature of space, time, black holes, and the Big Bang.", cover: "⏳", color: "#3D1F00" },
  { id: 3, title: "Modern Physics", author: "Arthur Beiser", category: "science", rack: "R-22", copies: 4, available: 4, rating: 4.5, lang: "English", publisher: "McGraw-Hill", desc: "A classic textbook covering quantum mechanics, relativity, atomic and nuclear physics.", cover: "⚛️", color: "#1A3A2F" },
  { id: 4, title: "Data Structures and Algorithms", author: "Thomas H. Cormen", category: "cs", rack: "C-01", copies: 6, available: 3, rating: 4.7, lang: "English", publisher: "MIT Press", desc: "The definitive guide to data structures, algorithms, and their analysis.", cover: "💻", color: "#1E1B4B" },
  { id: 5, title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "fiction", rack: "F-12", copies: 8, available: 8, rating: 4.3, lang: "English", publisher: "Scribner", desc: "A portrait of the Jazz Age in all of its decadence and excess, exploring themes of wealth, class, and the American Dream.", cover: "🎭", color: "#78350F" },
  { id: 6, title: "To Kill a Mockingbird", author: "Harper Lee", category: "fiction", rack: "F-07", copies: 5, available: 5, rating: 4.8, lang: "English", publisher: "J.B. Lippincott & Co.", desc: "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.", cover: "📜", color: "#064E3B" },
  { id: 7, title: "Sapiens: A Brief History", author: "Yuval Noah Harari", category: "history", rack: "H-03", copies: 4, available: 2, rating: 4.6, lang: "English", publisher: "Harper", desc: "A sweeping narrative of human history from the earliest Homo sapiens to the present.", cover: "🏛️", color: "#1F2937" },
  { id: 8, title: "Clean Code", author: "Robert C. Martin", category: "cs", rack: "C-08", copies: 3, available: 3, rating: 4.4, lang: "English", publisher: "Prentice Hall", desc: "A handbook of agile software craftsmanship — writing readable, maintainable, and clean code.", cover: "🧹", color: "#312E81" },
  { id: 9, title: "Guns, Germs, and Steel", author: "Jared Diamond", category: "history", rack: "H-11", copies: 3, available: 1, rating: 4.5, lang: "English", publisher: "W.W. Norton", desc: "A study of why some civilizations have come to dominate others throughout history.", cover: "⚔️", color: "#7F1D1D" },
  { id: 10, title: "The Alchemist", author: "Paulo Coelho", category: "fiction", rack: "F-19", copies: 7, available: 7, rating: 4.2, lang: "English", publisher: "HarperOne", desc: "A magical story about following your dreams and listening to your heart.", cover: "✨", color: "#451A03" },
];

const DEFAULT_USERS = [
  { id: 1, name: "Alex Johnson", email: "alex@university.edu", password: "password123", role: "student", issuedBooks: [1, 2, 5] },
  { id: 2, name: "Admin User", email: "admin@university.edu", password: "admin123", role: "admin", issuedBooks: [] },
  { id: 3, name: "Sarah Williams", email: "sarah@university.edu", password: "pass123", role: "student", issuedBooks: [3] },
];

const DEFAULT_ISSUED = [
  { id: 1, userId: 1, bookId: 1, issueDate: daysAgo(10), dueDate: daysFromNow(4), returned: false, progress: 65 },
  { id: 2, userId: 1, bookId: 2, issueDate: daysAgo(20), dueDate: daysFromNow(10), returned: false, progress: 30 },
  { id: 3, userId: 1, bookId: 5, issueDate: daysAgo(5), dueDate: daysFromNow(15), returned: false, progress: 80 },
  { id: 4, userId: 3, bookId: 3, issueDate: daysAgo(3), dueDate: daysFromNow(17), returned: false, progress: 20 },
];

const DEFAULT_REQUESTS = [
  { id: 1, userId: 1, bookId: 4, userName: "Alex Johnson", bookTitle: "Data Structures and Algorithms", requestDate: daysAgo(1), status: "pending" },
  { id: 2, userId: 3, bookId: 7, userName: "Sarah Williams", bookTitle: "Sapiens: A Brief History", requestDate: daysAgo(2), status: "pending" },
];

function daysAgo(n) {
  const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().split('T')[0];
}
function daysFromNow(n) {
  const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().split('T')[0];
}

// ---- DATA LAYER ----
function getData(key, defaultVal) {
  try {
    const v = localStorage.getItem('el_' + key);
    return v ? JSON.parse(v) : defaultVal;
  } catch { return defaultVal; }
}
function setData(key, val) {
  localStorage.setItem('el_' + key, JSON.stringify(val));
}
function initData() {
  if (!localStorage.getItem('el_books')) setData('books', DEFAULT_BOOKS);
  if (!localStorage.getItem('el_users')) setData('users', DEFAULT_USERS);
  if (!localStorage.getItem('el_issued')) setData('issued', DEFAULT_ISSUED);
  if (!localStorage.getItem('el_requests')) setData('requests', DEFAULT_REQUESTS);
  if (!localStorage.getItem('el_wishlist')) setData('wishlist', []);
  if (!localStorage.getItem('el_history')) setData('history', []);
}

// ---- AUTH ----
function getCurrentUser() {
  try { return JSON.parse(sessionStorage.getItem('el_current_user')); } catch { return null; }
}
function requireAuth() {
  const user = getCurrentUser();
  if (!user) { window.location.href = getRelPath('pages/login.html'); return null; }
  return user;
}
function requireAdmin() {
  const user = requireAuth();
  if (user && user.role !== 'admin') { window.location.href = getRelPath('pages/dashboard.html'); return null; }
  return user;
}
function getRelPath(path) {
  const isInPages = window.location.pathname.includes('/pages/');
  return isInPages ? '../' + path.replace('pages/', '') : path;
}

// ---- TOAST ----
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast' + (type ? ' ' + type : '');
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 2800);
}

// ---- MODAL ----
function openModal(modalId, backdropId) {
  document.getElementById(modalId)?.classList.remove('hidden');
  document.getElementById(backdropId)?.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeModal(modalId, backdropId) {
  document.getElementById(modalId)?.classList.add('hidden');
  document.getElementById(backdropId)?.classList.add('hidden');
  document.body.style.overflow = '';
}

// ---- SHARED INIT ----
document.addEventListener('DOMContentLoaded', () => {
  initData();

  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('el_current_user');
      window.location.href = getRelPath('pages/login.html');
    });
  }

  // Set username in nav
  const user = getCurrentUser();
  if (user) {
    const navUser = document.getElementById('nav-username');
    if (navUser) navUser.textContent = user.name.split(' ')[0];
  }

  // Modal backdrop click
  document.getElementById('modal-backdrop')?.addEventListener('click', () => {
    document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
    document.getElementById('modal-backdrop')?.classList.add('hidden');
    document.body.style.overflow = '';
  });
});
