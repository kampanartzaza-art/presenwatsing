/**
 * js/data.js
 * ข้อมูลเริ่มต้น (Mock Database) สำหรับระบบห้องสมุดโรงเรียนวัดสิงห์
 * ใช้สำหรับ Seed เข้าสู่ LocalStorage ในกรณีเปิดระบบครั้งแรก
 */

const DEFAULT_BOOKS = [
  {
    id: "B-101",
    title: "ฟิสิกส์ ม.ปลาย: การเคลื่อนที่และพลังงาน",
    author: "สาขาฟิสิกส์ สสวท.",
    category: "วิทยาศาสตร์",
    totalStock: 5,
    stock: 4,
    icon: "⚛️",
    bg: "#e0e7ff"
  },
  {
    id: "B-102",
    title: "เคมี ม.5 เล่ม 3: เคมีอินทรีย์และการประยุกต์",
    author: "ดร.วิชัย เคมีกุล",
    category: "วิทยาศาสตร์",
    totalStock: 3,
    stock: 1,
    icon: "🧪",
    bg: "#fef3c7"
  },
  {
    id: "B-103",
    title: "แคลคูลัสและเรขาคณิตวิเคราะห์สำหรับ ม.ปลาย",
    author: "อ.สมเกียรติ คณิตศาสตร์",
    category: "คณิตศาสตร์",
    totalStock: 4,
    stock: 4,
    icon: "📐",
    bg: "#d1fae5"
  },
  {
    id: "B-104",
    title: "TCAS English Vocab & Grammar Hack",
    author: "ครูพี่แอน Smart English",
    category: "ภาษาและสังคม",
    totalStock: 6,
    stock: 2,
    icon: "🌍",
    bg: "#fee2e2"
  },
  {
    id: "B-105",
    title: "วิทยาการคำนวณ & การใช้งาน Generative AI",
    author: "กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี",
    category: "คอมพิวเตอร์และ AI",
    totalStock: 5,
    stock: 5,
    icon: "🤖",
    bg: "#e0e7ff"
  },
  {
    id: "B-106",
    title: "เจ้าชายน้อย (The Little Prince) ฉบับสองภาษา",
    author: "อ็องตวน เดอ แซ็งแตกซูว์เปรี",
    category: "วรรณกรรมและการ์ตูน",
    totalStock: 2,
    stock: 0,
    icon: "⭐",
    bg: "#fef3c7"
  },
  {
    id: "B-107",
    title: "ชีววิทยา ม.6: พันธุศาสตร์และวิวัฒนาการ",
    author: "สถาบันส่งเสริมการสอนวิทยาศาสตร์และเทคโนโลยี",
    category: "วิทยาศาสตร์",
    totalStock: 4,
    stock: 3,
    icon: "🧬",
    bg: "#d1fae5"
  },
  {
    id: "B-108",
    title: "ประวัติศาสตร์สากลร่วมสมัย และสังคมโลก",
    author: "ฝ่ายวิชาการสังคมศึกษา วัดสิงห์",
    category: "ภาษาและสังคม",
    totalStock: 3,
    stock: 2,
    icon: "🏛️",
    bg: "#fee2e2"
  }
];

// ชุดข้อมูลประวัติตัวอย่างตั้งต้น (Sample Initial Transactions)
const DEFAULT_RECORDS = [
  {
    id: "TX-901",
    bookId: "B-102",
    bookTitle: "เคมี ม.5 เล่ม 3: เคมีอินทรีย์และการประยุกต์",
    studentName: "นายภาณุวิชญ์ สดใส",
    studentId: "48211",
    studentRoom: "ม.5/1 เลขที่ 3",
    borrowDate: "01/11/2026",
    dueDate: "08/11/2026",
    returnDate: null,
    status: "borrowed"
  },
  {
    id: "TX-902",
    bookId: "B-104",
    bookTitle: "TCAS English Vocab & Grammar Hack",
    studentName: "น.ส.กานต์พิชชา บุญญา",
    studentId: "48235",
    studentRoom: "ม.5/1 เลขที่ 19",
    borrowDate: "03/11/2026",
    dueDate: "10/11/2026",
    returnDate: null,
    status: "borrowed"
  },
  {
    id: "TX-903",
    bookId: "B-106",
    bookTitle: "เจ้าชายน้อย (The Little Prince) ฉบับสองภาษา",
    studentName: "นายธนกฤต มั่งคั่ง",
    studentId: "49102",
    studentRoom: "ม.4/3 เลขที่ 7",
    borrowDate: "28/10/2026",
    dueDate: "04/11/2026",
    returnDate: "02/11/2026",
    status: "returned"
  }
];
