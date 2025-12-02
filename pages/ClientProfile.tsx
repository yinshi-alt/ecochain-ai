
import React from 'react';
import { CarbonRecord, Policy, ClaimRecord, LoanApplication } from '../types';
import { Factory, Shield, AlertTriangle, Landmark, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface ClientProfileProps {
  carbonData: CarbonRecord[];
  policies: Policy[];
  claims: ClaimRecord[];
  loans: LoanApplication[];
}

const ClientProfile: React.FC<ClientProfileProps> = ({ carbonData, policies, claims, loans }) => {
  // Mock aggregation
  const totalEmission = carbonData.reduce((acc, curr) => acc + curr.amount, 0);
  const chartData = [
    { name: 'Scope 1', val: carbonData.filter(c => c.scope.includes('Scope 1')).reduce((a,c) => a+c.amount, 0) },
    { name: 'Scope 2', val: carbonData.filter(c => c.scope.includes('Scope 2')).reduce((a,c) => a+c.amount, 0) },
    { name: 'Scope 3', val: carbonData.filter(c => c.scope.includes('Scope 3')).reduce((a,c) => a+c.amount, 0) },
  ];

  return (
    <div className="space-y-6">
       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
             <div className="flex items-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mr-4">
                   <Factory className="w-8 h-8 text-slate-500" />
                </div>
                <div>
                   <h1 className="text-2xl font-bold text-slate-900">绿动未来制造有限公司</h1>
                   <p className="text-slate-500 text-sm">统一社会信用代码: 91310000MA1FL4... | 行业: 制造业</p>
                </div>
             </div>
             <div className="mt-4 md:mt-0 flex gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">碳信用 AA</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">合规风险 低</span>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 border-t border-slate-100 pt-6">
             <div>
                <div className="text-sm text-slate-500 mb-1">年度碳排放总量</div>
                <div className="text-2xl font-bold text-slate-900">{totalEmission.toFixed(1)} <span className="text-sm font-normal">tCO2e</span></div>
             </div>
             <div>
                <div className="text-sm text-slate-500 mb-1">在保保单数</div>
                <div className="text-2xl font-bold text-slate-900">{policies.length}</div>
             </div>
             <div>
                <div className="text-sm text-slate-500 mb-1">历史理赔次数</div>
                <div className="text-2xl font-bold text-slate-900">{claims.length}</div>
             </div>
             <div>
                <div className="text-sm text-slate-500 mb-1">信贷风险敞口</div>
                <div className="text-2xl font-bold text-teal-600">¥{loans.filter(l => l.status === 'approved').reduce((a,c) => a+c.amount, 0)}万</div>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-900 mb-4">排放结构分析</h3>
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={chartData}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Bar dataKey="val" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={50} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-900 mb-4">近期风险事件 (理赔/违规)</h3>
             <div className="space-y-4 max-h-64 overflow-y-auto">
                {claims.length > 0 ? claims.map(c => (
                   <div key={c.id} className="flex items-start p-3 bg-slate-50 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-orange-500 mr-3 mt-0.5" />
                      <div>
                         <div className="text-sm font-bold text-slate-900">{c.description}</div>
                         <div className="text-xs text-slate-500">{c.date} | 金额: ¥{c.amount}</div>
                      </div>
                   </div>
                )) : (
                   <div className="text-slate-400 text-sm">暂无风险事件</div>
                )}
             </div>
          </div>
       </div>

       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">关联保单</h3>
          <table className="min-w-full divide-y divide-slate-200">
             <thead className="bg-slate-50">
                <tr>
                   <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">产品</th>
                   <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">保额</th>
                   <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">状态</th>
                   <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">到期日</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-200">
                {policies.map(p => (
                   <tr key={p.id}>
                      <td className="px-4 py-2 text-sm">{p.productName}</td>
                      <td className="px-4 py-2 text-sm">¥{p.coverageAmount}万</td>
                      <td className="px-4 py-2 text-sm">
                         <span className={`px-2 py-0.5 rounded text-xs ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                            {p.status}
                         </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-slate-500">{p.endDate}</td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
};

export default ClientProfile;
