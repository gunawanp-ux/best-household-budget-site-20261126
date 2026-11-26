// DompetKeluarga — main.js: router hash dan pengikat header.
// Rute: #/ (dashboard), #/transaksi, #/anggaran, #/tujuan, #/laporan.

var DKRouter = {
  routes: {
    "": DKViews.dashboard,
    "transaksi": DKViews.transactions,
    "anggaran": DKViews.budgets,
    "tujuan": DKViews.goals,
    "laporan": DKViews.report
  },
  current: "",
  render: function () {
    var hash = window.location.hash || "#/";
    var route = hash.replace(/^#\/?/, "").split("/")[0].split("?")[0];
    if (!DKRouter.routes[route]) route = "";
    DKRouter.current = route;
    var view = DKRouter.routes[route]();
    document.getElementById("view").innerHTML = view.html;
    document.getElementById("month-label").textContent = DK.monthName(DK.month);
    Array.prototype.forEach.call(document.querySelectorAll(".mainnav a"), function (a) {
      var on = a.dataset.route === route;
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    if (view.mount) view.mount();
    window.scrollTo(0, 0);
  }
};

window.addEventListener("hashchange", DKRouter.render);

document.getElementById("prev-month").addEventListener("click", function () {
  DK.shiftMonth(-1);
  DKRouter.render();
});
document.getElementById("next-month").addEventListener("click", function () {
  DK.shiftMonth(1);
  DKRouter.render();
});

DK.load();
DKRouter.render();
