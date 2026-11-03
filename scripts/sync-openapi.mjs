#!/usr/bin/env node
/**
 * @module scripts/sync-openapi
 *
 * Copia el spec OpenAPI generado por cada microservicio (code-first, con
 * `npm run docs:export` en el repo del servicio) hacia este repo de docs e
 * inyecta `x-mint.groups` en cada operación.
 *
 * Responsabilidades:
 *  - Mantener `api-reference/<servicio>/openapi.json` como copia fiel del spec
 *    del repo fuente (el spec NUNCA se edita a mano aquí: se regenera allá).
 *  - Inyectar `x-mint.groups: ["svc-<servicio>"]` para que, al activar la
 *    autenticación JWT/OAuth (plan Enterprise), cada endpoint solo sea visible
 *    para los usuarios con el grupo del servicio. Mientras la personalización
 *    esté apagada, el campo es inerte y no afecta el render.
 *
 * NO responsable de:
 *  - Validar el spec (eso lo hace `mint validate` y el lint del repo fuente).
 *  - Publicar el sitio (push a main → deploy vía GitHub App de Mintlify).
 *
 * Uso:
 *   node scripts/sync-openapi.mjs
 *
 * @owner @carfax-mx/<equipo-plataforma>
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Registro de servicios documentados. Para dar de alta un microservicio nuevo
 * se agrega una entrada aquí y las páginas MDX + navegación en docs.json.
 * `source` es relativo a la raíz de este repo (los repos viven como hermanos
 * en el mismo directorio padre).
 */
const SERVICES = [
  {
    name: "ms-consulta-ws",
    group: "svc-ms-consulta-ws",
    source: "../CARFAXMX-msConsultaWs/docs/openapi.json",
    target: "api-reference/ms-consulta-ws/openapi.json",
  },
];

const HTTP_METHODS = ["get", "post", "put", "patch", "delete", "head", "options", "trace"];
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

let failures = 0;

for (const svc of SERVICES) {
  const sourcePath = resolve(repoRoot, svc.source);
  let spec;
  try {
    spec = JSON.parse(readFileSync(sourcePath, "utf8"));
  } catch (err) {
    console.error(`✖ ${svc.name}: no pude leer ${svc.source} (${err.message})`);
    failures += 1;
    continue;
  }

  let operations = 0;
  for (const pathItem of Object.values(spec.paths ?? {})) {
    for (const method of HTTP_METHODS) {
      const op = pathItem?.[method];
      if (!op) continue;
      // Se preserva cualquier x-mint que el generador del servicio ya emita;
      // este script solo garantiza el grupo de visibilidad del servicio.
      op["x-mint"] = { ...(op["x-mint"] ?? {}), groups: [svc.group] };
      operations += 1;
    }
  }

  const targetPath = resolve(repoRoot, svc.target);
  mkdirSync(dirname(targetPath), { recursive: true });
  writeFileSync(targetPath, `${JSON.stringify(spec, null, 2)}\n`);
  console.log(`✔ ${svc.name}: ${operations} operaciones → ${svc.target} (groups: ${svc.group})`);
}

process.exit(failures === 0 ? 0 : 1);
