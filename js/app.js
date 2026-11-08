/**
 * js/app.js
 * สมองและการควบคุมการทำงานทั้งหมด (Core Application Logic)
 * ครอบคลุม: จัดการฐานข้อมูล LocalStorage, คำนวณตัดสต็อก (-1), คืนสต็อก (+1), ค้นหา และส่งออกข้อมูล
 */

// 1. ดึงข้อมูลจาก LocalStorage ถ้าไม่มีให้ใช้จาก js/data.js
let books = JSON.parse(localStorage.getItem('ws_lib_books')) || DEFAULT_BOOKS;
let records = JSON.parse(localStorage.getItem('ws_lib_records')) || DEFAULT_RECORDS;

// บันทึกสถานะล่าสุดลง LocalStorage เสมอ
function persistState() {
  localStorage.setItem('ws_lib_books', JSON.stringify(books));
  localStorage.setItem('ws_lib_records', JSON.stringify(records));
  refreshAllViews();
}

// 2. เริ่มต้นทำงานเมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', () => {
  refreshAllViews();
});

// 3. ฟังก์ชันอัปเดตมุมมองหน้าจอทั้งหมด (Refresh Views)
function refreshAllViews() {
  updateMetrics();
  renderBooksGrid(books);
  renderActiveBorrowsTable();
  renderHistoryTable();
}

// 4. คำนวณตัวเลขแผงสถิติ (Metrics Dashboard)
function updateMetrics() {
  const totalStock = books.reduce((sum, b) => sum + b.totalStock, 0);
  const availableStock = books.reduce((sum, b) => sum + b.stock, 0);
  const activeBorrows = records.filter(r => r.status === 'borrowed').length;

  document.getElementById('metric-total-stock').textContent = totalStock;
  document.getElementById('metric-available-stock').textContent = availableStock;
  document.getElementById('metric-active-borrowed').textContent = activeBorrows;
  document.getElementById('metric-total-transactions').textContent = records.length;
  document.getElementById('badge-active-count').textContent = activeBorrows;
}

// 5. แสดงผลการ์ดหนังสือในคลัง (Render Catalog)
function renderBooksGrid(items) {
  const container = document.getElementById('books-grid-container');
  container.innerHTML = '';

  if (items.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--color-muted);">
        <div style="font-size: 40px; margin-bottom: 10px;">🔍</div>
        <div style="font-size: 16px; font-weight: 700;">ไม่พบหนังสือที่ตรงกับคำค้นหา</div>
        <div style="font-size: 13px; margin-top: 4px;">ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่น</div>
      </div>
    `;
    return;
  }

  items.forEach(book => {
    const isOutOfStock = book.stock <= 0;
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
      <div class="book-thumb" style="background: ${book.bg || '#f1f5f9'}">
        <span class="book-cat-pill">${book.category}</span>
        <span>${book.icon || '📖'}</span>
      </div>
      <div class="book-title">${book.title}</div>
      <div class="book-author">✍️ ${book.author}</div>
      <div class="book-footer">
        <div class="stock-indicator ${isOutOfStock ? 'out-of-stock' : 'in-stock'}">
          ${isOutOfStock ? '🔴 หมดสต็อก' : '🟢 คงเหลือ'} 
          (${book.stock}/${book.totalStock})
        </div>
        <button class="btn btn-primary" ${isOutOfStock ? 'disabled' : ''} onclick="openBorrowModal('${book.id}')">
          ${isOutOfStock ? 'หมดแล้ว' : 'ขอยืม'}
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

// 6. แสดงตารางรายการที่กำลังยืม (Active Borrows Table)
function renderActiveBorrowsTable() {
  const tbody = document.getElementById('table-active-body');
  const activeItems = records.filter(r => r.status === 'borrowed');
  tbody.innerHTML = '';

  if (activeItems.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 40px; color: var(--color-muted);">
          🎉 ขณะนี้ไม่มีรายการค้างส่ง หนังสือทุกเล่มพร้อมให้บริการในคลัง
        </td>
      </tr>
    `;
    return;
  }

  activeItems.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong style="color: var(--color-primary);">${item.id}</strong></td>
      <td><strong>${item.bookTitle}</strong></td>
      <td>${item.studentName}</td>
      <td>${item.studentRoom} <span style="color: var(--color-muted);">(${item.studentId})</span></td>
      <td>${item.borrowDate}</td>
      <td><span style="color: #b45309; font-weight: 700;">${item.dueDate}</span></td>
      <td><span class="status-badge borrowed">⏳ กำลังยืม</span></td>
      <td style="text-align: right;">
        <button class="btn btn-success" onclick="handleReturnBook('${item.id}')">
          ↩️ รับคืนหนังสือ
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// 7. แสดงตารางประวัติทั้งหมด (History Table)
function renderHistoryTable() {
  const tbody = document.getElementById('table-history-body');
  tbody.innerHTML = '';

  if (records.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 30px; color: var(--color-muted);">ยังไม่มีประวัติการทำรายการในระบบ</td></tr>`;
    return;
  }

  [...records].reverse().forEach(item => {
    const isReturned = item.status === 'returned';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.id}</td>
      <td><strong>${item.bookTitle}</strong></td>
      <td>${item.studentName}</td>
      <td>${item.studentId}</td>
      <td>${item.borrowDate}</td>
      <td>${item.returnDate || '-'}</td>
      <td>
        <span class="status-badge ${isReturned ? 'returned' : 'borrowed'}">
          ${isReturned ? '✅ คืนเรียบร้อย' : '⏳ กำลังยืม'}
        </span>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ==============================================================
// BUSINESS LOGIC: การยืม (-1) และการคืน (+1)
// ==============================================================

// เปิด Modal ขอยืม
function openBorrowModal(bookId) {
  const book = books.find(b => b.id === bookId);
  if (!book || book.stock <= 0) return;

  document.getElementById('modal-target-book-id').value = book.id;
  document.getElementById('modal-preview-title').textContent = book.title;
  document.getElementById('modal-preview-stock').textContent = book.stock;
  document.getElementById('modal-preview-icon').textContent = book.icon || '📖';

  document.getElementById('input-student-name').value = '';
  document.getElementById('input-student-id').value = '';
  document.getElementById('input-student-room').value = '';

  document.getElementById('modal-borrow').classList.add('active');
}

function closeBorrowModal() {
  document.getElementById('modal-borrow').classList.remove('active');
}

// กดยืนยันการยืม (Deduct Stock -1)
function handleConfirmBorrow(e) {
  e.preventDefault();
  const bookId = document.getElementById('modal-target-book-id').value;
  const name = document.getElementById('input-student-name').value.trim();
  const studentId = document.getElementById('input-student-id').value.trim();
  const room = document.getElementById('input-student-room').value.trim();

  const book = books.find(b => b.id === bookId);
  if (!book || book.stock <= 0) {
    showToast("⚠️ ไม่สามารถทำรายการได้ หนังสือหมดสต็อกแล้ว", "warning");
    return;
  }

  // 1. ตัดยอดสต็อก (-1)
  book.stock -= 1;

  // 2. คำนวณวันที่ยืมและกำหนดส่ง (7 วันข้างหน้า)
  const today = new Date();
  const dueDate = new Date();
  dueDate.setDate(today.getDate() + 7);

  const borrowDateStr = today.toLocaleDateString('th-TH');
  const dueDateStr = dueDate.toLocaleDateString('th-TH');

  // 3. สร้างรหัสรายการและบันทึก
  const newTx = {
    id: "TX-" + Math.floor(1000 + Math.random() * 9000),
    bookId: book.id,
    bookTitle: book.title,
    studentName: name,
    studentId: studentId,
    studentRoom: room,
    borrowDate: borrowDateStr,
    dueDate: dueDateStr,
    returnDate: null,
    status: "borrowed"
  };

  records.push(newTx);
  persistState();
  closeBorrowModal();

  showToast(`🎉 ยืมสำเร็จ! "${book.title}" คงเหลือ ${book.stock} เล่ม`, "success");
}

// กดรับคืนหนังสือ (Restore Stock +1)
function handleReturnBook(transactionId) {
  const tx = records.find(r => r.id === transactionId);
  if (!tx || tx.status !== 'borrowed') return;

  if (!confirm(`ยืนยันการรับคืนหนังสือ:\n"${tx.bookTitle}"\nจาก: ${tx.studentName} ใช่หรือไม่?`)) {
    return;
  }

  // 1. บวกสต็อกคืน (+1)
  const book = books.find(b => b.id === tx.bookId);
  if (book) {
    book.stock = Math.min(book.stock + 1, book.totalStock);
  }

  // 2. อัปเดตสถานะเป็นคืนแล้ว
  tx.status = 'returned';
  tx.returnDate = new Date().toLocaleDateString('th-TH');

  persistState();
  showToast(`✅ รับคืนหนังสือเรียบร้อย! บวกคืนสต็อกสำเร็จ`, "success");
}

// ==============================================================
// ADMIN & UTILITIES
// ==============================================================

// เพิ่มหนังสือใหม่เข้าคลัง
function handleFormAddNewBook(e) {
  e.preventDefault();
  const title = document.getElementById('add-title').value.trim();
  const author = document.getElementById('add-author').value.trim() || 'ไม่ระบุ';
  const category = document.getElementById('add-category').value;
  const stock = parseInt(document.getElementById('add-stock').value, 10);
  const icon = document.getElementById('add-icon').value.trim() || '📘';

  const newId = "B-" + (books.length + 101);
  const bgPalette = ["#e0e7ff", "#fef3c7", "#d1fae5", "#fee2e2"];
  const randomBg = bgPalette[Math.floor(Math.random() * bgPalette.length)];

  books.push({
    id: newId,
    title,
    author,
    category,
    totalStock: stock,
    stock: stock,
    icon,
    bg: randomBg
  });

  persistState();
  showToast(`✨ เพิ่มหนังสือใหม่ "${title}" จำนวน ${stock} เล่มเรียบร้อย`, "success");

  // รีเซ็ตฟอร์มและสลับไปแท็บคลัง
  e.target.reset();
  switchTab('catalog');
}

// สลับแท็บหน้าจอ
function switchTab(viewId) {
  const views = ['catalog', 'active-borrows', 'history', 'admin'];
  views.forEach(v => {
    document.getElementById('view-' + v).classList.remove('active');
  });

  document.querySelectorAll('.nav-tab').forEach((tab, idx) => {
    tab.classList.toggle('active', views[idx] === viewId);
  });

  document.getElementById('view-' + viewId).classList.add('active');
}

// ระบบค้นหาและกรองหนังสือ
function handleSearchFilter() {
  const keyword = document.getElementById('input-search').value.toLowerCase().trim();
  const category = document.getElementById('select-category').value;

  const filtered = books.filter(b => {
    const matchText = b.title.toLowerCase().includes(keyword) ||
                      b.author.toLowerCase().includes(keyword) ||
                      b.id.toLowerCase().includes(keyword);
    const matchCat = (category === 'all') || (b.category === category);
    return matchText && matchCat;
  });

  renderBooksGrid(filtered);
}

// ส่งออกข้อมูลเป็นไฟล์ Excel (CSV)
function exportDataToCSV() {
  if (records.length === 0) {
    showToast("⚠️ ไม่มีประวัติการยืม-คืนให้ส่งออก", "warning");
    return;
  }

  let csvContent = "\uFEFFรหัสรายการ,ชื่อหนังสือ,ชื่อนักเรียนผู้ยืม,รหัสนักเรียน,ชั้น/ห้อง,วันที่ยืม,กำหนดส่งคืน,วันที่คืนจริง,สถานะ\n";
  records.forEach(r => {
    csvContent += `"${r.id}","${r.bookTitle}","${r.studentName}","${r.studentId}","${r.studentRoom}","${r.borrowDate}","${r.dueDate}","${r.returnDate || '-'}","${r.status === 'borrowed' ? 'กำลังยืม' : 'คืนแล้ว'}"\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `รายงานการยืมคืน_ห้องสมุดวัดสิงห์_${new Date().toISOString().slice(0,10)}.csv`;
  link.click();

  showToast("📥 ส่งออกไฟล์ CSV เรียบร้อยแล้ว", "success");
}

// รีเซ็ตฐานข้อมูล
function handleResetDatabase() {
  if (confirm("ต้องการล้างข้อมูลและเริ่มต้นฐานข้อมูลตัวอย่างใหม่ทั้งหมดใช่หรือไม่?")) {
    books = DEFAULT_BOOKS;
    records = DEFAULT_RECORDS;
    persistState();
    showToast("🔄 รีเซ็ตฐานข้อมูลเป็นค่าเริ่มต้นสำเร็จ", "success");
  }
}

// แสดง Toast ข้อความแจ้งเตือน
function showToast(msg, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✅' : '⚠️'}</span> <span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
