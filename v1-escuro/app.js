(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* Nav: fundo ao rolar (IntersectionObserver no topo, sem listener de scroll) */
  const nav = $("#nav");
  if (nav) {
    const sentinel = document.createElement("div");
    sentinel.style.cssText = "position:absolute;top:0;height:40px;width:1px";
    document.body.prepend(sentinel);
    new IntersectionObserver(([e]) => nav.classList.toggle("is-scrolled", !e.isIntersecting)).observe(sentinel);
  }

  /* Menu mobile */
  const menu = $("#mobileMenu");
  const setMenu = (open) => {
    if (!menu) return;
    menu.classList.toggle("open", open);
    menu.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  };
  $("#menuBtn")?.addEventListener("click", () => setMenu(true));
  $("#menuClose")?.addEventListener("click", () => setMenu(false));
  $$("#mobileMenu nav a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

  /* Reveal ao entrar na tela */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach((el) => io.observe(el));

  /* Contagem regressiva: prazo oficial de envio (05/11/2026 23:59 Brasília) */
  const cd = $("#countdown");
  if (cd) {
    const end = new Date("2026-11-05T23:59:00-03:00").getTime();
    const pad = (n) => String(n).padStart(2, "0");
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      const d = Math.floor(diff / 864e5);
      const h = Math.floor(diff / 36e5) % 24;
      const m = Math.floor(diff / 6e4) % 60;
      const s = Math.floor(diff / 1e3) % 60;
      $("[data-u=d]", cd).textContent = pad(d);
      $("[data-u=h]", cd).textContent = pad(h);
      $("[data-u=m]", cd).textContent = pad(m);
      $("[data-u=s]", cd).textContent = pad(s);
    };
    tick();
    setInterval(tick, 1000);
  }

  /* Abas de prêmios */
  const tabs = $$(".tab");
  tabs.forEach((t) => t.addEventListener("click", () => {
    tabs.forEach((x) => {
      const on = x === t;
      x.setAttribute("aria-selected", String(on));
      $("#" + x.getAttribute("aria-controls")).hidden = !on;
    });
  }));

  /* Tabela de inscrição (valores do edital, item 3.3) */
  const prices = {
    novo:    [40, 70, 100, 130, 160],
    antigas: [38, 66, 94, 122, 150],
    ultima:  [36, 62, 88, 114, 140],
    duas:    [34, 58, 82, 106, 130],
    tres:    [32, 54, 76, 98, 120],
    quatro:  [30, 50, 70, 90, 110],
  };
  const packs = $("#packs");
  const brl = (n) => n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const renderPacks = (k) => {
    if (!packs) return;
    packs.innerHTML = prices[k].map((p, i) => {
      const qty = i + 1;
      const best = qty === 5;
      const brushes = '<i class="ph-fill ph-paint-brush"></i>'.repeat(qty);
      return `<div class="pack${best ? " best" : ""}">
        ${best ? '<span class="badge">Menor custo por obra</span>' : ""}
        <span class="qty">${brushes}</span>
        <span style="font-weight:600">${qty} ${qty > 1 ? "obras" : "obra"}</span>
        <div class="price price-flash"><small>R$</small>${p}</div>
        <span class="per">R$ ${brl(p / qty)} por obra</span>
      </div>`;
    }).join("");
  };
  const seg = $("#seg");
  if (seg) {
    renderPacks("novo");
    seg.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      $$("button", seg).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      renderPacks(b.dataset.k);
    });
  }

  /* Login */
  const dlg = $("#login");
  $$("[data-open-login]").forEach((b) => b.addEventListener("click", (e) => {
    e.preventDefault(); setMenu(false); dlg?.showModal();
  }));
  $("#loginClose")?.addEventListener("click", () => dlg.close());
  dlg?.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  $("#loginForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    $$(".field", e.target).forEach((f) => {
      const inp = $("input", f);
      const bad = !inp.value.trim();
      f.classList.toggle("error", bad);
      if (bad) ok = false;
    });
    if (ok) {
      const btn = $("button[type=submit]", e.target);
      btn.textContent = "Entrando...";
      setTimeout(() => { btn.textContent = "Protótipo: login simulado"; }, 900);
    }
  });

  /* Mostrar/ocultar senha */
  $$("[data-eye]").forEach((b) => b.addEventListener("click", () => {
    const inp = document.getElementById(b.dataset.eye);
    const show = inp.type === "password";
    inp.type = show ? "text" : "password";
    b.innerHTML = `<i class="ph ph-eye${show ? "-slash" : ""}"></i>`;
    b.setAttribute("aria-label", show ? "Ocultar senha" : "Mostrar senha");
  }));

  /* Idioma (visual no protótipo) */
  $$(".lang button").forEach((b) => b.addEventListener("click", () => {
    $$(".lang button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
  }));

  /* Cookie */
  const ck = $("#cookie");
  if (ck) {
    let seen = false;
    try { seen = localStorage.getItem("gdc-cookie") === "1"; } catch {}
    if (!seen) setTimeout(() => ck.classList.add("show"), 1200);
    $("#cookieOk")?.addEventListener("click", () => {
      ck.classList.remove("show");
      try { localStorage.setItem("gdc-cookie", "1"); } catch {}
    });
  }
})();
