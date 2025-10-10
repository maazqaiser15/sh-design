import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Form } from 'react-router-dom';
import { Eye, EyeOff, User, Settings, Users, Zap, Building2, Mail, Key } from 'lucide-react';
import { Button } from '../../common/components/Button';
import { Logo } from '../../common/components/Logo';
import { useAuth, DemoPersona } from '../../contexts/AuthContext';
import { LoginType, UserType } from '../../types/auth';
import { Formik } from 'formik';
import FormField from 'common/components/FormField';
import * as Yup from 'yup';
import { Card } from 'common/components/Card';
// import FormField from 'common/components/FormField';

/**
 * Login page component with SafeHavenDefense branding
 * Features email/password login and demo persona selection
 */
export const Login: React.FC = () => {
  const initialValues = {
    email: "",
    password: "",
  };


  const loginSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Please enter a valid email address"),
  });
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
  const [showDemoOptions, setShowDemoOptions] = useState(false);

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

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    console.log('click')
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 backgroung-image-container">
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
        <Card className="p-8 max-w-md mx-auto w-full">
          <Formik initialValues={initialValues} validationSchema={loginSchema} onSubmit={handleSubmit}>
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-3">
                <FormField label={"Email Address"} name={"email"} type={"email"} placeholder={"Enter your email"} className={""} />
                <FormField label={"Password"} name={"password"} type={showPassword ? 'text' : 'password'} placeholder={"Enter your Password"} className={""}
                  isRightIcon={<button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0  right-0 pr-3 flex items-center text-text-muted hover:text-text-secondary">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>} />
                <div className="flex items-center justify-end pt-3">
                  <Link to="/forgot_password" className="text-sm text-primary hover:text-primary/80 font-medium">
                    Forgot password?
                  </Link>
                </div>

                {/* Error Message */}
                {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}

                {/* Login Button */}
                <div className="pt-4">
                  <Button type="submit" variant="primary" size="md" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Signing in..." : "Log in"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>

          {/* Demo Login Section */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="secondary"
                size="md"
                className="w-full"
                onClick={() => setShowDemoOptions(!showDemoOptions)}
              >
                Continue with Demo Login
              </Button>
              
              {showDemoOptions && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-gray-600 text-center mb-3">
                    Try SafeHavenDefense with sample data — no signup required
                  </p>
                  {demoPersonas.map((persona) => (
                    <button
                      key={persona.id}
                      onClick={() => handleDemoLogin(persona.id)}
                      className={`w-full p-3 rounded-lg border text-left transition-colors ${persona.color}`}
                    >
                      <div className="flex items-center space-x-3">
                        <persona.icon size={20} />
                        <div>
                          <div className="font-medium text-sm">{persona.title}</div>
                          <div className="text-xs opacity-75">{persona.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>

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
