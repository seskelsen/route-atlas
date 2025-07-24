# Configuração - Route Atlas DMS Dashboard

## Visão Geral

Este documento descreve as opções de configuração disponíveis para customizar o Route Atlas DMS Dashboard conforme suas necessidades específicas.

## Configurações de Dados


### Sincronização Automática entre JSON e LocalStorage

O sistema detecta automaticamente mudanças nos arquivos JSON (ex: adição/remoção de CDs ou pontos de entrega) e sincroniza o localStorage para garantir que o dashboard sempre reflita os dados mais recentes, sem necessidade de intervenção manual.

Por padrão, os dados são atualizados a cada 30 segundos. Para modificar:

```typescript
// Em src/components/DMSDashboard.tsx
const { cds, deliveryPoints, cdConnections, isLoading, error } = 
  useDataLoader(30000); // Altere para o valor desejado em milissegundos
```

**Valores recomendados**:
- Desenvolvimento: 10000 (10 segundos)
- Produção: 30000 (30 segundos)  
- Ambientes críticos: 5000 (5 segundos)

### 2. Localização dos Arquivos de Dados

Os arquivos JSON estão em `src/data/`. Para alterar:

```typescript
// Em src/hooks/useDataLoader.ts
const loadData = async () => {
  const cdsResponse = await fetch('/custom-path/cds.json');
  // ... outros arquivos
};
```

### 3. Estrutura de Coordenadas

O sistema usa coordenadas SVG. Para ajustar o viewport:

```typescript
// Em src/components/RouteVisualization.tsx
<svg 
  width="600"    // Largura do mapa
  height="500"   // Altura do mapa
  viewBox="0 0 600 500"
>
```

## Configurações de Interface

### 1. Tema e Cores

#### Cores Primárias

Edite `tailwind.config.ts`:

```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',  // Azul principal
          glow: '#60a5fa',     // Azul claro
        },
        accent: '#10b981',     // Verde para sucesso
        'route-active': '#f59e0b', // Amarelo para rotas ativas
        'cd-primary': '#8b5cf6',   // Roxo para CDs
        'delivery-primary': '#ef4444', // Vermelho para entregas
      }
    }
  }
}
```

#### Variáveis CSS Customizadas

Em `src/index.css`:

```css
:root {
  /* Cores do tema claro */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --accent: 142.1 76.2% 36.3%;
  
  /* Personalize conforme necessário */
  --chart-1: 12 76% 61%;
  --chart-2: 173 58% 39%;
}

.dark {
  /* Cores do tema escuro */
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
}
```

### 2. Layout e Espaçamento

#### Grid de Métricas

Em `DMSDashboard.tsx`:

```typescript
{/* Altere grid-cols-4 para 3, 2 ou 6 conforme necessário */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
  {/* Cards de métricas */}
</div>
```

#### Layout Principal

```typescript
{/* Ajuste a proporção entre mapa e sidebar */}
<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
  {/* lg:col-span-3 = 75% para mapa, 25% para sidebar */}
  <div className="lg:col-span-3">
    {/* Visualização */}
  </div>
  <div className="space-y-6">
    {/* Sidebar - 25% */}
  </div>
</div>
```

### 3. Responsividade

#### Breakpoints Customizados

Em `tailwind.config.ts`:

```typescript
module.exports = {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      // Adicione breakpoints customizados
      'tablet': '900px',
      'desktop': '1200px',
    }
  }
}
```

## Configurações de Visualização

### 1. Estilos dos CDs

Em `RouteVisualization.tsx`:

```typescript
// Customizar aparência dos CDs
<circle
  cx={cd.location.x}
  cy={cd.location.y}
  r={12}  // Tamanho do CD
  fill={cd.status === 'active' ? '#3b82f6' : '#6b7280'}
  stroke="#ffffff"
  strokeWidth={2}
  className="cursor-pointer hover:scale-110 transition-transform"
/>
```

### 2. Estilos dos Pontos de Entrega

```typescript
// Customizar aparência dos pontos
<circle
  cx={point.location.x}
  cy={point.location.y}
  r={6}  // Tamanho do ponto
  fill={getStatusColor(point.status)}
  className="transition-all duration-300"
/>
```

### 3. Linhas de Conexão

```typescript
// Customizar conexões entre CDs
<line
  x1={fromCD.location.x}
  y1={fromCD.location.y}
  x2={toCD.location.x}
  y2={toCD.location.y}
  stroke="#10b981"  // Cor da linha
  strokeWidth={2}   // Espessura
  strokeDasharray="4,4"  // Linha tracejada
/>
```

## Configurações de Performance

### 1. React Query

Em `App.tsx`:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,        // Tempo antes de considerar dados obsoletos
      refetchInterval: 30000,  // Intervalo de refetch automático
      retry: 3,                // Número de tentativas em caso de erro
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
```

### 2. Lazy Loading

Para componentes grandes:

```typescript
import { lazy, Suspense } from 'react';

const RouteVisualization = lazy(() => import('./RouteVisualization'));

// No componente
<Suspense fallback={<div>Carregando...</div>}>
  <RouteVisualization />
</Suspense>
```

### 3. Memoization

Para componentes que renderizam frequentemente:

```typescript
import { memo, useMemo } from 'react';

const MetricsCard = memo(({ data }) => {
  const calculations = useMemo(() => {
    // Cálculos pesados aqui
    return processData(data);
  }, [data]);

  return <Card>{calculations}</Card>;
});
```

## Configurações de Build

### 1. Vite Configuration

Em `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,        // Porta de desenvolvimento
    host: true,        // Permite acesso externo
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,   // Mapas de source para debug
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-accordion', '@radix-ui/react-alert-dialog']
        }
      }
    }
  }
});
```

### 2. TypeScript Configuration

Em `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Configurações de Ambiente

### 1. Variáveis de Ambiente

Crie arquivo `.env`:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3000
VITE_API_TIMEOUT=5000

# Data Configuration  
VITE_REFRESH_INTERVAL=30000
VITE_RETRY_ATTEMPTS=3

# Feature Flags
VITE_ENABLE_WEBSOCKET=false
VITE_ENABLE_OFFLINE_MODE=false

# Analytics
VITE_ANALYTICS_ID=your-analytics-id
```

Uso no código:

```typescript
const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  refreshInterval: Number(import.meta.env.VITE_REFRESH_INTERVAL) || 30000,
  enableWebSocket: import.meta.env.VITE_ENABLE_WEBSOCKET === 'true',
};
```

### 2. Configuração por Ambiente

```typescript
// src/config/index.ts
const baseConfig = {
  refreshInterval: 30000,
  maxRetries: 3,
};

const environments = {
  development: {
    ...baseConfig,
    apiUrl: 'http://localhost:3000',
    debug: true,
    refreshInterval: 10000, // Mais frequente em dev
  },
  production: {
    ...baseConfig,
    apiUrl: 'https://api.routeatlas.com',
    debug: false,
  },
  staging: {
    ...baseConfig,
    apiUrl: 'https://staging-api.routeatlas.com',
    debug: true,
  }
};

export const config = environments[import.meta.env.MODE] || environments.development;
```

## Configurações de Integração

### 1. API Externa

Para integrar com APIs:

```typescript
// src/services/api.ts
class APIService {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string, timeout = 5000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  async get<T>(endpoint: string): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      clearTimeout(timeoutId);
      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private getToken(): string {
    return localStorage.getItem('auth_token') || '';
  }
}
```

### 2. WebSocket (Opcional)

```typescript
// src/hooks/useWebSocket.ts
export const useWebSocket = (url: string, enabled = false) => {
  const [data, setData] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const ws = new WebSocket(url);
    
    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };

    return () => ws.close();
  }, [url, enabled]);

  return { data, connected };
};
```

## Configurações de Segurança

### 1. Content Security Policy

Para produção, adicione em `index.html`:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:;
               connect-src 'self' wss: https:;">
```

### 2. CORS Configuration

No servidor:

```javascript
// Express.js example
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Configurações de Monitoramento

### 1. Error Tracking

```typescript
// src/utils/errorTracking.ts
class ErrorTracker {
  static capture(error: Error, context?: Record<string, any>) {
    console.error('Error captured:', error, context);
    
    // Enviar para serviço de monitoramento
    if (import.meta.env.PROD) {
      this.sendToService(error, context);
    }
  }

  private static sendToService(error: Error, context?: Record<string, any>) {
    // Implementar integração com Sentry, LogRocket, etc.
  }
}
```

### 2. Performance Monitoring

```typescript
// src/utils/performance.ts
export const trackPageLoad = () => {
  if ('performance' in window) {
    const loadTime = performance.now();
    console.log('Page load time:', loadTime);
    
    // Enviar métrica
    analytics.track('page_load', { duration: loadTime });
  }
};
```

## Configurações Avançadas

### 1. Internationalization (i18n)

Para suporte a múltiplos idiomas:

```typescript
// src/i18n/index.ts
const translations = {
  'pt-BR': {
    'dashboard.title': 'DMS Dashboard',
    'metrics.total_deliveries': 'Total de Entregas',
    // ...
  },
  'en-US': {
    'dashboard.title': 'DMS Dashboard',
    'metrics.total_deliveries': 'Total Deliveries',
    // ...
  }
};

export const t = (key: string, locale = 'pt-BR') => {
  return translations[locale]?.[key] || key;
};
```

### 2. Feature Flags

```typescript
// src/utils/featureFlags.ts
const flags = {
  enableWebSocket: import.meta.env.VITE_ENABLE_WEBSOCKET === 'true',
  enableOfflineMode: import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
};

export const isFeatureEnabled = (flag: keyof typeof flags): boolean => {
  return flags[flag] || false;
};
```

### 3. Plugin System

Para extensibilidade:

```typescript
// src/plugins/index.ts
interface Plugin {
  name: string;
  version: string;
  init: () => void;
  destroy: () => void;
}

class PluginManager {
  private plugins: Plugin[] = [];

  register(plugin: Plugin) {
    this.plugins.push(plugin);
    plugin.init();
  }

  unregister(name: string) {
    const plugin = this.plugins.find(p => p.name === name);
    if (plugin) {
      plugin.destroy();
      this.plugins = this.plugins.filter(p => p.name !== name);
    }
  }
}

export const pluginManager = new PluginManager();
```