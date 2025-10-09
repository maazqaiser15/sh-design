import React, { useState, useEffect } from 'react';
import { Form, Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../../common/components/Button';
import { Logo } from '../../common/components/Logo';
import { Formik } from 'formik';
import FormField from 'common/components/FormField';
import * as Yup from 'yup';
// import { FormField } from 'common/components/FormField';

/**
 * Forgot Password page component
 * Handles email submission and confirmation link sending
 */
const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().required("Email is required").email("Please enter a valid email address"),
});

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  const initialValues:any = {
    email: "",
  };

  // Timer countdown for resend functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      setIsSubmitted(true);
      setResendTimer(120); // 2 minutes
      setCanResend(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setError('');
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setResendTimer(120); // Reset timer
      setCanResend(false);
    } catch (err) {
      setError('Failed to resend email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Logo size="lg" textSize="lg" className="text-blue-600 mx-auto" />
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-card p-8">
          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Forgot Password?
                </h1>
                <p className="text-gray-600">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              {/* Form */}
              <Formik initialValues={initialValues} validationSchema={forgotPasswordSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, errors, touched }) => (
                  <Form className="space-y-4">
                    <FormField label={"Email Address"} isLeftIcon={<Mail size={20} className="text-gray-400"/>} name={"email"} type={"email"} placeholder={"Enter your email address"} className={""}/>
                    {/* Submit Button */}
                    <Button type="submit" variant="primary" size="md" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Reset Link"}
                    </Button>
                  </Form>
                )}
              </Formik>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <CheckCircle size={24} className="text-green-600" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Check Your Email
                </h1>

                <p className="text-gray-600 mb-6">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>

                {/* Resend Section */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-3">
                    Didn't receive the email?
                  </p>

                  {resendTimer > 0 ? (
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <Clock size={16} />
                      <span>Resend available in {formatTime(resendTimer)}</span>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleResend}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Sending...' : 'Resend Email'}
                    </Button>
                  )}
                </div>

                {/* Error Message for Resend */}
                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to Login
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            © Copyright 2024 Safe Haven Defense
          </p>
        </div>
      </div>
    </div>
  );
};
