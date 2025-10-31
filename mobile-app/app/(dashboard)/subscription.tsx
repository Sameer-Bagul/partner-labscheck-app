import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSubscription, useInvoices } from '@/hooks/use-subscription';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Colors } from '@/constants/theme';

export default function Subscription() {
  const { data: subscription, isLoading: subLoading, refetch: refetchSub } = useSubscription();
  const { data: invoices, isLoading: invoicesLoading, refetch: refetchInvoices } = useInvoices();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchSub(), refetchInvoices()]);
    setRefreshing(false);
  };

  if (subLoading || invoicesLoading) {
    return <LoadingSpinner message="Loading subscription..." />;
  }

  if (!subscription) {
    return (
      <EmptyState
        icon="card-outline"
        title="No Active Subscription"
        message="Subscribe to a plan to access all features and grow your business"
        actionLabel="View Plans"
        onAction={() => {}}
      />
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-brand-500 pt-16 pb-6 px-6">
        <Text className="text-2xl font-bold text-white">Subscription</Text>
        <Text className="text-base text-white/90 mt-1">
          Manage your plan and billing
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6 mt-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Card variant="elevated" className="mb-6">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800 mb-1">
                {subscription.plan}
              </Text>
              <View className={`px-3 py-1 rounded-full self-start ${
                subscription.status === 'active' ? 'bg-green-100' :
                subscription.status === 'expired' ? 'bg-red-100' :
                'bg-gray-100'
              }`}>
                <Text className={`text-xs font-medium capitalize ${
                  subscription.status === 'active' ? 'text-green-700' :
                  subscription.status === 'expired' ? 'text-red-700' :
                  'text-gray-700'
                }`}>
                  {subscription.status}
                </Text>
              </View>
            </View>
            <Text className="text-2xl font-bold text-brand-500">
              {formatCurrency(subscription.amount)}
            </Text>
          </View>

          <View className="space-y-2 pt-4 border-t border-gray-100">
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-600">Start Date</Text>
              <Text className="text-sm font-medium text-gray-800">
                {formatDate(subscription.startDate)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-600">End Date</Text>
              <Text className="text-sm font-medium text-gray-800">
                {formatDate(subscription.endDate)}
              </Text>
            </View>
          </View>

          <TouchableOpacity className="mt-4 bg-brand-500 py-3 rounded-xl">
            <Text className="text-white text-center font-semibold">
              Manage Subscription
            </Text>
          </TouchableOpacity>
        </Card>

        <Text className="text-lg font-semibold text-gray-800 mb-4">
          Invoice History
        </Text>

        {invoices && invoices.length > 0 ? (
          invoices.map((invoice) => (
            <Card key={invoice.id} variant="elevated" className="mb-3">
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-800 mb-1">
                    Invoice #{invoice.invoiceNumber}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {formatDate(invoice.date)}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-lg font-bold text-brand-500 mb-1">
                    {formatCurrency(invoice.amount)}
                  </Text>
                  <View className={`px-3 py-1 rounded-full ${
                    invoice.status === 'paid' ? 'bg-green-100' :
                    invoice.status === 'pending' ? 'bg-yellow-100' :
                    'bg-red-100'
                  }`}>
                    <Text className={`text-xs font-medium capitalize ${
                      invoice.status === 'paid' ? 'text-green-700' :
                      invoice.status === 'pending' ? 'text-yellow-700' :
                      'text-red-700'
                    }`}>
                      {invoice.status}
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity className="flex-row items-center justify-center mt-3 pt-3 border-t border-gray-100">
                <Ionicons name="download-outline" size={18} color={Colors.brand[500]} />
                <Text className="text-brand-500 font-medium ml-2">
                  Download Invoice
                </Text>
              </TouchableOpacity>
            </Card>
          ))
        ) : (
          <Text className="text-gray-600 text-center py-8">
            No invoices available
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
