# Dashboard cripto (CoinGecko)

Dashboard interactivo de criptomonedas construido para una prueba técnica de Front-End.

## Demo en vivo
- URL: `https://dashboard-phi-dun-54.vercel.app/` 

## Capturas
Estado inicial:

![Estado inicial del dashboard](docs/screenshots/01-initial-state.png)

Despues de aplicar filtros:

![Dashboard despues de filtros](docs/screenshots/02-after-filters.png)

Vista movil:

![Vista movil del dashboard](docs/screenshots/03-mobile.png)

## Cobertura de requisitos
1. Visualizacion de datos
- API publica: CoinGecko (`/coins/markets`, `/coins/{id}/market_chart`)
- Graficas: linea, barras y dona (Recharts)

2. Filtros e interactividad
- Filtros: criptomoneda, rango de fechas, moneda y top N
- Actualizacion dinamica al cambiar filtros
- Tooltips y leyendas en todas las graficas

3. Diseno responsivo
- Layout responsive con grid/flex para desktop/tablet/movil
- Graficas adaptables con `ResponsiveContainer`

4. Calidad de codigo
- TypeScript + componentes modulares
- Separacion por responsabilidades (`components/dashboard`, `lib/api`, `lib/utils`)

5. Rendimiento
- Cache en memoria para requests de API
- Retry con exponential backoff + timeout en errores transitorios
- Menos carga de red con React Query + cache

6. Accesibilidad
- ARIA labels y landmarks semanticos (`header`, `main`, `footer`)
- Controles navegables por teclado
- Enlace de salto y resumenes de graficas para lectores de pantalla

7. Compatibilidad entre navegadores
- Smoke test Playwright para Chromium, Firefox y WebKit

8. Pruebas
- Pruebas unitarias con Vitest + Testing Library
- Pruebas E2E smoke con Playwright

9. Documentacion
- Este README incluye setup, arquitectura, supuestos, problemas conocidos, pruebas y despliegue

## Stack tecnologico
- React 18 + TypeScript
- Vite
- Recharts
- TanStack Query
- Tailwind CSS + shadcn/ui
- Vitest + Testing Library
- Playwright

## Estructura del proyecto
```txt
src/
  components/dashboard/
  lib/
  pages/
  test/
e2e/
docs/screenshots/
```

## Instalacion y ejecucion
Requisitos:
- Node.js 18+
- npm 9+ (o pnpm)

Instalar dependencias:
```bash
npm install
```

Ejecutar en local:
```bash
npm run dev
```

Build de produccion:
```bash
npm run build
```

## Variables de entorno
Copia `.env.example` a `.env` y ajusta si lo necesitas:

```bash
cp .env.example .env
```

Variables disponibles:
- `VITE_API_CACHE_MS`: tiempo de cache en ms (default `180000`)
- `VITE_API_TIMEOUT_MS`: timeout por request en ms (default `20000`)
- `VITE_API_MAX_RETRIES`: reintentos en fallos transitorios (default `3`)
- `VITE_API_BACKOFF_BASE_MS`: base del backoff en ms (default `600`)
- `VITE_API_BACKOFF_JITTER_MS`: jitter aleatorio en ms (default `300`)

## Pruebas
Pruebas unitarias:
```bash
npm run test:run
```

Cobertura:
```bash
npm run test:coverage
```

Pruebas smoke multi-navegador:
```bash
npm run test:e2e -- e2e/dashboard.smoke.spec.ts
```

Generar capturas del README:
```bash
npm run screenshots
```

Validacion completa (lint + unit tests + build):
```bash
npm run check
```

## Despliegue
Vercel (recomendado):
1. Subir repositorio a GitHub.
2. Importar proyecto en Vercel.
3. Comando de build: `npm run build`.
4. Directorio de salida: `dist`.
5. Cargar variables opcionales desde `.env.example`.

Netlify (alternativa):
- Comando de build: `npm run build`
- Directorio de publicacion: `dist`

## Notas de accesibilidad
- Enlace de salto para ir al contenido principal.
- Labels descriptivos en toolbar y controles.
- Resumen textual de graficas para lectores de pantalla.
- Estados de carga/error anunciados con `aria-live`.

## Supuestos
- El plan gratis de CoinGecko puede aplicar rate limit.
- Los datos de mercado no requieren autenticacion para este alcance.
- El dashboard esta enfocado en top monedas y analisis corto/medio plazo.

## Problemas conocidos
- El API gratis puede fallar en picos de trafico global.
- Las graficas dependen de la disponibilidad del API externo.
- Falta definir URL final de demo en vivo despues del deploy.

## Autor
GersomBS
