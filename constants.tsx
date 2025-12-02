
import { CarbonRecord, InsuranceProduct, ScopeType, SupplyChainNode, ClaimRecord, Notification, UserRole, LoanApplication } from "./types";
import { 
  Factory, 
  Zap, 
  ShieldCheck, 
  BarChart3, 
  FileText,
  Link as LinkIcon,
  Briefcase,
  Gavel,
  Landmark, // Bank icon
  Search
} from "lucide-react";
import React from "react";

export const MOCK_CARBON_DATA: CarbonRecord[] = [
  { id: '1', date: '2023-10-15', source: '一号厂房天然气锅炉', scope: ScopeType.SCOPE_1, amount: 120.5, status: 'verified', blockchainHash: '0x7d3a...8f21' },
  { id: '2', date: '2023-10-20', source: '外购电力 (国网)', scope: ScopeType.SCOPE_2, amount: 340.2, status: 'verified', blockchainHash: '0x9a2b...3c4d' },
  { id: '3', date: '2023-10-22', source: '原材料物流运输 (顺丰)', scope: ScopeType.SCOPE_3, amount: 45.8, status: 'pending' },
  { id: '4', date: '2023-11-05', source: '二号厂房柴油发电机', scope: ScopeType.SCOPE_1, amount: 88.3, status: 'verified', blockchainHash: '0x1e2f...5a6b' },
  { id: '5', date: '2023-11-12', source: '外购电力 (国网)', scope: ScopeType.SCOPE_2, amount: 310.5, status: 'verified', blockchainHash: '0x8c7d...9e0f' },
  { id: '6', date: '2023-11-25', source: '商务差旅飞行', scope: ScopeType.SCOPE_3, amount: 12.4, status: 'verified', blockchainHash: '0x3b4c...5d6e' },
];

export const MOCK_SUPPLY_CHAIN: SupplyChainNode[] = [
  { 
    id: 's1', 
    name: '宏达钢铁原料厂', 
    role: 'supplier', 
    carbonRating: 'C', 
    lastAuditDate: '2023-09-01', 
    emissionFactor: 1.85, 
    blockchainAddress: '0xSupp...A1', 
    verified: true,
    transactions: [
      { id: 'tx1', date: '2023-10-01', product: '螺纹钢', amount: '50 吨', carbonFootprint: 1850, hash: '0xabc...111' },
      { id: 'tx2', date: '2023-10-15', product: '盘圆', amount: '30 吨', carbonFootprint: 1110, hash: '0xabc...222' }
    ]
  },
  { 
    id: 's2', 
    name: '绿能光伏组件科技', 
    role: 'supplier', 
    carbonRating: 'A', 
    lastAuditDate: '2023-10-15', 
    emissionFactor: 0.12, 
    blockchainAddress: '0xSupp...B2', 
    verified: true,
    transactions: [
      { id: 'tx3', date: '2023-11-01', product: '单晶硅板', amount: '200 件', carbonFootprint: 240, hash: '0xdef...333' }
    ]
  },
  { id: 's3', name: '速达冷链物流', role: 'logistics', carbonRating: 'B', lastAuditDate: '2023-11-02', emissionFactor: 0.89, blockchainAddress: '0xLogi...C3', verified: false, transactions: [] },
  { id: 's4', name: '远洋国际分销中心', role: 'distributor', carbonRating: 'B', lastAuditDate: '2023-08-20', emissionFactor: 0.65, blockchainAddress: '0xDist...D4', verified: true, transactions: [] },
];

export const MOCK_CLAIMS: ClaimRecord[] = [
  {
    id: 'c1',
    policyId: 'POL-1709238',
    date: '2023-11-15',
    type: 'carbon_liability',
    amount: 150000,
    description: '年度排放超标罚款赔付申请',
    evidenceText: '环保局处罚通知书：编号2023-998。因设备老化导致10月排放超标。',
    status: 'approved',
    aiAnalysis: '符合“碳足迹超标赔付险”条款。提供的处罚通知书真实有效，且超标原因非主观恶意排放。',
    confidenceScore: 98
  },
  {
    id: 'c2',
    policyId: 'POL-1709239',
    date: '2023-11-20',
    type: 'project_yield',
    amount: 50000,
    description: '光伏发电设备故障导致收益损失',
    evidenceText: '维修单据显示：逆变器故障，停机3天。',
    status: 'manual_review',
    aiAnalysis: '凭证完整性不足，无法确认是否人为操作失误。置信度低，建议人工复核。',
    confidenceScore: 55
  }
];

export const MOCK_LOANS: LoanApplication[] = [
  {
    id: 'LN-2023-001',
    companyName: '绿动未来制造有限公司',
    purpose: '厂房屋顶分布式光伏建设项目',
    amount: 500,
    termMonths: 36,
    carbonCreditRating: 'AA',
    suggestedInterestRate: 3.25,
    status: 'approved',
    date: '2023-10-01',
    aiAnalysis: '企业碳管理规范，历史减排效果显著。光伏项目预计年减排200吨，符合绿色信贷赤道原则支持方向。'
  },
  {
    id: 'LN-2023-002',
    companyName: '宏达钢铁有限公司',
    purpose: '高炉节能技改',
    amount: 1200,
    termMonths: 60,
    carbonCreditRating: 'B',
    suggestedInterestRate: 4.85,
    status: 'pending',
    date: '2023-11-28',
    aiAnalysis: '属于高碳行业转型项目。企业历史碳排数据波动较大，建议追加碳配额抵押担保。'
  }
];

export const INSURANCE_PRODUCTS: InsuranceProduct[] = [
  {
    id: 'p1',
    name: '碳足迹超标赔付险',
    type: 'carbon_liability',
    basePremiumRate: 2.5,
    coverageLimit: 500,
    description: '针对因意外事故导致企业年度碳排放超标面临的监管罚款提供风险保障。',
    features: ['监管罚款赔付', '碳资产回购补偿', '合规咨询服务']
  },
  {
    id: 'p2',
    name: '低碳项目收益损失险',
    type: 'project_yield',
    basePremiumRate: 1.8,
    coverageLimit: 1000,
    description: '保障节能减排项目因技术故障或自然灾害导致的预期碳资产收益损失。',
    features: ['CCER收益保障', '设备故障停机补偿', '绿色信贷优惠联动']
  },
  {
    id: 'p3',
    name: '碳交易履约信用险',
    type: 'emission_credit',
    basePremiumRate: 3.0,
    coverageLimit: 2000,
    description: '为参与碳排放权交易的企业提供履约资金支持和信用担保。',
    features: ['履约资金垫付', '碳价波动对冲', '交易信用增级']
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'alert', title: '排放超标预警', message: 'Scope 2 本月累计排放已达年度限额 85%，请注意控制。', timestamp: '2小时前', read: false, targetRole: [UserRole.ENTERPRISE] },
  { id: 'n2', type: 'success', title: '理赔到账通知', message: '理赔单 CL-1709238 已完成打款，金额 ¥150,000。', timestamp: '昨天', read: false, targetRole: [UserRole.ENTERPRISE] },
  { id: 'n3', type: 'info', title: '新产品上线', message: '“欧盟碳边境税(CBAM)合规险”已上线，欢迎咨询。', timestamp: '3天前', read: true, targetRole: [UserRole.ENTERPRISE, UserRole.INSURER] },
  { id: 'n4', type: 'warning', title: '待审核理赔任务', message: '系统检测到 3 笔低置信度理赔申请需要人工介入。', timestamp: '10分钟前', read: false, targetRole: [UserRole.INSURER] },
  { id: 'n5', type: 'info', title: '信贷审核提醒', message: '宏达钢铁提交了 1200万 技改贷款申请，等待风控审核。', timestamp: '30分钟前', read: false, targetRole: [UserRole.BANK] },
];

// Navigation configurations
export const ENTERPRISE_NAV_ITEMS = [
  { name: '总览看板', path: '/', icon: <BarChart3 className="w-5 h-5" /> },
  { name: '碳排放管理', path: '/carbon', icon: <Factory className="w-5 h-5" /> },
  { name: '供应链溯源', path: '/supply-chain', icon: <LinkIcon className="w-5 h-5" /> },
  { name: '绿色保险超市', path: '/insurance', icon: <ShieldCheck className="w-5 h-5" /> },
  { name: 'AI 风险评估', path: '/risk', icon: <Zap className="w-5 h-5" /> },
  { name: '智能理赔', path: '/claims', icon: <FileText className="w-5 h-5" /> },
  { name: '绿色信贷', path: '/credit', icon: <Landmark className="w-5 h-5" /> },
];

export const INSURER_NAV_ITEMS = [
  { name: '保险工作台', path: '/', icon: <BarChart3 className="w-5 h-5" /> },
  { name: '核保审核中心', path: '/underwriting', icon: <Briefcase className="w-5 h-5" /> },
  { name: '理赔审核中心', path: '/claims', icon: <Gavel className="w-5 h-5" /> },
  { name: '客户碳信档案', path: '/client-profile/demo', icon: <Search className="w-5 h-5" /> }, // Demo link
  { name: '供应链风险监控', path: '/supply-chain', icon: <LinkIcon className="w-5 h-5" /> },
];

export const REGULATOR_NAV_ITEMS = [
  { name: '区域监管大屏', path: '/', icon: <BarChart3 className="w-5 h-5" /> },
  { name: '企业合规档案', path: '/client-profile/demo', icon: <Factory className="w-5 h-5" /> },
  { name: '系统风险预警', path: '/risk', icon: <Zap className="w-5 h-5" /> },
];

export const BANK_NAV_ITEMS = [
  { name: '信贷工作台', path: '/', icon: <BarChart3 className="w-5 h-5" /> },
  { name: '信贷审批中心', path: '/credit', icon: <Landmark className="w-5 h-5" /> },
  { name: '企业征信查询', path: '/client-profile/demo', icon: <Search className="w-5 h-5" /> },
];
