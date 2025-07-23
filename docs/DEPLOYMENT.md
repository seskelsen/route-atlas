# Guia de Deploy - Route Atlas DMS Dashboard

## Visão Geral

Este documento fornece instruções completas para fazer deploy do Route Atlas DMS Dashboard em diferentes ambientes e plataformas.

## Pré-requisitos

### Ferramentas Necessárias
- Node.js 18+ e npm
- Git
- Navegador web moderno

### Verificação do Ambiente

```bash
# Verificar versões
node --version  # v18.0.0 ou superior
npm --version   # 8.0.0 ou superior
git --version   # 2.0.0 ou superior
```

## Preparação para Deploy

### 1. Build de Produção

```bash
# Clone o repositório (se ainda não tiver)
git clone https://github.com/seskelsen/route-atlas.git
cd route-atlas

# Instale dependências
npm install

# Execute o build de produção
npm run build
```

O build criará uma pasta `dist/` com os arquivos otimizados:

```
dist/
├── index.html          # HTML principal
├── assets/
│   ├── index-[hash].js  # JavaScript minificado
│   ├── index-[hash].css # CSS otimizado
│   └── [outros assets]
└── robots.txt
```

### 2. Validação do Build

```bash
# Teste o build localmente
npm run preview

# Abra http://localhost:4173 para verificar
```

### 3. Configuração de Ambiente

Crie arquivo `.env.production`:

```bash
VITE_API_BASE_URL=https://api.routeatlas.com
VITE_REFRESH_INTERVAL=30000
VITE_RETRY_ATTEMPTS=3
VITE_ENABLE_ANALYTICS=true
VITE_ANALYTICS_ID=your-production-analytics-id
```

## Deploy em Plataformas de Hosting

### 1. Vercel (Recomendado)

#### Deploy via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer deploy
vercel

# Seguir as instruções interativas
```

#### Deploy via Git

1. Faça push do código para GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Conecte seu repositório GitHub
4. Configure as variáveis de ambiente
5. Deploy automático a cada push

#### Configuração Vercel

Crie `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_API_BASE_URL": "@vite_api_base_url",
    "VITE_REFRESH_INTERVAL": "@vite_refresh_interval"
  }
}
```

### 2. Netlify

#### Deploy via Drag & Drop

1. Execute `npm run build`
2. Acesse [netlify.com](https://netlify.com)
3. Arraste a pasta `dist/` para o deploy

#### Deploy via Git

1. Conecte repositório no Netlify
2. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Configure variáveis de ambiente

#### Configuração Netlify

Crie `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 3. GitHub Pages

#### Configuração

1. Crie arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
      env:
        VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
    
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

2. Configure variáveis de ambiente em **Settings > Secrets**
3. Ative GitHub Pages em **Settings > Pages**

### 4. AWS S3 + CloudFront

#### Setup S3

```bash
# Instalar AWS CLI
aws configure

# Criar bucket
aws s3 mb s3://route-atlas-dashboard

# Upload dos arquivos
aws s3 sync dist/ s3://route-atlas-dashboard --delete

# Configurar como website
aws s3 website s3://route-atlas-dashboard \
  --index-document index.html \
  --error-document index.html
```

#### CloudFront Distribution

```json
{
  "Origins": [{
    "DomainName": "route-atlas-dashboard.s3-website-us-east-1.amazonaws.com",
    "Id": "S3-route-atlas-dashboard",
    "CustomOriginConfig": {
      "HTTPPort": 80,
      "OriginProtocolPolicy": "http-only"
    }
  }],
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-route-atlas-dashboard",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    }
  },
  "CustomErrorResponses": [{
    "ErrorCode": 404,
    "ResponseCode": 200,
    "ResponsePagePath": "/index.html"
  }]
}
```

## Deploy com Docker

### 1. Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copiar arquivos do build
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuração do nginx
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 2. Configuração Nginx

Crie `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Gzip compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

        # Cache static assets
        location /assets/ {
            expires 1y;
            add_header Cache-Control "public, no-transform, immutable";
        }

        # SPA fallback
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }
}
```

### 3. Build e Deploy

```bash
# Build da imagem
docker build -t route-atlas-dashboard .

# Executar localmente
docker run -p 8080:80 route-atlas-dashboard

# Push para registry
docker tag route-atlas-dashboard your-registry/route-atlas-dashboard:latest
docker push your-registry/route-atlas-dashboard:latest
```

### 4. Docker Compose

Crie `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    
  # Opcional: Reverse proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx-proxy.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
```

## Deploy em Kubernetes

### 1. Deployment YAML

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: route-atlas-dashboard
  namespace: default
spec:
  replicas: 3
  selector:
    matchLabels:
      app: route-atlas-dashboard
  template:
    metadata:
      labels:
        app: route-atlas-dashboard
    spec:
      containers:
      - name: dashboard
        image: your-registry/route-atlas-dashboard:latest
        ports:
        - containerPort: 80
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "64Mi"
            cpu: "50m"
          limits:
            memory: "128Mi"
            cpu: "100m"
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: route-atlas-dashboard-service
spec:
  selector:
    app: route-atlas-dashboard
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: route-atlas-dashboard-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - dashboard.routeatlas.com
    secretName: route-atlas-tls
  rules:
  - host: dashboard.routeatlas.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: route-atlas-dashboard-service
            port:
              number: 80
```

### 2. Deploy no Kubernetes

```bash
# Apply dos manifestos
kubectl apply -f k8s-deployment.yaml

# Verificar status
kubectl get pods -l app=route-atlas-dashboard
kubectl get service route-atlas-dashboard-service
kubectl get ingress route-atlas-dashboard-ingress

# Logs
kubectl logs -l app=route-atlas-dashboard
```

## Configurações de Produção

### 1. Variáveis de Ambiente

```bash
# .env.production
VITE_API_BASE_URL=https://api.routeatlas.com
VITE_REFRESH_INTERVAL=30000
VITE_RETRY_ATTEMPTS=3
VITE_ENABLE_ANALYTICS=true
VITE_ANALYTICS_ID=GA-XXXXX-X
VITE_SENTRY_DSN=https://your-sentry-dsn
```

### 2. Otimizações de Performance

#### Vite Config para Produção

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-accordion', '@radix-ui/react-alert-dialog'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query']
        }
      }
    },
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
```

### 3. Headers de Segurança

```nginx
# Nginx security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https: wss:;" always;
```

## Monitoramento e Analytics

### 1. Health Check Endpoint

Para monitoramento automatizado:

```typescript
// src/pages/Health.tsx
export const Health = () => {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    // Verificar se a aplicação está funcionando
    const checkHealth = async () => {
      try {
        // Teste básico de funcionalidade
        await fetch('/data/cds.json');
        setStatus('healthy');
      } catch (error) {
        setStatus('unhealthy');
      }
    };

    checkHealth();
  }, []);

  return (
    <div>
      <h1>Health Check</h1>
      <p>Status: {status}</p>
      <p>Timestamp: {new Date().toISOString()}</p>
    </div>
  );
};
```

### 2. Error Tracking

```typescript
// Sentry integration
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1,
});

// Error Boundary
const ErrorBoundary = Sentry.withErrorBoundary(App, {
  fallback: ({ error, resetError }) => (
    <div>
      <h2>Algo deu errado</h2>
      <button onClick={resetError}>Tentar novamente</button>
    </div>
  ),
});
```

## SSL/TLS e HTTPS

### 1. Let's Encrypt com Certbot

```bash
# Instalar certbot
sudo apt-get install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d dashboard.routeatlas.com

# Auto-renovação
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 2. Nginx HTTPS Config

```nginx
server {
    listen 443 ssl http2;
    server_name dashboard.routeatlas.com;

    ssl_certificate /etc/letsencrypt/live/dashboard.routeatlas.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dashboard.routeatlas.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;

    # Força HTTPS
    add_header Strict-Transport-Security "max-age=63072000" always;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Redirect HTTP para HTTPS
server {
    listen 80;
    server_name dashboard.routeatlas.com;
    return 301 https://$server_name$request_uri;
}
```

## Backup e Recuperação

### 1. Backup de Dados

```bash
#!/bin/bash
# backup-script.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/route-atlas"

# Criar diretório de backup
mkdir -p $BACKUP_DIR

# Backup dos dados JSON
cp -r /app/src/data/ $BACKUP_DIR/data_$DATE/

# Backup da configuração
cp /app/.env.production $BACKUP_DIR/config_$DATE.env

# Compactar
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz $BACKUP_DIR/*_$DATE*

# Limpeza (manter últimos 30 dias)
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +30 -delete
```

### 2. Recuperação de Desastre

```bash
#!/bin/bash
# restore-script.sh

BACKUP_FILE=$1
RESTORE_DIR="/app"

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file.tar.gz>"
    exit 1
fi

# Extrair backup
tar -xzf $BACKUP_FILE -C /tmp/

# Restaurar dados
cp -r /tmp/data_*/* $RESTORE_DIR/src/data/

# Restaurar configuração
cp /tmp/config_*.env $RESTORE_DIR/.env.production

# Rebuild e restart
cd $RESTORE_DIR
npm run build
docker-compose restart
```

## Troubleshooting de Deploy

### Problemas Comuns

#### 1. Build Falha

```bash
# Limpar cache e dependências
rm -rf node_modules package-lock.json
npm install

# Verificar versão do Node
node --version

# Build com logs detalhados
npm run build -- --verbose
```

#### 2. Erro 404 em Rotas

Adicione redirecionamento para SPA:

```nginx
# Nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

```json
// Vercel
{
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

#### 3. Assets Não Carregam

Verifique paths relativos:

```typescript
// vite.config.ts
export default defineConfig({
  base: '/', // ou '/subdirectory/' se em subdiretório
});
```

#### 4. Environment Variables Não Funcionam

Certifique-se que começam com `VITE_`:

```bash
# ✅ Correto
VITE_API_URL=https://api.example.com

# ❌ Incorreto
API_URL=https://api.example.com
```

### Logs e Debug

```bash
# Verificar logs do container
docker logs route-atlas-dashboard

# Nginx logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log

# Verificar health check
curl -I https://dashboard.routeatlas.com/
```