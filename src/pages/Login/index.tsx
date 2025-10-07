import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, User, Settings, Users, Zap, Building2, Mail, Key } from 'lucide-react';
import { Button } from '../../common/components/Button';
import { Logo } from '../../common/components/Logo';
import { useAuth, DemoPersona } from '../../contexts/AuthContext';
import { LoginType, UserType } from '../../types/auth';
import { FormField } from 'common/components/FormField';

/**
 * Login page component with SafeHavenDefense branding
 * Features email/password login and demo persona selection
 */
export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, demoLogin, isLoading, getAvailableLoginMethods } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');
  const [detectedUserType, setDetectedUserType] = useState<UserType | null>(null);
  const [availableLoginMethods, setAvailableLoginMethods] = useState<LoginType[]>([]);
  const [loginTypeInfo, setLoginTypeInfo] = useState<{ type: LoginType; description: string } | null>(null);

  // Detect user type and login methods when email changes
  useEffect(() => {
    if (email && email.includes('@')) {
      const methods = getAvailableLoginMethods(email);
      setAvailableLoginMethods(methods);

      // Determine user type from email patterns
      const localPart = email.split('@')[0].toLowerCase();
      const domain = email.split('@')[1]?.toLowerCase();

      let userType: UserType = 'execution-team';
      let loginType: LoginType = 'email';
      let description = 'Standard email login';

      // Check email patterns for 3 user types
      if (localPart.startsWith('admin@') || localPart === 'admin' ||
        localPart.startsWith('vp@') || localPart === 'vp' ||
        localPart.startsWith('vpops@') || localPart === 'vpops' ||
        localPart.startsWith('ceo@') || localPart === 'ceo' ||
        localPart.startsWith('cfo@') || localPart === 'cfo' ||
        localPart.startsWith('cto@') || localPart === 'cto' ||
        localPart.startsWith('director@') || localPart === 'director') {
        userType = 'executive';
        loginType = 'company-based';
        description = 'Executive account with full system access and management capabilities';
      } else if (localPart.startsWith('pm@') || localPart === 'pm' ||
        localPart.startsWith('coordinator@') || localPart === 'coordinator' ||
        localPart.startsWith('manager@') || localPart === 'manager' ||
        localPart.startsWith('supervisor@') || localPart === 'supervisor' ||
        localPart.startsWith('lead@') || localPart === 'lead') {
        userType = 'project-coordinator';
        loginType = 'company-based';
        description = 'Project Coordinator with project management and team coordination access';
      } else if (localPart.startsWith('leadsupervisor@') || localPart === 'leadsupervisor' ||
        localPart.startsWith('lead-supervisor@') || localPart === 'lead-supervisor' ||
        localPart.startsWith('lead_supervisor@') || localPart === 'lead_supervisor' ||
        localPart.startsWith('ls@') || localPart === 'ls') {
        userType = 'lead-supervisor';
        loginType = 'company-based';
        description = 'Lead Supervisor with project, team, and document management access';
      } else if (localPart.startsWith('crew@') || localPart === 'crew' ||
        localPart.startsWith('team@') || localPart === 'team' ||
        localPart.startsWith('field@') || localPart === 'field' ||
        localPart.startsWith('ground@') || localPart === 'ground' ||
        localPart.startsWith('ops@') || localPart === 'ops' ||
        localPart.startsWith('logistics@') || localPart === 'logistics' ||
        localPart.startsWith('production@') || localPart === 'production' ||
        localPart.startsWith('quality@') || localPart === 'quality' ||
        localPart.startsWith('safety@') || localPart === 'safety' ||
        localPart.startsWith('finance@') || localPart === 'finance' ||
        localPart.startsWith('hr@') || localPart === 'hr' ||
        localPart.startsWith('it@') || localPart === 'it') {
        userType = 'execution-team';
        loginType = 'company-based';
        description = 'Execution Team member with operational access (no team/trailer access)';
      }

      setDetectedUserType(userType);
      setLoginTypeInfo({ type: loginType, description });
    } else {
      setDetectedUserType(null);
      setAvailableLoginMethods([]);
      setLoginTypeInfo(null);
    }
  }, [email, getAvailableLoginMethods]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(''); // Clear any previous errors
  };

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
      id: 'executive' as DemoPersona,
      title: 'Executive Account',
      description: 'Full system access with management capabilities',
      icon: Settings,
      color: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100',
    },
    {
      id: 'project-coordinator' as DemoPersona,
      title: 'Project Coordinator',
      description: 'Project management and team coordination access',
      icon: User,
      color: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
    },
    {
      id: 'lead-supervisor' as DemoPersona,
      title: 'Lead Supervisor',
      description: 'Lead supervision with project and document management access only',
      icon: Zap,
      color: 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100',
    },
    {
      id: 'execution-team' as DemoPersona,
      title: 'Execution Team',
      description: 'Operational access for task execution (no team/trailer access)',
      icon: Users,
      color: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Branding - Centered Top */}
        <div className="text-center">
          <div className="mx-auto mb-4">
            <Logo size="xl" textSize="lg" className="justify-center" />
          </div>
          <p className="text-body text-text-secondary mt-2">
            Project Management System
          </p>
        </div>

        {/* Login Container - Max Width 400px */}
        <div className="bg-white rounded-lg shadow-card p-8 max-w-sm mx-auto w-full">
          <form onSubmit={handleEmailLogin} className="space-y-3">
            <FormField
              label="Email Address"
              name="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              type="email"
            />

            {/* User Type Detection Display */}
            {detectedUserType && loginTypeInfo && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex-shrink-0">
                    {loginTypeInfo.type === "company-based" ? (
                      <Building2 size={16} className="text-blue-600" />
                    ) : loginTypeInfo.type === "domain-based" ? (
                      <Mail size={16} className="text-blue-600" />
                    ) : (
                      <Key size={16} className="text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-900">
                      {detectedUserType
                        .replace("-", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}{" "}
                      Account
                    </p>
                    <p className="text-xs text-blue-700">
                      {loginTypeInfo.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Password Field */}
            <div className="pt-3 relative">
              <FormField
                label="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter your password'
                type={showPassword ? "text" : "password"}
                rightIcon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              />
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
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-text-secondary"
                >
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
                {isLoggingIn ? "Signing in..." : "Log in"}
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
                const demoSection = document.getElementById("demo-personas");
                if (demoSection) {
                  demoSection.style.display =
                    demoSection.style.display === "none" ? "block" : "none";
                }
              }}
            >
              Continue with Demo Login
            </Button>
          </div>

          {/* Demo Personas Selection */}
          <div id="demo-personas" style={{ display: "none" }} className="mt-4 space-y-2">
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
