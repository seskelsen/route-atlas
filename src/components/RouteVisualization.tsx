import React, { useRef, useEffect, useState } from 'react';

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

interface RouteVisualizationProps {
  cds: CDData[];
  deliveryPoints: DeliveryPoint[];
  selectedCD: string | null;
  onCDSelect: (cdId: string | null) => void;
}

export const RouteVisualization: React.FC<RouteVisualizationProps> = ({
  cds,
  deliveryPoints,
  selectedCD,
  onCDSelect
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const [animationOffset, setAnimationOffset] = useState(0);

  // Animação das rotas
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationOffset(prev => (prev + 2) % 20);
    }, 100);
    return () => clearInterval(interval);
  }, []);

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
    
    // Para rotas entre CDs, usar curvas mais suaves
    const curveFactor = isInterCD ? 0.3 : 0.2;
    const midX = from.x + dx * 0.5 + (Math.random() - 0.5) * distance * curveFactor;
    const midY = from.y + dy * 0.5 + (Math.random() - 0.5) * distance * curveFactor;
    
    return `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
  };

  // Definir conectividade entre CDs (matriz de conexões)
  const cdConnections = [
    { from: 'cd1', to: 'cd2', status: 'active' },
    { from: 'cd1', to: 'cd3', status: 'active' },
    { from: 'cd2', to: 'cd3', status: 'inactive' },
  ];

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

      <svg ref={svgRef} width="100%" height="100%" className="relative z-10">
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
          const fromCD = cds.find(cd => cd.id === connection.from);
          const toCD = cds.find(cd => cd.id === connection.to);
          if (!fromCD || !toCD) return null;

          const isHighlighted = selectedCD === connection.from || selectedCD === connection.to;
          const routePath = generateRoute(fromCD.location, toCD.location, true);

          return (
            <g key={`cd-route-${connection.from}-${connection.to}`}>
              {/* Rota entre CDs */}
              <path
                d={routePath}
                fill="none"
                stroke={connection.status === 'active' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
                strokeWidth={isHighlighted ? "4" : "2.5"}
                strokeOpacity={isHighlighted ? 0.9 : 0.6}
                strokeDasharray={connection.status === 'active' ? "12,6" : "4,4"}
                strokeDashoffset={connection.status === 'active' ? -animationOffset * 1.5 : 0}
                className="transition-all duration-300"
                filter={isHighlighted ? "url(#glow)" : "none"}
              />
              
              {/* Indicador de fluxo entre CDs */}
              {connection.status === 'active' && (
                <circle
                  r="4"
                  fill="hsl(var(--primary-glow))"
                  filter="url(#glow)"
                  opacity="0.8"
                >
                  <animateMotion
                    dur="4s"
                    repeatCount="indefinite"
                    path={routePath}
                  />
                </circle>
              )}
            </g>
          );
        })}

        {/* Rotas entre CDs e pontos de entrega */}
        {deliveryPoints.map((point) => {
          const assignedCD = cds.find(cd => cd.id === point.assignedCD);
          if (!assignedCD) return null;

          const isHighlighted = selectedCD === point.assignedCD || hoveredPoint === point.id;
          const routePath = generateRoute(assignedCD.location, point.location);

          return (
            <g key={`route-${point.id}`}>
              {/* Rota base */}
              <path
                d={routePath}
                fill="none"
                stroke={point.status === 'in_transit' ? 'hsl(var(--route-active))' : 'hsl(var(--muted-foreground))'}
                strokeWidth={isHighlighted ? "3" : "1.5"}
                strokeOpacity={isHighlighted ? 0.8 : 0.4}
                strokeDasharray={point.status === 'in_transit' ? "8,4" : "none"}
                strokeDashoffset={point.status === 'in_transit' ? -animationOffset : 0}
                className="transition-all duration-300"
                filter={isHighlighted ? "url(#glow)" : "none"}
              />
              
              {/* Indicador de direção */}
              {point.status === 'in_transit' && (
                <circle
                  r="3"
                  fill="hsl(var(--route-active))"
                  filter="url(#glow)"
                >
                  <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    path={routePath}
                  />
                </circle>
              )}
            </g>
          );
        })}

        {/* Centros de Distribuição (Círculos) */}
        {cds.map((cd) => {
          const isSelected = selectedCD === cd.id;
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
                r={isSelected ? "22" : "18"}
                fill="url(#cdGradient)"
                stroke="hsl(var(--cd-primary))"
                strokeWidth={isSelected ? "3" : "2"}
                filter="url(#glow)"
                className="cursor-pointer transition-all duration-300 hover:r-20"
                onClick={() => onCDSelect(isSelected ? null : cd.id)}
              />
              
              {/* Label do CD */}
              <text
                x={cd.location.x}
                y={cd.location.y - 35}
                textAnchor="middle"
                className="fill-foreground text-xs font-semibold"
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
        {deliveryPoints.map((point) => {
          const isHovered = hoveredPoint === point.id;
          const isFromSelectedCD = selectedCD === point.assignedCD;
          const triangleSize = isHovered ? 10 : 8;
          
          // Criar um triângulo apontando para baixo
          const trianglePath = `M ${point.location.x} ${point.location.y - triangleSize} 
                               L ${point.location.x - triangleSize} ${point.location.y + triangleSize/2} 
                               L ${point.location.x + triangleSize} ${point.location.y + triangleSize/2} Z`;
          
          return (
            <g key={point.id}>
              {/* Halo para pontos em destaque */}
              {(isHovered || isFromSelectedCD) && (
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
                filter={isHovered || isFromSelectedCD ? "url(#glow)" : "none"}
                className="cursor-pointer transition-all duration-300"
                onMouseEnter={() => setHoveredPoint(point.id)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              
              {/* Label do ponto */}
              <text
                x={point.location.x}
                y={point.location.y + 20}
                textAnchor="middle"
                className="fill-foreground text-xs"
                style={{ opacity: isHovered || isFromSelectedCD ? 1 : 0.7 }}
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