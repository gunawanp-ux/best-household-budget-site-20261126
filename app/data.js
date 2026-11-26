// DompetKeluarga — data awal (seed) untuk keluarga contoh.
// Semua angka dalam rupiah. Bulan berjalan: November 2026.
// Data ini hanya dipakai saat pertama kali dibuka; setelah itu
// perubahan pengguna tersimpan di localStorage (lihat store.js).

var DK_SEED = {
  household: "Keluarga Pradasta",
  members: 4,
  month: "2026-11",
  categories: [
    { id: "belanja",    name: "Belanja Harian",   color: "#2e7d52", icon: "B" },
    { id: "makan",      name: "Makan & Jajan",    color: "#c98a1b", icon: "M" },
    { id: "transport",  name: "Transportasi",     color: "#2f6fb2", icon: "T" },
    { id: "tagihan",    name: "Tagihan & Utilitas", color: "#7a4fa3", icon: "U" },
    { id: "pendidikan", name: "Pendidikan",      color: "#0e7c7b", icon: "P" },
    { id: "kesehatan",  name: "Kesehatan",       color: "#c2452d", icon: "K" },
    { id: "hiburan",    name: "Hiburan",         color: "#b0527a", icon: "H" },
    { id: "lainnya",    name: "Lainnya",         color: "#6b7280", icon: "L" }
  ],
  budgets: {
    belanja: 2500000, makan: 1500000, transport: 900000, tagihan: 1800000,
    pendidikan: 1200000, kesehatan: 500000, hiburan: 600000, lainnya: 400000
  },
  goals: [
    { id: "darurat",  name: "Dana Darurat",     target: 10000000, saved: 6250000, note: "Target 6x pengeluaran bulanan" },
    { id: "liburan",  name: "Liburan Keluarga", target: 5000000,  saved: 2100000, note: "Pantai Pangandaran, libur sekolah" },
    { id: "motor",    name: "DP Motor Baru",    target: 15000000, saved: 4800000, note: "Ganti motor lama yang sering mogok" }
  ],
  transactions: [
    { id: "t01", date: "2026-11-01", type: "income",  category: "",          desc: "Gaji bulanan — Ayah",        amount: 8500000 },
    { id: "t02", date: "2026-11-01", type: "expense", category: "tagihan",   desc: "Listrik PLN",              amount: 425000 },
    { id: "t03", date: "2026-11-01", type: "expense", category: "tagihan",   desc: "Air PDAM",                 amount: 185000 },
    { id: "t04", date: "2026-11-02", type: "expense", category: "belanja",   desc: "Belanja mingguan pasar",   amount: 385000 },
    { id: "t05", date: "2026-11-03", type: "expense", category: "transport", desc: "Bensin motor",             amount: 50000 },
    { id: "t06", date: "2026-11-03", type: "expense", category: "makan",     desc: "Makan siang keluarga",     amount: 120000 },
    { id: "t07", date: "2026-11-04", type: "expense", category: "pendidikan", desc: "SPP sekolah anak",        amount: 750000 },
    { id: "t08", date: "2026-11-05", type: "income",  category: "",          desc: "Freelance desain — Ibu",   amount: 1200000 },
    { id: "t09", date: "2026-11-06", type: "expense", category: "belanja",   desc: "Sembako bulanan",          amount: 640000 },
    { id: "t10", date: "2026-11-07", type: "expense", category: "hiburan",   desc: "Nonton bioskop",           amount: 180000 },
    { id: "t11", date: "2026-11-08", type: "expense", category: "makan",     desc: "Jajan anak sekolah",       amount: 75000 },
    { id: "t12", date: "2026-11-09", type: "expense", category: "transport", desc: "Ojek online",              amount: 45000 },
    { id: "t13", date: "2026-11-10", type: "expense", category: "kesehatan", desc: "Vitamin & obat flu",       amount: 135000 },
    { id: "t14", date: "2026-11-11", type: "expense", category: "belanja",   desc: "Belanja mingguan pasar",   amount: 410000 },
    { id: "t15", date: "2026-11-12", type: "expense", category: "tagihan",   desc: "Internet rumah",           amount: 350000 },
    { id: "t16", date: "2026-11-13", type: "expense", category: "makan",     desc: "Makan malam di luar",      amount: 215000 },
    { id: "t17", date: "2026-11-14", type: "expense", category: "transport", desc: "Bensin motor",             amount: 50000 },
    { id: "t18", date: "2026-11-15", type: "income",  category: "",          desc: "Jual barang bekas",        amount: 350000 },
    { id: "t19", date: "2026-11-16", type: "expense", category: "pendidikan", desc: "Buku & alat tulis",       amount: 220000 },
    { id: "t20", date: "2026-11-17", type: "expense", category: "belanja",   desc: "Belanja mingguan pasar",   amount: 395000 },
    { id: "t21", date: "2026-11-18", type: "expense", category: "tagihan",   desc: "Iuran RT & kebersihan",    amount: 75000 },
    { id: "t22", date: "2026-11-19", type: "expense", category: "makan",     desc: "Kopi & camilan",           amount: 85000 },
    { id: "t23", date: "2026-11-20", type: "expense", category: "hiburan",   desc: "Langganan streaming",      amount: 54000 },
    { id: "t24", date: "2026-11-21", type: "expense", category: "transport", desc: "Servis motor ringan",     amount: 175000 },
    { id: "t25", date: "2026-11-22", type: "expense", category: "belanja",   desc: "Belanja mingguan pasar",   amount: 430000 },
    { id: "t26", date: "2026-11-23", type: "expense", category: "kesehatan", desc: "Periksa gigi anak",        amount: 250000 },
    { id: "t27", date: "2026-11-24", type: "expense", category: "makan",     desc: "Makan siang keluarga",     amount: 145000 },
    { id: "t28", date: "2026-11-25", type: "expense", category: "lainnya",   desc: "Hadiah ulang tahun",       amount: 200000 },
    { id: "t29", date: "2026-10-05", type: "income",  category: "",          desc: "Gaji bulanan — Ayah",      amount: 8500000 },
    { id: "t30", date: "2026-10-20", type: "expense", category: "belanja",   desc: "Sembako bulanan",          amount: 2100000 },
    { id: "t31", date: "2026-10-12", type: "expense", category: "tagihan",   desc: "Listrik + air + internet", amount: 940000 }
  ]
};
