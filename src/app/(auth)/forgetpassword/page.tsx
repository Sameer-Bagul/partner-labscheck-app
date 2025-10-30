'use client';

import Link from 'next/link';
import ForgetPasswordForm from '@/components/auth/forgetpasswordform';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Key, ArrowLeft } from 'lucide-react';

export default function ForgetPassword() {
  return (
    <div className='relative w-full gradient-bg-primary section-spacing'>
      {/* Animated Background Blobs - Fixed positioning */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none -z-10'>
        <div className='absolute top-0 -left-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob' />
        <div className='absolute top-0 -right-40 w-96 h-96 bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000' />
        <div className='absolute -bottom-40 left-20 w-96 h-96 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000' />
      </div>

      <div className='relative z-10 container-wrapper flex items-center justify-center'>
        {/* Bento Container */}
        <motion.div
          className='w-full max-w-6xl'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className='grid lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100/50 backdrop-blur-xl'>
            {/* Left Side - Text Content with Background Image */}
            <motion.div
              className='relative hidden lg:flex flex-col justify-center p-12 min-h-[600px] overflow-hidden'
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Background Image with Enhanced Gradient */}
              <div className='absolute inset-0'>
                <div 
                  className='absolute inset-0 bg-cover bg-center'
                  style={{ backgroundImage: "url('/login.webp')" }}
                />
                {/* Multi-layer gradient overlay */}
                <div className='absolute inset-0 bg-gradient-to-br from-purple-900/95 via-violet-800/90 to-fuchsia-800/95' />
                <div className='absolute inset-0 bg-gradient-to-tr from-indigo-900/60 via-purple-700/40 to-pink-700/50' />
                <div className='absolute inset-0 bg-gradient-to-bl from-transparent via-purple-600/20 to-violet-900/60' />
                <div className='absolute inset-0 backdrop-blur-sm' />
              </div>

              {/* Content */}
              <div className='relative z-10 space-y-6 text-white'>
                <motion.div
                  className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg'
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <ShieldCheck className='w-5 h-5 text-green-300' />
                  <span className='text-sm font-semibold text-white'>
                    Account Recovery
                  </span>
                </motion.div>

                <motion.h1
                  className='text-5xl font-extrabold text-white leading-tight drop-shadow-lg'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Recover Your Account
                </motion.h1>

                <motion.p
                  className='text-lg text-purple-100 leading-relaxed'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Don&apos;t worry! We&apos;ll help you reset your password and get you back to managing your lab in no time.
                </motion.p>

                {/* Recovery Steps */}
                <div className='space-y-4 pt-4'>
                  {[
                    { icon: Mail, text: 'Enter your email address' },
                    { icon: Key, text: 'Receive recovery link' },
                    { icon: ShieldCheck, text: 'Set new secure password' },
                  ].map((step, idx) => (
                    <motion.div
                      key={idx}
                      className='flex items-center gap-3'
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                    >
                      <div className='w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30'>
                        <step.icon className='w-5 h-5 text-white' />
                      </div>
                      <span className='text-purple-100 font-medium'>{step.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
              className='relative flex flex-col justify-center p-8 lg:p-12 min-h-[600px] bg-white'
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Decorative gradient blobs in background */}
              <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                <div className='absolute -top-24 -right-24 w-64 h-64 bg-purple-200/40 rounded-full blur-3xl' />
                <div className='absolute top-1/2 -left-16 w-48 h-48 bg-violet-200/30 rounded-full blur-2xl' />
                <div className='absolute -bottom-16 right-1/3 w-56 h-56 bg-fuchsia-200/30 rounded-full blur-3xl' />
              </div>

              {/* Dot pattern overlay */}
              <div 
                className='absolute inset-0 opacity-[0.03]'
                style={{
                  backgroundImage: `radial-gradient(circle, #7c3aed 1px, transparent 1px)`,
                  backgroundSize: '24px 24px'
                }}
              />

              <div className='relative z-10 w-full max-w-md mx-auto space-y-8'>
                {/* Back Button */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link href='/signin'>
                    <button className='flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors font-medium'>
                      <ArrowLeft className='w-4 h-4' />
                      <span>Back to Sign In</span>
                    </button>
                  </Link>
                </motion.div>

                <motion.div
                  className='text-center space-y-3'
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h1 className='text-4xl font-bold text-gray-900 tracking-tight'>
                    Reset Password
                  </h1>
                  <p className='text-gray-600 text-lg'>
                    Enter your email to receive a recovery link
                  </p>
                </motion.div>

                {/* Forget Password Form */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <ForgetPasswordForm />
                </motion.div>

                {/* Remember Password Link */}
                <motion.div
                  className='text-center pt-6 border-t border-gray-200'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <p className='text-gray-600'>
                    Remember your password?{' '}
                    <Link href='/signin'>
                      <span className='text-purple-600 font-semibold hover:text-purple-700 transition-colors cursor-pointer'>
                        Sign In
                      </span>
                    </Link>
                  </p>
                </motion.div>

                {/* Help Text */}
                <motion.div
                  className='bg-purple-50 border border-purple-100 rounded-xl p-4 text-center'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <p className='text-sm text-gray-700'>
                    <span className='font-semibold text-purple-700'>Need help?</span>
                    <br />
                    Contact our support team if you&apos;re having trouble accessing your account.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
