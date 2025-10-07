import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../common/components/Button';
import { Card } from '../../common/components/Card';
import { useToast } from '../../contexts/ToastContext';
import { Eye, EyeOff, Save, User, Mail, Shield, Building, Users, Calendar } from 'lucide-react';

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * User Profile Settings Page
 * Allows users to view their profile information and change their password
 */
export const ProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = (field: keyof PasswordChangeData, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    return errors;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!passwordData.currentPassword) {
      showToast('Current password is required', 'error');
      return;
    }
    
    if (!passwordData.newPassword) {
      showToast('New password is required', 'error');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    
    const passwordErrors = validatePassword(passwordData.newPassword);
    if (passwordErrors.length > 0) {
      showToast(passwordErrors[0], 'error');
      return;
    }
    
    if (passwordData.currentPassword === passwordData.newPassword) {
      showToast('New password must be different from current password', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would make an API call to change the password
      showToast('Password changed successfully', 'success');
      
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsChangingPassword(false);
      
    } catch (error) {
      showToast('Failed to change password. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Never';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getRoleDisplayName = (userType: string) => {
    const roleMap: Record<string, string> = {
      'executive': 'Executive',
      'project-coordinator': 'Project Coordinator',
      'execution-team': 'Execution Team',
      'lead-supervisor': 'Lead Supervisor'
    };
    return roleMap[userType] || userType;
  };

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-text-muted">Please log in to view your profile settings.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-text-primary mb-3">Profile Settings</h1>
        <p className="text-lg text-text-muted">Manage your account information and security settings</p>
      </div>

      {/* Main Content - Single Column Layout */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Overview Card */}
        <Card className="p-8">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold">
                {user.avatar || 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text-primary">{user.name || 'Unknown User'}</h2>
                <p className="text-lg text-text-muted">{getRoleDisplayName(user.userType || 'execution-team')}</p>
                {user.isDemo && (
                  <span className="inline-block mt-2 px-3 py-1 bg-secondary-teal/10 text-secondary-teal text-sm rounded-full">
                    Demo Account
                  </span>
                )}
              </div>
            </div>

            {/* Profile Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {/* Email */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Mail size={24} className="text-primary" />
                <div className="text-left">
                  <p className="text-sm font-medium text-text-primary">Email Address</p>
                  <p className="text-text-muted">{user.email || 'No email provided'}</p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <User size={24} className="text-primary" />
                <div className="text-left">
                  <p className="text-sm font-medium text-text-primary">Role</p>
                  <p className="text-text-muted">{user.role?.name || 'No role assigned'}</p>
                </div>
              </div>

              {/* Company */}
              {user.company && (
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Building size={24} className="text-primary" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-text-primary">Company</p>
                    <p className="text-text-muted">{user.company.name}</p>
                  </div>
                </div>
              )}

              {/* Department */}
              {user.department && (
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Users size={24} className="text-primary" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-text-primary">Department</p>
                    <p className="text-text-muted">{user.department.name}</p>
                  </div>
                </div>
              )}

              {/* Last Login */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Calendar size={24} className="text-primary" />
                <div className="text-left">
                  <p className="text-sm font-medium text-text-primary">Last Login</p>
                  <p className="text-text-muted">{formatDate(user.lastLogin)}</p>
                </div>
              </div>

              {/* Account Status */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Shield size={24} className="text-primary" />
                <div className="text-left">
                  <p className="text-sm font-medium text-text-primary">Account Status</p>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                    <p className="text-text-muted">{user.isActive ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Password Change Card */}
        <Card className="p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-text-primary mb-2">Change Password</h3>
            <p className="text-text-muted">Update your password to keep your account secure</p>
          </div>

          {isChangingPassword ? (
            <form onSubmit={handlePasswordSubmit} className="max-w-md mx-auto space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-12 text-lg"
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary"
                  >
                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-12 text-lg"
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-sm text-text-muted mt-2">
                  Password must be at least 8 characters with uppercase, lowercase, number, and special character
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-12 text-lg"
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 text-lg"
                >
                  <Save size={20} />
                  <span>{isLoading ? 'Changing...' : 'Change Password'}</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                  disabled={isLoading}
                  className="flex-1 py-3 text-lg"
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield size={40} className="text-primary" />
              </div>
              <h4 className="text-xl font-semibold text-text-primary mb-3">Password Security</h4>
              <p className="text-text-muted mb-6 max-w-md mx-auto">
                Your password is secure. Click "Change Password" below to update it with a new, strong password.
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={() => setIsChangingPassword(true)}
                className="px-8 py-3"
              >
                Change Password
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
