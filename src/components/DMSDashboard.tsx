import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RouteVisualization } from './RouteVisualization';
import { Truck, Package, MapPin, Activity, Clock, TrendingUp } from 'lucide-react';

interface CDData {
  id: string;
  name: string;
  location: { x: number; y: number };
  status: 'active' | 'inactive';
  capacity: number;
  currentLoad: number;
}

interface DeliveryPoint {
  id: string;
  name: string;
  location: { x: number; y: number };
  status: 'pending' | 'in_transit' | 'delivered';
  assignedCD: string;
  priority: 'low' | 'medium' | 'high';
}

const DMSDashboard = () => {
  const [selectedCD, setSelectedCD] = useState<string | null>(null);
  
  // Dados mockados para demonstração
  const cds: CDData[] = [
    { id: 'cd1', name: 'CD São Paulo', location: { x: 200, y: 150 }, status: 'active', capacity: 1000, currentLoad: 850 },
    { id: 'cd2', name: 'CD Rio de Janeiro', location: { x: 600, y: 250 }, status: 'active', capacity: 800, currentLoad: 600 },
    { id: 'cd3', name: 'CD Belo Horizonte', location: { x: 400, y: 100 }, status: 'active', capacity: 600, currentLoad: 450 },
  ];

  const deliveryPoints: DeliveryPoint[] = [
    { id: 'dp1', name: 'Centro SP', location: { x: 120, y: 120 }, status: 'delivered', assignedCD: 'cd1', priority: 'high' },
    { id: 'dp2', name: 'Vila Madalena', location: { x: 160, y: 200 }, status: 'in_transit', assignedCD: 'cd1', priority: 'medium' },
    { id: 'dp3', name: 'Zona Sul', location: { x: 80, y: 180 }, status: 'pending', assignedCD: 'cd1', priority: 'low' },
    { id: 'dp4', name: 'Copacabana', location: { x: 680, y: 220 }, status: 'pending', assignedCD: 'cd2', priority: 'high' },
    { id: 'dp5', name: 'Ipanema', location: { x: 650, y: 300 }, status: 'in_transit', assignedCD: 'cd2', priority: 'medium' },
    { id: 'dp6', name: 'Tijuca', location: { x: 720, y: 280 }, status: 'delivered', assignedCD: 'cd2', priority: 'low' },
    { id: 'dp7', name: 'Savassi BH', location: { x: 360, y: 60 }, status: 'delivered', assignedCD: 'cd3', priority: 'medium' },
    { id: 'dp8', name: 'Centro BH', location: { x: 440, y: 50 }, status: 'pending', assignedCD: 'cd3', priority: 'high' },
    { id: 'dp9', name: 'Pampulha', location: { x: 380, y: 140 }, status: 'in_transit', assignedCD: 'cd3', priority: 'medium' },
  ];

  const totalDeliveries = deliveryPoints.length;
  const completedDeliveries = deliveryPoints.filter(dp => dp.status === 'delivered').length;
  const inTransit = deliveryPoints.filter(dp => dp.status === 'in_transit').length;
  const pending = deliveryPoints.filter(dp => dp.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              DMS Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">Distribution Management System - Visão Geral das Operações</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-primary/30 hover:border-primary">
              <Activity className="w-4 h-4 mr-2" />
              Tempo Real
            </Button>
            <Button className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg">
              <TrendingUp className="w-4 h-4 mr-2" />
              Relatórios
            </Button>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-primary/20 hover:border-primary/40 transition-all duration-300 animate-fade-in hover-scale">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Entregas</p>
                <p className="text-3xl font-bold text-foreground">{totalDeliveries}</p>
                <p className="text-xs text-accent">+12% vs. ontem</p>
              </div>
              <Package className="h-12 w-12 text-primary opacity-80" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-accent/20 hover:border-accent/40 transition-all duration-300 animate-fade-in hover-scale" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Entregues</p>
                <p className="text-3xl font-bold text-foreground">{completedDeliveries}</p>
                <p className="text-xs text-accent">Taxa: {Math.round((completedDeliveries/totalDeliveries)*100)}%</p>
              </div>
              <MapPin className="h-12 w-12 text-accent opacity-80" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-route-active/20 hover:border-route-active/40 transition-all duration-300 animate-fade-in hover-scale" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Em Trânsito</p>
                <p className="text-3xl font-bold text-foreground">{inTransit}</p>
                <p className="text-xs text-route-active">Ativos agora</p>
              </div>
              <Truck className="h-12 w-12 text-route-active opacity-80 animate-pulse-slow" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-muted/20 hover:border-muted/40 transition-all duration-300 animate-fade-in hover-scale" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-3xl font-bold text-foreground">{pending}</p>
                <p className="text-xs text-muted-foreground">Aguardando</p>
              </div>
              <Clock className="h-12 w-12 text-muted-foreground opacity-80" />
            </div>
          </Card>
        </div>

        {/* Visualização Principal e Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Mapa de Rotas */}
          <div className="lg:col-span-3">
            <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-primary/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground">Visualização de Rotas</h2>
                <div className="flex gap-2">
                  <Badge variant="outline" className="border-cd-primary text-cd-primary">
                    CDs: {cds.length}
                  </Badge>
                  <Badge variant="outline" className="border-delivery-primary text-delivery-primary">
                    Entregas: {deliveryPoints.length}
                  </Badge>
                </div>
              </div>
              <RouteVisualization 
                cds={cds}
                deliveryPoints={deliveryPoints}
                selectedCD={selectedCD}
                onCDSelect={setSelectedCD}
              />
            </Card>
          </div>

          {/* Sidebar - Detalhes dos CDs */}
          <div className="space-y-4">
            <Card className="p-4 bg-gradient-to-br from-card to-card/80 border-primary/20">
              <h3 className="text-lg font-semibold text-foreground mb-4">Centros de Distribuição</h3>
              <div className="space-y-3">
                {cds.map((cd) => (
                  <div 
                    key={cd.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedCD === cd.id 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedCD(selectedCD === cd.id ? null : cd.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm text-foreground">{cd.name}</span>
                      <Badge 
                        variant={cd.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {cd.status}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Capacidade:</span>
                        <span className="text-foreground">{cd.currentLoad}/{cd.capacity}</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary to-primary-glow h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(cd.currentLoad / cd.capacity) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-card to-card/80 border-accent/20">
              <h3 className="text-lg font-semibold text-foreground mb-4">Status das Entregas</h3>
              <div className="space-y-3">
                {deliveryPoints.map((dp) => (
                  <div key={dp.id} className="flex items-center justify-between p-2 rounded-lg border border-border">
                    <div>
                      <span className="text-sm font-medium text-foreground">{dp.name}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            dp.status === 'delivered' ? 'border-accent text-accent' :
                            dp.status === 'in_transit' ? 'border-route-active text-route-active' :
                            'border-muted-foreground text-muted-foreground'
                          }`}
                        >
                          {dp.status}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            dp.priority === 'high' ? 'border-destructive text-destructive' :
                            dp.priority === 'medium' ? 'border-route-active text-route-active' :
                            'border-muted-foreground text-muted-foreground'
                          }`}
                        >
                          {dp.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DMSDashboard;