import React, { useEffect, useState } from 'react';
import { useData } from '../../contexts/DataContext';

const AdminDressTypes: React.FC = () => {
  const { dressTypes, updateDressTypePricing } = useData();
  const [draft, setDraft] = useState<Record<string, { wash: number; iron: number; washIron: number; dryClean: number }>>({});

  useEffect(() => {
    const next: Record<string, { wash: number; iron: number; washIron: number; dryClean: number }> = {};
    dressTypes.forEach(dt => { next[dt.id] = { ...dt.pricing }; });
    setDraft(next);
  }, [dressTypes]);

  const onChange = (id: string, field: 'wash'|'iron'|'washIron'|'dryClean', value: number) => {
    setDraft(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const onSave = (id: string) => {
    const data = draft[id];
    if (!data) return;
    updateDressTypePricing(id, data);
  };

  const adjust = (
    id: string,
    field: 'wash'|'iron'|'washIron'|'dryClean',
    delta: number
  ) => {
    const current = draft[id]?.[field] ?? 0;
    const next = Math.max(0, Math.round((current + delta) * 100) / 100);
    setDraft(prev => ({ ...prev, [id]: { ...prev[id], [field]: next } }));
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900">Dress Types</h1>
        <p className="text-gray-600 mt-2">Manage supported dress types</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dressTypes.map(dt => (
          <div key={dt.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-lg font-semibold text-gray-900">{dt.name}</div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 uppercase">{dt.category}</span>
            </div>
            <div className="text-sm text-gray-700 space-y-3">
              {([
                ['wash', 'Wash'],
                ['iron', 'Iron'],
                ['washIron', 'Wash & Iron'],
                ['dryClean', 'Dry Clean']
              ] as const).map(([field, label]) => (
                <div key={field} className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-gray-600 text-xs">{label}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => adjust(dt.id, field, -5)}
                      className="px-2 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      -5
                    </button>
                    <button
                      type="button"
                      onClick={() => adjust(dt.id, field, -1)}
                      className="px-2 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      -1
                    </button>
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold min-w-[72px] text-center">
                      ₹{(draft[dt.id]?.[field] ?? (dt.pricing as any)[field]).toString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => adjust(dt.id, field, 1)}
                      className="px-2 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      +1
                    </button>
                    <button
                      type="button"
                      onClick={() => adjust(dt.id, field, 5)}
                      className="px-2 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      +5
                    </button>
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <button
                  onClick={() => onSave(dt.id)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Save Prices
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDressTypes;


