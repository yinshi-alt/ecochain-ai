
import React, { useState, useEffect } from 'react';
import { CarbonRecord } from '../types';
import { MOCK_CARBON_DATA, MOCK_SUPPLY_CHAIN } from '../constants';
import { assessCarbonRisk } from '../services/geminiService';
import { Loader2, TrendingUp, TrendingDown, AlertCircle, Map, Globe } from 'lucide-react';

const RiskAssessmentPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Initial Load - automatically trigger assessment for demo
    const loadData = async () => {
      try {
        const result = await assessCarbonRisk(
          "绿动未来制造有限公司", 
          "新能源汽车制造", 
          MOCK_CARBON_DATA,
          MOCK_SUPPLY_CHAIN
        );
        setData(result);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-eco-600 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Gemini AI 正在全网扫描...</h2>
        <p className="text-slate-500 mt-2">正在对比同行业数据、分析供应链风险及查询监管合规要求</p>
      </div>
    );
  }

  if (!data) return <div>加载失败</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">企业碳风险全息画像</h1>
          <p className="text-slate-500 mt-1">基于 Google Gemini 多模态模型深度分析</p>
        </div>
        <div className="text-right">
           <span className="text-xs text-slate-400">报告生成时间</span>
           <div className="font-mono text-sm text-slate-600">{new Date().toLocaleString()}</div>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-xl text-white ${data.riskLevel === 'LOW' ? 'bg-green-600' : 'bg-yellow-600'}`}>
          <div className="text-sm opacity-90 mb-1">综合风险等级</div>
          <div className="text-4xl font-bold">{data.riskLevel === 'LOW' ? '低风险 (优质)' : data.riskLevel}</div>
          <div className="mt-4 flex items-center text-sm opacity-80">
            <AlertCircle className="w-4 h-4 mr-2" />
            击败了 85% 的同业竞争对手
          </div>
        </div>

        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">AI 风险评分</div>
          <div className="flex items-baseline">
            <span className="text-4xl font-bold text-slate-900">{data.riskScore}</span>
            <span className="text-sm text-slate-400 ml-2">/ 100</span>
          </div>
          <div className="mt-4 w-full bg-slate-100 rounded-full h-2">
            <div className="bg-slate-900 h-2 rounded-full" style={{ width: `${data.riskScore}%` }}></div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">建议保费调整</div>
          <div className={`text-4xl font-bold ${data.premiumModifier < 1 ? 'text-green-600' : 'text-red-600'}`}>
            {data.premiumModifier}x
          </div>
          <div className="mt-4 text-sm text-slate-600 flex items-center">
            {data.premiumModifier < 1 ? <TrendingDown className="w-4 h-4 mr-1" /> : <TrendingUp className="w-4 h-4 mr-1" />}
            预计每年节省 ¥{data.projectedSavings.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <h3 className="font-bold text-slate-900 mb-4 flex items-center">
             <Globe className="w-5 h-5 mr-2 text-blue-500" />
             市场基准对比 (Market Benchmarking)
           </h3>
           <p className="text-slate-700 leading-relaxed text-sm p-4 bg-slate-50 rounded-lg">
             {data.marketComparison || "正在获取实时市场数据..."}
           </p>
           <div className="mt-6">
              <h4 className="font-bold text-sm mb-3">详细评估逻辑</h4>
              <p className="text-slate-600 text-sm leading-relaxed">{data.reasoning}</p>
           </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <h3 className="font-bold text-slate-900 mb-4 flex items-center">
             <Map className="w-5 h-5 mr-2 text-eco-600" />
             行动建议 (Action Plan)
           </h3>
           <ul className="space-y-4">
             {data.suggestions.map((s: string, i: number) => (
               <li key={i} className="flex items-start">
                 <div className="w-6 h-6 rounded-full bg-eco-100 text-eco-700 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">
                   {i + 1}
                 </div>
                 <span className="text-slate-700 text-sm pt-0.5">{s}</span>
               </li>
             ))}
           </ul>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessmentPage;
