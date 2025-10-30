'use client';

import Link from 'next/link';
import { FaGoogle } from 'react-icons/fa';
import { useRegister } from '@/hooks/auth/use-auth';
import SignUpForm from '@/components/auth/signupform';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Heart, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { FormSignUpData } from '@/types/auth';

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirectUrl') || '/laboratory';
  const { mutate: registerUser, isPending } = useRegister();

  const handleRegister = (data: FormSignUpData) => {
    const newUser = {
      name: data.name,
      email: data.email,
      phoneNo: data.phone,
      password: data.password,
      authType: "credentials"
    };
    registerUser(newUser);
  };

  const handleGoogleLogin = async () => {
    try {
      await signIn('google', {
        callbackUrl: redirectUrl,
      });
    } catch (error) {
      console.error('SignUpPage: Google login error:', error);
    }
  };

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
              className='relative hidden lg:flex flex-col justify-center p-12 min-h-[700px] overflow-hidden'
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
                  <Heart className='w-5 h-5 text-pink-300 fill-pink-300' />
                  <span className='text-sm font-semibold text-white'>
                    Partner Registration
                  </span>
                </motion.div>

                <motion.h1
                  className='text-5xl font-extrabold text-white leading-tight drop-shadow-lg'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Join LabsCheck Partners
                </motion.h1>

                <motion.p
                  className='text-lg text-purple-100 leading-relaxed'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Create your partner account and start managing your laboratory on India&apos;s leading healthcare platform.
                </motion.p>

                {/* Features */}
                <div className='space-y-4 pt-4'>
                  {[
                    { icon: ShieldCheck, text: 'Verified & trusted platform' },
                    { icon: Zap, text: 'Easy booking management' },
                    { icon: Sparkles, text: 'Powerful analytics tools' },
                  ].map((feature, idx) => (
                    <motion.div
                      key={idx}
                      className='flex items-center gap-3'
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                    >
                      <div className='w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30'>
                        <feature.icon className='w-5 h-5 text-white' />
                      </div>
                      <span className='text-purple-100 font-medium'>{feature.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
              className='relative flex flex-col justify-center p-8 lg:p-12 min-h-[700px] bg-white'
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

              <div className='relative z-10 w-full max-w-md mx-auto space-y-6'>
                <motion.div
                  className='text-center space-y-3'
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h1 className='text-4xl font-bold text-gray-900 tracking-tight'>
                    Create Account
                  </h1>
                  <p className='text-gray-600 text-lg'>
                    Register as a partner lab
                  </p>
                </motion.div>

                {/* Sign Up Form */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <SignUpForm onRegister={handleRegister} isLoading={isPending} />
                </motion.div>

                {/* Divider */}
                <motion.div
                  className='relative flex items-center justify-center py-4'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-gray-300'></div>
                  </div>
                  <div className='relative bg-white px-4'>
                    <span className='text-sm text-gray-500 font-medium'>Or continue with</span>
                  </div>
                </motion.div>

                {/* Google Sign In Button */}
                <motion.button
                  onClick={handleGoogleLogin}
                  className='w-full flex items-center justify-center gap-3 px-6 py-3.5 border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaGoogle className='w-5 h-5 text-red-500' />
                  <span>Continue with Google</span>
                </motion.button>

                {/* Sign In Link */}
                <motion.p
                  className='text-center text-gray-600 pt-4'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Already have an account?{' '}
                  <Link href='/signin'>
                    <span className='text-purple-600 font-semibold hover:text-purple-700 transition-colors cursor-pointer'>
                      Sign In
                    </span>
                  </Link>
                </motion.p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
