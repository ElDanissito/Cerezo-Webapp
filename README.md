# Cerezo-Webapp : Plataforma de Gestión de Trámites Digitales

**Frontend:** Next.js + TypeScript + Tailwind CSS  
**Backend:** Django (Python)  
**Base de datos:** PostgreSQL (AWS RDS)  
**Infraestructura:** Docker + AWS EC2 + S3 + CloudFront + GitHub Actions

## 📂 Estructura del repositorio

Puedes ver la estructura completa del proyecto en el archivo [docs/estructura.md](docs/estructura.md).

---

## 📘 Descripción general

Este proyecto implementa una **plataforma integral de gestión de trámites**, formularios, contenidos y chatbot administrativo.  
Está diseñada bajo una arquitectura **monolítica modular**, con **frontend y backend desacoplados** en un mismo repositorio.

La solución incluye:

- Autenticación segura y login con Google.  
- Dashboard administrativo con métricas clave.  
- Gestión de trámites, formularios y contenidos CMS.  
- Chatbot con FAQs y conexión a DeepSeek.  
- Catálogo de trámites y portal de pagos (Wompi).  
- Herramientas de simulación de nómina y crédito.  
- Despliegue automatizado con GitHub Actions en AWS.

---

## ⚙️ Instalación local

### 🔧 Requisitos previos

- **Python 3.13**
- **Node.js 22.17**
- **Docker y Docker Compose**
- **PostgreSQL** (local o en contenedor)

---

### 🐍 Backend (Django)

```bash
cd backend
python -m venv venv
source venv/bin/activate    # En Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
````

El backend se ejecutará en `http://localhost:8000`.

---

### ⚛️ Frontend (Next.js + TypeScript)

```bash
cd frontend
npm install
npm run dev
```

El frontend se ejecutará en `http://localhost:3000`.

---

## 🐳 Docker (entorno unificado)

Para levantar frontend, backend y base de datos juntos:

```bash
cd infra/docker
docker-compose up --build
```

Esto levanta:

* **Django** en `http://localhost:8000`
* **Next.js** en `http://localhost:3000`
* **PostgreSQL** en `localhost:5432`

---

## 🔐 Variables de entorno

Ejemplo en `.env.example`:

```bash
# === Backend ===
DJANGO_SECRET_KEY=your-secret-key
DEBUG=True
DB_HOST=db
DB_PORT=5432
DB_NAME=tramites_db
DB_USER=admin
DB_PASSWORD=admin123

# === Frontend ===
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# === Wompi ===
WOMPI_PUBLIC_KEY=pk_test_xxxxx
WOMPI_PRIVATE_KEY=pr_test_xxxxx
```

Copia este archivo para usarlo en desarrollo:

```bash
cp .env.example .env
```

---

## 🧪 Pruebas

### Backend

```bash
cd backend
python manage.py test
```

### Frontend

```bash
cd frontend
npm test
```

---

## ☁️ Despliegue (AWS)

El proyecto se despliega en **AWS EC2 + RDS + S3/CloudFront** mediante **GitHub Actions**:

* **Backend:** EC2 con Nginx + Gunicorn.
* **Frontend:** Build estático en S3, distribuido con CloudFront.
* **Base de datos:** PostgreSQL (RDS) con respaldo automático diario.
* **CI/CD:** `infra/github/workflows/deploy-frontend.yml` y `infra/github/workflows/deploy-backend.yml`.

---

## 📊 Historias de usuario por módulo

| Sección                  | HU                            | Descripción                       |
| ------------------------ | ----------------------------- | --------------------------------- |
| Login                    | HU-01 – HU-05                 | Autenticación y sesiones          |
| Dashboard Administrativo | HU-06 – HU-10                 | Métricas y resumen                |
| Gestión de Trámites      | HU-11 – HU-16                 | CRUD de trámites                  |
| Formularios              | HU-17 – HU-22                 | Creación, edición, versionamiento |
| CMS                      | HU-23 – HU-27                 | Contenidos estáticos              |
| Chatbot                  | HU-28 – HU-32 / HU-51 – HU-54 | FAQs + DeepSeek                   |
| Catálogo                 | HU-38 – HU-40                 | Consulta y requisitos             |
| Pagos                    | HU-41 – HU-46                 | Integración con Wompi             |
| Simulaciones             | HU-47 – HU-50                 | Nómina y crédito                  |
| Infraestructura          | HU-59 – HU-61                 | AWS + CI/CD                       |
| Pruebas                  | HU-62 – HU-63                 | Unitarias y de carga              |

---

## 🧠 Buenas prácticas

* Uso de `black` y `isort` para formatear el backend.
* Uso de  `eslint` y `prettier` para el frontend.
* Los módulos deben seguir **nombres descriptivos y cortos**.
* Los commits deben referenciar la HU correspondiente (ejemplo:
  `feat(HU-23): creación de contenido enriquecido`).

---

## 👥 Autores

* **Daniel Rojas Barreche** — *Desarrollador Fullstack / SCRUM Master*
* **Juan Carlos Cruz** — *Desarrollador Fullstack / Product Owner*
* **Michael Ramirez Suriel** — *Desarrollador Fullstack*
* **Juan Jose Paredes** — *Desarrollador Fullstack*
* **Juan David Pinto** — *Desarrollador Fullstack*

---

## 📜 Licencia

Este proyecto se distribuye bajo la licencia MIT.