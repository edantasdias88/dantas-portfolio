# Status da implementação — Portfólio Edilson Dantas

## Pendência principal: acesso ao Figma

O conector do Figma respondeu **"sem acesso de edição"** para o arquivo
`Ryxhb4ajakSKVEleXmk2lT` (metadata, screenshot e design context falharam).
Por isso, **nenhuma propriedade visual foi lida diretamente do Figma**. O layout foi construído a partir de:

- especificações descritas no prompt (composição de cada seção, container de 1320 px, Geist, azul de destaque, Liquid Glass no menu, Processo e Sobre em blocos escuros, Projetos em tela cheia com overlay em gradiente e navegação lateral etc.);
- conteúdo do PDF `portfolio_edilson_dantas_conteudo_home.pdf`.

**Para ajustar a fidelidade:** compartilhe o arquivo com permissão de edição (ou exporte os frames como PNG) e
ajuste os tokens em `src/styles/themes.scss` (cores, tipografia, raios, espaçamentos). Os componentes
consomem apenas tokens semânticos, então trocar valores ali propaga para o site inteiro.

## Imagens do Figma (aplicadas)

Extraídas do Figma (conta matheus.simoes@comprealugueagora.com.br) e recortadas nas mesmas coordenadas dos nós, em `src/assets/images/` (WebP):

| Arquivo | Origem no Figma | Uso |
|---|---|---|
| `caa.webp` | `21:1151` (fundo de Projetos) | Slide/case/listagem CAA |
| `iruas-mockup.webp` | `18:714` "Notebook e aplicativo iRuas" | Accordion de Serviços + projeto iRuas |
| `public/images/edilson-portrait.jpg` | Conversão JPEG da fotografia original `44:1347` | Sobre mim (Home e `/sobre-mim`) e imagem padrão de compartilhamento |
| `logo-wordmark.webp` | logo do header | Header, menu e modal de contato |
| `silk.webp` | `18:781` / `44:1392` "image 3" | Fundo de Serviços e FAQ |

## Concluído e verificado

Verificado com build de produção + testes automatizados no Chrome (Playwright), sem erros de console:

- Stack: React 19, TypeScript strict, Vite, SCSS Modules, React Router, Motion, i18next.
- Rotas: `/`, `/projetos`, `/sobre-mim`, `/contato`, `/case/caa`, `/case/iruas`, `/case/dantas-ds`, 404. O case iRuas usa `/case/iruas`. Fallback SPA em `public/.htaccess` (Apache) e `public/_redirects` (Netlify).
- Tema claro/escuro: preferência do sistema na primeira visita, escolha salva em `localStorage`, sem flash (script inline no `index.html`), `color-scheme` atualizado.
- Idiomas pt-BR/en: detecção do navegador, escolha salva, `lang` atualizado, rota mantida, sem prefixo na URL.
- Menu em tela cheia (Liquid Glass): Escape, foco preso e devolvido, fecha ao navegar e com voltar do navegador.
- Modal de contato em tela cheia: todos os CTAs "Vamos conversar", Escape, foco devolvido, fundo `inert` e scroll bloqueado.
- Hero: 100svh, ondas SVG em loop contínuo, respeita `prefers-reduced-motion`.
- Como posso ajudar: arraste com mouse (com inércia), cursor pill "‹ arraste ›" só em ponteiro fino, toque nativo + dots em touch, dots ocultos quando não há overflow, último card termina exatamente na borda direita do container (medido: 1380 = 1380 em 1440 px).
- Serviços: 6 itens (incluindo Design Systems e Front-end), um aberto por vez, primeiro aberto, mockup iRuas + "Ver projetos relacionados" → `/case/iruas`.
- Processo: primeiro card aberto, um por vez, expande na horizontal (desktop) e na vertical (mobile).
- Projetos: scroll fixado, um slide por gesto, reverso, libera o scroll nas extremidades; parallax sutil; navegação lateral; mobile usa lista vertical.
- Como é trabalhar comigo (grade 2×2 aberta), Sobre mim (bloco escuro + imagem com revelação), FAQ (editorial, um aberto por vez, teclado), CTA final + rodapé com voltar ao topo.
- Sem overflow horizontal em 320, 375, 768, 1024, 1440 e 1936 px.
- SEO: títulos e descrições traduzidos por rota; build gera HTML inicial específico para cada rota e `404.html` com `noindex`. Canonical, imagem Open Graph/Twitter, JSON-LD e sitemap são gerados quando `VITE_SITE_URL` contém a origem HTTPS definitiva.

## Pendente (depende de material ou configuração externa)

1. **Envio do formulário** — defina `VITE_CONTACT_ENDPOINT` (ex.: Formspree) em `.env`. Sem ele, o formulário aparece desabilitado com um aviso explícito; não há sucesso simulado. O sucesso só é exibido após resposta 2xx.
2. **E-mail e WhatsApp** — `VITE_CONTACT_EMAIL` e `VITE_CONTACT_WHATSAPP`. Campos vazios não são renderizados.
3. **Imagem do Dantas DS** — não há imagem para ele no Figma; segue com a composição ilustrativa em CSS. Para trocar, adicione `image` ao projeto em `src/data/projects.ts`.
4. **Ícones dos cards** (Como posso ajudar, Processo, Como é trabalhar comigo) — existem no Figma como vetores e ainda não foram aplicados.
5. **Conteúdo completo dos cases** — as páginas mostram visão geral e o aviso "Case completo em preparação". As seções Contexto/Papel/Decisões/Resultados já têm rótulos traduzidos em `case.sections` e devem ser adicionadas em `src/pages/CaseStudy` quando o material validado existir (sem métricas inventadas).
6. **Trajetória em `/sobre-mim`** — não há histórico profissional nos documentos; a página usa apenas o posicionamento, valor, áreas, processo e forma de trabalho do PDF.
7. **SEO de produção** — configurar o domínio HTTPS definitivo em `VITE_SITE_URL` antes do build de publicação para gerar canonicals, metadados sociais, JSON-LD e sitemap com URLs absolutas.

## Como continuar

```bash
npm install
cp .env.example .env   # preencha os dados reais
npm run dev            # desenvolvimento
npm run build          # build de produção (tsc + vite)
npm run preview        # servir o build
```
