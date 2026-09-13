# CLAUDE.md — Pricecloud

Guía de contexto no obvio para agentes Claude que trabajen en este repositorio.

## Estructura del proyecto

| Servicio | Stack | Rol |
|----------|-------|-----|
| `api-01/` | NestJS + TypeORM + PostgreSQL | API principal: auth, usuarios, proxy a api-02 |
| `api-02/` | Express + Apollo Server + PostgreSQL | GraphQL de precios cloud (fork de infracost/cloud-pricing-api) |
| `api-03/` | Flask + apache-libcloud | API Python para operaciones de infraestructura cloud |
| `ui/` | Next.js 15 + MUI v5 + React 18 | Frontend |

`api-02` es un fork de [infracost/cloud-pricing-api](https://github.com/infracost/cloud-pricing-api). Cambios upstream no se integran automáticamente.

---

## Dependencias: quirks conocidos

### npm overrides: todos viven en la raíz
**npm ignora el campo `overrides` de un workspace.** Solo se aplica el de `package.json` de la raíz. El bloque `overrides` que tenía `api-01/package.json` nunca tuvo efecto y fue eliminado — no volver a añadirlo ahí.

Overrides activos en la raíz y por qué:

| Override | Motivo |
|----------|--------|
| `lodash ^4.18.1` | transitiva de `@nestjs/config` y `@nestjs/swagger`; `<=4.17.23` vulnerable |
| `qs ^6.16.0` | `express@4` fija `qs@6.14.2` (DoS + bypass de array-limit) |
| `postcss ^8.5.28` | `next@15` fija `postcss@8.4.31` (XSS + lectura arbitraria vía sourceMappingURL). Evita tener que migrar a Next 16 |
| `multer ^2.3.0` | `@nestjs/platform-express@11` fija `multer@2.2.0` (varios DoS + bypass de límite de tamaño) |
| `uuid ^11.1.1` | transitiva de `typeorm`, `@apollo/server` y `googleapis-common` (falta de bounds check en v3/v5/v6) |
| `brace-expansion@^2` → `^2.1.4` | DoS. **Debe ir versionado a `^2`**: un override global forzaría v2 sobre `minimatch@3`, que espera v1 |
| `@typescript-eslint/{eslint-plugin,parser}` → `minimatch ^9.0.7` | ReDoS. Anidado a propósito: un `minimatch` global rompería a quien depende de `minimatch@3` |

### El override de `path-to-regexp` se retiró (rompía express 4)
Existía un `path-to-regexp: ^8.3.1` global para cubrir a `@nestjs/swagger`. Ya no hace falta y era activamente dañino:

- `@nestjs/core` y `@nestjs/swagger` pinean `8.4.2` por su cuenta, o sea que el override no aportaba nada.
- `express@4` (dependencia directa de api-02) necesita `~0.1.12`. Al forzarle v8 — que exporta funciones con nombre en vez de un callable — api-02 se caía al registrar la primera ruta con `TypeError: pathRegexp is not a function`. El contenedor quedaba en bucle de reinicio.

No reintroducirlo. Si algún día hace falta de nuevo, tiene que ir versionado (`path-to-regexp@^8`), nunca global.

Si `npm audit` reporta algo en estos paquetes, no usar `npm audit fix --force` — degradaría paquetes de NestJS a versiones obsoletas. Los overrides ya los cubren.

### Los overrides nuevos no se aplican sobre un `node_modules` existente
npm reutiliza el árbol ya instalado y **no re-resuelve** un override recién añadido, aunque se borre el lockfile. Tras tocar `overrides` hay que limpiar de verdad:

```bash
rm -rf node_modules api-01/node_modules api-02/node_modules ui/node_modules package-lock.json && npm install
```

Verificación: `npm audit --workspaces --include-workspace-root` debe dar `found 0 vulnerabilities`.

### nodemailer en api-01
- Versión: `^10.0.9`
- `nodemailer v7+` incluye sus propios tipos TypeScript; `@types/nodemailer` fue eliminado del proyecto
- El import interno `nodemailer/lib/mailer` (usado en v6) ya no existe. El tipo del transporter es `nodemailer.Transporter` (ver [email.service.ts](api-01/src/email/email.service.ts))
- El salto 8.x → 10.x no requirió cambios de código: `createTransport`, `Transporter`, `SendMailOptions` y `sendMail` son idénticos

### Apollo Server en api-02
- Versión: `@apollo/server ^5.5.0` (Apollo Server v5)
- En v5, la integración con Express fue separada al paquete `@as-integrations/express4`
- `gql` ya no se re-exporta desde `@apollo/server`; viene de `graphql-tag`
- El plugin `ApolloServerPluginLandingPageGraphQLPlayground` (v3) fue reemplazado por `ApolloServerPluginLandingPageLocalDefault` (v5)
- En v5, los plugins se pasan como instancias (`new ApolloLogger(logger)`), no como factories (`() => new ApolloLogger(logger)`)
- CORS en `/graphql` es explícito via `cors()` middleware — en v3 era automático vía `applyMiddleware`
- En el plugin `apolloLogger.ts`: `requestContext.context` → `requestContext.contextValue`; la respuesta usa `response.body.kind === 'single' ? body.singleResult.data : ...`

### bcrypt en api-01
- Versión: `^6.0.0`
- La API (`hashSync`, `compareSync`, `hash`, `compare`) es 100% compatible con v5; no hubo cambios de código en los servicios

---

## Migraciones completadas (no repetir)

| Cambio | Archivo(s) afectado(s) |
|--------|------------------------|
| bcrypt 5.x → 6.x | `api-01/package.json` |
| nodemailer 6.x → 8.x + fix de import | `api-01/package.json`, `api-01/src/email/email.service.ts` |
| Apollo Server v3 → v5 completo | `api-02/package.json`, `api-02/src/app.ts`, `api-02/src/utils/apolloLogger.ts`, `api-02/src/typeDefs.ts` |
| nodemon 2.x → 3.x (api-02 dev) | `api-02/package.json` |
| npm overrides para lodash/path-to-regexp/minimatch | `api-01/package.json` (movidos a la raíz) |
| Auditoría a 0 vulnerabilidades (30 → 0) | `package.json` (raíz), `api-01/package.json`, `package-lock.json` |
| typeorm 0.3.28 → ^0.3.31 (SQLi en orderBy) | `api-01/package.json` |
| joi 17.13.3 → ^17.13.8 (prototype pollution) | `api-01/package.json` |
| nodemailer 8.x → ^10.0.9 | `api-01/package.json` |
| uuid 9.0.1 → ^11.1.1 | `api-01/package.json` |
| Eliminado el `postinstall` de minimatch@3 | `package.json` (raíz) |

---

## npm workspaces — quirks conocidos

### Estructura del workspace
`package.json` en la raíz define los workspaces `api-01`, `api-02`, `ui`. `api-03` (Flask) está **excluido** — es Python puro. Siempre ejecutar `npm install` desde la raíz para mantener el lockfile consistente.

### El hack `postinstall` de minimatch@3 fue eliminado
El root tenía un `postinstall` que hacía `npm install minimatch@^3.1.2 --no-save` dentro de `node_modules/eslint-plugin-import/`, porque `typeorm → glob → minimatch@9` se hoisteaba al root y `eslint-plugin-import@2.x` (que usa `require('minimatch').default`) es incompatible con v9.

Ya no hace falta: los overrides de `minimatch` están anidados bajo `@typescript-eslint/*`, así que la raíz hoistea `minimatch@3.x` y `eslint-plugin-import` lo resuelve solo. `npm run lint -w api-02` funciona sin el hack.

Motivo para no revivirlo: ese `npm install` dentro de `node_modules/eslint-plugin-import` arrastraba también **todas las devDependencies del propio plugin** (~700 paquetes sin lockfile ni auditar) dentro de `node_modules/`.

### `npm run lint -w api-01` está roto (preexistente, no es de seguridad)
El script usa el glob `"{src,apps,libs,test}/**/*.ts"`. ESLint 8 lo convierte a ruta absoluta Windows (`C:\...\src\**\*.ts`) y se la pasa a `minimatch@3`, que a su vez llama a `brace-expansion`. Desde `brace-expansion@1.1.18` (versión parcheada por los avisos de DoS) las barras invertidas se tratan como escapes y se eliminan, con lo que el patrón queda destruido y ESLint responde `No files matching the pattern`.

Workaround: pasar directorios en lugar de un glob — `eslint src test --ext .ts`. Ojo antes de añadir `--fix`: hay ~4000 errores `prettier/prettier` de fin de línea CRLF, o sea que reescribiría prácticamente todos los archivos.

### TypeScript versions: api-02 usa v4.x, los demás v5.x
Con hoisting, TypeScript 5.x de api-01/ui se hoistea al root. api-02 conserva TypeScript 4.x en su propio `node_modules`. La consecuencia no obvia: los tipos resueltos por tsc en api-02 a veces reflejan las APIs de la versión hoisted (e.g. `prettier.format` se tipea como `async` de v3 aunque api-02 instale prettier v2 localmente). Añadir `await` es la solución correcta y segura para ambas versiones.

### Scripts de orquestación disponibles
```bash
npm run typecheck        # tsc --noEmit en api-01 y api-02
npm run build            # build en los 3 workspaces
npm run lint             # eslint en los 3 workspaces
npm run test             # jest en api-01 (--passWithNoTests)
npm run audit            # npm audit workspace-wide
npm run dev:api-01       # nest start --watch
npm run dev:api-02       # nodemon src/server.ts
npm run dev:ui           # next dev -p 3001
```

---

## CI/CD: Jenkins multibranch

El [Jenkinsfile](Jenkinsfile) esta modelado sobre el de la app hermana `motordetailcol`: mismo esquema de despliegue por SSH al host Docker, credencial `.env` como Secret file, backup de imagenes con tag `backup-<build>` y rollback automatico en `post.failure`.

### Ramas y entornos
Solo **`main` despliega**, a `prod`. Cualquier otra rama del multibranch falla a proposito en el stage `Setup`, antes de tocar el host remoto.

`APP_ENV` tiene que ser `local`, `dev` o `prod` y nada mas: api-01 valida `ENV` con Joi contra el enum de [environment.interface.ts](api-01/src/common/interfaces/environment.interface.ts), donde `production = 'prod'`. Poner `production` hace que api-01 no arranque (`"ENV" must be one of [local, dev, prod]`). Ese mismo valor nombra la red, los contenedores y las imagenes: `pricecloud-prod`, `pricecloud-prod-api-01`, etc.

### Lo que hay que configurar en Jenkins
1. Un job **Multibranch Pipeline** apuntando al repo; el Jenkinsfile esta en la raiz.
2. Una credencial de tipo **Secret file** con id **`pricecloud-env-prod`**, cuyo contenido es el `.env` completo (usar [.env.example](.env.example) como plantilla). Tiene que incluir `DEPLOY_USER` y `DEPLOY_DIR`; `DEPLOY_HOST` no, se autodetecta.
3. Clave SSH del usuario de Jenkins autorizada en el host Docker para `DEPLOY_USER`.

`DEPLOY_HOST` se deduce del gateway del bridge de Docker leyendo `/proc/net/route`: el contenedor de Jenkins despliega sobre su propio anfitrion.

### Stages
`Setup` -> `Security Scan` (grype, `--fail-on high`) -> `Load Config` -> `Validate` -> `Pull` -> `Config` (scp del .env) -> `Build` (las 4 imagenes en paralelo) -> `Deploy` -> `Migrate` -> `Seed` -> `Health Check` -> `Cleanup`.

No hay stage de tests de integracion: a diferencia de motordetailcol, este repo no tiene suite e2e. Su lugar lo ocupa `Health Check`, que corre [scripts/health-check.sh](scripts/health-check.sh) en el host.

El health check vive en un script y no embebido en el Jenkinsfile porque necesita tres niveles de anidamiento (sh de Jenkins -> ssh -> docker run) y escaparlo inline es una fuente segura de errores de comillas.

Comprueba api-01 **por codigo HTTP y no con `curl -sf`**: api-01 no expone ningun endpoint de salud (`AppController` no declara rutas y Swagger solo se monta cuando `ENV != prod`, ver [docs.service.ts](api-01/src/docs/docs.service.ts)), asi que un 404 ya demuestra que el proceso escucha. El `ui` si se valida con un 200 en `/login`.

### Builds Docker: el contexto es la RAIZ del repo
api-01, api-02 y ui se construyen con `context: .` y `dockerfile: <ws>/Dockerfile`, no desde su propia carpeta. Es obligatorio: el repo es un npm workspace y tanto el `package-lock.json` como el bloque `overrides` — que es lo que mantiene el arbol sin vulnerabilidades — viven solo en la raiz.

- Antes api-01 hacia `npm ci` con contexto `./api-01`, donde no hay lockfile: la imagen ni se construia.
- api-02 y ui hacian `npm install`, que resolvia versiones frescas **sin overrides**: las vulnerabilidades volvian dentro de la imagen aunque `npm audit` diera 0 en el repo.

Cada Dockerfile copia el `package.json` de **todos** los workspaces antes del `npm ci -w <workspace> --include-workspace-root`: `npm ci` valida el lockfile completo y falla si falta alguno, aunque solo instale las dependencias de uno.

Para el arbol de produccion se usa un segundo `npm ci --omit=dev -w <workspace> --include-workspace-root` en vez de `npm prune`: con workspaces, prune deja enlaces colgando entre la raiz y `<ws>/node_modules`.

Hay un [.dockerignore](.dockerignore) en la raiz; sin el, cada build enviaria al daemon los ~1.5 GB de `node_modules` de todos los workspaces. El antiguo `api-02/.dockerignore` se elimino: con el contexto en la raiz quedaba inerte, y sus entradas se movieron al de la raiz.

### Dependencias fantasma que el build por workspace saco a la luz
En el arbol de desarrollo todo se hoistea a la raiz, asi que un workspace puede usar un paquete que nunca declaro. Al instalar solo un workspace dentro de la imagen, eso explota. api-01 tenia dos:

- `dotenv`, usado por `src/database/datasource.ts`, resolvia por el de api-02.
- `express`, importado en `src/main.ts`, resolvia por el de api-02 (v4). Ojo: `@nestjs/platform-express` trae express **5** anidado, que no es alcanzable desde el codigo de api-01.

Ambos estan ya declarados en `api-01/package.json`. Antes de mover cualquier import entre workspaces, comprobar que el paquete este declarado en el `package.json` de ese workspace y no solo hoistado.

### Nombres de los recursos y datos de Postgres
Los servicios, contenedores, imagenes y la red se renombraron de `uv-pricecloud-*` a `pricecloud-*`. **Las rutas de datos de Postgres se dejaron con el prefijo viejo a proposito** (`../uv-pricecloud-${ENV}-db-01`), para no dejar huerfanos los datos de despliegues ya existentes. Si algun dia se renombran, hay que mover los directorios en el host a mano.

### `env_file` en vez de listar variables
Los servicios usan `env_file: .env` y `environment:` solo para lo que dentro de la red Docker vale distinto (`DB_HOST`, `DB2_HOST`, `API02_HOST`, `API03_HOST`, `PORT`). Antes cada variable se listaba una a una en `environment:`, asi que cualquier variable nueva no llegaba al contenedor hasta acordarse de anadirla ahi.

Los servicios de Postgres tienen `healthcheck` con `pg_isready` y api-01 depende de ellos con `condition: service_healthy`. Sin eso api-01 arrancaba antes que la DB y se reiniciaba en bucle (~17 reintentos) en cada despliegue, justo antes de que el pipeline lance `Migrate`.

---

## Comandos útiles

```bash
# Auditar vulnerabilidades en todos los proyectos
cd api-01 && npm audit
cd api-02 && npm audit
cd ui && npm audit

# Type-check api-02 sin compilar
cd api-02 && npx tsc --noEmit

# Type-check api-01 sin compilar
cd api-01 && npx tsc --noEmit
```

---

## Qué NO hacer

- No ejecutar `npm audit fix --force` en **api-01** sin revisar primero — sugiere downgrades masivos de NestJS (e.g., `@nestjs/config` de 4.x a 1.x)
- No intentar resolver la vulnerabilidad de `lodash` en api-01 cambiando versiones de `@nestjs/*`; ya está cubierta con el override
- No agregar `@types/nodemailer` a api-01 — conflictuaría con los tipos built-in de nodemailer
- No cambiar el contexto de build de api-01/api-02/ui a su propia carpeta — perderian el lockfile y los overrides, y las vulnerabilidades volverian dentro de las imagenes
- No usar `production` como valor de `ENV`/`APP_ENV` — api-01 solo acepta `local`, `dev` o `prod`
- No reintroducir un override global de `path-to-regexp` — rompe `express@4` en api-02
- No poner `overrides` en el `package.json` de un workspace — npm los ignora en silencio
- No convertir `brace-expansion@^2` ni los `minimatch` anidados en overrides globales — rompen `minimatch@3` y `eslint-plugin-import`
