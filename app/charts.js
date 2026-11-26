// DompetKeluarga — charts.js: grafik canvas tanpa pustaka luar.
// Donat pengeluaran per kategori dan batang pemasukan vs pengeluaran.

var DKCharts = {};

DKCharts.donut = function (canvas, slices, centerLabel) {
  if (!canvas || !canvas.getContext) return;
  var dpr = window.devicePixelRatio || 1;
  var size = canvas.clientWidth || 260;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  var ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  var cx = size / 2, cy = size / 2, r = size / 2 - 14, inner = r * 0.62;
  var total = 0;
  slices.forEach(function (s) { total += s.value; });
  ctx.clearRect(0, 0, size, size);
  if (total <= 0) {
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = "#e7e2d6"; ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy, inner, 0, Math.PI * 2);
    ctx.fillStyle = "#fffdf7"; ctx.fill();
  } else {
    var start = -Math.PI / 2;
    slices.forEach(function (s) {
      var frac = s.value / total;
      var end = start + frac * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end);
      ctx.closePath();
      ctx.fillStyle = s.color;
      ctx.fill();
      start = end;
    });
    ctx.beginPath(); ctx.arc(cx, cy, inner, 0, Math.PI * 2);
    ctx.fillStyle = "#fffdf7"; ctx.fill();
  }
  ctx.fillStyle = "#243127";
  ctx.font = "700 15px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(centerLabel, cx, cy - 2);
  ctx.fillStyle = "#6b7280";
  ctx.font = "12px system-ui, sans-serif";
  ctx.fillText("Total keluar", cx, cy + 16);
};

DKCharts.bars = function (canvas, rows) {
  // rows: [{label, income, expense}]
  if (!canvas || !canvas.getContext) return;
  var dpr = window.devicePixelRatio || 1;
  var w = canvas.clientWidth || 600;
  var h = 220;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.height = h + "px";
  var ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);
  var max = 0;
  rows.forEach(function (r) { max = Math.max(max, r.income, r.expense); });
  if (max <= 0) max = 1;
  var padL = 8, padB = 26, padT = 12;
  var chartH = h - padB - padT;
  var groupW = (w - padL * 2) / rows.length;
  var barW = Math.min(34, (groupW - 18) / 2);
  rows.forEach(function (r, i) {
    var gx = padL + i * groupW + groupW / 2;
    var ih = (r.income / max) * chartH;
    var eh = (r.expense / max) * chartH;
    ctx.fillStyle = "#2e7d52";
    ctx.fillRect(gx - barW - 2, padT + chartH - ih, barW, ih);
    ctx.fillStyle = "#c2452d";
    ctx.fillRect(gx + 2, padT + chartH - eh, barW, eh);
    ctx.fillStyle = "#4b5563";
    ctx.font = "12px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(r.label, gx, h - 8);
  });
  ctx.strokeStyle = "#e7e2d6";
  ctx.beginPath(); ctx.moveTo(padL, padT + chartH); ctx.lineTo(w - padL, padT + chartH); ctx.stroke();
};
