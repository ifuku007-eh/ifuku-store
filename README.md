# Ifuku MLBB Store ⚡

> Mini Project E-Commerce Game Store — Mobile Legends Diamond & Item Shop

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) |
| State Management | Zustand |
| Database & Auth | Supabase |
| Payment Gateway | Midtrans (Sandbox) |
| Email Service | Resend |
| Styling | Tailwind CSS |

---

## Features

- **Auth** — Login & Register via Supabase Auth, route protection
- **Shop** — Product listing dari database, real-time UI
- **Cart** — Keranjang dengan Zustand + persist ke localStorage
- **Checkout** — Midtrans Snap, berbagai metode pembayaran
- **Redeem Code** — Auto-generate & kirim ke email setelah bayar
- **Admin Panel** — Kelola produk & monitoring transaksi

---

## User Flow

```
Login / Register
      ↓
   Shop (pilih produk)
      ↓
   Cart (review & quantity)
      ↓
   Checkout (input email + Midtrans)
      ↓
   Payment Success
      ↓
   Redeem Code (tampil di layar + dikirim ke email)
```

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/ifuku007-eh/ifuku-store.git
cd ifuku-store
npm install
```

### 2. Setup Environment Variables

Buat file `.env.local` di root project:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Midtrans
MIDTRANS_SERVER_KEY=your_midtrans_server_key
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_midtrans_client_key

# Resend
RESEND_API_KEY=your_resend_api_key
```

> ⚠️ Jangan pernah expose `SUPABASE_SERVICE_ROLE_KEY` ke frontend.

### 3. Setup Database (Supabase)

Jalankan SQL berikut di Supabase SQL Editor:

```sql
-- Tambah kolom redeem_code ke order_items jika belum ada
ALTER TABLE public.order_items
ADD COLUMN IF NOT EXISTS redeem_code text;
```

Pastikan fungsi RPC `decrement_stock` sudah ada di database.

### 4. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
├── app/
│   ├── cart/              # Halaman keranjang
│   ├── shop/              # Halaman produk
│   ├── payment-success/   # Halaman setelah bayar
│   ├── admin/             # Admin panel
│   └── api/
│       ├── midtrans/      # Buat transaksi Midtrans
│       ├── midtrans/webhook/  # Webhook notifikasi Midtrans
│       └── payment-success/   # Proses pasca pembayaran
├── components/
│   └── PaymentModal.tsx   # Modal checkout
├── features/
│   └── cart/
│       └── cart-store.ts  # Zustand cart store
└── lib/
    ├── supabase.ts         # Supabase client (anon)
    ├── supabase-server.ts  # Supabase client (service role)
    └── format.ts           # Helper format rupiah
```

---

## Payment Flow (Detail)

```
1. User klik Checkout
2. Frontend validasi stock via Supabase
3. POST /api/midtrans → buat order + dapat token & orderId
4. Midtrans Snap popup
5. User bayar
6. onSuccess → POST /api/payment-success dengan orderId
7. Server:
   a. Lock order (status: pending → processing)
   b. Atomic decrement stock via RPC
   c. Insert order_items + redeem_code
   d. Update order status → success
   e. Kirim email via Resend
8. Redirect ke /payment-success?code=...
```

---

## Stock Protection

- Stock dicek **dua kali**: sebelum popup Midtrans (frontend) dan setelah bayar (backend)
- `decrement_stock` menggunakan **atomic RPC** di Supabase untuk cegah race condition
- **Idempotency guard**: order yang sudah `success` tidak diproses ulang
- **Optimistic lock**: status diubah ke `processing` sebelum proses, rollback ke `pending` jika gagal

---

## Role System

| Role | Akses |
|---|---|
| User | Shop, Cart, Checkout, Redeem Code |
| Admin | Semua + tambah/hapus produk, restock, lihat semua order |

---

## Known Limitations

- Midtrans Sandbox tidak support `localhost` sepenuhnya (normal di development)
- Concurrency handling masih basic — untuk skala besar perlu database-level locking
- Belum ada refresh token handling otomatis

---

## License

MIT — Free to use for learning & portfolio purposes.