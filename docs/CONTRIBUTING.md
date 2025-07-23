# Guia de Contribuição - Route Atlas DMS Dashboard

## Bem-vindo(a)!

Obrigado pelo interesse em contribuir com o Route Atlas DMS Dashboard! Este documento fornece diretrizes para contribuições ao projeto.

## Código de Conduta

### Nossa Promessa

Comprometemo-nos a tornar a participação em nosso projeto uma experiência livre de assédio para todos, independentemente de idade, tamanho corporal, deficiência, etnia, identidade e expressão de gênero, nível de experiência, nacionalidade, aparência pessoal, raça, religião ou identidade e orientação sexual.

### Padrões Esperados

**Comportamentos Positivos:**
- Usar linguagem acolhedora e inclusiva
- Respeitar diferentes pontos de vista e experiências
- Aceitar críticas construtivas com elegância
- Focar no que é melhor para a comunidade
- Mostrar empatia com outros membros da comunidade

**Comportamentos Inaceitáveis:**
- Uso de linguagem ou imagens sexualizadas
- Comentários trolling, insultuosos ou depreciativos
- Assédio público ou privado
- Publicar informações privadas de outros sem permissão
- Outras condutas consideradas inadequadas em ambiente profissional

## Como Contribuir

### 1. Reportar Bugs

#### Antes de Reportar
- Verifique se o bug já foi reportado nas [Issues](https://github.com/seskelsen/route-atlas/issues)
- Certifique-se de que está usando a versão mais recente
- Verifique se o problema persiste em ambiente limpo

#### Template de Bug Report

```markdown
**Descrição do Bug**
Descrição clara e concisa do problema.

**Passos para Reproduzir**
1. Vá para '...'
2. Clique em '....'
3. Veja o erro

**Comportamento Esperado**
O que você esperava que acontecesse.

**Screenshots**
Se aplicável, adicione screenshots para ajudar a explicar o problema.

**Ambiente:**
 - OS: [e.g. macOS, Windows, Linux]
 - Navegador: [e.g. Chrome, Safari, Firefox]
 - Versão: [e.g. 108.0.0]
 - Node.js: [e.g. 18.12.0]

**Informações Adicionais**
Qualquer outra informação sobre o problema.
```

### 2. Sugerir Melhorias

#### Template de Feature Request

```markdown
**A melhoria está relacionada a um problema? Descreva.**
Descrição clara e concisa do problema.

**Descreva a solução que você gostaria**
Descrição clara e concisa do que você quer que aconteça.

**Descreva alternativas consideradas**
Descrição clara e concisa de qualquer solução alternativa considerada.

**Informações Adicionais**
Qualquer outra informação ou screenshots sobre a feature request.
```

### 3. Contribuir com Código

#### Processo de Desenvolvimento

1. **Fork o Repositório**
   ```bash
   # Via GitHub UI ou
   gh repo fork seskelsen/route-atlas --clone
   ```

2. **Criar Branch de Feature**
   ```bash
   git checkout -b feature/nova-funcionalidade
   # ou
   git checkout -b bugfix/corrigir-problema
   # ou
   git checkout -b docs/atualizar-documentacao
   ```

3. **Configurar Ambiente de Desenvolvimento**
   ```bash
   cd route-atlas
   npm install
   npm run dev
   ```

4. **Fazer Alterações**
   - Siga as [convenções de código](#convenções-de-código)
   - Adicione testes se aplicável
   - Atualize documentação se necessário

5. **Testar Alterações**
   ```bash
   # Linting
   npm run lint
   
   # Build
   npm run build
   
   # Testes (se implementados)
   npm test
   ```

6. **Commit das Alterações**
   ```bash
   git add .
   git commit -m "feat: adicionar nova funcionalidade"
   ```

7. **Push e Pull Request**
   ```bash
   git push origin feature/nova-funcionalidade
   # Criar PR via GitHub UI
   ```

## Convenções de Código

### 1. Estilo de Código

#### TypeScript/JavaScript
```typescript
// ✅ Bom
interface CDData {
  id: string;
  name: string;
  location: {
    x: number;
    y: number;
  };
  status: 'active' | 'inactive';
}

const processCDData = (data: CDData[]): ProcessedData => {
  return data.map(cd => ({
    ...cd,
    utilization: calculateUtilization(cd)
  }));
};

// ❌ Evitar
var cdData = [];
function processData(data) {
  return data.map(function(cd) {
    return {
      id: cd.id,
      name: cd.name,
      utilization: cd.currentLoad / cd.capacity
    };
  });
}
```

#### React Components
```typescript
// ✅ Bom - Componente funcional com TypeScript
interface MetricsCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'stable';
}

export const MetricsCard: React.FC<MetricsCardProps> = ({ 
  title, 
  value, 
  icon: Icon,
  trend = 'stable' 
}) => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          {title}
        </h3>
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </Card>
  );
};

// ❌ Evitar - Componente sem tipos
const MetricsCard = ({ title, value, icon }) => {
  return (
    <div>
      <h3>{title}</h3>
      <div>{value}</div>
    </div>
  );
};
```

#### CSS/Tailwind
```typescript
// ✅ Bom - Classes organizadas e responsivas
<div className="
  flex items-center justify-between 
  p-4 rounded-lg border 
  bg-card hover:bg-accent/50 
  transition-colors duration-200
  md:p-6 lg:p-8
">

// ❌ Evitar - Classes desorganizadas
<div className="flex bg-card p-4 items-center border rounded-lg justify-between hover:bg-accent/50 transition-colors duration-200">
```

### 2. Estrutura de Arquivos

```
src/
├── components/
│   ├── ui/                 # Componentes base (shadcn)
│   ├── dashboard/          # Componentes específicos do dashboard
│   │   ├── MetricsCard.tsx
│   │   ├── CDPanel.tsx
│   │   └── DeliveryPanel.tsx
│   └── common/             # Componentes reutilizáveis
├── hooks/                  # Custom hooks
│   ├── useDataLoader.ts
│   └── useWebSocket.ts
├── lib/                    # Utilitários e helpers
│   ├── utils.ts
│   ├── constants.ts
│   └── api.ts
├── types/                  # Definições de tipos TypeScript
│   ├── data.ts
│   └── api.ts
└── data/                   # Arquivos de dados JSON
```

### 3. Nomenclatura

#### Componentes
```typescript
// ✅ PascalCase para componentes
export const DMSDashboard = () => { };
export const RouteVisualization = () => { };
export const MetricsCard = () => { };

// ✅ Nomes descritivos
export const DeliveryStatusPanel = () => { };
export const CDCapacityIndicator = () => { };
```

#### Hooks
```typescript
// ✅ Prefixo 'use' + PascalCase
export const useDataLoader = () => { };
export const useWebSocket = () => { };
export const useLocalStorage = () => { };
```

#### Funções e Variáveis
```typescript
// ✅ camelCase descritivo
const calculateUtilizationRate = (load: number, capacity: number) => { };
const formatDeliveryDate = (date: Date) => { };

const totalDeliveries = deliveryPoints.length;
const completedDeliveries = deliveryPoints.filter(/* ... */);
```

#### Arquivos
```bash
# ✅ Componentes: PascalCase
DMSDashboard.tsx
RouteVisualization.tsx

# ✅ Hooks: camelCase
useDataLoader.ts
useWebSocket.ts

# ✅ Utilitários: camelCase
dataUtils.ts
apiClient.ts

# ✅ Tipos: camelCase
dataTypes.ts
apiTypes.ts
```

### 4. Convenções de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/) para mensagens de commit padronizadas:

```bash
# Formato
<tipo>[escopo opcional]: <descrição>

[corpo opcional]

[rodapé opcional]
```

#### Tipos de Commit

- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Mudanças na documentação
- **style**: Mudanças que não afetam o código (espaços, formatação, etc.)
- **refactor**: Refatoração de código que não adiciona funcionalidade nem corrige bugs
- **perf**: Mudanças que melhoram a performance
- **test**: Adicionar ou corrigir testes
- **chore**: Mudanças em ferramentas, configurações, etc.

#### Exemplos

```bash
# Funcionalidade
feat: adicionar filtro por status de entrega
feat(dashboard): implementar seleção múltipla de CDs

# Correção
fix: corrigir cálculo de taxa de utilização
fix(api): resolver erro de timeout em requisições

# Documentação
docs: atualizar guia de instalação
docs(api): adicionar exemplos de uso da API

# Refatoração
refactor: extrair lógica de cálculo para hook separado
refactor(components): simplificar estrutura do DMSDashboard

# Performance
perf: otimizar re-renders do RouteVisualization
perf: implementar lazy loading para componentes

# Configuração
chore: atualizar dependências do projeto
chore(ci): adicionar workflow de deploy automático
```

## Diretrizes de Pull Request

### 1. Checklist do PR

Antes de submeter um Pull Request, verifique:

- [ ] Código segue as convenções estabelecidas
- [ ] Alterações foram testadas localmente
- [ ] Build passa sem erros (`npm run build`)
- [ ] Linting passa sem erros (`npm run lint`)
- [ ] Documentação foi atualizada se necessário
- [ ] Testes foram adicionados/atualizados se aplicável
- [ ] Commits seguem convenção de mensagens
- [ ] PR tem descrição clara do que foi alterado

### 2. Template de Pull Request

```markdown
## Descrição

Resumo claro das mudanças realizadas.

## Tipo de Mudança

- [ ] Bug fix (mudança que corrige um problema)
- [ ] Nova funcionalidade (mudança que adiciona funcionalidade)
- [ ] Breaking change (mudança que pode quebrar funcionalidade existente)
- [ ] Documentação (mudança apenas na documentação)

## Como Foi Testado

Descreva os testes realizados para verificar as mudanças.

- [ ] Teste A
- [ ] Teste B

## Screenshots (se aplicável)

Adicione screenshots para mudanças na UI.

## Checklist

- [ ] Meu código segue as diretrizes de estilo do projeto
- [ ] Realizei self-review do meu próprio código
- [ ] Comentei meu código em partes difíceis de entender
- [ ] Fiz mudanças correspondentes na documentação
- [ ] Minhas mudanças não geram novos warnings
- [ ] Adicionei testes que provam que minha correção/funcionalidade funciona
- [ ] Testes novos e existentes passam com minhas mudanças
```

### 3. Processo de Review

1. **Revisão Automática**
   - Linting e formatação
   - Build de produção
   - Testes automatizados

2. **Revisão Manual**
   - Qualidade do código
   - Aderência às convenções
   - Impacto nas funcionalidades existentes
   - Performance

3. **Aprovação e Merge**
   - Pelo menos 1 aprovação de maintainer
   - Todos os checks automáticos passando
   - Conflitos resolvidos

## Configuração do Ambiente de Desenvolvimento

### 1. Ferramentas Recomendadas

#### Editor
- **VS Code** com extensões:
  - ESLint
  - Prettier
  - TypeScript Hero
  - Tailwind CSS IntelliSense
  - Auto Rename Tag

#### Configuração VS Code
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  }
}
```

### 2. Hooks de Git

Configurar hooks para qualidade:

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
npm run build
```

### 3. Configuração de Desenvolvimento

```bash
# Instalar dependências de desenvolvimento
npm install --save-dev \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  prettier \
  eslint-plugin-react \
  eslint-plugin-react-hooks

# Configurar git hooks
npx husky install
npx husky add .husky/pre-commit "npm run lint"
```

## Diretrizes de Testes

### 1. Estratégia de Testes

```typescript
// Testes de componentes
import { render, screen, fireEvent } from '@testing-library/react';
import { MetricsCard } from '@/components/MetricsCard';

describe('MetricsCard', () => {
  it('should render title and value correctly', () => {
    render(
      <MetricsCard 
        title="Total Entregas" 
        value={100} 
        icon={Package}
      />
    );

    expect(screen.getByText('Total Entregas')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });
});

// Testes de hooks
import { renderHook, waitFor } from '@testing-library/react';
import { useDataLoader } from '@/hooks/useDataLoader';

describe('useDataLoader', () => {
  it('should load data successfully', async () => {
    const { result } = renderHook(() => useDataLoader(1000));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.cds).toBeDefined();
    });
  });
});
```

### 2. Cobertura de Testes

Objetivos de cobertura:
- **Componentes críticos**: 90%+
- **Hooks e utilitários**: 95%+
- **Integração**: 80%+

## Performance e Otimização

### 1. Diretrizes de Performance

```typescript
// ✅ Memoização adequada
const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() => {
    return heavyProcessing(data);
  }, [data]);

  return <div>{processedData}</div>;
});

// ✅ Lazy loading
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// ✅ Cleanup de effects
useEffect(() => {
  const interval = setInterval(() => {
    // código
  }, 1000);

  return () => clearInterval(interval);
}, []);
```

### 2. Bundle Size

- Monitorar tamanho do bundle após mudanças
- Usar tree-shaking quando possível
- Lazy load componentes pesados

## Segurança

### 1. Diretrizes de Segurança

```typescript
// ✅ Sanitização de dados
const sanitizeInput = (input: string): string => {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

// ✅ Validação de dados
const validateCDData = (data: unknown): data is CDData => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data &&
    'location' in data
  );
};

// ✅ Headers de segurança
const secureHeaders = {
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block'
};
```

## Releases e Versionamento

### 1. Semantic Versioning

Seguimos [SemVer](https://semver.org/):

- **MAJOR**: Mudanças incompatíveis na API
- **MINOR**: Funcionalidades adicionadas de forma compatível
- **PATCH**: Correções compatíveis

### 2. Processo de Release

1. **Preparação**
   ```bash
   git checkout main
   git pull origin main
   npm run build
   npm run test
   ```

2. **Versionamento**
   ```bash
   npm version patch  # ou minor/major
   ```

3. **Documentação**
   - Atualizar CHANGELOG.md
   - Documentar breaking changes
   - Criar release notes

4. **Deploy**
   ```bash
   git push origin main --tags
   # CI/CD automaticamente faz deploy
   ```

## Recursos e Comunidade

### 1. Documentação

- [README Principal](../README.md)
- [Guia do Usuário](./USER_GUIDE.md)
- [Documentação da API](./API.md)
- [Arquitetura](./ARCHITECTURE.md)

### 2. Canais de Comunicação

- **Issues**: Para bugs e feature requests
- **Discussions**: Para perguntas e discussões gerais
- **Pull Requests**: Para contribuições de código

### 3. Mantainers

- [@seskelsen](https://github.com/seskelsen) - Maintainer Principal

## Agradecimentos

Obrigado por contribuir com o Route Atlas! Sua ajuda é fundamental para tornar este projeto melhor para toda a comunidade.

---

*Este documento é um trabalho em progresso. Sugestões de melhoria são sempre bem-vindas!*