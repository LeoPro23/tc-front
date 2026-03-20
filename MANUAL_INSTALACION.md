# Manual de Instalación y Despliegue - TomateCode

Este documento contiene las instrucciones necesarias para descargar, configurar y ejecutar el entorno de desarrollo local del proyecto TomateCode.

## 1. Repositorios del Código Fuente

Deberás clonar ambos repositorios en una misma carpeta (por ejemplo, `C:\tc` o `~/tc`) para mantener el orden.

- **Frontend (Next.js):** [https://github.com/LeoPro23/tc-front](https://github.com/LeoPro23/tc-front)
- **Backend (NestJS + Python ML):** [https://github.com/LeoPro23/tc-back](https://github.com/LeoPro23/tc-back)

---

## 2. Requisitos Previos (Software Necesario)

Antes de empezar, asegúrate de tener instalados los siguientes componentes en tu sistema operativo:

1. **[Node.js](https://nodejs.org/)** (v18 o superior, se recomienda v20 LTS).
2. **[Git](https://git-scm.com/)** para clonar los repositorios.
3. **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (Requerido para levantar la Base de Datos PostgreSQL, el servicio de Machine Learning o para probar el "Método 2" automatizado).

---

## 3. Configuración de Entorno (.env)

Antes de levantar los proyectos, debes crear los archivos de variables de entorno iterando en la raíz de cada carpeta.

### Archivo `.env` del Backend (`tc-back/.env`)
Crea un archivo llamado `.env` en la raíz de la carpeta `tc-back` y pega lo siguiente (estas son las credentials de desarrollo y base de datos locales):

```env
ORIGIN_URL=http://localhost:3000

# OpenRouter / AI
OPENROUTER_API_KEY=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
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=google/gemini-2.0-flash-lite-001
OPENROUTER_INTERPRETATION_MODEL=google/gemini-3.1-flash-lite-preview
OPENROUTER_AUDIOTOTEXT_MODEL=google/gemini-3.1-flash-lite-preview

# PostgreSQL (Apunta a la BD levantada en Docker)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=codigotomate123
DB_NAME=tomatecodedb
DB_SSL=false

# JWT (Seguridad)
JWT_SECRET=tc-neural-jwt-s3cr3t-2026-tomatocode-x9a8b7c6d5e4f3g2h1
JWT_EXPIRES_IN=7d

# MinIO (Storage)
MINIO_PORT=443
MINIO_ENDPOINT=https://software-minio.ho0lle.easypanel.host
MINIO_ACCESS_KEY=zlDzLdfS5ljXW7zPLrtt
MINIO_SECRET_KEY=hehlda6IehpyiyPqxxIR9YQE58yFP8fZG2x90NJv
MINIO_USE_SSL=true

# Webhooks WhatsApp
WEBHOOK_URL=https://n8n-software.chronosmart.lat/webhook/tomatecode-whatsapp
```

### Archivo `.env` del Frontend (`tc-front/.env`)
Crea un archivo llamado `.env` (o `.env.local`) en la raíz del frontend `tc-front`:

```env
URL_BACKEND=http://localhost:8000
NEXT_PUBLIC_URL_BACKEND=http://localhost:8000
```

---

## 4. Levantar los Proyectos

Puedes levantar los proyectos de dos maneras. Se recomienda la **Forma 2** por ser más sencilla y robusta.

### Forma 1: Manualmente con `npm` (La clásica)

En esta modalidad, ejecutarás los servidores Node.js directo en tu máquina. La Base de datos se prefiere levantar por Docker para evitar instalar PostgreSQL nativo.

**Paso 1: Levantar PostgreSQL**
Abre una terminal en `tc-back` y usa el archivo `docker-compose.yml` base para levantar solo la base de datos:
```bash
docker compose up postgres -d
```

**Paso 2: Compilar e Iniciar Backend**
Abre una terminal nueva apuntando a `tc-back`:
```bash
cd tc-back
npm install
npm run dev
```

**Paso 3: Compilar e Iniciar Frontend**
Abre otra terminal nueva apuntando a `tc-front`:
```bash
cd tc-front
npm install
npm run dev
```
> El frontend estará disponible en **http://localhost:3000** y el backend en **http://localhost:8000**.


---

### Forma 2: Con Docker Compose (Todo automatizado)

Si ya tienes enlazada una carpeta principal (por ejemplo `C:\tc`) con ambos repositorios dentro (`tc-front` y `tc-back`), y posees el archivo orquestador maestro `docker-compose.yml` en la raíz de esa carpeta, iniciar el ecosistema completo es un solo comando.

1. Abre tu terminal en el directorio padre que contiene ambas carpetas.
2. Ejecuta el comando para construir y correr todos los servicios en conjunto (Base de Datos, Backend NestJS, Frontend Next.js y Machine Learning en Python):
```bash
docker compose up --build
```
> Listo. En un par de minutos las imágenes se construirán y conectarán entre sí. Mismo resultado: App en **http://localhost:3000**.

---

## 5. Credenciales del Sistema

El sistema utiliza autenticación mediante JWT almacenada en PostgreSQL. 

Para **ingresar al sistema** por primera vez, navega hacia la pantalla de login en `http://localhost:3000/auth/login` y **crea un usuario nuevo** (Registro) con el correo y la clave que desees. 

También existe un usuario sembrado por defecto mediante scripts internos para el mantenedor del backend, aunque registrar una cuenta nueva en blanco es el paso sugerido para profesores/revisores:

- **Registrar su propia cuenta** desde la interfaz web del Frontend.  
- Automáticamente se le asignará una sesión limpia para empezar a capturar imágenes, ingresar lotes y ver los modelos neuronales.
