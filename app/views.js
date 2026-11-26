// DompetKeluarga — views.js: semua halaman dirender di sini.
// Setiap view mengembalikan HTML, lalu memasang handler-nya sendiri.

var DKViews = {};

DKViews.progressBar = function (spent, limit) {
  var pct = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
  var cls = pct >= 100 ? "over" : pct >= 80 ? "warn" : "";
  return '<div class="progress ' + cls + '" role="progressbar" aria-valuenow="' + pct +
    '" aria-valuemin="0" aria-valuemax="100"><span style="width:' + pct + '%"></span></div>';
};

DKViews.categoryChip = function (cat) {
  if (!cat) return '<span class="chip chip-income">Pemasukan</span>';
  return '<span class="chip"><span class="dot" style="background:' + cat.color + '">' +
    cat.icon + '</span>' + DK.escape(cat.name) + '</span>';
};

// ---------- Dashboard ----------
DKViews.dashboard = function () {
  var t = DK.totals();
  var spent = DK.spentByCategory();
  var totalBudget = 0;
  DK.data.categories.forEach(function (c) { totalBudget += DK.budgetFor(c.id); });
  var budgetPct = totalBudget > 0 ? Math.round((t.expense / totalBudget) * 100) : 0;
  var slices = DK.data.categories
    .map(function (c) { return { label: c.name, value: spent[c.id], color: c.color }; })
    .filter(function (s) { return s.value > 0; })
    .sort(function (a, b) { return b.value - a.value; });
  var top = slices.slice(0, 5);
  var recent = DK.monthTransactions().slice()
    .sort(function (a, b) { return b.date.localeCompare(a.date) || b.id.localeCompare(a.id); })
    .slice(0, 6);
  var goals = DK.data.goals;

  var html = '<section class="hero"><div><p class="eyebrow">' + DK.escape(DK.data.household) +
    ' · ' + DK.monthName(DK.month) + '</p><h1>Uang keluarga bulan ini, jelas larinya.</h1>' +
    '<p class="lede">Pemasukan ' + DK.rupiah(t.income) + ', pengeluaran ' + DK.rupiah(t.expense) +
    '. Sisa <strong>' + DK.rupiah(t.balance) + '</strong> untuk ditabung atau dipakai minggu depan.</p></div>' +
    '<div class="hero-card"><span class="hero-label">Sisa anggaran bulan ini</span>' +
    '<strong class="hero-big">' + DK.rupiah(Math.max(0, totalBudget - t.expense)) + '</strong>' +
    '<span class="hero-sub">dari total anggaran ' + DK.rupiah(totalBudget) + ' · ' + budgetPct + '% terpakai</span>' +
    DKViews.progressBar(t.expense, totalBudget) +
    '<a class="btn btn-primary" href="#/transaksi">+ Catat transaksi</a></div></section>';

  html += '<section class="cards">' +
    '<div class="stat"><span class="stat-label">Pemasukan</span><strong class="in">' + DK.rupiah(t.income) + '</strong><span class="stat-sub">Gaji + freelance + lain-lain</span></div>' +
    '<div class="stat"><span class="stat-label">Pengeluaran</span><strong class="out">' + DK.rupiah(t.expense) + '</strong><span class="stat-sub">' + DK.monthTransactions().filter(function (x) { return x.type === "expense"; }).length + ' transaksi bulan ini</span></div>' +
    '<div class="stat"><span class="stat-label">Saldo (sisa)</span><strong>' + DK.rupiah(t.balance) + '</strong><span class="stat-sub">Pemasukan − pengeluaran</span></div>' +
    '<div class="stat"><span class="stat-label">Tujuan menabung</span><strong>' + goals.length + ' tujuan aktif</strong><span class="stat-sub">' + DK.rupiah(goals.reduce(function (a, g) { return a + g.saved; }, 0)) + ' sudah terkumpul</span></div>' +
    '</section>';

  html += '<section class="grid-2"><div class="panel"><h2>Pengeluaran per kategori</h2>' +
    '<div class="donut-wrap"><canvas id="donut" width="260" height="260" aria-label="Diagram pengeluaran per kategori"></canvas>' +
    '<ul class="legend">' + top.map(function (s) {
      return '<li><span class="dot" style="background:' + s.color + '"></span>' + DK.escape(s.label) +
        '<strong>' + DK.rupiah(s.value) + '</strong></li>';
    }).join("") + '</ul></div>' +
    '<p class="panel-link"><a href="#/anggaran">Lihat semua anggaran &rarr;</a></p></div>';

  html += '<div class="panel"><h2>Anggaran yang hampir habis</h2><ul class="budget-list">' +
    DK.data.categories.map(function (c) {
      var s = spent[c.id], lim = DK.budgetFor(c.id);
      var pct = lim > 0 ? Math.round((s / lim) * 100) : 0;
      return { c: c, s: s, lim: lim, pct: pct };
    }).sort(function (a, b) { return b.pct - a.pct; }).slice(0, 4).map(function (row) {
      return '<li><div class="budget-row"><span class="chip"><span class="dot" style="background:' +
        row.c.color + '">' + row.c.icon + '</span>' + DK.escape(row.c.name) + '</span><span><strong>' +
        DK.rupiah(row.s) + '</strong> / ' + DK.rupiah(row.lim) + ' · ' + row.pct + '%</span></div>' +
        DKViews.progressBar(row.s, row.lim) + '</li>';
    }).join("") + '</ul><p class="panel-link"><a href="#/anggaran">Atur batas anggaran &rarr;</a></p></div></section>';

  html += '<section class="grid-2"><div class="panel"><h2>Transaksi terakhir</h2><ul class="tx-list">' +
    recent.map(function (tx) {
      var cat = tx.type === "expense" ? DK.categoryById(tx.category) : null;
      return '<li><div><span class="tx-date">' + DK.dateLabel(tx.date) + '</span><strong>' +
        DK.escape(tx.desc) + '</strong><br>' + DKViews.categoryChip(cat) + '</div><strong class="' +
        (tx.type === "income" ? "in" : "out") + '">' + (tx.type === "income" ? "+" : "−") +
        DK.rupiah(tx.amount) + '</strong></li>';
    }).join("") + '</ul><p class="panel-link"><a href="#/transaksi">Semua transaksi &rarr;</a></p></div>';

  html += '<div class="panel"><h2>Tujuan menabung</h2><ul class="goal-list">' +
    goals.map(function (g) {
      var pct = Math.min(100, Math.round((g.saved / g.target) * 100));
      return '<li><div class="goal-row"><strong>' + DK.escape(g.name) + '</strong><span>' + pct + '%</span></div>' +
        DKViews.progressBar(g.saved, g.target) +
        '<span class="goal-sub">' + DK.rupiah(g.saved) + ' dari ' + DK.rupiah(g.target) + ' · kurang ' +
        DK.rupiah(Math.max(0, g.target - g.saved)) + '</span></li>';
    }).join("") + '</ul><p class="panel-link"><a href="#/tujuan">Kelola tujuan menabung &rarr;</a></p></div></section>';

  html += '<section class="panel tips"><h2>Tips bulan ini</h2><p>Belanja harian sudah ' +
    DK.rupiah(spent.belanja) + ' dari anggaran ' + DK.rupiah(DK.budgetFor("belanja")) +
    '. Sisa ' + DK.rupiah(Math.max(0, DK.budgetFor("belanja") - spent.belanja)) +
    ' untuk seminggu ke depan — cukup kalau belanja mingguan dijaga di bawah ' +
    DK.rupiah(430000) + ' per minggu. Tagihan listrik naik dibanding Oktober; cek pemakaian AC di siang hari.</p></section>';

  return { html: html, mount: function () {
    DKCharts.donut(document.getElementById("donut"), slices, DK.rupiahShort(t.expense));
  } };
};

// ---------- Transaksi ----------
DKViews.transactions = function () {
  var all = DK.monthTransactions().slice()
    .sort(function (a, b) { return b.date.localeCompare(a.date) || b.id.localeCompare(a.id); });
  var editing = null;
  var html = '<section class="page-head"><div><h1>Transaksi</h1><p class="lede">Semua pemasukan dan pengeluaran ' +
    DK.monthName(DK.month) + ' — ' + all.length + ' transaksi.</p></div>' +
    '<button class="btn btn-primary" id="show-add" type="button">+ Transaksi baru</button></section>';

  html += '<section class="panel" id="tx-form-panel" hidden><h2 id="tx-form-title">Catat transaksi baru</h2>' +
    '<form id="tx-form" class="form-grid">' +
    '<label>Jenis<select name="type" id="f-type"><option value="expense">Pengeluaran</option><option value="income">Pemasukan</option></select></label>' +
    '<label>Deskripsi<input name="desc" id="f-desc" required maxlength="80" placeholder="cth. Belanja mingguan pasar"></label>' +
    '<label>Jumlah (Rp)<input name="amount" id="f-amount" type="number" min="1000" step="500" required placeholder="150000"></label>' +
    '<label>Tanggal<input name="date" id="f-date" type="date" required value="' + DK.month + '-25"></label>' +
    '<label>Kategori<select name="category" id="f-category">' +
    DK.data.categories.map(function (c) { return '<option value="' + c.id + '">' + DK.escape(c.name) + '</option>'; }).join("") +
    '</select></label>' +
    '<div class="form-actions"><button class="btn btn-primary" type="submit">Simpan transaksi</button>' +
    '<button class="btn btn-ghost" type="button" id="tx-cancel">Batal</button>' +
    '<span class="form-note" id="tx-msg" role="status"></span></div></form></section>';

  html += '<section class="panel"><div class="filter-row">' +
    '<label>Filter <select id="f-filter"><option value="all">Semua</option><option value="income">Pemasukan saja</option><option value="expense">Pengeluaran saja</option></select></label>' +
    '<label>Kategori <select id="f-cat"><option value="all">Semua kategori</option>' +
    DK.data.categories.map(function (c) { return '<option value="' + c.id + '">' + DK.escape(c.name) + '</option>'; }).join("") +
    '</select></label></div>' +
    '<ul class="tx-list tx-full" id="tx-list">' + all.map(DKViews.txRow).join("") + '</ul>' +
    '<p class="empty-note" id="tx-empty" hidden>Tidak ada transaksi yang cocok dengan filter ini.</p></section>';

  return { html: html, mount: function () {
    var panel = document.getElementById("tx-form-panel");
    var form = document.getElementById("tx-form");
    var msg = document.getElementById("tx-msg");
    var list = document.getElementById("tx-list");
    var empty = document.getElementById("tx-empty");
    var typeSel = document.getElementById("f-type");
    var catSel = document.getElementById("f-category");

    function syncCategory() {
      catSel.disabled = typeSel.value === "income";
      catSel.closest("label").style.opacity = typeSel.value === "income" ? "0.45" : "1";
    }
    typeSel.addEventListener("change", syncCategory);
    syncCategory();

    function applyFilter() {
      var f = document.getElementById("f-filter").value;
      var c = document.getElementById("f-cat").value;
      var shown = 0;
      Array.prototype.forEach.call(list.children, function (li) {
        var ok = (f === "all" || li.dataset.type === f) && (c === "all" || li.dataset.cat === c);
        li.style.display = ok ? "" : "none";
        if (ok) shown++;
      });
      empty.hidden = shown !== 0;
    }
    document.getElementById("f-filter").addEventListener("change", applyFilter);
    document.getElementById("f-cat").addEventListener("change", applyFilter);

    function openForm(tx) {
      editing = tx || null;
      document.getElementById("tx-form-title").textContent = tx ? "Ubah transaksi" : "Catat transaksi baru";
      form.reset();
      if (tx) {
        typeSel.value = tx.type; document.getElementById("f-desc").value = tx.desc;
        document.getElementById("f-amount").value = tx.amount;
        document.getElementById("f-date").value = tx.date;
        catSel.value = tx.category || DK.data.categories[0].id;
      } else {
        document.getElementById("f-date").value = DK.month + "-25";
      }
      syncCategory();
      panel.hidden = false;
      msg.textContent = "";
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
      document.getElementById("f-desc").focus();
    }
    document.getElementById("show-add").addEventListener("click", function () { openForm(null); });
    document.getElementById("tx-cancel").addEventListener("click", function () { panel.hidden = true; editing = null; });

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var type = typeSel.value;
      var desc = document.getElementById("f-desc").value.trim();
      var amount = Math.round(Number(document.getElementById("f-amount").value));
      var date = document.getElementById("f-date").value;
      if (!desc || !amount || amount <= 0 || !date) { msg.textContent = "Lengkapi deskripsi, jumlah, dan tanggal."; return; }
      var patch = { type: type, desc: desc, amount: amount, date: date,
        category: type === "income" ? "" : catSel.value };
      if (editing) { DK.updateTransaction(editing.id, patch); msg.textContent = "Transaksi diperbarui."; }
      else { DK.addTransaction(patch); msg.textContent = "Transaksi tersimpan."; }
      editing = null;
      setTimeout(function () { window.location.hash = "#/transaksi"; DKRouter.render(); }, 350);
    });

    list.addEventListener("click", function (ev) {
      var btn = ev.target.closest("button[data-act]");
      if (!btn) return;
      var id = btn.dataset.id;
      if (btn.dataset.act === "del") {
        var row = DK.data.transactions.find(function (t) { return t.id === id; });
        if (row && window.confirm('Hapus "' + row.desc + '" (' + DK.rupiah(row.amount) + ')?')) {
          DK.deleteTransaction(id);
          DKRouter.render();
        }
      } else if (btn.dataset.act === "edit") {
        var tx = DK.data.transactions.find(function (t) { return t.id === id; });
        if (tx) openForm(tx);
      }
    });
  } };
};

DKViews.txRow = function (tx) {
  var cat = tx.type === "expense" ? DK.categoryById(tx.category) : null;
  return '<li data-type="' + tx.type + '" data-cat="' + (tx.category || "") + '"><div>' +
    '<span class="tx-date">' + DK.dateLabel(tx.date) + '</span><strong>' + DK.escape(tx.desc) + '</strong><br>' +
    DKViews.categoryChip(cat) + '</div>' +
    '<div class="tx-right"><strong class="' + (tx.type === "income" ? "in" : "out") + '">' +
    (tx.type === "income" ? "+" : "−") + DK.rupiah(tx.amount) + '</strong>' +
    '<span class="tx-actions"><button type="button" data-act="edit" data-id="' + tx.id + '">Ubah</button>' +
    '<button type="button" data-act="del" data-id="' + tx.id + '">Hapus</button></span></div></li>';
};

// ---------- Anggaran ----------
DKViews.budgets = function () {
  var spent = DK.spentByCategory();
  var t = DK.totals();
  var totalBudget = DK.data.categories.reduce(function (a, c) { return a + DK.budgetFor(c.id); }, 0);
  var html = '<section class="page-head"><div><h1>Anggaran ' + DK.monthName(DK.month) + '</h1>' +
    '<p class="lede">Batas belanja tiap kategori. Total anggaran ' + DK.rupiah(totalBudget) +
    ' dari pemasukan ' + DK.rupiah(t.income) + ' — target menabung bulan ini ' +
    DK.rupiah(Math.max(0, t.income - totalBudget)) + '.</p></div></section>';
  html += '<section class="grid-2 budget-grid">' + DK.data.categories.map(function (c) {
    var s = spent[c.id], lim = DK.budgetFor(c.id);
    var pct = lim > 0 ? Math.round((s / lim) * 100) : 0;
    var left = lim - s;
    return '<article class="panel budget-card"><div class="budget-head"><span class="chip"><span class="dot" style="background:' +
      c.color + '">' + c.icon + '</span>' + DK.escape(c.name) + '</span><strong class="pct ' +
      (pct >= 100 ? "out" : pct >= 80 ? "warn-text" : "in") + '">' + pct + '%</strong></div>' +
      DKViews.progressBar(s, lim) +
      '<p class="budget-figures"><strong>' + DK.rupiah(s) + '</strong> terpakai dari ' + DK.rupiah(lim) + '<br>' +
      (left >= 0 ? 'Sisa <strong class="in">' + DK.rupiah(left) + '</strong>' : 'Lewat <strong class="out">' + DK.rupiah(-left) + '</strong>') + '</p>' +
      '<form class="budget-form" data-cat="' + c.id + '"><label>Batas baru (Rp) ' +
      '<input type="number" min="0" step="50000" value="' + lim + '" aria-label="Batas anggaran ' + DK.escape(c.name) + '"></label>' +
      '<button class="btn btn-small" type="submit">Simpan batas</button></form></article>';
  }).join("") + '</section>';
  html += '<section class="panel tips"><h2>Cara memakai anggaran ini</h2>' +
    '<p>Ubah batas tiap kategori sesuai kebutuhan keluarga, lalu tekan <strong>Simpan batas</strong>. ' +
    'Batas tersimpan otomatis dan dipakai di Dashboard. Kategori yang melewati 80% ditandai kuning, ' +
    'yang sudah lewat batas ditandai merah. Aturan praktis: kebutuhan pokok (belanja, tagihan, transportasi) ' +
    'sebaiknya tidak lebih dari 70% pemasukan, sisanya untuk tabungan dan hiburan.</p>' +
    '<p><button class="btn btn-ghost" type="button" id="reset-data">Kembalikan data contoh</button> ' +
    '<span class="form-note" id="reset-msg" role="status"></span></p></section>';
  return { html: html, mount: function () {
    Array.prototype.forEach.call(document.querySelectorAll(".budget-form"), function (f) {
      f.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var input = f.querySelector("input");
        DK.setBudget(f.dataset.cat, Number(input.value));
        DKRouter.render();
      });
    });
    document.getElementById("reset-data").addEventListener("click", function () {
      if (window.confirm("Kembalikan semua data ke contoh awal? Perubahan Anda akan hilang.")) {
        DK.reset();
        document.getElementById("reset-msg").textContent = "Data contoh dikembalikan.";
        setTimeout(DKRouter.render, 400);
      }
    });
  } };
};

// ---------- Tujuan ----------
DKViews.goals = function () {
  var totalSaved = DK.data.goals.reduce(function (a, g) { return a + g.saved; }, 0);
  var totalTarget = DK.data.goals.reduce(function (a, g) { return a + g.target; }, 0);
  var html = '<section class="page-head"><div><h1>Tujuan Menabung</h1><p class="lede">' +
    DK.rupiah(totalSaved) + ' sudah terkumpul dari target ' + DK.rupiah(totalTarget) +
    ' (' + Math.round((totalSaved / totalTarget) * 100) + '%).</p></div></section>';
  html += '<section class="grid-2">' + DK.data.goals.map(function (g) {
    var pct = Math.min(100, Math.round((g.saved / g.target) * 100));
    return '<article class="panel goal-card"><h2>' + DK.escape(g.name) + '</h2>' +
      '<p class="goal-note">' + DK.escape(g.note) + '</p>' +
      '<strong class="goal-big">' + DK.rupiah(g.saved) + '</strong><span class="goal-sub"> dari target ' +
      DK.rupiah(g.target) + ' · kurang ' + DK.rupiah(Math.max(0, g.target - g.saved)) + '</span>' +
      DKViews.progressBar(g.saved, g.target) +
      '<form class="goal-form" data-goal="' + g.id + '"><label>Tambah tabungan (Rp) ' +
      '<input type="number" min="10000" step="10000" value="100000" aria-label="Jumlah untuk ' + DK.escape(g.name) + '"></label>' +
      '<button class="btn btn-small btn-primary" type="submit">+ Tambah</button></form></article>';
  }).join("") + '</section>';
  html += '<section class="panel"><h2>Buat tujuan baru</h2>' +
    '<form id="goal-form" class="form-grid">' +
    '<label>Nama tujuan<input name="name" required maxlength="60" placeholder="cth. Biaya sekolah anak"></label>' +
    '<label>Target (Rp)<input name="target" type="number" min="100000" step="50000" required placeholder="3000000"></label>' +
    '<label>Catatan<input name="note" maxlength="90" placeholder="cth. Untuk tahun ajaran baru"></label>' +
    '<div class="form-actions"><button class="btn btn-primary" type="submit">Simpan tujuan</button>' +
    '<span class="form-note" id="goal-msg" role="status"></span></div></form></section>';
  return { html: html, mount: function () {
    Array.prototype.forEach.call(document.querySelectorAll(".goal-form"), function (f) {
      f.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var amount = Math.round(Number(f.querySelector("input").value));
        if (!amount || amount <= 0) return;
        DK.addToGoal(f.dataset.goal, amount);
        DKRouter.render();
      });
    });
    document.getElementById("goal-form").addEventListener("submit", function (ev) {
      ev.preventDefault();
      var name = ev.target.name.value.trim();
      var target = Math.round(Number(ev.target.target.value));
      var note = ev.target.note.value.trim() || "Tujuan baru keluarga";
      if (!name || !target || target <= 0) { document.getElementById("goal-msg").textContent = "Isi nama dan target tujuan."; return; }
      DK.addGoal({ name: name, target: target, note: note });
      DKRouter.render();
    });
  } };
};

// ---------- Laporan ----------
DKViews.report = function () {
  var months = ["2026-10", "2026-11"];
  var rows = months.map(function (m) {
    var t = DK.totals(m);
    return { label: DK.monthName(m).replace(" 2026", ""), income: t.income, expense: t.expense, balance: t.balance };
  });
  var spent = DK.spentByCategory();
  var t = DK.totals();
  var topCats = DK.data.categories.map(function (c) {
    return { c: c, spent: spent[c.id] };
  }).filter(function (r) { return r.spent > 0; })
    .sort(function (a, b) { return b.spent - a.spent; });
  var html = '<section class="page-head"><div><h1>Laporan Bulanan</h1>' +
    '<p class="lede">Perbandingan pemasukan dan pengeluaran, serta rincian kategori ' + DK.monthName(DK.month) + '.</p></div></section>';
  html += '<section class="panel"><h2>Pemasukan vs pengeluaran</h2>' +
    '<canvas id="bars" aria-label="Grafik batang pemasukan dan pengeluaran per bulan"></canvas>' +
    '<p class="legend-inline"><span class="swatch" style="background:#2e7d52"></span> Pemasukan &nbsp; <span class="swatch" style="background:#c2452d"></span> Pengeluaran</p>' +
    '<table class="report-table"><thead><tr><th>Bulan</th><th>Pemasukan</th><th>Pengeluaran</th><th>Sisa</th><th>Tingkat tabung</th></tr></thead><tbody>' +
    rows.map(function (r) {
      var rate = r.income > 0 ? Math.round((r.balance / r.income) * 100) : 0;
      return '<tr><td>' + r.label + ' 2026</td><td>' + DK.rupiah(r.income) + '</td><td>' + DK.rupiah(r.expense) +
        '</td><td><strong>' + DK.rupiah(r.balance) + '</strong></td><td>' + rate + '%</td></tr>';
    }).join("") + '</tbody></table></section>';
  html += '<section class="panel"><h2>Rincian pengeluaran ' + DK.monthName(DK.month) + '</h2>' +
    '<table class="report-table"><thead><tr><th>Kategori</th><th>Terpakai</th><th>Anggaran</th><th>Bagian</th></tr></thead><tbody>' +
    topCats.map(function (r) {
      var share = t.expense > 0 ? Math.round((r.spent / t.expense) * 100) : 0;
      return '<tr><td>' + DKViews.categoryChip(r.c) + '</td><td>' + DK.rupiah(r.spent) + '</td><td>' +
        DK.rupiah(DK.budgetFor(r.c.id)) + '</td><td>' + share + '%</td></tr>';
    }).join("") + '</tbody></table>' +
    '<p class="panel-link"><a href="#/anggaran">Ubah anggaran kategori &rarr;</a></p></section>';
  html += '<section class="panel tips"><h2>Yang bisa diperbaiki bulan depan</h2><ul class="tips-list">' +
    '<li><strong>Makan &amp; jajan ' + DK.rupiah(spent.makan) + '.</strong> Masak bekal 3 hari seminggu bisa memangkas sekitar Rp300.000 per bulan.</li>' +
    '<li><strong>Tingkat tabung ' + Math.round((t.balance / t.income) * 100) + '%.</strong> Target sehat untuk keluarga adalah 20% dari pemasukan — bulan ini ' +
    (t.balance / t.income >= 0.2 ? 'sudah tercapai, pertahankan.' : 'belum tercapai; sisihkan di awal gajian, bukan dari sisa.') + '</li>' +
    '<li><strong>Dana darurat ' + Math.round((DK.data.goals[0].saved / DK.data.goals[0].target) * 100) + '%.</strong> ' +
    'Dengan sisa bulanan saat ini, target tercapai sekitar 3 bulan lagi.</li></ul></section>';
  return { html: html, mount: function () {
    DKCharts.bars(document.getElementById("bars"), rows);
  } };
};
