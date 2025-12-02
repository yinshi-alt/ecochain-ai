
import React, { useState } from 'react';
import { SupplyChainNode } from '../types';
import { MOCK_SUPPLY_CHAIN } from '../constants';
import { Link as LinkIcon, CheckCircle, XCircle, Truck, Factory, Building2, Search, FileText } from 'lucide-react';

const SupplyChain: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<SupplyChainNode | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">区块链供应链溯源</h1>
          <p className="text-slate-500 text-sm mt-1">Scope 3 上下游碳足迹追踪 & 真实性验证</p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-slate-200">
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="输入企业ID或区块哈希..." 
            className="text-sm outline-none w-48"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {/* Chain Visualization */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
              <LinkIcon className="w-5 h-5 mr-2 text-eco-600" />
              生态链视图 (Eco-Chain View)
            </h3>
            <div className="flex items-center space-x-4 min-w-[600px] pb-4">
              {MOCK_SUPPLY_CHAIN.map((node, index) => (
                <div key={node.id} className="flex items-center">
                  <div className="relative group">
                     <div 
                        onClick={() => setSelectedNode(node)}
                        className={`w-40 p-4 rounded-xl border-2 transition-all cursor-pointer transform hover:-translate-y-1 hover:shadow-lg
                        ${node.role === 'supplier' ? 'border-blue-100 bg-blue-50 hover:border-blue-300' : 
                          node.role === 'logistics' ? 'border-orange-100 bg-orange-50 hover:border-orange-300' : 'border-purple-100 bg-purple-50 hover:border-purple-300'}
                     `}>
                        <div className="flex justify-between items-start mb-2">
                          {node.role === 'supplier' && <Factory className="w-5 h-5 text-blue-500" />}
                          {node.role === 'logistics' && <Truck className="w-5 h-5 text-orange-500" />}
                          {node.role === 'distributor' && <Building2 className="w-5 h-5 text-purple-500" />}
                          <span className={`text-xs font-bold px-1.5 py-0.5 rounded
                            ${node.carbonRating === 'A' ? 'bg-green-200 text-green-800' : 
                              node.carbonRating === 'B' ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'}
                          `}>
                            {node.carbonRating}级
                          </span>
                        </div>
                        <div className="font-bold text-sm text-slate-800 truncate">{node.name}</div>
                        <div className="text-xs text-slate-500 mt-1">排放因子: {node.emissionFactor}</div>
                        
                        {/* Blockchain Hash Preview */}
                        <div className="mt-2 pt-2 border-t border-slate-200/50 flex items-center text-[10px] text-slate-400 font-mono">
                          <LinkIcon className="w-3 h-3 mr-1" />
                          {node.blockchainAddress}
                        </div>
                     </div>
                  </div>
                  
                  {index < MOCK_SUPPLY_CHAIN.length - 1 && (
                    <div className="w-8 h-0.5 bg-slate-300 mx-2"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Node List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">企业名称</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">角色</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">碳信用评级</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">区块链验证</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {MOCK_SUPPLY_CHAIN.map(node => (
                  <tr key={node.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedNode(node)}>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{node.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 capitalize">{node.role}</td>
                    <td className="px-6 py-4">
                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${node.carbonRating === 'A' ? 'bg-green-100 text-green-800' : 
                            node.carbonRating === 'B' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}
                       `}>
                          等级 {node.carbonRating}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {node.verified ? (
                        <div className="flex items-center text-eco-600">
                          <CheckCircle className="w-4 h-4 mr-1.5" />
                          <span className="font-mono text-xs">{node.blockchainAddress}</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-slate-400">
                          <XCircle className="w-4 h-4 mr-1.5" />
                          待同步
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <div className="bg-eco-600 p-6 rounded-xl text-white shadow-lg shadow-eco-200">
            <h3 className="font-bold text-lg mb-2">Scope 3 概览</h3>
            <div className="text-4xl font-bold mb-1">1,240</div>
            <div className="text-eco-100 text-sm mb-4">tCO₂e (间接排放总计)</div>
            <div className="h-1 bg-eco-500 rounded-full overflow-hidden">
              <div className="h-full bg-white w-[70%]"></div>
            </div>
            <div className="text-xs text-eco-100 mt-2">占总碳足迹的 70%</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">AI 优化建议</h3>
            <div className="space-y-3">
              <div className="text-sm text-slate-600 p-3 bg-slate-50 rounded-lg">
                <span className="font-bold text-slate-900 block mb-1">更换物流商</span>
                建议将“速达冷链”更换为电动车队占比更高的供应商，预计降低 15% 物流碳排。
              </div>
              <div className="text-sm text-slate-600 p-3 bg-slate-50 rounded-lg">
                <span className="font-bold text-slate-900 block mb-1">原料采购优化</span>
                宏达钢铁原料厂碳评级为 C，建议减少采购比例，规避碳税风险。
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Node Detail Modal */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 animate-fade-in">
             <div className="flex justify-between items-start mb-6">
                <div>
                   <h2 className="text-xl font-bold text-slate-900 flex items-center">
                     {selectedNode.name}
                     {selectedNode.verified && <CheckCircle className="w-5 h-5 text-eco-500 ml-2" />}
                   </h2>
                   <p className="text-slate-500 text-sm mt-1">企业ID: {selectedNode.id} | 链上地址: {selectedNode.blockchainAddress}</p>
                </div>
                <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-slate-600">
                  <XCircle className="w-6 h-6" />
                </button>
             </div>

             <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                   <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-xs text-slate-500">碳信用评级</div>
                      <div className="text-lg font-bold text-slate-900">{selectedNode.carbonRating}</div>
                   </div>
                   <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-xs text-slate-500">排放因子</div>
                      <div className="text-lg font-bold text-slate-900">{selectedNode.emissionFactor}</div>
                   </div>
                   <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-xs text-slate-500">上次审计</div>
                      <div className="text-lg font-bold text-slate-900">{selectedNode.lastAuditDate}</div>
                   </div>
                </div>

                <div>
                   <h3 className="font-bold text-slate-900 mb-3 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      碳足迹交易批次 (Transaction History)
                   </h3>
                   <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-slate-200">
                         <thead className="bg-slate-50">
                            <tr>
                               <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">日期</th>
                               <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">产品</th>
                               <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">数量</th>
                               <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">碳足迹 (kgCO2e)</th>
                            </tr>
                         </thead>
                         <tbody className="bg-white divide-y divide-slate-200">
                            {selectedNode.transactions && selectedNode.transactions.length > 0 ? (
                               selectedNode.transactions.map(tx => (
                                  <tr key={tx.id}>
                                     <td className="px-4 py-2 text-sm text-slate-900">{tx.date}</td>
                                     <td className="px-4 py-2 text-sm text-slate-700">{tx.product}</td>
                                     <td className="px-4 py-2 text-sm text-slate-700">{tx.amount}</td>
                                     <td className="px-4 py-2 text-sm text-slate-900 font-mono">{tx.carbonFootprint}</td>
                                  </tr>
                               ))
                            ) : (
                               <tr>
                                  <td colSpan={4} className="px-4 py-4 text-center text-sm text-slate-500">暂无公开交易记录</td>
                               </tr>
                            )}
                         </tbody>
                      </table>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplyChain;
