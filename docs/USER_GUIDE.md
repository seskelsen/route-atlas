# Guia do Usuário - Route Atlas DMS Dashboard

## Visão Geral

O Route Atlas é um sistema de gerenciamento de distribuição que oferece monitoramento em tempo real de centros de distribuição, entregas e rotas logísticas.

## Acesso ao Sistema

1. Abra o navegador web
2. Navegue para a URL do sistema (ex: `http://localhost:8080` para desenvolvimento)
3. O dashboard será carregado automaticamente

## Interface Principal

### Header do Dashboard

No topo da aplicação você encontrará:

- **Título do Sistema**: "DMS Dashboard"
- **Indicador de Status**: 
  - "JSON Auto-sync" - Mostra que o sistema está sincronizando dados automaticamente
  - "Online" - Confirma conectividade do sistema
- **Botões de Ação**:
  - "Atualizar" - Força atualização manual dos dados
  - "Configurações" - Acesso a configurações do sistema

### Métricas Principais

O dashboard exibe 4 cards principais com métricas em tempo real:

#### 1. Total de Entregas
- **Número**: Quantidade total de entregas no sistema
- **Porcentagem**: Taxa de entregas concluídas

#### 2. Entregues
- **Número**: Quantidade de entregas já concluídas
- **Taxa de Sucesso**: Porcentagem de entregas bem-sucedidas

#### 3. Em Trânsito
- **Número**: Entregas atualmente em movimento
- **Status**: "Movimentação ativa" indica operações em andamento

#### 4. Capacidade dos CDs
- **Porcentagem**: Taxa de utilização dos Centros de Distribuição
- **Detalhes**: Carga atual vs. capacidade total (unidades)

## Visualização de Rotas

### Área Principal de Visualização

A seção central mostra um mapa interativo com:

- **Centros de Distribuição (CDs)**: Representados por círculos maiores
- **Pontos de Entrega**: Círculos menores conectados aos CDs
- **Conexões**: Linhas que mostram as rotas entre CDs e pontos de entrega

### Interação com o Mapa

- **Clique em um CD**: Seleciona o centro de distribuição e filtra informações relacionadas
- **Navegação**: Use o mouse para explorar o mapa
- **Indicadores Visuais**: Cores diferentes representam status variados

## Painel Lateral

### Centros de Distribuição

Localizado no lado direito, este painel mostra:

#### Informações por CD:
- **Nome**: Identificação do centro
- **Status**: Ativo/Inativo (badge colorido)
- **Capacidade**: Carga atual / Capacidade máxima
- **Barra de Progresso**: Visualização gráfica da utilização
- **Porcentagem**: Taxa de utilização calculada

#### Interação:
- **Clique em um CD**: Seleciona/deseleciona para filtragem
- **Visual**: CD selecionado fica destacado com borda azul

### Status das Entregas

Painel inferior direito com lista de entregas:

#### Informações por Entrega:
- **Nome**: Identificação do ponto de entrega
- **Status**: 
  - 🕒 Pendente
  - 🚛 Em trânsito  
  - ✅ Entregue
- **Prioridade**:
  - Baixa (cinza)
  - Média (amarelo)
  - Alta (vermelho)

#### Filtragem:
- Quando um CD está selecionado, apenas suas entregas são exibidas
- Lista é rolável para grandes volumes de dados

## Estados do Sistema

### Carregamento
- Tela com spinner e mensagem "Carregando dados do sistema..."
- Indica que os dados estão sendo sincronizados

### Erro de Conexão
- Ícone de WiFi desconectado
- Mensagem de erro específica
- Botão "Tentar novamente" para recarregar

### Operação Normal
- Todas as métricas visíveis e atualizadas
- Indicador "Online" no header
- Dados sincronizando automaticamente a cada 30 segundos

## Atualizações Automáticas

O sistema atualiza automaticamente:

- **Frequência**: A cada 30 segundos
- **Dados Monitorados**:
  - Status das entregas
  - Capacidade dos CDs
  - Métricas gerais
  - Conexões de rotas

## Dicas de Uso

### Monitoramento Eficiente
1. **Use a visualização geral** para ter uma visão panorâmica
2. **Selecione CDs específicos** para análise detalhada
3. **Monitore as métricas principais** para KPIs importantes
4. **Observe as cores dos status** para identificação rápida

### Resolução de Problemas
1. **Se dados não carregam**: Clique em "Atualizar"
2. **Para análise específica**: Selecione um CD no painel lateral
3. **Se sistema está lento**: Verifique conexão de internet

### Interpretação de Dados
- **Capacidade acima de 90%**: CD próximo do limite
- **Muitas entregas pendentes**: Possível gargalo operacional
- **Status "Em trânsito"**: Operações em andamento normal

## Glossário

- **CD**: Centro de Distribuição
- **DMS**: Distribution Management System (Sistema de Gerenciamento de Distribuição)
- **Last Mile**: Última etapa da entrega ao cliente final
- **Carga Atual**: Quantidade de itens/pedidos atualmente no CD
- **Capacidade**: Limite máximo de itens que o CD pode processar
- **Taxa de Utilização**: Porcentagem da capacidade em uso