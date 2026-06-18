# Cartex Frontend

Frontend del proyecto Cartex construido con Next.js 14 y TypeScript.

## Stack

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Vercel** (despliegue)

## Estructura

```
src/
├── app/          # Rutas y layouts (App Router)
├── components/   # Componentes reutilizables
├── hooks/        # Custom hooks
├── lib/          # Utilidades y configuraciones
├── services/     # Llamadas al backend
└── types/        # Tipos TypeScript
```

## Variables de Entorno

Crea un archivo `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Ejecución Local

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar en producción (requiere build previo)
npm start
```

La aplicación estará disponible en `http://localhost:3000`.

## Despliegue en Vercel

1. Conecta el repositorio a Vercel
2. Configura la variable de entorno `NEXT_PUBLIC_API_URL` apuntando al backend en Railway
3. Vercel desplegará automáticamente en cada push
