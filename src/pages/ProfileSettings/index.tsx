import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../common/components/Button';
import { Card } from '../../common/components/Card';
import { useToast } from '../../contexts/ToastContext';
import { Eye, EyeOff, Save, User, Mail, Shield, Building, Users, Calendar, Phone } from 'lucide-react';
import { Modal } from 'common/components/Modal';
import { Form, Formik, FormikHelpers, FormikValues } from 'formik';
import FormField from 'common/components/FormField';

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
        <h1 className="text-4xl font-bold text-text-primary mb-3">User Profile</h1>
        <p className="text-lg text-text-muted">Manage your account information and security settings</p>
      </div>

      {/* Main Content - Single Column Layout */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Overview Card */}
        <Card className="p-8">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Avatar and Basic Info */}
            <div className='flex items-start w-full'>
              <div className="flex  items-start space-y-4 w-full gap-5">
                <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  {user.avatar || 'U'}
                </div>
                <div>
                  <h2 className="text-2xl text-start font-bold text-text-primary">{user.name || 'Unknown User'}</h2>
                  <p className="text-lg text-start text-text-muted">{getRoleDisplayName(user.userType || 'execution-team')}</p>

                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsChangingPassword(true)}
                className="px-8 py-3 text-nowrap"
              >
                Change Password
              </Button>
            </div>


            {/* Profile Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full">
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
                <Phone size={24} className="text-primary" />
                <div className="text-left">
                  <p className="text-sm font-medium text-text-primary">Phone No.</p>
                  <p className="text-text-muted">{'+1234567890' || 'No Phone assigned'}</p>
                </div>
              </div>

              {/* Company */}
              {/* {user.company && (
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Building size={24} className="text-primary" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-text-primary">Company</p>
                    <p className="text-text-muted">{user.company.name}</p>
                  </div>
                </div>
              )} */}

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


            </div>
          </div>
        </Card>

        <Modal isOpen={isChangingPassword} onClose={() => setIsChangingPassword(false)} title={'Change Password'} >
          <Formik initialValues={undefined} onSubmit={function (values: FormikValues, formikHelpers: FormikHelpers<FormikValues>): void | Promise<any> {
            throw new Error('Function not implemented.');
          }}>
            <Form>
              <FormField label={'Current Password'} name={'currentPassword'} type={'password'}/>
              <FormField label={'New Password'} name={'currentPassword'} type={'password'} />
              <FormField label={'Confirm New Password'} name={'currentPassword'} type={'password'} />
              <div className='flex justify-end gap-2'>
                <Button variant='secondary' onClick={() => setIsChangingPassword(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsChangingPassword(false)}>
                  Change Password
                </Button>
              </div>
            </Form>
          </Formik>
        </Modal>
      </div>
    </div>
  );
};
