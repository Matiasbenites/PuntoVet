# PuntoVet

Proyecto de tienda veterinaria compuesto por un backend REST API en Node.js/Express y un frontend en React con Vite.

## Estructura principal

- `Backend/REST-API` - API REST con Express, Sequelize y MySQL
- `Frontend` - aplicación React + Vite

## Requisitos

- Node.js 18+ (o compatible)
- npm
- XAMPP con MySQL activo

## Configuración y ejecución local

### 1. Preparar MySQL con XAMPP

1. Abrir el panel de control de XAMPP.
2. Iniciar el servicio de MySQL.
3. Verificar que MySQL esté corriendo en `localhost:3306`.
4. Crear la base de datos usando el script SQL:

   - `PuntoVet/Backend/REST-API/BDD/CREATE DB.sql`

   Puedes ejecutar este script desde phpMyAdmin o desde la terminal de MySQL.

### 2. Backend

1. Abrir terminal en `PuntoVet/Backend/REST-API`.
2. Instalar dependencias:

```bash
cd PuntoVet/Backend/REST-API
npm install
```

3. Crear el archivo de entorno `.env` a partir del ejemplo:

```bash
copy .env.example .env
```

4. Ajustar las variables en `.env` según tu instalación de XAMPP:

```env
PORT=4000
HOST=localhost
DATABASE=puntovet
USER=root
PASSWORD=
URL_PUBLICA=http://localhost:4000
```

- Si tu MySQL de XAMPP usa contraseña en `root`, coloca esa contraseña en `PASSWORD`.
- Asegúrate de que `DATABASE=puntovet` coincida con la base de datos creada.

5. Iniciar el servidor:

```bash
npm run dev
```

O en modo producción:

```bash
npm start
```

El backend quedará escuchando en `http://localhost:4000` (o el puerto definido en `.env`).

### 3. Frontend

1. Abrir terminal en `PuntoVet/Frontend`.
2. Instalar dependencias:

```bash
cd PuntoVet/Frontend
npm install
```

3. Iniciar el frontend:

```bash
npm run dev
```

4. Abrir la URL que muestra Vite, generalmente `http://localhost:5173`.

## Flujo recomendado

1. Iniciar XAMPP y levantar MySQL.
2. Crear la base de datos con `PuntoVet/Backend/REST-API/BDD/CREATE DB.sql`.
3. Copiar y configurar `.env` en `Backend/REST-API`.
4. Ejecutar el backend con `npm start`.
5. Ejecutar el frontend con `npm run dev`.

## Notas adicionales

- El backend usa `sequelize` para conectar con MySQL.
- El frontend consume las rutas del backend, así que el servidor debe estar levantado antes de usar la aplicación.
- Comprueba que los puertos del backend y del frontend no estén en conflicto con otros servicios.

---