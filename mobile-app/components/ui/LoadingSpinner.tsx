import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { Colors } from '@/constants/theme';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message }: LoadingSpinnerProps) {
  return (
    <View className="flex-1 justify-center items-center bg-gray-50">
      <ActivityIndicator size="large" color={Colors.brand[500]} />
      {message && (
        <Text className="text-gray-600 mt-4 text-base">
          {message}
        </Text>
      )}
    </View>
  );
}
