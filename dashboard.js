// dashboard.js

document.addEventListener('DOMContentLoaded', () => {
  const user = requireAuth();
  if (!user) return;

  // Set greeting name
  const firstName = user.name.split(' ')[0];
  document.getElementById('dash-username').textContent = firstName;

  const hour = new Date().getHours();
  const greetEl = document.querySelector('.greeting-sm');
  if (greetEl) {
    greetEl.textContent = hour < 12 ? 'Good morning,' : hour < 17 ? 'Good afternoon,' : 'Good evening,';
  }

  // Currently reading
  const issued = getData('issued', []).filter(i => i.userId === user.id && !i.returned);
  const books = getData('books', []);
  const readingEl = document.getElementById('reading-list');

  if (issued.length === 0) {
    readingEl.innerHTML = `<div class="empty-state"><div class="empty-icon">📚</div><p>No books currently issued. <a href="catalog.html" style="color:var(--purple)">Browse catalog</a></p></div>`;
  } else {
    issued.slice(0, 2).forEach(issue => {
      const book = books.find(b => b.id === issue.bookId);
      if (!book) return;
      const daysLeft = Math.ceil((new Date(issue.dueDate) - new Date()) / 86400000);
      readingEl.innerHTML += `
        <div class="reading-card">
          <div class="reading-cover" style="background:${book.color}20">${book.cover}</div>
          <div style="flex:1">
            <div class="reading-title">${book.title}</div>
            <div class="reading-due">Due in ${daysLeft > 0 ? daysLeft + ' days' : 'TODAY'}</div>
            <div class="progress-bar"><div class="progress-fill" style="width:${issue.progress}%"></div></div>
            <div class="progress-label">${issue.progress}% Complete</div>
          </div>
        </div>`;
    });
  }

  // Recommendations (books not issued by user)
  const issuedIds = issued.map(i => i.bookId);
  const recs = books.filter(b => !issuedIds.includes(b.id)).slice(0, 4);
  const recEl = document.getElementById('recommended-list');
  recs.forEach(book => {
    const card = document.createElement('div');
    card.className = 'rec-card';
    card.innerHTML = `
      <div class="rec-cover" style="background:${book.color}20">${book.cover}</div>
      <div class="rec-title">${book.title}</div>
      <div class="rec-author">${book.author}</div>
      <div style="font-size:0.75rem;color:var(--text-soft);margin-top:4px">⭐ ${book.rating}</div>`;
    card.addEventListener('click', () => {
      window.location.href = `catalog.html`;
    });
    recEl.appendChild(card);
  });
});
