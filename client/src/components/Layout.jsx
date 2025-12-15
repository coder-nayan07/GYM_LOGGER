import React from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, LineChart, Settings } from 'lucide-react'; // Import Settings

const NavItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center justify-center w-full h-full transition-colors ${
        isActive ? 'text-gym-accent' : 'text-gym-muted hover:text-gym-text'
      }`
    }
  >
    <Icon size={24} strokeWidth={2} />
    <span className="text-[10px] font-medium mt-1">{label}</span>
  </NavLink>
);

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gym-bg text-gym-text font-sans selection:bg-gym-accent selection:text-white">
      
      {/* Top Bar (Only show on Dashboard) */}
      {location.pathname === '/' && (
        <div className="fixed top-0 right-0 p-4 z-50">
          <button onClick={() => navigate('/settings')} className="text-gym-muted hover:text-white">
            <Settings size={24} />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="pb-24 px-4 pt-4 max-w-md mx-auto">
        <Outlet />
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full h-[80px] bg-gym-bg/90 backdrop-blur-lg border-t border-gym-input flex items-center justify-around z-50 pb-safe">
        <NavItem to="/" icon={LayoutDashboard} label="Home" />
        
        <div className="relative -top-6">
          <NavLink to="/workout" className="flex items-center justify-center w-16 h-16 bg-gym-accent rounded-full shadow-lg shadow-blue-900/50 border-4 border-gym-bg">
            <Dumbbell size={28} color="white" fill="white" />
          </NavLink>
        </div>

        <NavItem to="/analytics" icon={LineChart} label="Stats" />
      </nav>
    </div>
  );
}