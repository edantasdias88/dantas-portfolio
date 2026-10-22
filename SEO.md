# SEO e publicação

## O que o build prepara

`npm run build` cria HTML inicial específico para Home, Projetos, Sobre mim, Contato e os cases CAA, iRuas e Dantas DS. Os títulos e as descrições vêm das traduções em português como fallback para crawlers que não executam JavaScript; o componente `Seo` atualiza título, descrição, idioma, Open Graph, Twitter e JSON-LD durante a navegação e quando o idioma muda.

Como português e inglês compartilham as mesmas URLs e o idioma é uma preferência de navegador/usuário, não há URLs distintas para `hreflang` nem versões linguísticas separadas no sitemap. O conteúdo em inglês depende do JavaScript no mesmo endereço; para indexação independente por idioma, será necessário adotar URLs públicas próprias para cada língua.

O build também cria `404.html` com `noindex,follow`. O `robots.txt` permite rastreamento. O sitemap e os URLs absolutos de canonical, Open Graph, Twitter e JSON-LD só são emitidos quando a origem de produção válida é fornecida.

## Configuração para TurboSite

Antes do build de produção, configure no ambiente de compilação:

```sh
VITE_SITE_URL=https://DOMINIO-DE-PRODUCAO
VITE_BASE_PATH=/ npm run build
```

Substitua `DOMINIO-DE-PRODUCAO` pelo domínio HTTPS confirmado, sem caminho, barra final, credenciais, query ou fragmento. Esse exemplo é uma instrução de configuração, não um domínio a publicar. Se o domínio ainda não estiver definido, deixe `VITE_SITE_URL` vazio: o build omite URLs absolutas em vez de inventar canonicals, previews sociais ou endereços de sitemap. Não publique um build sem essa configuração se esses metadados forem necessários.

O caminho de imagem social é gerado como `/images/edilson-portrait.jpg` sob a origem e o `VITE_BASE_PATH` configurado. É a fotografia já usada em Sobre mim, convertida para JPEG mantendo a imagem e as dimensões de 1155 × 1362 px. A imagem é alta e algumas plataformas podem recortá-la; confira os previews reais depois da publicação.

`public/.htaccess` deixa arquivos existentes passarem e encaminha caminhos do React Router para o SPA, sem interceptar `/api/`. Confirme com a TurboSite que Apache e `mod_rewrite` estão habilitados e que o domínio serve HTTPS. Nenhuma configuração de DNS, hospedagem ou deploy foi alterada.

## Rotas incluídas

- `/`
- `/projetos/`
- `/sobre-mim/`
- `/contato/`
- `/case/caa/`
- `/case/iruas/`
- `/case/dantas-ds/`

O sitemap exclui a rota 404. A rota correta do projeto é `/case/iruas`; não há redirecionamento HTTP necessário para o antigo erro de digitação `/case/irus` porque essa referência não é usada pelo código da aplicação.

### Status HTTP da página 404

O build gera `dist/404.html` com `noindex,follow`, e a aplicação mostra a tela 404 para caminhos desconhecidos. A regra SPA atual em `public/.htaccess` encaminha caminhos não existentes para `index.html`; por isso, ela pode responder `200 OK` (soft 404), embora o React Router exiba a tela correta. Para retornar HTTP `404`, a hospedagem precisa distinguir as rotas válidas do portfólio antes do fallback SPA e servir `404.html` com status 404, sem redirecionar o visitante. Confirme com a TurboSite se esse comportamento pode ser configurado no servidor; não altere o fallback atual sem essa confirmação, pois ele também permite acesso direto às rotas válidas do React Router.

## Verificações após publicar

1. Abra `https://DOMINIO-DE-PRODUCAO/robots.txt` e `https://DOMINIO-DE-PRODUCAO/sitemap.xml`; confirme que todos os links usam o domínio oficial, HTTPS e as rotas acima.
2. Confira o HTML recebido diretamente em cada rota e valide canonical, description, Open Graph, Twitter e JSON-LD. Teste também um caminho inexistente para confirmar `noindex`/404 conforme o comportamento HTTP configurado pela hospedagem.
3. Use o Google Search Console para verificar a propriedade, inspecionar URLs e enviar o sitemap. Isso não garante indexação imediata.
4. Atualize o cache dos previews de WhatsApp, LinkedIn e outras plataformas com as ferramentas oficiais de inspeção/depuração após publicar.
5. Meça LCP, INP e CLS em dados reais (PageSpeed Insights/CrUX ou Search Console) depois que houver tráfego. O build local não demonstra aprovação de Core Web Vitals.

## Observações de desempenho e acessibilidade

As imagens principais dos cases CAA e iRuas e a fotografia social foram convertidas de PNGs RGB para JPEG mantendo dimensões e aparência; a foto social passou de aproximadamente 1,7 MB para 285 KB, a capa CAA de 2,6 MB para 653 KB e a capa iRuas de 2,7 MB para 771 KB. A imagem principal transparente do CAA foi convertida de PNG para WebP com alpha, mantendo 2592 × 1882 px e aparência visual (cerca de 3,5 MB para 512 KB).

O projeto mantém `alt` descritivo em imagens de conteúdo e `alt=""` nas imagens decorativas encontradas na revisão estática. Essa revisão não mede contraste, ordem de foco nem Web Vitals em navegadores reais; faça uma auditoria manual e medições após o deploy.
