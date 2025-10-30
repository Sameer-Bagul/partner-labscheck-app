
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface Booking {
  id: number;
  patientName: string;
  patientPhone: string;
  testPackage: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  homeCollection: boolean;
  address?: string;
  totalAmount: number;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  bookedOn: string;
}

const ITEMS_PER_PAGE = 20;

export default function BookingComponent() {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');
  const [selectedBookings, setSelectedBookings] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate larger dataset
  const generateBookingsData = (count: number): Booking[] => {
    const statuses: ('confirmed' | 'pending' | 'completed' | 'cancelled')[] = ['confirmed', 'pending', 'completed', 'cancelled'];
    const paymentStatuses: ('paid' | 'pending' | 'refunded')[] = ['paid', 'pending', 'refunded'];
    const packages = [
      'Complete Health Checkup', 'Diabetes Panel', 'Lipid Profile', 'Thyroid Function Test', 
      'Full Body Checkup', 'Liver Function Test', 'Kidney Function Test', 'Heart Health Package',
      'Women\'s Health Checkup', 'Senior Citizen Package', 'Executive Health Package'
    ];

    const bookings: Booking[] = [];

    for (let i = 1; i <= count; i++) {
      bookings.push({
        id: i,
        patientName: `Patient ${i}`,
        patientPhone: `+1 234-567-${(8900 + (i % 100)).toString().padStart(4, '0')}`,
        testPackage: packages[i % packages.length],
        appointmentDate: new Date(Date.now() + (i % 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        appointmentTime: `${9 + (i % 8)}:${(i % 2) * 30}0`.padStart(5, '0'),
        status: statuses[i % statuses.length],
        homeCollection: i % 3 === 0,
        address: i % 3 === 0 ? `${123 + i} Street ${i}, City, State ${10001 + (i % 100)}` : undefined,
        totalAmount: 500 + (i % 50) * 100,
        paymentStatus: paymentStatuses[i % paymentStatuses.length],
        bookedOn: new Date(Date.now() - (i % 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }

    return bookings;
  };

  // Generate 1500 sample bookings to test performance
  const bookingsData = useMemo(() => generateBookingsData(1500), []);

  const filteredBookings = useMemo(() => {
    return bookingsData.filter(booking => {
      const matchesTab = activeTab === 'all' || booking.status === activeTab;
      const matchesSearch = searchTerm === '' || 
        booking.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.testPackage.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.patientPhone.includes(searchTerm);
      return matchesTab && matchesSearch;
    });
  }, [bookingsData, activeTab, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-50 border-green-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'completed': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'refunded': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const tabs = [
    { id: 'all', label: 'All Bookings', count: bookingsData.length },
    { id: 'pending', label: 'Pending', count: bookingsData.filter(b => b.status === 'pending').length },
    { id: 'confirmed', label: 'Confirmed', count: bookingsData.filter(b => b.status === 'confirmed').length },
    { id: 'completed', label: 'Completed', count: bookingsData.filter(b => b.status === 'completed').length }
  ];

  const handleBookingSelect = (bookingId: number) => {
    setSelectedBookings(prev => 
      prev.includes(bookingId) 
        ? prev.filter(id => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const handleSelectAll = () => {
    if (selectedBookings.length === currentBookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(currentBookings.map(b => b.id));
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <i className="ri-search-line w-4 h-4 flex items-center justify-center absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search bookings by name, phone, or test..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredBookings.length)} of {filteredBookings.length} results
            </div>

            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap cursor-pointer">
              <i className="ri-add-line w-4 h-4 flex items-center justify-center mr-2"></i>
              New Booking
            </button>

            {selectedBookings.length > 0 && (
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer">
                <i className="ri-mail-line w-4 h-4 flex items-center justify-center mr-2"></i>
                Send Reminders ({selectedBookings.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as any)}
              className={`flex-shrink-0 px-6 py-4 text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer relative ${
                activeTab === tab.id
                  ? 'text-purple-600 bg-purple-50 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-25'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span>{tab.label}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activeTab === tab.id ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count.toLocaleString()}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="p-6">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <i className="ri-calendar-line w-12 h-12 flex items-center justify-center text-gray-300 mx-auto mb-4 text-5xl"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? 'Try adjusting your search criteria' : 'Get started by creating your first booking'}
              </p>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap cursor-pointer">
                <i className="ri-add-line w-4 h-4 flex items-center justify-center mr-2"></i>
                Create New Booking
              </button>
            </div>
          ) : (
            <>
              {/* Bulk Actions */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBookings.length === currentBookings.length && currentBookings.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
                    />
                    <span className="text-sm text-gray-600">Select all on this page</span>
                  </label>
                </div>

                <div className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading bookings...</p>
                  </div>
                ) : (
                  currentBookings.map((booking) => (
                    <div key={booking.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-purple-200 transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <input
                            type="checkbox"
                            checked={selectedBookings.includes(booking.id)}
                            onChange={() => handleBookingSelect(booking.id)}
                            className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h3 className="font-semibold text-gray-900 text-lg">#{booking.id.toString().padStart(4, '0')}</h3>
                                <p className="text-gray-600 text-sm">Booked on {new Date(booking.bookedOn).toLocaleDateString()}</p>
                              </div>

                              <div className="flex items-center space-x-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                                  {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Patient</label>
                                <p className="text-gray-900 font-medium">{booking.patientName}</p>
                                <p className="text-gray-600 text-sm">{booking.patientPhone}</p>
                              </div>

                              <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Test Package</label>
                                <p className="text-gray-900 font-medium">{booking.testPackage}</p>
                                <p className="text-gray-600 text-sm">₹{booking.totalAmount.toLocaleString()}</p>
                              </div>

                              <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Appointment</label>
                                <p className="text-gray-900 font-medium">
                                  {new Date(booking.appointmentDate).toLocaleDateString()}
                                </p>
                                <p className="text-gray-600 text-sm">{booking.appointmentTime}</p>
                              </div>

                              {booking.homeCollection && booking.address && (
                                <div className="lg:col-span-2">
                                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Collection Address</label>
                                  <p className="text-gray-900">{booking.address}</p>
                                  <div className="flex items-center space-x-1 text-green-600 text-sm mt-1">
                                    <i className="ri-home-line w-4 h-4 flex items-center justify-center"></i>
                                    <span>Home Collection</span>
                                  </div>
                                </div>
                              )}

                              {!booking.homeCollection && (
                                <div>
                                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Collection</label>
                                  <div className="flex items-center space-x-1 text-blue-600">
                                    <i className="ri-building-line w-4 h-4 flex items-center justify-center"></i>
                                    <span>Lab Visit</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer">
                            <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                          </button>

                          <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
                            <i className="ri-eye-line w-4 h-4 flex items-center justify-center"></i>
                          </button>

                          <div className="relative">
                            <button className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                              <i className="ri-more-2-line w-4 h-4 flex items-center justify-center"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(endIndex, filteredBookings.length)}</span> of{' '}
                        <span className="font-medium">{filteredBookings.length.toLocaleString()}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <i className="ri-arrow-left-s-line w-5 h-5 flex items-center justify-center"></i>
                        </button>

                        {generatePageNumbers().map((page, index) => (
                          page === '...' ? (
                            <span key={`ellipsis-${index}`} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                              ...
                            </span>
                          ) : (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page as number)}
                              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 cursor-pointer ${
                                currentPage === page
                                  ? 'z-10 bg-purple-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600'
                                  : 'text-gray-900'
                              }`}
                            >
                              {page}
                            </button>
                          )
                        ))}

                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <i className="ri-arrow-right-s-line w-5 h-5 flex items-center justify-center"></i>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{bookingsData.length.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <i className="ri-calendar-line w-6 h-6 flex items-center justify-center text-purple-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
              <p className="text-2xl font-bold text-gray-900">47</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <i className="ri-time-line w-6 h-6 flex items-center justify-center text-green-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue This Month</p>
              <p className="text-2xl font-bold text-gray-900">₹{(bookingsData.reduce((sum, b) => sum + b.totalAmount, 0)).toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <i className="ri-money-rupee-circle-line w-6 h-6 flex items-center justify-center text-blue-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Home Collections</p>
              <p className="text-2xl font-bold text-gray-900">{bookingsData.filter(b => b.homeCollection).length.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <i className="ri-home-line w-6 h-6 flex items-center justify-center text-yellow-600"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
