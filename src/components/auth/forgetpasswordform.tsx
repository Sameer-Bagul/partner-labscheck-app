
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  EmailOnlySchema,
  ResetPasswordSchema,
} from '@/validations/auth';

import { Spinner } from '@/components/ui/spinner';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { useForgetPassword, useResetPassword, useVerifyOTP } from '@/hooks/auth/use-auth';
import { useRouter } from "next/navigation";
import { EmailOnlyData, ResetPasswordData, ResetPasswordRequest } from '@/types/auth';

 type Step = 'email' | 'otp' | 'reset';

export default function ForgetPasswordForm() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

 const router = useRouter()

  const emailForm = useForm<EmailOnlyData>({
    resolver: zodResolver(EmailOnlySchema),
  });

  const resetForm = useForm<ResetPasswordData>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const { mutate: sendOTP, isPending: loadingEmail } = useForgetPassword();
  const { mutate: verifyOTP, isPending: loadingOTP, isSuccess } = useVerifyOTP();
  const { mutate: resetPassword, isPending: loadingReset } = useResetPassword();

  const handleEmailSubmit = (data: EmailOnlyData) => {
    setEmail(data.email);
    sendOTP(data, {
      onSuccess: () => setStep('otp'),
    });
  };

  const handleVerifyOTP = () => {
    if (otp.length !== 6) return;
    verifyOTP({ email, otp }, {
      onSuccess: () => setStep('reset'),
    });
  };

  const handleResetSubmit = (data: ResetPasswordData) => {
    const payload: ResetPasswordRequest = { ...data, email, otp };
    resetPassword(payload, {
      onSuccess: () => {
        router.push('signin')
      },
    });
  };

  const handleBack = () => {
    if (step === 'otp') setStep('email');
    else if (step === 'reset') setStep('otp');
  };

  const animation = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
    transition: { duration: 0.3 },
  };

  return (
    <div className="w-full relative space-y-6 min-h-[300px]">
      <AnimatePresence mode="wait">
        {step === 'email' && (
          <motion.form
            key="email"
            {...animation}
            onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
            className="space-y-5 absolute w-full"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="e.g. johndoe@gmail.com"
                {...emailForm.register('email')}
                className="input-field"
              />
              {emailForm.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1 ml-4">
                  {emailForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loadingEmail}
              className="btn-primary w-full"
            >
              {loadingEmail ? <Spinner size="medium" className="text-white" /> : 'Send OTP'}
            </button>
          </motion.form>
        )}

        {step === 'otp' && (
          <motion.div key="otp" {...animation} className="space-y-6 absolute w-full">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Enter OTP sent to your email
              </label>
              <div className="flex items-center gap-3">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    {[...Array(6)].map((_, index) => (
                      <InputOTPSlot key={index} index={index} variant='stylish'/>
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                <div>
                  {loadingOTP ? (
                    <Spinner size="medium" className="text-purple-600" />
                  ) : isSuccess ? (
                    <IoMdCheckmarkCircleOutline className="w-7 h-7 text-green-600" />
                  ) : (
                    <button 
                      type="button"
                      onClick={handleVerifyOTP} 
                      className="text-purple-600 font-semibold hover:text-purple-700 transition-colors px-3 py-2 rounded-lg hover:bg-purple-50"
                    >
                      Verify
                    </button>
                  )}
                </div>
              </div>
            </div>
            <button 
              type="button"
              onClick={handleBack} 
              className="text-sm text-gray-600 hover:text-purple-600 transition-colors font-medium"
            >
              ← Back to email
            </button>
          </motion.div>
        )}



        {step === 'reset' && (
          <motion.form
            key="reset"
            {...animation}
            onSubmit={resetForm.handleSubmit(handleResetSubmit)}
            className="space-y-5 absolute w-full"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                {...resetForm.register('new_password')}
                className="input-field"
              />
              {resetForm.formState.errors.new_password && (
                <p className="text-red-500 text-sm mt-1 ml-4">
                  {resetForm.formState.errors.new_password.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                {...resetForm.register('confirm_password')}
                className="input-field"
              />
              {resetForm.formState.errors.confirm_password && (
                <p className="text-red-500 text-sm mt-1 ml-4">
                  {resetForm.formState.errors.confirm_password.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loadingReset}
              className="btn-primary w-full"
            >
              {loadingReset ? <Spinner size="medium" className="text-white" /> : 'Reset Password'}
            </button>
            <button 
              type="button"
              onClick={handleBack} 
              className="text-sm text-gray-600 hover:text-purple-600 transition-colors font-medium"
            >
              ← Back to OTP
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
