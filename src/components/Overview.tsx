import { CompanyInfo } from '../lib/types';
import { Target, Eye, Calendar } from 'lucide-react';

interface OverviewProps {
  company: CompanyInfo;
}

export default function Overview({ company }: OverviewProps) {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">About Us</h2>
        <p className="text-gray-600 leading-relaxed">{company.description}</p>
        <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>Founded in {company.founded_year}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-6 h-6 text-gray-900" />
            <h3 className="text-lg font-semibold text-gray-900">Vision</h3>
          </div>
          <p className="text-gray-600 leading-relaxed">{company.vision}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-gray-900" />
            <h3 className="text-lg font-semibold text-gray-900">Mission</h3>
          </div>
          <p className="text-gray-600 leading-relaxed">{company.mission}</p>
        </div>
      </div>
    </div>
  );
}
