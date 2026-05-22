# Funcionamiento del Token en Finext

## 1. Que token usa Finext

Finext usa tokens de API de Laravel Sanctum.

Cuando un usuario inicia sesion o completa el registro, el backend ejecuta:

```php
$token = $user->createToken('auth_token')->plainTextToken;
```

Ese token se devuelve al frontend y se guarda en `localStorage`.

El token sirve para demostrar en cada peticion que el usuario ya esta autenticado. Sin token, las rutas privadas del dashboard no permiten el acceso.

## 2. Donde se crea el token

El token se crea en `Backend/app/Http/Controllers/AuthController.php`.

Casos principales:

- `register`: despues de crear `User` y, si toca, `Autonomo`.
- `login`: despues de validar email, password y correo verificado.
- `handleGoogleCallback`: cuando Google devuelve un usuario ya completo.

Ejemplo:

```php
$token = $user->createToken('auth_token')->plainTextToken;
```

`plainTextToken` es el valor completo que se manda al frontend. Laravel guarda en base de datos una version protegida del token, no el valor en claro.

## 3. Donde se guarda en base de datos

La tabla es:

```txt
personal_access_tokens
```

Migracion:

```txt
Backend/database/migrations/2026_04_08_113401_create_personal_access_tokens_table.php
```

Campos importantes:

- `tokenable_type`: modelo propietario del token, normalmente `App\Models\User`.
- `tokenable_id`: id del usuario.
- `name`: nombre del token, aqui `auth_token`.
- `token`: hash del token.
- `abilities`: permisos asociados.
- `last_used_at`: ultima vez que se uso.
- `expires_at`: fecha de caducidad si aplica.

La relacion con el modelo `User` funciona porque `User.php` usa:

```php
use HasApiTokens;
```

## 4. Donde se guarda en frontend

En el frontend se guarda en `localStorage`.

Login normal:

```ts
localStorage.setItem("token", data.token);
localStorage.setItem("user", data.user.username);
```

Registro:

```ts
localStorage.setItem("token", data.token);
localStorage.setItem("user", data.user.username);
```

Google callback:

```ts
localStorage.setItem("token", token);
localStorage.setItem("user", username);
```

Archivos implicados:

- `Frontend/src/pages/Login.tsx`
- `Frontend/src/pages/Register.tsx`
- `Frontend/src/pages/GoogleCallback.tsx`

## 5. Como se envia el token en cada peticion

El archivo clave es:

```txt
Frontend/src/api/axiosInstance.ts
```

Antes de enviar cualquier peticion, el interceptor lee:

```ts
const token = localStorage.getItem("token");
```

Si existe, anade la cabecera:

```txt
Authorization: Bearer TOKEN
```

Por eso los servicios como `BillService`, `CategoryService`, `GoalService` o `AuthServices` no tienen que repetir la logica del token. Todos usan la misma instancia `api`.

## 6. Como lo valida Laravel

Las rutas privadas estan agrupadas en `Backend/routes/api.php`:

```php
Route::middleware(['auth:sanctum','generate.recurrents'])->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/transactions', [TransactionController::class, 'index']);
});
```

El middleware `auth:sanctum`:

1. Lee la cabecera `Authorization`.
2. Extrae el token Bearer.
3. Busca el hash correspondiente en `personal_access_tokens`.
4. Identifica el usuario propietario.
5. Permite que `$request->user()` devuelva ese usuario.

Si el token no existe, no coincide o ha caducado, Laravel devuelve 401.

## 7. Comprobacion al recargar dashboard

Al refrescar `/dashboard`, React pierde el estado en memoria, pero conserva `localStorage`.

El componente `ProtectedRoute.tsx` no se fia solo de que exista un token guardado. Primero llama a:

```txt
GET /api/me
```

Si `/me` responde bien:

- El token es valido.
- El usuario existe.
- Se permite renderizar el dashboard.

Si `/me` falla:

- Se borra `token`.
- Se borra `user`.
- Se redirige a `/login`.

Si `/me` responde con usuario sin `email_verified_at`, se redirige a la pantalla de verificacion.

## 8. Que pasa cuando el token caduca o falla

`axiosInstance.ts` tiene un interceptor de respuesta.

Cuando cualquier peticion devuelve 401:

```ts
localStorage.removeItem("token");
localStorage.removeItem("user");
window.location.href = "/login";
```

Esto evita que el usuario se quede dentro de una sesion rota. La siguiente accion sera iniciar sesion otra vez.

La caducidad se configura en el backend con:

```txt
SANCTUM_TOKEN_EXPIRATION=120
```

En el `.env.example` significa 120 minutos.

## 9. Logout

El cierre de sesion llama a:

```txt
POST /api/logout
```

El backend ejecuta:

```php
$request->user()->currentAccessToken()->delete();
```

Esto borra de `personal_access_tokens` solo el token usado en esa peticion. Si el mismo usuario tuviera otro token en otro dispositivo, ese otro token podria seguir existiendo hasta caducar o borrarse.

Despues, el frontend debe borrar tambien `localStorage` para que el navegador deje de enviar el token.

## 10. Token y email verificado

En registro normal, Finext recibe token aunque el email aun no este verificado.

Esto permite conservar una sesion pendiente, pero `ProtectedRoute.tsx` bloquea el dashboard porque `/me` devuelve un usuario sin `email_verified_at`.

El usuario solo entra al dashboard cuando:

- El correo se verifica.
- `email_verified_at` tiene valor.
- `/me` responde con ese usuario ya verificado.

Google es distinto: si Google confirma email verificado, el backend marca `email_verified_at` directamente.

## 11. Diferencia con token de recuperacion de contrasena

No hay que confundir el token Sanctum con el token de recuperacion de password.

Token Sanctum:

- Sirve para autenticar peticiones de API.
- Vive en `personal_access_tokens`.
- Se envia como `Authorization: Bearer TOKEN`.

Token de recuperacion:

- Sirve para cambiar una contrasena olvidada.
- Vive en `password_reset_tokens`.
- Viaja en el enlace de reset password.
- Se consume en `POST /api/reset-password`.

## 12. Riesgos y buenas practicas

- No imprimir tokens en consola.
- No subir capturas con tokens visibles.
- Usar HTTPS en despliegue real.
- Mantener `APP_DEBUG=false` en produccion.
- Borrar tokens al eliminar una cuenta.
- Revisar `personal_access_tokens` si hay sesiones sospechosas.
- No confiar solo en `localStorage`; siempre validar contra `/me`.

## 13. Resumen corto

1. Login o registro correcto.
2. Laravel crea token Sanctum.
3. React guarda token en `localStorage`.
4. Axios lo envia como Bearer.
5. `auth:sanctum` identifica al usuario.
6. Las rutas privadas pueden usar `$request->user()`.
7. Logout borra el token actual.
8. Un 401 limpia la sesion y devuelve al login.
