# Frontend Didáctica

Frontend React + Vite adaptado para consumir el backend `backend-didactica` hecho en Spring Boot.

## Decisión técnica

Se conservó React porque el proyecto entregado ya estaba construido en React/Vite y tenía una interfaz visual completa. Migrarlo a Angular habría implicado rehacer toda la UI, mientras que adaptar los servicios al backend permitió mantener el diseño y conectar el CRUD real.

## Requisitos

- Node.js 20 o superior.
- Backend Spring Boot ejecutándose en `http://localhost:8080`.
- Base de datos MySQL configurada para el backend.
- Cloudinary configurado en el backend para subir evidencias.

## Configuración

Copia `.env.example` como `.env.local` si necesitas cambiar la URL del backend:

```env
VITE_API_URL=http://localhost:8080
```

La comunicacion con el backend se maneja en `src/services/api.ts`, leyendo `VITE_API_URL`.
Para produccion se dejo `.env.production` apuntando a:

```env
VITE_API_URL=https://backend-didactica.onrender.com
```

## Ejecutar

```bash
npm install
npm run dev
```

La app corre en:

```text
http://localhost:4200
```

Se usa el puerto 4200 para coincidir con la configuración CORS esperada del backend.

## Funcionalidades conectadas al backend

- Consulta pública de categorías: `GET /api/public/categorias`
- Consulta pública de actividades publicadas: `GET /api/public/actividades`
- Login administrativo: `POST /api/auth/login`
- Panel administrativo con token JWT.
- Crear/editar/eliminar actividades.
- Publicar, archivar o pasar actividades a borrador.
- Crear aprendizajes y materiales asociados.
- Subir evidencias desde el dispositivo mediante multipart/form-data hacia Cloudinary por medio del backend.
- Agregar evidencias por URL.

## Nota

Si el backend no está disponible, la parte pública muestra datos de demostración para no dejar la página vacía. El panel administrativo sí requiere backend y token real.
"# frontend-didactica" 
