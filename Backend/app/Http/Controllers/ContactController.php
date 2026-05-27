<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ContactController extends Controller
{
    // Send an automatic contact email using Mailtrap.
    public function send(Request $request): JsonResponse
    {
        // Validate all data before using it in the Mailtrap email.
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:3000'],
            'locale' => ['nullable', 'in:en,es'],
        ]);

        // Read language and Mailtrap configuration.
        $locale = $data['locale'] ?? 'en';
        $token = config('services.mailtrap.api_token');
        $endpoint = config('services.mailtrap.api_endpoint');
        $templateUuid = config("services.mailtrap.templates.contact.$locale");

        // Stop if any needed Mailtrap value is missing.
        if (!$token || !$endpoint || !$templateUuid) {
            return response()->json([
                'message' => 'La configuracion de Mailtrap no esta completa.',
            ], 500);
        }

        // Send an automatic answer to the email written by the user.
        $response = Http::withHeaders([
            'Api-Token' => $token,
        ])->post($endpoint, [
            'from' => [
                'email' => config('services.mailtrap.from_email'),
                'name' => config('services.mailtrap.from_name'),
            ],
            'to' => [
                ['email' => $data['email']],
            ],
            'template_uuid' => $templateUuid,
            'template_variables' => [
                'name' => $data['name'],
                'subject' => $data['subject'],
                'support_email' => config('services.mailtrap.support_email'),
            ],
        ]);

        // If Mailtrap fails, report the error and return a server error.
        if ($response->failed()) {
            report(new \RuntimeException('Mailtrap contact email failed: ' . $response->body()));

            return response()->json([
                'message' => 'No hemos podido enviar la respuesta automatica. Intentalo de nuevo en unos minutos.',
            ], 500);
        }

        // Mailtrap accepted the email.
        return response()->json([
            'message' => 'Gracias por tu mensaje. En menos de 24 horas te respondera uno de nuestros tecnicos.',
        ]);
    }
}
