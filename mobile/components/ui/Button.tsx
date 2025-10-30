import { TouchableOpacity, Text, ActivityIndicator, type TouchableOpacityProps } from 'react-native';
import { cn } from '@/lib/utils';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'default',
  size = 'default',
  isLoading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    default: 'bg-brand-500 shadow-md',
    outline: 'border-2 border-brand-500 bg-transparent',
    ghost: 'bg-transparent',
  };

  const sizes = {
    default: 'px-6 py-3',
    sm: 'px-4 py-2',
    lg: 'px-8 py-4',
  };

  const textVariants = {
    default: 'text-white',
    outline: 'text-brand-500',
    ghost: 'text-brand-500',
  };

  return (
    <TouchableOpacity
      className={cn(
        'rounded-xl items-center justify-center flex-row',
        variants[variant],
        sizes[size],
        disabled && 'opacity-50',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'default' ? 'white' : '#7B2CBF'} />
      ) : (
        <Text className={cn('font-semibold text-base', textVariants[variant])}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}
