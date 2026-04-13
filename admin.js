// admin.js

document.addEventListener('DOMContentLoaded', () => {
  const user = requireAdmin();
  if (!user) return;

  let activeTab = 'books';
  let editBookId = null;

  // Stats
  function updateStats() {
    const books = getData('books', []);
    const users = getData('users', []).filter(u => u.role === 'student');
    const issued = getData('issued', []).filter(i => !i.returned);
    const overdue = issued.filter(i => new Date(i.dueDate) < new Date());
    document.getElementById('stat-books').textContent = books.length;
    document.getElementById('stat-issued').textContent = issued.length;
    document.getElementById('stat-users').textContent = users.length;
    document.getElementById('stat-overdue').textContent = overdue.length;
  }

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTab = btn.dataset.tab;
      ['books', 'users', 'requests'].forEach(t => {
        document.getElementById('tab-' + t).classList.toggle('hidden', t !== activeTab);
      });
      if (activeTab === 'users') renderUsers();
      if (activeTab === 'requests') renderRequests();
    });
  });

  // ---- BOOKS ----
  function renderBooks(query = '') {
    const books = getData('books', []);
    const filtered = query ? books.filter(b => b.title.toLowerCase().includes(query.toLowerCase()) || b.author.toLowerCase().includes(query.toLowerCase())) : books;
    const list = document.getElementById('admin-book-list');
    list.innerHTML = '';
    if (filtered.length === 0) {
      list.innerHTML = `<div class="empty-state"><div class="empty-icon">📚</div><p>No books found.</p></div>`;
      return;
    }
    filtered.forEach(book => {
      const row = document.createElement('div');
      row.className = 'admin-book-row';
      row.innerHTML = `
        <div style="font-size:1.5rem">${book.cover}</div>
        <div class="admin-book-info">
          <div class="admin-book-title">${book.title}</div>
          <div class="admin-book-meta">${book.author} · ${book.category} · Rack: ${book.rack} · Copies: ${book.copies} · Available: ${book.available}</div>
        </div>
        <div class="admin-actions">
          <button class="btn-icon btn-edit edit-book-btn" data-id="${book.id}" title="Edit">✏️</button>
          <button class="btn-icon btn-delete delete-book-btn" data-id="${book.id}" title="Delete">🗑️</button>
        </div>`;
      row.querySelector('.edit-book-btn').addEventListener('click', () => openBookForm(book));
      row.querySelector('.delete-book-btn').addEventListener('click', () => deleteBook(book.id));
      list.appendChild(row);
    });
  }

  document.getElementById('admin-search').addEventListener('input', e => renderBooks(e.target.value));

  document.getElementById('add-book-btn').addEventListener('click', () => openBookForm(null));

  function openBookForm(book) {
    editBookId = book ? book.id : null;
    document.getElementById('book-form-title').textContent = book ? 'Edit Book' : 'Add Book';
    document.getElementById('edit-book-id').value = book ? book.id : '';
    document.getElementById('book-title').value = book ? book.title : '';
    document.getElementById('book-author').value = book ? book.author : '';
    document.getElementById('book-category').value = book ? book.category : 'science';
    document.getElementById('book-desc').value = book ? book.desc : '';
    document.getElementById('book-rack').value = book ? book.rack : '';
    document.getElementById('book-copies').value = book ? book.copies : '';
    openModal('book-form-modal', 'modal-backdrop');
  }

  document.getElementById('close-book-form').addEventListener('click', () => closeModal('book-form-modal', 'modal-backdrop'));

  document.getElementById('save-book-btn').addEventListener('click', () => {
    const title = document.getElementById('book-title').value.trim();
    const author = document.getElementById('book-author').value.trim();
    const category = document.getElementById('book-category').value;
    const desc = document.getElementById('book-desc').value.trim();
    const rack = document.getElementById('book-rack').value.trim();
    const copies = parseInt(document.getElementById('book-copies').value);

    if (!title || !author || !rack || !copies) { showToast('Please fill in all fields.', 'error'); return; }

    const books = getData('books', []);
    const COVERS = { science: '🔬', fiction: '📖', history: '🏛️', cs: '💻' };
    const COLORS = { science: '#1E3A5F', fiction: '#78350F', history: '#1F2937', cs: '#1E1B4B' };

    if (editBookId) {
      const idx = books.findIndex(b => b.id === editBookId);
      if (idx !== -1) {
        const diff = copies - books[idx].copies;
        books[idx] = { ...books[idx], title, author, category, desc, rack, copies, available: Math.max(0, books[idx].available + diff) };
      }
    } else {
      books.push({ id: Date.now(), title, author, category, desc, rack, copies, available: copies, rating: 4.0, lang: 'English', publisher: '', cover: COVERS[category] || '📚', color: COLORS[category] || '#1E1B4B' });
    }

    setData('books', books);
    closeModal('book-form-modal', 'modal-backdrop');
    renderBooks();
    updateStats();
    showToast(editBookId ? 'Book updated!' : 'Book added!', 'success');
    editBookId = null;
  });

  function deleteBook(id) {
    if (!confirm('Delete this book from the catalog?')) return;
    const books = getData('books', []).filter(b => b.id !== id);
    setData('books', books);
    renderBooks();
    updateStats();
    showToast('Book deleted.', 'success');
  }

  // ---- USERS ----
  function renderUsers() {
    const users = getData('users', []).filter(u => u.role === 'student');
    const issued = getData('issued', []).filter(i => !i.returned);
    const el = document.getElementById('admin-user-list');
    el.innerHTML = '';

    if (users.length === 0) {
      el.innerHTML = `<div class="empty-state"><p>No students registered yet.</p></div>`;
      return;
    }

    users.forEach(u => {
      const count = issued.filter(i => i.userId === u.id).length;
      const row = document.createElement('div');
      row.className = 'user-row';
      row.innerHTML = `
        <div class="user-avatar">${u.name.charAt(0)}</div>
        <div>
          <div class="user-name">${u.name}</div>
          <div class="user-email">${u.email}</div>
        </div>
        <div class="user-books-count">${count} book${count !== 1 ? 's' : ''} issued</div>
        <button class="btn-icon btn-delete" onclick="deleteUser(${u.id})" title="Remove user">🗑️</button>`;
      el.appendChild(row);
    });
  }

  window.deleteUser = function(id) {
    if (!confirm('Remove this student account?')) return;
    const users = getData('users', []).filter(u => u.id !== id);
    setData('users', users);
    renderUsers();
    updateStats();
    showToast('User removed.', 'success');
  };

  // ---- REQUESTS ----
  function renderRequests() {
    const requests = getData('requests', []);
    const el = document.getElementById('admin-request-list');
    el.innerHTML = '';

    if (requests.length === 0) {
      el.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div><p>No pending requests.</p></div>`;
      return;
    }

    requests.slice().reverse().forEach(req => {
      const row = document.createElement('div');
      row.className = 'request-row';
      const isPending = req.status === 'pending';
      row.innerHTML = `
        <div class="request-header">
          <div>
            <div class="request-book">${req.bookTitle}</div>
            <div class="request-user">Requested by: ${req.userName} · ${req.requestDate}</div>
          </div>
          <span class="request-status-badge req-${req.status}">${req.status.toUpperCase()}</span>
        </div>
        ${isPending ? `<div class="request-actions">
          <button class="btn-approve" data-id="${req.id}">✓ Approve</button>
          <button class="btn-reject" data-id="${req.id}">✗ Reject</button>
        </div>` : ''}`;

      if (isPending) {
        row.querySelector('.btn-approve').addEventListener('click', () => approveRequest(req.id));
        row.querySelector('.btn-reject').addEventListener('click', () => rejectRequest(req.id));
      }
      el.appendChild(row);
    });
  }

  function approveRequest(reqId) {
    const requests = getData('requests', []);
    const req = requests.find(r => r.id === reqId);
    if (!req) return;

    const books = getData('books', []);
    const book = books.find(b => b.id === req.bookId);
    if (!book || book.available <= 0) { showToast('Book not available!', 'error'); return; }

    book.available = Math.max(0, book.available - 1);
    setData('books', books);

    const issued = getData('issued', []);
    issued.push({
      id: Date.now(), userId: req.userId, bookId: req.bookId,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0],
      returned: false, progress: 0
    });
    setData('issued', issued);

    req.status = 'approved';
    setData('requests', requests);
    renderRequests();
    updateStats();
    showToast('Request approved! Book issued.', 'success');
  }

  function rejectRequest(reqId) {
    const requests = getData('requests', []);
    const req = requests.find(r => r.id === reqId);
    if (req) { req.status = 'rejected'; setData('requests', requests); }
    renderRequests();
    showToast('Request rejected.', 'error');
  }

  // Init
  updateStats();
  renderBooks();
});
