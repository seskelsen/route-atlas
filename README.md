# Route Atlas - DMS Dashboard

Uma aplicação moderna de gerenciamento de distribuição em tempo real, desenvolvida com React, TypeScript e shadcn-ui.

## 📋 Visão Geral

O Route Atlas é um Dashboard de Sistema de Gerenciamento de Distribuição (DMS) que oferece visualização em tempo real de:

- **Centros de Distribuição (CDs)**: Monitoramento de capacidade, carga atual e status
- **Pontos de Entrega**: Rastreamento de status de entregas (pendente, em trânsito, entregue)
- **Rotas**: Visualização interativa de conexões entre CDs
- **Métricas**: Taxa de utilização, entregas concluídas e indicadores de performance

## 🚀 Tecnologias

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn-ui, Radix UI
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Data Management**: React Query (TanStack Query)
- **Routing**: React Router DOM

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ e npm (recomendado: [instale com nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Passos de Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seskelsen/route-atlas.git

# 2. Navegue para o diretório do projeto
cd route-atlas

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

O aplicativo estará disponível em `http://localhost:8080`

## 🛠 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Build para produção
npm run build:dev    # Build em modo desenvolvimento

# Linting
npm run lint         # Executa ESLint

# Preview
npm run preview      # Preview do build de produção
```

## 📊 Estrutura de Dados

O sistema utiliza arquivos JSON para armazenar dados que são carregados automaticamente:

- `src/data/cds.json` - Centros de Distribuição
- `src/data/delivery-points.json` - Pontos de Entrega
- `src/data/cd-connections.json` - Conexões entre CDs

### Atualização Automática

O sistema monitora os arquivos JSON automaticamente a cada 30 segundos e atualiza a visualização em tempo real.

## 🎯 Funcionalidades

### Dashboard Principal
- **Métricas em Tempo Real**: Total de entregas, entregues, em trânsito e capacidade dos CDs
- **Visualização Interativa**: Mapa SVG com CDs e pontos de entrega
- **Seleção de CD**: Clique em um CD para filtrar informações
- **Status das Entregas**: Lista detalhada com status e prioridades

### Centros de Distribuição
- Monitoramento de capacidade e carga atual
- Indicadores visuais de utilização
- Status ativo/inativo
- Seleção interativa para filtragem

### Sistema de Entregas
- Rastreamento por status (pendente, em trânsito, entregue)
- Níveis de prioridade (baixa, média, alta)
- Atribuição automática a CDs
- Métricas de performance

## 📁 Estrutura do Projeto

```
route-atlas/
├── src/
│   ├── components/          # Componentes React
│   │   ├── ui/             # Componentes UI (shadcn)
│   │   ├── DMSDashboard.tsx # Dashboard principal
│   │   └── RouteVisualization.tsx # Visualização de rotas
│   ├── data/               # Arquivos JSON de dados
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilitários
│   ├── pages/              # Páginas da aplicação
│   └── App.tsx             # Componente principal
├── public/                 # Arquivos estáticos
└── docs/                   # Documentação adicional
```

## 📖 Documentação

- [Guia do Usuário](docs/USER_GUIDE.md) - Como usar o dashboard
- [API e Integração](docs/API.md) - Integração com sistemas externos
- [Arquitetura](docs/ARCHITECTURE.md) - Visão técnica do sistema
- [Configuração](docs/CONFIGURATION.md) - Personalização e configuração
- [Deploy](docs/DEPLOYMENT.md) - Instruções de deployment
- [Troubleshooting](docs/TROUBLESHOOTING.md) - Resolução de problemas
- [Contribuição](docs/CONTRIBUTING.md) - Guia para desenvolvedores

## 🔧 Configuração

Para personalizar o sistema, consulte o [Guia de Configuração](docs/CONFIGURATION.md).

## 🚀 Deploy

Para instruções detalhadas de deployment, consulte o [Guia de Deploy](docs/DEPLOYMENT.md).

## 🤝 Contribuição

Consulte o [Guia de Contribuição](docs/CONTRIBUTING.md) para informações sobre como contribuir com o projeto.

## 📝 Changelog

Consulte [CHANGELOG.md](CHANGELOG.md) para ver as alterações recentes.

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo LICENSE para mais detalhes.
