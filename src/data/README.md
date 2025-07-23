# Dados do DMS Dashboard

Esta pasta contém os arquivos JSON que alimentam o dashboard em tempo real.

## Arquivos

### `cds.json`
Define os Centros de Distribuição (CDs) com suas localizações, capacidades e status.

```json
{
  "id": "identificador único",
  "name": "nome do CD",
  "location": { "x": coordenada_x, "y": coordenada_y },
  "status": "active" | "inactive",
  "capacity": capacidade_total,
  "currentLoad": carga_atual
}
```

### `delivery-points.json`
Define os pontos de entrega (last mile) com status e prioridades.

```json
{
  "id": "identificador único",
  "name": "nome do ponto",
  "location": { "x": coordenada_x, "y": coordenada_y },
  "status": "pending" | "in_transit" | "delivered",
  "assignedCD": "id_do_cd_responsavel",
  "priority": "low" | "medium" | "high"
}
```

### `cd-connections.json`
Define as conexões entre CDs para rotas intercamadas.

```json
{
  "from": "id_cd_origem",
  "to": "id_cd_destino", 
  "status": "active" | "inactive"
}
```

## Atualização Automática

O sistema monitora estes arquivos automaticamente a cada 5 segundos e atualiza a visualização em tempo real. Para alterar os dados, simplesmente edite os arquivos JSON e as mudanças aparecerão no dashboard.

## Coordenadas

- **X**: 0 a 600 (largura do SVG)
- **Y**: 0 a 500 (altura do SVG)

## Integração com APIs

Para integrar com sistemas externos, substitua a leitura dos arquivos locais por chamadas para APIs REST no hook `useDataLoader.ts`.