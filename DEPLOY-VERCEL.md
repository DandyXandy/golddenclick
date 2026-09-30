# Publicar o protótipo na Vercel

O projeto é um site estático (HTML, CSS e JS puros). Não precisa de build nem de configuração.

A pasta publicada é `golddenclick-premium`. A página inicial é `index.html`.
Os arquivos `.md` não são publicados (ver `.vercelignore`).

---

## Opção 1: pelo site, arrastando a pasta (mais rápido)

1. Acesse https://vercel.com e entre com sua conta (GitHub, GitLab ou e-mail).
2. No painel, clique em **Add New... > Project**.
3. Role até o fim e escolha a opção de **deploy sem Git** (arrastar e soltar), ou use a CLI (opção 2) se ela não aparecer para sua conta.
4. Arraste a pasta `golddenclick-premium` inteira.
5. Em **Framework Preset**, deixe **Other**. Build Command e Output Directory ficam vazios.
6. Clique em **Deploy**. Em poucos segundos sai um link como `golddenclick-premium.vercel.app`.

## Opção 2: pela linha de comando (Vercel CLI)

Pré-requisito: Node.js instalado.

```bash
npm i -g vercel
```

Entre na pasta do projeto:

```bash
cd "C:/Users/paomo/OneDrive/Desktop/SITES/golddenclick-premium"
```

Faça login (abre o navegador):

```bash
vercel login
```

Publique uma prévia:

```bash
vercel
```

Respostas para as perguntas:
- Set up and deploy? **Y**
- Which scope? sua conta
- Link to existing project? **N**
- Project name? `golddenclick-premium` (ou outro)
- In which directory is your code located? **./**
- Modify settings? **N** (Vercel detecta "Other", sem build)

Quando a prévia estiver ok, publique em produção:

```bash
vercel --prod
```

Para atualizar depois, é só rodar `vercel --prod` de novo dentro da pasta.

## Opção 3: com GitHub (atualiza sozinho a cada push)

1. Crie um repositório no GitHub e envie a pasta:

```bash
git init
git add .
git commit -m "Protótipo Golddenclick"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/golddenclick-premium.git
git push -u origin main
```

2. Na Vercel: **Add New... > Project > Import** o repositório.
3. Framework Preset **Other**, sem Build Command. Clique em **Deploy**.
4. Cada `git push` na `main` publica uma nova versão.

---

## Depois de publicar

- **Testar:** abra o link, faça login com `teste` / `ouro2026` e confira o painel.
- **Domínio próprio (opcional):** Project > Settings > Domains > adicione o domínio e siga as instruções de DNS.
- **Deixar privado (opcional):** Project > Settings > Deployment Protection. Útil para mostrar só ao cliente.
- **Nome do link:** Project > Settings > General > Project Name muda o `*.vercel.app`.

## Cuidados

- É um protótipo: login, pagamento e envio de obras são simulados e ficam no navegador de quem acessa.
- A marca e as fotos são da Golddenclick (as fotos vêm de golddenclick.com). Publique como apresentação para o cliente, de preferência com proteção de acesso ligada, e não como site oficial.
