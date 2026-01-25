import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NavItem({ icon, text, path = "#", onClick }) {
  return (
    <li>
      <NavLink
        to={path}
        onClick={onClick}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
            isActive
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-white/70 hover:bg-gray-700/50 hover:text-white'
          }`
        }
      >
        {/* Render icon if provided, otherwise fallback to logo or dot */}
        {icon ? (
          icon
        ) : (
           <img src="/logo2.svg" alt="" className="h-5 w-5" onError={(e) => e.target.style.display='none'} />
        )}
        <span className="font-medium">{text}</span>
      </NavLink>
    </li>
  );
}