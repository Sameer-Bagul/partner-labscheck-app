'use client';

import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: string;
  iconColor: string;
}

function MetricCard({ title, value, change, changeType, icon, iconColor }: MetricCardProps) {
  const changeIcon = changeType === 'increase' ? 'ri-arrow-up-line' : changeType === 'decrease' ? 'ri-arrow-down-line' : 'ri-subtract-line';
  const changeColor = changeType === 'increase' ? 'text-green-600' : changeType === 'decrease' ? 'text-red-600' : 'text-gray-600';

  return (
    <div className="glass-card hover-lift p-6 border border-purple-100/50">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${iconColor} shadow-sm`}>
          <i className={`${icon} w-6 h-6 flex items-center justify-center`}></i>
        </div>
        <div className={`flex items-center space-x-1 text-sm font-semibold ${changeColor} bg-white/80 px-3 py-1 rounded-full`}>
          <i className={`${changeIcon} w-4 h-4 flex items-center justify-center`}></i>
          <span>{change}</span>
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-1">{value}</p>
        <p className="text-sm text-gray-600 font-medium">{title}</p>
      </div>
    </div>
  );
}

export default function AnalyticsComponent() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'bookings' | 'tests' | 'patients'>('revenue');

  // Generate sample data for charts
  const revenueData = useMemo(() => [
    { name: 'Jan', revenue: 45000, bookings: 324, tests: 567, patients: 289 },
    { name: 'Feb', revenue: 52000, bookings: 389, tests: 634, patients: 342 },
    { name: 'Mar', revenue: 48000, bookings: 356, tests: 598, patients: 315 },
    { name: 'Apr', revenue: 61000, bookings: 445, tests: 723, patients: 398 },
    { name: 'May', revenue: 58000, bookings: 423, tests: 689, patients: 376 },
    { name: 'Jun', revenue: 67000, bookings: 489, tests: 798, patients: 434 },
    { name: 'Jul', revenue: 73000, bookings: 523, tests: 856, patients: 467 },
    { name: 'Aug', revenue: 69000, bookings: 498, tests: 812, patients: 445 },
    { name: 'Sep', revenue: 76000, bookings: 567, tests: 923, patients: 512 },
    { name: 'Oct', revenue: 82000, bookings: 634, tests: 1034, patients: 578 },
    { name: 'Nov', revenue: 79000, bookings: 598, tests: 976, patients: 534 },
    { name: 'Dec', revenue: 85000, bookings: 678, tests: 1123, patients: 623 }
  ], []);

  const testTypeData = [
    { name: 'Blood Tests', value: 35, count: 2890 },
    { name: 'Radiology', value: 25, count: 2067 },
    { name: 'Pathology', value: 20, count: 1653 },
    { name: 'Cardiology', value: 12, count: 992 },
    { name: 'Others', value: 8, count: 661 }
  ];

  const dailyBookingsData = [
    { time: '09:00', bookings: 12 },
    { time: '10:00', bookings: 25 },
    { time: '11:00', bookings: 34 },
    { time: '12:00', bookings: 28 },
    { time: '13:00', bookings: 18 },
    { time: '14:00', bookings: 31 },
    { time: '15:00', bookings: 42 },
    { time: '16:00', bookings: 38 },
    { time: '17:00', bookings: 29 },
    { time: '18:00', bookings: 23 }
  ];

  const regionData = [
    { region: 'North Zone', bookings: 1245, revenue: 185000 },
    { region: 'South Zone', bookings: 987, revenue: 142000 },
    { region: 'East Zone', bookings: 834, revenue: 123000 },
    { region: 'West Zone', bookings: 756, revenue: 98000 },
    { region: 'Central Zone', bookings: 623, revenue: 87000 }
  ];

  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  const metrics = [
    {
      title: 'Total Revenue',
      value: '₹8,45,000',
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: 'ri-money-rupee-circle-line',
      iconColor: 'bg-green-100 text-green-600'
    },
    {
      title: 'Total Bookings',
      value: '6,245',
      change: '+8.2%',
      changeType: 'increase' as const,
      icon: 'ri-calendar-check-line',
      iconColor: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Tests Completed',
      value: '9,856',
      change: '+15.1%',
      changeType: 'increase' as const,
      icon: 'ri-test-tube-line',
      iconColor: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Active Patients',
      value: '4,321',
      change: '+6.7%',
      changeType: 'increase' as const,
      icon: 'ri-user-heart-line',
      iconColor: 'bg-pink-100 text-pink-600'
    },
    {
      title: 'Home Collections',
      value: '2,156',
      change: '+23.4%',
      changeType: 'increase' as const,
      icon: 'ri-home-heart-line',
      iconColor: 'bg-orange-100 text-orange-600'
    },
    {
      title: 'Average Order Value',
      value: '₹1,352',
      change: '-2.1%',
      changeType: 'decrease' as const,
      icon: 'ri-price-tag-3-line',
      iconColor: 'bg-yellow-100 text-yellow-600'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Time Range Selector */}
      <div className="glass-card p-6 border border-purple-100/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
            Performance Overview
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              { key: '7d', label: '7 Days' },
              { key: '30d', label: '30 Days' },
              { key: '90d', label: '90 Days' },
              { key: '1y', label: '1 Year' }
            ].map((range) => (
              <button
                key={range.key}
                onClick={() => setTimeRange(range.key as any)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  timeRange === range.key
                    ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend Chart */}
        <div className="glass-card p-6 border border-purple-100/50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h3 className="text-lg font-bold text-gray-900">Revenue Trend</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'revenue', label: 'Revenue' },
                { key: 'bookings', label: 'Bookings' },
                { key: 'tests', label: 'Tests' },
                { key: 'patients', label: 'Patients' }
              ].map((metric) => (
                <button
                  key={metric.key}
                  onClick={() => setSelectedMetric(metric.key as any)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    selectedMetric === metric.key
                      ? 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 border border-purple-200'
                      : 'bg-white text-gray-600 hover:bg-purple-50 border border-gray-200'
                  }`}
                >
                  {metric.label}
                </button>
              ))}
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorMetric)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Test Distribution */}
        <div className="glass-card p-6 border border-purple-100/50">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Test Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={testTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {testTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [`${value}% (${props.payload.count} tests)`, name]}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value, entry) => `${value} (${entry.payload.value}%)`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hourly Bookings */}
        <div className="glass-card p-6 border border-purple-100/50">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Daily Booking Pattern</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyBookingsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="bookings" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Performance */}
        <div className="glass-card p-6 border border-purple-100/50">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Regional Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="region" type="category" stroke="#6b7280" width={80} />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'bookings' ? `${value} bookings` : `₹${value.toLocaleString()}`,
                    name === 'bookings' ? 'Bookings' : 'Revenue'
                  ]}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="bookings" fill="#06b6d4" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Performance Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performing Tests */}
        <div className="glass-card p-6 border border-purple-100/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Top Performing Tests</h3>
            <button className="text-purple-600 hover:text-purple-700 text-sm font-semibold hover:underline cursor-pointer">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Complete Blood Count', bookings: 1245, revenue: '₹1,87,000', growth: '+15%' },
              { name: 'Lipid Profile', bookings: 987, revenue: '₹1,42,000', growth: '+12%' },
              { name: 'Thyroid Function', bookings: 834, revenue: '₹1,23,000', growth: '+8%' },
              { name: 'Diabetes Panel', bookings: 756, revenue: '₹98,000', growth: '+22%' },
              { name: 'Liver Function', bookings: 623, revenue: '₹87,000', growth: '+5%' }
            ].map((test, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50/50 to-violet-50/50 rounded-xl border border-purple-100 hover:shadow-md transition-shadow">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{test.name}</p>
                  <p className="text-sm text-gray-600">{test.bookings} bookings</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{test.revenue}</p>
                  <p className="text-sm text-green-600">{test.growth}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-6 border border-purple-100/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
            <button className="text-purple-600 hover:text-purple-700 text-sm font-semibold hover:underline cursor-pointer">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {[
              { 
                icon: 'ri-user-add-line', 
                iconColor: 'bg-green-100 text-green-600',
                action: 'New patient registered', 
                details: 'John Smith - Complete Health Checkup',
                time: '2 minutes ago'
              },
              { 
                icon: 'ri-calendar-check-line', 
                iconColor: 'bg-blue-100 text-blue-600',
                action: 'Booking confirmed', 
                details: 'Sarah Johnson - Diabetes Panel',
                time: '15 minutes ago'
              },
              { 
                icon: 'ri-money-rupee-circle-line', 
                iconColor: 'bg-yellow-100 text-yellow-600',
                action: 'Payment received', 
                details: '₹2,450 - Multiple tests package',
                time: '1 hour ago'
              },
              { 
                icon: 'ri-test-tube-line', 
                iconColor: 'bg-purple-100 text-purple-600',
                action: 'Test completed', 
                details: 'Blood work for Patient #1234',
                time: '2 hours ago'
              },
              { 
                icon: 'ri-home-heart-line', 
                iconColor: 'bg-pink-100 text-pink-600',
                action: 'Home collection scheduled', 
                details: 'Mike Davis - Lipid Profile',
                time: '3 hours ago'
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 rounded-xl bg-gradient-to-r from-purple-50/30 to-violet-50/30 border border-purple-100/50 hover:shadow-md transition-all">
                <div className={`p-2.5 rounded-xl ${activity.iconColor} shadow-sm`}>
                  <i className={`${activity.icon} w-5 h-5 flex items-center justify-center`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600 truncate mt-0.5">{activity.details}</p>
                  <p className="text-xs text-gray-500 mt-1.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export and Actions */}
      <div className="glass-card p-8 border border-purple-100/50">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Export Data</h3>
            <p className="text-gray-600 text-sm mt-1">Download analytics reports for further analysis</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="px-5 py-2.5 bg-white text-gray-700 rounded-xl hover:bg-purple-50 transition-all border border-purple-200 whitespace-nowrap cursor-pointer font-semibold shadow-sm hover:shadow-md">
              <i className="ri-download-line w-4 h-4 inline mr-2"></i>
              Export PDF
            </button>
            <button className="px-5 py-2.5 bg-white text-gray-700 rounded-xl hover:bg-purple-50 transition-all border border-purple-200 whitespace-nowrap cursor-pointer font-semibold shadow-sm hover:shadow-md">
              <i className="ri-file-excel-line w-4 h-4 inline mr-2"></i>
              Export Excel
            </button>
            <button className="btn-primary px-5 py-2.5 whitespace-nowrap cursor-pointer shadow-md hover:shadow-lg">
              <i className="ri-refresh-line w-4 h-4 inline mr-2"></i>
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}