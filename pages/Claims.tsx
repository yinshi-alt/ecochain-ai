
import React, { useState } from 'react';
import { ClaimRecord, UserRole } from '../types';
import { analyzeClaim } from '../services/geminiService';
import { Upload, FileText, CheckCircle, AlertTriangle, Loader2, Play, Gavel, XCircle, Clock } from 'lucide-react';

interface ClaimsProps {
  userRole?: UserRole;
  claims: ClaimRecord[];
  onCreateClaim: (claim: ClaimRecord) => void;
  onUpdateClaim: (id: string, updates: Partial<ClaimRecord>) => void;
}

const Claims: React.FC<ClaimsProps> = ({ userRole = UserRole.ENTERPRISE, claims, onCreateClaim, onUpdateClaim }) => {
  const [isNewClaimOpen, setIsNewClaimOpen] = useState(false);
  
  // New Claim Form State
  const [policyId, setPolicyId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [evidenceText, setEvidenceText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  // Manual Review State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<ClaimRecord | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const handleAIAnalysis = async () => {
    if (!description || !evidenceText) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeClaim(description, evidenceText);
      setAiResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmitClaim = () => {
    if (!aiResult) return;
    
    // Logic: If confidence is low or action is manual_review, set status to manual_review
    const status = (aiResult.recommendedAction === 'APPROVE' && aiResult.confidence > 80) 
      ? 'approved' 
      : (aiResult.recommendedAction === 'REJECT' && aiResult.confidence > 90) ? 'rejected' : 'manual_review';

    const newClaim: ClaimRecord = {
      id: `CL-${Date.now()}`,
      policyId,
      date: new Date().toISOString().split('T')[0],
      type: 'general',
      amount: Number(amount),
      description,
      evidenceText,
      status: status,
      aiAnalysis: aiResult.reason,
      confidenceScore: aiResult.confidence
    };
    onCreateClaim(newClaim);
    setIsNewClaimOpen(false);
    setPolicyId(''); setAmount(''); setDescription(''); setEvidenceText(''); setAiResult(null);
  };

  const openReview = (claim: ClaimRecord) => {
    setSelectedClaim(claim);
    setReviewNotes('');
    setReviewModalOpen(true);
  };

  const submitManualReview = (status: 'approved' | 'rejected') => {
    if (!selectedClaim) return;
    onUpdateClaim(selectedClaim.id, {
      status,
      manualReviewer: 'Admin_Current',
      manualReviewDate: new Date().toISOString(),
      manualReviewNotes: reviewNotes
    });
    setReviewModalOpen(false);
    setSelectedClaim(null);
  };

  // --- Insurer View (Review Center) ---
  if (userRole === UserRole.INSURER) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">理赔审核中心</h1>
            <p className="text-slate-500 text-sm mt-1">处理 AI 无法决断的复杂案件</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">申请单号</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">申请时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">金额</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">AI 建议</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">状态</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {claims.map(claim => (
                <tr key={claim.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{claim.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{claim.date}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">¥{claim.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center">
                       <span className={`text-xs mr-2 font-bold ${claim.confidenceScore && claim.confidenceScore > 80 ? 'text-green-600' : 'text-orange-600'}`}>
                         {claim.confidenceScore}% 置信度
                       </span>
                    </div>
                    <div className="text-xs text-slate-500 truncate w-48" title={claim.aiAnalysis}>{claim.aiAnalysis}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-bold
                      ${claim.status === 'manual_review' ? 'bg-orange-100 text-orange-700' : 
                        claim.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {claim.status === 'manual_review' ? '待人工复核' : claim.status === 'approved' ? '已通过' : '已驳回'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {claim.status === 'manual_review' && (
                      <button 
                        onClick={() => openReview(claim)}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      >
                        审核
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Manual Review Modal */}
        {reviewModalOpen && selectedClaim && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 animate-fade-in">
               <h2 className="text-xl font-bold text-slate-900 mb-4">理赔人工复核</h2>
               <div className="grid grid-cols-2 gap-6 mb-4">
                 <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">案件详情</h3>
                    <p className="text-sm mb-1"><span className="font-semibold">描述:</span> {selectedClaim.description}</p>
                    <p className="text-sm mb-1"><span className="font-semibold">金额:</span> ¥{selectedClaim.amount}</p>
                    <div className="mt-3 text-xs text-slate-600 bg-white p-2 border rounded">
                      <span className="font-semibold block mb-1">凭证内容:</span>
                      {selectedClaim.evidenceText}
                    </div>
                 </div>
                 <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-xs font-bold text-purple-700 uppercase mb-2">AI 分析意见</h3>
                    <p className="text-sm text-purple-900 mb-2">{selectedClaim.aiAnalysis}</p>
                    <div className="flex items-center text-purple-800 text-sm font-bold">
                       <AlertTriangle className="w-4 h-4 mr-1" />
                       置信度: {selectedClaim.confidenceScore}%
                    </div>
                    <p className="text-xs text-purple-600 mt-2">因置信度低于 80% 或 涉及复杂情形，已自动转交人工处理。</p>
                 </div>
               </div>
               
               <div className="mb-4">
                 <label className="block text-sm font-medium text-slate-700 mb-1">审核意见</label>
                 <textarea 
                   className="w-full border border-slate-300 rounded-lg p-2 text-sm h-24"
                   placeholder="请输入核赔结论..."
                   value={reviewNotes}
                   onChange={e => setReviewNotes(e.target.value)}
                 />
               </div>

               <div className="flex justify-end space-x-3">
                  <button onClick={() => setReviewModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">取消</button>
                  <button onClick={() => submitManualReview('rejected')} className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-medium">驳回申请</button>
                  <button onClick={() => submitManualReview('approved')} className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg font-medium">通过理赔</button>
               </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- Enterprise View ---
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">智能理赔服务</h1>
          <p className="text-slate-500 text-sm mt-1">上传凭证 → AI 实时审核 → 极速赔付</p>
        </div>
        <button 
          onClick={() => setIsNewClaimOpen(true)}
          className="bg-insure-600 text-white px-4 py-2 rounded-lg hover:bg-insure-700 transition-colors shadow-sm"
        >
          发起新理赔
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {claims.map(claim => (
          <div key={claim.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-lg font-bold text-slate-900">理赔单号: {claim.id}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase
                  ${claim.status === 'approved' ? 'bg-green-100 text-green-800' : 
                    claim.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                    claim.status === 'manual_review' ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {claim.status === 'approved' ? '已赔付' : claim.status === 'manual_review' ? '人工复核中' : claim.status === 'rejected' ? '已驳回' : '审核中'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-4">
                <div>关联保单: {claim.policyId}</div>
                <div>申请金额: ¥{claim.amount.toLocaleString()}</div>
                <div>申请日期: {claim.date}</div>
              </div>
              <p className="text-slate-700 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="font-bold">案由:</span> {claim.description}
              </p>
              {claim.manualReviewNotes && (
                <div className="mt-2 text-xs text-orange-700 bg-orange-50 p-2 rounded border border-orange-100">
                   <span className="font-bold">审核员留言:</span> {claim.manualReviewNotes}
                </div>
              )}
            </div>

            <div className="md:w-1/3 bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex items-center mb-3">
                 <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center mr-2">
                    <Play className="w-3 h-3 text-white fill-current" />
                 </div>
                 <h4 className="font-bold text-slate-900 text-sm">AI 智能预审</h4>
              </div>
              
              <div className="text-sm space-y-3">
                 <p className="text-slate-600 leading-relaxed text-xs">
                   {claim.aiAnalysis || "正在排队进行 AI 分析..."}
                 </p>
                 {claim.confidenceScore && (
                   <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <span className="text-xs text-slate-500">置信度</span>
                      <div className={`flex items-center font-bold text-sm ${claim.confidenceScore > 80 ? 'text-green-600' : 'text-orange-600'}`}>
                        {claim.confidenceScore > 80 ? <CheckCircle className="w-4 h-4 mr-1" /> : <AlertTriangle className="w-4 h-4 mr-1" />}
                        {claim.confidenceScore}%
                      </div>
                   </div>
                 )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Claim Modal */}
      {isNewClaimOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 animate-fade-in max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-900">发起理赔申请</h2>
            
            <div className="space-y-3">
              <input 
                type="text" placeholder="保单编号 (如 POL-123456)" 
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                value={policyId} onChange={e => setPolicyId(e.target.value)}
              />
              <input 
                type="number" placeholder="索赔金额 (元)" 
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                value={amount} onChange={e => setAmount(e.target.value)}
              />
              <textarea 
                placeholder="事故描述..." 
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm h-24"
                value={description} onChange={e => setDescription(e.target.value)}
              />
              
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
                 <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                 <p className="text-xs text-slate-500">上传凭证文件 (模拟)</p>
                 <textarea 
                    placeholder="[模拟 OCR 识别结果] 请粘贴凭证内容文本用于 AI 验证..." 
                    className="w-full mt-2 text-xs border border-slate-200 bg-slate-50 p-2 rounded"
                    rows={3}
                    value={evidenceText}
                    onChange={e => setEvidenceText(e.target.value)}
                 />
              </div>

              {!aiResult && (
                <button 
                  onClick={handleAIAnalysis}
                  disabled={isAnalyzing || !evidenceText}
                  className="w-full py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2 fill-current" />}
                  运行 AI 预审
                </button>
              )}

              {aiResult && (
                <div className={`p-3 rounded-lg border ${aiResult.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center mb-1">
                    {aiResult.isValid ? <CheckCircle className="w-4 h-4 text-green-600 mr-2" /> : <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />}
                    <span className={`font-bold text-sm ${aiResult.isValid ? 'text-green-800' : 'text-red-800'}`}>
                      {aiResult.isValid ? '审核通过' : '存在疑点'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{aiResult.reason}</p>
                  {aiResult.recommendedAction !== 'APPROVE' && (
                     <p className="text-xs text-orange-600 mt-1 font-bold">建议转人工复核</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex space-x-3 pt-2">
              <button onClick={() => setIsNewClaimOpen(false)} className="flex-1 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50">取消</button>
              <button 
                onClick={handleSubmitClaim}
                disabled={!aiResult}
                className="flex-1 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
              >
                提交申请
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Claims;
