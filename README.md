# Bill Notice Service

ระบบสร้างลิงก์แจ้งหนี้และอัปโหลดสลิป สำหรับงานแอดมินและลูกค้า  
สร้างด้วย [Next.js App Router](https://nextjs.org/docs/app) + MongoDB

---

## รายละเอียดโปรเจค

**Bill Notice Service** คือระบบที่ช่วยให้แอดมินสามารถสร้างลิงก์แจ้งหนี้ให้ลูกค้า ลูกค้าสามารถเข้าดูลิงก์เพื่อชำระเงิน อัปโหลดสลิป และติดตามสถานะการตรวจสอบได้แบบเรียลไทม์  
เหมาะสำหรับธุรกิจที่ต้องการแจ้งหนี้และตรวจสอบการชำระเงินแบบออนไลน์

### ฟีเจอร์หลัก

-   **ฝั่งแอดมิน**

    -   สร้างลิงก์แจ้งหนี้ใหม่ (ระบุชื่อ, จำนวนเงิน ฯลฯ)
    -   ดูรายการลิงก์ทั้งหมด
    -   ตรวจสอบ/อนุมัติ/ไม่อนุมัติ/ยกเลิกการชำระเงินจากสลิปที่ลูกค้าอัปโหลด

-   **ฝั่งลูกค้า**
    -   เปิดลิงก์แจ้งหนี้ (ผ่าน URL ที่มี id)
    -   ดูรายละเอียดยอดค้างชำระ, QR Code, เลขบัญชี
    -   อัปโหลดสลิปโอนเงิน
    -   ติดตามสถานะการตรวจสอบ

---

## วิธีใช้งาน

### 1. เตรียมระบบ

-   ติดตั้ง [Node.js](https://nodejs.org/) (แนะนำ v18 ขึ้นไป)
-   ติดตั้ง [MongoDB](https://www.mongodb.com/) หรือใช้ MongoDB Atlas

### 2. ติดตั้ง dependencies

```bash
npm install
```

### 3. ตั้งค่าเชื่อมต่อฐานข้อมูล

-   สร้างไฟล์ `.env` ที่ **root** ของโปรเจค (ใช้กับ Docker Compose หรือ production)
    ```env
    MONGODB_URI=mongodb://mongo:27017/mydb
    ```
-   สร้างไฟล์ `.env.local` ที่ **/app** (ใช้กับ Next.js development)
    ```env
    MONGODB_URI=mongodb://localhost:27017/mydb
    ```

> **หมายเหตุ:**
>
> -   ถ้าใช้ MongoDB Atlas ให้เปลี่ยนค่า `MONGODB_URI` ให้เป็น connection string ของ Atlas
> -   สามารถสร้างไฟล์ `.env` สำหรับ config อื่นๆ เพิ่มเติมได้

### 4. รันเซิร์ฟเวอร์

**โหมดพัฒนา**

```bash
cd app
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

**โหมด production**

```bash
cd app
npm run build
npm start
```

**หรือใช้ Docker Compose**

```bash
docker compose up -d --build
```

---

## การใช้งาน

-   เข้าหน้าแอดมิน: `/admin/request`
-   สร้างลิงก์ใหม่: `/admin`
-   ลูกค้าเปิดลิงก์แจ้งหนี้: `/?id=xxxxxxx` (id จากแอดมิน)

---

## โครงสร้างไฟล์ (File Tree)

```
bill-notice-service/
├── .env                        # สำหรับ config Docker Compose/production (root)
├── docker-compose.yml          # สำหรับรัน MongoDB และแอปผ่าน Docker
├── app/
│   ├── .env.local              # สำหรับ config Next.js development (ใน /app)
│   ├── package.json
│   ├── BillNoticePage.tsx      # Client Component สำหรับหน้าแจ้งหนี้ลูกค้า
│   ├── page.tsx                # Entry point (Server Component, ใช้ Suspense)
│   ├── layout.tsx              # Layout หลักของแอป
│   ├── admin/
│   │   ├── request/
│   │   │   └── page.tsx        # หน้าแสดงรายการแจ้งหนี้ (แอดมิน)
│   │   └── page.tsx            # หน้าแอดมินสร้างลิงก์
│   ├── api/
│   │   └── link/
│   │       ├── [id]/
│   │       │   └── route.ts    # API สำหรับ GET/PATCH แจ้งหนี้แต่ละรายการ
│   │       └── route.ts        # API สำหรับ POST/GET แจ้งหนี้ทั้งหมด
│   ├── models/
│   │   └── Link.ts             # Mongoose Schema/Model
│   └── public/
│       └── qrcode.png          # ไฟล์ QR Code ตัวอย่าง
├── lib/
│   └── mongodb.ts              # ฟังก์ชันเชื่อมต่อ MongoDB
├── Dockerfile                  # สำหรับ build docker image
├── README.md
└── ... (ไฟล์ config อื่นๆ)
```

---

## หมายเหตุ

-   รองรับการ deploy ด้วย Docker และ Vercel
-   สามารถปรับแต่ง schema หรือ UI ได้ตามต้องการ
-   หากต้องการใช้งานกับ MongoDB Atlas ให้เปลี่ยนค่า `MONGODB_URI` ใน `.env` หรือ `.env.local`
-   มีระบบแยกสิทธิ์แอดมิน (mock login) สำหรับสร้างและตรวจสอบลิงก์

---

**ผู้พัฒนา:**

-   [Next.js](https://nextjs.org/)
