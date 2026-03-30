import { TeamMember, Sector } from '../lib/types';
import { Mail, Calendar } from 'lucide-react';
import { teamMembers as staticTeam, sectors as staticSectors } from '../data/company';

interface TeamProps {
  teamMembers: TeamMember[];
  sectors: Sector[];
}

export default function Team({ teamMembers: propTeam, sectors: propSectors }: TeamProps) {
  const team = propTeam.length > 0 ? propTeam : staticTeam;
  const sectorsData = propSectors.length > 0 ? propSectors : staticSectors;

  const executives = team.filter((member) => !member.sector_id);
  const sectorTeams = sectorsData.map((sector) => ({
    sector,
    members: team.filter((member) => member.sector_id === sector.id),
  })).filter(({ members }) => members.length > 0);

  return (
    <div className="space-y-16 px-4 lg:px-8">
      <div className="text-center">
        <h2 className="text-4xl font-black text-slate-900 mb-4">Our Leadership</h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-16">
          World-class experts driving innovation across industries
        </p>
      </div>

      {/* Executives */}
      <section className="space-y-8">
        <h3 className="text-2xl font-black text-slate-900 text-center">Executive Leadership</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {executives.map((member) => (
            <div key={member.id} className="group bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-2xl hover:border-slate-300 hover:-translate-y-2 transition-all duration-300 shadow-lg text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl mb-6 flex items-center justify-center shadow-2xl group-hover:shadow-slate-500/25 mx-auto group-hover:scale-110 transition-all">
                <span className="text-2xl font-black text-white tracking-tight drop-shadow-lg">
                  {member.name.split(' ').map((n) => n[0]).join('')}
                </span>
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-2">{member.name}</h4>
              <p className="text-lg font-semibold text-slate-700 mb-4">{member.role}</p>
              <p className="text-slate-600 leading-relaxed mb-6">{member.bio}</p>
              <div className="space-y-3 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-center gap-2 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                  <Mail className="w-4 h-4" />
                  <span className="font-mono">{member.email}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                  <Calendar className="w-4 h-4" />
                  <span>Since {new Date(member.joined_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sector Teams */}
      {sectorTeams.map(({ sector, members }) => (
        <section key={sector.id} className="space-y-8">
          <div className="text-center">
            <h3 className="text-2xl font-black text-slate-900 mb-2">{sector.name} Team</h3>
            <p className="text-lg text-slate-600">Domain experts delivering industry excellence</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member) => (
            <div key={member.id} className="group bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200 p-8 lg:p-10 hover:shadow-xl hover:border-slate-300 hover:bg-white transition-all duration-300 mx-4 lg:mx-0">
                <div className="w-20 h-20 bg-slate-100 rounded-xl mb-4 flex items-center justify-center border-2 border-slate-200 group-hover:border-slate-400 group-hover:bg-slate-200 transition-all">
                  <span className="text-xl font-semibold text-slate-700">
                    {member.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">{member.name}</h4>
                <p className="text-slate-700 font-medium mb-3">{member.role}</p>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">{member.bio}</p>
                <div className="space-y-2 text-xs text-slate-500 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>Joined {new Date(member.joined_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

