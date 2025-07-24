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

      const [originalCDs, originalDeliveryPoints, cdConnections] = await Promise.all([
        cdsResponse.json(),
        deliveryPointsResponse.json(),
        connectionsResponse.json()
      ]);


      // Verifica se há posições salvas localmente
      const savedPositions = loadSavedPositions();

      // Se o JSON mudou (ex: quantidade de CDs diferente), sobrescreve o localStorage
      let cds = originalCDs;
      let deliveryPoints = originalDeliveryPoints;
      let shouldUpdateStorage = false;

      if (savedPositions.cds && Array.isArray(savedPositions.cds) && savedPositions.cds.length === originalCDs.length) {
        cds = savedPositions.cds;
      } else {
        shouldUpdateStorage = true;
      }

      if (savedPositions.deliveryPoints && Array.isArray(savedPositions.deliveryPoints) && savedPositions.deliveryPoints.length === originalDeliveryPoints.length) {
        deliveryPoints = savedPositions.deliveryPoints;
      } else {
        shouldUpdateStorage = true;
      }

      if (shouldUpdateStorage) {
        localStorage.setItem('route-atlas-cds', JSON.stringify(originalCDs));
        localStorage.setItem('route-atlas-delivery-points', JSON.stringify(originalDeliveryPoints));
      }

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

    // Configura atualização automática apenas se não houver mudanças locais
    const interval = setInterval(() => {
      if (!hasLocalChanges) {
        loadData();
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, hasLocalChanges, loadSavedPositions]);

  return {
    ...data,
    updatePositions
  };
};