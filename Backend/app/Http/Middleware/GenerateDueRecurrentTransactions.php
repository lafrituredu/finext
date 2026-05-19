<?php

namespace App\Http\Middleware;

use App\Services\RecurrentTransactionGenerator;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class GenerateDueRecurrentTransactions
{
    public function __construct(private RecurrentTransactionGenerator $generator)
    {
    }

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user) {
            $this->generator->generateDue($user->id);
        }

        return $next($request);
    }
}
