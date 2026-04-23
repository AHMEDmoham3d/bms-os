import { motion } from 'framer-motion';
import type { Note, Category } from '../lib/types';

interface PieChartProps {
  notes: Note[];
  categories: Category[];
}

const PALETTE = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#f97316',
  '#ec4899',
];

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg - 90) * Math.PI / 180.0;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function donutSegment(
  cx: number,
  cy: number,
  rOut: number,
  rIn: number,
  start: number,
  end: number
) {
  const p1 = polar(cx, cy, rOut, start);
  const p2 = polar(cx, cy, rOut, end);
  const p3 = polar(cx, cy, rIn, end);
  const p4 = polar(cx, cy, rIn, start);
  const largeArc = end - start <= 180 ? 0 : 1;
  return [
    `M ${p1.x} ${p1.y}`,
    `A ${rOut} ${rOut} 0 ${largeArc} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${rIn} ${rIn} 0 ${largeArc} 0 ${p4.x} ${p4.y}`,
    'Z',
  ].join(' ');
}

export default function PieChart({ notes, categories }: PieChartProps) {
  const data = categories
    .map((cat, i) => ({
      ...cat,
      count: notes.filter((n) => n.category_id === cat.id).length,
      color: PALETTE[i % PALETTE.length],
    }))
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count);

  const total = data.reduce((sum, d) => sum + d.count, 0);

  let currentAngle = 0;
  const slices = data.map((d) => {
    const sliceAngle = total === 0 ? 0 : (d.count / total) * 360;
    const start = currentAngle;
    const end = currentAngle + sliceAngle;
    currentAngle = end;
    return {
      ...d,
      start,
      end,
      pct: total === 0 ? 0 : Math.round((d.count / total) * 100),
    };
  });

  const cx = 150;
  const cy = 150;
  const rOut = 110;
  const rIn = 65;

  if (total === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl">
        <span className="text-6xl font-black text-slate-300">📊</span>
        <p className="text-sm text-slate-500 mt-4 text-center">No data yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative h-64 w-full flex items-center justify-center"
      >
        <svg viewBox="0 0 300 300" className="w-full h-full mx-auto drop-shadow-2xl">
          {slices.map((slice) => (
            <path
              key={slice.id}
              d={donutSegment(cx, cy, rOut, rIn, slice.start, slice.end)}
              fill={slice.color}
              stroke="white"
              strokeWidth={3}
            >
              <title>
                {slice.name}: {slice.count} ({slice.pct}%)
              </title>
            </path>
          ))}
          {/* subtle inner ring */}
          <circle cx={cx} cy={cy} r={rIn - 4} fill="white" />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black text-slate-800 leading-none">{total}</span>
            <span className="text-xs text-slate-500 font-medium mt-1">Notes</span>
          </div>
        </div>
      </motion.div>

      <div className="mt-4 flex flex-wrap gap-3 justify-center w-full">
        {slices.map((slice) => (
          <div
            key={slice.id}
            className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100"
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-xs font-semibold text-slate-700">
              {slice.name}
            </span>
            <span className="text-xs text-slate-500">
              {slice.count} ({slice.pct}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
