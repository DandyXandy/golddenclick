# Golddenclick: análise e protótipo premium

## O que existe hoje (golddenclick.com)
- **Home (indexm.php):** logo, login no topo, aviso "clique no ícone do celular", texto de boas-vindas, 5 vencedores empilhados em uma coluna, tabelas de prêmios em texto corrido.
- **Cadastro (cadastrom.php):** formulário cinza em tabela, rótulos à esquerda, botão "Checar" amarelo, aviso de senha em texto pequeno.
- **Termos/Regras:** conteúdo excelente (como funciona, edital, valores), mas escondido em abas de texto longo.

## Problemas encontrados
1. Visual dos anos 2000: tabelas, fonte padrão, sem hierarquia, fundo branco que apaga o dourado da marca.
2. Não é responsivo: existem versões separadas para celular e desktop e o usuário precisa escolher com um ícone.
3. A proposta de valor (R$ 20 mil, artistas julgando artistas) só aparece depois de muita rolagem.
4. O prazo de envio (05/11/2026) não aparece na home. Não há senso de urgência.
5. Os preços de inscrição (6 tabelas diferentes) só existem no edital.
6. Prêmios em listas de 10 linhas iguais, sem destaque para o 1º lugar.
7. Cadastro sem validação visível, sem força de senha, sem explicar por que pedem o Instagram.
8. Login ocupa o topo inteiro da home para quem ainda não tem conta.

## O que foi mantido (essência)
- Preto + dourado, o wordmark Gold**den**click com "den" em destaque.
- O trocadilho gold / den (then) / click, agora como seção própria.
- Linguagem de batalha: "guerreiro", "arena", "Que a força e a sabedoria estejam com você".
- Todos os textos, valores, datas, nomes e links reais (Instagram, perfis, comprovante, WhatsApp, CNPJ).
- Os mesmos campos do cadastro, na mesma ordem.

## O que foi melhorado
- Site único e responsivo (fim da escolha celular/desktop).
- Hero com proposta clara + contagem regressiva real até 05/11/2026 23:59.
- Faixa de números (5 batalhas, R$ 80 mil pagos, 10 categorias, R$ 85 mil em prêmios).
- Prêmios em abas (geral, por categoria, jurados) com o 1º lugar em destaque.
- "Como funciona" resumido do edital, com a escada de pontos 150 a 10.
- Hall dos campeões com fotos, prêmio e links.
- Pilares de justiça (marco zero, 100% online, sem IA, selos não valem nota).
- Calculadora de inscrição: escolhe o histórico e vê os 5 pacotes e o custo por obra.
- FAQ com as dúvidas do edital + atalho para o suporte no WhatsApp.
- Login em modal; cadastro em página própria com validação, máscara de celular, força de senha e tela de sucesso.

## Arquivos
- `index.html`: home
- `cadastro.html`: cadastro
- `styles.css`, `app.js`

As fotos dos campeões são carregadas direto de golddenclick.com.
