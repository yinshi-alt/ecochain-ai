
import React from 'react';
import { Policy } from '../types';
import { Briefcase, CheckCircle, XCircle } from 'lucide-react';

interface UnderwritingProps {
  policies: Policy[];
  onUpdatePolicyStatus: (id: string, status: Policy['status']) => void;
}

const Underwriting: React.FC<UnderwritingProps> = ({ policies, onUpdatePolicyStatus }) => {
  const pendingPolicies = policies.filter(p => p.status === 'pending_review');

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <div>
            <h1 className="text-2xl font-bold text-slate-900">核保审核中心</h1>
            <p className="text-slate-500 text-sm mt-1">审核企业投保申请及 AI 风险评估报告</p>
         </div>
       </div>

       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
             <thead className="bg-slate-50">
                <tr>
                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">申请企业</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">投保产品</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">AI 风险评级</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">保费/保额</th>
                   <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">操作</th>
                </tr>
             </thead>
             <tbody className="bg-white divide-y divide-slate-200">
                {pendingPolicies.map(policy => (
                  <tr key={policy.id} className="hover:bg-slate-50">
                     <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-900">{policy.companyName}</div>
                        <div className="text-xs text-slate-500">{policy.id}</div>
                     </td>
                     <td className="px-6 py-4 text-sm text-slate-600">{policy.productName}</td>
                     <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold
                           ${policy.riskAssessment?.riskLevel === 'LOW' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                           {policy.riskAssessment?.riskLevel || '未知'}
                        </span>
                     </td>
                     <td className="px-6 py-4">
                        <div className="text-sm font-bold text-slate-900">¥{(policy.premium/10000).toFixed(2)}万</div>
                        <div className="text-xs text-slate-500">保额: {policy.coverageAmount}万</div>
                     </td>
                     <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => onUpdatePolicyStatus(policy.id, 'rejected')} className="text-red-600 hover:text-red-900 text-sm font-medium">拒绝</button>
                        <button onClick={() => onUpdatePolicyStatus(policy.id, 'active')} className="text-green-600 hover:text-green-900 text-sm font-medium">通过核保</button>
                     </td>
                  </tr>
                ))}
                {pendingPolicies.length === 0 && (
                  <tr>
                     <td colSpan={5} className="px-6 py-8 text-center text-slate-400 text-sm">暂无待审核保单</td>
                  </tr>
                )}
             </tbody>
          </table>
       </div>
    </div>
  );
};

export default Underwriting;
