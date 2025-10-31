import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLabs, useDeleteLab } from '@/hooks/use-labs';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useState } from 'react';
import { Colors } from '@/constants/theme';

export default function Labs() {
  const { data: labs, isLoading, refetch } = useLabs();
  const deleteMutation = useDeleteLab();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleDelete = (labId: string, labName: string) => {
    Alert.alert(
      'Delete Laboratory',
      `Are you sure you want to delete ${labName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(labId),
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading laboratories..." />;
  }

  if (!labs || labs.length === 0) {
    return (
      <EmptyState
        icon="flask-outline"
        title="No Laboratories"
        message="Add your first laboratory to get started with managing your business"
        actionLabel="Add Laboratory"
        onAction={() => {}}
      />
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-brand-500 pt-16 pb-6 px-6">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-white">My Laboratories</Text>
          <TouchableOpacity className="bg-white rounded-full p-2">
            <Ionicons name="add" size={24} color={Colors.brand[500]} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6 mt-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {labs.map((lab) => (
          <Card key={lab.id} variant="elevated" className="mb-4">
            <View className="flex-row justify-between items-start mb-3">
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800 mb-1">
                  {lab.name}
                </Text>
                <View className="flex-row items-center mb-1">
                  <Ionicons name="location-outline" size={14} color={Colors.gray[500]} />
                  <Text className="text-sm text-gray-600 ml-1" numberOfLines={2}>
                    {lab.address}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="call-outline" size={14} color={Colors.gray[500]} />
                  <Text className="text-sm text-gray-600 ml-1">
                    {lab.phoneNo}
                  </Text>
                </View>
              </View>
              <View className="flex-row gap-2">
                <TouchableOpacity className="bg-blue-50 p-2 rounded-lg">
                  <Ionicons name="create-outline" size={20} color={Colors.accent.blue} />
                </TouchableOpacity>
                <TouchableOpacity 
                  className="bg-red-50 p-2 rounded-lg"
                  onPress={() => handleDelete(lab.id, lab.name)}
                >
                  <Ionicons name="trash-outline" size={20} color={Colors.accent.red} />
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row justify-between pt-3 border-t border-gray-100">
              <View>
                <Text className="text-xs text-gray-500">Status</Text>
                <View className="flex-row items-center mt-1">
                  <View className={`w-2 h-2 rounded-full mr-1 ${
                    lab.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                  <Text className={`text-sm font-medium ${
                    lab.status === 'active' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {lab.status || 'Active'}
                  </Text>
                </View>
              </View>
              <View>
                <Text className="text-xs text-gray-500">Rating</Text>
                <View className="flex-row items-center mt-1">
                  <Ionicons name="star" size={14} color={Colors.accent.yellow} />
                  <Text className="text-sm font-medium text-gray-800 ml-1">
                    {lab.rating || 'N/A'}
                  </Text>
                </View>
              </View>
              <View>
                <Text className="text-xs text-gray-500">Reviews</Text>
                <Text className="text-sm font-medium text-gray-800 mt-1">
                  {lab.reviews || 0}
                </Text>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}
