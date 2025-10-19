Commit Guidelines

En este repo las confirmaciones siguen Conventional Commits y siempre deben referenciar la HU y la TASK correspondientes.

🧭 TL;DR (rápido)

Formato mínimo válido:

<type>(scope?): <subject>

<body?>
Refs: HU-<id> TASK-<id>


Ejemplo válido:

chore(tooling): set up commitlint and husky

- add commitlint.config.cjs
- add commit-msg hook
- add GitHub Action

Refs: HU-101 TASK-456

✅ Reglas obligatorias

Idioma: commits en inglés.

Formato: Conventional Commits.

Referencias: cada commit debe incluir HU-<id> y TASK-<id> (en header, body o footer).

Header ≤ 100 chars.

Subject en imperative mood (ej. add, fix, remove; no added, fixes).

ASCII-only (sin tildes/ñ/emoji) para evitar problemas en tooling/CI.

Tipos permitidos
type	uso típico
feat	nueva funcionalidad
fix	corrección de bug
hotfix	fix urgente en producción
refactor	cambio interno sin alterar comportamiento
chore	tareas varias (tooling, deps, housekeeping)
docs	documentación
style	formato/estilo (sin cambiar lógica)
test	tests
perf	performance
build	build system, dependencias
ci	pipelines/acciones
revert	revertir un commit

scope (opcional): auth, api, ui, deps, tooling, ci, etc.

🧪 Ejemplos válidos

feat(auth): enable 2FA for login (HU-231 TASK-889)

fix(api): handle 401 on token refresh (HU-912 TASK-1201)

refactor(ui): simplify sidebar state (HU-142 TASK-320)

chore(tooling): set up commitlint + husky (HU-100 TASK-200)

docs(readme): add commit guidelines (HU-100 TASK-201)

Multi-línea:

refactor(ui): split header into smaller components

- extract search bar
- move cart badge logic into hook
- add unit tests

Refs: HU-142 TASK-320

🚫 Ejemplos inválidos (y por qué)

fix: arreglar bug en login ← no está en inglés + sin HU/TASK

feat: add feature ← sin HU/TASK

docs: update ← sin HU/TASK y subject poco descriptivo

chore: bump deps (HU-10) ← falta TASK-<id>

feat(api): add 🔥 ← no ASCII

🌿 Estrategia de ramas

Ramas de desarrollo por persona (p. ej.):

juan/hu-123-profile-edit

ana/hu-456-payments-refactor

Ramas protegidas: develop, main.

Flujo típico:

Crea tu rama desde develop.

Commits siguiendo estas reglas.

PR → develop.

develop → main según releases.

🛠️ Hooks locales (Husky + Commitlint)

Ya está configurado en este repo para bloquear mensajes inválidos en commit-msg.

Verifica que el hook está activo:

git config --get core.hooksPath
# Debe imprimir: .husky


Si necesitas reinstalar:

npm i -D @commitlint/cli @commitlint/config-conventional husky
npm run prepare           # crea .husky si no existe
# crea/update .husky/commit-msg con:
# npx --yes commitlint --edit "$1"

chmod +x .husky/commit-msg

🤖 CI (GitHub Actions)

Se valida también en push y pull_request con wagoid/commitlint-github-action usando commitlint.config.cjs.
Ramas protegidas (develop, main) no aceptarán commits/PRs con mensajes inválidos.

🧰 Troubleshooting

“Hooks no corren” → revisa git config --get core.hooksPath → .husky

Permisos → chmod +x .husky/commit-msg

Editor abre para escribir mensaje → respeta el formato; incluye Refs: HU-xxx TASK-yyy

GitKraken / GUI → los hooks igual se ejecutan si core.hooksPath apunta a .husky

No bypass → no usar --no-verify

📝 Plantilla opcional para commits

Guárdala como .gitmessage.txt y actívala con
git config commit.template .gitmessage.txt

<type>(scope?): <subject>

<body - what/why, not how, wrapped ~72 cols>

Refs: HU-<id> TASK-<id>

✅ Checklist para PR

 Mensajes de commit válidos (inglés + HU/TASK)

 CI en verde (incluye commitlint)

 Scope y subject claros

 Cambios documentados si aplica