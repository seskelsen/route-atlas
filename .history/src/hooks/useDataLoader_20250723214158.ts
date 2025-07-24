import { useState, useEffect, useCallback } from 'react';

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

interface CDConnection {
  from: string;
  to: string;
  status: 'active' | 'inactive';
}

interface DashboardData {
  cds: CDData[];
  deliveryPoints: DeliveryPoint[];
  cdConnections: CDConnection[];
  isLoading: boolean;
  error: string | null;
  updatePositions: (newCDs: CDData[], newDeliveryPoints: DeliveryPoint[]) => void;
}

export const useDataLoader = (refreshInterval = 30000): DashboardData => {
  const [data, setData] = useState<Omit<DashboardData, 'updatePositions'>>({
    cds: [],
    deliveryPoints: [],
    cdConnections: [],
    isLoading: true,
    error: null
  });
  
  const [hasLocalChanges, setHasLocalChanges] = useState(false);

  const loadSavedPositions = useCallback(() => {
    try {
      const savedCDs = localStorage.getItem('route-atlas-cds');
      const savedDeliveryPoints = localStorage.getItem('route-atlas-delivery-points');
      
      return {
        cds: savedCDs ? JSON.parse(savedCDs) : null,
        deliveryPoints: savedDeliveryPoints ? JSON.parse(savedDeliveryPoints) : null
      };
    } catch (error) {
      console.error('Erro ao carregar posições salvas:', error);
      return { cds: null, deliveryPoints: null };
    }
  }, []);

  const updatePositions = useCallback((newCDs: CDData[], newDeliveryPoints: DeliveryPoint[]) => {
    // Salva no localStorage
    localStorage.setItem('route-atlas-cds', JSON.stringify(newCDs));
    localStorage.setItem('route-atlas-delivery-points', JSON.stringify(newDeliveryPoints));
    
    // Atualiza o estado local
    setData(prev => ({
      ...prev,
      cds: newCDs,
      deliveryPoints: newDeliveryPoints
    }));
    
    setHasLocalChanges(true);
    console.log('Posições atualizadas e salvas no localStorage');
  }, []);

  const loadData = async () => {
    try {
      setData(prev => ({ ...prev, isLoading: true, error: null }));

      // Carrega os dados dos arquivos JSON
      const [cdsResponse, deliveryPointsResponse, connectionsResponse] = await Promise.all([
        fetch('/src/data/cds.json'),
        fetch('/src/data/delivery-points.json'),
        fetch('/src/data/cd-connections.json')
      ]);

      if (!cdsResponse.ok || !deliveryPointsResponse.ok || !connectionsResponse.ok) {
        throw new Error('Erro ao carregar dados dos arquivos JSON');
      }

      const [cds, deliveryPoints, cdConnections] = await Promise.all([
        cdsResponse.json(),
        deliveryPointsResponse.json(),
        connectionsResponse.json()
      ]);

      setData({
        cds,
        deliveryPoints,
        cdConnections,
        isLoading: false,
        error: null
      });

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }));
    }
  };

  useEffect(() => {
    // Carrega dados inicialmente
    loadData();

    // Configura atualização automática
    const interval = setInterval(loadData, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  return data;
};