'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {  signInSchema } from '@/validations/auth';
import { Spinner } from '@/components/ui/spinner';
import { motion } from 'framer-motion';
import { FormSignInData } from '@/types/auth';

interface SignInFormProps {
  onLogin: (data: FormSignInData) => void;
  isLoading: boolean;
}

export default function SignInForm({ onLogin, isLoading }: SignInFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSignInData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = (data: FormSignInData) => {
    onLogin(data);
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      method='post'
      className='space-y-5'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <input
          type='email'
          placeholder='Email'
          {...register('email')}
          className='input-field'
        />
        {errors.email && (
          <p className='text-red-500 text-sm mt-1 ml-4'>{errors.email.message}</p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <input
          type='password'
          placeholder='Password'
          {...register('password')}
          className='input-field'
        />
        {errors.password && (
          <p className='text-red-500 text-sm mt-1 ml-4'>{errors.password.message}</p>
        )}
      </motion.div>

      <motion.button
        type='submit'
        className='btn-primary w-full'
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? <Spinner size='medium' className='text-white' /> : 'Sign In'}
      </motion.button>
    </motion.form>
  );
}
