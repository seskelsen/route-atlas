import React, { useRef, useEffect, useState, useCallback } from 'react';

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

interface RouteVisualizationProps {
  cds: CDData[];
  deliveryPoints: DeliveryPoint[];
  cdConnections: CDConnection[];
  selectedCD: string | null;
  onCDSelect: (cdId: string | null) => void;
  onUpdateLocations?: (cds: CDData[], deliveryPoints: DeliveryPoint[]) => void;
}

interface DragState {
  isDragging: boolean;
  elementType: 'cd' | 'delivery' | null;
  elementId: string | null;
  startPosition: { x: number; y: number };
  offset: { x: number; y: number };
}

export const RouteVisualization: React.FC<RouteVisualizationProps> = ({
  cds,
  deliveryPoints,
  cdConnections,
  selectedCD,
  onCDSelect,
  onUpdateLocations
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const [animationOffset, setAnimationOffset] = useState(0);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    elementType: null,
    elementId: null,
    startPosition: { x: 0, y: 0 },
    offset: { x: 0, y: 0 }
  });
  
  // Estados locais para as posições durante o drag
  const [localCDs, setLocalCDs] = useState<CDData[]>(cds);
  const [localDeliveryPoints, setLocalDeliveryPoints] = useState<DeliveryPoint[]>(deliveryPoints);

  // Sincronizar com props quando não estiver arrastando
  useEffect(() => {
    if (!dragState.isDragging) {
      setLocalCDs(cds);
      setLocalDeliveryPoints(deliveryPoints);
    }
  }, [cds, deliveryPoints, dragState.isDragging]);

    // Animação das rotas - mais suave
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationOffset(prev => (prev + 0.5) % 20);
    }, 150);
    
    return () => clearInterval(interval);
  }, []);

  // Funções de drag and drop
  const getElementPosition = useCallback((elementType: 'cd' | 'delivery', elementId: string) => {
    if (elementType === 'cd') {
      return localCDs.find(cd => cd.id === elementId)?.location;
    } else {
      return localDeliveryPoints.find(point => point.id === elementId)?.location;
    }
  }, [localCDs, localDeliveryPoints]);

  const getSVGCoordinates = useCallback((event: React.MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 800; // Normalizar para coordenadas SVG
    const y = ((event.clientY - rect.top) / rect.height) * 500;
    
    return { x: Math.max(25, Math.min(775, x)), y: Math.max(25, Math.min(475, y)) };
  }, []);

  const handleMouseDown = useCallback((elementType: 'cd' | 'delivery', elementId: string, event: React.MouseEvent) => {
    event.preventDefault();
    const svgCoords = getSVGCoordinates(event);
    const elementPos = getElementPosition(elementType, elementId);
    
    if (!elementPos) return;
    
    setDragState({
      isDragging: true,
      elementType,
      elementId,
      startPosition: svgCoords,
      offset: {
        x: svgCoords.x - elementPos.x,
        y: svgCoords.y - elementPos.y
      }
    });
  }, [getSVGCoordinates, getElementPosition]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!dragState.isDragging || !dragState.elementId) return;
    
    const svgCoords = getSVGCoordinates(event);
    const newPosition = {
      x: svgCoords.x - dragState.offset.x,
      y: svgCoords.y - dragState.offset.y
    };

    if (dragState.elementType === 'cd') {
      setLocalCDs(prevCDs => 
        prevCDs.map(cd => 
          cd.id === dragState.elementId 
            ? { ...cd, location: newPosition }
            : cd
        )
      );
    } else {
      setLocalDeliveryPoints(prevPoints => 
        prevPoints.map(point => 
          point.id === dragState.elementId 
            ? { ...point, location: newPosition }
            : point
        )
      );
    }
  }, [dragState, getSVGCoordinates]);

  const handleMouseUp = useCallback(() => {
    if (dragState.isDragging && onUpdateLocations) {
      // Salvar as novas posições
      onUpdateLocations(localCDs, localDeliveryPoints);
    }
    
    setDragState({
      isDragging: false,
      elementType: null,
      elementId: null,
      startPosition: { x: 0, y: 0 },
      offset: { x: 0, y: 0 }
    });
  }, [dragState.isDragging, localCDs, localDeliveryPoints, onUpdateLocations]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'hsl(var(--accent))';
      case 'in_transit': return 'hsl(var(--route-active))';
      case 'pending': return 'hsl(var(--muted-foreground))';
      default: return 'hsl(var(--muted-foreground))';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'hsl(var(--destructive))';
      case 'medium': return 'hsl(var(--route-active))';
      case 'low': return 'hsl(var(--muted-foreground))';
      default: return 'hsl(var(--muted-foreground))';
    }
  };

  const generateRoute = (from: { x: number; y: number }, to: { x: number; y: number }, isInterCD = false) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Para rotas entre CDs, usar curvas mais suaves e consistentes
    const curveFactor = isInterCD ? 0.15 : 0.1;
    // Usar valores fixos baseados na posição para evitar aleatoriedade
    const midX = from.x + dx * 0.5 + Math.sin((from.x + to.x) * 0.01) * distance * curveFactor;
    const midY = from.y + dy * 0.5 + Math.cos((from.y + to.y) * 0.01) * distance * curveFactor;
    
    return `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
  };

  // As conexões entre CDs agora vêm via props dos arquivos JSON

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-br from-background/50 to-background/80 rounded-lg border border-primary/20 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <svg 
        ref={svgRef} 
        width="100%" 
        height="100%" 
        className="relative z-10"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // Para casos onde o mouse sai da área
      >
        <defs>
          {/* Gradientes para diferentes elementos */}
          <radialGradient id="cdGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--cd-primary))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--cd-secondary))" stopOpacity="0.4" />
          </radialGradient>
          
          <radialGradient id="deliveryGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--delivery-primary))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--delivery-secondary))" stopOpacity="0.4" />
          </radialGradient>

          {/* Filtros de glow */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Padrão para rotas animadas */}
          <pattern id="routePattern" patternUnits="userSpaceOnUse" width="20" height="4">
            <rect width="10" height="4" fill="hsl(var(--route-active))" opacity="0.8"/>
            <rect x="10" width="10" height="4" fill="transparent"/>
          </pattern>
        </defs>

        {/* Rotas entre CDs */}
        {cdConnections.map((connection) => {
          const fromCD = localCDs.find(cd => cd.id === connection.from);
          const toCD = localCDs.find(cd => cd.id === connection.to);
          if (!fromCD || !toCD) return null;

          const isHighlighted = selectedCD === connection.from || selectedCD === connection.to;
          const routePath = generateRoute(fromCD.location, toCD.location, true);

          return (
            <g key={`cd-route-${connection.from}-${connection.to}`}>
              {/* Rota entre CDs - linha fixa sem movimentação */}
              <path
                d={routePath}
                fill="none"
                stroke={connection.status === 'active' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
                strokeWidth={isHighlighted ? "4" : "2.5"}
                strokeOpacity={isHighlighted ? 0.9 : 0.6}
                className="transition-all duration-300"
                filter={isHighlighted ? "url(#glow)" : "none"}
              />
              
              {/* Indicador de fluxo suave entre CDs */}
              {connection.status === 'active' && (
                <circle
                  r="3"
                  fill="hsl(var(--primary-glow))"
                  filter="url(#glow)"
                  opacity="0.7"
                >
                  <animateMotion
                    dur="6s"
                    repeatCount="indefinite"
                    path={routePath}
                  />
                </circle>
              )}
            </g>
          );
        })}

        {/* Rotas entre CDs e pontos de entrega */}
        {localDeliveryPoints.map((point) => {
          const assignedCD = localCDs.find(cd => cd.id === point.assignedCD);
          if (!assignedCD) return null;

          const isHighlighted = selectedCD === point.assignedCD || hoveredPoint === point.id;
          const routePath = generateRoute(assignedCD.location, point.location);

          return (
            <g key={`route-${point.id}`}>
              {/* Rota base - linha fixa */}
              <path
                d={routePath}
                fill="none"
                stroke={point.status === 'in_transit' ? 'hsl(var(--route-active))' : 'hsl(var(--muted-foreground))'}
                strokeWidth={isHighlighted ? "3" : "1.5"}
                strokeOpacity={isHighlighted ? 0.8 : 0.4}
                className="transition-all duration-300"
                filter={isHighlighted ? "url(#glow)" : "none"}
              />
              
              {/* Indicador de direção suave */}
              {point.status === 'in_transit' && (
                <circle
                  r="2.5"
                  fill="hsl(var(--route-active))"
                  filter="url(#glow)"
                  opacity="0.8"
                >
                  <animateMotion
                    dur="5s"
                    repeatCount="indefinite"
                    path={routePath}
                  />
                </circle>
              )}
            </g>
          );
        })}

        {/* Centros de Distribuição (Círculos) */}
        {localCDs.map((cd) => {
          const isSelected = selectedCD === cd.id;
          const isDragging = dragState.elementType === 'cd' && dragState.elementId === cd.id;
          const loadPercentage = (cd.currentLoad / cd.capacity) * 100;
          
          return (
            <g key={cd.id}>
              {/* Anel exterior indicando capacidade */}
              <circle
                cx={cd.location.x}
                cy={cd.location.y}
                r="25"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeOpacity="0.3"
              />
              
              {/* Anel de capacidade */}
              <circle
                cx={cd.location.x}
                cy={cd.location.y}
                r="25"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeDasharray={`${(loadPercentage * 157) / 100} 157`}
                strokeDashoffset="0"
                transform={`rotate(-90 ${cd.location.x} ${cd.location.y})`}
                className="transition-all duration-500"
              />
              
              {/* CD principal */}
              <circle
                cx={cd.location.x}
                cy={cd.location.y}
                r={isSelected || isDragging ? "22" : "18"}
                fill="url(#cdGradient)"
                stroke="hsl(var(--cd-primary))"
                strokeWidth={isSelected || isDragging ? "3" : "2"}
                filter="url(#glow)"
                className={`transition-all duration-300 ${isDragging ? 'cursor-grabbing' : 'cursor-grab hover:r-20'}`}
                onClick={() => !isDragging && onCDSelect(isSelected ? null : cd.id)}
                onMouseDown={(e) => handleMouseDown('cd', cd.id, e)}
              />
              
              {/* Label do CD - posicionado mais longe */}
              <text
                x={cd.location.x}
                y={cd.location.y - 45}
                textAnchor="middle"
                className="fill-foreground text-sm font-semibold"
                filter="url(#glow)"
              >
                {cd.name}
              </text>
              
              {/* Indicador de status */}
              <circle
                cx={cd.location.x + 15}
                cy={cd.location.y - 15}
                r="4"
                fill={cd.status === 'active' ? 'hsl(var(--accent))' : 'hsl(var(--muted-foreground))'}
                filter="url(#glow)"
              />
            </g>
          );
        })}

        {/* Pontos de Entrega (Triângulos) */}
        {localDeliveryPoints.map((point) => {
          const isHovered = hoveredPoint === point.id;
          const isFromSelectedCD = selectedCD === point.assignedCD;
          const isDragging = dragState.elementType === 'delivery' && dragState.elementId === point.id;
          const triangleSize = isHovered || isDragging ? 10 : 8;
          
          // Criar um triângulo apontando para baixo
          const trianglePath = `M ${point.location.x} ${point.location.y - triangleSize} 
                               L ${point.location.x - triangleSize} ${point.location.y + triangleSize/2} 
                               L ${point.location.x + triangleSize} ${point.location.y + triangleSize/2} Z`;
          
          return (
            <g key={point.id}>
              {/* Halo para pontos em destaque */}
              {(isHovered || isFromSelectedCD || isDragging) && (
                <circle
                  cx={point.location.x}
                  cy={point.location.y}
                  r="15"
                  fill="none"
                  stroke={getStatusColor(point.status)}
                  strokeWidth="1"
                  strokeOpacity="0.3"
                  className="animate-pulse"
                />
              )}
              
              {/* Triângulo principal */}
              <path
                d={trianglePath}
                fill={getStatusColor(point.status)}
                stroke={getPriorityColor(point.priority)}
                strokeWidth="2"
                filter={isHovered || isFromSelectedCD || isDragging ? "url(#glow)" : "none"}
                className={`transition-all duration-300 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                onMouseEnter={() => !isDragging && setHoveredPoint(point.id)}
                onMouseLeave={() => !isDragging && setHoveredPoint(null)}
                onMouseDown={(e) => handleMouseDown('delivery', point.id, e)}
              />
              
              {/* Label do ponto */}
              <text
                x={point.location.x}
                y={point.location.y + 20}
                textAnchor="middle"
                className={`fill-foreground text-xs transition-opacity duration-300 ${isHovered || isFromSelectedCD || isDragging ? 'opacity-100' : 'opacity-70'}`}
                pointerEvents="none"
              >
                {point.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legenda */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-primary/20">
        <div className="text-xs text-foreground font-semibold mb-2">Legenda</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-cd-primary"></div>
            <span className="text-muted-foreground">Centro de Distribuição</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent border-b-delivery-primary"></div>
            <span className="text-muted-foreground">Ponto de Entrega</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-primary"></div>
            <span className="text-muted-foreground">Rota entre CDs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-route-active"></div>
            <span className="text-muted-foreground">Rota de Entrega</span>
          </div>
        </div>
      </div>

      {/* Indicador de tempo real */}
      <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-2 border border-accent/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
          <span className="text-xs text-foreground font-medium">Tempo Real</span>
        </div>
      </div>
    </div>
  );
};