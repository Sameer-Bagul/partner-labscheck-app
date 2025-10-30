'use client';

import Link from 'next/link';
import { FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa';
import { useRegister } from '@/hooks/auth/use-auth';
import SignUpForm from '@/components/auth/signupform';
import { motion } from 'framer-motion';
export default function SignUpPage() {
  const { mutate: registerUser, isPending } = useRegister();

  const handleRegister = (data) => {
    const newUser = {
      id: 0,
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      is_active: false,
      role: 'partner',
    };
    registerUser(newUser);
  };

  return (
    <motion.div
      className='w-full h-full flex items-center justify-center'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className='rounded-lg w-full h-full flex justify-between items-center flex-col p-8 max-w-md'
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.h2
          className='text-center text-2xl font-bold text-indigo-500 mb-6'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          PARTNER REGISTRATION PAGE
        </motion.h2>

        {/* Social Login Buttons */}
        <motion.div
          className='w-full flex justify-center gap-4'
          initial='hidden'
          animate='visible'
          variants={{
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {[FaGoogle, FaFacebookF, FaApple].map((Icon, index) => {
            const iconColor =
              index === 0
                ? 'text-red-500'
                : index === 1
                ? 'text-blue-600'
                : 'text-gray-900';
            return (
              <motion.button
                key={index}
                className='flex items-center justify-center gap-3 border border-primary p-3 rounded-full text-gray-600 hover:bg-gray-100 transition'
                variants={{
                  hidden: { opacity: 0, y: -10 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </motion.button>
            );
          })}
        </motion.div>

        <motion.hr
          className='my-2 w-full border-t-2 border-primary rounded-full'
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.6, delay: 0.4 }}
        />

        {/* Sign Up Form Component */}
        <motion.div
          className='w-full'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <SignUpForm onRegister={handleRegister} isLoading={isPending} />
        </motion.div>

        <motion.p
          className='text-center mt-2 text-indigo-500 font-semibold cursor-pointer hover:underline'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          FORGOT PASSWORD?
        </motion.p>

        <motion.hr
          className='mt-2 w-full border-t border-gray-300'
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.9 }}
        />

        <motion.p
          className='text-center text-gray-600'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          ALREADY HAVE AN ACCOUNT?{' '}
          <Link href='/signin' passHref>
            <span className='text-indigo-600 font-semibold cursor-pointer hover:underline'>
              Sign In
            </span>
          </Link>
        </motion.p>
      </motion.div>
    </motion.div>
  
  );
}
