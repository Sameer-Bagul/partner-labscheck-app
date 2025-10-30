'use client';

import { useState } from 'react';
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";

interface Pincode {
  id: string;
  code: string;
  area: string;
  district: string;
  state: string;
}

interface FranchiseComponentProps {
  className?: string;
}

export default function FranchiseComponent({ className = '' }: FranchiseComponentProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPincode, setNewPincode] = useState({ code: '', area: '', district: '', state: '' });
  const [pincodeArray, setPincodeArray] = useState<{ code: string }>({ code: "" });
  const [pincodeList, setPincodeList] = useState<string[]>([]);


  const [franchiseData, setFranchiseData] = useState({
    name: 'Metro Business Solutions',
    logo: 'https://readdy.ai/api/search-image?query=modern%20business%20franchise%20logo%20with%20clean%20geometric%20design%20corporate%20branding%20professional%20minimal%20background%20blue%20and%20white%20colors&width=200&height=200&seq=franchise-logo-001&orientation=squarish',
    corporateEmail: 'contact@metrobusiness.com',
    address: '123 Business Park, Sector 15, Gurgaon, Haryana 122001'
  });

  const [pincodes, setPincodes] = useState<Pincode[]>([
    { id: '1', code: '110001', area: 'Connaught Place', district: 'New Delhi', state: 'Delhi' },
    { id: '2', code: '110002', area: 'Darya Ganj', district: 'New Delhi', state: 'Delhi' },
    { id: '3', code: '110003', area: 'Civil Lines', district: 'New Delhi', state: 'Delhi' },
    { id: '4', code: '122001', area: 'Sector 15', district: 'Gurgaon', state: 'Haryana' },
    { id: '5', code: '122002', area: 'Sector 14', district: 'Gurgaon', state: 'Haryana' },
    { id: '6', code: '201301', area: 'Sector 62', district: 'Noida', state: 'Uttar Pradesh' },
    { id: '7', code: '201302', area: 'Sector 63', district: 'Noida', state: 'Uttar Pradesh' },
    { id: '8', code: '400001', area: 'Fort', district: 'Mumbai', state: 'Maharashtra' },
    { id: '9', code: '400002', area: 'Colaba', district: 'Mumbai', state: 'Maharashtra' },
    { id: '10', code: '560001', area: 'Chickpet', district: 'Bangalore', state: 'Karnataka' }
  ]);

  const [editingData, setEditingData] = useState<Pincode>({ id: '', code: '', area: '', district: '', state: '' });

  const handleEdit = (pincode: Pincode) => {
    setEditingId(pincode.id);
    setEditingData({ ...pincode });
  };

  const handleSave = (id: string) => {
    setPincodes(pincodes.map(p => p.id === id ? editingData : p));
    setEditingId(null);
    setEditingData({ id: '', code: '', area: '', district: '', state: '' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingData({ id: '', code: '', area: '', district: '', state: '' });
  };

  const handleDelete = (id: string) => {
    setPincodes(pincodes.filter(p => p.id !== id));
  };

  const handleAdd = () => {
    if (newPincode.code && newPincode.area && newPincode.district && newPincode.state) {
      const newId = (Math.max(...pincodes.map(p => parseInt(p.id))) + 1).toString();
      setPincodes([...pincodes, { id: newId, ...newPincode }]);
      setNewPincode({ code: '', area: '', district: '', state: '' });
      setShowAddForm(false);
    }
  };

  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Franchise Information Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-white shadow-lg">
              <img
                src={franchiseData.logo}
                alt="Franchise Logo"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{franchiseData.name}</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex text-gray-600">
                  <i className="ri-mail-line w-5 h-5 flex items-center justify-center mr-3 text-purple-600"></i>
                  <span>{franchiseData.corporateEmail}</span>
                </div>
                <div className="flex items-start text-gray-600">
                  <i className="ri-map-pin-line w-5 h-5 flex items-center justify-center mr-3 text-purple-600 mt-0.5"></i>
                  <span>{franchiseData.address}</span>
                </div>
              </div>
            </div>
            {/* <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap cursor-pointer">
              <i className="ri-edit-line w-4 h-4 flex items-center justify-center inline mr-2"></i>
              Edit Details
            </button> */}
          </div>
        </div>

        {/* Serviceable Pincodes Section */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Serviceable Pincodes</h2>
              <p className="text-sm text-gray-600">Manage areas where services are available</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-purple-900 transition-colors whitespace-nowrap cursor-pointer"
            >

              Add Pincode
            </button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Add New Pincode</h3>

              {/* Input + Add button */}
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="text"
                  placeholder="Enter 6-digit pincode"
                  value={newPincode.code}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,6}$/.test(value)) {
                      setNewPincode({ ...newPincode, code: value });
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={() => {
                    const trimmedCode = newPincode.code.trim();
                    if (trimmedCode !== "" && !pincodeList.includes(trimmedCode)) {
                      setPincodeList((prev) => [...prev, trimmedCode]);
                    }
                    setPincodeArray({ code: "" }); // clear input
                  }}
                  className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-purple-700 text-sm"
                  title="Add Pincode"
                >
                  +
                </button>
              </div>

              {/* Pincode badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {pincodeList.map((pin, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                  >
                    {pin}
                    <button
                      onClick={() =>
                        setPincodeList((prev) => prev.filter((_, i) => i !== index))
                      }
                      className="ml-1 text-purple-500 hover:text-purple-700"
                      title="Remove"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end space-x-2 mt-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log("Pincodes to add:", pincodeList);
                    // Future API call will go here
                  }}
                  className="px-4 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm"
                >
                  Add Pincode
                </button>
              </div>
            </div>
          )}


          {/* Pincodes Table */}
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pincode</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pincodes.map((pincode) => (
                  <tr key={pincode.id} className="hover:bg-gray-50 transition-colors">
                    {editingId === pincode.id ? (
                      <>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={editingData.code}
                            onChange={(e) => setEditingData({ ...editingData, code: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={editingData.area}
                            onChange={(e) => setEditingData({ ...editingData, area: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={editingData.district}
                            onChange={(e) => setEditingData({ ...editingData, district: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={editingData.state}
                            onChange={(e) => setEditingData({ ...editingData, state: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center space-x-1">
                            <button
                              onClick={() => handleSave(pincode.id)}
                              className="w-7 h-7 flex items-center justify-center text-green-600 hover:bg-green-50 rounded cursor-pointer"
                              title="Save"
                            >
                              <i className="ri-check-line w-4 h-4 flex items-center justify-center"></i>
                            </button>
                            <button
                              onClick={handleCancel}
                              className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded cursor-pointer"
                              title="Cancel"
                            >
                              <i className="ri-close-line w-4 h-4 flex items-center justify-center"></i>
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{pincode.code}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{pincode.area}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{pincode.district}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{pincode.state}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center space-x-1">
                          
                            <button
                              onClick={() => handleDelete(pincode.id)}
                              className="w-7 h-7 flex items-center justify-center text-red-600 hover:bg-red-50 rounded cursor-pointer"
                              title="Delete"
                            >
                              <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"><MdDeleteOutline /></i>
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Stats Footer */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>Total serviceable areas: {pincodes.length}</span>
            <span>Last updated: Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}