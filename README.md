🚀 Crypto Dashboard - Datos de Mercado en Tiempo Real

Un dashboard interactivo de criptomonedas que visualiza datos de mercado en tiempo real utilizando la API de CoinGecko. Construido con React, TypeScript, Recharts y shadcn/ui.

📸 Funcionalidades
📊 Visualización de Datos

Gráfica de Línea (Historial de Precio): Seguimiento de tendencias en periodos de 7, 30, 90 días o 1 año.

Gráfica de Barras (Capitalización de Mercado): Comparación entre las principales criptomonedas.

Gráfica Donut (Distribución de Volumen): Visualización de la distribución del volumen de trading.

🎛 Filtros Interactivos

Selector de Criptomoneda: BTC, ETH, SOL y otras 10 populares.

Periodo de Tiempo: 7 días, 30 días, 90 días o 1 año.

Moneda: USD, EUR o GBP.

Top N Coins: Mostrar top 5, 10 o 20 monedas.

📌 Métricas Clave (Tarjetas Estadísticas)

Precio actual con variación porcentual 24h

Capitalización total de mercado

Volumen de trading 24h

Supply circulante y máximo histórico (ATH)

✨ Características Adicionales

🌙 Modo oscuro con diseño glassmorphism

📱 Totalmente responsivo (desktop, tablet y móvil)

♿ Accesible (atributos ARIA y navegación con teclado)

⚡ Optimizado con caché de API y renderizado eficiente

🔄 Actualización manual de datos

⚠️ Manejo amigable de errores de API

🛠️ Stack Tecnológico
Tecnología	Propósito
React 18	Framework de UI
TypeScript	Tipado estático
Vite	Herramienta de build y servidor de desarrollo
Recharts	Librería de gráficas
shadcn/ui	Sistema de componentes UI
Tailwind CSS	Estilizado utility-first
TanStack Query	Fetching y cacheo de datos
Lucide React	Librería de íconos
📁 Estructura del Proyecto
src/
├── components/
│   └── dashboard/
│       ├── Filters.tsx
│       ├── StatCards.tsx
│       ├── PriceLineChart.tsx
│       ├── MarketCapBarChart.tsx
│       └── VolumeDonutChart.tsx
├── lib/
│   ├── api.ts
│   └── utils-dashboard.ts
├── pages/
│   └── Index.tsx
└── index.css
🚀 Instalación y Ejecución
Requisitos

Node.js 18+

pnpm (recomendado) o npm

Instalación
# Instalar dependencias
pnpm install

# Iniciar entorno de desarrollo
pnpm run dev

# Build de producción
pnpm run build

# Ejecutar linter
pnpm run lint

El servidor de desarrollo inicia en:

http://localhost:5173
🎨 Enfoque de Diseño
Diseño Visual

Tema oscuro con fondo profundo (#0F1117)

Acento principal Indigo (#6366F1)

Colores verde/rojo para variaciones positivas/negativas

Efecto glassmorphism en tarjetas

Animaciones suaves en hover

Decisiones de Arquitectura

API CoinGecko: Elegida por su plan gratuito sin API Key y buena estabilidad.

Recharts: Enfoque declarativo y fácil integración con React.

TanStack Query: Manejo eficiente de estados de carga, cacheo y reintentos.

Separación por Componentes: Cada gráfica es independiente para facilitar mantenimiento.

Capa de Caché Personalizada: TTL de 1 minuto para reducir llamadas y respetar rate limits.

📱 Estrategia Responsive

CSS Grid adaptable

Layout fluido para tarjetas (1 columna móvil → 4 columnas desktop)

Gráficas con ResponsiveContainer

Filtros adaptables con flex-wrap

⚠️ Limitaciones Conocidas

La API gratuita de CoinGecko tiene límites de rate.

Los datos se cachean por 1 minuto.

Solo incluye 10 criptomonedas por simplicidad.

Compatible con navegadores modernos.

No incluye autenticación ni persistencia de usuario.

🧪 Testing

Arquitectura modular preparada para testing:

Componentes testeables de forma aislada.

Capa de API mockeable.

Funciones utilitarias puras.

📄 Licencia

MIT License.

🙏 Créditos

Datos: CoinGecko API

Gráficas: Recharts

UI: shadcn/ui

Íconos: Lucide