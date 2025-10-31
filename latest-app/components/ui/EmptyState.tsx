import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 justify-center items-center px-6 bg-gray-50">
      <Ionicons name={icon} size={64} color="#E0AAFF" />
      <Text className="text-xl font-bold text-gray-800 mt-4 text-center">
        {title}
      </Text>
      <Text className="text-base text-gray-600 mt-2 text-center">
        {message}
      </Text>
      {actionLabel && onAction && (
        <Button onPress={onAction} className="mt-6">
          {actionLabel}
        </Button>
      )}
    </View>
  );
}
