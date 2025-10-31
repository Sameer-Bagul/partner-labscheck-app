import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTests, usePackages, useDeleteTest, useDeletePackage } from '@/hooks/use-tests';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency } from '@/lib/utils';
import { Colors } from '@/constants/theme';

export default function Offerings() {
  const { data: tests, isLoading: testsLoading, refetch: refetchTests } = useTests();
  const { data: packages, isLoading: packagesLoading, refetch: refetchPackages } = usePackages();
  const deleteTestMutation = useDeleteTest();
  const deletePackageMutation = useDeletePackage();
  const [activeTab, setActiveTab] = useState<'tests' | 'packages'>('tests');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchTests(), refetchPackages()]);
    setRefreshing(false);
  };

  const handleDeleteTest = (testId: number, testName: string) => {
    Alert.alert(
      'Delete Test',
      `Are you sure you want to delete ${testName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTestMutation.mutate(testId),
        },
      ]
    );
  };

  const handleDeletePackage = (packageId: number, packageName: string) => {
    Alert.alert(
      'Delete Package',
      `Are you sure you want to delete ${packageName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deletePackageMutation.mutate(packageId),
        },
      ]
    );
  };

  if (testsLoading || packagesLoading) {
    return <LoadingSpinner message="Loading offerings..." />;
  }

  const renderContent = () => {
    if (activeTab === 'tests') {
      if (!tests || tests.length === 0) {
        return (
          <EmptyState
            icon="flask-outline"
            title="No Tests"
            message="Add tests to offer them to your customers"
            actionLabel="Add Test"
            onAction={() => {}}
          />
        );
      }

      return tests.map((test) => (
        <Card key={test.id} variant="elevated" className="mb-4">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800 mb-2">
                {test.name}
              </Text>
              <View className="flex-row items-center mb-1">
                <Ionicons name="pricetag-outline" size={14} color={Colors.gray[500]} />
                <Text className="text-base font-bold text-brand-500 ml-1">
                  {formatCurrency(test.cost)}
                </Text>
              </View>
              {test.parameter && test.parameter.length > 0 && (
                <View className="flex-row items-center">
                  <Ionicons name="list-outline" size={14} color={Colors.gray[500]} />
                  <Text className="text-sm text-gray-600 ml-1">
                    {test.parameter.length} parameter{test.parameter.length !== 1 ? 's' : ''}
                  </Text>
                </View>
              )}
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity className="bg-blue-50 p-2 rounded-lg">
                <Ionicons name="create-outline" size={20} color={Colors.accent.blue} />
              </TouchableOpacity>
              <TouchableOpacity 
                className="bg-red-50 p-2 rounded-lg"
                onPress={() => handleDeleteTest(test.id, test.name)}
              >
                <Ionicons name="trash-outline" size={20} color={Colors.accent.red} />
              </TouchableOpacity>
            </View>
          </View>

          <View className="mt-3 pt-3 border-t border-gray-100">
            <View className={`px-3 py-1 rounded-full self-start ${
              test.approvalStatus === 'approved' ? 'bg-green-100' :
              test.approvalStatus === 'pending' ? 'bg-yellow-100' :
              'bg-red-100'
            }`}>
              <Text className={`text-xs font-medium ${
                test.approvalStatus === 'approved' ? 'text-green-700' :
                test.approvalStatus === 'pending' ? 'text-yellow-700' :
                'text-red-700'
              }`}>
                {test.approvalStatus || 'Pending'}
              </Text>
            </View>
          </View>
        </Card>
      ));
    } else {
      if (!packages || packages.length === 0) {
        return (
          <EmptyState
            icon="cube-outline"
            title="No Packages"
            message="Create packages by bundling multiple tests together"
            actionLabel="Add Package"
            onAction={() => {}}
          />
        );
      }

      return packages.map((pkg) => (
        <Card key={pkg.id} variant="elevated" className="mb-4">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800 mb-2">
                {pkg.name}
              </Text>
              <View className="flex-row items-center mb-1">
                <Ionicons name="pricetag-outline" size={14} color={Colors.gray[500]} />
                <Text className="text-base font-bold text-brand-500 ml-1">
                  {formatCurrency(pkg.cost)}
                </Text>
              </View>
              {pkg.inclusion_names && pkg.inclusion_names.length > 0 && (
                <View className="flex-row items-center">
                  <Ionicons name="list-outline" size={14} color={Colors.gray[500]} />
                  <Text className="text-sm text-gray-600 ml-1">
                    {pkg.inclusion_names.length} test{pkg.inclusion_names.length !== 1 ? 's' : ''} included
                  </Text>
                </View>
              )}
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity className="bg-blue-50 p-2 rounded-lg">
                <Ionicons name="create-outline" size={20} color={Colors.accent.blue} />
              </TouchableOpacity>
              <TouchableOpacity 
                className="bg-red-50 p-2 rounded-lg"
                onPress={() => handleDeletePackage(pkg.id, pkg.name)}
              >
                <Ionicons name="trash-outline" size={20} color={Colors.accent.red} />
              </TouchableOpacity>
            </View>
          </View>

          <View className="mt-3 pt-3 border-t border-gray-100">
            <View className={`px-3 py-1 rounded-full self-start ${
              pkg.approvalStatus === 'approved' ? 'bg-green-100' :
              pkg.approvalStatus === 'pending' ? 'bg-yellow-100' :
              'bg-red-100'
            }`}>
              <Text className={`text-xs font-medium ${
                pkg.approvalStatus === 'approved' ? 'text-green-700' :
                pkg.approvalStatus === 'pending' ? 'text-yellow-700' :
                'text-red-700'
              }`}>
                {pkg.approvalStatus || 'Pending'}
              </Text>
            </View>
          </View>
        </Card>
      ));
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-brand-500 pt-16 pb-6 px-6">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-white">Your Offerings</Text>
          <TouchableOpacity className="bg-white rounded-full p-2">
            <Ionicons name="add" size={24} color={Colors.brand[500]} />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row bg-white mx-6 mt-4 rounded-xl p-1 shadow-sm">
        <TouchableOpacity
          onPress={() => setActiveTab('tests')}
          className={`flex-1 py-2 rounded-lg ${
            activeTab === 'tests' ? 'bg-brand-500' : 'bg-transparent'
          }`}
        >
          <Text className={`text-center font-semibold ${
            activeTab === 'tests' ? 'text-white' : 'text-gray-600'
          }`}>
            Tests
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('packages')}
          className={`flex-1 py-2 rounded-lg ${
            activeTab === 'packages' ? 'bg-brand-500' : 'bg-transparent'
          }`}
        >
          <Text className={`text-center font-semibold ${
            activeTab === 'packages' ? 'text-white' : 'text-gray-600'
          }`}>
            Packages
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-6 mt-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderContent()}
      </ScrollView>
    </View>
  );
}
