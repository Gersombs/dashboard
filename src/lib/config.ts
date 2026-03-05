// Configuracion en tiempo de ejecucion.
let runtimeConfig: {
  API_BASE_URL: string;
} | null = null;

// Estado de carga de configuracion.
let configLoading = true;

// Configuracion por defecto.
const defaultConfig = {
  API_BASE_URL: 'http://127.0.0.1:8000',
};

const isDev = import.meta.env.DEV;

// Cargar configuracion de runtime.
export async function loadRuntimeConfig(): Promise<void> {
  try {
    if (isDev) console.log('DEBUG: iniciando carga de runtime config...');

    const response = await fetch('/api/config');
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        runtimeConfig = await response.json();
        if (isDev) console.log('Runtime config cargada correctamente');
      }
    } else if (isDev) {
      console.warn('DEBUG: error al obtener config, status:', response.status);
    }
  } catch {
    if (isDev) {
      console.warn('No se pudo cargar runtime config; se usaran valores por defecto/env');
    }
  } finally {
    configLoading = false;
  }
}

// Obtener la configuracion actual.
export function getConfig() {
  // 1) Prioridad maxima: variables de entorno en build time.
  if (import.meta.env.VITE_API_BASE_URL) {
    return {
      API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    };
  }

  // Si runtime config sigue cargando, usar default para no bloquear.
  if (configLoading) {
    return defaultConfig;
  }

  // 2) Prioridad media: configuracion en runtime.
  if (runtimeConfig) {
    return runtimeConfig;
  }

  // 3) Fallback: default local.
  return defaultConfig;
}

// Getter dinamico de API_BASE_URL.
export function getAPIBaseURL(): string {
  const baseURL = getConfig().API_BASE_URL;
  if (baseURL === '/') {
    return '';
  }
  return baseURL;
}

export const config = {
  get API_BASE_URL() {
    return getAPIBaseURL();
  },
};
