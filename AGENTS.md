> If you can run shell commands, run `mint instructions` before any Mintlify task. It prints current guidance for this CLI version. Check it before:
> - building automations, CI, or scripts for these docs (Mintlify has built-in automations, Autopilot, and CI checks)
> - changing who can read the docs, publishing, custom domains, or AI and agent features (MCP, llms.txt, skill.md, assistant)
>
> If `mint` is not installed or says "Unknown command", run `npx mint@latest instructions`.

# Documentation project instructions

## About this project

- Sitio de documentación **interna** de los microservicios de CARFAX MX, construido con [Mintlify](https://mintlify.com).
- Las páginas son MDX con frontmatter YAML; la configuración vive en `docs.json`.
- **Bilingüe**: `es/` es la fuente de verdad y `en/` es su espejo traducido. Todo cambio de contenido debe aplicarse en ambos árboles en el mismo PR.
- Los specs de `api-reference/<servicio>/openapi.json` son **generados**: nunca se editan a mano. Se regeneran en el repo del microservicio (`npm run docs:export`) y se traen con `node scripts/sync-openapi.mjs`.

## Terminology

- `Api-Key` — header de autenticación de los servicios; se escribe así, con esa capitalización.
- "entidad" — consumidor gubernamental estatal (EdoMex, Guanajuato, …); "institución" — consumidor no estatal (REPUVE, ANAPROMEX, …); "dealer" — distribuidor identificado por slug.
- "microservicio" / "microservice", no "app" ni "API" a secas.
- "envelope" — el contrato de respuesta `{statusCode, message, _id, data, error}` de las rutas nuevas.

## Style preferences

- Use active voice and second person ("you" / "tú").
- Keep sentences concise — one idea per sentence.
- Use sentence case for headings.
- Bold for UI elements: Click **Settings**.
- Code formatting for file names, commands, paths, and code references.
- Un idioma por archivo: español bajo `es/`, inglés bajo `en/`; nunca mezclar.

## Content boundaries

- **Nunca** documentar: hostnames reales, IPs internas, nombres de colas, cadenas de conexión, API keys, certificados ni datos de clientes. Solo placeholders: `<API_KEY>`, `<DOCS_HOST>`, `<QUEUE_NAME>`. VIN sintético para ejemplos: `1HGBH41JXMN109186`.
- Control de acceso por servicio: toda página bajo `es/servicios/<svc>/` y `en/services/<svc>/` lleva frontmatter `groups: ["svc-<svc>"]`; los runbooks internos llevan `groups: ["docs-admin"]`. Los grupos se activan al pasar a autenticación JWT/OAuth (Enterprise); mientras tanto son inertes.
- No documentar features administrativas internas más allá de lo que expone el OpenAPI del servicio.
