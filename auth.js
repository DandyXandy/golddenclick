/* Autenticação simulada do protótipo (sem servidor).
   Conta de teste: ver LEIA-ME.md. Contas criadas no cadastro ficam no navegador. */
window.GDC = (() => {
  const TEST = { usuario: "teste", senha: "ouro2026", nome: "Artista Teste", instagram: "artista.teste", email: "teste@golddenclick.com" };
  const KEY = "gdc-session";
  const ACC = "gdc-accounts";

  const store = {
    get(k, s = localStorage) { try { return JSON.parse(s.getItem(k)); } catch { return null; } },
    set(k, v, s = localStorage) { try { s.setItem(k, JSON.stringify(v)); } catch {} },
    del(k) { try { localStorage.removeItem(k); sessionStorage.removeItem(k); } catch {} },
  };

  const accounts = () => store.get(ACC) || [];

  return {
    store,
    userExists(u) {
      u = u.trim().toLowerCase();
      return u === TEST.usuario || accounts().some((a) => a.usuario === u);
    },
    register(data) {
      const list = accounts();
      list.push({ ...data, usuario: data.usuario.toLowerCase() });
      store.set(ACC, list);
    },
    login(usuario, senha, lembrar) {
      const u = usuario.trim().toLowerCase();
      const acc = u === TEST.usuario ? TEST : accounts().find((a) => a.usuario === u);
      if (!acc || acc.senha !== senha) return false;
      const { senha: _, ...pub } = acc;
      store.set(KEY, pub, lembrar ? localStorage : sessionStorage);
      return true;
    },
    session() { return store.get(KEY) || store.get(KEY, sessionStorage); },
    logout() { store.del(KEY); },
  };
})();
