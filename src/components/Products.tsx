import { Product, ProductFeature, Sector } from '../lib/types';
import { CheckCircle2, Clock, Circle, ExternalLink } from 'lucide-react';
import { products, productFeatures, sectors } from '../data/company';

interface ProductsProps {
  products: Product[];
  features: ProductFeature[];
  sectors: Sector[];
  projections: any[];
}

export default function Products({ products: propProducts, features: propFeatures, sectors: propSectors }: ProductsProps) {
  const productsData = propProducts.length > 0 ? propProducts : products;
  const featuresData = propFeatures.length > 0 ? propFeatures : productFeatures;
  const sectorsData = propSectors.length > 0 ? propSectors : sectors;

  // Group by sector
  const sectorOrder = ['healthcare', 'education', 'fitness'];
  const groupedProducts = sectorOrder.map(sectorId => {
    const sector = sectorsData.find(s => s.id === sectorId);
    const sectorProducts = productsData.filter(p => p.sector_id === sectorId);
    return { sector, products: sectorProducts };
  }).filter(group => group.products.length > 0);

  const getStatusStyle = (status: string) => {
    const styles = {
      active: 'bg-slate-100 text-slate-800 border-slate-300',
      development: 'bg-slate-100 text-slate-800 border-slate-300',
      planned: 'bg-slate-200 text-slate-700 border-slate-400',
    };
    return styles[status as keyof typeof styles] || styles.planned;
  };

  const getFeatureIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-slate-700" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-slate-600" />;
      default:
        return <Circle className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-16 px-4 lg:px-8">
      <div className="text-center">
        <h2 className="text-4xl font-black text-slate-900 mb-4">Our Products</h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Cutting-edge SaaS solutions designed for enterprise scale
        </p>
      </div>

      <div className="space-y-16">
        {groupedProducts.map(({ sector, products: sectorProducts }) => (
          <section key={sector!.id} className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl font-black text-slate-900 mb-2">{sector!.name}</h3>
              <p className="text-xl text-slate-600">{sector!.description}</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {sectorProducts.map((product) => {
                const productFeatures = featuresData.filter((f) => f.product_id === product.id);

                return (
                  <article key={product.id} className="group bg-white rounded-3xl border border-slate-200 p-10 lg:p-12 hover:shadow-2xl hover:border-slate-300 hover:-translate-y-3 transition-all duration-500 shadow-xl mx-4 lg:mx-0">
                    <div className="flex items-start justify-between mb-8 pb-8 border-b border-slate-100">
                      <div>
                        <h4 className="text-2xl font-black text-slate-900 mb-2">{product.name}</h4>
                        <span className={`px-4 py-2 rounded-xl text-sm font-bold border ${getStatusStyle(product.status)}`}>
                          {product.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-6 mb-8">
                      <div>
                        <h5 className="text-lg font-semibold text-slate-900 mb-3">Description</h5>
                        <p className="text-lg text-slate-600 leading-relaxed">{product.description}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="text-lg font-semibold text-slate-900 mb-3">Vision</h5>
                          <p className="text-slate-600 leading-relaxed">{product.vision}</p>
                        </div>
                        <div>
                          <h5 className="text-lg font-semibold text-slate-900 mb-3">Target Market</h5>
                          <p className="text-slate-600 leading-relaxed">{product.target_market}</p>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-lg font-semibold text-slate-900 mb-4">Key Features</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {productFeatures.slice(0, 6).map((feature) => (
                            <div key={feature.id} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                              {getFeatureIcon(feature.status)}
                              <span className="font-medium text-slate-900">{feature.feature}</span>
                            </div>
                          ))}
                          {productFeatures.length > 6 && (
                            <div className="col-span-full text-center py-4 text-slate-500">
                              +{productFeatures.length - 6} more features
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                      {product.planUrl && (
                        <div className="mb-6">
                          <a
                            href={product.planUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-900 to-gray-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:shadow-xl hover:-translate-y-1 transition-all shadow-lg border border-slate-800/50 hover:from-slate-800 hover:to-gray-800 hover:border-slate-700/50"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View Plan
                          </a>
                        </div>
                      )}
                      <div className="pt-8 border-t border-slate-200">
                        <p className="text-sm text-slate-500 mb-4">
                          Launch: {new Date(product.launch_date).toLocaleDateString('en-US', { 
                            year: 'numeric', month: 'long' 
                          })}
                        </p>
                        <div className="h-px bg-gradient-to-r from-slate-200 to-slate-300" />
                      </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

