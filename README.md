# CV Analyzer Frontend

Aplicación web de análisis de compatibilidad de CV con IA. Permite a los usuarios subir su CV, proporcionar descripciones de puestos de trabajo y recibir análisis detallados de compatibilidad con sugerencias de mejora y rutas de aprendizaje.

## 🚀 Características

- **Análisis de CV**: Sube tu CV en PDF y recibe un análisis de compatibilidad con puestos de trabajo
- **Sistema de créditos**: Planes gratuitos y pagos con integración de MercadoPago
- **Dashboard interactivo**: Estadísticas de análisis, evolución de puntajes y keywords faltantes recurrentes
- **Historial**: Visualiza todos tus análisis anteriores con paginación
- **Rutas de aprendizaje**: Recibe sugerencias personalizadas para mejorar tu perfil
- **Autenticación**: Registro, login y recuperación de contraseña con JWT
- **Tema oscuro/claro**: Soporte completo para temas con next-themes

## 🛠️ Stack Tecnológico

### Core
- **Next.js 16.2.2** (Turbopack) - Framework React con App Router
- **React 19.2.4** - Biblioteca UI
- **TypeScript 5** - Tipado estático

### Estado & Datos
- **TanStack Query v5** - Gestión de caché y llamadas API
- **Axios v1.14** - Cliente HTTP con interceptores para auth y refresh token

### UI & Estilos
- **Tailwind CSS 4** - Framework de estilos
- **Shadcn UI** - Componentes UI reutilizables (Radix UI + Tailwind)
- **Lucide React** - Iconos
- **Recharts 3.8** - Gráficos para dashboard
- **next-themes** - Manejo de temas oscuro/claro
- **react-hot-toast** - Notificaciones toast

### Pagos
- **MercadoPago SDK React v1.0** - Integración de pagos

### Formularios & Validación
- **Formik v2.4** - Gestión de formularios
- **Yup v1.7** - Validación de esquemas

### Testing
- **Vitest v4.1** - Framework de tests
- **Testing Library** - Testing de componentes React

### Utilidades
- **clsx + tailwind-merge** - Combinación de clases CSS
- **class-variance-authority** - Variantes de componentes

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone <repo-url>
cd front-analyzer-cv
```

2. Instala dependencias con Bun:
```bash
bun install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus configuraciones:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 🚀 Ejecutar en desarrollo

```bash
bun dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🎯 Cómo usar la App

### 1. Registro e Inicio de Sesión

**Registro:**
1. Ve a `/register`
2. Ingresa tu nombre, email y contraseña
3. Recibirás créditos gratuitos para análisis

**Login:**
1. Ve a `/login`
2. Ingresa tu email y contraseña
3. Serás redirigido al dashboard

**Recuperación de contraseña:**
1. En `/login` haz clic en "¿Olvidaste tu contraseña?"
2. Ingresa tu email
3. Recibirás un email con un enlace para restablecer tu contraseña

### 2. Dashboard

El dashboard muestra:
- **Total de análisis**: Cantidad total de análisis realizados
- **Promedio de compatibilidad**: Puntaje promedio de tus análisis
- **Evolución de compatibilidad**: Gráfico de tu puntaje a través del tiempo
- **Keywords faltantes recurrentes**: Gráfico de palabras clave que suelen faltarte

### 3. Análisis de CV

**Realizar un nuevo análisis:**
1. Ve a `/analyze`
2. Sube tu CV en formato PDF (máximo 10 MB)
3. Pega la descripción completa del puesto de trabajo
4. Haz clic en "Analyze CV"
5. El análisis se procesa en segundo plano (puede tardar unos segundos)

**Ver resultados:**
1. Serás redirigido a `/results/[id]`
2. Verás:
   - Puntaje de compatibilidad (0-100)
   - Estado del análisis (pending, processing, completed, failed)
   - Análisis detallado de IA
   - Keywords faltantes
   - Rutas de aprendizaje sugeridas

### 4. Historial de Análisis

1. Ve a `/history`
2. Verás una lista paginada de todos tus análisis
3. Cada item muestra:
   - Estado (completado, fallido, pendiente)
   - Puntaje de compatibilidad
   - URL del puesto (si existe)
   - Fecha de creación
4. Haz clic en un análisis para ver los detalles completos
5. Puedes eliminar análisis desde la vista de detalles

### 5. Compra de Créditos

**Ver planes disponibles:**
1. Ve a `/pricing`
2. Verás los planes de créditos disponibles
3. Cada plan indica cantidad de créditos y precio en USD

**Comprar créditos:**
1. Selecciona un plan
2. Serás redirigido a MercadoPago para completar el pago
3. Después del pago, serás redirigido a `/payment/success`
4. Tus créditos se acreditarán automáticamente

**Ver tus créditos:**
- En el dashboard, verás una tarjeta con tus créditos disponibles
- Incluye: análisis gratuitos usados/límite y créditos pagos

### 6. Rutas de Aprendizaje

Cuando tengas un análisis completado:
1. Ve a la página de resultados de ese análisis
2. En la sección de "Rutas de Aprendizaje" verás:
   - Cursos recomendados
   - Skills a desarrollar
   - Recursos específicos para mejorar tu perfil

## 🏗️ Estructura del Proyecto

```
front-analyzer-cv/
├── app/                          # Next.js App Router
│   ├── (main)/                   # Layout principal autenticado
│   │   ├── dashboard/             # Página de estadísticas
│   │   ├── analyze/              # Formulario de análisis
│   │   ├── results/              # Página de resultados
│   │   ├── history/              # Historial de análisis
│   │   └── ...                  # Otras páginas
│   ├── (auth)/                   # Layout de autenticación
│   │   ├── login/                # Login
│   │   ├── register/             # Registro
│   │   └── recover/              # Recuperación
│   └── ...                       # Layouts raíz
├── modules/                      # Feature modules
│   ├── analysis/                 # Módulo de análisis
│   │   ├── components/           # CVUpload, JobInput, AnalysisForm
│   │   ├── api/                 # Endpoints de análisis
│   │   ├── hooks/               # Custom hooks (useAnalysis, useSubmit)
│   │   └── types/              # TypeScript types
│   ├── dashboard/                # Módulo de dashboard
│   │   ├── components/           # StatsCards, charts
│   │   ├── api/                 # Endpoints de stats
│   │   └── hooks/               # useDashboard hook
│   ├── history/                  # Módulo de historial
│   │   ├── api/                 # Endpoints de history
│   │   └── hooks/               # useHistory hook
│   ├── results/                  # Módulo de resultados
│   │   ├── components/           # ResultView, LearningPaths
│   │   ├── api/                 # Endpoints de resultados
│   │   └── hooks/               # useResults, useLearningPaths
│   ├── auth/                     # Módulo de autenticación
│   │   ├── components/           # LoginForm, RegisterForm
│   │   ├── api/                 # Endpoints de auth
│   │   └── hooks/               # useAuth hook
│   └── payment/                  # Módulo de pagos
│       ├── components/           # CreditOverviewCard, pricing tables
│       ├── api/                 # MercadoPago integration
│       └── hooks/               # useCreditFlow hook
├── components/                   # UI components globales
│   └── ui/                     # Shadcn UI components
├── lib/                        # Utilidades compartidas
└── types/                      # Tipos globales
```

## 🔨 Scripts Disponibles

```bash
# Desarrollo
bun dev              # Inicia servidor de desarrollo

# Producción
bun build            # Compila para producción
bun start            # Inicia servidor de producción

# Calidad de código
bun lint             # Ejecuta ESLint
bun test             # Ejecuta tests con Vitest
bun test:watch       # Ejecuta tests en modo watch
```

## 🔐 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | URL del backend API | `http://localhost:8000` o `https://api.tuapp.com` |
| `NEXT_PUBLIC_BASE_URL` | URL base del frontend (opcional, para redirects) | `http://localhost:3000` o `https://tuapp.com` |

## 📝 Notas Importantes

- **Formato de CV**: Solo se aceptan archivos PDF (máximo 10 MB)
- **Descripción de job**: Debe ser la descripción completa del puesto para mejor precisión
- **Sistema de créditos**: Cada análisis consume 1 crédito (gratis o pagado)
- **Autenticación**: Usa JWT con refresh tokens para sesiones persistentes
- **Módulo de URL**: La opción de URL del job está deshabilitada temporalmente (en desarrollo)

## 🤝 Contribuir

Este proyecto sigue el patrón de **Feature Modules** y **Atomic Design**. Cada módulo está autocontenido con sus propios:
- Componentes UI
- Hooks personalizados
- Llamadas API
- Tipos TypeScript

## 📄 Licencia

Este proyecto es parte de CV Analyzer. Todos los derechos reservados.
