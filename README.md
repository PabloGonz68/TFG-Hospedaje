
# 🏡 Hospeda - TFG 2º DAW

**Hospeda** es una plataforma web que permite a los usuarios hospedarse gratuitamente mediante un sistema de tickets. Cada usuario puede hospedarse si previamente ha hospedado a otros, fomentando el intercambio justo y la comunidad viajera.

Este proyecto forma parte del Trabajo de Fin de Grado de 2º de Desarrollo de Aplicaciones Web (DAW).

---

## 📌 Índice

- [🛠️ Tecnologías](#️-tecnologías)
- [⚙️ Instalación y preparación](#️-instalación-y-preparación)
- [🖼️ Capturas](#️-capturas)
- [📁 Estructura del proyecto](#-estructura-del-proyecto)
- [📡 API REST](#-api-rest)
- [✅ Pruebas](#-pruebas)
- [🧠 Funcionalidades clave](#-funcionalidades-clave)
- [🗂️ Organización del repositorio](#️-organización-del-repositorio)
- [👨‍💻 Autor](#-autor)

---

## 🛠️ Tecnologías

**Frontend:**
- React + TypeScript
- Tailwind CSS
- ShadCN
- Vite

**Backend:**
- Spring Boot + Java
- Spring Security (JWT)
- JPA / Hibernate
- MySQL

**Herramientas:**
- Git + GitHub
- GitHub Desktop
- Figma (diseño del prototipo)
- Postman (pruebas de endpoints)

---

## ⚙️ Instalación y preparación

Este proyecto está preparado para ejecutarse de forma local utilizando **Docker Desktop**, lo que garantiza un entorno uniforme y simplifica el proceso de despliegue.

### ✅ Requisitos previos

- Tener instalado **Docker Desktop**  
  👉 [Descargar Docker Desktop](https://www.docker.com/products/docker-desktop)

- Tener instalado **Git** para clonar el repositorio  
  👉 [Descargar Git](https://git-scm.com/downloads)

- (Opcional) Tener instalado **pnpm** si se desea trabajar directamente sobre el frontend antes de construirlo  
  👉 [Guía para instalar pnpm](https://pnpm.io/installation)

---

### 📥 Clonar el repositorio

```bash
git clone https://github.com/PabloGonz68/TFG-Hospedaje.git
cd TFG-Hospedaje
```

---

### 🔐 Configurar variables de entorno

Crea un archivo `.env` en la raíz del **backend** con el siguiente contenido:

```env
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=
SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/hospeda?allowPublicKeyRetrieval=true&useSSL=false
JWT_SECRET=tu_clave_secreta_aqui
```

Este archivo será leído por Docker Compose y utilizado por Spring Boot.

---

### 🏗️ Compilar la aplicación (solo necesario una vez o tras cambios)

#### Backend (Spring Boot)

Compila el proyecto para generar el `.jar` en `build/libs/` que usará Docker:

```bash
./gradlew build
```

#### Frontend (React)

Desde la carpeta `frontend/`, ejecuta:

```bash
pnpm install
pnpm build
```

Esto generará la carpeta `dist/` con los archivos estáticos de la SPA.

---

### 🐳 Ejecutar Docker Compose (Backend + MySQL)

Desde el directorio `backend/`:

```bash
cd backend
docker compose up --build
```

Esto iniciará:

- Un contenedor **MySQL** (puerto `3308`)
- Un contenedor **Spring Boot API** (puerto `8080`)

---

### ✅ Verificación del backend

Accede a:

```url
http://localhost:8080
```

Para verificar que la API está funcionando.

Puedes conectarte a la base de datos con un cliente MySQL usando:

- **Host**: `localhost`
- **Puerto**: `3308`
- **Usuario**: `root`
- **Base de datos**: `hospedaje_tickets`
- **Contraseña**: (vacía si usas `MYSQL_ALLOW_EMPTY_PASSWORD=yes`)

---

### 🌐 Despliegue del Frontend con Docker

Desde el directorio `frontend/`, ejecuta:

```bash
cd frontend
docker build -t hospeda-frontend .
docker run -d -p 80:80 hospeda-frontend
```

---

### ✅ Verificación del frontend

Accede a:

```url
http://localhost:5173
```

Para comprobar que la aplicación React está corriendo correctamente.

---

## 🖼️ Capturas

> (Aquí puedes añadir capturas de pantalla con `![texto](ruta.png)` si lo deseas)

---

## 📁 Estructura del proyecto

```bash
TFG-Hospedaje/
│
├── hospedaje-tickets/               # API REST con Spring Boot
│   ├── src/
│   ├── docker-compose.yml
│   └── ...
│
├── hospeda-frontend/              # SPA con React y Vite
│   ├── src/
│   ├── public/
│   └── ...
│
└── README.md
```

---

## 📡 API REST

El backend expone una API REST con endpoints para:

- Registro y autenticación de usuarios (JWT)
- Gestión de hospedajes y reservas
- Sistema de tickets
- Grupos de viaje
- Panel de administración

---

## ✅ Pruebas

Se han realizado pruebas manuales con Postman y pruebas unitarias en algunos servicios. La base de datos se reinicia automáticamente en cada despliegue de Docker.

---

## 🧠 Funcionalidades clave

- Sistema de **tickets**: hospedarse solo es posible si has hospedado antes.
- Hospedajes en **ciudades y pueblos** con coste diferenciado.
- **Reservas en grupo**: creación de grupo y aportación de tickets individuales.
- **Panel de administración** para gestionar usuarios y tickets.
- Despliegue con **Docker Desktop** (MySQL + Spring Boot + Nginx).

---

## 🗂️ Organización del repositorio

- `hospedaje-tickets/`: lógica de negocio, entidades, servicios y controladores.
- `hospeda-frontend/`: diseño de la SPA, lógica del cliente y consumo de la API.
- `docker-compose.yml`: orquestación de servicios del backend.
- `Dockerfile`: configuración de despliegue para el frontend.

---

## 👨‍💻 Autor

**Pablo González**  
Trabajo de Fin de Grado - 2º DAW  
[GitHub: PabloGonz68](https://github.com/PabloGonz68)

---
