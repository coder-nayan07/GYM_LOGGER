import React from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, LineChart, Settings } from 'lucide-react';

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
      
      {/* Top Bar Settings Icon */}
      {location.pathname === '/' && (
        <div className="fixed top-0 right-0 p-4 z-50">
          <button onClick={() => navigate('/settings')} className="text-gym-muted hover:text-white">
            <Settings size={24} />
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="pb-24 px-4 pt-4 max-w-md mx-auto">
        <Outlet />
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full h-[80px] bg-gym-bg/95 backdrop-blur-lg border-t border-gym-input flex items-center justify-around z-50 pb-safe">
        <NavItem to="/" icon={LayoutDashboard} label="Home" />
        
        {/* Floating Center Button */}
        <div className="relative -top-6">
          <NavLink 
            to="/workout" 
            className={({ isActive }) => 
              `flex items-center justify-center w-16 h-16 rounded-full shadow-lg border-4 border-gym-bg transition-transform active:scale-95 ${
                isActive ? 'bg-gym-accent shadow-blue-500/20' : 'bg-gym-accent shadow-blue-900/20'
              }`
            }
          >
            <Dumbbell size={28} color="white" fill="white" />
          </NavLink>
        </div>

        <NavItem to="/analytics" icon={LineChart} label="Stats" />
      </nav>
    </div>
  );
}