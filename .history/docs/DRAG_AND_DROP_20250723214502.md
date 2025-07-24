# Funcionalidade Drag and Drop - Route Atlas

## 📋 Visão Geral

A funcionalidade de **Drag and Drop** permite reorganizar manualmente os elementos na visualização do dashboard, proporcionando uma experiência mais interativa e personalizável para o usuário.

## ✨ Funcionalidades Implementadas

### 🎯 Elementos Arrastáveis
- **Centros de Distribuição (CDs)**: Círculos azuis que podem ser arrastados
- **Pontos de Entrega**: Triângulos que representam destinos de last mile

### 🖱️ Interações Disponíveis

#### Arrastar Elementos
1. **Clique e segure** em qualquer CD ou ponto de entrega
2. **Arraste** para a nova posição desejada
3. **Solte** para fixar na nova localização
4. As **rotas se atualizam automaticamente** para refletir as novas posições

#### Feedback Visual
- **Cursor muda** para indicar elemento arrastável (`grab` → `grabbing`)
- **Elementos aumentam de tamanho** durante o drag
- **Rotas se redesenham** em tempo real
- **Indicador visual** mostra quando está arrastando

### 💾 Persistência de Dados

#### Salvamento Automático
- Posições são salvas automaticamente no **localStorage**
- **Indicador visual** mostra alterações não salvas
- **Notificação** confirma o salvamento

#### Controles de Posição
- **Botão "Resetar Posições"**: Volta às posições originais dos arquivos JSON
- **Botão "Atualizar"**: Recarrega dados do servidor
- **Indicador de status**: Mostra se há alterações pendentes

## 🛠️ Implementação Técnica

### Componentes Modificados

#### `RouteVisualization.tsx`
```typescript
// Novas props adicionadas
interface RouteVisualizationProps {
  // ... props existentes
  onUpdateLocations?: (cds: CDData[], deliveryPoints: DeliveryPoint[]) => void;
}

// Estados de drag implementados
interface DragState {
  isDragging: boolean;
  elementType: 'cd' | 'delivery' | null;
  elementId: string | null;
  startPosition: { x: number; y: number };
  offset: { x: number; y: number };
}
```

#### `DMSDashboard.tsx`
```typescript
// Hook personalizado para salvamento
const { savePositions, resetPositions } = usePositionSaver();

// Controle de estado
const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
```

### Hook Customizado: `usePositionSaver`

```typescript
export const usePositionSaver = () => {
  const savePositions = useCallback(async (cds, deliveryPoints) => {
    // Salva no localStorage para desenvolvimento
    localStorage.setItem('route-atlas-cds', JSON.stringify(cds));
    localStorage.setItem('route-atlas-delivery-points', JSON.stringify(deliveryPoints));
  }, []);

  // Outras funções: loadSavedPositions, resetPositions
};
```

## 🎨 Experiência do Usuário

### Indicadores Visuais
1. **Legenda atualizada**: Indica que elementos são arrastáveis
2. **Cursor dinâmico**: Muda de `grab` para `grabbing`
3. **Feedback em tempo real**: Rotas se atualizam durante o drag
4. **Status de salvamento**: Indicador visual de alterações pendentes

### Responsividade
- **Coordenadas normalizadas**: Funciona em diferentes tamanhos de tela
- **Limites de área**: Elementos não podem ser arrastados para fora da visualização
- **Smooth transitions**: Animações suaves durante o movimento

## 🔧 Configuração e Uso

### Para Desenvolvimento
1. As posições são salvas no **localStorage** do navegador
2. Use **"Resetar Posições"** para voltar aos dados originais
3. **Limpe o localStorage** para resetar completamente

### Para Produção
Modifique o `usePositionSaver` para integrar com sua API:

```typescript
// Exemplo de integração com API
const savePositions = async (cds, deliveryPoints) => {
  await fetch('/api/positions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cds, deliveryPoints })
  });
};
```

## 🚀 Benefícios

### Para Usuários
- **Personalização**: Organizar visualização conforme preferência
- **Melhor análise**: Posicionar elementos para análise mais clara
- **Experiência interativa**: Interface mais engajante

### Para o Sistema
- **Flexibilidade**: Adaptação a diferentes cenários logísticos
- **Persistência**: Manter preferências do usuário
- **Escalabilidade**: Fácil extensão para novos tipos de elementos

## 📱 Compatibilidade

- ✅ **Desktop**: Totalmente suportado
- ✅ **Tablet**: Suporte touch
- ⚠️ **Mobile**: Limitado (recomendado usar em telas maiores)

## 🔮 Melhorias Futuras

1. **Snap to Grid**: Alinhar elementos automaticamente
2. **Múltipla seleção**: Arrastar vários elementos simultaneamente
3. **Histórico de mudanças**: Desfazer/refazer alterações
4. **Templates**: Salvar e carregar layouts predefinidos
5. **Colaboração**: Sincronizar mudanças entre usuários

---

Esta funcionalidade transforma o Route Atlas de uma visualização estática em uma ferramenta interativa e personalizável, melhorando significativamente a experiência do usuário! 🎯
