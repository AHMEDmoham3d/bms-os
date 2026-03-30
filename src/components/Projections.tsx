import { FinancialProjection, Product } from '../lib/types';
import { Users, DollarSign } from 'lucide-react';
import { financialProjections as staticProjections, products as staticProducts } from '../data/company';

interface ProjectionsProps {
  projections: FinancialProjection[];
  products: Product[];
}

export default function Projections({ projections: propProjections, products: propProducts }: ProjectionsProps) {
  const projections = propProjections.length > 0 ? propProjections : staticProjections;
  const productsData = propProducts.length > 0 ? propProducts : staticProducts;

  const productProjections = productsData.map((product) => {
    const data = projections.filter((p) => p.product_id === product.id);
    const totalRevenue = data.reduce((sum, p) => sum + Number(p.revenue_projection), 0);
    const latest = data[data.length - 1];
    const totalUsers = latest ? latest.user_projection : 0;
    // Removed unused growth calculation

    return {
      product,
      data: data.sort((a, b) => a.year - b.year || a.quarter - b.quarter),
      totalRevenue,
      totalUsers,
    };
  }).filter(p => p.data.length > 0);

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(value);

  const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value);

  return (
    <div className="space-y-16 px-4 lg:px-8">
      <div className="text-center">
        <h2 className="text-4xl font-black text-slate-900 mb-4">Financial Projections</h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Strategic growth forecasts powering our multi-million dollar roadmap
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {productProjections.map(({ product, data, totalRevenue, totalUsers }) => (
        <div key={product.id} className="bg-white/70 backdrop-blur-sm rounded-3xl border border-slate-200 p-12 lg:p-16 shadow-2xl mx-4 lg:mx-0">
            <div className="mb-12">
              <h3 className="text-3xl font-black text-slate-900 mb-6">{product.name}</h3>
              <div className="grid grid-cols-2 gap-8 text-center">
                <div className="p-8 bg-gradient-to-b from-slate-900/5 to-slate-100 rounded-2xl border border-slate-200">
                  <DollarSign className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <p className="text-4xl font-black text-slate-900">{formatCurrency(totalRevenue)}</p>
                  <p className="text-lg text-slate-600 mt-1">Total Revenue</p>
                </div>
                <div className="p-8 bg-gradient-to-b from-slate-900/5 to-slate-100 rounded-2xl border border-slate-200">
                  <Users className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <p className="text-4xl font-black text-slate-900">{formatNumber(totalUsers)}</p>
                  <p className="text-lg text-slate-600 mt-1">Target Clients</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full">
                <thead className="bg-slate-900/5">
                  <tr>
                    <th className="text-left py-4 px-6 text-lg font-semibold text-slate-900 border-b border-slate-200">Quarter</th>
                    <th className="text-right py-4 px-6 text-lg font-semibold text-slate-900 border-b border-slate-200">Revenue</th>
                    <th className="text-right py-4 px-6 text-lg font-semibold text-slate-900 border-b border-slate-200">Clients</th>
                    <th className="text-right py-4 px-6 text-lg font-semibold text-slate-900 border-b border-slate-200">Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.map((projection, index) => {
                    const prev = index > 0 ? data[index - 1] : null;
                    const growth = prev ? ((Number(projection.revenue_projection) - Number(prev.revenue_projection)) / Number(prev.revenue_projection)) * 100 : 0;

                    return (
                      <tr key={projection.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6 text-slate-900 font-semibold">
                          Q{projection.quarter} {projection.year}
                        </td>
                        <td className="py-4 px-6 text-right font-black text-2xl text-slate-900">
                          {formatCurrency(Number(projection.revenue_projection))}
                        </td>
                        <td className="py-4 px-6 text-right text-lg text-slate-700 font-semibold">
                          {formatNumber(projection.user_projection)}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className={`text-xl font-black px-3 py-1 rounded-full ${growth >= 0 ? 'bg-slate-100 text-slate-900 border border-slate-300' : 'bg-slate-200 text-slate-700'}`}>
                            {growth >= 0 ? `+${growth.toFixed(1)}%` : `${growth.toFixed(1)}%`}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

