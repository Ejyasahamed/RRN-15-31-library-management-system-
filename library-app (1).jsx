import { useState, useEffect } from "react";

const BOOKS = [
  { id: 1, title: "Astrophysics for People in a Hurry", author: "Neil deGrasse Tyson", category: "Science", status: "available", rack: "R-14", slot: "496", lang: "English", rating: 4.8, edition: "1st Edition", publisher: "W. W. Norton", cover: "🔭", color: "#2d6a8a", desc: "An exploration of the universe at large—from the Big Bang to black holes—for those too busy to read a longer book on the cosmos." },
  { id: 2, title: "A Brief History of Time", author: "Stephen Hawking", category: "Science", status: "issued", rack: "R-09", slot: "112", lang: "English", rating: 4.9, edition: "2nd Edition", publisher: "Bantam Books", cover: "⏳", color: "#5c4a8a", desc: "From the Big Bang to black holes, Hawking takes us on a breathtaking journey through the universe's greatest mysteries." },
  { id: 3, title: "Modern Physics", author: "Arthur Beiser", category: "Science", status: "available", rack: "R-22", slot: "305", lang: "English", rating: 4.5, edition: "6th Edition", publisher: "McGraw-Hill", cover: "⚛️", color: "#1a5276", desc: "A comprehensive introduction to modern physics covering quantum mechanics, relativity, and atomic structure." },
  { id: 4, title: "Sapiens", author: "Yuval Noah Harari", category: "History", status: "available", rack: "H-03", slot: "088", lang: "English", rating: 4.7, edition: "1st Edition", publisher: "Harper", cover: "🦴", color: "#7d5a2e", desc: "A brief history of humankind that explores how Homo sapiens came to dominate Earth and what the future holds." },
  { id: 5, title: "Data Structures", author: "Seymour Lipschutz", category: "CS & Engineering", status: "available", rack: "R-14", slot: "496", lang: "English", rating: 4.8, edition: "2nd Edition", publisher: "McGraw-Hill Education", cover: "🗂️", color: "#1a6b6b", desc: "This revised second edition provides a comprehensive introduction to the fundamental concepts of data structures. Covers arrays, stacks, queues, linked lists, trees, graphs, and hashing." },
  { id: 6, title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Fiction", status: "issued", rack: "F-07", slot: "234", lang: "English", rating: 4.3, edition: "Classics Ed.", publisher: "Scribner", cover: "🥂", color: "#8a6a1a", desc: "A novel of the Jazz Age that explores themes of decadence, idealism, social upheaval, and excess." },
  { id: 7, title: "1984", author: "George Orwell", category: "Fiction", status: "available", rack: "F-11", slot: "567", lang: "English", rating: 4.9, edition: "Signet Classic", publisher: "Secker & Warburg", cover: "👁️", color: "#3a3a3a", desc: "A dystopian novel set in a totalitarian society where Big Brother watches your every move. A warning for all ages." },
  { id: 8, title: "Clean Code", author: "Robert C. Martin", category: "CS & Engineering", status: "available", rack: "R-18", slot: "391", lang: "English", rating: 4.6, edition: "1st Edition", publisher: "Prentice Hall", cover: "💻", color: "#1a4a2e", desc: "A handbook of agile software craftsmanship. Learn to write clean, readable, and maintainable code." },
  { id: 9, title: "Thinking, Fast and Slow", author: "Daniel Kahneman", category: "Science", status: "available", rack: "S-05", slot: "142", lang: "English", rating: 4.7, edition: "1st Edition", publisher: "Farrar, Straus", cover: "🧠", color: "#5c2d6b", desc: "A groundbreaking tour of the mind explaining the two systems that drive the way we think." },
  { id: 10, title: "Dune", author: "Frank Herbert", category: "Fiction", status: "issued", rack: "F-02", slot: "019", lang: "English", rating: 4.8, edition: "40th Anniversary", publisher: "Chilton Books", cover: "🏜️", color: "#8a5a1a", desc: "Set in the distant future amidst a feudal interstellar society, Dune tells the story of young Paul Atreides." },
];

const CATEGORIES = ["All Books", "Science", "Fiction", "History", "CS & Engineering"];
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const CURRENT_USER = { name: "Alex", avatar: "👨‍🎓", currentBook: BOOKS[4], progress: 65 };
const ADMIN_USER = { name: "Sarah Jenkins", avatar: "👩‍💼", issued: 42, overdue: 12 };

export default function LibraryApp() {
  const [screen, setScreen] = useState("landing");
  const [role, setRole] = useState("student");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Books");
  const [selectedBook, setSelectedBook] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([BOOKS[1].id, BOOKS[5].id, BOOKS[9].id]);
  const [notification, setNotification] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [adminTab, setAdminTab] = useState("dashboard");

  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredBooks = BOOKS.filter(b => {
    const matchCat = selectedCategory === "All Books" || b.category === selectedCategory;
    const matchQ = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQ;
  });

  const handleLogin = () => {
    if (loginEmail && loginPass) {
      setScreen(role === "admin" ? "admin" : "home");
    }
  };

  const toggleWishlist = (id) => {
    setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);
    showNotification(wishlist.includes(id) ? "Removed from wishlist" : "Added to wishlist ❤️");
  };

  const requestIssue = (book) => {
    if (issuedBooks.includes(book.id)) {
      showNotification("Already issued!", "info");
    } else if (book.status === "issued") {
      showNotification("Book unavailable right now 📚", "error");
    } else {
      setIssuedBooks(i => [...i, book.id]);
      showNotification(`"${book.title}" issued successfully! 🎉`);
    }
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: "#f5f4ff", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-thumb { background: #c4b5fd; border-radius: 99px; }
        .btn-primary { background: linear-gradient(135deg, #7c3aed, #9333ea); color: white; border: none; border-radius: 14px; padding: 14px 28px; font-size: 16px; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; transition: all .2s; box-shadow: 0 4px 15px rgba(124,58,237,0.35); }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(124,58,237,0.45); }
        .btn-outline { background: transparent; border: 1.5px solid #7c3aed; color: #7c3aed; border-radius: 12px; padding: 10px 22px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; transition: all .2s; }
        .btn-outline:hover { background: #7c3aed; color: white; }
        .card { background: white; border-radius: 20px; box-shadow: 0 2px 20px rgba(0,0,0,0.06); }
        .tag { display: inline-block; padding: 4px 12px; border-radius: 99px; font-size: 11px; font-weight: 600; letter-spacing: .5px; text-transform: uppercase; }
        .tag-available { background: #d1fae5; color: #059669; }
        .tag-issued { background: #fee2e2; color: #dc2626; }
        .input { width: 100%; padding: 13px 16px; border: 1.5px solid #e8e3ff; border-radius: 12px; font-size: 15px; font-family: 'Outfit', sans-serif; outline: none; transition: border .2s; color: #1e1b4b; }
        .input:focus { border-color: #7c3aed; }
        .nav-tab { display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; padding: 8px 16px; border-radius: 12px; font-size: 11px; font-weight: 600; color: #9ca3af; transition: all .2s; border: none; background: none; font-family: 'Outfit', sans-serif; }
        .nav-tab.active { color: #7c3aed; background: #f5f3ff; }
        .search-input { width: 100%; padding: 13px 18px 13px 44px; border: 1.5px solid #e8e3ff; border-radius: 14px; font-size: 15px; font-family: 'Outfit', sans-serif; outline: none; transition: border .2s; background: #faf9ff; }
        .search-input:focus { border-color: #7c3aed; background: white; }
        @keyframes slideUp { from { opacity:0; transform: translateY(30px); } to { opacity:1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        .slide-up { animation: slideUp 0.5s ease forwards; }
        .fade-in { animation: fadeIn 0.3s ease; }
        .book-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.1) !important; }
        .book-card { transition: all .25s ease; }
      `}</style>

      {/* Notification */}
      {notification && (
        <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, background: notification.type === "error" ? "#fee2e2" : notification.type === "info" ? "#dbeafe" : "#d1fae5", color: notification.type === "error" ? "#991b1b" : notification.type === "info" ? "#1e40af" : "#065f46", padding: "14px 22px", borderRadius: 14, fontWeight: 600, fontSize: 14, boxShadow: "0 8px 30px rgba(0,0,0,0.15)", animation: "slideUp 0.3s ease" }}>
          {notification.msg}
        </div>
      )}

      {screen === "landing" && <LandingPage onLogin={() => setScreen("login")} />}
      {screen === "login" && <LoginScreen role={role} setRole={setRole} email={loginEmail} setEmail={setLoginEmail} pass={loginPass} setPass={setLoginPass} onLogin={handleLogin} onBack={() => setScreen("landing")} />}
      {screen === "home" && <StudentApp screen={screen} setScreen={setScreen} selectedBook={selectedBook} setSelectedBook={setSelectedBook} searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} filteredBooks={filteredBooks} wishlist={wishlist} toggleWishlist={toggleWishlist} requestIssue={requestIssue} issuedBooks={issuedBooks} onLogout={() => setScreen("landing")} />}
      {screen === "search" && <StudentApp screen={screen} setScreen={setScreen} selectedBook={selectedBook} setSelectedBook={setSelectedBook} searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} filteredBooks={filteredBooks} wishlist={wishlist} toggleWishlist={toggleWishlist} requestIssue={requestIssue} issuedBooks={issuedBooks} onLogout={() => setScreen("landing")} />}
      {screen === "mybooks" && <StudentApp screen={screen} setScreen={setScreen} selectedBook={selectedBook} setSelectedBook={setSelectedBook} searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} filteredBooks={filteredBooks} wishlist={wishlist} toggleWishlist={toggleWishlist} requestIssue={requestIssue} issuedBooks={issuedBooks} onLogout={() => setScreen("landing")} />}
      {screen === "book-detail" && selectedBook && <BookDetail book={selectedBook} wishlist={wishlist} toggleWishlist={toggleWishlist} requestIssue={requestIssue} issuedBooks={issuedBooks} onBack={() => setScreen("search")} />}
      {screen === "admin" && <AdminPanel tab={adminTab} setTab={setAdminTab} books={BOOKS} issuedBooks={issuedBooks} onLogout={() => setScreen("landing")} showNotification={showNotification} />}
    </div>
  );
}

function LandingPage({ onLogin }) {
  const features = [
    { icon: "📚", title: "45K+ E-Books", desc: "Access a vast digital catalog" },
    { icon: "🔍", title: "Smart Search", desc: "Find by title, author, or ISBN" },
    { icon: "⚡", title: "24/7 Access", desc: "Read anytime, anywhere" },
    { icon: "🏛️", title: "12 Libraries", desc: "All campus libraries connected" },
  ];
  const testimonials = [
    { name: "Priya M.", dept: "Computer Science", quote: "Finding books has never been easier. The search is incredibly fast!", avatar: "👩‍💻" },
    { name: "Rohan K.", dept: "Physics", quote: "I love how I can check availability before going to the library.", avatar: "👨‍🔬" },
    { name: "Aisha T.", dept: "Literature", quote: "The recommendation system helped me discover so many great books.", avatar: "👩‍🎨" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #f5f3ff 0%, #faf5ff 50%, #f0fdf4 100%)" }}>
      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 60px", background: "rgba(255,255,255,0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid #ede9fe", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #7c3aed, #9333ea)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📖</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: "#1e1b4b" }}>Easy Library</div>
            <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>University Digital Catalog</div>
          </div>
        </div>
        <nav style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {["Features", "Catalog", "About"].map(n => (
            <a key={n} href="#" style={{ textDecoration: "none", color: "#6b7280", fontWeight: 500, fontSize: 15, transition: "color .2s" }} onMouseEnter={e => e.target.style.color = "#7c3aed"} onMouseLeave={e => e.target.style.color = "#6b7280"}>{n}</a>
          ))}
          <button className="btn-primary" onClick={onLogin} style={{ padding: "10px 24px", fontSize: 14 }}>Sign In</button>
        </nav>
      </header>

      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 40px 80px", textAlign: "center", animation: "slideUp 0.7s ease" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#ede9fe", borderRadius: 99, padding: "6px 18px", marginBottom: 28, fontSize: 13, fontWeight: 600, color: "#7c3aed" }}>
          ✨ New: AI-powered book recommendations
        </div>
        <h1 style={{ fontSize: 72, fontWeight: 800, color: "#1e1b4b", lineHeight: 1.1, marginBottom: 24, letterSpacing: "-2px" }}>
          <span style={{ background: "linear-gradient(135deg, #7c3aed, #9333ea, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Easy Library</span><br />Made for You
        </h1>
        <p style={{ fontSize: 20, color: "#6b7280", maxWidth: 600, margin: "0 auto 44px", lineHeight: 1.7, fontWeight: 400 }}>
          Access 45,000+ books, research papers, and journals from anywhere. Check availability, issue books, and manage your reading list — all in one place.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn-primary" onClick={onLogin} style={{ fontSize: 17, padding: "16px 40px" }}>Get Started Free →</button>
          <button className="btn-outline" style={{ padding: "16px 40px", fontSize: 17 }}>Browse Catalog</button>
        </div>

        {/* Stats strip */}
        <div style={{ display: "flex", justifyContent: "center", gap: 60, marginTop: 64, flexWrap: "wrap" }}>
          {[["45K+", "E-Books"], ["12", "Libraries"], ["24/7", "Access"], ["98%", "Satisfaction"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: "#7c3aed" }}>{num}</div>
              <div style={{ fontSize: 14, color: "#9ca3af", fontWeight: 500, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ background: "white", padding: "80px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 42, fontWeight: 800, color: "#1e1b4b", marginBottom: 12, letterSpacing: "-1px" }}>Everything You Need</h2>
          <p style={{ textAlign: "center", color: "#9ca3af", marginBottom: 56, fontSize: 17 }}>Powerful tools for students and librarians alike</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {features.map((f, i) => (
              <div key={i} className="card" style={{ padding: "32px 28px", textAlign: "center", border: "1.5px solid #f3f0ff", transition: "all .2s", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#c4b5fd"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#f3f0ff"; e.currentTarget.style.transform = ""; }}>
                <div style={{ fontSize: 44, marginBottom: 16 }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 18, color: "#1e1b4b", marginBottom: 8 }}>{f.title}</div>
                <div style={{ color: "#9ca3af", fontSize: 14, lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular books strip */}
      <section style={{ padding: "80px 40px", background: "#faf9ff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 42, fontWeight: 800, color: "#1e1b4b", marginBottom: 8, letterSpacing: "-1px" }}>Trending This Week</h2>
          <p style={{ color: "#9ca3af", marginBottom: 40, fontSize: 16 }}>Most-read books across campus</p>
          <div style={{ display: "flex", gap: 20, overflowX: "auto", paddingBottom: 16 }}>
            {BOOKS.slice(0, 6).map((book, i) => (
              <div key={book.id} className="card book-card" style={{ minWidth: 160, padding: "24px 20px", textAlign: "center", flexShrink: 0, border: "1.5px solid #f3f0ff", cursor: "pointer" }}>
                <div style={{ width: 80, height: 100, background: `linear-gradient(135deg, ${book.color}, ${book.color}cc)`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 16px", boxShadow: `0 8px 24px ${book.color}44` }}>
                  {book.cover}
                </div>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#1e1b4b", marginBottom: 4, lineHeight: 1.3 }}>{book.title}</div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 10 }}>{book.author}</div>
                <span className={`tag tag-${book.status}`}>{book.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "80px 40px", background: "white" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 42, fontWeight: 800, color: "#1e1b4b", marginBottom: 56, letterSpacing: "-1px" }}>What Students Say</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {testimonials.map((t, i) => (
              <div key={i} className="card" style={{ padding: "32px", border: "1.5px solid #f3f0ff" }}>
                <div style={{ fontSize: 28, marginBottom: 16 }}>"</div>
                <p style={{ color: "#374151", lineHeight: 1.7, marginBottom: 24, fontSize: 15 }}>{t.quote}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ fontSize: 32 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#1e1b4b" }}>{t.name}</div>
                    <div style={{ fontSize: 13, color: "#9ca3af" }}>{t.dept}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 40px", background: "linear-gradient(135deg, #7c3aed, #9333ea)", textAlign: "center" }}>
        <h2 style={{ fontSize: 48, fontWeight: 800, color: "white", marginBottom: 16, letterSpacing: "-1px" }}>Ready to Start Reading?</h2>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 18, marginBottom: 40 }}>Join 10,000+ students already using Easy Library</p>
        <button onClick={onLogin} style={{ background: "white", color: "#7c3aed", border: "none", borderRadius: 14, padding: "16px 44px", fontSize: 17, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 30px rgba(0,0,0,0.2)", transition: "all .2s" }}
          onMouseEnter={e => e.target.style.transform = "translateY(-3px)"} onMouseLeave={e => e.target.style.transform = ""}>
          Get Started →
        </button>
      </section>

      <footer style={{ background: "#1e1b4b", color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "24px", fontSize: 14 }}>
        © 2025 Easy Library · All rights reserved · Made with ❤️ for learners
      </footer>
    </div>
  );
}

function LoginScreen({ role, setRole, email, setEmail, pass, setPass, onLogin, onBack }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg, #f5f3ff, #faf5ff)", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#7c3aed", cursor: "pointer", fontWeight: 600, fontSize: 15, marginBottom: 32, fontFamily: "Outfit", display: "flex", alignItems: "center", gap: 6 }}>← Back to Home</button>
        <div className="card slide-up" style={{ padding: "44px 40px", border: "1.5px solid #ede9fe" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ width: 64, height: 64, background: "linear-gradient(135deg, #7c3aed, #9333ea)", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 20px" }}>📖</div>
            <h1 style={{ fontWeight: 800, fontSize: 26, color: "#1e1b4b", marginBottom: 6 }}>Easy Library</h1>
            <p style={{ color: "#9ca3af", fontSize: 14 }}>Access your university's digital catalog</p>
          </div>

          {/* Role toggle */}
          <div style={{ display: "flex", background: "#f5f3ff", borderRadius: 12, padding: 4, marginBottom: 28 }}>
            {["student", "admin"].map(r => (
              <button key={r} onClick={() => setRole(r)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", background: role === r ? "white" : "transparent", fontWeight: 700, fontSize: 14, color: role === r ? "#7c3aed" : "#9ca3af", cursor: "pointer", fontFamily: "Outfit", boxShadow: role === r ? "0 2px 8px rgba(0,0,0,0.08)" : "none", transition: "all .2s", textTransform: "capitalize" }}>{r}</button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8, display: "block" }}>Academic Email</label>
              <input className="input" type="email" placeholder="Enter your university email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Password</label>
                <a href="#" style={{ fontSize: 13, color: "#7c3aed", fontWeight: 600, textDecoration: "none" }}>Forgot password?</a>
              </div>
              <input className="input" type="password" placeholder="Enter your password" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && onLogin()} />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#374151", cursor: "pointer" }}>
              <input type="checkbox" style={{ accentColor: "#7c3aed" }} /> Keep me logged in
            </label>
            <button className="btn-primary" onClick={onLogin} style={{ width: "100%", marginTop: 8, padding: "15px" }}>Log In as {role === "admin" ? "Admin" : "Student"}</button>
          </div>

          <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#6b7280" }}>
            Don't have an account? <a href="#" style={{ color: "#7c3aed", fontWeight: 700, textDecoration: "none" }}>Register</a>
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 32, paddingTop: 24, borderTop: "1px solid #f3f0ff" }}>
            {[["45k+", "E-Books"], ["24/7", "Access"], ["12", "Libraries"]].map(([n, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 800, color: "#7c3aed", fontSize: 18 }}>{n}</div>
                <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentApp({ screen, setScreen, selectedBook, setSelectedBook, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, filteredBooks, wishlist, toggleWishlist, requestIssue, issuedBooks, onLogout }) {
  const myBooks = BOOKS.filter(b => issuedBooks.includes(b.id));

  return (
    <div style={{ minHeight: "100vh", background: "#f5f4ff", paddingBottom: 80 }}>
      {/* Top bar */}
      <div style={{ background: "white", borderBottom: "1px solid #ede9fe", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#7c3aed,#9333ea)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📖</div>
          <div style={{ fontWeight: 800, fontSize: 16, color: "#1e1b4b" }}>Easy Library</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "#6b7280", fontSize: 14 }}>👋 Alex</span>
          <button onClick={onLogout} style={{ background: "#fee2e2", border: "none", color: "#dc2626", borderRadius: 8, padding: "6px 14px", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "Outfit" }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px" }}>
        {screen === "home" && <HomeTab setScreen={setScreen} setSelectedBook={setSelectedBook} issuedBooks={issuedBooks} myBooks={myBooks} />}
        {screen === "search" && <SearchTab filteredBooks={filteredBooks} searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} wishlist={wishlist} toggleWishlist={toggleWishlist} setSelectedBook={setSelectedBook} setScreen={setScreen} />}
        {screen === "mybooks" && <MyBooksTab myBooks={myBooks} setSelectedBook={setSelectedBook} setScreen={setScreen} />}
        {screen === "book-detail" && selectedBook && <BookDetail book={selectedBook} wishlist={wishlist} toggleWishlist={toggleWishlist} requestIssue={requestIssue} issuedBooks={issuedBooks} onBack={() => setScreen("search")} />}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid #ede9fe", display: "flex", justifyContent: "space-around", padding: "8px 0", zIndex: 100 }}>
        {[["🏠", "Home", "home"], ["🔍", "Search", "search"], ["📚", "My Books", "mybooks"]].map(([icon, label, s]) => (
          <button key={s} className={`nav-tab ${screen === s ? "active" : ""}`} onClick={() => setScreen(s)}>
            <span style={{ fontSize: 22 }}>{icon}</span>{label}
          </button>
        ))}
      </div>
    </div>
  );
}

function HomeTab({ setScreen, setSelectedBook, issuedBooks, myBooks }) {
  return (
    <div className="fade-in">
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 14, color: "#9ca3af", fontWeight: 500 }}>Good morning,</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1e1b4b" }}>Welcome, Alex 👋</h1>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: 28 }}>
        <h3 style={{ fontWeight: 700, color: "#1e1b4b", marginBottom: 16 }}>Quick Actions</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div onClick={() => setScreen("search")} style={{ background: "linear-gradient(135deg, #7c3aed, #9333ea)", borderRadius: 18, padding: "28px 24px", cursor: "pointer", color: "white", fontSize: 15, fontWeight: 700, display: "flex", flexDirection: "column", gap: 8, boxShadow: "0 8px 24px rgba(124,58,237,0.35)" }}>
            <span style={{ fontSize: 32 }}>🔍</span> Search Books
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", border: "1.5px solid #f3f0ff" }}>
              <span style={{ fontSize: 28 }}>📊</span>
              <div><div style={{ fontWeight: 700, color: "#1e1b4b", fontSize: 14 }}>Check Availability</div><div style={{ fontSize: 12, color: "#9ca3af" }}>Find open books</div></div>
            </div>
            <div className="card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", border: "1.5px solid #f3f0ff" }}>
              <span style={{ fontSize: 28 }}>⚠️</span>
              <div><div style={{ fontWeight: 700, color: "#1e1b4b", fontSize: 14 }}>Request Issue</div><div style={{ fontSize: 12, color: "#9ca3af" }}>Reserve a book</div></div>
            </div>
          </div>
        </div>
      </div>

      {/* Currently Reading */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontWeight: 700, color: "#1e1b4b" }}>Currently Reading</h3>
          <button onClick={() => setScreen("mybooks")} style={{ background: "none", border: "none", color: "#7c3aed", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "Outfit" }}>View All</button>
        </div>
        <div className="card" style={{ padding: "20px", border: "1.5px solid #ede9fe", display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ width: 60, height: 80, background: `linear-gradient(135deg, ${BOOKS[4].color}, ${BOOKS[4].color}cc)`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>
            {BOOKS[4].cover}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: "#1e1b4b", marginBottom: 4 }}>Data Structures</div>
            <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 12 }}>Due in 3 days</div>
            <div style={{ background: "#f5f3ff", borderRadius: 99, height: 8, overflow: "hidden" }}>
              <div style={{ width: "65%", height: "100%", background: "linear-gradient(90deg, #7c3aed, #9333ea)", borderRadius: 99 }} />
            </div>
            <div style={{ fontSize: 12, color: "#7c3aed", fontWeight: 600, marginTop: 6 }}>65% Complete</div>
          </div>
        </div>
      </div>

      {/* Recommended */}
      <div>
        <h3 style={{ fontWeight: 700, color: "#1e1b4b", marginBottom: 16 }}>Recommended for You</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {BOOKS.slice(6, 9).map(book => (
            <div key={book.id} className="card book-card" style={{ padding: "16px 20px", display: "flex", gap: 16, alignItems: "center", border: "1.5px solid #f3f0ff", cursor: "pointer" }}
              onClick={() => { setSelectedBook(book); }}>
              <div style={{ width: 48, height: 64, background: `linear-gradient(135deg, ${book.color}, ${book.color}cc)`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                {book.cover}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: "#1e1b4b", fontSize: 15, marginBottom: 3 }}>{book.title}</div>
                <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 8 }}>{book.author}</div>
                <span className={`tag tag-${book.status}`}>{book.status}</span>
              </div>
              <div style={{ color: "#9ca3af", fontSize: 20 }}>›</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SearchTab({ filteredBooks, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, wishlist, toggleWishlist, setSelectedBook, setScreen }) {
  return (
    <div className="fade-in">
      <h1 style={{ fontWeight: 800, fontSize: 24, color: "#1e1b4b", marginBottom: 20 }}>Search Library</h1>
      <div style={{ position: "relative", marginBottom: 20 }}>
        <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 18 }}>🔍</span>
        <input className="search-input" placeholder="Search by title, author, or ISBN..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        {searchQuery && <button onClick={() => setSearchQuery("")} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "#e5e7eb", border: "none", borderRadius: 99, width: 24, height: 24, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ whiteSpace: "nowrap", padding: "8px 18px", borderRadius: 99, border: "1.5px solid", borderColor: selectedCategory === cat ? "#7c3aed" : "#e5e7eb", background: selectedCategory === cat ? "#7c3aed" : "white", color: selectedCategory === cat ? "white" : "#6b7280", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "Outfit", transition: "all .2s" }}>
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#9ca3af" }}>SEARCH RESULTS ({filteredBooks.length})</div>
        {/* A-Z index */}
        <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {ALPHABET.slice(0, 8).map(l => <button key={l} onClick={() => {}} style={{ width: 20, height: 20, fontSize: 10, fontWeight: 600, background: "none", border: "none", color: "#c4b5fd", cursor: "pointer", fontFamily: "Outfit" }}>{l}</button>)}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {filteredBooks.map(book => (
          <div key={book.id} className="card book-card" style={{ padding: "18px 20px", display: "flex", gap: 16, alignItems: "center", border: "1.5px solid #f3f0ff", cursor: "pointer" }}
            onClick={() => { setSelectedBook(book); setScreen("book-detail"); }}>
            <div style={{ width: 56, height: 74, background: `linear-gradient(135deg, ${book.color}, ${book.color}cc)`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0, boxShadow: `0 4px 12px ${book.color}33` }}>
              {book.cover}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: "#1e1b4b", fontSize: 15, marginBottom: 3, lineHeight: 1.3 }}>{book.title}</div>
              <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 10 }}>{book.author}</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span className={`tag tag-${book.status}`}>{book.status}</span>
                <span style={{ fontSize: 12, color: "#c4b5fd" }}>⭐ {book.rating}</span>
              </div>
            </div>
            <button onClick={e => { e.stopPropagation(); toggleWishlist(book.id); }} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: wishlist.includes(book.id) ? "#ef4444" : "#d1d5db" }}>
              {wishlist.includes(book.id) ? "❤️" : "🤍"}
            </button>
          </div>
        ))}
        {filteredBooks.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>No books found</div>
            <div style={{ fontSize: 14, marginTop: 8 }}>Try a different search term</div>
          </div>
        )}
      </div>
    </div>
  );
}

function MyBooksTab({ myBooks, setSelectedBook, setScreen }) {
  return (
    <div className="fade-in">
      <h1 style={{ fontWeight: 800, fontSize: 24, color: "#1e1b4b", marginBottom: 8 }}>My Books</h1>
      <p style={{ color: "#9ca3af", marginBottom: 24 }}>{myBooks.length} book{myBooks.length !== 1 ? "s" : ""} currently issued</p>
      {myBooks.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>No books issued yet</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {myBooks.map((book, i) => (
            <div key={book.id} className="card book-card" style={{ padding: "20px", display: "flex", gap: 16, border: "1.5px solid #f3f0ff", cursor: "pointer" }}
              onClick={() => { setSelectedBook(book); setScreen("book-detail"); }}>
              <div style={{ width: 60, height: 80, background: `linear-gradient(135deg, ${book.color}, ${book.color}cc)`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>
                {book.cover}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: "#1e1b4b", fontSize: 15, marginBottom: 4 }}>{book.title}</div>
                <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 12 }}>{book.author}</div>
                <div style={{ background: "#f5f3ff", borderRadius: 99, height: 6, overflow: "hidden", marginBottom: 6 }}>
                  <div style={{ width: `${[65, 30, 80][i % 3]}%`, height: "100%", background: "linear-gradient(90deg, #7c3aed, #9333ea)", borderRadius: 99 }} />
                </div>
                <div style={{ fontSize: 12, color: "#7c3aed", fontWeight: 600 }}>{[65, 30, 80][i % 3]}% Complete</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BookDetail({ book, wishlist, toggleWishlist, requestIssue, issuedBooks, onBack }) {
  const issued = issuedBooks.includes(book.id);
  return (
    <div className="fade-in" style={{ minHeight: "80vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 24, color: "#374151" }}>←</button>
        <button onClick={() => toggleWishlist(book.id)} style={{ background: "none", border: "none", fontSize: 28, cursor: "pointer" }}>{wishlist.includes(book.id) ? "❤️" : "🤍"}</button>
      </div>
      <div style={{ width: "100%", height: 220, background: `linear-gradient(135deg, ${book.color}, ${book.color}cc)`, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, marginBottom: 28, boxShadow: `0 20px 60px ${book.color}44` }}>
        {book.cover}
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
        <span className="tag" style={{ background: "#ede9fe", color: "#7c3aed" }}>{book.category}</span>
        <span className={`tag tag-${book.status}`}>{book.status === "available" ? "✅ Available" : "🔴 Issued"}</span>
      </div>
      <h1 style={{ fontWeight: 800, fontSize: 28, color: "#1e1b4b", marginBottom: 8, lineHeight: 1.2 }}>{book.title}</h1>
      <div style={{ fontWeight: 600, color: "#7c3aed", fontSize: 16, marginBottom: 4 }}>{book.author}</div>
      <div style={{ fontSize: 14, color: "#9ca3af", marginBottom: 24 }}>{book.edition} · {book.publisher}</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
        {[["📍", "Rack", book.rack], ["📦", "Slot", book.slot], ["🌐", "Language", book.lang], ["⭐", "Rating", `${book.rating} / 5`]].map(([icon, label, value]) => (
          <div key={label} className="card" style={{ padding: "16px", textAlign: "center", border: "1.5px solid #f3f0ff" }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 4 }}>Rack</div>
            <div style={{ fontWeight: 700, color: "#1e1b4b", fontSize: 16 }}>{value}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: "24px", marginBottom: 28, border: "1.5px solid #f3f0ff" }}>
        <h3 style={{ fontWeight: 700, color: "#1e1b4b", marginBottom: 12 }}>About this Book</h3>
        <p style={{ color: "#6b7280", lineHeight: 1.7, fontSize: 15 }}>{book.desc}</p>
      </div>

      <button className="btn-primary" onClick={() => requestIssue(book)} style={{ width: "100%", padding: "16px", fontSize: 16 }} disabled={issued}>
        {issued ? "✅ Already Issued" : "📋 Request Book Issue"}
      </button>
    </div>
  );
}

function AdminPanel({ tab, setTab, books, issuedBooks, onLogout, showNotification }) {
  const [newBook, setNewBook] = useState({ title: "", author: "", category: "Science" });
  const overdue = 12;

  return (
    <div style={{ minHeight: "100vh", background: "#f5f4ff" }}>
      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid #ede9fe", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 40, height: 40, background: "linear-gradient(135deg,#7c3aed,#9333ea)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📖</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: "#1e1b4b" }}>Easy Library Admin</div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>Management Console</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 22 }}>👩‍💼</span>
          <div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>Welcome back,</div>
            <div style={{ fontWeight: 700, color: "#1e1b4b", fontSize: 14 }}>Sarah Jenkins</div>
          </div>
          <button onClick={onLogout} style={{ background: "#fee2e2", border: "none", color: "#dc2626", borderRadius: 8, padding: "6px 14px", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "Outfit" }}>Logout</button>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 73px)" }}>
        {/* Sidebar */}
        <div style={{ width: 220, background: "white", borderRight: "1px solid #ede9fe", padding: "24px 16px", flexShrink: 0 }}>
          {[["📊", "Dashboard", "dashboard"], ["📚", "Catalog", "catalog"], ["⚠️", "Issue/Return", "issue"], ["👥", "Users", "users"], ["⚙️", "Maintenance", "maintenance"]].map(([icon, label, t]) => (
            <button key={t} onClick={() => setTab(t)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, border: "none", background: tab === t ? "#f5f3ff" : "transparent", color: tab === t ? "#7c3aed" : "#6b7280", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "Outfit", marginBottom: 4, textAlign: "left", transition: "all .2s" }}>
              <span style={{ fontSize: 18 }}>{icon}</span>{label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
          {tab === "dashboard" && (
            <div className="fade-in">
              <h2 style={{ fontWeight: 800, fontSize: 22, color: "#1e1b4b", marginBottom: 24 }}>Overview</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
                {[["📤", "Issued Today", 42, "+5%", "#d1fae5", "#059669"], ["⚠️", "Overdue", overdue, "Alert", "#fee2e2", "#dc2626"], ["📚", "Total Books", books.length, "In catalog", "#ede9fe", "#7c3aed"], ["👥", "Active Users", 1240, "+12%", "#dbeafe", "#2563eb"]].map(([icon, label, val, sub, bg, col]) => (
                  <div key={label} className="card" style={{ padding: "24px", border: "1.5px solid #f3f0ff" }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 6 }}>{label}</div>
                    <div style={{ fontSize: 32, fontWeight: 800, color: "#1e1b4b" }}>{val}</div>
                    <div style={{ display: "inline-block", background: bg, color: col, padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 700, marginTop: 8 }}>{sub}</div>
                  </div>
                ))}
              </div>
              <h3 style={{ fontWeight: 700, color: "#1e1b4b", marginBottom: 16 }}>Management Console</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[["📖", "Add New Book", "Catalog new titles and ISBNs", "catalog"], ["✏️", "Update Book Details", "Modify metadata or availability", "catalog"], ["🔄", "Manage Issue/Return", "Check-in and check-out books", "issue"], ["👤", "Manage Users", "Student records & permissions", "users"], ["🔧", "System Maintenance", "Backups, logs, and settings", "maintenance"]].map(([icon, title, desc, t]) => (
                  <div key={title} className="card book-card" style={{ padding: "18px 22px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer", border: "1.5px solid #f3f0ff" }} onClick={() => setTab(t)}>
                    <div style={{ width: 44, height: 44, background: "#f5f3ff", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: "#1e1b4b", fontSize: 15 }}>{title}</div>
                      <div style={{ fontSize: 13, color: "#9ca3af" }}>{desc}</div>
                    </div>
                    <span style={{ color: "#9ca3af", fontSize: 20 }}>›</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "catalog" && (
            <div className="fade-in">
              <h2 style={{ fontWeight: 800, fontSize: 22, color: "#1e1b4b", marginBottom: 24 }}>Book Catalog</h2>
              <div className="card" style={{ padding: "24px", marginBottom: 24, border: "1.5px solid #ede9fe" }}>
                <h3 style={{ fontWeight: 700, color: "#1e1b4b", marginBottom: 16 }}>Add New Book</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <input className="input" placeholder="Book Title" value={newBook.title} onChange={e => setNewBook(b => ({ ...b, title: e.target.value }))} />
                  <input className="input" placeholder="Author" value={newBook.author} onChange={e => setNewBook(b => ({ ...b, author: e.target.value }))} />
                  <select className="input" value={newBook.category} onChange={e => setNewBook(b => ({ ...b, category: e.target.value }))}>
                    {CATEGORIES.slice(1).map(c => <option key={c}>{c}</option>)}
                  </select>
                  <button className="btn-primary" onClick={() => { showNotification("Book added successfully! 📚"); setNewBook({ title: "", author: "", category: "Science" }); }}>Add Book</button>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {books.map(book => (
                  <div key={book.id} className="card" style={{ padding: "16px 20px", display: "flex", gap: 14, alignItems: "center", border: "1.5px solid #f3f0ff" }}>
                    <div style={{ width: 44, height: 56, background: `linear-gradient(135deg, ${book.color}, ${book.color}cc)`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{book.cover}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: "#1e1b4b", fontSize: 14 }}>{book.title}</div>
                      <div style={{ fontSize: 12, color: "#9ca3af" }}>{book.author} · {book.category}</div>
                    </div>
                    <span className={`tag tag-${book.status}`}>{book.status}</span>
                    <button onClick={() => showNotification("Book updated!")} style={{ background: "#f5f3ff", border: "none", color: "#7c3aed", borderRadius: 8, padding: "6px 14px", fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: "Outfit" }}>Edit</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "issue" && (
            <div className="fade-in">
              <h2 style={{ fontWeight: 800, fontSize: 22, color: "#1e1b4b", marginBottom: 24 }}>Issue / Return Management</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
                {[["📤", "Total Issued", issuedBooks.length], ["⚠️", "Overdue", overdue]].map(([icon, label, val]) => (
                  <div key={label} className="card" style={{ padding: "24px", textAlign: "center", border: "1.5px solid #f3f0ff" }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
                    <div style={{ fontWeight: 800, fontSize: 36, color: "#1e1b4b" }}>{val}</div>
                    <div style={{ fontSize: 14, color: "#9ca3af", marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>
              <h3 style={{ fontWeight: 700, color: "#1e1b4b", marginBottom: 16 }}>Currently Issued Books</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {BOOKS.filter(b => issuedBooks.includes(b.id)).map(book => (
                  <div key={book.id} className="card" style={{ padding: "16px 20px", display: "flex", gap: 14, alignItems: "center", border: "1.5px solid #f3f0ff" }}>
                    <div style={{ fontSize: 24 }}>{book.cover}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: "#1e1b4b", fontSize: 14 }}>{book.title}</div>
                      <div style={{ fontSize: 12, color: "#9ca3af" }}>Issued · Due in 5 days</div>
                    </div>
                    <button onClick={() => showNotification(`"${book.title}" returned!`)} style={{ background: "#d1fae5", border: "none", color: "#059669", borderRadius: 8, padding: "6px 14px", fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: "Outfit" }}>Return</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "users" && (
            <div className="fade-in">
              <h2 style={{ fontWeight: 800, fontSize: 22, color: "#1e1b4b", marginBottom: 24 }}>User Management</h2>
              {[{ name: "Alex Johnson", email: "alex@university.edu", dept: "Computer Science", books: 3 }, { name: "Maya Patel", email: "maya@university.edu", dept: "Physics", books: 1 }, { name: "Liam Chen", email: "liam@university.edu", dept: "Literature", books: 2 }, { name: "Sara Kim", email: "sara@university.edu", dept: "Mathematics", books: 0 }].map((user, i) => (
                <div key={i} className="card" style={{ padding: "18px 22px", display: "flex", alignItems: "center", gap: 16, marginBottom: 12, border: "1.5px solid #f3f0ff" }}>
                  <div style={{ width: 44, height: 44, background: "linear-gradient(135deg, #7c3aed, #9333ea)", borderRadius: 99, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, color: "white" }}>👤</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: "#1e1b4b" }}>{user.name}</div>
                    <div style={{ fontSize: 13, color: "#9ca3af" }}>{user.email} · {user.dept}</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontWeight: 800, color: "#7c3aed", fontSize: 20 }}>{user.books}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>books</div>
                  </div>
                  <button onClick={() => showNotification(`Viewing ${user.name}'s profile`)} style={{ background: "#f5f3ff", border: "none", color: "#7c3aed", borderRadius: 8, padding: "6px 14px", fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: "Outfit" }}>View</button>
                </div>
              ))}
            </div>
          )}

          {tab === "maintenance" && (
            <div className="fade-in">
              <h2 style={{ fontWeight: 800, fontSize: 22, color: "#1e1b4b", marginBottom: 24 }}>System Maintenance</h2>
              {[["💾", "Backup Database", "Create a full backup of all library data", "#d1fae5", "#059669"], ["📋", "Export Reports", "Download usage and issue reports", "#dbeafe", "#2563eb"], ["🔄", "Sync Catalog", "Sync with external library systems", "#ede9fe", "#7c3aed"], ["🗑️", "Clear Logs", "Remove old system logs", "#fee2e2", "#dc2626"]].map(([icon, label, desc, bg, col]) => (
                <div key={label} className="card book-card" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, marginBottom: 14, cursor: "pointer", border: "1.5px solid #f3f0ff" }}
                  onClick={() => showNotification(`${label} completed!`)}>
                  <div style={{ width: 48, height: 48, background: bg, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: "#1e1b4b", fontSize: 15 }}>{label}</div>
                    <div style={{ fontSize: 13, color: "#9ca3af" }}>{desc}</div>
                  </div>
                  <span style={{ color: col, fontWeight: 700, fontSize: 14 }}>Run →</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid #ede9fe", display: "flex", justifyContent: "space-around", padding: "8px 0", zIndex: 100 }}>
        {[["📊", "Dashboard", "dashboard"], ["📚", "Catalog", "catalog"], ["⚠️", "Alerts", "issue"], ["⚙️", "Config", "maintenance"]].map(([icon, label, t]) => (
          <button key={t} className={`nav-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            <span style={{ fontSize: 22 }}>{icon}</span>{label}
          </button>
        ))}
      </div>
    </div>
  );
}
