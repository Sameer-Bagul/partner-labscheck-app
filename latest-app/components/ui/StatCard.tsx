import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Card';

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  value: string | number;
}

export function StatCard({ icon, iconColor, label, value }: StatCardProps) {
  return (
    <Card variant="elevated" className="flex-1 items-center justify-center py-6">
      <Ionicons name={icon} size={32} color={iconColor} />
      <Text className="text-3xl font-bold text-gray-800 mt-3">
        {value}
      </Text>
      <Text className="text-sm text-gray-600 mt-1">
        {label}
      </Text>
    </Card>
  );
}
