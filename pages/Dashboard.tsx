
import React, { useState } from 'react';
import { CarbonRecord, Policy, UserRole, ClaimRecord, LoanApplication } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ArrowUpRight, ArrowDownRight, TrendingDown, Shield, Users, Briefcase, AlertTriangle, FileText } from 'lucide-react';

interface DashboardProps {
  carbonData: CarbonRecord[];
  policies: Policy[];
  userRole: UserRole;
  claims: ClaimRecord[];
  loans: LoanApplication[];
}

const StatCard = ({ title, value, subtext, trend, icon: Icon, colorClass }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
      {trend && (
        <span className={`flex items-center text-xs font-medium ${trend === 'up' ? 'text-red-600' : 'text-green-600'}`}>
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
          {trend === 'up' ? '+2.5%' : '-4.1%'}
        </span>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
    <p className="text-slate-400 text-xs mt-2">{subtext}</p>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ carbonData, policies, userRole, claims, loans }) => {
  const [suggestionModalOpen, setSuggestionModalOpen] = useState(false);

  // Insurer Dashboard
  if (userRole === UserRole.INSURER) {
    const pendingPolicies = policies.filter(p => p.status === 'pending_review').length;
    const pendingClaims = claims.filter(c => c.status === 'processing' || c.status === 'manual_review').length;
    
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">保险机构工作台</h1>
          <div className="mt-2 sm:mt-0 text-sm text-slate-500">
            管理员: Admin_001 | {new Date().toLocaleDateString()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="待审核投保" 
            value={pendingPolicies || "12"}
            subtext="较昨日新增 3 单"
            trend="up"
            icon={Briefcase}
            colorClass="bg-blue-500 text-blue-600"
          />
          <StatCard 
            title="待处理理赔" 
            value={pendingClaims || "5"} 
            subtext="其中 2 单需人工复核"
            icon={AlertTriangle}
            colorClass="bg-orange-500 text-orange-600"
          />
          <StatCard 
            title="服务企业总数" 
            value="128" 
            subtext="本月新增 12 家"
            trend="up"
            icon={Users}
            colorClass="bg-indigo-500 text-indigo-600"
          />
           <StatCard 
            title="生效保单总额" 
            value="¥ 8.5 亿" 
            subtext="风险敞口可控"
            icon={Shield}
            colorClass="bg-green-500 text-green-600"
          />
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <h3 className="text-lg font-bold text-slate-900 mb-4">待办任务列表</h3>
           <div className="overflow-hidden">
             <table className="min-w-full divide-y divide-slate-200">
               <thead className="bg-slate-50">
                 <tr>
                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">任务类型</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">关联客户</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">提交时间</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">状态</th>
                   <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">操作</th>
                 </tr>
               </thead>
               <tbody className="bg-white divide-y divide-slate-200">
                 {[
                   {type: '理赔审核', client: '绿动未来制造', time: '10分钟前', status: '人工复核'},
                   {type: '投保核保', client: '宏达钢铁', time: '1小时前', status: '待审核'},
                   {type: '理赔审核', client: '速达物流', time: '2小时前', status: '人工复核'},
                 ].map((task, idx) => (
                   <tr key={idx}>
                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{task.type}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{task.client}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{task.time}</td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-700 font-bold">{task.status}</span>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-blue-600 hover:text-blue-900 cursor-pointer">
                       处理
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    );
  }

  // Enterprise Dashboard (Original Logic)
  const monthlyData = [
    { name: '1月', scope1: 40, scope2: 24, scope3: 24 },
    { name: '2月', scope1: 30, scope2: 13, scope3: 22 },
    { name: '3月', scope1: 20, scope2: 58, scope3: 22 },
    { name: '4月', scope1: 27, scope2: 39, scope3: 20 },
    { name: '5月', scope1: 18, scope2: 48, scope3: 21 },
    { name: '6月', scope1: 23, scope2: 38, scope3: 25 },
    { name: '7月', scope1: 34, scope2: 43, scope3: 21 },
  ];
  const totalCarbon = carbonData.reduce((acc, curr) => acc + curr.amount, 0).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">企业碳管理总览</h1>
        <div className="mt-2 sm:mt-0 text-sm text-slate-500">
          最后更新: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="年度累计碳排放" 
          value={`${totalCarbon} tCO₂e`}
          subtext="距离年度限额还剩 45%"
          trend="down"
          icon={TrendingDown}
          colorClass="bg-eco-500 text-eco-600"
        />
        <StatCard 
          title="生效中保单" 
          value={policies.length} 
          subtext="保障总额: ¥3,500 万"
          icon={Shield}
          colorClass="bg-insure-500 text-insure-600"
        />
        <StatCard 
          title="AI 风险评分" 
          value="42 / 100" 
          subtext="风险等级: 低 (优秀)"
          trend="down"
          icon={TrendingDown}
          colorClass="bg-yellow-500 text-yellow-600"
        />
         <StatCard 
          title="预计减排收益" 
          value="¥ 12.5 万" 
          subtext="基于当前减排策略"
          trend="up"
          icon={ArrowUpRight}
          colorClass="bg-purple-500 text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">排放趋势分析 (Scope 1/2/3)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorS1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorS2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="scope1" stackId="1" stroke="#22c55e" fill="url(#colorS1)" name="直接排放" />
                <Area type="monotone" dataKey="scope2" stackId="1" stroke="#3b82f6" fill="url(#colorS2)" name="能源排放" />
                <Area type="monotone" dataKey="scope3" stackId="1" stroke="#f59e0b" fill="#fef3c7" name="间接排放" />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Notifications / Recommendations */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-4">智能合规建议</h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg cursor-pointer hover:bg-red-100 transition-colors" onClick={() => setSuggestionModalOpen(true)}>
              <div className="flex justify-between items-start">
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded">预警</span>
                <span className="text-xs text-slate-400">2小时前</span>
              </div>
              <p className="text-sm text-slate-800 mt-2 font-medium">Scope 2 排放异常波动</p>
              <p className="text-xs text-slate-600 mt-1">二号厂房电力消耗超出基准值 15%...</p>
            </div>

            <div className="p-3 bg-insure-50 border border-insure-100 rounded-lg cursor-pointer hover:bg-insure-100 transition-colors" onClick={() => setSuggestionModalOpen(true)}>
              <div className="flex justify-between items-start">
                <span className="bg-insure-100 text-insure-700 text-xs font-bold px-2 py-0.5 rounded">保险</span>
                <span className="text-xs text-slate-400">昨天</span>
              </div>
              <p className="text-sm text-slate-800 mt-2 font-medium">保费优化机会</p>
              <p className="text-xs text-slate-600 mt-1">碳足迹险续保可享受 8.5 折优惠。</p>
            </div>
             <div className="p-3 bg-eco-50 border border-eco-100 rounded-lg cursor-pointer hover:bg-eco-100 transition-colors" onClick={() => setSuggestionModalOpen(true)}>
              <div className="flex justify-between items-start">
                <span className="bg-eco-100 text-eco-700 text-xs font-bold px-2 py-0.5 rounded">减排</span>
                <span className="text-xs text-slate-400">2天前</span>
              </div>
              <p className="text-sm text-slate-800 mt-2 font-medium">新光伏项目已并网</p>
              <p className="text-xs text-slate-600 mt-1">预计下月 Scope 2 排放将减少 20 吨。</p>
            </div>
          </div>
          <button 
            onClick={() => setSuggestionModalOpen(true)}
            className="mt-4 w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            查看全部建议
          </button>
        </div>
      </div>

      {/* Suggestion Modal */}
      {suggestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 animate-fade-in max-h-[80vh] overflow-y-auto">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">智能合规与优化建议中心</h2>
                <button onClick={() => setSuggestionModalOpen(false)} className="text-slate-400 hover:text-slate-600">×</button>
             </div>
             <div className="space-y-4">
                {[1,2,3].map((i) => (
                  <div key={i} className="p-4 border border-slate-100 rounded-lg bg-slate-50">
                    <div className="flex justify-between mb-2">
                       <h3 className="font-bold text-slate-800">建议 #{i}: 优化供应链物流路径</h3>
                       <span className="text-xs text-slate-500">优先级: 高</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">AI 分析发现您的上游物流运输碳排放（Scope 3）高于行业平均水平 12%。建议整合物流供应商，使用新能源车队。</p>
                    <div className="flex gap-2">
                       <button className="text-xs bg-eco-600 text-white px-3 py-1 rounded">采纳建议</button>
                       <button className="text-xs border border-slate-300 text-slate-600 px-3 py-1 rounded">稍后提醒</button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
