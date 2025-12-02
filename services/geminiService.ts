
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CarbonRecord, RiskAssessment, SupplyChainNode, LoanApplication } from "../types";

// 初始化 Gemini 客户端
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// 定义 AI 输出的 Schema
const riskAssessmentSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    riskLevel: {
      type: Type.STRING,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
    },
    riskScore: { type: Type.NUMBER },
    premiumModifier: { type: Type.NUMBER },
    reasoning: { type: Type.STRING },
    suggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    projectedSavings: { type: Type.NUMBER },
    marketComparison: { type: Type.STRING },
  },
  required: ['riskLevel', 'riskScore', 'premiumModifier', 'reasoning', 'suggestions', 'projectedSavings'],
};

const claimAnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    isValid: { type: Type.BOOLEAN },
    reason: { type: Type.STRING },
    confidence: { type: Type.NUMBER },
    recommendedAction: { type: Type.STRING, enum: ['APPROVE', 'REJECT', 'MANUAL_REVIEW'] },
  },
  required: ['isValid', 'reason', 'confidence', 'recommendedAction'],
};

const creditAssessmentSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    carbonCreditRating: { type: Type.STRING, enum: ['AAA', 'AA', 'A', 'B', 'C'] },
    suggestedInterestRate: { type: Type.NUMBER },
    analysis: { type: Type.STRING },
    riskFactors: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ['carbonCreditRating', 'suggestedInterestRate', 'analysis', 'riskFactors']
};

export const assessCarbonRisk = async (
  companyName: string,
  industry: string,
  records: CarbonRecord[],
  supplyChain: SupplyChainNode[]
): Promise<RiskAssessment> => {
  if (!process.env.API_KEY) {
    return new Promise(resolve => setTimeout(() => resolve({
      riskLevel: 'MEDIUM',
      riskScore: 58,
      premiumModifier: 1.1,
      reasoning: 'API Key 未配置。模拟分析：Scope 1 排放稳定，但供应链（Scope 3）中存在高风险供应商（评级C），增加了整体碳合规风险。',
      suggestions: ['优化供应链伙伴，选择碳评级A级供应商', '增加 Scope 2 绿电采购比例'],
      projectedSavings: 80000,
      marketComparison: '您的碳排放强度比同行业平均水平高 5%。'
    }), 2000));
  }

  const prompt = `
    企业: ${companyName} (${industry})
    
    碳排放记录 (Scope 1/2/3):
    ${JSON.stringify(records.slice(0, 15))}

    供应链节点数据 (Scope 3):
    ${JSON.stringify(supplyChain)}
    
    任务：
    1. 分析企业碳排放趋势和供应链风险。
    2. 基于区块链数据的真实性（假设 verified 为 true 的数据权重更高），评估合规风险。
    3. 模拟搜索当前行业的最新碳排放标准。
    
    输出严格的 JSON 格式。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: riskAssessmentSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as RiskAssessment;
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("AI Assessment failed:", error);
    throw error;
  }
};

export const analyzeClaim = async (claimDescription: string, evidenceText: string): Promise<any> => {
  if (!process.env.API_KEY) {
    return {
      isValid: true,
      reason: "模拟分析：提供的凭证描述详细，符合逻辑，且在保险责任范围内。",
      confidence: 92,
      recommendedAction: 'APPROVE'
    };
  }

  const prompt = `
    理赔申请分析：
    案由: ${claimDescription}
    凭证内容: ${evidenceText}
    
    请判断理赔是否合理，是否存在欺诈风险。如果凭证内容模糊或不充分，建议人工审核。
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: claimAnalysisSchema,
    }
  });

  return JSON.parse(response.text || '{}');
};

export const assessGreenCredit = async (
  companyName: string, 
  loanAmount: number, 
  purpose: string
): Promise<any> => {
  if (!process.env.API_KEY) {
    return {
      carbonCreditRating: 'AA',
      suggestedInterestRate: 3.85,
      analysis: '项目属于绿色能源范畴，企业碳管理评级良好，符合绿色信贷政策优惠条件。',
      riskFactors: ['项目建设周期较长', '光伏组件价格波动']
    };
  }

  const prompt = `
    绿色信贷申请评估：
    企业: ${companyName}
    申请金额: ${loanAmount} 万元
    用途: ${purpose}
    
    基于赤道原则和绿色金融标准，评估该企业的碳信用评级(AAA-C)，并建议贷款利率（基准为 4.5%）。
    如果评级高，利率应有显著折扣。
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: creditAssessmentSchema,
    }
  });

  return JSON.parse(response.text || '{}');
};
