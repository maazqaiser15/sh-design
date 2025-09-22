import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Shield, User, Settings, Users, Zap } from 'lucide-react';
import { Button } from '../../common/components/Button';
import { Logo } from '../../common/components/Logo';
import { useAuth, DemoPersona } from '../../contexts/AuthContext';

/**
 * Login page component with SafeHavenDefense branding
 * Features email/password login and demo persona selection
 */
export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, demoLogin, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    try {
      await login(email, password, rememberMe);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleDemoLogin = (persona: DemoPersona) => {
    demoLogin(persona);
    navigate('/');
  };

  const demoPersonas = [
    {
      id: 'admin' as DemoPersona,
      title: 'Admin Demo Account',
      description: 'Full access to all modules',
      icon: Settings,
      color: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100',
    },
    {
      id: 'project-manager' as DemoPersona,
      title: 'Project Manager Demo',
      description: 'Access to projects, teams, logistics',
      icon: User,
      color: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
    },
    {
      id: 'crew-member' as DemoPersona,
      title: 'Crew Member Demo',
      description: 'Limited view (assigned tasks, schedules)',
      icon: Users,
      color: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Branding - Centered Top */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-h1 font-semibold text-text-primary">
            SafeHavenDefense
          </h1>
          <p className="text-body text-text-secondary mt-2">
            Project Management System
          </p>
        </div>

        {/* Login Container - Max Width 400px */}
        <div className="bg-white rounded-lg shadow-card p-8 max-w-sm mx-auto w-full">
          <form onSubmit={handleEmailLogin} className="space-y-3">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field - 12px spacing between fields */}
            <div className="pt-3">
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-secondary"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-text-secondary">
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Login Button */}
            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                disabled={isLoggingIn || isLoading}
              >
                {isLoggingIn ? 'Signing in...' : 'Log in'}
              </Button>
            </div>
          </form>

          {/* Divider - 16px spacing between login and demo */}
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-text-muted">Or</span>
              </div>
            </div>
          </div>

          {/* Demo Login Button */}
          <div className="mt-4">
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="w-full"
              title="Try SafeHavenDefense with sample data — no signup required."
              onClick={() => {
                // Show demo persona selection
                const demoSection = document.getElementById('demo-personas');
                if (demoSection) {
                  demoSection.style.display = demoSection.style.display === 'none' ? 'block' : 'none';
                }
              }}
            >
              Continue with Demo Login
            </Button>
          </div>

          {/* Demo Personas Selection */}
          <div id="demo-personas" style={{ display: 'none' }} className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-text-primary text-center mb-3">
              Choose Demo Account
            </h4>
            {demoPersonas.map((persona) => {
              const Icon = persona.icon;
              return (
                <button
                  key={persona.id}
                  onClick={() => handleDemoLogin(persona.id)}
                  className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${persona.color}`}
                  title="Try SafeHavenDefense with sample data — no signup required."
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-white rounded-md shadow-sm">
                      <Icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {persona.title}
                      </p>
                      <p className="text-xs text-text-muted truncate">
                        {persona.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-caption text-text-muted">
            © 2024 SafeHavenDefense. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};
