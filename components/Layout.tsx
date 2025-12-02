
import React, { useState } from 'react';
import { ENTERPRISE_NAV_ITEMS, INSURER_NAV_ITEMS, REGULATOR_NAV_ITEMS, BANK_NAV_ITEMS, MOCK_NOTIFICATIONS } from '../constants';
import { UserRole } from '../types';
import { Menu, X, Leaf, Bell, Check } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, userRole, setUserRole }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const location = useLocation();

  const activePath = location.pathname;

  const getNavItems = () => {
    switch (userRole) {
      case UserRole.INSURER: return INSURER_NAV_ITEMS;
      case UserRole.REGULATOR: return REGULATOR_NAV_ITEMS;
      case UserRole.BANK: return BANK_NAV_ITEMS;
      default: return ENTERPRISE_NAV_ITEMS;
    }
  };

  const navItems = getNavItems();

  // Filter notifications for current role
  const notifications = MOCK_NOTIFICATIONS.filter(n => n.targetRole.includes(userRole));
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100">
          <div className="flex items-center space-x-2 text-eco-700 font-bold text-xl">
            <Leaf className="w-6 h-6 fill-current" />
            <span>EcoInsure AI</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          <div className="px-4 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {userRole === UserRole.ENTERPRISE ? '企业工作台' : 
             userRole === UserRole.INSURER ? '保险机构后台' : 
             userRole === UserRole.BANK ? '绿色金融后台' : '监管视角'}
          </div>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activePath === item.path 
                  ? 'bg-eco-50 text-eco-700 font-medium' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            当前视角 (切换演示)
          </div>
          <select 
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as UserRole)}
            className="w-full text-sm p-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-eco-500"
          >
            <option value={UserRole.ENTERPRISE}>企业用户 (Client)</option>
            <option value={UserRole.INSURER}>保险公司 (Admin)</option>
            <option value={UserRole.BANK}>商业银行 (Bank)</option>
            <option value={UserRole.REGULATOR}>监管机构 (Gov)</option>
          </select>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 flex-shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden text-slate-500 p-2 -ml-2 hover:bg-slate-100 rounded-md"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex-1 px-4 text-slate-400 text-sm hidden sm:block">
            {userRole === UserRole.INSURER ? '保险核心业务系统 - 审核端' : 
             userRole === UserRole.BANK ? '绿色信贷管理系统' :
             userRole === UserRole.REGULATOR ? '政府监管驾驶舱' :
             '智能碳管理与绿色金融服务平台'}
          </div>

          <div className="flex items-center space-x-4">
             {/* Notification Bell */}
            <button 
              onClick={() => setIsNotificationOpen(true)}
              className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              )}
            </button>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-xs
              ${userRole === UserRole.ENTERPRISE ? 'bg-gradient-to-tr from-eco-400 to-eco-600' : 
                userRole === UserRole.BANK ? 'bg-gradient-to-tr from-teal-400 to-teal-600' :
                'bg-gradient-to-tr from-blue-400 to-blue-600'}`}>
              {userRole === UserRole.INSURER ? 'ADM' : userRole === UserRole.BANK ? 'BNK' : userRole === UserRole.REGULATOR ? 'GOV' : 'USR'}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-slate-50/50">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* Notification Drawer */}
      {isNotificationOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 z-50" onClick={() => setIsNotificationOpen(false)} />
          <div className="fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-2xl transform transition-transform animate-slide-in-right">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">消息中心</h3>
              <button onClick={() => setIsNotificationOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto h-full pb-20">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">暂无新消息</div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-blue-50/30' : ''}`}>
                    <div className="flex items-start justify-between mb-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase
                        ${n.type === 'alert' ? 'bg-red-100 text-red-700' : 
                          n.type === 'warning' ? 'bg-orange-100 text-orange-700' :
                          n.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {n.type === 'alert' ? '紧急' : n.type === 'warning' ? '提醒' : n.type === 'success' ? '成功' : '通知'}
                      </span>
                      <span className="text-xs text-slate-400">{n.timestamp}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 mb-1">{n.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{n.message}</p>
                  </div>
                ))
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 bg-white">
              <button className="w-full py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg flex items-center justify-center">
                <Check className="w-4 h-4 mr-2" />
                全部标记为已读
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Layout;
