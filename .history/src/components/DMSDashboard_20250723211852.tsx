import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RouteVisualization } from './RouteVisualization';
import { useDataLoader } from '@/hooks/useDataLoader';
import { usePositionSaver } from '@/hooks/usePositionSaver';
import { 
  Package, 
  Truck, 
  MapPin, 
  Activity, 
  RefreshCw, 
  Settings,
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader,
  Database,
  Wifi,
  WifiOff,
  Save,
  RotateCcw
} from 'lucide-react';

export const DMSDashboard: React.FC = () => {
  const [selectedCD, setSelectedCD] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Carrega dados dos arquivos JSON automaticamente
  const { cds, deliveryPoints, cdConnections, isLoading, error } = useDataLoader(30000); // 30 segundos
  
  // Hook para salvar posições
  const { savePositions, resetPositions } = usePositionSaver();

  // Função para salvar as novas posições
  const handleUpdateLocations = async (updatedCDs: any[], updatedDeliveryPoints: any[]) => {
    setHasUnsavedChanges(true);
    const success = await savePositions(updatedCDs, updatedDeliveryPoints);
    if (success) {
      setHasUnsavedChanges(false);
    }
  };

  // Função para resetar posições
  const handleResetPositions = () => {
    resetPositions();
    setHasUnsavedChanges(false);
    window.location.reload(); // Recarrega para aplicar as posições padrão
  };

  // Cálculo das métricas
  const totalDeliveries = deliveryPoints.length;
  const completedDeliveries = deliveryPoints.filter(p => p.status === 'delivered').length;
  const inTransitDeliveries = deliveryPoints.filter(p => p.status === 'in_transit').length;
  const pendingDeliveries = deliveryPoints.filter(p => p.status === 'pending').length;
  const totalCapacity = cds.reduce((sum, cd) => sum + cd.capacity, 0);
  const totalLoad = cds.reduce((sum, cd) => sum + cd.currentLoad, 0);
  const utilizationRate = Math.round((totalLoad / totalCapacity) * 100);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Carregando dados do sistema...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <WifiOff className="w-8 h-8 mx-auto text-destructive" />
          <h2 className="text-lg font-semibold text-foreground">Erro ao carregar dados</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Activity className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                DMS Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Sistema de Gerenciamento de Distribuição - Tempo Real
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-lg">
              <Database className="w-4 h-4 text-accent" />
              <span className="text-sm text-accent font-medium">JSON Auto-sync</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 rounded-lg">
              <Wifi className="w-4 h-4 text-success" />
              <span className="text-sm text-success font-medium">Online</span>
            </div>
            {hasUnsavedChanges && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-warning/10 rounded-lg">
                <Save className="w-4 h-4 text-warning" />
                <span className="text-sm text-warning font-medium">Alterações não salvas</span>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
            <Button variant="outline" size="sm" onClick={handleResetPositions}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Resetar Posições
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
          </div>
        </div>

        {/* Métricas principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-card to-card/80 border-primary/20 hover:border-primary/40 transition-all duration-300 animate-fade-in hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Entregas
              </CardTitle>
              <Package className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalDeliveries}</div>
              <div className="flex items-center gap-2 mt-2">
                <CheckCircle className="h-4 w-4 text-accent" />
                <p className="text-xs text-accent">
                  {Math.round((completedDeliveries/totalDeliveries)*100)}% concluídas
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-accent/20 hover:border-accent/40 transition-all duration-300 animate-fade-in hover-scale" style={{animationDelay: '0.1s'}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Entregues
              </CardTitle>
              <CheckCircle className="h-6 w-6 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{completedDeliveries}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Taxa de sucesso: {Math.round((completedDeliveries/totalDeliveries)*100)}%
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-route-active/20 hover:border-route-active/40 transition-all duration-300 animate-fade-in hover-scale" style={{animationDelay: '0.2s'}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Em Trânsito
              </CardTitle>
              <Truck className="h-6 w-6 text-route-active animate-pulse-slow" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{inTransitDeliveries}</div>
              <p className="text-xs text-route-active mt-2">
                Movimentação ativa
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-muted/20 hover:border-muted/40 transition-all duration-300 animate-fade-in hover-scale" style={{animationDelay: '0.3s'}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Capacidade dos CDs
              </CardTitle>
              <Activity className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{utilizationRate}%</div>
              <p className="text-xs text-muted-foreground mt-2">
                {totalLoad}/{totalCapacity} unidades
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Visualização de rotas */}
          <div className="lg:col-span-3">
            <Card className="bg-gradient-to-br from-card to-card/80 border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-semibold text-foreground">
                      Visualização de Rotas em Tempo Real
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Arraste os CDs e pontos de entrega para reorganizar a visualização
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="border-cd-primary text-cd-primary">
                      CDs: {cds.length}
                    </Badge>
                    <Badge variant="outline" className="border-delivery-primary text-delivery-primary">
                      Entregas: {deliveryPoints.length}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <RouteVisualization 
                  cds={cds}
                  deliveryPoints={deliveryPoints}
                  cdConnections={cdConnections}
                  selectedCD={selectedCD}
                  onCDSelect={setSelectedCD}
                  onUpdateLocations={handleUpdateLocations}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar com detalhes */}
          <div className="space-y-6">
            {/* Centros de Distribuição */}
            <Card className="bg-gradient-to-br from-card to-card/80 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">
                  Centros de Distribuição
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cds.map((cd) => (
                  <div 
                    key={cd.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 hover-scale ${
                      selectedCD === cd.id 
                        ? 'border-primary bg-primary/10 shadow-lg' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedCD(selectedCD === cd.id ? null : cd.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-foreground">{cd.name}</span>
                      <Badge 
                        variant={cd.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {cd.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Capacidade:</span>
                        <span className="text-foreground font-medium">
                          {cd.currentLoad}/{cd.capacity}
                        </span>
                      </div>
                      
                      <div className="w-full bg-secondary rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-primary to-primary-glow h-3 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((cd.currentLoad / cd.capacity) * 100, 100)}%` }}
                        />
                      </div>
                      
                      <div className="text-xs text-center text-muted-foreground">
                        {Math.round((cd.currentLoad / cd.capacity) * 100)}% utilizado
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Status das entregas */}
            <Card className="bg-gradient-to-br from-card to-card/80 border-accent/20">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">
                  Status das Entregas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {deliveryPoints
                  .filter(dp => !selectedCD || dp.assignedCD === selectedCD)
                  .map((dp) => (
                  <div 
                    key={dp.id} 
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/30 transition-all duration-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground">{dp.name}</span>
                        {dp.status === 'delivered' && <CheckCircle className="w-3 h-3 text-accent" />}
                        {dp.status === 'in_transit' && <Truck className="w-3 h-3 text-route-active" />}
                        {dp.status === 'pending' && <Clock className="w-3 h-3 text-muted-foreground" />}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            dp.status === 'delivered' ? 'border-accent text-accent' :
                            dp.status === 'in_transit' ? 'border-route-active text-route-active' :
                            'border-muted-foreground text-muted-foreground'
                          }`}
                        >
                          {dp.status === 'delivered' ? 'Entregue' :
                           dp.status === 'in_transit' ? 'Em trânsito' : 'Pendente'}
                        </Badge>
                        
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            dp.priority === 'high' ? 'border-destructive text-destructive' :
                            dp.priority === 'medium' ? 'border-route-active text-route-active' :
                            'border-muted-foreground text-muted-foreground'
                          }`}
                        >
                          {dp.priority === 'high' ? 'Alta' :
                           dp.priority === 'medium' ? 'Média' : 'Baixa'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};