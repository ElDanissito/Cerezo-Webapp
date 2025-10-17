### Estructura sugerida del proyecto
```bash
📦 proyecto-raiz/
├── backend/                         # API en Django
│   ├── app/
│   │   ├── core/                    # Config global: settings, middleware, db, etc.
│   │   ├── users/                   # (HU-01 a HU-05) Autenticación y sesiones
│   │   ├── dashboard/               # (HU-06 a HU-10) Dashboard administrativo
│   │   ├── tramites/                # (HU-11 a HU-16) Gestión de trámites
│   │   ├── formularios/             # (HU-17 a HU-22) Gestión de formularios
│   │   ├── contenidos/              # (HU-23 a HU-27) CMS y contenidos públicos
│   │   ├── chatbot/                 # (HU-28 a HU-32 y HU-51 a HU-54)
│   │   ├── catalogo/                # (HU-38 a HU-40)
│   │   ├── pagos/                   # (HU-41 a HU-46)
│   │   ├── simulaciones/            # (HU-47 a HU-50)
│   │   ├── common/                  # Utilidades compartidas: modelos base, helpers, logs
│   │   └── api/                     # Routers, serializers, endpoints REST
│   ├── tests/                       # (HU-62, HU-63)
│   ├── requirements.txt
│   └──  manage.py                    # (Django)
│
├── frontend/                        # Next.js + TypeScript + Tailwind
│   ├── app/
│   │   ├── (auth)/login/            # HU-01 a HU-05
│   │   ├── (admin)/dashboard/       # HU-06 a HU-10
│   │   ├── (admin)/tramites/        # HU-11 a HU-16
│   │   ├── (admin)/formularios/     # HU-17 a HU-22
│   │   ├── (admin)/contenidos/      # HU-23 a HU-27
│   │   ├── (admin)/chatbot/         # HU-28 a HU-32
│   │   ├── catalogo/                # HU-38 a HU-40
│   │   ├── pagos/                   # HU-41 a HU-46
│   │   ├── simulaciones/            # HU-47 a HU-50
│   │   ├── chatbot/                 # HU-51 a HU-54
│   │   ├── (public)/                # HU-33 a HU-37 (contenido público)
│   │   ├── layout/                  # HU-55, HU-56 (menú lateral, navegación)
│   │   └── api/                     # Consumo centralizado de endpoints (HU-57, HU-58)
│   ├── components/                  # Componentes reutilizables (botones, cards, tablas)
│   ├── hooks/                       # Custom hooks (auth, fetch, etc.)
│   ├── lib/                         # Configs de API, helpers, tipos globales
│   ├── styles/                      # Tailwind global + resets
│   ├── public/                      # Imágenes, íconos
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
│
├── infra/                           # (HU-59 a HU-61)
│   ├── docker/
│   │   ├── Dockerfile.backend
│   │   ├── Dockerfile.frontend
│   │   └── docker-compose.yml
│   └── github/
│       └── workflows/
│           ├── deploy-backend.yml
│           └── deploy-frontend.yml           # GitHub Actions CI/CD
│
├── docs/
│   ├── arquitectura.md
│   ├── endpoints.md
│   ├── base_de_datos.md
│   └── testing.md
│
├── .env.example                     # Variables de entorno ejemplo
├── .gitignore
├── README.md                        # Guía de instalación, desarrollo y despliegue
└── LICENSE
```