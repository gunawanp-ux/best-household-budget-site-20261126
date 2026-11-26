// DompetKeluarga — store.js: state, persistence, and money helpers.
// Satu sumber kebenaran untuk seluruh halaman: views.js hanya membaca
// dari sini, dan setiap perubahan ditulis kembali ke localStorage.

var DK_STORE_KEY = "dompetkeluarga-v1";

var DK = {
  data: null,
  month: "2026-11", // bulan yang sedang dilihat, format YYYY-MM
};

DK.load = function () {
  try {
    var raw = window.localStorage.getItem(DK_STORE_KEY);
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && parsed.transactions && parsed.budgets && parsed.goals) {
        DK.data = parsed;
        return;
      }
    }
  } catch (e) { /* localStorage tidak tersedia: pakai seed saja */ }
  DK.data = JSON.parse(JSON.stringify(DK_SEED));
  DK.save();
};

DK.save = function () {
  try { window.localStorage.setItem(DK_STORE_KEY, JSON.stringify(DK.data)); } catch (e) {}
};

DK.reset = function () {
  DK.data = JSON.parse(JSON.stringify(DK_SEED));
  DK.save();
};

DK.categories = function () { return DK.data.categories; };

DK.categoryById = function (id) {
  for (var i = 0; i < DK.data.categories.length; i++) {
    if (DK.data.categories[i].id === id) return DK.data.categories[i];
  }
  return null;
};

DK.monthTransactions = function (month) {
  month = month || DK.month;
  return DK.data.transactions.filter(function (t) { return t.date.slice(0, 7) === month; });
};

DK.totals = function (month) {
  var income = 0, expense = 0;
  DK.monthTransactions(month).forEach(function (t) {
    if (t.type === "income") income += t.amount; else expense += t.amount;
  });
  return { income: income, expense: expense, balance: income - expense };
};

DK.spentByCategory = function (month) {
  var out = {};
  DK.data.categories.forEach(function (c) { out[c.id] = 0; });
  DK.monthTransactions(month).forEach(function (t) {
    if (t.type === "expense" && out[t.category] !== undefined) out[t.category] += t.amount;
  });
  return out;
};

DK.budgetFor = function (categoryId) { return DK.data.budgets[categoryId] || 0; };

DK.setBudget = function (categoryId, amount) {
  DK.data.budgets[categoryId] = Math.max(0, Math.round(amount) || 0);
  DK.save();
};

DK.addTransaction = function (tx) {
  tx.id = "u" + Date.now().toString(36) + Math.floor(Math.random() * 1000);
  DK.data.transactions.push(tx);
  DK.save();
  return tx;
};

DK.updateTransaction = function (id, patch) {
  for (var i = 0; i < DK.data.transactions.length; i++) {
    if (DK.data.transactions[i].id === id) {
      for (var k in patch) DK.data.transactions[i][k] = patch[k];
      DK.save();
      return true;
    }
  }
  return false;
};

DK.deleteTransaction = function (id) {
  DK.data.transactions = DK.data.transactions.filter(function (t) { return t.id !== id; });
  DK.save();
};

DK.addToGoal = function (goalId, amount) {
  for (var i = 0; i < DK.data.goals.length; i++) {
    if (DK.data.goals[i].id === goalId) {
      DK.data.goals[i].saved = Math.max(0, DK.data.goals[i].saved + amount);
      DK.save();
      return DK.data.goals[i];
    }
  }
  return null;
};

DK.addGoal = function (goal) {
  goal.id = "g" + Date.now().toString(36);
  goal.saved = 0;
  DK.data.goals.push(goal);
  DK.save();
  return goal;
};

// ---- format helpers ----

DK.rupiah = function (n) {
  return "Rp" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

DK.rupiahShort = function (n) {
  if (n >= 1000000) return "Rp" + (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1).replace(".", ",") + " jt";
  if (n >= 1000) return "Rp" + Math.round(n / 1000) + " rb";
  return DK.rupiah(n);
};

DK.monthName = function (month) {
  var names = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  var parts = month.split("-");
  return names[parseInt(parts[1], 10) - 1] + " " + parts[0];
};

DK.shiftMonth = function (delta) {
  var parts = DK.month.split("-");
  var d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1 + delta, 1);
  DK.month = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
};

DK.dateLabel = function (iso) {
  var parts = iso.split("-");
  return parseInt(parts[2], 10) + " " +
    ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][parseInt(parts[1], 10) - 1] +
    " " + parts[0];
};

DK.escape = function (s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
};
