
import React, { useState } from 'react';
import { LoanApplication, UserRole } from '../types';
import { assessGreenCredit } from '../services/geminiService';
import { Landmark, Plus, Loader2, CheckCircle, XCircle, TrendingUp, AlertCircle, Search } from 'lucide-react';

interface CreditProps {
  userRole: UserRole;
  loans: LoanApplication[];
  onCreateLoan: (loan: LoanApplication) => void;
  onUpdateLoan: (id: string, status: LoanApplication['status']) => void;
}

const Credit: React.FC<CreditProps> = ({ userRole, loans, onCreateLoan, onUpdateLoan }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Application Form
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [term, setTerm] = useState('12');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleApply = async () => {
    setIsAnalyzing(true);
    try {
      // AI Pre-assessment
      const assessment = await assessGreenCredit("绿动未来制造有限公司", Number(amount), purpose);
      
      const newLoan: LoanApplication = {
        id: `LN-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        companyName: "绿动未来制造有限公司",
        purpose,
        amount: Number(amount),
        termMonths: Number(term),
        carbonCreditRating: assessment.carbonCreditRating,
        suggestedInterestRate: assessment.suggestedInterestRate,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        aiAnalysis: assessment.analysis
      };
      
      onCreateLoan(newLoan);
      setIsModalOpen(false);
      setAmount(''); setPurpose('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Bank View
  if (userRole === UserRole.BANK) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">信贷审批中心</h1>
            <p className="text-slate-500 text-sm mt-1">绿色金融 · 碳信用贷 · 技改专项贷</p>
          </div>
          <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-slate-200">
            <Search className="w-4 h-4 text-slate-400" />
            <input type="text" placeholder="搜索企业..." className="outline-none text-sm" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">申请企业</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">贷款金额 / 期限</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">用途</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">碳信用评级</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">AI 建议利率</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {loans.filter(l => l.status === 'pending').map(loan => (
                <tr key={loan.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900">{loan.companyName}</div>
                    <div className="text-xs text-slate-500">{loan.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900">¥{loan.amount}万</div>
                    <div className="text-xs text-slate-500">{loan.termMonths}个月</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{loan.purpose}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold
                      ${['AAA','AA','A'].includes(loan.carbonCreditRating) ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {loan.carbonCreditRating}级
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-teal-600">
                    {loan.suggestedInterestRate}%
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => onUpdateLoan(loan.id, 'rejected')} className="text-red-600 hover:text-red-900 text-sm">拒绝</button>
                    <button onClick={() => onUpdateLoan(loan.id, 'approved')} className="text-teal-600 hover:text-teal-900 text-sm font-medium">批准</button>
                  </td>
                </tr>
              ))}
              {loans.filter(l => l.status === 'pending').length === 0 && (
                <tr>
                   <td colSpan={6} className="px-6 py-8 text-center text-slate-400 text-sm">暂无待审批申请</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Enterprise View
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">绿色信贷服务</h1>
          <p className="text-slate-500 text-sm mt-1">碳信用变现，助力企业低碳转型</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          申请贷款
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl p-6 text-white shadow-lg shadow-teal-200">
            <div className="text-sm opacity-90 mb-1">当前碳信用授信额度</div>
            <div className="text-3xl font-bold mb-4">¥ 1,500 <span className="text-lg font-normal opacity-80">万</span></div>
            <div className="flex items-center text-sm bg-white/20 p-2 rounded-lg backdrop-blur-sm">
               <TrendingUp className="w-4 h-4 mr-2" />
               您的碳评级 AA，利率优惠 15%
            </div>
         </div>
      </div>

      <h3 className="text-lg font-bold text-slate-900 mt-4">申请记录</h3>
      <div className="space-y-4">
        {loans.map(loan => (
          <div key={loan.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6">
             <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                   <div className="font-bold text-slate-900 text-lg">¥{loan.amount}万 <span className="text-sm text-slate-500 font-normal">/ {loan.termMonths}个月</span></div>
                   <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                      ${loan.status === 'approved' ? 'bg-green-100 text-green-700' : 
                        loan.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {loan.status === 'approved' ? '已放款' : loan.status === 'rejected' ? '已拒绝' : '审核中'}
                   </span>
                </div>
                <p className="text-slate-600 text-sm mb-2"><span className="font-semibold">用途:</span> {loan.purpose}</p>
                <div className="text-xs text-slate-400">申请单号: {loan.id} | 日期: {loan.date}</div>
             </div>
             <div className="md:w-1/3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex items-center text-teal-700 font-bold text-sm mb-2">
                   <Landmark className="w-4 h-4 mr-2" />
                   AI 评估建议
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-2">{loan.aiAnalysis}</p>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                   <span className="text-xs text-slate-500">建议利率</span>
                   <span className="font-bold text-teal-600">{loan.suggestedInterestRate}%</span>
                </div>
             </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in">
             <h2 className="text-xl font-bold text-slate-900 mb-4">绿色贷款申请</h2>
             <div className="space-y-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">贷款用途</label>
                   <textarea 
                     className="w-full border border-slate-300 rounded-lg p-2 text-sm h-20"
                     placeholder="例如：购买节能设备、光伏电站建设..."
                     value={purpose} onChange={e => setPurpose(e.target.value)}
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">金额 (万元)</label>
                      <input 
                        type="number" className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                        value={amount} onChange={e => setAmount(e.target.value)}
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">期限 (月)</label>
                      <select className="w-full border border-slate-300 rounded-lg p-2 text-sm" value={term} onChange={e => setTerm(e.target.value)}>
                         <option value="12">12个月</option>
                         <option value="24">24个月</option>
                         <option value="36">36个月</option>
                         <option value="60">60个月</option>
                      </select>
                   </div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg flex items-start">
                   <AlertCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5" />
                   <p className="text-xs text-blue-700">系统将自动调取您的碳排放历史数据及 Scope 3 供应链评级进行风险测算。</p>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2 border border-slate-300 rounded-lg text-slate-600">取消</button>
                  <button onClick={handleApply} disabled={isAnalyzing} className="flex-1 py-2 bg-teal-600 text-white rounded-lg flex justify-center items-center">
                     {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : '提交申请'}
                  </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Credit;
