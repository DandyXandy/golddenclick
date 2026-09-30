(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const user = GDC.session();
  if (!user) return;

  const toast = (msg) => {
    const t = $("#toast"); $("span", t).textContent = msg; t.classList.add("show");
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2600);
  };
  const brl = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  /* ---------- Estado (fica no navegador) ---------- */
  const SKEY = "gdc-state-" + user.usuario;
  const state = Object.assign({ pacote: 0, preco: 0, obras: [] }, GDC.store.get(SKEY) || {});
  const save = () => GDC.store.set(SKEY, state);

  /* ---------- Dados reais ---------- */
  const CHAMPS = [
    { nome: "Ewerton Carlos", ed: "5ª Batalha", per: "Novembro de 2024 a abril de 2026", valor: 20000, img: "quinto.jpg", comp: "quinto_vencedor.pdf", ig: "https://www.instagram.com/p/DXfVF7AEW0n/", perfil: "ewerton" },
    { nome: "Jhenivan Aguila", ed: "4ª Batalha", per: "Março a dezembro de 2024", valor: 20000, img: "quarto.jpg", comp: "quarto_vencedor.jpg", ig: "https://www.instagram.com/p/DEP5F6Lub9o/", perfil: "jhenivanaguila" },
    { nome: "Mauro Nunes", ed: "3ª Batalha", per: "Março a dezembro de 2023", valor: 20000, img: "terceiro.jpg", comp: "terceiro_vencedor.jpg", ig: "https://www.instagram.com/p/C1IS-8lOTRS/", perfil: "mauronunes" },
    { nome: "Guilherme Guimarães", ed: "2ª Batalha", per: "Maio a dezembro de 2022", valor: 10000, img: "segundo.jpg", comp: "segundo_vencedor.jpeg", ig: "https://www.instagram.com/p/CqldhwnuUKh/", perfil: "guiguimaraes" },
    { nome: "Felipe Agnello", ed: "1ª Batalha", per: "Setembro de 2021 a maio de 2022", valor: 10000, img: "primeiro.jpg", comp: "primeiro_vencedor.jpg", ig: "https://www.instagram.com/p/CdWhBUvO-3u/", perfil: "fegnello" },
  ];
  const BASE = "https://golddenclick.com/vencedoresbat/";
  const PRICES = {
    novo: [40, 70, 100, 130, 160], antigas: [38, 66, 94, 122, 150], ultima: [36, 62, 88, 114, 140],
    duas: [34, 58, 82, 106, 130], tres: [32, 54, 76, 98, 120], quatro: [30, 50, 70, 90, 110],
  };
  const RANK = {
    geral: { t: "Ranking da Batalha", d: "Todas as categorias disputam juntas. As 10 obras com maior pontuação total vencem.", rows: [["1º lugar", 20000], ["2º lugar", 10000], ["3º lugar", 5000], ["4º ao 10º lugar", "R$ 1.000 cada"]] },
    cat: { t: "Classificação por categoria", d: "Gerada a partir do ranking geral. Os 5 melhores de cada uma das 10 categorias são premiados.", rows: [["1º lugar", 1000], ["2º lugar", 800], ["3º lugar", 600], ["4º lugar", 400], ["5º lugar", 300]] },
    jur: { t: "Ranking dos jurados", d: "Os 10 participantes com maior precisão técnica nas votações, independente das obras.", rows: [["1º lugar", 5000], ["2º lugar", 2500], ["3º lugar", 1000], ["4º ao 10º lugar", "R$ 500 cada"]] },
  };

  /* ---------- Usuário ---------- */
  const initials = (n) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  const bindUser = () => {
    const vals = {
      nome: user.nome, first: user.nome.split(" ")[0], usuario: user.usuario, initials: initials(user.nome), saldo: brl(0),
    };
    Object.entries(vals).forEach(([k, v]) => $$(`[data-bind=${k}]`).forEach((el) => (el.textContent = v)));
  };

  /* ---------- Render geral ---------- */
  const render = () => {
    const n = state.obras.length, p = state.pacote;
    $$("[data-bind=enviadas]").forEach((el) => (el.textContent = n));
    $$("[data-bind=pacote]").forEach((el) => (el.textContent = p));
    $$("[data-bind=grupos]").forEach((el) => (el.textContent = n));
    $("#obrasBar").style.setProperty("--p", p ? (n / p) * 100 : 0);

    // Cartão principal e checklist
    const steps = { pacote: p > 0, obras: p > 0 && n >= p, votar: false };
    $$("#checklist li").forEach((li) => {
      const k = li.dataset.step;
      if (k in steps) li.classList.toggle("done", steps[k]);
      li.classList.remove("next");
    });
    const next = $$("#checklist li").find((li) => !li.classList.contains("done"));
    next?.classList.add("next");

    if (!p) {
      $("#heroTitle").textContent = "Garanta sua vaga na batalha.";
      $("#heroText").textContent = "Escolha de 1 a 5 obras. O 1º lugar geral leva R$ 20.000.";
      $("#heroCta").innerHTML = 'Garantir minha vaga <i class="ph-bold ph-arrow-right"></i>';
      $("#heroCta").href = "#batalha";
    } else if (n < p) {
      $("#heroTitle").textContent = p - n > 1 ? `Faltam ${p - n} obras para completar.` : "Falta 1 obra para completar.";
      $("#heroText").textContent = "Você pode enviar uma de cada vez, em dias diferentes, até o prazo.";
      $("#heroCta").innerHTML = 'Enviar obras <i class="ph-bold ph-arrow-right"></i>';
      $("#heroCta").href = "#obras";
    } else {
      $("#heroTitle").textContent = "Tudo pronto. Agora é esperar a arena abrir.";
      $("#heroText").textContent = "Você ainda pode editar título, link e descrição até 05/11.";
      $("#heroCta").innerHTML = 'Ver minhas obras <i class="ph-bold ph-arrow-right"></i>';
      $("#heroCta").href = "#obras";
    }

    // Próxima batalha
    $("#enrolledBox").hidden = !p;
    $("#pricingCard").hidden = !!p;
    $("#enrolledText").textContent = `Pacote de ${p} ${p > 1 ? "obras" : "obra"} (${brl(state.preco)}). ${n} de ${p} enviadas.`;

    // Minhas obras
    $("#obrasEmpty").hidden = !!p;
    $("#slots").hidden = !p;
    $("#obrasSub").textContent = p ? `${n} de ${p} enviadas. Prazo: 05/11/2026, 23:59 (Brasília).` : "Envie até 05/11/2026, 23:59 (Brasília).";
    const slots = [];
    state.obras.forEach((o, i) => slots.push(`
      <article class="slot">
        <div class="ph"><img src="${o.thumb}" alt="${esc(o.titulo)}"></div>
        <div class="bd">
          <span class="cat">${esc(o.cat)}</span>
          <h3>${esc(o.titulo)}</h3>
          <p class="meta">${esc(o.ano)} · ${esc(o.mat)}</p>
          <div class="acts">
            <button class="btn btn-line btn-sm" data-edit="${i}"><i class="ph ph-pencil-simple"></i> Editar textos</button>
          </div>
        </div>
      </article>`));
    for (let i = n; i < p; i++) slots.push(`<button class="slot free" data-upload><i class="ph ph-plus-circle"></i>Enviar obra ${i + 1}<small>.jpg até 10 MB</small></button>`);
    $("#slots").innerHTML = slots.join("");
  };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Roteador por hash ---------- */
  const VIEWS = ["inicio", "batalha", "obras", "votacao", "rankings", "campeoes", "regras", "perfil"];
  const route = () => {
    const v = VIEWS.includes(location.hash.slice(1)) ? location.hash.slice(1) : "inicio";
    $$(".view").forEach((s) => (s.hidden = s.dataset.view !== v));
    $$("#tabs a").forEach((a) => {
      const on = a.dataset.view === v;
      a.classList.toggle("on", on);
      if (on) { a.setAttribute("aria-current", "page"); a.scrollIntoView({ inline: "nearest", block: "nearest" }); }
      else a.removeAttribute("aria-current");
    });
    window.scrollTo({ top: 0, behavior: "instant" });
    $("#userMenu").hidden = true;
  };
  window.addEventListener("hashchange", route);

  /* ---------- Menu do usuário ---------- */
  $("#userBtn").addEventListener("click", (e) => {
    e.stopPropagation();
    const m = $("#userMenu"); m.hidden = !m.hidden;
    $("#userBtn").setAttribute("aria-expanded", String(!m.hidden));
  });
  document.addEventListener("click", (e) => { if (!e.target.closest(".usermenu")) $("#userMenu").hidden = true; });
  $$("[data-logout]").forEach((b) => b.addEventListener("click", () => { GDC.logout(); location.href = "index.html"; }));

  /* ---------- Contagem ---------- */
  const end = new Date("2026-11-05T23:59:00-03:00").getTime();
  const pad = (n) => String(n).padStart(2, "0");
  const tick = () => {
    const d = Math.max(0, end - Date.now());
    $("[data-u=d]").textContent = pad(Math.floor(d / 864e5));
    $("[data-u=h]").textContent = pad(Math.floor(d / 36e5) % 24);
    $("[data-u=m]").textContent = pad(Math.floor(d / 6e4) % 60);
    $("[data-u=s]").textContent = pad(Math.floor(d / 1e3) % 60);
  };
  tick(); setInterval(tick, 1000);

  /* ---------- Campeões ---------- */
  $("#champsStrip").innerHTML = CHAMPS.map((c) => `
    <a class="cs-item" href="#campeoes"><div class="ph"><img src="${BASE + c.img}" alt="${c.nome}" loading="lazy"></div><b>${c.nome}</b><span>${c.ed}</span></a>`).join("");
  $("#hall").innerHTML = CHAMPS.map((c) => `
    <article class="wc">
      <div class="ph"><img src="${BASE + c.img}" alt="${c.nome}" loading="lazy"></div>
      <div class="bd">
        <span class="ed">Vencedor da ${c.ed}</span>
        <h3>${c.nome}</h3>
        <span class="per">${c.per}</span>
        <span class="amt">Faturou ${brl(c.valor)}</span>
        <div class="links">
          <a class="money" href="${BASE + c.comp}" target="_blank" rel="noopener"><i class="ph ph-receipt"></i> Comprovante</a>
          <a href="${c.ig}" target="_blank" rel="noopener"><i class="ph ph-instagram-logo"></i> Instagram</a>
          <a href="https://golddenclick.com/perfil_aberto.php?usuario=${c.perfil}" target="_blank" rel="noopener"><i class="ph ph-user"></i> Perfil</a>
        </div>
      </div>
    </article>`).join("");

  /* ---------- Pacotes ---------- */
  let hist = "novo";
  const renderPacks = () => {
    $("#packs").innerHTML = PRICES[hist].map((p, i) => {
      const q = i + 1;
      return `<button class="pack${q === 5 ? " best" : ""}" data-q="${q}" data-p="${p}">
        ${q === 5 ? '<span class="badge">Menor custo por obra</span>' : ""}
        <span class="q">${'<i class="ph-fill ph-paint-brush"></i>'.repeat(q)}</span>
        <span class="n">${q} ${q > 1 ? "obras" : "obra"}</span>
        <span class="p"><small>R$</small>${p}</span>
        <span class="per">${brl(p / q)} por obra</span>
        <span class="go">Escolher <i class="ph ph-arrow-right"></i></span>
      </button>`;
    }).join("");
  };
  $("#seg").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    $$("#seg button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    hist = b.dataset.k; renderPacks();
  });

  /* ---------- Checkout ---------- */
  const co = $("#checkout");
  let pick = null;
  $("#packs").addEventListener("click", (e) => {
    const b = e.target.closest(".pack"); if (!b) return;
    pick = { q: +b.dataset.q, p: +b.dataset.p };
    $("#coSummary").textContent = `6ª Batalha Artística: ${pick.q} ${pick.q > 1 ? "obras" : "obra"}`;
    $("#coPrice").textContent = brl(pick.p);
    co.showModal();
  });
  const pmHelp = { pix: "O QR Code do PIX é gerado na próxima etapa. Após a confirmação, você vai direto para o envio de obras.", paypal: "Você será levado ao PayPal para concluir o pagamento.", saldo: "Seu saldo interno atual é R$ 0,00. No protótipo o pagamento é simulado." };
  $$("input[name=pm]").forEach((r) => r.addEventListener("change", () => ($("#pmHelp").textContent = pmHelp[r.value])));
  $("#payBtn").addEventListener("click", () => {
    const b = $("#payBtn");
    b.innerHTML = '<i class="ph ph-circle-notch spin"></i> Confirmando pagamento...'; b.disabled = true;
    setTimeout(() => {
      state.pacote = pick.q; state.preco = pick.p; save();
      co.close(); b.textContent = "Simular pagamento aprovado"; b.disabled = false;
      render(); location.hash = "obras";
      toast("Pagamento aprovado. Sua vaga está garantida!");
    }, 1200);
  });

  /* ---------- Modais: fechar ---------- */
  $$("dialog.modal").forEach((d) => {
    $$("[data-close]", d).forEach((b) => b.addEventListener("click", () => d.close()));
    d.addEventListener("click", (e) => { if (e.target === d) d.close(); });
  });

  /* ---------- Envio de obra ---------- */
  const up = $("#upload");
  const F = (id) => $("#ob-" + id);
  let fileData = null, editing = null;

  const resetUpload = () => {
    $("#uploadForm").reset(); fileData = null; editing = null;
    $("#drop").classList.remove("has"); $("#dropPreview").hidden = true;
    $("#fileErr").style.display = "none"; $("#fileInfo").textContent = "";
    $("#meta").disabled = true; $("#upBtn").disabled = true;
    $("#upBtn").textContent = "Enviar obra"; $("#upTitle").textContent = "Enviar obra";
    $("#drop").style.pointerEvents = "";
    $$("#uploadForm .field").forEach((f) => f.classList.remove("error"));
    ["cat", "ano", "tam", "tempo", "mat", "criacao"].forEach((k) => (F(k).disabled = false));
  };
  const fileError = (msg) => { const e = $("#fileErr"); e.textContent = msg; e.style.display = "block"; };

  const handleFile = (file) => {
    $("#fileErr").style.display = "none";
    if (!file) return;
    if (!/jpe?g$/i.test(file.type.split("/")[1] || "") && !/\.jpe?g$/i.test(file.name)) return fileError("O arquivo precisa ser .jpg.");
    if (file.size > 10 * 1024 * 1024) return fileError("O arquivo passa de 10 MB.");
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth < 1000 || img.naturalHeight < 1000) { URL.revokeObjectURL(url); return fileError(`A imagem tem ${img.naturalWidth} × ${img.naturalHeight} px. O mínimo é 1.000 × 1.000 px.`); }
      // miniatura leve para guardar no navegador
      const s = Math.min(1, 520 / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement("canvas");
      c.width = Math.round(img.naturalWidth * s); c.height = Math.round(img.naturalHeight * s);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      fileData = c.toDataURL("image/jpeg", .82);
      $("#dropPreview").src = url; $("#dropPreview").hidden = false; $("#drop").classList.add("has");
      $("#fileInfo").textContent = `${file.name}: ${img.naturalWidth} × ${img.naturalHeight} px, ${(file.size / 1048576).toFixed(1)} MB`;
      $("#meta").disabled = false; $("#upBtn").disabled = false;
      F("cat").focus();
    };
    img.onerror = () => fileError("Não foi possível ler essa imagem.");
    img.src = url;
  };
  $("#file").addEventListener("change", (e) => handleFile(e.target.files[0]));
  const drop = $("#drop");
  ["dragenter", "dragover"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("over"); }));
  ["dragleave", "drop"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("over"); }));
  drop.addEventListener("drop", (e) => handleFile(e.dataTransfer.files[0]));

  $("#slots").addEventListener("click", (e) => {
    if (e.target.closest("[data-upload]")) { resetUpload(); up.showModal(); }
    const ed = e.target.closest("[data-edit]");
    if (ed) {
      resetUpload();
      editing = +ed.dataset.edit;
      const o = state.obras[editing];
      $("#upTitle").textContent = "Editar obra";
      $("#dropPreview").src = o.thumb; $("#dropPreview").hidden = false; $("#drop").classList.add("has");
      $("#drop").style.pointerEvents = "none";
      $("#fileInfo").textContent = "A imagem, categoria e dados técnicos não podem ser alterados. Título, link e descrição sim.";
      Object.entries({ cat: o.cat, titulo: o.titulo, ano: o.ano, tam: o.tam, tempo: o.tempo, mat: o.mat, criacao: o.criacao, link: o.link, desc: o.desc }).forEach(([k, v]) => (F(k).value = v));
      ["cat", "ano", "tam", "tempo", "mat", "criacao"].forEach((k) => (F(k).disabled = true));
      F("decl").checked = true;
      $("#meta").disabled = false; $("#upBtn").disabled = false; $("#upBtn").textContent = "Salvar alterações";
      up.showModal();
    }
  });
  $$("#uploadForm .input").forEach((i) => i.addEventListener("input", () => i.closest(".field").classList.remove("error")));

  $("#uploadForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const req = ["cat", "titulo", "ano", "tam", "tempo", "mat", "criacao", "desc"];
    let ok = true;
    req.forEach((k) => { const bad = !F(k).value.trim(); F(k).closest(".field").classList.toggle("error", bad); if (bad) ok = false; });
    const badAno = !/^(19|20)\d{2}$/.test(F("ano").value.trim()) || +F("ano").value > 2026;
    F("ano").closest(".field").classList.toggle("error", badAno); if (badAno) ok = false;
    const badLink = !/^https?:\/\/(www\.)?(instagram\.com|tiktok\.com|youtube\.com|youtu\.be)\//i.test(F("link").value.trim());
    F("link").closest(".field").classList.toggle("error", badLink); if (badLink) ok = false;
    const decl = F("decl").checked; $("#f-decl").classList.toggle("error", !decl); if (!decl) ok = false;
    if (!ok) { $("#uploadForm .field.error")?.scrollIntoView({ block: "center", behavior: "smooth" }); return; }

    const data = Object.fromEntries(["cat", "titulo", "ano", "tam", "tempo", "mat", "criacao", "link", "desc"].map((k) => [k, F(k).value.trim()]));
    if (editing !== null) {
      Object.assign(state.obras[editing], { titulo: data.titulo, link: data.link, desc: data.desc });
      toast("Alterações salvas.");
    } else {
      state.obras.push({ ...data, thumb: fileData });
      toast(`Obra enviada! ${state.obras.length} de ${state.pacote}.`);
    }
    save(); up.close(); render();
  });

  /* ---------- Rankings ---------- */
  const renderRank = (k) => {
    const r = RANK[k];
    $("#rkTitle").textContent = r.t; $("#rkText").textContent = r.d + " A classificação é publicada ao fim de cada fase.";
    $("#rkPrizes").innerHTML = r.rows.map(([l, v], i) => `<div class="rk-row${i === 0 ? " first" : ""}"><span>${l}</span><b>${typeof v === "number" ? brl(v) : v}</b></div>`).join("");
  };
  $$(".tab[data-rk]").forEach((t) => t.addEventListener("click", () => {
    $$(".tab[data-rk]").forEach((x) => x.setAttribute("aria-selected", String(x === t)));
    renderRank(t.dataset.rk);
  }));
  renderRank("geral");

  /* ---------- Regras: índice lateral ---------- */
  $$(".rules-nav a").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    const d = $(a.getAttribute("href"));
    $$(".rules-nav a").forEach((x) => x.classList.toggle("on", x === a));
    $$(".rules-body details").forEach((x) => (x.open = x === d));
    d.scrollIntoView({ behavior: "smooth", block: "start" });
  }));

  /* ---------- Perfil ---------- */
  $("#pfNome").value = user.nome || ""; $("#pfIg").value = user.instagram ? "@" + user.instagram.replace(/^@/, "") : ""; $("#pfEmail").value = user.email || "";
  $("#profileForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = $("#pfNome").value.trim(); if (nome) user.nome = nome;
    user.instagram = $("#pfIg").value.trim().replace(/^@/, ""); user.email = $("#pfEmail").value.trim();
    const where = GDC.store.get("gdc-session") ? localStorage : sessionStorage;
    GDC.store.set("gdc-session", user, where);
    bindUser(); toast("Dados atualizados.");
  });

  bindUser(); renderPacks(); render(); route();
})();
