# Endpoint de contato PHP

O código do endpoint é `backend/contact.php`; ele deve ser publicado como `/api/contact.php` no servidor PHP, separado do build estático. Ele recebe `POST application/json` com os dados do formulário: `name`, `email`, `phone`, `company` e `message`. O destinatário é fixo no backend: `edantasdias88@gmail.com`.

## Dependência e ambiente

O endpoint usa PHPMailer 6.12.0 por SMTP autenticado. A versão 6 foi escolhida para permanecer compatível com PHP 7.4; a documentação pública da TurboSite lista PHP 7.4 e 8.4 em hospedagens Linux. Quando disponível no plano, prefira PHP 8.4. O endpoint também requer as extensões PHP `filter`, `json` e `openssl`.

O `composer.json` deste diretório fixa a versão direta da biblioteca. Na primeira máquina de desenvolvimento que tenha PHP e Composer, gere o lockfile e os arquivos de dependência:

```sh
composer install --working-dir=backend --no-dev --prefer-dist --optimize-autoloader
```

Como este ambiente de desenvolvimento não tem PHP nem Composer instalados, `backend/composer.lock` e `backend/vendor/` não foram gerados aqui. Preserve o lockfile criado pela primeira instalação para futuras publicações. O servidor não precisa ter Composer quando o diretório `vendor` gerado for transferido junto à configuração privada.

## Configuração privada

O endpoint aceita variáveis de ambiente de servidor. Caso o painel não ofereça essa função, use o arquivo privado retornado por `backend/config.example.php` como `contact-config.php`, fora do diretório público. Por padrão, o endpoint procura:

```text
<diretório-pai-do-document-root>/private/dantas-portfolio-contact/
  contact-config.php
  vendor/autoload.php
```

Esse local é uma convenção, não uma informação confirmada da conta. Se o FTP ou a hospedagem não permitir gravar fora do document root, peça ao suporte da TurboSite o caminho privado recomendado; não coloque senha SMTP em `public/`, `dist/` ou em qualquer variável `VITE_*`.

Valores alternativos podem ser definidos no ambiente PHP com `CONTACT_PRIVATE_DIR`, `CONTACT_PRIVATE_CONFIG` e `CONTACT_AUTOLOAD_PATH`. As configurações SMTP aceitas são `CONTACT_SMTP_HOST`, `CONTACT_SMTP_PORT`, `CONTACT_SMTP_SECURITY` (`tls` ou `ssl`), `CONTACT_SMTP_USERNAME`, `CONTACT_SMTP_PASSWORD`, `CONTACT_FROM_EMAIL`, `CONTACT_FROM_NAME` e `CONTACT_ALLOWED_ORIGINS` (origens completas separadas por vírgula). O destinatário não é configurável pela requisição nem por essas variáveis.

Se usar arquivo privado, limite o acesso ao dono (diretório `700`, configuração `600`, ajustando para o usuário efetivo do PHP da hospedagem) e teste que o PHP consiga ler o arquivo e o autoloader. A senha nunca deve ser registrada em logs.

## Desenvolvimento local

Com PHP/Composer instalados em uma máquina de desenvolvimento, crie `backend/private/contact-config.php` a partir do exemplo e instale a dependência. Execute o endpoint com o servidor embutido do PHP:

```sh
CONTACT_PRIVATE_DIR="$PWD/backend/private" \
CONTACT_AUTOLOAD_PATH="$PWD/backend/vendor/autoload.php" \
php -S 127.0.0.1:8080 -t public backend/router.php
```

Configure `VITE_CONTACT_ENDPOINT=http://127.0.0.1:8080/api/contact.php` no `.env.local` do frontend e inclua `http://localhost:5173` ou `http://127.0.0.1:5173` em `allowed_origins`, de acordo com a origem usada no navegador. Não use credenciais reais em arquivos rastreados.

## Publicação na TurboSite

1. Confirme no painel/suporte o document root, a versão PHP efetiva, `openssl`, envio de conexões SMTP de saída, suporte a variáveis de ambiente, Composer e possibilidade de gravar fora do document root. A página pública da hospedagem lista PHP e SMTP, mas não confirma esses detalhes por plano.
2. Gere o frontend para domínio na raiz com `VITE_BASE_PATH=/` e `VITE_CONTACT_ENDPOINT=/api/contact.php`:

   ```sh
   VITE_BASE_PATH=/ VITE_CONTACT_ENDPOINT=/api/contact.php npm run build
   ```

3. Transfira somente o conteúdo de `dist/` para o document root. Ele contém os arquivos estáticos do site e `.htaccess`, mas não o código PHP. O `.htaccess` envia as rotas do React Router para `index.html` e mantém `/api/` fora do fallback. Isso pressupõe Apache com `mod_rewrite` e permissão `AllowOverride`; confirme esses recursos com a hospedagem. Se a conta usar outro servidor, configure o fallback de SPA e a rota PHP equivalente no painel/suporte.
4. Transfira `backend/contact.php` para `<document-root>/api/contact.php`. Transfira `backend/vendor/` e uma cópia preenchida de `backend/config.example.php` para o diretório privado descrito acima, renomeando o arquivo para `contact-config.php`. Não envie o diretório-fonte `backend/` completo para a raiz pública.
5. Obtenha do painel de e-mail os valores corretos de host SMTP, porta, segurança, usuário e senha. O remetente precisa pertencer à conta ou estar autorizado pelo provedor; configure `from_email` como esse remetente. Defina `allowed_origins` com a origem HTTPS real do portfólio. A TurboSite anuncia SMTP, mas isso não determina o host nem as credenciais da conta.
6. Ative HTTPS e confirme que a extensão OpenSSL está disponível. Depois faça um único envio controlado e confira a mensagem em `edantasdias88@gmail.com`, incluindo a pasta de spam. A resposta `{ "ok": true }` confirma aceitação pela sessão SMTP; não garante entrega final na caixa de entrada.

O domínio da conta, o document root, a forma de injetar variáveis de ambiente, o PHP/extensões ativos, Composer, `mod_rewrite` e as credenciais SMTP não estão disponíveis neste repositório. Por isso o envio real ainda não foi configurado nem testado.

Depois de instalar PHP, verifique a sintaxe antes da publicação:

```sh
php -l backend/contact.php
php -l backend/router.php
```

Com o servidor local ligado, estes pedidos não enviam e-mail e validam método, JSON e campos:

```sh
curl -i http://127.0.0.1:8080/api/contact.php
curl -i -X POST http://127.0.0.1:8080/api/contact.php -H 'Content-Type: application/json' --data '{'
curl -i -X POST http://127.0.0.1:8080/api/contact.php -H 'Content-Type: application/json' --data '{"name":" ","email":"invalido","phone":"(11) 12","company":"","message":" "}'
```

Os resultados esperados são `405`, `400` e `422`, respectivamente. Faça um único envio válido depois de configurar a conta SMTP para confirmar a aceitação do servidor.

Referências consultadas: [especificações públicas da hospedagem TurboSite](https://www.turbosite.com.br/solucoes/hospedagem-de-sites), [publicação FTP na TurboSite](https://www.turbosite.com.br/ajuda/publicando-site-usando-o-filezilla) e [instalação/envio SMTP do PHPMailer](https://github.com/PHPMailer/PHPMailer).

## Respostas e proteção

- `200 {"ok":true}`: o SMTP aceitou a mensagem.
- `400`, `413`, `415`: JSON, tamanho ou media type inválido.
- `405`: método não permitido.
- `422`: validação de campo; os códigos retornados são traduzidos no frontend.
- `429`: limite de cinco envios por IP em uma hora.
- `502`: SMTP falhou; o visitante recebe erro genérico e o log não contém conteúdo pessoal ou credenciais.
- `503`: dependência ou configuração necessária ainda indisponível.

O endpoint limita o corpo a 16 KiB, valida novamente os campos, mantém o destino fixo, aceita apenas uma origem explicitamente configurada quando `Origin` é enviado, e não renderiza HTML da mensagem. Requisições sem `Origin` continuam sujeitas à validação, ao limite de frequência e às demais proteções; CORS não é tratado como mecanismo de autenticação.
