<?php
declare(strict_types=1);

$requestPath = parse_url((string) ($_SERVER['REQUEST_URI'] ?? '/'), PHP_URL_PATH);
if ($requestPath === '/api/contact.php') {
    require __DIR__ . '/contact.php';
    exit;
}

return false;
