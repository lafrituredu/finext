# LSSI y Contacto en Finext

## 1. Resumen

Esta parte del proyecto tiene dos bloques:

- Paginas legales: aviso legal, privacidad y cookies.
- Formulario de contacto: formulario publico que envia una respuesta automatica mediante Mailtrap.

No hay login obligatorio para estas paginas. Son rutas publicas.

## 2. Rutas frontend

Las rutas estan en:

```txt
Frontend/src/App.tsx
```

Rutas:

```txt
/contact
/aviso-legal
/privacidad
/cookies
```

Todas se pueden abrir sin token.

## 3. LSSI

La parte LSSI se representa sobre todo en la pagina de aviso legal:

```txt
Frontend/src/pages/LegalNotice.tsx
```

Tambien hay paginas relacionadas:

```txt
Frontend/src/pages/PrivacyPolicy.tsx
Frontend/src/pages/CookiesPolicy.tsx
```

Estas paginas no llaman al backend. Solo muestran textos legales cargados desde los JSON de traducciones.

Archivos de texto legal en espanol:

```txt
Frontend/src/language/es/legalNotice.json
Frontend/src/language/es/privacyPolicy.json
Frontend/src/language/es/cookiesPolicy.json
```

Archivos equivalentes en ingles:

```txt
Frontend/src/language/en/legalNotice.json
Frontend/src/language/en/privacyPolicy.json
Frontend/src/language/en/cookiesPolicy.json
```

La libreria `react-i18next` decide que texto mostrar segun el idioma activo.

## 4. Como se pinta el aviso legal

`LegalNotice.tsx` tiene un array llamado `legalSections`.

Ese array no contiene el texto legal completo, solo las claves:

```txt
general
terms
access
links
intellectualProperty
legalActions
```

Despues el componente recorre esas claves y llama a `t(...)` para buscar el texto real en `legalNotice.json`.

Esto permite mantener la estructura de la pagina en React y el contenido legal en archivos de idioma.

## 5. Privacidad y cookies

`PrivacyPolicy.tsx` y `CookiesPolicy.tsx` funcionan de forma parecida, pero cargan arrays completos desde i18n:

```ts
t("sections", { returnObjects: true })
t("blocks", { returnObjects: true })
```

Es decir, los JSON ya traen la estructura de secciones, parrafos y listas.

Estas paginas son informativas. No guardan datos, no envian formularios y no usan API.

## 6. Formulario de contacto

La vista esta en:

```txt
Frontend/src/pages/Contact.tsx
```

Usa `react-hook-form` para:

- Guardar los campos del formulario.
- Validar antes de enviar.
- Mostrar errores debajo de cada campo.

Campos:

```txt
name
email
subject
message
```

Validaciones principales:

- Nombre obligatorio.
- Email obligatorio y con formato correcto.
- Asunto obligatorio.
- Mensaje obligatorio.
- Longitudes maximas.

## 7. Envio desde frontend

Cuando el usuario envia el formulario, `Contact.tsx` ejecuta:

```ts
api.post('/contact', data)
```

La instancia `api` viene de:

```txt
Frontend/src/api/axiosInstance.ts
```

Como `/contact` es publico, no necesita token. Si hubiera token en localStorage, Axios podria enviarlo igualmente, pero el backend no lo exige para esta ruta.

## 8. Ruta backend

La ruta esta en:

```txt
Backend/routes/api.php
```

Ruta:

```php
Route::post('/contact', [ContactController::class, 'send']);
```

Esta ruta esta fuera del grupo `auth:sanctum`, por eso cualquier visitante puede usarla.

## 9. Controlador de contacto

El controlador esta en:

```txt
Backend/app/Http/Controllers/ContactController.php
```

Metodo:

```php
send(Request $request)
```

Pasos:

1. Valida los datos recibidos.
2. Lee configuracion de Mailtrap desde `config/services.php`.
3. Comprueba que existan token, endpoint y plantilla.
4. Envia una peticion HTTP a Mailtrap.
5. Devuelve JSON de exito o error.

Validacion backend:

```txt
name: obligatorio, texto, maximo 255
email: obligatorio, email, maximo 255
subject: obligatorio, texto, maximo 255
message: obligatorio, texto, maximo 3000
locale: opcional, en o es
```

## 10. Configuracion Mailtrap

La configuracion se lee desde:

```txt
Backend/config/services.php
```

Variables `.env` relacionadas:

```txt
MAILTRAP_API_TOKEN
MAILTRAP_API_ENDPOINT
MAILTRAP_CONTACT_TEMPLATE_EN
MAILTRAP_CONTACT_TEMPLATE_ES
CONTACT_SUPPORT_EMAIL
MAIL_FROM_ADDRESS
MAIL_FROM_NAME
```

Si falta alguna variable importante, el backend devuelve error 500 con un mensaje indicando que la configuracion no esta completa.

## 11. Que hace exactamente el envio

El backend envia una respuesta automatica al email introducido por el usuario.

Actualmente el mensaje del usuario no se guarda en base de datos.

Actualmente tampoco se crea un ticket interno. El flujo depende de la plantilla de Mailtrap y de las variables que recibe.

Variables enviadas a la plantilla:

```txt
name
subject
support_email
```

## 12. Respuesta al frontend

Si Mailtrap responde bien:

```json
{
  "message": "Gracias por tu mensaje. En menos de 24 horas te respondera uno de nuestros tecnicos."
}
```

Si Mailtrap falla:

```json
{
  "message": "No hemos podido enviar la respuesta automatica. Intentalo de nuevo en unos minutos."
}
```

## 13. Resumen rapido

LSSI:

- Son paginas estaticas.
- Usan React Router.
- Usan textos de i18n.
- No usan backend.

Contacto:

- Es una pagina publica.
- Valida en frontend con `react-hook-form`.
- Envia `POST /api/contact`.
- Laravel vuelve a validar.
- Laravel usa Mailtrap.
- No se guarda en base de datos.
