<?php
/**
 * Copy this file to the private hosting directory as contact-config.php.
 * Fill SMTP values from the email provider/TurboSite control panel. Do not publish it.
 */
return [
    'smtp_host' => '',
    'smtp_port' => null,
    'smtp_security' => '', // tls (STARTTLS) or ssl (implicit TLS), as supplied by the provider
    'smtp_username' => '',
    'smtp_password' => '',
    'from_email' => '', // Must be authorized by the authenticated SMTP account
    'from_name' => 'Edilson Dantas',
    'allowed_origins' => [], // e.g. the exact HTTPS origin of the deployed portfolio
];
