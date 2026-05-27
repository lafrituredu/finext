<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    // Mailtrap is used to send app emails with templates.
    'mailtrap' => [
        // API token used to call Mailtrap.
        'api_token' => env('MAILTRAP_API_TOKEN'),
        // Mailtrap API endpoint.
        'api_endpoint' => env('MAILTRAP_API_ENDPOINT', 'https://send.api.mailtrap.io/api/send'),
        // Sender email and sender name.
        'from_email' => env('MAIL_FROM_ADDRESS', 'hello@example.com'),
        'from_name' => env('MAIL_FROM_NAME', env('APP_NAME', 'FiNext')),
        // Email where contact form messages are sent.
        'support_email' => env('CONTACT_SUPPORT_EMAIL', 'finextcontact@finext.com'),
        // Template ids for each email type and language.
        'templates' => [
            // Contact form auto email templates.
            'contact' => [
                'en' => env('MAILTRAP_CONTACT_TEMPLATE_EN', 'a125ca7d-2019-4a9d-9099-9c4adf591821'),
                'es' => env('MAILTRAP_CONTACT_TEMPLATE_ES', 'a81836d6-7e09-409a-93e0-06732550df23'),
            ],
            // Password reset email templates.
            'password_reset' => [
                'en' => env('MAILTRAP_PASSWORD_RESET_TEMPLATE_EN', '8b2993bf-7883-4a5e-92ff-9a428998d8dd'),
                'es' => env('MAILTRAP_PASSWORD_RESET_TEMPLATE_ES', 'b3fa753f-b895-4868-8ad7-01a7b79971c3'),
            ],
            // Email verification templates.
            'email_verification' => [
                'en' => env('MAILTRAP_EMAIL_VERIFICATION_TEMPLATE_EN', 'b3e77c8f-6d34-49d5-b1b0-e51563665266'),
                'es' => env('MAILTRAP_EMAIL_VERIFICATION_TEMPLATE_ES', '151a9977-757b-4d7a-a70e-e70787b88fc0'),
            ],
        ],
    ],

    // Google OAuth configuration.
    'google' => [
        // Google app credentials.
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        // Backend callback used by Google after login.
        'redirect' => env('GOOGLE_REDIRECT_URI', env('APP_URL', 'http://127.0.0.1:8000') . '/api/auth/google/callback'),
        // Frontend callback used after Laravel finishes Google login.
        'frontend_redirect' => env('GOOGLE_FRONTEND_REDIRECT_URI', env('FRONTEND_URL', 'http://localhost:5173') . '/auth/google/callback'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

];
