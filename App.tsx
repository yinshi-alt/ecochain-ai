
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CarbonData from './pages/CarbonData';
import Insurance from './pages/Insurance';
import SupplyChain from './pages/SupplyChain';
import Claims from './pages/Claims';
import RiskAssessmentPage from './pages/RiskAssessment';
import Underwriting from './pages/Underwriting';
import Credit from './pages/Credit';
import ClientProfile from './pages/ClientProfile';
import { MOCK_CARBON_DATA, MOCK_CLAIMS, MOCK_LOANS } from './constants';
import { UserRole, CarbonRecord, Policy, InsuranceProduct, RiskAssessment, ClaimRecord, LoanApplication } from './types';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.ENTERPRISE);
  const [carbonData, setCarbonData] = useState<CarbonRecord[]>(MOCK_CARBON_DATA);
  // Shared State
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [claims, setClaims] = useState<ClaimRecord[]>(MOCK_CLAIMS);
  const [loans, setLoans] = useState<LoanApplication[]>(MOCK_LOANS);

  // Policy Handlers
  const handleCreatePolicy = (product: InsuranceProduct, assessment: RiskAssessment) => {
    const newPolicy: Policy = {
      id: `POL-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      companyName: '绿动未来制造有限公司', // Mock company
      coverageAmount: product.coverageLimit,
      premium: (product.basePremiumRate * assessment.premiumModifier * product.coverageLimit * 100),
      status: 'pending_review', // Needs insurer approval
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      riskAssessment: assessment
    };
    setPolicies([newPolicy, ...policies]);
  };

  const handleUpdatePolicyStatus = (id: string, status: Policy['status']) => {
    setPolicies(policies.map(p => p.id === id ? { ...p, status } : p));
  };

  // Claims Handlers
  const handleCreateClaim = (claim: ClaimRecord) => {
    setClaims([claim, ...claims]);
  };

  const handleUpdateClaimStatus = (id: string, updates: Partial<ClaimRecord>) => {
    setClaims(claims.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  // Loan Handlers
  const handleCreateLoan = (loan: LoanApplication) => {
    setLoans([loan, ...loans]);
  };

  const handleUpdateLoanStatus = (id: string, status: LoanApplication['status']) => {
    setLoans(loans.map(l => l.id === id ? { ...l, status } : l));
  };

  return (
    <Router>
      <Layout userRole={userRole} setUserRole={setUserRole}>
        <Routes>
          <Route path="/" element={<Dashboard carbonData={carbonData} policies={policies} userRole={userRole} claims={claims} loans={loans} />} />
          <Route path="/carbon" element={<CarbonData data={carbonData} setData={setCarbonData} />} />
          <Route path="/supply-chain" element={<SupplyChain />} />
          <Route path="/insurance" element={<Insurance carbonData={carbonData} addPolicy={handleCreatePolicy} />} />
          <Route path="/risk" element={<RiskAssessmentPage />} /> 
          
          <Route path="/claims" element={
            <Claims 
              userRole={userRole} 
              claims={claims} 
              onCreateClaim={handleCreateClaim} 
              onUpdateClaim={handleUpdateClaimStatus} 
            />
          } />
          
          <Route path="/underwriting" element={
            <Underwriting 
              policies={policies} 
              onUpdatePolicyStatus={handleUpdatePolicyStatus} 
            />
          } />

          <Route path="/credit" element={
            <Credit 
              userRole={userRole}
              loans={loans}
              onCreateLoan={handleCreateLoan}
              onUpdateLoan={handleUpdateLoanStatus}
            />
          } />

          <Route path="/client-profile/:id" element={
            <ClientProfile 
              carbonData={carbonData}
              policies={policies}
              claims={claims}
              loans={loans}
            />
          } />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
