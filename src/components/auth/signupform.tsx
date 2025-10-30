'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema } from '@/validations/auth';
import { Spinner } from '@/components/ui/spinner';
import { motion } from 'framer-motion';
import { FormSignUpData } from '@/types/auth';

interface SignUpFormProps {
  onRegister: (data: FormSignUpData) => void;
  isLoading: boolean;
}

export default function SignUpForm({ onRegister, isLoading }: SignUpFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSignUpData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = (data: FormSignUpData) => {
    onRegister(data);
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-5 w-full'
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Name */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <input
          type='text'
          placeholder='Full Name'
          {...register('name')}
          className='input-field'
        />
        {errors.name && (
          <p className='text-red-500 text-sm mt-1 ml-4'>{errors.name.message}</p>
        )}
      </motion.div>

      {/* Phone */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <input
          type='tel'
          placeholder='Phone Number'
          {...register('phone')}
          className='input-field'
        />
        {errors.phone && (
          <p className='text-red-500 text-sm mt-1 ml-4'>{errors.phone.message}</p>
        )}
      </motion.div>

      {/* Email */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
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

      {/* Password */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
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

      {/* Confirm Password */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <input
          type='password'
          placeholder='Confirm Password'
          {...register('confirmPassword')}
          className='input-field'
        />
        {errors.confirmPassword && (
          <p className='text-red-500 text-sm mt-1 ml-4'>
            {errors.confirmPassword.message}
          </p>
        )}
      </motion.div>

      {/* Submit Button */}
      <motion.button
        type='submit'
        className='btn-primary w-full'
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.3 }}
      >
        {isLoading ? (
          <Spinner size={'medium'} className='text-white' />
        ) : (
          'Create Account'
        )}
      </motion.button>
    </motion.form>
  );
}