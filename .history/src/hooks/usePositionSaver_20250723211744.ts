import { useCallback } from 'react';

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

export const usePositionSaver = () => {
  const savePositions = useCallback(async (cds: CDData[], deliveryPoints: DeliveryPoint[]) => {
    try {
      // Aqui você pode implementar diferentes estratégias de salvamento:
      
      // 1. Salvar no localStorage (para desenvolvimento/demo)
      localStorage.setItem('route-atlas-cds', JSON.stringify(cds));
      localStorage.setItem('route-atlas-delivery-points', JSON.stringify(deliveryPoints));
      
      // 2. Enviar para uma API (em produção)
      // await fetch('/api/positions', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ cds, deliveryPoints })
      // });
      
      // 3. Salvar em um arquivo local (para desenvolvimento)
      // Nota: Isso requereria uma API backend para escrever nos arquivos JSON
      
      console.log('Posições salvas com sucesso!', { 
        cds: cds.length, 
        deliveryPoints: deliveryPoints.length 
      });
      
      // Exibir notificação de sucesso
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Route Atlas', {
          body: 'Posições dos elementos atualizadas com sucesso!',
          icon: '/favicon.ico'
        });
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao salvar posições:', error);
      return false;
    }
  }, []);

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

  const resetPositions = useCallback(() => {
    localStorage.removeItem('route-atlas-cds');
    localStorage.removeItem('route-atlas-delivery-points');
    console.log('Posições resetadas para os valores padrão');
  }, []);

  return {
    savePositions,
    loadSavedPositions,
    resetPositions
  };
};
