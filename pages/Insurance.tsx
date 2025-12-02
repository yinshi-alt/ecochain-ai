
import React, { useState } from 'react';
import { INSURANCE_PRODUCTS, MOCK_SUPPLY_CHAIN } from '../constants';
import { CarbonRecord, InsuranceProduct, RiskAssessment } from '../types';
import { assessCarbonRisk } from '../services/geminiService';
import { Shield, Check, Loader2, Sparkles } from 'lucide-react';

interface InsuranceProps {
  carbonData: CarbonRecord[];
  addPolicy: (product: InsuranceProduct, assessment: RiskAssessment) => void;
}

const Insurance: React.FC<InsuranceProps> = ({ carbonData, addPolicy }) => {
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [assessmentResult, setAssessmentResult] = useState<RiskAssessment | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<InsuranceProduct | null>(null);

  const handleAssessment = async (product: InsuranceProduct) => {
    setAnalyzingId(product.id);
    setSelectedProduct(product);
    setAssessmentResult(null);
    try {
      // 模拟传递企业信息
      const result = await assessCarbonRisk("绿动未来制造有限公司", "制造业/重工业", carbonData, MOCK_SUPPLY_CHAIN);
      setAssessmentResult(result);
    } catch (error) {
      alert("AI 评估失败，请重试");
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleBuy = () => {
    if (selectedProduct && assessmentResult) {
      addPolicy(selectedProduct, assessmentResult);
      setAssessmentResult(null); // Close modal
      alert("投保申请已提交！请前往控制台等待保险公司核保。");
    }
  };

  const calculateFinalPremium = (base: number, modifier: number) => {
    return (base * modifier).toFixed(2);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">绿色保险超市</h1>
        <p className="text-slate-500 mt-1">AI 驱动的个性化定价，您的减排努力可以直接转化为保费折扣。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INSURANCE_PRODUCTS.map(product => (
          <div key={product.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col">
            <div className="p-6 flex-1">
              <div className="w-12 h-12 bg-insure-50 rounded-lg flex items-center justify-center mb-4 text-insure-600">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
              <p className="text-sm text-slate-500 mt-2 min-h-[40px]">{product.description}</p>
              
              <div className="mt-6 space-y-2">
                {product.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center text-sm text-slate-700">
                    <Check className="w-4 h-4 text-eco-500 mr-2" />
                    {feature}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-xs text-slate-400">基础费率</span>
                    <div className="text-xl font-bold text-slate-900">{product.basePremiumRate}%</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">最高保额</span>
                    <div className="text-lg font-bold text-slate-700">¥{product.coverageLimit}万</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-b-xl border-t border-slate-100">
              <button
                onClick={() => handleAssessment(product)}
                className="w-full py-2.5 bg-insure-600 text-white rounded-lg font-medium hover:bg-insure-700 transition-colors flex items-center justify-center shadow-sm shadow-insure-200"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI 评估与报价
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* AI Assessment Modal */}
      {(analyzingId || assessmentResult) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden animate-fade-in">
            
            {/* Loading State */}
            {analyzingId && !assessmentResult && (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <Loader2 className="w-12 h-12 text-insure-500 animate-spin mb-4" />
                <h3 className="text-xl font-bold text-slate-900">Gemini AI 正在评估...</h3>
                <p className="text-slate-500 mt-2 max-w-sm">
                  正在分析您的 Scope 1/2/3 历史数据，并结合行业基准计算风险等级。
                </p>
              </div>
            )}

            {/* Result State */}
            {assessmentResult && selectedProduct && (
              <div className="flex flex-col h-full">
                <div className="bg-insure-600 p-6 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold">智能核保报告</h2>
                      <p className="opacity-80 text-sm mt-1">产品：{selectedProduct.name}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                      ${assessmentResult.riskLevel === 'LOW' ? 'bg-green-400 text-green-900' : 
                        assessmentResult.riskLevel === 'MEDIUM' ? 'bg-yellow-400 text-yellow-900' : 'bg-red-400 text-red-900'}`}>
                      {assessmentResult.riskLevel === 'LOW' ? '低风险' : assessmentResult.riskLevel === 'MEDIUM' ? '中风险' : '高风险'}
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Score & Premium */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-sm text-slate-500">AI 风险评分</span>
                      <div className="text-3xl font-bold text-slate-900 mt-1">{assessmentResult.riskScore} <span className="text-sm text-slate-400 font-normal">/ 100</span></div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-sm text-slate-500">个性化费率系数</span>
                      <div className={`text-3xl font-bold mt-1
                        ${assessmentResult.premiumModifier < 1 ? 'text-green-600' : 'text-red-600'}`}>
                        {assessmentResult.premiumModifier}x
                      </div>
                      <span className="text-xs text-slate-400">
                        基础 {selectedProduct.basePremiumRate}% ➔ 
                        实付 {calculateFinalPremium(selectedProduct.basePremiumRate, assessmentResult.premiumModifier)}%
                      </span>
                    </div>
                  </div>

                  {/* Reasoning */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2 flex items-center">
                      <Sparkles className="w-4 h-4 mr-1 text-insure-500" />
                      AI 分析结论
                    </h4>
                    <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {assessmentResult.reasoning}
                    </p>
                  </div>

                  {/* Suggestions */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">
                      降低保费建议
                    </h4>
                    <ul className="space-y-2">
                      {assessmentResult.suggestions.map((suggestion, i) => (
                        <li key={i} className="flex items-start text-sm text-slate-600">
                          <Check className="w-4 h-4 text-eco-500 mr-2 mt-0.5 flex-shrink-0" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 text-xs text-eco-600 font-medium">
                      预计年节省保费: ¥{assessmentResult.projectedSavings.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3 rounded-b-xl">
                  <button 
                    onClick={() => setAssessmentResult(null)}
                    className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-white transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleBuy}
                    className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                  >
                    确认投保
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Insurance;
