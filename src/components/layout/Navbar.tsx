import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { Leaf, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/browse', label: 'Browse Sessions' },
    ...(isAuthenticated ? [
      { href: '/create', label: 'Create Session' },
      { href: '/my-sessions', label: 'My Sessions' }
    ] : [])
  ];

  return (
    <>
      <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50 wellness-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="wellness-gradient p-2 rounded-xl group-hover:scale-105 wellness-transition">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-foreground">Wellness Session</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium wellness-transition hover:text-primary ${
                    location.pathname === link.href
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground">
                    Welcome, {user?.name}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={logout}
                    className="hover-lift wellness-transition"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleAuthClick('login')}
                    className="hover-lift wellness-transition"
                  >
                    Login
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => handleAuthClick('signup')}
                    className="wellness-gradient hover-lift wellness-transition border-0"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border animate-fade-in">
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-sm font-medium wellness-transition hover:text-primary px-2 py-1 ${
                      location.pathname === link.href
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                
                {isAuthenticated ? (
                  <div className="pt-3 border-t border-border">
                    <p className="text-sm text-muted-foreground px-2 mb-2">
                      Welcome, {user?.name}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 pt-3 border-t border-border">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        handleAuthClick('login');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-start"
                    >
                      Login
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => {
                        handleAuthClick('signup');
                        setIsMobileMenuOpen(false);
                      }}
                      className="wellness-gradient w-full border-0"
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
};