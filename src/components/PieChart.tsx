import { motion } from 'framer-motion';

export default function PieChart() {
  return (
    <motion.div 
      initial={{ opacity: 0, rotate: 0 }}
      animate={{ opacity: 1, rotate: 360 }}
      transition={{ duration: 2, ease: "easeInOut" }}
      className="h-64 flex items-center justify-center"
    >
      <svg viewBox="0 0 300 300" className="w-full h-full mx-auto drop-shadow-2xl">
        <defs>
          <radialGradient id="pieGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9">
              <animate attributeName="stop-color" values="#3b82f6;#10b981;#f59e0b;#ef4444;#8b5cf6;#06b6d4;#3b82f6" dur="10s" repeatCount="indefinite"/>
            </stop>
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2">
              <animate attributeName="stop-color" values="#10b981;#f59e0b;#ef4444;#8b5cf6;#06b6d4;#3b82f6;#10b981" dur="10s" repeatCount="indefinite"/>
            </stop>
          </radialGradient>
          <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="transparent"/>
          </linearGradient>
        </defs>
        {/* Main pie */}
        <circle 
          cx="150" 
          cy="150" 
          r="130" 
          fill="url(#pieGradient)" 
          stroke="rgba(255,255,255,0.9)" 
          strokeWidth="10"
          filter="url(#glow)"
        >
          <animateTransform 
            attributeName="transform" 
            type="rotate" 
            from="0 150 150" 
            to="360 150 150" 
            dur="25s" 
            repeatCount="indefinite"
          />
          <animate attributeName="opacity" values="0.8;1;0.8" dur="5s" repeatCount="indefinite"/>
        </circle>
        {/* Inner ring */}
        <circle 
          cx="150" 
          cy="150" 
          r="110" 
          fill="url(#shine)" 
          stroke="#f1f5f9" 
          strokeWidth="8"
        >
          <animateTransform 
            attributeName="transform" 
            type="rotate" 
            from="360 150 150" 
            to="0 150 150" 
            dur="18s" 
            repeatCount="indefinite"
          />
        </circle>
        {/* 3D effect rings */}
        <circle cx="150" cy="150" r="135" fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.6"/>
        <circle cx="150" cy="150" r="105" fill="none" stroke="#e2e8f0" strokeWidth="4"/>
        {/* Pulsing center */}
        <circle cx="150" cy="150" r="45" fill="url(#pieGradient)" opacity="0.4">
          <animate attributeName="r" values="40;55;40" dur="4s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.3;0.5;0.3" dur="4s" repeatCount="indefinite"/>
        </circle>
        {/* Glowing data arcs */}
        <path d="M 150 20 A 130 130 0 1 1 150 280 A 130 130 0 1 1 150 20 Z" fill="none" stroke="#3b82f6" strokeWidth="25" strokeLinecap="round" opacity="0.3">
          <animate attributeName="stroke-dasharray" values="0 816;816 0" dur="6s" repeatCount="indefinite"/>
        </path>
        {/* Data points - animated blobs */}
        {[
          {cx: 90, cy: 90, r: 18, color: '#3b82f6'},
          {cx: 240, cy: 110, r: 22, color: '#10b981'},
          {cx: 130, cy: 240, r: 20, color: '#f59e0b'},
          {cx: 210, cy: 70, r: 16, color: '#ef4444'},
          {cx: 70, cy: 180, r: 19, color: '#8b5cf6'}
        ].map((point, i) => (
          <circle 
            key={i}
            cx={point.cx} 
            cy={point.cy} 
            r={point.r}
            fill={point.color}
            opacity="0.8"
          >
            <animate attributeName="opacity" values="0.6;1;0.6" dur={`${2 + i*0.5}s`} repeatCount="indefinite"/>
            <animateTransform attributeName="transform" type="scale" values="1;1.15;1" dur={`${2 + i*0.5}s`} repeatCount="indefinite"/>
            <animate attributeName="r" values={`${point.r};${point.r + 4};${point.r}`} dur={`${2 + i*0.5}s`} repeatCount="indefinite"/>
          </circle>
        ))}
        {/* Sparkles */}
        <g opacity="0.7">
          <circle cx="160" cy="140" r="5" fill="#fbbf24">
            <animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite"/>
            <animate attributeName="r" values="2;7;2" dur="1.8s" repeatCount="indefinite"/>
          </circle>
          <circle cx="110" cy="130" r="4" fill="#60a5fa">
            <animate attributeName="opacity" values="1;0;1" dur="2.3s" repeatCount="indefinite" begin="0.8s"/>
            <animate attributeName="r" values="2;5;2" dur="2.3s" repeatCount="indefinite" begin="0.8s"/>
          </circle>
          <circle cx="190" cy="170" r="3" fill="#f59e0b">
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" begin="1.2s"/>
            <animate attributeName="r" values="1.5;4.5;1.5" dur="1.5s" repeatCount="indefinite" begin="1.2s"/>
          </circle>
        </g>
        {/* Legend */}
        <g opacity="0.9">
          <rect x="10" y="10" width="280" height="70" rx="16" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
          <text x="25" y="35" fontSize="16" fontWeight="bold" fill="#1e293b" textAnchor="start">Category Distribution</text>
          <g transform="translate(25,55)">
            <circle cx="0" cy="0" r="8" fill="#3b82f6"/>
            <text x="20" y="5" fontSize="13" fill="#475569">Notes</text>
            <circle cx="90" cy="0" r="8" fill="#10b981"/>
            <text x="110" y="5" fontSize="13" fill="#475569">Tasks</text>
            <circle cx="180" cy="0" r="8" fill="#f59e0b"/>
            <text x="200" y="5" fontSize="13" fill="#475569">Projects</text>
          </g>
        </g>
      </svg>
    </motion.div>
  );
}

