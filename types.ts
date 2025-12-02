
// 角色定义
export enum UserRole {
  ENTERPRISE = 'ENTERPRISE', // 企业用户
  INSURER = 'INSURER',       // 保险机构
  REGULATOR = 'REGULATOR',   // 监管机构
  BANK = 'BANK'              // 银行机构 (新增)
}

// 碳排放范围
export enum ScopeType {
  SCOPE_1 = 'Scope 1 (直接排放)',
  SCOPE_2 = 'Scope 2 (能源间接)',
  SCOPE_3 = 'Scope 3 (供应链/其他)'
}

// 碳排放记录
export interface CarbonRecord {
  id: string;
  date: string;
  source: string; // 来源：如燃烧、电力购买、物流
  scope: ScopeType;
  amount: number; // tCO2e (吨二氧化碳当量)
  evidence?: string; // 凭证文件名
  status: 'verified' | 'pending' | 'rejected';
  blockchainHash?: string; // 区块链存证哈希
}

// 供应链交易详情
export interface SupplyChainTransaction {
  id: string;
  date: string;
  product: string;
  amount: string;
  carbonFootprint: number; // kgCO2e
  hash: string;
}

// 供应链企业节点
export interface SupplyChainNode {
  id: string;
  name: string;
  role: 'supplier' | 'distributor' | 'logistics';
  carbonRating: 'A' | 'B' | 'C' | 'D';
  lastAuditDate: string;
  emissionFactor: number; // 排放因子
  blockchainAddress: string;
  verified: boolean;
  transactions?: SupplyChainTransaction[]; 
}

// 保险产品
export interface InsuranceProduct {
  id: string;
  name: string;
  type: 'carbon_liability' | 'emission_credit' | 'project_yield'; 
  basePremiumRate: number; // 基础费率 %
  coverageLimit: number; // 保额上限 (万元)
  description: string;
  features: string[];
}

// AI 风险评估结果
export interface RiskAssessment {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  riskScore: number; // 0-100
  premiumModifier: number; // 费率调整系数
  reasoning: string;
  suggestions: string[];
  projectedSavings: number; // 预计节省保费
  marketComparison?: string; // 市场对比分析
}

// 理赔记录
export interface ClaimRecord {
  id: string;
  policyId: string;
  date: string;
  type: string;
  amount: number;
  description: string;
  evidenceText: string; 
  status: 'processing' | 'approved' | 'rejected' | 'manual_review'; 
  aiAnalysis?: string; // AI 预审意见
  confidenceScore?: number; // AI 置信度
  manualReviewer?: string;
  manualReviewDate?: string;
  manualReviewNotes?: string;
}

// 保单
export interface Policy {
  id: string;
  productId: string;
  productName: string;
  coverageAmount: number;
  premium: number;
  status: 'active' | 'expired' | 'pending_payment' | 'pending_review' | 'rejected'; // 新增审核状态
  startDate: string;
  endDate: string;
  riskAssessment?: RiskAssessment;
  companyName?: string; // 用于后端视角
}

// 贷款申请 (新)
export interface LoanApplication {
  id: string;
  companyName: string;
  purpose: string; // 用途：节能改造、光伏建设等
  amount: number; // 万元
  termMonths: number;
  carbonCreditRating: 'AAA' | 'AA' | 'A' | 'B' | 'C'; // 基于碳数据的评级
  suggestedInterestRate: number; // AI 建议利率
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  aiAnalysis?: string;
}

// 通知消息
export interface Notification {
  id: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  targetRole: UserRole[]; 
}
