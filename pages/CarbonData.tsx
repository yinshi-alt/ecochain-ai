import React, { useState } from 'react';
import { CarbonRecord, ScopeType } from '../types';
import { Plus, Upload, FileSpreadsheet, Trash2, CheckCircle, Clock } from 'lucide-react';

interface CarbonDataProps {
  data: CarbonRecord[];
  setData: React.Dispatch<React.SetStateAction<CarbonRecord[]>>;
}

const CarbonData: React.FC<CarbonDataProps> = ({ data, setData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRecord, setNewRecord] = useState<Partial<CarbonRecord>>({
    date: new Date().toISOString().split('T')[0],
    scope: ScopeType.SCOPE_1,
    status: 'pending'
  });

  const handleAdd = () => {
    if (newRecord.source && newRecord.amount) {
      const record: CarbonRecord = {
        id: Math.random().toString(36).substr(2, 9),
        date: newRecord.date || '',
        source: newRecord.source,
        scope: newRecord.scope || ScopeType.SCOPE_1,
        amount: Number(newRecord.amount),
        status: 'pending'
      };
      setData([record, ...data]);
      setIsModalOpen(false);
      setNewRecord({ date: new Date().toISOString().split('T')[0], scope: ScopeType.SCOPE_1, status: 'pending' });
    }
  };

  const handleDelete = (id: string) => {
    setData(data.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">碳排放数据管理</h1>
          <p className="text-slate-500 text-sm mt-1">支持手动录入、Excel 导入及 API 自动对接</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button className="flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            导入 Excel
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-eco-600 text-white rounded-lg text-sm font-medium hover:bg-eco-700 transition-colors shadow-sm shadow-eco-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            新增记录
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">日期</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">排放源</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">排放范围</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">排放量 (tCO₂e)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">状态</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {data.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                    {record.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {record.source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${record.scope === ScopeType.SCOPE_1 ? 'bg-orange-100 text-orange-800' : 
                        record.scope === ScopeType.SCOPE_2 ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                      {record.scope.split(' ')[0]} {record.scope.split(' ')[1]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-mono">
                    {record.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {record.status === 'verified' ? (
                      <div className="flex items-center text-eco-600">
                        <CheckCircle className="w-4 h-4 mr-1.5" />
                        已核查
                      </div>
                    ) : (
                       <div className="flex items-center text-amber-600">
                        <Clock className="w-4 h-4 mr-1.5" />
                        待审核
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleDelete(record.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            <FileSpreadsheet className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>暂无数据，请点击上方按钮添加或导入。</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 animate-fade-in">
            <h2 className="text-xl font-bold text-slate-900">新增排放记录</h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">日期</label>
                <input 
                  type="date" 
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-eco-500 outline-none"
                  value={newRecord.date}
                  onChange={e => setNewRecord({...newRecord, date: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">排放源名称</label>
                <input 
                  type="text" 
                  placeholder="例如：一号车间锅炉"
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-eco-500 outline-none"
                  value={newRecord.source || ''}
                  onChange={e => setNewRecord({...newRecord, source: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">排放范围</label>
                <select 
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-eco-500 outline-none"
                  value={newRecord.scope}
                  onChange={e => setNewRecord({...newRecord, scope: e.target.value as ScopeType})}
                >
                  {Object.values(ScopeType).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">排放量 (tCO₂e)</label>
                <input 
                  type="number" 
                  placeholder="0.00"
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-eco-500 outline-none"
                  value={newRecord.amount || ''}
                  onChange={e => setNewRecord({...newRecord, amount: Number(e.target.value)})}
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                取消
              </button>
              <button 
                onClick={handleAdd}
                className="flex-1 py-2 bg-eco-600 text-white rounded-lg hover:bg-eco-700"
              >
                确认添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarbonData;