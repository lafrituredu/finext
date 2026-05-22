# Registro y Login en Finext

## 1. Idea general

La autenticacion de Finext se reparte entre frontend y backend:

- El frontend muestra las pantallas, valida datos basicos y llama a la API.
- El backend valida de verdad los datos, consulta o crea modelos y devuelve una respuesta JSON.
- El modelo principal es `User`; si el usuario es autonomo tambien se crea un modelo `Autonomo`.
- El login y el registro devuelven un token de Laravel Sanctum para identificar al usuario en las rutas privadas.

Archivos principales:

- Vista login: `Frontend/src/pages/Login.tsx`
- Vista registro: `Frontend/src/pages/Register.tsx`
- Servicios API: `Frontend/src/api/AuthServices.ts`
- Instancia Axios: `Frontend/src/api/axiosInstance.ts`
- Rutas backend: `Backend/routes/api.php`
- Controlador: `Backend/app/Http/Controllers/AuthController.php`
- Modelos: `Backend/app/Models/User.php` y `Backend/app/Models/Autonomo.php`
- Migraciones: `Backend/database/migrations/0001_01_01_000000_create_users_table.php` y `2026_04_08_103452_create_autonomos_table.php`

## 2. Flujo del registro normal

El registro empieza en `Register.tsx`. La vista esta dividida en pasos:

1. Paso 1: email, username, password y confirmacion.
2. Paso 2: nombre completo, telefono y rol.
3. Paso 3: solo si el rol es `autonomo`, datos fiscales como DNI/NIE, empresa, IVA e IRPF.

Antes de avanzar desde el paso 1, la vista llama a:

```ts
checkEmail(formData.email)
checkUsername(formData.username)
```

Estas funciones estan en `AuthServices.ts` y llaman a:

```txt
GET /api/check-email
GET /api/check-username
```

El backend responde si esos valores estan libres. Esto no sustituye la validacion final del backend, pero mejora la experiencia del usuario porque avisa antes.

## 3. Preparacion del payload

Cuando el usuario termina el formulario, `Register.tsx` llama a `buildRegisterPayload`.

Archivo:

```txt
Frontend/src/utils/registerPayload.ts
```

Esta funcion elimina `confirmPassword`, porque solo sirve para validar en la vista, y prepara los nombres que espera Laravel:

```ts
email
password
username
full_name
phone_number
rol
dni
birthdate
modulo_iva
estado_civil
empresa
irpf
google_setup_token
```

Si el rol es `particular`, los campos fiscales viajan vacios y Laravel no los exige. Si el rol es `autonomo`, esos datos se validan y se guardan en la tabla `autonomos`.

## 4. Envio al backend

El registro se envia desde `AuthServices.ts`:

```ts
export const registerUser = async (data) => {
  const response = await api.post('/register', data)
  return response.data
}
```

La ruta esta definida en `Backend/routes/api.php`:

```php
Route::post('/register', [AuthController::class, 'register']);
```

Como es una ruta publica, no necesita token.

## 5. Controlador de registro

El metodo `register` de `AuthController.php` hace varias cosas:

1. Normaliza el DNI/NIE si viene informado.
2. Detecta si el registro viene de Google mediante `google_setup_token`.
3. Define las reglas de validacion.
4. Valida email, username, password, rol y datos fiscales.
5. Crea el usuario dentro de una transaccion de base de datos.
6. Si el rol es `autonomo`, crea tambien el registro en `autonomos`.
7. Genera un token Sanctum.
8. Si no es Google, envia correo de verificacion.
9. Devuelve JSON al frontend.

Respuesta esperada en registro normal:

```json
{
  "message": "Te hemos enviado un correo para verificar tu cuenta.",
  "user": {
    "id": 1,
    "username": "usuario",
    "email": "usuario@email.com"
  },
  "token": "TOKEN_SANCTUM",
  "requires_verification": true
}
```

Aunque se devuelve token, el usuario normal no debe entrar al dashboard hasta verificar el correo. Por eso el frontend navega a `/verify-email`.

## 6. Modelo User

El modelo `User` representa la tabla `users`.

Campos relevantes:

- `username`: nombre de usuario unico.
- `full_name`: nombre completo.
- `phone_number`: telefono.
- `rol`: `particular` o `autonomo`.
- `email`: correo unico.
- `email_verified_at`: fecha de verificacion del correo.
- `google_id`: id de Google si el usuario usa OAuth.
- `avatar`: ruta del avatar.
- `password`: contrasena hasheada.

El modelo usa:

```php
use HasApiTokens, HasFactory, Notifiable;
```

`HasApiTokens` es lo que permite usar Laravel Sanctum y crear tokens con:

```php
$user->createToken('auth_token')->plainTextToken;
```

## 7. Modelo Autonomo

El modelo `Autonomo` complementa a `User`.

La tabla `autonomos` usa `user_id` como clave primaria y foreign key. Esto significa que un usuario autonomo tiene como maximo una ficha fiscal.

Campos:

- `user_id`
- `dni`
- `birth_date`
- `modulo_iva`
- `civil_state`
- `company`
- `irpf`

El DNI/NIE no se guarda en claro. El controlador lo transforma con HMAC usando `APP_KEY`, para no exponer el documento real.

## 8. Flujo del login normal

El login empieza en `Login.tsx`.

La vista guarda en estado:

```ts
email
password
error
loading
successMessage
```

Cuando se envia el formulario, `handleLogin` llama a:

```ts
loginUser(email.trim(), password)
```

En `AuthServices.ts`, `loginUser` manda:

```txt
POST /api/login
```

Con body:

```json
{
  "email": "usuario@email.com",
  "password": "password"
}
```

## 9. Controlador de login

El metodo `login` de `AuthController.php`:

1. Valida que lleguen email y password.
2. Busca el usuario por email.
3. Comprueba la password con `Hash::check`.
4. Si no coincide, devuelve 401.
5. Si el email no esta verificado, devuelve 403 con codigo `EMAIL_NOT_VERIFIED`.
6. Si todo esta correcto, crea un token Sanctum.
7. Devuelve usuario y token.

Respuesta correcta:

```json
{
  "message": "Login correcto",
  "user": {
    "id": 1,
    "username": "usuario",
    "email": "usuario@email.com"
  },
  "token": "TOKEN_SANCTUM"
}
```

## 10. Guardado de sesion en frontend

Si `Login.tsx` recibe `token` y `user.username`, guarda:

```ts
localStorage.setItem("token", data.token);
localStorage.setItem("user", data.user.username);
navigate("/dashboard");
```

Desde ese momento, `axiosInstance.ts` leera el token y lo anadira a cada peticion protegida.

## 11. Caso email no verificado

Si el backend devuelve:

```json
{
  "message": "Debes verificar tu correo antes de iniciar sesion.",
  "code": "EMAIL_NOT_VERIFIED",
  "email": "usuario@email.com"
}
```

`Login.tsx` redirige a:

```txt
/verify-email?status=pending&email=usuario@email.com
```

La pantalla `VerifyEmail.tsx` permite mostrar instrucciones y reenviar el correo con:

```txt
POST /api/email/verification-notification
```

## 12. Login y registro con Google

Google empieza desde `Login.tsx` o `Register.tsx` llamando a:

```ts
window.location.assign(getGoogleAuthUrl());
```

`getGoogleAuthUrl` apunta al backend:

```txt
GET /api/auth/google/redirect
```

Laravel redirige a Google. Despues Google vuelve a:

```txt
GET /api/auth/google/callback
```

En `handleGoogleCallback`, el backend:

1. Comprueba el `state` firmado para evitar callbacks falsos.
2. Intercambia el `code` de Google por un access token.
3. Pide el perfil del usuario a Google.
4. Busca un usuario por `google_id` o email.
5. Si existe y esta completo, emite token Sanctum.
6. Si no existe o faltan datos, devuelve `google_setup_token`.

Si hay `google_setup_token`, `GoogleCallback.tsx` manda al usuario a `/register` con datos prerrellenos. Asi Finext puede pedir telefono, rol y datos fiscales propios del proyecto.

## 13. Resumen de responsabilidades

Vista:

- Recoge datos.
- Muestra errores.
- Valida formato basico.
- Navega entre pantallas.

Servicio API:

- Traduce acciones de la vista a peticiones HTTP.
- Usa Axios y devuelve `response.data`.

Controlador:

- Valida de forma definitiva.
- Crea o consulta modelos.
- Hashea passwords y DNI/NIE.
- Genera tokens.
- Devuelve JSON.

Modelo:

- Representa las tablas.
- Define relaciones.
- Permite a Laravel guardar y recuperar datos.

Base de datos:

- `users`: identidad principal.
- `autonomos`: datos fiscales para rol autonomo.
- `personal_access_tokens`: tokens de Sanctum.
- `password_reset_tokens`: tokens de recuperacion de contrasena.
