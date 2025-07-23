# Troubleshooting - Route Atlas DMS Dashboard

## Problemas Comuns e Soluções

Esta seção documenta problemas frequentes e suas soluções para o Route Atlas DMS Dashboard.

## Problemas de Instalação

### 1. Erro "ENOENT: no such file or directory"

**Sintomas:**
```bash
npm ERR! enoent ENOENT: no such file or directory, open '/path/to/package.json'
```

**Causas:**
- Executando comandos fora do diretório do projeto
- Repositório não clonado corretamente

**Soluções:**
```bash
# Verificar se está no diretório correto
pwd
ls -la package.json

# Se necessário, navegar para o diretório
cd route-atlas

# Re-clonar se necessário
git clone https://github.com/seskelsen/route-atlas.git
cd route-atlas
```

### 2. Versão do Node.js Incompatível

**Sintomas:**
```bash
error: The engine "node" is incompatible with this module
```

**Causas:**
- Versão do Node.js inferior a 18

**Soluções:**
```bash
# Verificar versão atual
node --version

# Atualizar usando nvm (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Ou download direto do site oficial
# https://nodejs.org/
```

### 3. Falha na Instalação de Dependências

**Sintomas:**
```bash
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Soluções:**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Ou usar force resolve
npm install --legacy-peer-deps

# Alternativa com yarn
npm install -g yarn
yarn install
```

## Problemas de Build

### 1. Build Falha com Erro de Memória

**Sintomas:**
```bash
<--- Last few GCs --->
[32694:0x4...] JavaScript heap out of memory
```

**Causas:**
- Memória insuficiente
- Processos concorrentes consumindo recursos

**Soluções:**
```bash
# Aumentar limite de memória do Node.js
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Ou definir no package.json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' vite build"
  }
}

# Fechar outros aplicativos para liberar memória
```

### 2. Erro de Importação de Módulos

**Sintomas:**
```bash
Error: Cannot resolve module '@/components/DMSDashboard'
```

**Causas:**
- Configuração de paths incorreta
- Arquivo inexistente

**Soluções:**
```bash
# Verificar se o arquivo existe
ls -la src/components/DMSDashboard.tsx

# Verificar configuração do Vite
cat vite.config.ts

# Configuração correta:
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### 3. Erro de TypeScript

**Sintomas:**
```bash
error TS2307: Cannot find module '@/types/data'
```

**Soluções:**
```bash
# Verificar configuração do TypeScript
cat tsconfig.json

# Regenerar tipos se necessário
npx tsc --noEmit

# Verificar paths no tsconfig.json:
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Problemas de Desenvolvimento

### 1. Servidor de Desenvolvimento Não Inicia

**Sintomas:**
```bash
Error: listen EADDRINUSE: address already in use :::8080
```

**Causas:**
- Porta já em uso
- Processo anterior não finalizou

**Soluções:**
```bash
# Verificar processos usando a porta
lsof -ti:8080
netstat -tulpn | grep :8080

# Finalizar processo específico
kill -9 <PID>

# Usar porta diferente
npm run dev -- --port 3001

# Ou configurar no vite.config.ts
export default defineConfig({
  server: {
    port: 3001
  }
});
```

### 2. Hot Reload Não Funciona

**Sintomas:**
- Mudanças no código não refletem automaticamente
- Necessário refresh manual

**Causas:**
- Watchers limitados do sistema
- Configuração incorreta

**Soluções:**
```bash
# Aumentar limite de watchers (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Configurar polling no Vite
export default defineConfig({
  server: {
    watch: {
      usePolling: true,
      interval: 1000
    }
  }
});
```

### 3. Componentes Não Renderizam

**Sintomas:**
- Tela em branco
- Componentes não aparecem

**Causas:**
- Erros JavaScript não tratados
- Importações incorretas

**Soluções:**
```bash
# Verificar console do navegador (F12)
# Procurar por erros JavaScript

# Verificar importações
# ✅ Correto:
import { DMSDashboard } from '@/components/DMSDashboard';

# ❌ Incorreto:
import DMSDashboard from '@/components/DMSDashboard'; // sem export default
```

## Problemas de Dados

### 1. Dados JSON Não Carregam

**Sintomas:**
- Dashboard mostra estado de carregamento infinito
- Erro 404 para arquivos JSON

**Causas:**
- Arquivos JSON não existem
- Caminhos incorretos
- Servidor não serve arquivos estáticos

**Soluções:**
```bash
# Verificar se arquivos existem
ls -la src/data/
# Deve mostrar: cds.json, delivery-points.json, cd-connections.json

# Verificar conteúdo dos arquivos
cat src/data/cds.json

# Verificar no navegador
# http://localhost:8080/src/data/cds.json
```

### 2. JSON Malformado

**Sintomas:**
```bash
SyntaxError: Unexpected token '}' in JSON
```

**Causas:**
- Sintaxe JSON inválida
- Vírgulas extras
- Aspas incorretas

**Soluções:**
```bash
# Validar JSON
npm install -g jsonlint
jsonlint src/data/cds.json

# Ou usar ferramenta online
# https://jsonlint.com/

# Problemas comuns:
# ❌ Vírgula final:
{
  "id": "cd-001",
  "name": "CD Recife", // ← vírgula extra
}

# ✅ Correto:
{
  "id": "cd-001",
  "name": "CD Recife"
}
```

### 3. Dados Inconsistentes

**Sintomas:**
- Pontos de entrega sem CD correspondente
- Conexões quebradas
- Métricas incorretas

**Causas:**
- IDs não correspondentes
- Dados desatualizados

**Soluções:**
```bash
# Script de validação
node scripts/validate-data.js

# Ou criar validação customizada:
```

```javascript
// scripts/validate-data.js
const fs = require('fs');

const cds = JSON.parse(fs.readFileSync('src/data/cds.json'));
const deliveryPoints = JSON.parse(fs.readFileSync('src/data/delivery-points.json'));
const connections = JSON.parse(fs.readFileSync('src/data/cd-connections.json'));

// Validar referências
deliveryPoints.forEach(dp => {
  const cdExists = cds.find(cd => cd.id === dp.assignedCD);
  if (!cdExists) {
    console.error(`Delivery point ${dp.id} references non-existent CD: ${dp.assignedCD}`);
  }
});

connections.forEach(conn => {
  const fromExists = cds.find(cd => cd.id === conn.from);
  const toExists = cds.find(cd => cd.id === conn.to);
  
  if (!fromExists) console.error(`Connection references non-existent CD: ${conn.from}`);
  if (!toExists) console.error(`Connection references non-existent CD: ${conn.to}`);
});
```

## Problemas de Interface

### 1. Layout Quebrado

**Sintomas:**
- Elementos sobrepostos
- Responsividade não funciona
- Componentes fora de lugar

**Causas:**
- CSS conflitante
- Tailwind não carregado
- Versões incompatíveis

**Soluções:**
```bash
# Verificar se Tailwind está carregando
# Inspecionar elemento e verificar classes

# Rebuild do CSS
npm run build

# Verificar configuração do Tailwind
cat tailwind.config.ts

# Verificar importação no index.css
cat src/index.css
# Deve conter: @tailwind base; @tailwind components; @tailwind utilities;
```

### 2. Ícones Não Aparecem

**Sintomas:**
- Quadrados vazios no lugar dos ícones
- Componentes sem ícones

**Causas:**
- Lucide React não instalado
- Importações incorretas

**Soluções:**
```bash
# Verificar instalação
npm list lucide-react

# Reinstalar se necessário
npm install lucide-react

# Verificar importações
# ✅ Correto:
import { Package, Truck, MapPin } from 'lucide-react';

# ❌ Incorreto:
import Package from 'lucide-react/Package';
```

### 3. Cores/Tema Incorretos

**Sintomas:**
- Cores não correspondem ao design
- Modo escuro não funciona

**Causas:**
- Configuração CSS incorreta
- shadcn-ui mal configurado

**Soluções:**
```bash
# Verificar configuração de cores
cat src/index.css

# Reconfigurar shadcn se necessário
npx shadcn-ui@latest init

# Verificar componentes
cat src/components/ui/button.tsx
```

## Problemas de Performance

### 1. Dashboard Lento

**Sintomas:**
- Carregamento demorado
- Interface travando
- Atualizações lentas

**Causas:**
- Muitos dados
- Re-renders desnecessários
- Polling muito frequente

**Soluções:**
```typescript
// Otimizar re-renders
import { memo, useMemo } from 'react';

const MetricsCard = memo(({ data }) => {
  const calculations = useMemo(() => {
    return expensiveCalculation(data);
  }, [data]);

  return <Card>{calculations}</Card>;
});

// Reduzir frequência de polling
const { data } = useDataLoader(60000); // 60 segundos em vez de 30
```

### 2. Consumo Alto de Memória

**Sintomas:**
- Navegador lento
- Aba travando
- Avisos de memória

**Causas:**
- Memory leaks
- Componentes não desmontados
- Event listeners não removidos

**Soluções:**
```typescript
// Limpar effects
useEffect(() => {
  const interval = setInterval(() => {
    // código
  }, 1000);

  return () => clearInterval(interval); // ← Importante!
}, []);

// Usar AbortController para fetch
useEffect(() => {
  const controller = new AbortController();
  
  fetch('/api/data', { signal: controller.signal })
    .then(response => response.json())
    .then(data => setData(data));

  return () => controller.abort();
}, []);
```

## Problemas de Deploy

### 1. Build de Produção Falha

**Sintomas:**
```bash
Building for production...
✗ Build failed in 45.23s
```

**Causas:**
- Erros TypeScript em produção
- Variáveis de ambiente ausentes
- Assets não encontrados

**Soluções:**
```bash
# Build com debug
npm run build -- --verbose

# Verificar TypeScript
npx tsc --noEmit

# Verificar variáveis de ambiente
cat .env.production

# Necessário: VITE_* prefix
VITE_API_URL=https://api.example.com
```

### 2. Erro 404 após Deploy

**Sintomas:**
- Página inicial carrega
- Rotas internas retornam 404
- Refresh quebra a aplicação

**Causas:**
- SPA routing não configurado no servidor
- Base path incorreto

**Soluções:**
```nginx
# Nginx - adicionar fallback
location / {
    try_files $uri $uri/ /index.html;
}
```

```json
// Vercel - vercel.json
{
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

```toml
# Netlify - netlify.toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. Assets Não Carregam

**Sintomas:**
- CSS não aplicado
- Imagens quebradas
- JavaScript não executa

**Causas:**
- Base path incorreto
- CORS issues
- CDN mal configurado

**Soluções:**
```typescript
// vite.config.ts - configurar base
export default defineConfig({
  base: '/', // ou '/subdirectory/' se necessário
});
```

```nginx
# Nginx - CORS headers
add_header 'Access-Control-Allow-Origin' '*';
add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
```

## Problemas de Integração

### 1. API Externa Não Responde

**Sintomas:**
- Timeout errors
- CORS errors
- 401/403 errors

**Causas:**
- API indisponível
- Autenticação incorreta
- CORS mal configurado

**Soluções:**
```typescript
// Implementar retry e timeout
const fetchWithRetry = async (url: string, options = {}, retries = 3) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
        ...options.headers
      }
    });

    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (retries > 0 && error.name !== 'AbortError') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWithRetry(url, options, retries - 1);
    }
    
    throw error;
  }
};
```

### 2. WebSocket Desconecta

**Sintomas:**
- Conexão perdida frequentemente
- Dados não atualizam em tempo real

**Causas:**
- Rede instável
- Proxy/firewall bloqueando
- Servidor WebSocket com problemas

**Soluções:**
```typescript
// Auto-reconnect WebSocket
class ReconnectingWebSocket {
  private ws: WebSocket | null = null;
  private reconnectInterval = 5000;
  private maxReconnectAttempts = 10;
  private reconnectAttempts = 0;

  connect(url: string) {
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.reconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect(this.url);
      }, this.reconnectInterval);
    }
  }
}
```

## Ferramentas de Debug

### 1. React Developer Tools

```bash
# Instalar extensão do navegador
# Chrome: https://chrome.google.com/webstore/detail/fmkadmapgofadopljbjfkapdkoienihi
# Firefox: https://addons.mozilla.org/firefox/addon/react-devtools/

# Profiling de performance
# Aba "Profiler" no React DevTools
```

### 2. Network Debugging

```javascript
// Interceptar requisições fetch
const originalFetch = window.fetch;
window.fetch = (...args) => {
  console.log('Fetch called:', args);
  return originalFetch(...args)
    .then(response => {
      console.log('Fetch response:', response);
      return response;
    })
    .catch(error => {
      console.error('Fetch error:', error);
      throw error;
    });
};
```

### 3. Console Debugging

```typescript
// Debug de estado
useEffect(() => {
  console.log('Current state:', { cds, deliveryPoints, selectedCD });
}, [cds, deliveryPoints, selectedCD]);

// Debug de renders
console.log('Component rendered:', Date.now());

// Debug de API calls
const debugFetch = (url: string) => {
  console.time(`Fetch ${url}`);
  return fetch(url)
    .then(response => {
      console.timeEnd(`Fetch ${url}`);
      return response;
    });
};
```

## Quando Buscar Ajuda

### 1. Verificações Antes de Pedir Ajuda

- [ ] Leu toda a documentação relevante
- [ ] Verificou issues similares no GitHub
- [ ] Testou em navegador diferente
- [ ] Verificou logs de erro completos
- [ ] Tentou reproduzir em ambiente limpo

### 2. Como Reportar Problemas

```markdown
## Descrição do Problema
[Descrição clara e concisa]

## Passos para Reproduzir
1. Vá para '...'
2. Clique em '....'
3. Veja o erro

## Comportamento Esperado
[O que deveria acontecer]

## Screenshots
[Se aplicável]

## Ambiente
- OS: [e.g. macOS 12.6]
- Navegador: [e.g. Chrome 108]
- Node.js: [e.g. 18.12.0]
- npm: [e.g. 8.19.2]

## Logs de Erro
```console
[Cole aqui os logs completos]
```

## Arquivos de Configuração
[Cole configurações relevantes]
```

### 3. Recursos de Suporte

- **GitHub Issues**: https://github.com/seskelsen/route-atlas/issues
- **Documentation**: Links para docs específicas
- **Community**: Canais de comunicação da equipe

### 4. Logs Úteis para Suporte

```bash
# Informações do sistema
npm --version
node --version
git --version

# Estado do projeto
npm list --depth=0
npm run build 2>&1 | tee build.log

# Logs do navegador
# F12 > Console > Copy all messages
```