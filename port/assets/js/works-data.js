/* =========================================================
   ข้อมูลผลงานทั้งหมด
   ---------------------------------------------------------
   วิธีเพิ่มผลงานใหม่:
   1. คัดลอกบล็อก { ... } ในหมวดที่ต้องการ
   2. ใส่ id = รหัสวิดีโอ YouTube จากลิงก์
      เช่น https://www.youtube.com/watch?v=OBi0TRJlEZc
      → id คือ "OBi0TRJlEZc"
   3. ใส่ start (วินาที) ถ้าอยากให้เริ่มเล่นที่จุดใดจุดหนึ่ง (ไม่ใส่ก็ได้)
   4. title    = ชื่อสั้นที่แสดงบนการ์ด
      fullTitle = ชื่อเต็มจาก YouTube (ใช้เป็น tooltip และชื่อในเครื่องเล่น)
   5. บันทึกไฟล์ แล้วรีเฟรชหน้าเว็บ
   ========================================================= */

const WORKS = {
  // ----- คลิปยาว (แนวนอน 16:9) -----
  long: [
    {
      id: "OBi0TRJlEZc",
      start: 40,
      title: "รีวิว Honda UC3 รถไฟฟ้าล้วน",
      fullTitle: "รีวิวรถไฟฟ้าล้วนๆ กับ Honda UC3…คันนี้โดนใจไหม?",
      note: "รีวิวรถไฟฟ้า · YouTube",
      badge: "YouTube",
    },
    {
      id: "9X6fKFOa5rQ",
      title: "MICHELIN ANAKEE Camp Experience",
      fullTitle: "ลุยแคมป์สุดมันของชาวสองล้อ MICHELIN ANAKEE CAMP EXPERIENCE",
      note: "แคมป์ออฟโรด · YouTube",
      badge: "YouTube",
    },
    {
      id: "FHYhvADw5C8",
      title: "รีวิว ZONTES 368G 2026",
      fullTitle: "รีวิว ZONTES 368G 2026 อัปเกรดโคตรเยอะ เบาลง 6 โล ใส่คันเร่งไฟฟ้า + Cruise มาให้แล้ว!",
      note: "รีวิวสกู๊ตเตอร์ · YouTube",
      badge: "YouTube",
    },
  ],

  // ----- คลิปสั้น (แนวตั้ง 9:16) -----
  short: [
    {
      id: "7CUN8cZ_G6s",
      title: "ความลับของรถขี่ดี อยู่ที่โช้ค Profender",
      fullTitle: "ความลับของรถขี่ดี…ไม่ใช่เครื่อง! แต่คือ ‘โช้ค’ Profender TYPE4 / AIR PLUS / FLASH PLUS",
      note: "ช่วงล่าง · Shorts",
      badge: "Shorts",
    },
    {
      id: "a35X0aboHzg",
      title: "3 จุดเปลี่ยน Yamaha PG-1",
      fullTitle: "3 จุดเปลี่ยนที่ทำให้ “โมเป็ดคันนี้...ไม่ธรรมดา” Yamaha PG-1 ไปดูกัน!",
      note: "แต่งรถ · Shorts",
      badge: "Shorts",
    },
    {
      id: "L0hXN_6hytw",
      title: "ชีวิตชิล ๆ กับเวสป้า",
      fullTitle: "นี่แหละ…ชีวิตชิล ๆ ที่ไม่ต้องเร่งรีบ 🛵 แค่มีเวสป้า ก็พอแล้ว",
      note: "ไลฟ์สไตล์ · Shorts",
      badge: "Shorts",
    },
    {
      id: "emX_YYI2oM8",
      title: "Mini Panda มินิไบค์น่ารัก",
      fullTitle: "Mini Panda มินิไบค์น้องใหม่สุดน่ารัก",
      note: "มินิไบค์ · Shorts",
      badge: "Shorts",
    },
  ],
};
