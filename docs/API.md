# API e Integração - Route Atlas DMS Dashboard

## Visão Geral

O Route Atlas utiliza um sistema baseado em arquivos JSON para gerenciar dados de distribuição. Este documento descreve como integrar com o sistema e customizar os dados.

## Estrutura de Dados

### Localização dos Arquivos

Os dados são armazenados em arquivos JSON na pasta `src/data/`:

```
src/data/
├── cds.json              # Centros de Distribuição
├── delivery-points.json  # Pontos de Entrega
├── cd-connections.json   # Conexões entre CDs
└── README.md            # Documentação dos dados
```

## Esquemas de Dados

### 1. Centros de Distribuição (`cds.json`)

#### Estrutura do Objeto

```json
{
  "id": "string",           // Identificador único
  "name": "string",         // Nome do centro
  "location": {             // Coordenadas no mapa
    "x": number,            // Posição X (0-600)
    "y": number             // Posição Y (0-500)
  },
  "status": "string",       // "active" | "inactive"
  "capacity": number,       // Capacidade máxima
  "currentLoad": number     // Carga atual
}
```

#### Exemplo

```json
[
  {
    "id": "cd-001",
    "name": "CD Recife",
    "location": { "x": 300, "y": 250 },
    "status": "active",
    "capacity": 1000,
    "currentLoad": 750
  }
]
```

#### Validações e Sincronização

- O sistema sempre prioriza os dados dos arquivos JSON como fonte de verdade.
- Se a estrutura dos dados JSON mudar (ex: novo CD adicionado), o localStorage será automaticamente sincronizado para refletir as alterações.
- Personalizações feitas pelo usuário (ex: arrastar CDs) são mantidas enquanto a estrutura dos dados não muda.

- `id`: Deve ser único entre todos os CDs
- `location.x`: Entre 0 e 600 (largura do SVG)
- `location.y`: Entre 0 e 500 (altura do SVG)
- `status`: Apenas "active" ou "inactive"
- `capacity`: Número positivo
- `currentLoad`: Não pode exceder `capacity`

### 2. Pontos de Entrega (`delivery-points.json`)

#### Estrutura do Objeto

```json
{
  "id": "string",           // Identificador único
  "name": "string",         // Nome do ponto
  "location": {             // Coordenadas no mapa
    "x": number,            // Posição X (0-600)
    "y": number             // Posição Y (0-500)
  },
  "status": "string",       // "pending" | "in_transit" | "delivered"
  "assignedCD": "string",   // ID do CD responsável
  "priority": "string"      // "low" | "medium" | "high"
}
```

#### Exemplo

```json
[
  {
    "id": "dp-001",
    "name": "Entrega Boa Viagem",
    "location": { "x": 320, "y": 180 },
    "status": "delivered",
    "assignedCD": "cd-001",
    "priority": "high"
  }
]
```

#### Validações

- `id`: Deve ser único entre todos os pontos
- `status`: "pending", "in_transit" ou "delivered"
- `assignedCD`: Deve corresponder a um CD existente
- `priority`: "low", "medium" ou "high"

### 3. Conexões entre CDs (`cd-connections.json`)

#### Estrutura do Objeto

```json
{
  "from": "string",         // ID do CD origem
  "to": "string",           // ID do CD destino
  "status": "string"        // "active" | "inactive"
}
```

#### Exemplo

```json
[
  {
    "from": "cd-001",
    "to": "cd-002",
    "status": "active"
  }
]
```

#### Validações

- `from` e `to`: Devem corresponder a CDs existentes
- `from` ≠ `to`: CD não pode conectar a si mesmo
- `status`: "active" ou "inactive"

## Sistema de Carregamento

### Auto-sync

O sistema monitora automaticamente os arquivos JSON:

- **Frequência**: A cada 30 segundos (configurável)
- **Hook**: `useDataLoader` em `src/hooks/useDataLoader.ts`
- **Método**: Fetch API para leitura dos arquivos

### Configuração do Interval

Para alterar a frequência de atualização:

```typescript
// Em DMSDashboard.tsx
const { cds, deliveryPoints, cdConnections, isLoading, error } = 
  useDataLoader(30000); // 30 segundos (padrão)
```

## Integração com APIs Externas

### Substituindo Arquivos JSON por APIs

Para integrar com sistemas externos, modifique o hook `useDataLoader`:

```typescript
// src/hooks/useDataLoader.ts
import { useQuery } from '@tanstack/react-query';

export const useDataLoader = (refetchInterval: number) => {
  const { data: cds } = useQuery({
    queryKey: ['cds'],
    queryFn: () => fetch('/api/cds').then(res => res.json()),
    refetchInterval
  });

  const { data: deliveryPoints } = useQuery({
    queryKey: ['delivery-points'],
    queryFn: () => fetch('/api/delivery-points').then(res => res.json()),
    refetchInterval
  });

  const { data: cdConnections } = useQuery({
    queryKey: ['cd-connections'],
    queryFn: () => fetch('/api/cd-connections').then(res => res.json()),
    refetchInterval
  });

  return { cds, deliveryPoints, cdConnections };
};
```

### Endpoints de API Sugeridos

#### Centros de Distribuição
```
GET /api/cds
POST /api/cds
PUT /api/cds/:id
DELETE /api/cds/:id
```

#### Pontos de Entrega
```
GET /api/delivery-points
POST /api/delivery-points
PUT /api/delivery-points/:id
DELETE /api/delivery-points/:id
```

#### Conexões
```
GET /api/cd-connections
POST /api/cd-connections
PUT /api/cd-connections/:id
DELETE /api/cd-connections/:id
```

## Formato de Resposta da API

### Sucesso

```json
{
  "success": true,
  "data": [...],
  "timestamp": "2024-01-20T10:30:00Z"
}
```

### Erro

```json
{
  "success": false,
  "error": "Descrição do erro",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-20T10:30:00Z"
}
```

## Validação de Dados

### Client-side

O sistema inclui validações básicas:

```typescript
// Exemplo de validação de CD
const validateCD = (cd: CD): boolean => {
  return !!(
    cd.id &&
    cd.name &&
    cd.location &&
    cd.location.x >= 0 && cd.location.x <= 600 &&
    cd.location.y >= 0 && cd.location.y <= 500 &&
    ['active', 'inactive'].includes(cd.status) &&
    cd.capacity > 0 &&
    cd.currentLoad >= 0 &&
    cd.currentLoad <= cd.capacity
  );
};
```

### Server-side (Recomendado)

Para APIs, implemente validação robusta:

```javascript
// Exemplo com Joi (Node.js)
const cdSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  location: Joi.object({
    x: Joi.number().min(0).max(600).required(),
    y: Joi.number().min(0).max(500).required()
  }).required(),
  status: Joi.string().valid('active', 'inactive').required(),
  capacity: Joi.number().positive().required(),
  currentLoad: Joi.number().min(0).required()
});
```

## Tratamento de Erros

### Estados de Erro

O sistema trata diferentes tipos de erro:

1. **Falha de Carregamento**: Arquivo não encontrado
2. **JSON Inválido**: Formato de dados incorreto
3. **Dados Inconsistentes**: Referências quebradas
4. **Timeout de Rede**: Conexão lenta/instável

### Interface de Erro

Quando erros ocorrem, o usuário vê:

- Ícone de conexão offline
- Mensagem específica do erro
- Botão "Tentar novamente"

## Exemplos de Integração

### WebSocket (Tempo Real)

```typescript
// Hook para WebSocket
export const useWebSocketData = () => {
  const [data, setData] = useState({});
  
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/realtime');
    
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setData(prevData => ({ ...prevData, ...update }));
    };
    
    return () => ws.close();
  }, []);
  
  return data;
};
```

### REST API com Autenticação

```typescript
// API client com auth
const apiClient = {
  async get(endpoint: string) {
    const response = await fetch(`/api${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  }
};
```

## Considerações de Performance

### Otimizações

1. **Caching**: Use React Query para cache inteligente
2. **Debouncing**: Evite muitas atualizações simultâneas
3. **Paginação**: Para grandes volumes de dados
4. **Compressão**: Use gzip/brotli no servidor

### Limites Recomendados

- **CDs**: Máximo 50 centros por arquivo
- **Pontos de Entrega**: Máximo 1000 por arquivo
- **Conexões**: Máximo 500 conexões simultâneas

## Monitoramento

### Métricas Importantes

- Taxa de sucesso das requisições API
- Tempo de resposta médio
- Frequência de erros de validação
- Usage de cache

### Logs Sugeridos

```json
{
  "timestamp": "2024-01-20T10:30:00Z",
  "event": "data_load",
  "source": "api",
  "duration_ms": 234,
  "records_count": 15,
  "success": true
}
```