import { Sector } from '../lib/types';
import { Heart, GraduationCap, Dumbbell } from 'lucide-react';
import { sectors } from '../data/company';  // Static data

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart,
  GraduationCap,
  Dumbbell,
};

export default function Sectors({ sectors: propSectors }: { sectors: Sector[] }) {
  const sectorsData = propSectors.length > 0 ? propSectors : sectors;

  return (
    <div className="space-y-12 px-4 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-4">Our Sectors</h2>
        <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">Comprehensive SaaS solutions across healthcare, education, and fitness industries</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sectorsData.map((sector) => {
          const Icon = iconMap[sector.icon as keyof typeof iconMap] || Heart;
          return (
            <div key={sector.id} className="group bg-white rounded-2xl border border-slate-200 p-10 lg:p-12 hover:shadow-2xl hover:border-slate-300 hover:-translate-y-2 transition-all duration-300 shadow-lg mx-4 lg:mx-0">
              <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-slate-800 shadow-xl group-hover:shadow-2xl transition-all">
                <Icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 text-center">{sector.name}</h3>
              <p className="text-lg text-slate-600 leading-relaxed text-center mb-8">{sector.description}</p>
              <div className="h-1 bg-gradient-to-r from-slate-900 to-slate-700 rounded-full mx-auto w-24 group-hover:w-32 transition-all" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

