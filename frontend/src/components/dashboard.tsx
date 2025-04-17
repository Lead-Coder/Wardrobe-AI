import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { email, setEmail } = useUser();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navigation = [
    { name: "Dashboard", href: "/", icon: "📊" },
    { name: "Recommendations", href: "/recommendation", icon: "✨" },
    { name: "Try On", href: "/try-on", icon: "👤" },
    { name: "Upload", href: "/upload", icon: "📤" },     
    { name: "My Wardrobe", href: "/wardrobe", icon: "👕" },
    { name: "Chatbot", href: "/chatbot", icon: " 🤖" },
  ];

  const isActive = (path: string) => location.pathname === path;
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setEmail(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r bg-white shadow-sm">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <h1 className="text-xl font-bold text-purple-600">MyStylistAI</h1>
            </div>
            <nav className="mt-5 flex-1 space-y-1 px-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"}`}>
                  <span className="mr-3 text-xl">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t p-4">
                <div className="flex items-center">
                <Link
                  to="/"
                  onClick={() => handleLogout()}
                  className="hover:text-purple-600">
                    <p>{email} </p>
                    <p>Logout</p>
                </Link>
                </div>
              </div>
            </div>
          </div>

      {/* Mobile menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-purple-600">StyleAI</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-gray-600 hover:bg-purple-50 hover:text-purple-600">
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
        {isMobileMenuOpen && (
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.href)
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}>
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="md:pl-64 pt-16 md:pt-0">
        <main className="py-6 px-4 sm:px-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}
