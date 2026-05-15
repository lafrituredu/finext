<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ContactController extends Controller
{
    public function send(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:3000'],
            'locale' => ['nullable', 'in:en,es'],
        ]);

        $locale = $data['locale'] ?? 'en';
        $token = config('services.mailtrap.api_token');
        $endpoint = config('services.mailtrap.api_endpoint');
        $templateUuid = config("services.mailtrap.templates.contact.$locale");

        if (!$token || !$endpoint || !$templateUuid) {
            return response()->json([
                'message' => 'La configuracion de Mailtrap no esta completa.',
            ], 500);
        }

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

        if ($response->failed()) {
            report(new \RuntimeException('Mailtrap contact email failed: ' . $response->body()));

            return response()->json([
                'message' => 'No hemos podido enviar la respuesta automatica. Intentalo de nuevo en unos minutos.',
            ], 500);
        }

        return response()->json([
            'message' => 'Gracias por tu mensaje. En menos de 24 horas te respondera uno de nuestros tecnicos.',
        ]);
    }
}
