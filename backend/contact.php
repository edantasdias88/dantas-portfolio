<?php
declare(strict_types=1);

const CONTACT_RECIPIENT = 'edantasdias88@gmail.com';
const MAX_REQUEST_BYTES = 16384;
const MAX_MESSAGES_PER_HOUR = 5;

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
header('X-Content-Type-Options: nosniff');

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function configuredValue(array $config, string $envName, string $key)
{
    $value = getenv($envName);
    return $value !== false && $value !== '' ? $value : ($config[$key] ?? null);
}

function normalizeOrigin(string $origin): string
{
    $parts = parse_url($origin);
    if (!is_array($parts) || !isset($parts['scheme'], $parts['host'])) return '';
    if (!in_array(strtolower($parts['scheme']), ['http', 'https'], true)) return '';
    if (isset($parts['user']) || isset($parts['pass']) || (isset($parts['path']) && $parts['path'] !== '/') || isset($parts['query']) || isset($parts['fragment'])) return '';
    return strtolower($parts['scheme'] . '://' . $parts['host'] . (isset($parts['port']) ? ':' . $parts['port'] : ''));
}

function cleanSingleLine(string $value): string
{
    $cleaned = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $value);
    return trim(is_string($cleaned) ? $cleaned : '');
}

function trimUnicode(string $value): string
{
    $trimmed = preg_replace('/^\s+|\s+$/u', '', $value);
    return is_string($trimmed) ? $trimmed : trim($value);
}

function characterLength(string $value): int
{
    $count = preg_match_all('/./us', $value, $matches);
    return $count === false ? PHP_INT_MAX : $count;
}

function requestString(array $input, string $key): string
{
    return isset($input[$key]) && is_string($input[$key]) ? $input[$key] : '';
}

function validBrazilianPhone(string $phone): bool
{
    if (!preg_match('/^\+?[0-9(). -]+$/D', $phone)) return false;
    $digits = preg_replace('/\D/', '', $phone) ?? '';
    if ((strlen($digits) === 12 || strlen($digits) === 13) && substr($digits, 0, 2) === '55') {
        $digits = substr($digits, 2);
    }
    return preg_match('/^(?:[1-9][1-9])(?:[2-5]\d{7}|9\d{8})$/D', $digits) === 1;
}

function allowRate(string $ip, string $privateSalt): ?bool
{
    $key = hash_hmac('sha256', $ip !== '' ? $ip : 'unknown', $privateSalt);
    $path = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'dantas-contact-' . $key . '.json';
    $handle = @fopen($path, 'c+');
    if ($handle === false || !flock($handle, LOCK_EX)) {
        if (is_resource($handle)) fclose($handle);
        return null;
    }

    rewind($handle);
    $decoded = json_decode(stream_get_contents($handle) ?: '[]', true);
    $now = time();
    $recent = is_array($decoded)
        ? array_values(array_filter($decoded, static fn ($time): bool => is_int($time) && $time > $now - 3600))
        : [];
    $allowed = count($recent) < MAX_MESSAGES_PER_HOUR;
    if ($allowed) $recent[] = $now;

    rewind($handle);
    ftruncate($handle, 0);
    fwrite($handle, json_encode($recent));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
    return $allowed;
}

$documentRoot = (string) ($_SERVER['DOCUMENT_ROOT'] ?? '');
$defaultPrivateDir = $documentRoot !== ''
    ? dirname($documentRoot) . '/private/dantas-portfolio-contact'
    : dirname(__DIR__) . '/backend/private';
$privateDir = (string) (getenv('CONTACT_PRIVATE_DIR') ?: $defaultPrivateDir);
$configPath = (string) (getenv('CONTACT_PRIVATE_CONFIG') ?: $privateDir . '/contact-config.php');
try {
    $config = is_file($configPath) ? require $configPath : [];
} catch (Throwable $error) {
    respond(503, ['ok' => false, 'error' => 'service_unavailable']);
}
if (!is_array($config)) $config = [];

$originsValue = configuredValue($config, 'CONTACT_ALLOWED_ORIGINS', 'allowed_origins');
$allowedOrigins = is_array($originsValue)
    ? $originsValue
    : (is_string($originsValue) ? preg_split('/\s*,\s*/', $originsValue, -1, PREG_SPLIT_NO_EMPTY) : []);
$allowedOrigins = array_values(array_filter(array_map(static fn ($origin): string => normalizeOrigin((string) $origin), $allowedOrigins)));
$requestOrigin = normalizeOrigin((string) ($_SERVER['HTTP_ORIGIN'] ?? ''));

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    if ($requestOrigin === '' || !in_array($requestOrigin, $allowedOrigins, true)) {
        respond(403, ['ok' => false, 'error' => 'origin_not_allowed']);
    }
    header('Access-Control-Allow-Origin: ' . $requestOrigin);
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Accept');
    header('Access-Control-Max-Age: 600');
    header('Vary: Origin');
    http_response_code(204);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST, OPTIONS');
    respond(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

if ($requestOrigin !== '' && !in_array($requestOrigin, $allowedOrigins, true)) {
    respond(403, ['ok' => false, 'error' => 'origin_not_allowed']);
}
if ($requestOrigin !== '') {
    header('Access-Control-Allow-Origin: ' . $requestOrigin);
    header('Vary: Origin');
}

$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > MAX_REQUEST_BYTES) respond(413, ['ok' => false, 'error' => 'request_too_large']);
$mediaType = strtolower(trim(explode(';', (string) ($_SERVER['CONTENT_TYPE'] ?? ''), 2)[0]));
if ($mediaType !== 'application/json') {
    respond(415, ['ok' => false, 'error' => 'unsupported_media_type']);
}

$rawBody = file_get_contents('php://input', false, null, 0, MAX_REQUEST_BYTES + 1);
if (!is_string($rawBody) || strlen($rawBody) > MAX_REQUEST_BYTES) {
    respond(413, ['ok' => false, 'error' => 'request_too_large']);
}
$decodedBody = is_string($rawBody) ? json_decode($rawBody) : null;
if (!$decodedBody instanceof stdClass || json_last_error() !== JSON_ERROR_NONE) {
    respond(400, ['ok' => false, 'error' => 'invalid_json']);
}
$input = get_object_vars($decodedBody);

$name = cleanSingleLine(requestString($input, 'name'));
$email = trim(requestString($input, 'email'));
$phone = trim(requestString($input, 'phone'));
$company = cleanSingleLine(requestString($input, 'company'));
$message = trimUnicode(str_replace("\0", '', requestString($input, 'message')));
$fieldErrors = [];

if ($name === '') $fieldErrors['name'] = 'nameRequired';
elseif (characterLength($name) > 120) $fieldErrors['name'] = 'nameTooLong';
if ($email === '') $fieldErrors['email'] = 'emailRequired';
elseif (strlen($email) > 254 || filter_var($email, FILTER_VALIDATE_EMAIL) === false) $fieldErrors['email'] = 'emailInvalid';
if ($phone === '') $fieldErrors['phone'] = 'phoneRequired';
elseif (strlen($phone) > 40 || !validBrazilianPhone($phone)) $fieldErrors['phone'] = 'phoneInvalid';
if (characterLength($company) > 120) $fieldErrors['company'] = 'companyTooLong';
if ($message === '') $fieldErrors['message'] = 'messageRequired';
elseif (characterLength($message) > 5000) $fieldErrors['message'] = 'messageTooLong';

if ($fieldErrors !== []) respond(422, ['ok' => false, 'error' => 'validation', 'fields' => $fieldErrors]);

$smtpHost = trim((string) configuredValue($config, 'CONTACT_SMTP_HOST', 'smtp_host'));
$smtpPort = filter_var(configuredValue($config, 'CONTACT_SMTP_PORT', 'smtp_port'), FILTER_VALIDATE_INT);
$smtpSecurity = strtolower(trim((string) configuredValue($config, 'CONTACT_SMTP_SECURITY', 'smtp_security')));
$smtpUsername = trim((string) configuredValue($config, 'CONTACT_SMTP_USERNAME', 'smtp_username'));
$smtpPassword = (string) configuredValue($config, 'CONTACT_SMTP_PASSWORD', 'smtp_password');
$fromEmail = trim((string) configuredValue($config, 'CONTACT_FROM_EMAIL', 'from_email'));
$fromName = cleanSingleLine((string) configuredValue($config, 'CONTACT_FROM_NAME', 'from_name'));
$autoloadPath = (string) (getenv('CONTACT_AUTOLOAD_PATH') ?: $privateDir . '/vendor/autoload.php');

$smtpConfigured = $smtpHost !== ''
    && $smtpPort !== false && $smtpPort >= 1 && $smtpPort <= 65535
    && in_array($smtpSecurity, ['tls', 'ssl'], true)
    && $smtpUsername !== '' && $smtpPassword !== ''
    && filter_var($fromEmail, FILTER_VALIDATE_EMAIL) !== false
    && $fromName !== '' && $allowedOrigins !== []
    && is_file($autoloadPath) && extension_loaded('openssl');

if (!$smtpConfigured) respond(503, ['ok' => false, 'error' => 'service_unavailable']);
$rateAllowed = allowRate((string) ($_SERVER['REMOTE_ADDR'] ?? ''), $smtpUsername . ':' . $smtpPassword);
if ($rateAllowed === null) respond(503, ['ok' => false, 'error' => 'service_unavailable']);
if (!$rateAllowed) respond(429, ['ok' => false, 'error' => 'rate_limited']);

try {
    require_once $autoloadPath;
    $mailer = new PHPMailer\PHPMailer\PHPMailer(true);
    $mailer->isSMTP();
    $mailer->Host = $smtpHost;
    $mailer->SMTPAuth = true;
    $mailer->Username = $smtpUsername;
    $mailer->Password = $smtpPassword;
    $mailer->SMTPSecure = $smtpSecurity === 'ssl'
        ? PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS
        : PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    $mailer->Port = $smtpPort;
    $mailer->Timeout = 10;
    $mailer->SMTPDebug = 0;
    $mailer->CharSet = PHPMailer\PHPMailer\PHPMailer::CHARSET_UTF8;
    $mailer->isHTML(false);
    $mailer->setFrom($fromEmail, $fromName);
    $mailer->addAddress(CONTACT_RECIPIENT);
    $mailer->addReplyTo($email, $name);
    $mailer->Subject = 'Novo contato pelo portfólio — ' . $name;
    $mailer->Body = implode("\n", [
        'Novo contato recebido pelo portfólio.',
        '',
        'Nome: ' . $name,
        'E-mail: ' . $email,
        'Telefone: ' . $phone,
        'Empresa: ' . ($company !== '' ? $company : 'Não informada'),
        'Recebido em: ' . (new DateTimeImmutable('now', new DateTimeZone('America/Sao_Paulo')))->format('d/m/Y H:i:s T'),
        '',
        'Mensagem:',
        $message,
    ]);
    $mailer->send();
    respond(200, ['ok' => true]);
} catch (Throwable $error) {
    error_log('[portfolio-contact] SMTP delivery failed (' . get_class($error) . ').');
    respond(502, ['ok' => false, 'error' => 'delivery_failed']);
}
