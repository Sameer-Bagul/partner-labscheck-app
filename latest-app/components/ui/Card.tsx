import React from 'react';
import { View, ViewProps } from 'react-native';
import { cn } from '@/lib/utils';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
}

export function Card({ children, variant = 'default', className, ...props }: CardProps) {
  const variantStyles = {
    default: 'bg-white',
    outlined: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-lg shadow-gray-200',
  };

  return (
    <View
      className={cn(
        'rounded-xl p-4',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}
