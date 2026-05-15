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

    'mailtrap' => [
        'api_token' => env('MAILTRAP_API_TOKEN'),
        'api_endpoint' => env('MAILTRAP_API_ENDPOINT', 'https://send.api.mailtrap.io/api/send'),
        'from_email' => env('MAIL_FROM_ADDRESS', 'hello@example.com'),
        'from_name' => env('MAIL_FROM_NAME', env('APP_NAME', 'FiNext')),
        'support_email' => env('CONTACT_SUPPORT_EMAIL', 'finextcontact@finext.com'),
        'templates' => [
            'contact' => [
                'en' => env('MAILTRAP_CONTACT_TEMPLATE_EN', 'a125ca7d-2019-4a9d-9099-9c4adf591821'),
                'es' => env('MAILTRAP_CONTACT_TEMPLATE_ES', 'a81836d6-7e09-409a-93e0-06732550df23'),
            ],
            'password_reset' => [
                'en' => env('MAILTRAP_PASSWORD_RESET_TEMPLATE_EN', '8b2993bf-7883-4a5e-92ff-9a428998d8dd'),
                'es' => env('MAILTRAP_PASSWORD_RESET_TEMPLATE_ES', 'b3fa753f-b895-4868-8ad7-01a7b79971c3'),
            ],
            'email_verification' => [
                'en' => env('MAILTRAP_EMAIL_VERIFICATION_TEMPLATE_EN', 'b3e77c8f-6d34-49d5-b1b0-e51563665266'),
                'es' => env('MAILTRAP_EMAIL_VERIFICATION_TEMPLATE_ES', '151a9977-757b-4d7a-a70e-e70787b88fc0'),
            ],
        ],
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

];
