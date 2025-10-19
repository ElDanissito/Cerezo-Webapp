# Commit Guidelines

En este repo las confirmaciones siguen **Conventional Commits** y **siempre** deben referenciar la **HU** y la **TASK** correspondientes.

---

## 🧭 TL;DR

**Formato minimo valido:**

<type>(scope?): <subject>

<body?>
Refs: HU-<id> TASK-<id>



**Ejemplo valido:**
chore(tooling): set up commitlint and husky

add commitlint.config.cjs

add commit-msg hook

add GitHub Action

Refs: HU-101 TASK-456


---

## ✅ Reglas obligatorias

- **Idioma:** commits en ingles.  
- **Formato:** Conventional Commits.  
- **Referencias:** cada commit debe incluir `HU-<id>` y `TASK-<id>` (en header, body o footer).  
- **Header <= 100 chars.**  
- **Subject en imperative mood** (p. ej., *add, fix, remove*; no *added, fixes*).  
- **ASCII-only en commit messages** (sin acentos/ñ/emoji) para evitar problemas en tooling/CI.

---

## Tipos permitidos

| type    | uso tipico                                   |
|---------|-----------------------------------------------|
| feat    | nueva funcionalidad                           |
| fix     | correccion de bug                             |
| hotfix  | fix urgente en produccion                     |
| refactor| cambio interno sin alterar comportamiento     |
| chore   | tareas varias (tooling, deps, housekeeping)   |
| docs    | documentacion                                 |
| style   | formato/estilo (sin cambiar logica)           |
| test    | tests                                         |
| perf    | performance                                   |
| build   | build system, dependencias                    |
| ci      | pipelines/acciones                            |
| revert  | revertir un commit                            |

> `scope` (opcional): `auth`, `api`, `ui`, `deps`, `tooling`, `ci`, etc.

---

## 🧪 Ejemplos validos

feat(auth): enable 2FA for login

Refs: HU-231 TASK-889

Copiar código
fix(api): handle 401 on token refresh

Refs: HU-912 TASK-1201

Copiar código
refactor(ui): simplify sidebar state

Refs: HU-142 TASK-320

Copiar código
chore(tooling): set up commitlint + husky

Refs: HU-100 TASK-200

Copiar código
docs(readme): add commit guidelines

Refs: HU-100 TASK-201



**Multi-linea:**
refactor(ui): split header into smaller components

extract search bar

move cart badge logic into hook

add unit tests

Refs: HU-142 TASK-320




---

## 🚫 Ejemplos invalidos (y por que)

- `fix: arreglar bug en login` ← no esta en ingles + sin HU/TASK  
- `feat: add feature` ← sin HU/TASK  
- `docs: update` ← sin HU/TASK y subject poco descriptivo  
- `chore: bump deps (HU-10)` ← falta `TASK-<id>`  
- `feat(api): add 🔥` ← no ASCII  

---

## 🌿 Estrategia de ramas

Ramas de desarrollo por persona (ejemplos):

juan/hu-123-profile-edit
ana/hu-456-payments-refactor

markdown
Copiar código

Ramas protegidas: `develop`, `main`.

**Flujo tipico:**

1. Crea tu rama desde `develop`.  
2. Commits siguiendo estas reglas.  
3. Pull Request → `develop`.  
4. `develop` → `main` segun releases.

---

## 🛠️ Hooks locales (Husky + Commitlint)

Este repo bloquea mensajes invalidos en **commit-msg**.

**Verificar que el hook esta activo:**

git config --get core.hooksPath
# Debe imprimir: .husky
Instalacion / reinstalacion rapida:


npm i -D @commitlint/cli @commitlint/config-conventional husky
npm run prepare

# .husky/commit-msg (contenido):
# npx --no-install commitlint --edit "$1"

chmod +x .husky/commit-msg
En Husky v9 no uses husky.sh ni shebang en el hook; una sola linea es suficiente.

🤖 CI (GitHub Actions)
Se valida tambien en push y pull_request con wagoid/commitlint-github-action usando commitlint.config.cjs.
Ramas protegidas (develop, main) no aceptan commits/PRs con mensajes invalidos.

🧰 Troubleshooting
“Hooks no corren” → git config --get core.hooksPath → debe ser .husky

Permisos → chmod +x .husky/commit-msg

Editor abre para escribir mensaje → respeta el formato; incluye Refs: HU-xxx TASK-yyy


# Hacer esto para Iniciar

## 1 Instalar deps
npm i

## 2 Asegurar que Git use .husky como hooksPath (una sola vez por repo clonado)
git config --get core.hooksPath || git config core.hooksPath .husky

## 3 (Opcional) Verificar que el hook está marcado ejecutable en el repo
git ls-files -s .husky/commit-msg   # debe mostrar 100755

## 4 Test rápido: debe FALLAR porque no pone HU/TASK
git commit --allow-empty -m "feat: test" -m "sin HU ni TASK"

## Creador de commits
https://chatgpt.com/g/g-68f5276d16e88191870d3b7fc21dbb2e-asistente-de-commits