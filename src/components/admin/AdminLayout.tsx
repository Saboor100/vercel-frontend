
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, FileText, LayoutDashboard, Home } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <Link to="/" className="flex items-center">
            <Shield className="h-6 w-6 text-purple-600 mr-2" />
            <span className="text-xl font-semibold">Admin Panel</span>
          </Link>
        </div>
        
        <nav className="p-4">
          <h2 className="text-xs uppercase tracking-wide text-gray-500 mb-3">Navigation</h2>
          <ul className="space-y-2">
            <li>
              <Link to="/admin" className="flex items-center p-2 text-gray-700 hover:bg-purple-100 rounded-md">
                <LayoutDashboard className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin?tab=users" className="flex items-center p-2 text-gray-700 hover:bg-purple-100 rounded-md">
                <Users className="mr-3 h-5 w-5" />
                Users
              </Link>
            </li>
            <li>
              <Link to="/admin?tab=documents" className="flex items-center p-2 text-gray-700 hover:bg-purple-100 rounded-md">
                <FileText className="mr-3 h-5 w-5" />
                Documents
              </Link>
            </li>
            <li className="mt-6">
              <Link to="/" className="flex items-center p-2 text-gray-700 hover:bg-purple-100 rounded-md">
                <Home className="mr-3 h-5 w-5" />
                Back to Site
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
