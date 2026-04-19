# PuntoVet

Proyecto de tienda veterinaria compuesto por un backend REST API en Node.js/Express y un frontend en React con Vite.

## Estructura principal

- `Backend/REST-API` - API REST con Express, Sequelize y MySQL
- `Frontend` - aplicación React + Vite

## Requisitos

- Node.js 18+ (o compatible)
- npm
- MySQL

## Configuración y ejecución local

### 1. Backend

1. Abrir terminal en `PuntoVet/Backend/REST-API`
2. Instalar dependencias:

```bash
cd PuntoVet/Backend/REST-API
npm install
```

3. Crear el archivo de entorno `.env` con los datos de tu base de datos MySQL:

```bash
cp .env,example .env
```

4. Ajustar las variables en `.env`:

```env
PORT=3000
HOST=localhost
DATABASE=punto_vet
USER=tu_usuario
PASSWORD=tu_contraseña
URL_PUBLICA=http://localhost:3000
```

5. Crear la base de datos y el esquema MySQL usando el script disponible:

- `PuntoVet/Backend/REST-API/BDD/CREATE DB.sql`

Ejecuta ese script en tu cliente MySQL (por ejemplo MySQL Workbench, phpMyAdmin o consola `mysql`).

6. Iniciar el servidor:

```bash
npm run dev
```

O en modo producción:

```bash
npm start
```

El backend quedará escuchando en `http://localhost:3000` por defecto.

### 2. Frontend

1. Abrir terminal en `PuntoVet/Frontend`
2. Instalar dependencias:

```bash
cd PuntoVet/Frontend
npm install
```

3. Iniciar el frontend:

```bash
npm run dev
```

Vite mostrará la URL local donde se sirve la aplicación, generalmente `http://localhost:5173`.

## Flujo recomendado

1. Arrancar MySQL
2. Inicializar la base de datos con `CREATE DB.sql`
3. Configurar el `.env` en `Backend/REST-API`
4. Ejecutar backend
5. Ejecutar frontend

## Notas adicionales

- El backend usa `sequelize` para conectar con MySQL.
- El frontend consume las rutas del backend, así que el servidor debe estar arriba antes de usar la aplicación.
- Asegúrate de que el puerto del backend (`PORT`) no esté en uso.

---