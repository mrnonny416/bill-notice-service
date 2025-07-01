<!-- filepath: d:\PUBLIC\Nack\bill-notice-service\app\README.md -->

# Bill Notice Service

ระบบสร้างลิงก์แจ้งหนี้และอัปโหลดสลิป สำหรับงานแอดมินและลูกค้า  
สร้างด้วย Next.js (App Router) + MongoDB

---

## วิธีเริ่มต้นใช้งาน

1. ติดตั้ง dependencies  
   ```bash
   npm install
   ```

2. สร้างไฟล์ `.env.local` ที่ root ของโปรเจค  
   ```env
   MONGODB_URI=mongodb://localhost:27017/bill-notice
   ```

3. รันเซิร์ฟเวอร์ในโหมดพัฒนา  
   ```bash
   npm run dev
   ```
   เปิด [http://localhost:3000](http://localhost:3000) ด้วย browser

---

## โครงสร้างโปรเจค (สำคัญ)

```
app/
├── admin/
│   ├── request/
│   │   └── page.tsx         # หน้าแสดงรายการแจ้งหนี้ (แอดมิน)
│   └── page.tsx             # หน้าแอดมินสร้างลิงก์
├── api/
│   └── link/
│       ├── [id]/
│       │   └── route.ts     # API สำหรับ GET/PATCH แจ้งหนี้แต่ละรายการ
│       └── route.ts         # API สำหรับ POST/GET แจ้งหนี้ทั้งหมด
├── BillNoticePage.tsx       # Client Component สำหรับหน้าแจ้งหนี้ลูกค้า
├── page.tsx                 # Entry point (Server Component, ใช้ Suspense)
├── layout.tsx               # Layout หลักของแอป
└── models/
    └── Link.ts              # Mongoose Schema/Model
```

---

## การใช้งาน

- **แอดมิน**  
  - เข้าหน้า `/admin/request` เพื่อดูรายการแจ้งหนี้
  - เข้าหน้า `/admin` เพื่อสร้างลิงก์แจ้งหนี้ใหม่

- **ลูกค้า**  
  - เปิดลิงก์แจ้งหนี้ผ่าน URL ที่ได้รับ เช่น `/?id=xxxxxxx`
  - ดูยอดค้างชำระ, QR Code, เลขบัญชี, อัปโหลดสลิป และติดตามสถานะ

---

## หมายเหตุ

- หากต้องการใช้งานกับ MongoDB Atlas ให้เปลี่ยนค่า `MONGODB_URI` ใน `.env.local`
- รองรับการ deploy ด้วย Docker และ Vercel
- สามารถปรับแต่ง schema หรือ UI ได้ตามต้องการ

---
