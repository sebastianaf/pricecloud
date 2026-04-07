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

### npm overrides en api-01
`api-01/package.json` usa `overrides` para forzar versiones seguras de dependencias transitivas:
- `path-to-regexp ^8.3.1` — transitiva de `@nestjs/swagger`, vulnerable en 8.0.0–8.3.0
- `minimatch ^9.0.7` — transitiva de `@typescript-eslint`, vulnerable en 9.0.0–9.0.6
- `lodash ^4.18.1` — transitiva de `@nestjs/config` y `@nestjs/swagger`; `lodash <=4.17.23` está marcado como vulnerable, pero existe `4.18.1` por encima del rango afectado

Si `npm audit` reporta vulnerabilidades en `lodash`, `path-to-regexp` o `minimatch` en api-01, no usar `npm audit fix --force` — degradaría paquetes de NestJS a versiones obsoletas. Los overrides ya las cubren.

### nodemailer en api-01
- Versión: `^8.0.5`
- `nodemailer v7+` incluye sus propios tipos TypeScript; `@types/nodemailer` fue eliminado del proyecto
- El import interno `nodemailer/lib/mailer` (usado en v6) ya no existe en v8. El tipo del transporter es `nodemailer.Transporter` (ver [email.service.ts](api-01/src/email/email.service.ts))

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
| npm overrides para lodash/path-to-regexp/minimatch | `api-01/package.json` |

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
- No agregar `@types/nodemailer` a api-01 — conflictuaría con los tipos built-in de nodemailer v8
